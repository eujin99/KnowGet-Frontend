import {defineStore} from 'pinia'
import {api} from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: {}
  }),
  actions: {
    async login(credentials) {
      const response = await api.post('/user/login', credentials)
      this.isLoggedIn = true
      this.user = response.data.user
    },
    logout() {
      this.isLoggedIn = false
      this.user = {}
    }
  }
})
