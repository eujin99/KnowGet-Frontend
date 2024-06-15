const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '너겟, 노숙인 일자리 지식통합서비스' },
      },
      {
        path: 'jobpost',
        component: () => import('pages/JobPost.vue'),
        meta: { title: '너겟, 일자리 찾기' },
      },
      {
        path: 'signup',
        component: () => import('pages/SignupPage.vue'),
        meta: { title: '너겟, 회원 가입' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
