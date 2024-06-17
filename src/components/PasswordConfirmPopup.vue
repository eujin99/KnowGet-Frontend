<!-- src/components/PasswordConfirmPopup.vue -->
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

const isDialogOpen = ref(false);
const password = ref('');

function openDialog() {
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}

function confirmPassword() {
  // Dummy password check for demonstration
  if (password.value === '0000') {
    closeDialog();
    window.location.href = '/mypage';
  } else {
    alert('비밀번호가 틀렸습니다.');
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
