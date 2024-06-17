<template>
  <q-page>
    <div class="mypage-container">
      <div class="mypage-header">
        <q-btn @click="selectTab('info')" :outline="selectedTab !== 'info'"
          >내 정보</q-btn
        >
        <q-btn
          @click="selectTab('history')"
          :outline="selectedTab !== 'history'"
          >상담 내역</q-btn
        >
        <q-btn @click="selectTab('cases')" :outline="selectedTab !== 'cases'"
          >취업 성공사례 내역</q-btn
        >
        <q-btn
          @click="selectTab('bookmarks')"
          :outline="selectedTab !== 'bookmarks'"
          >북마크</q-btn
        >
      </div>

      <q-card v-if="selectedTab === 'info'" class="mypage-card">
        <q-card-section>
          <div class="text-h5">나의 정보 변경</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="updateInfo">
            <q-input
              v-model="formData.username"
              label="아이디"
              dense
              outlined
              readonly
            />
            <q-input
              v-model="formData.password"
              label="비밀번호"
              type="password"
              dense
              outlined
              class="q-mt-md"
            />
            <q-input
              v-model="formData.passwordConfirm"
              label="비밀번호 확인"
              type="password"
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
              label="변경 사항 저장"
              type="submit"
              color="primary"
              class="q-mt-md full-width"
            />
          </q-form>
        </q-card-section>
      </q-card>

      <q-card v-if="selectedTab === 'history'" class="mypage-card">
        <!-- 상담 내역 콘텐츠 -->
        <q-card-section> 상담 내역을 여기에 표시합니다. </q-card-section>
      </q-card>

      <q-card v-if="selectedTab === 'cases'" class="mypage-card">
        <!-- 취업 성공사례 내역 콘텐츠 -->
        <q-card-section>
          취업 성공사례 내역을 여기에 표시합니다.
        </q-card-section>
      </q-card>

      <q-card v-if="selectedTab === 'bookmarks'" class="mypage-card">
        <!-- 북마크 콘텐츠 -->
        <q-card-section> 북마크 내용을 여기에 표시합니다. </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const selectedTab = ref('info');
const formData = ref({
  username: 'username',
  password: '',
  passwordConfirm: '',
  location: '동대문구',
  job: '요식 및 제조',
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
  { label: '요식 및 제조', value: '요식 및 제조' },
  { label: '판매 및 서비스', value: '판매 및 서비스' },
  { label: '의료 및 간호', value: '의료 및 간호' },
  { label: '교육 및 연구', value: '교육 및 연구' },
  { label: '예술 및 스포츠', value: '예술 및 스포츠' },
  { label: '운송 및 물류', value: '운송 및 물류' },
  { label: '농림 및 어업', value: '농림 및 어업' },
];

function selectTab(tab) {
  selectedTab.value = tab;
}

function updateInfo() {
  if (formData.value.password !== formData.value.passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  // 실제 API 호출 로직
  alert('변경 사항이 저장되었습니다.');
}
</script>

<style scoped>
.mypage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.mypage-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.mypage-card {
  width: 100%;
  max-width: 800px;
}
</style>
