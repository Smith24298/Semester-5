// app.js

Vue.directive('uppercase', {
  bind(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const text = el.innerText;
      el.innerText = text.toUpperCase();
    });
  }
});

new Vue({
  el: '#app'
});
