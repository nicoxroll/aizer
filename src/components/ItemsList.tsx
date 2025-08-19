import React from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Tag } from 'lucide-react';
import { Item } from '../types';

interface ItemsListProps {
  items: Item[];
  viewMode: 'grid' | 'list';
}

export default function ItemsList({ items, viewMode }: ItemsListProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400 font-thin">No hay objetos para mostrar</p>
      </motion.div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-zinc-900 border border-zinc-800 p-4 hover:border-zinc-600 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-thin group-hover:text-white transition-colors">
                {item.name}
              </h4>
              <Package className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Tag className="w-3 h-3" />
                <span className="font-thin">{item.category}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-zinc-400">
                <MapPin className="w-3 h-3" />
                <span className="font-thin">{item.location}</span>
              </div>
            </div>

            {item.description && (
              <p className="text-zinc-500 text-sm font-thin mt-3 line-clamp-2">
                {item.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
          className="bg-zinc-900 border border-zinc-800 p-4 hover:border-zinc-600 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="w-4 h-4 text-zinc-500" />
              <div>
                <h4 className="font-thin group-hover:text-white transition-colors">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="text-zinc-500 text-sm font-thin mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-zinc-400">
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span className="font-thin">{item.category}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span className="font-thin">{item.location}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}