<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">사용자 통계</div>
        <canvas ref="chartCanvas" />
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

const chartCanvas = ref(null);
const chartInstance = ref(null);

const fetchAndDisplayChart = async () => {
  const authStore = useAuthStore();

  try {
    if (!authStore.isLoggedIn) {
      console.error('User is not logged in.');
      return;
    }

    const response = await customApi.get('/admin/users');
    const users = response.data;

    // 날짜별 회원 가입 수 집계
    const signUpCounts = {};
    users.forEach(user => {
      if (!user.createdDate) return; // createdDate가 없으면 건너뛰기 !
      const date = user.createdDate.split('T')[0]; // 날짜 부분만 추출
      if (signUpCounts[date]) {
        signUpCounts[date]++;
      } else {
        signUpCounts[date] = 1;
      }
    });

    const labels = Object.keys(signUpCounts).sort();
    const data = labels.map(label => signUpCounts[label]);

    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    //새로운 차트 생성
    chartInstance.value = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '일일 회원 가입 수',
            backgroundColor: 'rgba(66, 165, 245, 0.6)',
            borderColor: 'rgba(66, 165, 245, 1)',
            borderWidth: 1,
            data,
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
            text: '일일 회원 가입 수',
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
  } catch (error) {
    console.error('Failed to fetch user statistics:', error);
  }
};

onMounted(fetchAndDisplayChart);
</script>

<style scoped>
.user-statistics {
  padding: 20px;
}
</style>
