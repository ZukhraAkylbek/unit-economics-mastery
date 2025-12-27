-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create students table with telegram handles
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  coins INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (student_id, role)
);

-- Create progress tracking table
CREATE TABLE public.progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  module_id VARCHAR(100) NOT NULL,
  step_completed INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, module_id)
);

-- Create personal projects table
CREATE TABLE public.personal_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  project_name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  cogs DECIMAL(10,2),
  cac DECIMAL(10,2),
  marketing_cost DECIMAL(10,2),
  customers INTEGER,
  churn_rate DECIMAL(5,2),
  arpu DECIMAL(10,2),
  ai_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_projects ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_telegram VARCHAR, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.students s ON s.id = ur.student_id
    WHERE s.telegram = _telegram
      AND ur.role = _role
  )
$$;

-- Create function to check if telegram is a student
CREATE OR REPLACE FUNCTION public.is_student(_telegram VARCHAR)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.students
    WHERE telegram = _telegram
  )
$$;

-- RLS Policies for students table
CREATE POLICY "Students can view all students"
ON public.students FOR SELECT
USING (true);

CREATE POLICY "Admins can insert students"
ON public.students FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update students"
ON public.students FOR UPDATE
USING (true);

-- RLS Policies for user_roles
CREATE POLICY "Anyone can view roles"
ON public.user_roles FOR SELECT
USING (true);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (true);

-- RLS Policies for progress
CREATE POLICY "Students can view their progress"
ON public.progress FOR SELECT
USING (true);

CREATE POLICY "Students can insert their progress"
ON public.progress FOR INSERT
WITH CHECK (true);

CREATE POLICY "Students can update their progress"
ON public.progress FOR UPDATE
USING (true);

-- RLS Policies for personal_projects
CREATE POLICY "Students can view their projects"
ON public.personal_projects FOR SELECT
USING (true);

CREATE POLICY "Students can manage their projects"
ON public.personal_projects FOR ALL
USING (true);

-- Insert initial students
INSERT INTO public.students (telegram, name) VALUES
('darikaom', 'Дарика'),
('Daniyar_Aitykeev', 'Данияр'),
('agafarova', 'Алина'),
('lola_trelevskaia', 'Лола'),
('di_orozbaeva', 'Диана'),
('meerimbatt', 'Меерим'),
('amai8881', 'Амай'),
('chopalate', 'Chopalate'),
('acme_df', 'Acme'),
('aizhan', 'Айжан'),
('damiraturganbai', 'Дамира'),
('beeemd', 'Beeemd'),
('Zuhra_akylbek', 'Zuhra'),
('admin', 'Администратор');

-- Set admin role for admin user
INSERT INTO public.user_roles (student_id, role)
SELECT id, 'admin'::app_role FROM public.students WHERE telegram = 'admin';

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
BEFORE UPDATE ON public.progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personal_projects_updated_at
BEFORE UPDATE ON public.personal_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();