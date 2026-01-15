export const alert = ref({
    title: "",
    status: "",
    show: false
})

export const showAlert = (title, status) => {
    alert.value.title = title
    alert.value.status = status
    alert.value.show = true

    setTimeout(() => {
        alert.value.show = false
    }, 1500)
}