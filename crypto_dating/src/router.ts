import { createRouter, createWebHistory } from 'vue-router';

const ProfileView = () => import('./views/ProfileView.vue');

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/profile', name: 'profile', component: ProfileView },
  ],
});

export default router;
