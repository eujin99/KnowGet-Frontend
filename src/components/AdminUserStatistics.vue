<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">사용자 통계</div>
        <canvas ref="dailyChartCanvas" />
        <canvas ref="monthlyChartCanvas" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const dailyChartCanvas = ref(null);
const monthlyChartCanvas = ref(null);
const dailyChartInstance = ref(null);
const monthlyChartInstance = ref(null);

const fetchAndDisplayCharts = async () => {
  const authStore = useAuthStore();

  try {
    if (!authStore.isLoggedIn) {
      console.error('User is not logged in.');
      return;
    }

    // Fetch user data
    const userResponse = await customApi.get('/admin/users');
    const users = userResponse.data;

    // Fetch post data
    const postResponse = await customApi.get('/success-case');
    const posts = postResponse.data;

    // 일일 회원 가입 수 집계
    const dailySignUpCounts = {};
    users.forEach(user => {
      if (!user.createdDate) return;
      const date = user.createdDate.split('T')[0];
      if (dailySignUpCounts[date]) {
        dailySignUpCounts[date]++;
      } else {
        dailySignUpCounts[date] = 1;
      }
    });

    // 월별 회원 가입 수 집계
    const monthlySignUpCounts = {};
    users.forEach(user => {
      if (!user.createdDate) return;
      const month = user.createdDate.split('T')[0].substring(0, 7); // 년도와 월 추출
      if (monthlySignUpCounts[month]) {
        monthlySignUpCounts[month]++;
      } else {
        monthlySignUpCounts[month] = 1;
      }
    });

    // 일일 게시글 수 집계
    const dailyPostCounts = {};
    posts.forEach(post => {
      if (!post.createdDate) return;
      const date = post.createdDate.split('T')[0];
      if (dailyPostCounts[date]) {
        dailyPostCounts[date]++;
      } else {
        dailyPostCounts[date] = 1;
      }
    });

    // 월별 게시글 수 집계
    const monthlyPostCounts = {};
    posts.forEach(post => {
      if (!post.createdDate) return;
      const month = post.createdDate.split('T')[0].substring(0, 7); // 년도와 월 추출
      if (monthlyPostCounts[month]) {
        monthlyPostCounts[month]++;
      } else {
        monthlyPostCounts[month] = 1;
      }
    });

    // 최근 한 달 데이터만 추출
    const recentMonth = new Date();
    recentMonth.setMonth(recentMonth.getMonth() - 1);
    const recentMonthString = recentMonth.toISOString().substring(0, 7);

    const dailyLabels = [
      ...new Set([
        ...Object.keys(dailySignUpCounts),
        ...Object.keys(dailyPostCounts),
      ]),
    ]
      .filter(date => date.startsWith(recentMonthString))
      .sort();
    const dailySignUpData = dailyLabels.map(
      label => dailySignUpCounts[label] || 0,
    );
    const dailyPostData = dailyLabels.map(label => dailyPostCounts[label] || 0);

    const monthlyLabels = [
      ...new Set([
        ...Object.keys(monthlySignUpCounts),
        ...Object.keys(monthlyPostCounts),
      ]),
    ].sort();
    const monthlySignUpData = monthlyLabels.map(
      label => monthlySignUpCounts[label] || 0,
    );
    const monthlyPostData = monthlyLabels.map(
      label => monthlyPostCounts[label] || 0,
    );

    if (dailyChartInstance.value) {
      dailyChartInstance.value.destroy();
    }

    if (monthlyChartInstance.value) {
      monthlyChartInstance.value.destroy();
    }

    // 일일 차트 생성 (최근 한 달 데이터)
    dailyChartInstance.value = new Chart(dailyChartCanvas.value, {
      data: {
        labels: dailyLabels,
        datasets: [
          {
            type: 'bar',
            label: '일일 회원 가입 수',
            backgroundColor: 'rgba(66, 165, 245, 0.6)',
            borderColor: 'rgba(66, 165, 245, 1)',
            borderWidth: 1,
            data: dailySignUpData,
          },
          {
            type: 'line',
            label: '일일 게시글 수',
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 5,
            fill: false,
            data: dailyPostData,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: '최근 한 달 일일 회원 가입 수 및 게시글 수',
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'yyyy-MM-dd',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });

    // 월별 차트 생성
    monthlyChartInstance.value = new Chart(monthlyChartCanvas.value, {
      data: {
        labels: monthlyLabels,
        datasets: [
          {
            type: 'bar',
            label: '월별 회원 가입 수',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            data: monthlySignUpData,
          },
          {
            type: 'line',
            label: '월별 게시글 수',
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 5,
            fill: false,
            data: monthlyPostData,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: '월별 회원 가입 수 및 게시글 수',
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              tooltipFormat: 'yyyy-MM',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch user statistics or posts:', error);
  }
};

onMounted(fetchAndDisplayCharts);
</script>

<style scoped>
.user-statistics {
  padding: 20px;
}
</style>
