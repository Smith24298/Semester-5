// app.js

Vue.directive('list', {
  bind(el, binding) {
    const ul = document.createElement('ul');
    binding.value.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    el.appendChild(ul);
  }
});

new Vue({
  el: '#app',
  data: {
    items: ['Subject-1', 'Subject-2', 'Subject-3','Subject-4'] // Sample list of items
  }
});
