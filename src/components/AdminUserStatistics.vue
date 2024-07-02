<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">사용자 통계</div>
        <canvas ref="dailyChartCanvas" />
        <div class="stat-message" v-if="weeklyPromotionSignUpCount !== null">
          홍보일로부터 일주일 동안 평균 가입자수가
          {{ weeklyPromotionSignUpCount }}명 증가했습니다.
          <br />
          <br />
          <br />
        </div>
        <canvas ref="monthlyChartCanvas" />
        <div class="stat-message" v-if="averageDaysToPost !== null">
          가입 후 평균 {{ averageDaysToPost }}일 이후 취업 성공사례 게시글이
          게시되었습니다.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables, zoomPlugin);

const dailyChartCanvas = ref(null);
const monthlyChartCanvas = ref(null);
const dailyChartInstance = ref(null);
const monthlyChartInstance = ref(null);
const weeklyPromotionSignUpCount = ref(null);
const averageDaysToPost = ref(null);

const fetchAndDisplayCharts = async () => {
  const authStore = useAuthStore();

  try {
    if (!authStore.isLoggedIn) {
      console.error('User is not logged in.');
      return;
    }

    const userResponse = await customApi.get('/admin/users');
    const users = userResponse.data;

    const postResponse = await customApi.get('/success-case');
    const posts = postResponse.data;

    const promotionRecords =
      JSON.parse(
        localStorage.getItem(`promotionRecords_${authStore.username}`),
      ) || [];

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
      const month = user.createdDate.split('T')[0].substring(0, 7);
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
      const month = post.createdDate.split('T')[0].substring(0, 7);
      if (monthlyPostCounts[month]) {
        monthlyPostCounts[month]++;
      } else {
        monthlyPostCounts[month] = 1;
      }
    });

    // 일일 홍보 기록 수 집계
    const dailyPromotionCounts = {};
    promotionRecords.forEach(record => {
      if (!record.date) return;
      const date = record.date;
      if (dailyPromotionCounts[date]) {
        dailyPromotionCounts[date]++;
      } else {
        dailyPromotionCounts[date] = 1;
      }
    });

    // 월별 홍보 기록 수 집계
    const monthlyPromotionCounts = {};
    promotionRecords.forEach(record => {
      if (!record.date) return;
      const month = record.date.substring(0, 7);
      if (monthlyPromotionCounts[month]) {
        monthlyPromotionCounts[month]++;
      } else {
        monthlyPromotionCounts[month] = 1;
      }
    });

    // 홍보일로부터 일주일 동안 평균 가입자 수 계산
    let totalSignUps = 0;
    let count = 0;
    Object.keys(dailyPromotionCounts).forEach(promoDate => {
      const promoDateObj = new Date(promoDate);
      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(promoDateObj);
        targetDate.setDate(targetDate.getDate() + i);
        const targetDateString = targetDate.toISOString().split('T')[0];
        if (dailySignUpCounts[targetDateString]) {
          totalSignUps += dailySignUpCounts[targetDateString];
          count++;
        }
      }
    });
    weeklyPromotionSignUpCount.value =
      count > 0 ? Math.round(totalSignUps / count) : 0;

    // 회원 가입 후 평균 성공사례 게시일 계산
    let totalDays = 0;
    let totalCount = 0;
    users.forEach(user => {
      const userDate = new Date(user.createdDate);
      posts.forEach(post => {
        const postDate = new Date(post.createdDate);
        if (postDate > userDate) {
          const diffTime = Math.abs(postDate - userDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalDays += diffDays;
          totalCount++;
        }
      });
    });
    averageDaysToPost.value =
      totalCount > 0 ? Math.round(totalDays / totalCount) : 0;

    const dailyLabels = [
      ...new Set([
        ...Object.keys(dailySignUpCounts),
        ...Object.keys(dailyPromotionCounts),
      ]),
    ].sort();
    const dailySignUpData = dailyLabels.map(
      label => dailySignUpCounts[label] || 0,
    );
    const dailyPromotionData = dailyLabels
      .map(label => dailyPromotionCounts[label] || 0)
      .map((value, index) =>
        value > 0 ? { x: dailyLabels[index], y: value } : null,
      )
      .filter(item => item !== null);

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

    // 일일 차트 생성
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
            type: 'scatter',
            label: '일일 홍보 수',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 5,
            data: dailyPromotionData,
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
            text: '일일 회원 가입 수 및 홍보 수',
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: false,
              },
              pinch: {
                enabled: false,
              },
              mode: 'x',
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'yyyy-MM-dd',
            },
            min: new Date(new Date().setDate(new Date().getDate() - 30))
              .toISOString()
              .split('T')[0],
            max: new Date().toISOString().split('T')[0],
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
            label: '월별 성공사례 게시글 수',
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
            text: '월별 회원 가입 수 및 성공사례 게시글 수',
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: false,
              },
              pinch: {
                enabled: false,
              },
              mode: 'x',
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              tooltipFormat: 'yyyy-MM',
            },
            min: new Date(new Date().setMonth(new Date().getMonth() - 12))
              .toISOString()
              .split('T')[0],
            max: new Date().toISOString().split('T')[0],
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
.stat-message {
  text-align: center;
  font-size: 1.2em;
  margin-top: 10px;
  font-weight: bold;
}
</style>
