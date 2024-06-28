<template>
  <div class="pagination-container">
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
      @click="prevPageSet"
      :disable="currentPage <= 5"
    />

    <q-btn
      v-for="n in pagesInSet"
      :key="n"
      dense
      flat
      round
      :label="startPage + n - 1"
      @click="setPage(startPage + n - 1)"
      :color="currentPage === startPage + n - 1 ? 'primary' : 'grey'"
    />

    <q-btn
      dense
      flat
      round
      icon="chevron_right"
      @click="nextPageSet"
      :disable="currentPage > totalPages - 5"
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
      return Math.floor((this.currentPage - 1) / 5) * 5 + 1;
    },
    pagesInSet() {
      return Math.min(5, this.totalPages - this.startPage + 1);
    },
  },
  methods: {
    setPage(page) {
      this.$emit('update:modelValue', page);
    },
    nextPageSet() {
      const nextPageSetStart = this.startPage + 5;
      this.setPage(Math.min(nextPageSetStart, this.totalPages));
    },
    prevPageSet() {
      const prevPageSetEnd = this.startPage - 1;
      this.setPage(Math.max(prevPageSetEnd, 1));
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
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
