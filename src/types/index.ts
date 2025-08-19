export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Home {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  memberCount: number;
  isOwner: boolean;
}

export interface HomeMember {
  id: string;
  home_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
}

export interface Room {
  id: string;
  name: string;
  home_id: string;
  created_at: string;
  updated_at: string;
  itemCount: number;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  home_id: string;
  room_id: string;
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  home_id: string;
  email: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at: string;
}