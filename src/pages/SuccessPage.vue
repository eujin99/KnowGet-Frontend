<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">취업 성공사례</div>
            <p>
              너겟의 도움으로 새로운 길을 찾아낸 분들의 이야기를 들어보세요.
            </p>
          </div>
          <div class="search-container">
            <q-input
              v-model="keyword"
              placeholder="검색어를 입력하세요"
              clearable
              dense
              outlined
              class="search-input"
              @input="handleSearch"
              @blur="validateSearch"
              @keyup.enter="validateSearch"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <transition name="shake">
              <div v-if="searchWarning" class="search-warning">
                두 글자 이상 검색해주세요.
              </div>
            </transition>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="table-container">
          <table class="sc-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성일</th>
                <th>작성자</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sc in paginatedSuccessCases"
                :key="sc.caseId"
                @click="navigateToDetails(sc.caseId)"
                class="table-row"
              >
                <td>{{ sc.index }}</td>
                <td>{{ sc.title }}</td>
                <td>{{ formatDate(sc.createdDate) }}</td>
                <td>{{ sc.username }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination-container">
          <PaginationControl
            :totalPages="totalPages"
            v-model="page"
            class="q-mt-md"
            @update:model-value="updatePagination"
          />
        </div>
        <q-btn
          icon="edit"
          flat
          dense
          label="글쓰기"
          color="primary"
          @click="navigateToWritePage"
          class="write-button"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { date, Notify } from 'quasar';
import { api } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';
import PaginationControl from 'components/PaginationControl.vue';

export default {
  components: {
    PaginationControl,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const successCases = ref([]);
    const keyword = ref('');
    const searchWarning = ref(false);
    const page = ref(parseInt(route.query.page) || 1);
    const itemsPerPage = 6;
    const totalPages = computed(() =>
      Math.ceil(successCases.value.length / itemsPerPage),
    );

    const fetchSuccessCases = async () => {
      try {
        const response = await api.get('/success-case');
        successCases.value = response.data.filter(sc => sc.isApproved === 1);
        successCases.value = successCases.value.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
        );
      } catch (error) {
        console.error('취업 성공 사례 fetch 에러', error);
      }
    };

    const filteredSuccessCases = computed(() => {
      return successCases.value.filter(successCase => {
        if (keyword.value.length < 2) return true;
        return successCase.title.includes(keyword.value);
      });
    });

    const paginatedSuccessCases = computed(() => {
      const start = (page.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredSuccessCases.value
        .slice(start, end)
        .map((successCase, index) => ({
          ...successCase,
          index: start + index + 1,
        }));
    });

    const formatDate = dateString => {
      const dateObj = new Date(dateString);
      return isNaN(dateObj) ? '' : date.formatDate(dateObj, 'YYYY-MM-DD');
    };

    const truncatedContent = content => {
      const maxLength = 100;
      return content.length > maxLength
        ? content.slice(0, maxLength) + '...'
        : content;
    };

    const validateSearch = () => {
      if (keyword.value.length > 0 && keyword.value.length < 2) {
        searchWarning.value = true;
        setTimeout(() => {
          searchWarning.value = false;
        }, 2000);
      }
    };

    const handleSearch = () => {
      page.value = 1;
    };

    const navigateToWritePage = () => {
      if (!authStore.isLoggedIn) {
        Notify.create({
          message: '로그인이 필요한 서비스입니다.',
          color: 'negative',
          position: 'top',
        });
        return;
      }
      router.push({ name: 'SuccessPageWrite' });
    };

    const navigateToDetails = caseId => {
      router.push({
        name: 'SuccessPageDetails',
        params: { caseId: caseId },
        query: { page: page.value },
      });
    };

    const updatePagination = newPage => {
      page.value = newPage;
      fetchSuccessCases();
    };

    watch(page, newPage => {
      router.push({ query: { ...route.query, page: newPage } }).catch(() => {});
    });

    onMounted(fetchSuccessCases);

    return {
      keyword,
      searchWarning,
      page,
      totalPages,
      paginatedSuccessCases,
      fetchSuccessCases,
      navigateToDetails,
      navigateToWritePage,
      formatDate,
      truncatedContent,
      validateSearch,
      handleSearch,
      updatePagination: fetchSuccessCases,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.query.page) {
        vm.page = parseInt(to.query.page);
      }
      vm.fetchSuccessCases();
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.page) {
      this.page = parseInt(to.query.page);
    }
    this.fetchSuccessCases();
    next();
  },
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.page-card {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  max-width: 300px;
  margin-left: auto;
}

.search-input {
  max-width: 300px;
}

.search-warning {
  color: red;
  font-size: 0.75rem;
  margin-top: 5px;
  animation: shake 0.5s;
}

.table-container {
  overflow-x: auto;
}

.sc-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  font-family: sans-serif;
}

.sc-table th,
.sc-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.sc-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.sc-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.sc-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.sc-table tbody tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  position: relative;
}

.write-button {
  margin-left: auto;
}

@media (max-width: 600px) {
  .pagination-container {
    flex-direction: row;
  }

  .write-button {
    margin-left: 0;
    margin-top: 10px;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}
</style>
