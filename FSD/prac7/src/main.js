import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

app.directive("focus", {
  mounted(element) {
    element.focus();
  },
});

app.directive("append-property", {
  mounted(element, binding) {
    element.dataset.propertyCount = String(binding.value?.length ?? 0);
  },
  updated(element, binding) {
    const previousCount = Number(element.dataset.propertyCount ?? 0);
    const currentCount = binding.value?.length ?? 0;

    if (currentCount > previousCount) {
      const appendedProperty = element.lastElementChild;
      appendedProperty?.classList.add("property-card-new");
      appendedProperty?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }

    element.dataset.propertyCount = String(currentCount);
  },
});

app.mount("#app");
