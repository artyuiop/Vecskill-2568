// export const alert = ref({
//     title: "",
//     status: "",
//     show: false
// })

// export const showAlert = (title, status) => {
//     alert.value.title = title
//     alert.value.status = status
//     alert.value.show = true

//     setTimeout(() => {
//         alert.value.show = false
//     }, 1500)
// }

export const alerts = ref([])

export const showAlert = (title, status) => {
    const id = Date.now() + Math.random()

    const newAlert = {
        id,
        title,
        status
    }

    alerts.value.push(newAlert)
    setTimeout(() => {
        removeAlert(id)
    }, 2000);
}

export const removeAlert = (id) => {
    alerts.value = alerts.value.filter(alert => alert.id !== id)
}