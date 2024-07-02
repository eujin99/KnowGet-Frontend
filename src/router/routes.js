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
        children: [
          {
            path: '',
            redirect: { name: 'MyPage.info' },
          },
          {
            path: 'info',
            component: () => import('components/MyPageInfo.vue'),
            meta: { title: '너겟, 내 정보 변경' },
            name: 'MyPage.info',
          },
          {
            path: 'counseling',
            component: () => import('components/MyPageCounseling.vue'),
            meta: { title: '너겟, 상담 내역' },
            name: 'MyPage.counseling',
          },
          {
            path: 'success',
            component: () => import('components/MyPageSuccess.vue'),
            meta: { title: '너겟,취업 성공사례 내역' },
            name: 'MyPage.success',
          },
          {
            path: 'bookmarks',
            component: () => import('components/MyPageBookmarks.vue'),
            meta: { title: '북마크' },
            name: 'MyPage.bookmarks',
          },
        ],
      },
      {
        path: '/guide/:id',
        component: () => import('pages/GuidePageDetails.vue'),
        meta: { title: '너겟. 취업 가이드' },
      },
      {
        path: '/dashboard',
        component: () => import('pages/AdminDashBoard.vue'),
        meta: {
          title: '너겟, 관리자 대시보드',
          requiresAuth: true,
          role: 'ADMIN',
        },
        redirect: '/dashboard/user-management',
        children: [
          {
            path: 'user-management',
            component: () => import('components/AdminUserManagement.vue'),
            meta: { title: '사용자 관리' },
          },
          {
            path: 'user-statistics',
            component: () => import('components/AdminUserStatistics.vue'),
            meta: { title: '이용자 통계' },
          },
          {
            path: 'counseling-management',
            component: () => import('components/AdminCounselingManagement.vue'),
            meta: { title: '상담 관리' },
          },
          {
            path: 'job-guide-management',
            component: () => import('components/AdminJobGuideManagement.vue'),
            meta: { title: '취업 가이드 관리' },
          },
          {
            path: 'success-management',
            component: () => import('components/AdminSuccessManagement.vue'),
            meta: { title: '성공사례 관리' },
          },
          {
            path: 'black-list',
            component: () => import('components/BlackList.vue'),
            meta: { title: '블랙리스트' },
          },
        ],
      },
      {
        path: '/otherpage',
        component: () => import('pages/OtherPage.vue'),
        meta: { title: '접근 불가' },
      },
      {
        path: 'counselingdetail/:id',
        component: () => import('pages/AdminCounselingDetail.vue'),
        meta: { title: '너겟, 관리자 상담 답변' },
        name: 'AdminCounselingDetail',
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
