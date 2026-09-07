<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const submitting = ref(false)

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    router.push({ name: 'timeline' })
  } catch {
    error.value = 'Nie udało się utworzyć konta. Sprawdź dane i spróbuj ponownie.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-4">
    <form class="w-full max-w-sm space-y-4" @submit.prevent="submit">
      <h1 class="text-xl font-medium text-neutral-900">Załóż konto</h1>

      <div>
        <label class="block text-sm text-neutral-600" for="name">Imię</label>
        <input id="name" v-model="name" type="text" required class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm text-neutral-600" for="email">E-mail</label>
        <input id="email" v-model="email" type="email" required class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm text-neutral-600" for="password">Hasło</label>
        <input id="password" v-model="password" type="password" required class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm text-neutral-600" for="password_confirmation">Powtórz hasło</label>
        <input id="password_confirmation" v-model="passwordConfirmation" type="password" required class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button type="submit" :disabled="submitting" class="w-full rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50">
        Zarejestruj się
      </button>

      <p class="text-center text-sm text-neutral-500">
        Masz już konto?
        <router-link to="/login" class="text-neutral-900 underline">Zaloguj się</router-link>
      </p>
    </form>
  </div>
</template>
