import { createRouter, createWebHistory } from 'vue-router'

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
    // ✅ PRUEBA: Usar ruta relativa exacta como las otras
    {
      path: '/lector/:archivo',
      name: 'lector',
      component: () => import('../views/LectorPdfVista.vue'),
    },
    {
      path: '/test-lector',
      name: 'test-lector',
      component: () => import('../views/testLector.vue'),
    },
    {
      path: '/admin-biblioteca',
      name: 'admin-biblioteca',
      component: () => import('../views/AdminBibliotecaVista.vue'),
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

export default router
