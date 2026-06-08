import { createRouter, createWebHashHistory } from 'vue-router'
import { axiosRequest } from '@renderer/api/request'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/EurekaWeather' },
    {
      path: '/EurekaWeather',
      name: 'EurekaWeather',
      component: () => import('@renderer/views/EurekaWeather.vue'),
    },
    {
      path: '/EurekaVariant',
      name: 'EurekaVariant',
      component: () => import('@renderer/views/EurekaVariant.vue'),
    },
    {
      path: '/EurekaFate',
      name: 'EurekaFate',
      component: () => import('@renderer/views/EurekaFate.vue'),
    },
    {
      path: '/EurekaLogos',
      name: 'EurekaLogos',
      component: () => import('@renderer/views/EurekaLogos.vue'),
    },
    {
      path: '/Market',
      name: 'Market',
      component: () => import('@renderer/views/Market.vue'),
    },
    {
      path: '/About',
      name: 'About',
      component: () => import('@renderer/views/About.vue'),
    },
  ],
})

router.beforeEach(() => {
  axiosRequest.clear()
  return true
})

export default router
