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
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    const goToSlide = (index) => {
        // Reset old slide
        slides[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;

        // Set new slide
        slides[currentSlide].classList.add('active');
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

        // Start automatic transition
        startSlideTimer();
    }

    /* Action Gallery Sliders Logic */
    const galleries = document.querySelectorAll('.gallery-slider');

    galleries.forEach(gallery => {
        const photos = gallery.querySelectorAll('.gallery-photo');
        const prevBtn = gallery.querySelector('.prev-gallery');
        const nextBtn = gallery.querySelector('.next-gallery');
        let currentIndex = 0;

        if (photos.length === 0) return;

        const showPhoto = (index) => {
            photos.forEach(p => p.classList.remove('active'));
            photos[index].classList.add('active');
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering modal
                currentIndex = (currentIndex + 1) % photos.length;
                showPhoto(currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering modal
                currentIndex = (currentIndex - 1 + photos.length) % photos.length;
                showPhoto(currentIndex);
            });
        }
    });

    /* Fullscreen Image Modal Logic */
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');
    const allGalleryPhotos = Array.from(document.querySelectorAll('.gallery-photo'));
    const prevModalBtn = document.querySelector('.prev-modal');
    const nextModalBtn = document.querySelector('.next-modal');
    let currentGlobalIndex = 0;

    if (modal && modalImg && closeBtn) {
        const updateModalImage = (index) => {
            if (index < 0) currentGlobalIndex = allGalleryPhotos.length - 1;
            else if (index >= allGalleryPhotos.length) currentGlobalIndex = 0;
            else currentGlobalIndex = index;

            modalImg.src = allGalleryPhotos[currentGlobalIndex].src;
        };

        // Open modal on image click
        allGalleryPhotos.forEach((photo, index) => {
            photo.addEventListener('click', () => {
                currentGlobalIndex = index;
                modal.classList.add('active');
                updateModalImage(currentGlobalIndex);
            });
        });

        if (prevModalBtn) {
            prevModalBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateModalImage(currentGlobalIndex - 1);
            });
        }

        if (nextModalBtn) {
            nextModalBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateModalImage(currentGlobalIndex + 1);
            });
        }

        // Close modal on specific 'X' button click
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal when clicking anywhere outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                modal.classList.remove('active');
            } else if (e.key === 'ArrowLeft') {
                updateModalImage(currentGlobalIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateModalImage(currentGlobalIndex + 1);
            }
        });
    }
});
