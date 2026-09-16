$(function () {
  // Dark Mode Toggle
  const $themeToggle = $('#themeToggle');
  const $html = $('html');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    $html.attr('data-theme', savedTheme);
    $themeToggle.html(savedTheme === 'dark' ? '&#9788;' : '&#9790;');
  }

  $themeToggle.on('click', function () {
    const current = $html.attr('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    $html.attr('data-theme', next);
    localStorage.setItem('theme', next);
    $(this).html(next === 'dark' ? '&#9788;' : '&#9790;');
  });

  // Typewriter Effect
  const words = [
    "Hello, I'm Smith Faldu",
    "Hi, I'm Smith Faldu",
    "Hey, I'm Smith Faldu",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const $typewriterEl = $('#typewriter');

  function typeEffect() {
    const currentWord = words[wordIndex];
    if (!isDeleting) {
      $typewriterEl.text(currentWord.substring(0, charIndex + 1));
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      $typewriterEl.text(currentWord.substring(0, charIndex - 1));
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }
  typeEffect();

  // Scroll Reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
          // Animate skill bars inside revealed section
          $(entry.target).find('.skill-bar-fill').each(function () {
            $(this).css('width', $(this).data('width') + '%');
          });
        }
      });
    },
    { threshold: 0.15 }
  );

  $('.reveal').each(function () {
    revealObserver.observe(this);
  });

  // Active Nav Link & Header shadow on scroll
  const $sections = $('section[id]');
  const $navLinks = $('nav a');
  const $header = $('#header');

  $(window).on('scroll', function () {
    let current = '';
    $sections.each(function () {
      const top = $(this).offset().top - 120;
      if ($(window).scrollTop() >= top) {
        current = $(this).attr('id');
      }
    });
    $navLinks.each(function () {
      $(this).toggleClass('active', $(this).attr('href') === '#' + current);
    });

    $header.toggleClass('scrolled', $(window).scrollTop() > 50);
  });

  // EmailJS Form Submission
  emailjs.init('cWWoAGn2rQ6197oRI');

  const $form = $('#contactForm');

  $form.on('submit', function (event) {
    event.preventDefault();
    // Current date & time
    $('#time').val(new Date().toLocaleString());

    emailjs
      .sendForm('service_pctc8lo', 'template_qlhqs0n', this)
      .then(() => {
        alert('Message sent successfully!');
        $form[0].reset();
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to send message.');
      });
  });
});