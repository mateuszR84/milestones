import { createI18n } from 'vue-i18n'
import pl from './locales/pl'
import en from './locales/en'

export type SupportedLocale = 'pl' | 'en'
export const SUPPORTED_LOCALES: { value: SupportedLocale; label: string }[] = [
  { value: 'pl', label: 'PL' },
  { value: 'en', label: 'EN' },
]

const STORAGE_KEY = 'milestones-locale'

function initialLocale(): SupportedLocale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'pl' || stored === 'en') return stored
  return navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { pl, en },
})

export function setLocale(locale: SupportedLocale): void {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
}
