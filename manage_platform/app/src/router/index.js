import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Main from '../views/main/Main.vue';
import Products from '../views/products/Products.vue';
// import Tasks from '../App.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/', 
      name: 'Main',
      component: Main
    },
    {
      path: '/products', 
      name: 'Products',
      component: Products
    }
  ],
})

export default router