const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .portfolio-item, .about-text, .contact-link').forEach(el => {
    observer.observe(el);
});

const aboutImagesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.about-img').forEach((img, i) => {
                setTimeout(() => img.classList.add('visible'), i * 60);
            });
            aboutImagesObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

const aboutImagesContainer = document.querySelector('.about-images');
if (aboutImagesContainer) {
    aboutImagesObserver.observe(aboutImagesContainer);
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.55 });

sections.forEach(section => scrollSpyObserver.observe(section));

const heroImage = document.querySelector('.hero-image');
const pupils = document.querySelectorAll('.pupil');
const eyes = document.querySelectorAll('.eye');
const homeSection = document.getElementById('home');
const customEmoji = document.getElementById('custom-emoji');
const logoContainer = document.querySelector('.logo');

let isHomeVisible = false;
let isScrolling = false;
let scrollTimeout;
let rafPending = false;
let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;
let mouseTrackingActive = false;

window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 80);
}, { passive: true });

function handleHeroMouseMove(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (rafPending) return;
    rafPending = true;

    requestAnimationFrame(() => {
        if (!isHomeVisible) {
            rafPending = false;
            return;
        }

        if (heroImage && !isScrolling) {
            const x = (window.innerWidth / 2 - lastMouseX) / 80;
            const y = (window.innerHeight / 2 - lastMouseY) / 80;
            heroImage.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }

        if (pupils.length > 0) {
            pupils.forEach((pupil) => {
                const rect = pupil.parentElement.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;
                const angle = Math.atan2(lastMouseY - eyeCenterY, lastMouseX - eyeCenterX);
                const distance = Math.min(
                    2,
                    Math.hypot(lastMouseX - eyeCenterX, lastMouseY - eyeCenterY) / 24
                );

                pupil.style.transform = `translate3d(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px, 0)`;
            });
        }

        rafPending = false;
    });
}

function enableHeroTracking() {
    if (mouseTrackingActive) return;
    document.addEventListener('mousemove', handleHeroMouseMove, { passive: true });
    mouseTrackingActive = true;
}

function disableHeroTracking() {
    if (!mouseTrackingActive) return;
    document.removeEventListener('mousemove', handleHeroMouseMove);
    mouseTrackingActive = false;
    rafPending = false;
}

function resetHeroEffects() {
    if (heroImage) {
        heroImage.style.transform = 'translate3d(0, 0, 0)';
    }

    pupils.forEach((pupil) => {
        pupil.style.transform = 'translate3d(0, 0, 0)';
    });
}

function updateHeroActivity(active) {
    isHomeVisible = active;

    if (customEmoji && logoContainer) {
        customEmoji.classList.toggle('hidden-emoji', !active);
        customEmoji.classList.toggle('hero-active', active);
        logoContainer.classList.toggle('no-emoji', !active);
    }

    if (active) {
        enableHeroTracking();
    } else {
        disableHeroTracking();
        resetHeroEffects();
    }
}

if (homeSection) {
    const homeObserver = new IntersectionObserver((entries) => {
        updateHeroActivity(entries[0].isIntersecting);
    }, { threshold: 0.25 });

    homeObserver.observe(homeSection);
}

const contactBtn = document.querySelector('.cta-buttons .btn-primary');

if (contactBtn && eyes.length > 0) {
    contactBtn.addEventListener('mouseenter', () => {
        eyes.forEach(eye => eye.classList.add('large'));
        pupils.forEach(pupil => pupil.classList.add('large'));
    });

    contactBtn.addEventListener('mouseleave', () => {
        eyes.forEach(eye => eye.classList.remove('large'));
        pupils.forEach(pupil => pupil.classList.remove('large'));
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('portfolio-modal');

    if (modal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalTech = document.getElementById('modal-tech');
        const liveLink = document.getElementById('modal-live-link');
        const repoLink = document.getElementById('modal-repo-link');
        const closeButton = document.querySelector('.close-button');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.dataset.title;
                const description = item.dataset.description;
                const tech = item.dataset.tech;
                const liveUrl = item.dataset.liveUrl;
                const repoUrl = item.dataset.repoUrl;
                const imgSrc = item.querySelector('img').src;

                modalTitle.textContent = title;
                modalDescription.textContent = description;
                modalTech.textContent = tech;
                liveLink.href = liveUrl;
                repoLink.href = repoUrl;
                modalImg.src = imgSrc;

                liveLink.style.display = liveUrl === '#' ? 'none' : 'inline-block';
                repoLink.style.display = repoUrl === '#' ? 'none' : 'inline-block';

                modal.style.display = 'block';
                document.body.classList.add('modal-open');
            });
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        };

        closeButton.addEventListener('click', closeModal);

        window.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }

    const emailLink = document.getElementById('email-link');

    if (emailLink) {
        emailLink.addEventListener('click', function (event) {
            event.preventDefault();

            if (emailLink.classList.contains('email-is-copied')) return;

            const email = 'rafascosta2017@gmail.com';

            navigator.clipboard.writeText(email).then(() => {
                emailLink.classList.add('email-is-copied');
                setTimeout(() => {
                    emailLink.classList.remove('email-is-copied');
                }, 2000);
            }).catch(() => {
                window.location.href = 'mailto:' + email;
            });
        });
    }
});
// Observer para os cards de certificado
document.querySelectorAll('.cert-card').forEach((card, i) => {
    const certObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 60);
                certObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    certObserver.observe(card);
});