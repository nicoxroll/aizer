import React from 'react';
import { motion } from 'framer-motion';
import { Home, Plus, Users, Crown } from 'lucide-react';
import { Home as HomeType } from '../types';

interface HomeSelectorProps {
  homes: HomeType[];
  onSelectHome: (home: HomeType) => void;
  onCreateHome: () => void;
  createHomeModal: React.ReactNode;
}

export default function HomeSelector({ homes, onSelectHome, onCreateHome, createHomeModal }: HomeSelectorProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-black mb-6">
            <Home className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extralight tracking-wide mb-2">
            Selecciona tu Casa
          </h1>
          <p className="text-zinc-400 font-thin">
            Elige una casa para comenzar a organizar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {homes.map((home, index) => (
            <motion.div
              key={home.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onSelectHome(home)}
              className="bg-zinc-900 border border-zinc-800 p-6 cursor-pointer hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  {home.isOwner && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-zinc-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-thin">{home.memberCount}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-thin mb-2 group-hover:text-white transition-colors">
                {home.name}
              </h3>
              
              {home.description && (
                <p className="text-zinc-400 text-sm font-thin line-clamp-2">
                  {home.description}
                </p>
              )}
              
              <div className="mt-4 text-xs text-zinc-500 font-thin">
                {home.isOwner ? 'Propietario' : 'Miembro'}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: homes.length * 0.1 }}
            onClick={onCreateHome}
            className="bg-zinc-900 border border-zinc-800 border-dashed p-6 cursor-pointer hover:border-zinc-600 transition-colors group flex items-center justify-center"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-zinc-400 group-hover:text-white transition-colors mx-auto mb-3" />
              <h3 className="text-lg font-thin text-zinc-400 group-hover:text-white transition-colors">
                Nueva Casa
              </h3>
              <p className="text-zinc-500 text-sm font-thin mt-1">
                Crear una nueva casa
              </p>
            </div>
          </motion.div>
        </div>

        {homes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-zinc-400 mb-4">
              <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-thin">No tienes casas aún</p>
              <p className="text-sm font-thin mt-1">Crea tu primera casa para comenzar</p>
            </div>
          </motion.div>
        )}
      </div>

      {createHomeModal}
    </div>
  );
}