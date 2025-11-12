import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/auth/success',
      name: 'authSuccess',
      component: () => import('@/views/AuthSuccessView.vue'),
    },

    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/biblioteca',
      name: 'biblioteca',
      component: () => import('../views/BibliotecaVista.vue'),
    },
    {
      path: '/leer/:id_libro',
      name: 'leer',
      component: () => import('../views/LectorVista.vue'),
    },
    {
      path: '/admin-biblioteca',
      name: 'admin-biblioteca',
      component: () => import('../views/AdminBibliotecaVista.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin'],
      },
      children: [
        {
          path: 'libros',
          component: () => import('../components/admin/AdminLibros.vue'),
        },
        {
          path: 'autores',
          component: () => import('../components/admin/AdminAutores.vue'),
        },
        {
          path: 'carreras',
          component: () => import('../components/admin/AdminCarreras.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

//Guardia de navegación

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.hasFetched) {
    await auth.fetchUser()
  }

  // Evita quedarse en /login si ya está autenticado
  if (to.path === '/login' && auth.isAuthenticated) return next('/')

  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) return next('/login')

    // Validación de roles
    if (to.meta.roles && (!auth.user || !to.meta.roles.includes(auth.user.rol))) {
      return next('/not-found')
    }
  }
  next()
})

export default router
