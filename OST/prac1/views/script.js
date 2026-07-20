// Dark Mode Toggle
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            html.setAttribute('data-theme', savedTheme);
            themeToggle.innerHTML = savedTheme === 'dark' ? '&#9788;' : '&#9790;';
        }

        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeToggle.innerHTML = next === 'dark' ? '&#9788;' : '&#9790;';
        });

        // Typewriter Effect
        const words = ["Hello, I'm Smith Faldu", "Hi, I'm Smith Faldu", "Hey, I'm Smith Faldu"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typewriterEl = document.getElementById('typewriter');

        function typeEffect() {
            const currentWord = words[wordIndex];
            if (!isDeleting) {
                typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, 2000);
                    return;
                }
            } else {
                typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
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
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Animate skill bars inside revealed section
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                        bar.style.width = bar.dataset.width + '%';
                    });
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        // Active Nav Link
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop - 120;
                if (window.scrollY >= top) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });

            // Header shadow on scroll
            document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
        });

        // Contact Form Submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = {
                    name: form.name.value,
                    email: form.email.value,
                    subject: form.subject.value,
                    message: form.message.value
                };
                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    const result = await response.json();
                    if (response.ok && result.success) {
                        alert('Message sent successfully!');
                        form.reset();
                    } else {
                        alert(result.message || 'Something went wrong. Please try again.');
                    }
                } catch (error) {
                    alert('Network error. Please check your connection and try again.');
                }
            });
        }