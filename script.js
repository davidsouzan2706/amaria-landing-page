document.addEventListener("DOMContentLoaded", () => {

    /* Intersection Observer for Animações de Scroll */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Dispara quando 15% do elemento estiver visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe 'visible' para iniciar a animação CSS
                entry.target.classList.add('visible');

                // Se o elemento contiver a classe que guarda o número (data-card ou femicide-stat-box), dispara a animação
                if (entry.target.classList.contains('data-card') || entry.target.classList.contains('femicide-stat-box')) {
                    const numberEl = entry.target.querySelector('.number');
                    if (numberEl && !numberEl.classList.contains('animated')) {
                        animateValue(numberEl, 0, parseInt(numberEl.getAttribute('data-target')), 2000);
                        numberEl.classList.add('animated');
                    }
                }

                // Nós não interrompemos a observação se houver múltiplos scroll up/down
                // mas caso queira que anime só uma vez, descomente a linha abaixo
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos com fade-in, slide e os containeres de números
    const animatableElements = document.querySelectorAll('.fade-in, .slide-right, .data-card, .femicide-stat-box');
    animatableElements.forEach(el => observer.observe(el));


    /* Função para animar os contadores números (Counter Up) */
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out quad
            const easeOutProgress = 1 - (1 - progress) * (1 - progress);

            obj.innerHTML = Math.floor(easeOutProgress * (end - start) + start);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end; // Assegura o valor exato no final
            }
        };
        window.requestAnimationFrame(step);
    }

    /* Hero Background Slider Logic */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    const goToSlide = (index) => {
        // Reset old slide
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;

        // Set new slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        goToSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        goToSlide(currentSlide - 1);
    };

    const startSlideTimer = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // 5 seconds per slide
    };

    if (slides.length > 0) {
        // Initialize buttons
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideTimer(); // Reset timer on manual action
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideTimer();
        });

        // Initialize dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                startSlideTimer();
            });
        });

        // Start automatic transition
        startSlideTimer();
    }
});
