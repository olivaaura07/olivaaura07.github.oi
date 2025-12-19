document.addEventListener('DOMContentLoaded', () => {
    // 1. Typing Effect
    const typingElement = document.getElementById('typing-effect');
    const words = ["UI/UX Designer", "Software Engineer", "Creative Thinker"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        if (!typingElement) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 2. Scroll Reveal Animation (Staggered Support)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Contact Form Simulation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;

            btn.style.transition = "all 0.3s ease";
            btn.textContent = 'Mengirim...';
            btn.style.opacity = '0.7';
            btn.style.transform = "scale(0.95)";

            setTimeout(() => {
                btn.textContent = 'Pesan Terkirim';
                btn.style.backgroundColor = '#4A4A4A';
                btn.style.color = '#fff';
                btn.style.transform = "scale(1)";
                form.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style = '';
                }, 3000);
            }, 1000);
        });
    }
});
