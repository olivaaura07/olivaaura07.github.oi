document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const typingElement = document.getElementById('typing-effect');
    const words = ["UI/UX Designer", "Software Engineer", "Creative Thinker"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
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
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple Form Handling (Simulation)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Sending Message...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.textContent = 'Message Sent Successfully';
                btn.style.backgroundColor = '#4A4A4A'; // Success state matches theme
                btn.style.color = '#fff';
                form.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style = ''; // Reset styles
                }, 3000);
            }, 1500);
        });
    }
});
