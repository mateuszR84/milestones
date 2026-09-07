import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://milestones.test'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

let csrfReady = false

export async function ensureCsrfCookie(): Promise<void> {
  if (csrfReady) return
  await apiClient.get('/sanctum/csrf-cookie')
  csrfReady = true
}
