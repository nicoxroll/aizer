/*
  # Fix infinite recursion in RLS policies

  1. Problem
    - The home_members table has RLS policies that reference themselves
    - This causes infinite recursion when querying the table
    
  2. Solution
    - Drop existing problematic policies
    - Create new policies that avoid self-reference
    - Use proper aliasing to prevent recursion
    - Simplify policy logic for better performance
*/

-- Drop existing problematic policies for home_members
DROP POLICY IF EXISTS "Home owners can manage members" ON home_members;
DROP POLICY IF EXISTS "Users can view members of homes they belong to" ON home_members;

-- Create new non-recursive policies for home_members
CREATE POLICY "Users can view their own memberships"
  ON home_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Home owners can view all members"
  ON home_members
  FOR SELECT
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Home owners can insert members"
  ON home_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Home owners can update members"
  ON home_members
  FOR UPDATE
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Home owners can delete members"
  ON home_members
  FOR DELETE
  TO authenticated
  USING (
    home_id IN (
      SELECT id FROM homes WHERE owner_id = auth.uid()
    )
  );

-- Also fix the homes policy to avoid potential recursion
DROP POLICY IF EXISTS "Users can view homes they own or are members of" ON homes;

CREATE POLICY "Users can view homes they own"
  ON homes
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can view homes they are members of"
  ON homes
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT hm.home_id 
      FROM home_members hm 
      WHERE hm.user_id = auth.uid()
    )
  );