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
                <q-icon name="search"/>
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
        <div v-if="paginatedSuccessCases.length === 0" class="no-data">
          “아직 등록된 취업 성공사례 글이 없어요. 혹시 취업에 성공하셨다면, 다른 분들을 위해 취업 성공 사례를 남겨주세요!”
        </div>
        <div v-else class="sc-container">
          <q-card
            v-for="sc in paginatedSuccessCases"
            :key="sc.caseId"
            class="sc-card"
            @click="navigateToDetails(sc.caseId)"
            flat
            bordered
          >
            <q-card-section>
              <div class="sc-header">
                <div class="sc-title" :title="sc.title">
                  {{ sc.title }}
                </div>
                <div class="sc-meta">
                  <div class="sc-date">
                    {{ formatDate(sc.createdDate) }}
                  </div>
                  <div class="sc-author">작성자: {{ sc.username }}</div>
                </div>
              </div>
              <div class="sc-content" v-html="truncatedContent(sc.content)">
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="pagination-container">
          <PaginationControl
            :totalPages="totalPages"
            v-model="page"
            class="q-mt-md"
            @update:model-value="updatePagination"
          />
        </div>
        <q-btn icon="edit" flat dense label="글쓰기" color="primary" @click="navigateToWritePage" class="write-button"/>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {date, Notify} from "quasar";
import {api} from 'boot/axios';
import {useAuthStore} from 'stores/authStore';
import PaginationControl from 'components/PaginationControl.vue';

export default {
  components: {
    PaginationControl
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
        successCases.value = response.data.filter(
          sc => sc.isApproved === 1,
        );
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
      return filteredSuccessCases.value.slice(start, end).map((successCase, index) => ({
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
      router.push({name: 'SuccessPageWrite'});
    };

    const navigateToDetails = caseId => {
      router.push({
        name: 'SuccessPageDetails',
        params: {caseId: caseId},
        query: {page: page.value},
      });
    };

    const updatePagination = newPage => {
      page.value = newPage;
      fetchSuccessCases();
    };

    watch(page, (newPage) => {
      router.push({query: {...route.query, page: newPage}}).catch(() => {
      });
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
    }
  },
  // 페이지가 로드되기 전과 업데이트 될 때 쿼리 파라미터를 이용해 상태를 복원
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

.sc-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.sc-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 200px;
  padding: 15px;
}

.sc-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
  background-color: rgba(230, 230, 230, 0.685);
}

.sc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sc-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
  max-width: 65%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sc-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.sc-date {
  font-size: 0.85rem;
  color: gray;
}

.sc-author {
  margin-top: 5px;
  font-size: 0.75rem;
  color: gray;
}

.sc-content {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #555;
  max-height: 4.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
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
