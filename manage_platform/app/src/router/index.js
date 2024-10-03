import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Main from '../views/main/Main.vue';
import Products from '../views/products/Products.vue';
import Receipts from '../views/receipts/Receipts.vue';
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
    },
    {
      path: '/receipts', 
      name: 'Receipts',
      component: Receipts
    }
  ],
})

export default router