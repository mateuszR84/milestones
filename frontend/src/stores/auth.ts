import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as authApi from '../api/auth'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const initialized = ref(false)

  async function fetchUser(): Promise<void> {
    try {
      user.value = await authApi.fetchCurrentUser()
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(email: string, password: string): Promise<void> {
    user.value = await authApi.login({ email, password })
  }

  async function register(payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    user.value = await authApi.register(payload)
  }

  async function logout(): Promise<void> {
    await authApi.logout()
    user.value = null
  }

  return { user, initialized, fetchUser, login, register, logout }
})
