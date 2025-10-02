import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

export async function login(email: string, password: string) {
  const supabase = createClient();
  
  // Buscar usuario por email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return { success: false, error: 'Credenciales inválidas' };
  }

  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!isValidPassword) {
    return { success: false, error: 'Credenciales inválidas' };
  }

  return { 
    success: true, 
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}

export async function getCurrentUser() {
  const supabase = createClient();
  
  // Aquí implementaremos la lógica de sesión
  // Por ahora retornamos null
  return null;
}

export async function logout() {
  // Limpiar cookies de sesión
  const supabase = createClient();
  // Implementar logout
}
