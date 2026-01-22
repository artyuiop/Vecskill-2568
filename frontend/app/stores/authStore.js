import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";

export const authStore = defineStore('auth', {
    state: () => ({
        token: useCookie('token').value || null,
        profile: []
    }),
    actions: {
        setToken(token){
            useCookie('token', {
                maxAge: 60 * 60 * 40
            })
            const cookie = useCookie('token')
            cookie.value = token
            this.token = token
        },
        logout(){
            const cookie = useCookie('token').value = null
            this.token = null
            navigateTo('/')
        },
        async getProfile(){
            const res = await Fetch(`/api/users/detail/`)
            this.profile = res
        }
    }
})