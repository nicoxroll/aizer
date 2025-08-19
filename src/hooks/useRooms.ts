import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Room } from '../types';

export function useRooms(homeId: string | null) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (homeId) {
      fetchRooms();
    } else {
      setRooms([]);
    }
  }, [homeId]);

  const fetchRooms = async () => {
    if (!homeId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          items(count)
        `)
        .eq('home_id', homeId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const roomsWithCount = data?.map(room => ({
        ...room,
        itemCount: room.items?.[0]?.count || 0,
      })) || [];

      setRooms(roomsWithCount);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (name: string) => {
    if (!homeId) return { error: 'No hay casa seleccionada' };

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([
          {
            name,
            home_id: homeId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchRooms();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating room:', error);
      return { data: null, error };
    }
  };

  return {
    rooms,
    loading,
    createRoom,
    refetch: fetchRooms,
  };
}