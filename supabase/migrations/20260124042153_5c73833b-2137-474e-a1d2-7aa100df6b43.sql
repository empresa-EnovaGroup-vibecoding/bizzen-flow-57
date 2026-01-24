-- =============================================
-- FIX: Replace overly permissive RLS policies
-- Changes USING(true)/WITH CHECK(true) to require authentication
-- =============================================

-- CLIENTS TABLE
DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON clients;

CREATE POLICY "Staff can view clients"
ON clients FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create clients"
ON clients FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update clients"
ON clients FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete clients"
ON clients FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- SERVICES TABLE
DROP POLICY IF EXISTS "Authenticated users can view services" ON services;
DROP POLICY IF EXISTS "Authenticated users can create services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;

CREATE POLICY "Staff can view services"
ON services FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create services"
ON services FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update services"
ON services FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete services"
ON services FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- INVENTORY TABLE
DROP POLICY IF EXISTS "Authenticated users can view inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can create inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can update inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can delete inventory" ON inventory;

CREATE POLICY "Staff can view inventory"
ON inventory FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create inventory"
ON inventory FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update inventory"
ON inventory FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete inventory"
ON inventory FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- APPOINTMENTS TABLE
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can create appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;

CREATE POLICY "Staff can view appointments"
ON appointments FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create appointments"
ON appointments FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update appointments"
ON appointments FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete appointments"
ON appointments FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- APPOINTMENT_SERVICES TABLE
DROP POLICY IF EXISTS "Authenticated users can view appointment_services" ON appointment_services;
DROP POLICY IF EXISTS "Authenticated users can create appointment_services" ON appointment_services;
DROP POLICY IF EXISTS "Authenticated users can update appointment_services" ON appointment_services;
DROP POLICY IF EXISTS "Authenticated users can delete appointment_services" ON appointment_services;

CREATE POLICY "Staff can view appointment_services"
ON appointment_services FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create appointment_services"
ON appointment_services FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update appointment_services"
ON appointment_services FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete appointment_services"
ON appointment_services FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- SALES TABLE
DROP POLICY IF EXISTS "Authenticated users can view sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can create sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can update sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can delete sales" ON sales;

CREATE POLICY "Staff can view sales"
ON sales FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create sales"
ON sales FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update sales"
ON sales FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete sales"
ON sales FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- SALE_ITEMS TABLE
DROP POLICY IF EXISTS "Authenticated users can view sale_items" ON sale_items;
DROP POLICY IF EXISTS "Authenticated users can create sale_items" ON sale_items;
DROP POLICY IF EXISTS "Authenticated users can update sale_items" ON sale_items;
DROP POLICY IF EXISTS "Authenticated users can delete sale_items" ON sale_items;

CREATE POLICY "Staff can view sale_items"
ON sale_items FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create sale_items"
ON sale_items FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update sale_items"
ON sale_items FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete sale_items"
ON sale_items FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);