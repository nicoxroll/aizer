import React from 'react';
import { motion } from 'framer-motion';
import { Room } from '../types';

interface RoomGridProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
}

export default function RoomGrid({ rooms, onRoomClick }: RoomGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {rooms.map((room, index) => (
        <motion.div
          key={room.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => onRoomClick(room)}
          className="bg-zinc-900 border border-zinc-800 p-6 cursor-pointer hover:border-zinc-600 transition-all duration-200 group"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-thin group-hover:text-white transition-colors">
              {room.name}
            </h3>
            <span className="text-zinc-400 text-sm font-thin">
              {room.itemCount} objetos
            </span>
          </div>
          
          <div className="h-24 bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
            <span className="text-zinc-500 font-thin text-sm">
              {room.itemCount === 0 ? 'Sin objetos' : `${room.itemCount} elementos`}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}