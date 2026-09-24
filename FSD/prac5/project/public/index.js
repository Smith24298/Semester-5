// Initialize Bootstrap components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Enable tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Enable popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.forEach(popoverTriggerEl => {
    new bootstrap.Popover(popoverTriggerEl);
  });

  // Example: auto‑close navbar on link click (mobile)
  const navLinks = document.querySelectorAll('#mainNav .nav-link');
  const navbarCollapse = document.getElementById('mainNav');
  const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.getComputedStyle(navbarCollapse).display !== 'none') {
        bsCollapse.hide();
      }
    });
  });
});