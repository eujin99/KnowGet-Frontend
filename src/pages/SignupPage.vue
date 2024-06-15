<!-- src/pages/SignupPage.vue -->
<template>
  <q-page>
    <div class="signup-container">
      <q-card class="signup-card">
        <q-card-section>
          <div class="text-h5">회원 가입</div>
          <p class="subtext">
            당신이 다시 일어설 수 있게 너겟이 함께해요. 회원가입 후 너겟의
            서비스를 이용해 보세요.
          </p>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit">
            <q-input
              v-model="formData.username"
              label="아이디"
              :rules="[val => !!val || '아이디를 입력해주세요']"
              dense
              outlined
            />
            <q-input
              v-model="formData.password"
              label="비밀번호"
              type="password"
              :rules="[val => !!val || '비밀번호를 입력해주세요']"
              dense
              outlined
              class="q-mt-md"
            />
            <q-input
              v-model="formData.passwordConfirm"
              label="비밀번호 확인"
              type="password"
              :rules="[
                val =>
                  val === formData.password || '비밀번호가 일치하지 않습니다.',
              ]"
              dense
              outlined
              class="q-mt-md"
            />
            <q-select
              v-model="formData.location"
              :options="locations"
              label="근무 희망 지역"
              dense
              outlined
              class="q-mt-md"
            />
            <q-select
              v-model="formData.job"
              :options="jobs"
              label="희망 직종"
              dense
              outlined
              class="q-mt-md"
            />
            <q-btn
              label="가입하기"
              type="submit"
              color="primary"
              class="q-mt-md full-width"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  username: '',
  password: '',
  passwordConfirm: '',
  location: null,
  job: null,
});

const locations = [
  { label: '강남구', value: '강남구' },
  { label: '강동구', value: '강동구' },
  { label: '강북구', value: '강북구' },
  { label: '강서구', value: '강서구' },
  { label: '관악구', value: '관악구' },
  { label: '광진구', value: '광진구' },
  { label: '구로구', value: '구로구' },
  { label: '금천구', value: '금천구' },
  { label: '노원구', value: '노원구' },
  { label: '도봉구', value: '도봉구' },
  { label: '동대문구', value: '동대문구' },
  { label: '동작구', value: '동작구' },
  { label: '마포구', value: '마포구' },
  { label: '서대문구', value: '서대문구' },
  { label: '서초구', value: '서초구' },
  { label: '성동구', value: '성동구' },
  { label: '성북구', value: '성북구' },
  { label: '송파구', value: '송파구' },
  { label: '양천구', value: '양천구' },
  { label: '영등포구', value: '영등포구' },
  { label: '용산구', value: '용산구' },
  { label: '은평구', value: '은평구' },
  { label: '종로구', value: '종로구' },
  { label: '중구', value: '중구' },
  { label: '중랑구', value: '중랑구' },
];

const jobs = [
  { label: '관리직', value: '관리직' },
  { label: '사무직', value: '사무직' },
  { label: '기술직', value: '기술직' },
  // ... 희망 직종 10개 들어가면 됩니덩~
];

function onSubmit() {
  if (formData.value.password !== formData.value.passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  // 회원가입 로직은 여기 들어가면 됩니다. 이건 임시에요..
  localStorage.setItem('userName', formData.value.username);
  localStorage.setItem('location', formData.value.location);
  alert('회원가입이 완료되었습니다.');
  router.push('/'); // 회원가입 후 메인 페이지로 이동
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
}

.signup-card {
  width: 400px;
  max-width: 90%;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subtext {
  font-size: 0.9rem;
  color: gray;
  margin-bottom: 20px;
}
</style>
