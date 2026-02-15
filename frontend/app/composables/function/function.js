// import axios from "axios";

// export const api = axios.create()

// api.interceptors.request.use((req) => {
//     req.baseURL = "hee"

//     return req
// })

// export const get = async(endpoint) => {
//     try{
//         const res = await api.get(endpoint)
//         return res.data
//     }catch(e){
//         console.log(e);
        
//     }
// }

// export const post = async(endpoint, form) => {
//     try{
//         const res = await api.post(endpoint, form)
//         return res.data
//     }catch(e){
//         console.log(e);
        
//     }
// }

// export const put = async(endpoint, form) => {
//     try{
//         const res = await api.put(endpoint, form)
//         return res.data
//     }catch(e){
//         console.log(e);
        
//     }
// }
// export const del = async(endpoint) => {
//     try{
//         const res = await api.delete(endpoint)
//         return res.data
//     }catch(e){
//         console.log(e);
        
//     }
// }


// export const useValidate = (form) => {
//     const value = Object.values(form)
//     if(value.some((val) => !val)){
//         return false
//     }

//     return true
// }

// export const resetForm = (form) => {
//     Object.keys(form).forEach((key) => {
//         delete form[key]
//     })
// }

// export const showModal = (id) => {
//     document.getElementById(id).show()
// }

// export const closeModal = (id) => {
//     document.getElementById(id).close()
// }

// export const alerts = ref({})

// export const showAlert = (title, status) => {
//     const id = Date.now() + Math.random()

//     const newAlert = {
//         id,
//         title,
//         status
//     }

//     alerts.value.push(newAlert)
//     setTimeout(() => {
        
//     }, 2000);
// }

// export const resetAlert = (id) => {
//     alerts.value = alerts.value.filter(alert => alert.id !== id)
// }