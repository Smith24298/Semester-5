// Get createApp from Vue
const { createApp } = Vue;

// Create Vue application
const app = createApp({});

// Register custom directive
app.directive('uppercase', {

    // Vue 3 equivalent of Vue 2 bind()
    mounted(el) {

        // Change cursor to pointer
        el.style.cursor = 'pointer';

        // Add click event
        el.addEventListener('click', () => {

            // Convert text to uppercase
            el.textContent = el.textContent.toUpperCase();

        });
    }
});

// Mount Vue application
app.mount('#app');