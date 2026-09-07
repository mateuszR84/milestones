import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true } },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/timeline/:userId',
      name: 'timeline-of',
      component: () => import('../views/TimelineView.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/friends', name: 'friends', component: () => import('../views/FriendsView.vue'), meta: { requiresAuth: true } },
    { path: '/events', name: 'events', component: () => import('../views/EventsView.vue'), meta: { requiresAuth: true } },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.fetchUser()
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && auth.user) {
    return { name: 'timeline' }
  }

  return true
})

export default router
