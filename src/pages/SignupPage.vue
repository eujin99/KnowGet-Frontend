<template>
  <q-page padding>
    <div class="signup-container">
      <h2>회원가입</h2>
      <q-form @submit.prevent="register">
        <q-input v-model="form.username" label="아이디" outlined required />
        <q-input
          v-model="form.password"
          label="비밀번호"
          type="password"
          outlined
          required
        />
        <q-select
          v-model="form.prefJob"
          label="희망 직종"
          :options="jobOptions"
          outlined
          required
        />
        <q-select
          v-model="form.prefLocation"
          label="희망 근무지"
          :options="locationOptions"
          outlined
          required
        />
        <q-btn
          label="회원가입"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
        />
      </q-form>
      <q-btn label="뒤로가기" flat class="full-width q-mt-sm" @click="goBack" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';

const form = ref({
  username: '',
  password: '',
  prefJob: '',
  prefLocation: '',
});

const router = useRouter();

const jobOptions = [
  { label: '행정 및 사무', value: '0' },
  { label: '마케팅 및 기획', value: '1' },
  { label: '교육, 연구 및 개발', value: '2' },
  { label: '건설 및 시설 관리', value: '3' },
  { label: '보안, 안전 및 재난', value: '4' },
  { label: '의료, 복지 및 지원 서비스', value: '5' },
  { label: '창작 및 미용', value: '6' },
  { label: '요식업, 조리 및 제과', value: '7' },
  { label: '운송, 영업 및 판매', value: '8' },
  { label: '제조 및 기술', value: '9' },
];

const locationOptions = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
].map(location => ({ label: location, value: location }));

const register = async () => {
  try {
    const response = await api.post(
      '/user/register',
      {
        username: form.value.username,
        password: form.value.password,
        prefJob: form.value.prefJob,
        prefLocation: form.value.prefLocation,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data.success) {
      alert('회원가입 성공!');
      router.push('/');
    } else {
      alert('회원가입 실패: ' + response.data.message);
    }
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error.response.data);
    alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: auto;
}

.full-width {
  width: 100%;
}

.q-mt-md {
  margin-top: 1.5rem;
}

.q-mt-sm {
  margin-top: 0.75rem;
}
</style>
