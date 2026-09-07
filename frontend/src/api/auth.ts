import { apiClient, ensureCsrfCookie } from './client'
import type { User } from '../types'

export async function register(payload: {
  name: string
  email: string
  password: string
  password_confirmation: string
}): Promise<User> {
  await ensureCsrfCookie()
  const { data } = await apiClient.post<User>('/api/register', payload)
  return data
}

export async function login(payload: { email: string; password: string }): Promise<User> {
  await ensureCsrfCookie()
  const { data } = await apiClient.post<User>('/api/login', payload)
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/logout')
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/api/user')
  return data
}
