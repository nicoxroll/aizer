import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Home } from '../types';

export function useHomes() {
  const { user } = useAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHomes();
    } else {
      setHomes([]);
      setSelectedHome(null);
      setLoading(false);
    }
  }, [user]);

  const fetchHomes = async () => {
    try {
      setLoading(true);
      
      // Obtener casas donde el usuario es propietario o miembro
      const { data: homesData, error } = await supabase
        .from('homes')
        .select(`
          *,
          home_members!inner(
            user_id,
            role
          )
        `)
        .eq('home_members.user_id', user?.id);

      if (error) throw error;

      // Obtener información de miembros para cada casa
      const homesWithMembers = await Promise.all(
        (homesData || []).map(async (home) => {
          const { data: members, error: membersError } = await supabase
            .from('home_members')
            .select('user_id, role')
            .eq('home_id', home.id);

          if (membersError) throw membersError;

          return {
            ...home,
            memberCount: members?.length || 0,
            isOwner: home.owner_id === user?.id,
          };
        })
      );

      setHomes(homesWithMembers);
    } catch (error) {
      console.error('Error fetching homes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createHome = async (name: string, description: string = '') => {
    if (!user) return { error: 'Usuario no autenticado' };

    try {
      // Primero asegurar que el usuario existe en la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // Usuario no existe, crearlo
        const { error: insertUserError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email || '',
            },
          ]);

        if (insertUserError) {
          console.error('Error creating user:', insertUserError);
          return { data: null, error: insertUserError };
        }
      }

      const { data, error } = await supabase
        .from('homes')
        .insert([
          {
            name,
            description,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Refrescar la lista de casas
      await fetchHomes();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating home:', error);
      return { data: null, error };
    }
  };

  const inviteMember = async (homeId: string, email: string) => {
    if (!user) return { error: 'Usuario no autenticado' };

    try {
      const { data, error } = await supabase
        .from('invitations')
        .insert([
          {
            home_id: homeId,
            email,
            invited_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error inviting member:', error);
      return { data: null, error };
    }
  };

  const selectHome = (home: Home | null) => {
    setSelectedHome(home);
  };

  return {
    homes,
    selectedHome,
    loading,
    selectHome,
    createHome,
    inviteMember,
    refetch: fetchHomes,
  };
}