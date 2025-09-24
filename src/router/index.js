import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFound from '@/views/NotFound.vue'
import LoginCallback from '@/views/LoginCallback.vue'

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
      path: '/login/callback',
      name: 'loginCallback',
      component: LoginCallback,
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
          component: () => import('../components/admin/AdminListarLibros.vue'),
        },
        {
          path: 'agregar-libro',
          component: () => import('../components/admin/AdminAgregarLibro.vue'),
        },
      ],
    },
    {
      path: '/info/:id',
      name: 'info',
      component: () => import('../views/InfoLibroVista.vue'),
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

  // Inicializar store si no lo está
  if (!auth.initialized) {
    await auth.fetchUser()
  }

  // Evita quedarse en /login si ya está autenticado
  if (to.path === '/login' && auth.isAuthed) {
    return next('/')
  }

  // Revalida usuario
  if (!auth.user) {
    await auth.fetchUser()
  }

  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      return next('/login')
    }
    if (to.meta.roles && (!auth.user || !to.meta.roles.includes(auth.user.rol))) {
      return next('/not-found')
    }
  }

  next()
})

export default router
