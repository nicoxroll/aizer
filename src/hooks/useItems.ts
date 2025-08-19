import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Item } from '../types';

export function useItems(homeId: string | null) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (homeId) {
      fetchItems();
    } else {
      setItems([]);
    }
  }, [homeId]);

  const fetchItems = async () => {
    if (!homeId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          rooms(name)
        `)
        .eq('home_id', homeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const itemsWithLocation = data?.map(item => ({
        ...item,
        location: item.rooms?.name || 'Sin ubicación',
      })) || [];

      setItems(itemsWithLocation);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: {
    name: string;
    category: string;
    description?: string;
    room_id: string;
  }) => {
    if (!homeId) return { error: 'No hay casa seleccionada' };

    try {
      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            ...itemData,
            home_id: homeId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchItems();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating item:', error);
      return { data: null, error };
    }
  };

  const updateItem = async (itemId: string, updates: Partial<Item>) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      await fetchItems();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating item:', error);
      return { data: null, error };
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await fetchItems();
      return { error: null };
    } catch (error) {
      console.error('Error deleting item:', error);
      return { error };
    }
  };

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
}