<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    await auth.login(email.value, password.value)
    router.push({ name: 'timeline' })
  } catch {
    error.value = t('auth.login.error')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-4">
    <form class="w-full max-w-sm space-y-4" @submit.prevent="submit">
      <h1 class="text-xl font-medium text-neutral-900">{{ $t('auth.login.title') }}</h1>

      <div>
        <label class="block text-sm text-neutral-600" for="email">{{ $t('auth.login.email') }}</label>
        <input id="email" v-model="email" type="email" required class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm text-neutral-600" for="password">{{ $t('auth.login.password') }}</label>
        <input id="password" v-model="password" type="password" required class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button type="submit" :disabled="submitting" class="w-full rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50">
        {{ $t('auth.login.submit') }}
      </button>

      <p class="text-center text-sm text-neutral-500">
        {{ $t('auth.login.noAccount') }}
        <router-link to="/register" class="text-neutral-900 underline">{{ $t('auth.login.registerLink') }}</router-link>
      </p>
    </form>
  </div>
</template>
