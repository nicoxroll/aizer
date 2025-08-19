import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package } from 'lucide-react';
import { Room } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: { name: string; category: string; description?: string; homeId: string; roomId: string }) => void;
  rooms: Room[];
  homeId: string;
}

const categories = [
  'Electrodomésticos',
  'Muebles',
  'Textiles',
  'Decoración',
  'Cocina',
  'Baño',
  'Limpieza',
  'Herramientas',
  'Electrónicos',
  'Libros',
  'Ropa',
  'Otros'
];

export default function AddItemModal({ isOpen, onClose, onAddItem, rooms, homeId }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Otros');
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && roomId) {
      onAddItem({
        name: name.trim(),
        category,
        description: description.trim(),
        homeId,
        roomId,
      });
      setName('');
      setCategory('Otros');
      setDescription('');
      setRoomId('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setCategory('Otros');
    setDescription('');
    setRoomId('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-zinc-900 border border-zinc-700 w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5" />
                <h2 className="text-lg font-thin">Nuevo Objeto</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-thin text-zinc-300 mb-2">
                  Nombre del objeto
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Cafetera, Sofá, Almohada..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white font-thin"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-thin text-zinc-300 mb-2">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white font-thin"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-thin text-zinc-300 mb-2">
                  Habitación
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white font-thin"
                  required
                >
                  <option value="">Seleccionar habitación</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-thin text-zinc-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción adicional del objeto..."
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white font-thin resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-zinc-700 hover:border-zinc-600 transition-colors font-thin"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !roomId}
                  className="flex-1 px-4 py-2 bg-white text-black hover:bg-zinc-200 transition-colors font-thin disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar Objeto
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}