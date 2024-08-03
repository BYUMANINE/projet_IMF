
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '/', component: () => import('pages/authentification/login.vue')
      }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      ...[
        {
          name: 'home',
          path: '/home',
          component: () => import('pages/index.vue')
        },
        /* ROUTES MEMBRES */
        {
          path: '/adhesions',
          name: 'Adhesions',
          component: () => import('pages/clients/layout.vue')
        },

        /* ROUTES CAISSE */
        {
          path: '/caisse',
          name: 'Caisses',
          component: () => import('pages/caisse/layout.vue')
        },

        /* ROUTES COMPTABILITE */
        {
          path: '/comptabilite',
          name: 'Comptabilité',
          component: () => import('pages/comptabilite/layout.vue')
        },
        {
          path: '/parametre',
          name: 'Paramètres',
          component: () => import('pages/parametres/layout.vue')
        },

        /* ROUTES PRODUITS */
        {
          path: '/epargnes',
          name: 'Epargnes',
          component: () => import('pages/epargnes/layout.vue')
        },
        /* ROUTES CREDIT */
        {
          path: '/credit',
          name: 'Gestion des credits',
          component: () => import('pages/credits/layout.vue')
        },

        // RAPPORTS
        {
          path: '/rapports',
          name: 'Rapports',
          component: () => import('pages/rapports/layout.vue')
        },
        // CHEQUIERS
        {
          path: '/chequiers',
          name: 'Chaquiers',
          component: () => import('pages/chequier/layout.vue')
        },
        // SMS
        {
          path: '/sms',
          name: 'Sms',
          component: () => import('pages/sms/layout.vue')
        }
      ]
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('layouts/MainLayout.vue'),
    // component: () => import("pages/Error404.vue")
    children: [{
      path: '*',
      component: () => import('pages/autres/Error404.vue')
    }]
  })
}
export default routes
