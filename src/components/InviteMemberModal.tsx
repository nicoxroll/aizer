import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Mail } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteMember: (homeId: string, email: string) => Promise<any>;
  homeId: string;
}

export default function InviteMemberModal({ isOpen, onClose, onInviteMember, homeId }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await onInviteMember(homeId, email.trim());
      if (error) {
        setError('Error al enviar la invitación');
      } else {
        setSuccess(true);
        setEmail('');
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail('');
      setError('');
      setSuccess(false);
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
                <Users className="w-5 h-5" />
                <h2 className="text-lg font-thin">Invitar Miembro</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-thin text-green-400 mb-2">
                  ¡Invitación Enviada!
                </h3>
                <p className="text-zinc-400 font-thin text-sm">
                  Se ha enviado la invitación correctamente
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-thin text-zinc-300 mb-2">
                    Email del usuario *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white font-thin disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="bg-zinc-800 border border-zinc-700 p-3">
                  <p className="text-zinc-400 text-sm font-thin">
                    El usuario recibirá una invitación para unirse a esta casa. 
                    Podrá ver y gestionar habitaciones y objetos.
                  </p>
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
                    disabled={loading || !email.trim()}
                    className="flex-1 px-4 py-2 bg-white text-black hover:bg-zinc-200 transition-colors font-thin disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Enviando...' : 'Enviar Invitación'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}