<template>
  <q-dialog v-model="isDialogOpen">
    <q-card class="popup-card">
      <q-card-section>
        <div class="text-h6">비밀번호 확인</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="confirmPassword">
          <q-input
            v-model="password"
            type="password"
            label="비밀번호"
            outlined
            required
            ref="passwordInput"
          />
          <q-btn
            label="확인"
            type="submit"
            color="primary"
            class="q-mt-md full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

const isDialogOpen = ref(false);
const password = ref('');
const $q = useQuasar();
const passwordInput = ref(null);

const username = localStorage.getItem('userName');

function openDialog() {
  isDialogOpen.value = true;
  password.value = ''; // 초기화
  setTimeout(() => {
    passwordInput.value.focus();
  }, 300);
}

function closeDialog() {
  isDialogOpen.value = false;
}

async function confirmPassword() {
  try {
    const response = await api.post('/user/login', {
      username: username,
      password: password.value,
    });

    if (response.data.token) {
      closeDialog();
      $q.notify({
        type: 'positive',
        message: '비밀번호가 확인되었습니다.',
      });
    } else {
      $q.notify({
        type: 'negative',
        message: '비밀번호가 틀렸습니다.',
      });
      password.value = '';
      passwordInput.value.focus();
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '비밀번호 확인 중 오류가 발생했습니다.',
    });
    console.error('비밀번호 확인 오류:', error);
    password.value = '';
    passwordInput.value.focus();
  }
}

defineExpose({ openDialog, closeDialog });
</script>

<style scoped>
.full-width {
  width: 100%;
}

.popup-card {
  width: 400px;
  max-width: 100%;
  padding: 20px;
}
</style>
