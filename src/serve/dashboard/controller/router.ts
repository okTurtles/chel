import Router from 'npm:vue-router'
import Vue from 'npm:vue'

declare const process: { env: Record<string, string | undefined> }

import Landing from '@pages/miscellaneous/Landing.vue'
import L from '../common/translations.ts'
import { lazyPage } from '../views/utils/lazyLoadComponents.ts'

const lazyDashboard = lazyPage(() => import('@pages/Dashboard.vue'))
const lazyContracts = lazyPage(() => import('@pages/Contracts.vue'))
const lazyUsers = lazyPage(() => import('@pages/Users.vue'))
const lazyBilling = lazyPage(() => import('@pages/Billing.vue'))
const lazyAccounts = lazyPage(() => import('@pages/Accounts.vue'))
const lazyDesignSystem = lazyPage(() => import('@pages/design-system/CheloniaDesignSystem.vue'))

Vue.use(Router)

const router = new (Router as unknown as new (options: {
  mode: string;
  base: string;
  scrollBehavior: () => { x: number; y: number };
  routes: unknown[];
}) => { beforeEach: (guard: unknown) => void })({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '' : '/dashboard',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      meta: { title: L('Chelonia dashboard') },
      name: 'Landing',
      component: Landing
    },
    {
      path: '/main',
      meta: { title: L('Dashboard') },
      name: 'Dashboard',
      component: lazyDashboard
    },
    {
      path: '/contracts',
      meta: { title: L('Contracts') },
      name: 'Contracts',
      component: lazyContracts
    },
    {
      path: '/users',
      meta: { title: L('Users') },
      name: 'Users',
      component: lazyUsers
    },
    {
      path: '/accounts',
      meta: { title: L('Accounts') },
      name: 'Accounts',
      component: lazyAccounts
    },
    {
      path: '/billing',
      meta: { title: L('Billing') },
      name: 'Billing',
      component: lazyBilling
    },
    {
      path: '/design-system',
      meta: { title: L('Design system') },
      name: 'DesignSystem',
      component: lazyDesignSystem
    },
    {
      path: '*',
      meta: { title: L('Chelonia dashboard') },
      name: 'Landing',
      component: Landing
    }
  ]
})

router.beforeEach((to: { meta: { title: string } }, _from: unknown, next: (path?: string | false | void) => void) => {
  document.title = to.meta.title
  next()
})

export default router
