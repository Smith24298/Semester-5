const { createApp } = Vue;

// Custom directive
const listDirective = {
  mounted(el, binding) {
    const items = binding.value;

    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      el.appendChild(li);
    });
  }
};

// Create Vue 3 application
const app = createApp({
  data() {
    return {
      items: [
        'Subject-1',
        'Subject-2',
        'Subject-3',
        'Subject-4'
      ]
    };
  }
});

// Register the custom directive
app.directive('list', listDirective);

// Mount the application
app.mount('#app');
