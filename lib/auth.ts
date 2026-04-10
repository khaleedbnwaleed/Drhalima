import { supabase } from './supabase'
import * as bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createAdminUser(
  email: string,
  password: string,
  fullName: string
) {
  const passwordHash = await hashPassword(password)

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role: 'admin',
      }
    ])
    .select()

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }

  return data[0]
}

export async function authenticateUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return null
  }

  const passwordValid = await verifyPassword(password, user.password_hash)

  if (!passwordValid) {
    return null
  }

  // Remove password from response
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return null
  }

  const { password_hash, ...userWithoutPassword } = data
  return userWithoutPassword
}
