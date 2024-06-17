<template>
  <div class="row justify-center q-pa-md">
    <q-btn
      dense
      flat
      round
      icon="first_page"
      @click="toFirstPage"
      :disable="isFirstSet"
    />
    <q-btn
      dense
      flat
      round
      icon="chevron_left"
      @click="prevSet"
      :disable="isFirstSet"
    />

    <q-btn
      v-for="n in pagesInSet"
      :key="n"
      dense
      flat
      round
      :label="startPage + n"
      @click="setPage(startPage + n)"
      :color="currentPage === (startPage + n) ? 'primary' : 'grey'"
    />

    <q-btn
      dense
      flat
      round
      icon="chevron_right"
      @click="nextSet"
      :disable="isLastSet"
    />
    <q-btn
      dense
      flat
      round
      icon="last_page"
      @click="toLastPage"
      :disable="isLastSet"
    />
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
  },
  computed: {
    currentPage() {
      return this.modelValue;
    },
    startPage() {
      return Math.floor((this.currentPage - 1) / 10) * 10;
    },
    pagesInSet() {
      return Math.min(10, this.totalPages - this.startPage);
    },
    isFirstSet() {
      return this.startPage === 0;
    },
    isLastSet() {
      return this.startPage + 10 >= this.totalPages;
    },
  },
  methods: {
    setPage(page) {
      this.$emit('update:modelValue', page);
    },
    nextSet() {
      if (!this.isLastSet) {
        this.setPage(this.startPage + 11);
      }
    },
    prevSet() {
      if (!this.isFirstSet) {
        this.setPage(this.startPage - 9);
      }
    },
    toFirstPage() {
      this.setPage(1);
    },
    toLastPage() {
      this.setPage(this.totalPages);
    },
  },
};
</script>

<style scoped>
.q-btn {
  margin: 0 4px;
}
</style>
