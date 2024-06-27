<template>
  <q-card class="mypage-card">
    <q-card-section>
      <div class="text-h5">나의 정보 변경</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="updateInfo">
        <q-input
          v-model="formData.username"
          label="아이디"
          dense
          outlined
          readonly
          autocomplete="username"
        />
        <q-input
          v-model="formData.password"
          label="비밀번호"
          type="password"
          dense
          outlined
          class="q-mt-md"
          autocomplete="new-password"
        />
        <q-input
          v-model="formData.passwordConfirm"
          label="비밀번호 확인"
          type="password"
          dense
          outlined
          class="q-mt-md"
          autocomplete="new-password"
        />
        <q-select
          v-model="formData.location"
          :options="locationOptions"
          label="근무 희망 지역"
          dense
          outlined
          class="q-mt-md"
        />
        <q-select
          v-model="formData.job"
          :options="jobOptions"
          label="희망 직종"
          dense
          outlined
          class="q-mt-md"
        />
        <q-btn
          label="변경 사항 저장"
          type="submit"
          color="teal-6"
          class="q-mt-md full-width"
        />
        <q-btn
          label="탈퇴하기"
          class="q-mt-md full-width withdraw-btn"
          @click="showWithdrawDialog = true"
        />
      </q-form>
    </q-card-section>

    <q-dialog v-model="showWithdrawDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" />
          <span class="q-ml-md">정말 탈퇴 하시겠습니까?</span>
        </q-card-section>
        <q-card-section>
          <q-btn label="예" color="primary" @click="confirmWithdraw" />
          <q-btn
            label="아니요"
            color="primary"
            flat
            @click="showWithdrawDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useAuthStore} from 'stores/authStore';
import {customApi} from 'boot/axios';
import {useRouter} from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const formData = ref({
  username: '',
  password: '',
  passwordConfirm: '',
  location: '',
  job: '',
});

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
].map(location => ({label: location, value: location}));

const jobOptions = [
  {label: '행정 및 사무', value: '0'},
  {label: '마케팅 및 기획', value: '1'},
  {label: '교육, 연구 및 개발', value: '2'},
  {label: '건설 및 시설 관리', value: '3'},
  {label: '보안, 안전 및 재난', value: '4'},
  {label: '의료, 복지 및 지원 서비스', value: '5'},
  {label: '창작 및 미용', value: '6'},
  {label: '요식업, 조리 및 제과', value: '7'},
  {label: '운송, 영업 및 판매', value: '8'},
  {label: '제조 및 기술', value: '9'},
];

const showWithdrawDialog = ref(false);

const fetchUserData = async () => {
  try {
    if (authStore.isLoggedIn) {
      const response = await customApi.get('/mypage');
      console.log('Fetched user data:', response.data);
      formData.value.username = response.data.username;
      formData.value.location = response.data.prefLocation;
      formData.value.job =
        jobOptions.find(job => job.value === response.data.prefJob)?.label ||
        response.data.prefJob;
    }
  } catch (error) {
    console.error('사용자 정보를 가져오는데 실패했습니다:', error);
  }
};

const updateInfo = async () => {
  if (formData.value.password !== formData.value.passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    await customApi.patch('/mypage/pref-location', {
      location: formData.value.location.value,
    });

    await customApi.patch('/mypage/pref-job', {
      job:
        jobOptions.find(option => option.label === formData.value.job.value)
          ?.value || formData.value.job.value,
    });

    if (formData.value.password) {
      await customApi.patch('/mypage/password', {
        password: formData.value.password,
      });
    }

    alert('변경 사항이 저장되었습니다.');
  } catch (error) {
    console.error('정보 업데이트에 실패했습니다:', error);
    alert('정보 업데이트에 실패했습니다. 나중에 다시 시도해 주세요.');
  }
};

const withdraw = async () => {
  try {
    const response = await customApi.patch('/mypage/deactivate');
    if (response.status === 200) {
      alert(response.data.message);
      authStore.logout();
      router.push('/');
    } else {
      alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('Error during withdrawal:', error);
    alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
  }
};

const confirmWithdraw = async () => {
  await withdraw();
  showWithdrawDialog.value = false;
  alert('탈퇴되었습니다.');
};

onMounted(fetchUserData);
</script>

<style scoped>
.mypage-card {
  width: 100%;
  max-width: 800px;
}

.withdraw-btn {
  border: 1px solid red;
  background-color: transparent;
  color: red;
}
</style>
