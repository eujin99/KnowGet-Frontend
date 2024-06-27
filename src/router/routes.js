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
        name: 'JobPost',
      },
      {
        path: 'post/:postId',
        component: () => import('pages/JobPostDetails.vue'),
        meta: { title: '너겟, 일자리 찾기' },
        name: 'JobPostDetails',
        props: true,
      },
      {
        path: 'education',
        component: () => import('pages/EducationPage.vue'),
        meta: { title: '너겟, 교육 찾기' },
      },
      {
        path: 'guide',
        component: () => import('pages/GuidePage.vue'),
        meta: { title: '너겟, 취업 가이드' },
      },
      {
        path: 'success',
        component: () => import('pages/SuccessPage.vue'),
        name: 'SuccessPage',
        meta: { title: '너겟, 취업 성공사례' },
      },
      {
        path: 'success/:caseId',
        component: () => import('pages/SuccessPageDetails.vue'),
        meta: { title: '너겟, 취업 성공사례 상세페이지' },
        name: 'SuccessPageDetails',
        props: true,
      },
      {
        path: '/success-page-write',
        component: () => import('pages/SuccessPageWrite.vue'),
        meta: { title: '너겟, 취업 성공사례 작성' },
        name: 'SuccessPageWrite',
        props: true,
      },
      {
        path: 'consult',
        component: () => import('pages/ConsultPage.vue'),
        meta: { title: '너겟, 상담하기' },
      },
      {
        path: 'signup',
        component: () => import('pages/SignupPage.vue'),
        meta: { title: '너겟, 회원 가입' },
      },
      {
        path: 'mypage',
        component: () => import('pages/MyPage.vue'),
        meta: { title: '너겟, 마이페이지' },
      },
      {
        path: '/guide/:id',
        component: () => import('pages/GuidePageDetails.vue'),
        meta: { title: '너겟. 취업 가이드' },
      },
      {
        path: 'dashboard',
        component: () => import('pages/AdminDashBoard.vue'),
        meta: { title: '너겟, 관리자 대시보드' },
      },
      {
        path: 'counselingdetail/:id',
        component: () => import('pages/AdminCounselingDetail.vue'),
        meta: { title: '너겟, 관리자 상담 답변' },
        name: 'CounselingDetail',
        props: true,
      },
      {
        path: 'mycounselingdetail/:id',
        component: () => import('pages/MyPageCounselingDetail.vue'),
        name: 'MyPageCounselingDetail',
        meta: { title: '너겟, 내 상담 내역' },
        props: true,
      },
      {
        path: 'admin-job-guide-create',
        component: () => import('pages/AdminJobGuideCreate.vue'),
        meta: { title: '너겟, 관리자 취업 가이드 작성' },
        name: 'AdminJobGuideCreate',
      },
      {
        path: 'admin-job-guide-detail/:id',
        component: () => import('pages/AdminJobGuideDetail.vue'),
        meta: { title: '너겟, 관리자 취업 가이드 상세' },
        name: 'AdminJobGuideDetail',
        props: true,
      },
      {
        path: '/success-detail/:id',
        name: 'AdminSuccessDetail',
        component: () => import('pages/AdminSuccessDetail.vue'),
        props: true,
      },
      {
        path: '/mypage/success-detail/:id',
        name: 'MyPageSuccessDetail',
        component: () => import('pages/MyPageSuccessDetail.vue'),
        meta: { title: '너겟, 내가 쓴 성공 사례' },
        props: true,
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
