// JavaScript source code
const { createApp, ref } = Vue

createApp({
    setup() {
        const message = ref('Hello vue!')
        return { message }
    }
}).mount('#app')
