/*
  # Schema completo para organización del hogar

  1. Nuevas Tablas
    - `homes` - Casas/hogares de los usuarios
    - `home_members` - Miembros de cada casa con roles
    - `rooms` - Habitaciones dentro de cada casa
    - `items` - Objetos/elementos en cada habitación
    - `invitations` - Invitaciones pendientes para unirse a casas

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para que usuarios solo vean sus datos
    - Políticas para miembros de casas compartidas

  3. Funciones
    - Función para aceptar invitaciones automáticamente
*/

-- Crear tabla de casas/hogares
CREATE TABLE IF NOT EXISTS homes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de miembros de casa
CREATE TABLE IF NOT EXISTS home_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id uuid REFERENCES homes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(home_id, user_id)
);

-- Crear tabla de habitaciones
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  home_id uuid REFERENCES homes(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de objetos/elementos
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text DEFAULT 'General',
  location text DEFAULT '',
  description text DEFAULT '',
  home_id uuid REFERENCES homes(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de invitaciones
CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id uuid REFERENCES homes(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  invited_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  UNIQUE(home_id, email)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Políticas para homes
CREATE POLICY "Users can view homes they own or are members of"
  ON homes FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT home_id FROM home_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create homes"
  ON homes FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Only owners can update homes"
  ON homes FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Only owners can delete homes"
  ON homes FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Políticas para home_members
CREATE POLICY "Users can view members of homes they belong to"
  ON home_members FOR SELECT
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
      UNION
      SELECT home_id FROM home_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Home owners can manage members"
  ON home_members FOR ALL
  TO authenticated
  USING (
    home_id IN (SELECT id FROM homes WHERE owner_id = auth.uid())
  );

-- Políticas para rooms
CREATE POLICY "Users can view rooms in their homes"
  ON rooms FOR SELECT
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
      UNION
      SELECT home_id FROM home_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Home members can manage rooms"
  ON rooms FOR ALL
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
      UNION
      SELECT home_id FROM home_members WHERE user_id = auth.uid()
    )
  );

-- Políticas para items
CREATE POLICY "Users can view items in their homes"
  ON items FOR SELECT
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
      UNION
      SELECT home_id FROM home_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Home members can manage items"
  ON items FOR ALL
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
      UNION
      SELECT home_id FROM home_members WHERE user_id = auth.uid()
    )
  );

-- Políticas para invitations
CREATE POLICY "Users can view invitations they sent or received"
  ON invitations FOR SELECT
  TO authenticated
  USING (
    invited_by = auth.uid() OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    home_id IN (SELECT id FROM homes WHERE owner_id = auth.uid())
  );

CREATE POLICY "Home owners can create invitations"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    home_id IN (SELECT id FROM homes WHERE owner_id = auth.uid()) AND
    invited_by = auth.uid()
  );

CREATE POLICY "Home owners can update invitations"
  ON invitations FOR UPDATE
  TO authenticated
  USING (
    home_id IN (SELECT id FROM homes WHERE owner_id = auth.uid()) OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Función para aceptar invitaciones
CREATE OR REPLACE FUNCTION accept_invitation(invitation_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record invitations%ROWTYPE;
  user_email text;
BEGIN
  -- Obtener email del usuario actual
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- Obtener la invitación
  SELECT * INTO invitation_record 
  FROM invitations 
  WHERE id = invitation_id 
    AND email = user_email 
    AND status = 'pending'
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Invitación no válida o expirada');
  END IF;
  
  -- Agregar usuario como miembro
  INSERT INTO home_members (home_id, user_id, role)
  VALUES (invitation_record.home_id, auth.uid(), 'member')
  ON CONFLICT (home_id, user_id) DO NOTHING;
  
  -- Marcar invitación como aceptada
  UPDATE invitations 
  SET status = 'accepted' 
  WHERE id = invitation_id;
  
  RETURN json_build_object('success', true, 'home_id', invitation_record.home_id);
END;
$$;

-- Trigger para agregar automáticamente al propietario como miembro
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO home_members (home_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER add_owner_as_member_trigger
  AFTER INSERT ON homes
  FOR EACH ROW
  EXECUTE FUNCTION add_owner_as_member();