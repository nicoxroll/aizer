import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home } from 'lucide-react';

interface CreateHomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateHome: (name: string, description: string) => Promise<any>;
}

export default function CreateHomeModal({ isOpen, onClose, onCreateHome }: CreateHomeModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await onCreateHome(name.trim(), description.trim());
      if (error) {
        setError('Error al crear la casa');
      } else {
        setName('');
        setDescription('');
        onClose();
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setDescription('');
      setError('');
      onClose();
    }
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
                <Home className="w-5 h-5" />
                <h2 className="text-lg font-thin">Nueva Casa</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-thin text-zinc-300 mb-2">
                  Nombre de la Casa *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mi Casa"
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white font-thin disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-thin text-zinc-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción de la casa..."
                  rows={3}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white font-thin resize-none disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm font-thin">
                  {error}
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-zinc-700 hover:border-zinc-600 transition-colors font-thin disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex-1 px-4 py-2 bg-white text-black hover:bg-zinc-200 transition-colors font-thin disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creando...' : 'Crear Casa'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}