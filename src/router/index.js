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

//Guardia de navegación

// router.beforeEach(async (to, from, next) => {
//   if (to.meta.requiresAuth) {
//     try {
//       const res = await axios.get('http://localhost:5000/api/auth/validate', {
//         withCredentials: true,
//       })

//       if (res.data.authenticated) {
//         next()
//       } else {
//         throw new Error('No autenticado')
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Sesión caducada o inválida',
//         text: 'Por favor, inicia sesión nuevamente.',
//       })
//       next({ name: 'login' })
//     }
//   } else {
//     next()
//   }
// })

export default router
