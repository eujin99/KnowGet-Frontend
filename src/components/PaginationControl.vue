<template>
  <div class="row justify-center q-pa-md pagination-container">
    <q-btn
      dense
      flat
      round
      icon="first_page"
      @click="toFirstPage"
      :disable="currentPage === 1"
    />
    <q-btn
      dense
      flat
      round
      icon="chevron_left"
      @click="prevPage"
      :disable="currentPage === 1"
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
      @click="nextPage"
      :disable="currentPage === totalPages"
    />
    <q-btn
      dense
      flat
      round
      icon="last_page"
      @click="toLastPage"
      :disable="currentPage === totalPages"
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
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
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
.pagination-container {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
}
</style>
