import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, Search, Grid, List, Users, LogOut } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useHomes } from './hooks/useHomes';
import { useRooms } from './hooks/useRooms';
import { useItems } from './hooks/useItems';
import AuthForm from './components/AuthForm';
import HomeSelector from './components/HomeSelector';
import RoomGrid from './components/RoomGrid';
import ItemsList from './components/ItemsList';
import AddRoomModal from './components/AddRoomModal';
import AddItemModal from './components/AddItemModal';
import CreateHomeModal from './components/CreateHomeModal';
import InviteMemberModal from './components/InviteMemberModal';
import { Room, Item } from './types';

function App() {
  const { user, signOut } = useAuth();
  const { homes, selectedHome, selectHome, createHome, inviteMember } = useHomes();
  const { rooms, createRoom } = useRooms(selectedHome?.id || null);
  const { items, createItem } = useItems(selectedHome?.id || null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showCreateHome, setShowCreateHome] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);

  const handleAddRoom = async (roomData: { name: string; homeId: string }) => {
    await createRoom(roomData.name);
    setShowAddRoom(false);
  };

  const handleAddItem = async (itemData: { name: string; category: string; description?: string; homeId: string; roomId: string }) => {
    await createItem({
      name: itemData.name,
      category: itemData.category,
      description: itemData.description,
      room_id: itemData.roomId,
    });
    setShowAddItem(false);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roomItems = selectedRoom 
    ? items.filter(item => item.room_id === selectedRoom.id)
    : filteredItems;

  if (!user) {
    return <AuthForm />;
  }

  if (!selectedHome) {
    return (
      <HomeSelector
        homes={homes}
        onSelectHome={selectHome}
        onCreateHome={() => setShowCreateHome(true)}
        createHomeModal={
          <CreateHomeModal
            isOpen={showCreateHome}
            onClose={() => setShowCreateHome(false)}
            onCreateHome={createHome}
          />
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header 
        className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Home className="w-6 h-6" />
                <h1 className="text-xl font-extralight tracking-wide">{selectedHome.name}</h1>
              </motion.div>
              
              <button
                onClick={() => selectHome(null)}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-thin"
              >
                Cambiar Casa
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowInviteMember(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-thin"
              >
                <Users className="w-4 h-4" />
                <span>Invitar</span>
              </button>
              
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-sm font-thin"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedRoom ? (
          <>
            {/* Controls */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setShowAddRoom(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 transition-colors font-thin"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Habitación</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center space-x-2 px-6 py-3 border border-zinc-700 hover:border-zinc-600 transition-colors font-thin"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Objeto</span>
                </motion.button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar objetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 focus:border-zinc-500 outline-none text-sm font-thin w-64"
                  />
                </div>
                
                <div className="flex border border-zinc-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-black' : 'hover:bg-zinc-800'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-white text-black' : 'hover:bg-zinc-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Rooms Grid */}
            <RoomGrid 
              rooms={rooms} 
              onRoomClick={setSelectedRoom}
            />

            {/* Items View */}
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-12"
              >
                <h2 className="text-lg font-extralight mb-6 tracking-wide">
                  Resultados de búsqueda ({filteredItems.length})
                </h2>
                <ItemsList 
                  items={filteredItems} 
                  viewMode={viewMode}
                />
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="text-zinc-400 hover:text-white transition-colors font-thin"
                >
                  ← Volver
                </button>
                <h2 className="text-2xl font-extralight tracking-wide">{selectedRoom.name}</h2>
                <span className="text-zinc-400 font-thin">({roomItems.length} objetos)</span>
              </div>
              
              <button
                onClick={() => setShowAddItem(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 transition-colors font-thin"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Objeto</span>
              </button>
            </div>
            
            <ItemsList 
              items={roomItems} 
              viewMode={viewMode}
            />
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddRoom && (
          <AddRoomModal
            isOpen={showAddRoom}
            onClose={() => setShowAddRoom(false)}
            onAddRoom={handleAddRoom}
            homeId={selectedHome.id}
          />
        )}
        
        {showAddItem && (
          <AddItemModal
            isOpen={showAddItem}
            onClose={() => setShowAddItem(false)}
            onAddItem={handleAddItem}
            rooms={rooms}
            homeId={selectedHome.id}
          />
        )}
        
        {showCreateHome && (
          <CreateHomeModal
            isOpen={showCreateHome}
            onClose={() => setShowCreateHome(false)}
            onCreateHome={createHome}
          />
        )}
        
        {showInviteMember && (
          <InviteMemberModal
            isOpen={showInviteMember}
            onClose={() => setShowInviteMember(false)}
            onInviteMember={inviteMember}
            homeId={selectedHome.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;