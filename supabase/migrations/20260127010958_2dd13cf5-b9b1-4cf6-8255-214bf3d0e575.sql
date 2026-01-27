-- Add new appointment statuses to the enum
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'in_room';
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'no_show';

-- Create team/specialists table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cabins table
CREATE TABLE public.cabins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add specialist and cabin columns to appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS specialist_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS cabin_id UUID REFERENCES public.cabins(id) ON DELETE SET NULL;

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff and admins can view team_members" 
ON public.team_members 
FOR SELECT 
USING (is_staff_or_admin(auth.uid()));

CREATE POLICY "Only admins can create team_members" 
ON public.team_members 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update team_members" 
ON public.team_members 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete team_members" 
ON public.team_members 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on cabins
ALTER TABLE public.cabins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff and admins can view cabins" 
ON public.cabins 
FOR SELECT 
USING (is_staff_or_admin(auth.uid()));

CREATE POLICY "Only admins can create cabins" 
ON public.cabins 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update cabins" 
ON public.cabins 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete cabins" 
ON public.cabins 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add update triggers
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cabins_updated_at
BEFORE UPDATE ON public.cabins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default cabins
INSERT INTO public.cabins (name, description) VALUES 
('Cabina 1', 'Cabina principal'),
('Cabina 2', 'Cabina secundaria');

-- Insert a default team member
INSERT INTO public.team_members (name, role) VALUES 
('Sin asignar', 'General');