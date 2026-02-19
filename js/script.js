document.addEventListener('DOMContentLoaded', function() {
  // ---------- GLOBAL ----------
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Active nav highlight
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Close menu when clicking a link (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // Back to top
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- SCROLL REVEAL (IntersectionObserver) ----------
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => observer.observe(el));

  // ---------- HERO SLIDER (auto & manual) ----------
  const slider = document.getElementById('slider');
  if (slider) {
    const wrapper = slider.querySelector('.slider-wrapper');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
    });
    const dots = slider.querySelectorAll('.dot');
    dots[0].classList.add('active');

    function updateSlider(index) {
      wrapper.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider(currentIndex);
    });
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider(currentIndex);
    });
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        currentIndex = parseInt(e.target.dataset.index);
        updateSlider(currentIndex);
      });
    });

    // Auto slide every 5 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider(currentIndex);
    }, 5000);
  }

  // ---------- GALLERY FILTER & LIGHTBOX ----------
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.querySelector('.close-lightbox');

    // Filter
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
      });
    });

    // Lightbox
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightbox.classList.add('show');
      });
    });
    closeLightbox.addEventListener('click', () => {
      lightbox.classList.remove('show');
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('show');
    });
  }

  // ---------- ANIMATED COUNTERS (About page) ----------
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          let count = 0;
          const update = () => {
            if (count < target) {
              count += Math.ceil(target / 50);
              if (count > target) count = target;
              counter.textContent = count;
              requestAnimationFrame(update);
            } else {
              counter.textContent = target;
            }
          };
          update();
          obs.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ---------- FORM VALIDATION (order & contact) ----------
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = orderForm.querySelector('[name="name"]').value.trim();
      const phone = orderForm.querySelector('[name="phone"]').value.trim();
      const email = orderForm.querySelector('[name="email"]').value.trim();
      const type = orderForm.querySelector('[name="type"]').value;
      const size = orderForm.querySelector('[name="size"]').value;
      const msg = orderForm.querySelector('.form-message');

      if (!name || !phone || !email || !type || !size) {
        msg.textContent = 'Please fill all required fields.';
        msg.className = 'form-message error';
      } else if (!email.includes('@')) {
        msg.textContent = 'Enter a valid email.';
        msg.className = 'form-message error';
      } else {
        msg.textContent = 'Request sent! I’ll reply within 24h.';
        msg.className = 'form-message success';
        orderForm.reset();
        // Prefill WhatsApp (optional)
        const whatsappBtn = document.getElementById('whatsappOrderBtn');
        if (whatsappBtn) {
          const text = `Hello, I'm interested in a ${type} (${size}). My idea: ${orderForm.querySelector('[name="description"]').value}`;
          whatsappBtn.href = `https://wa.me/15551234567?text=${encodeURIComponent(text)}`;
        }
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();
      const msg = contactForm.querySelector('.form-message');

      if (!name || !email || !message) {
        msg.textContent = 'All fields are required.';
        msg.className = 'form-message error';
      } else if (!email.includes('@')) {
        msg.textContent = 'Valid email please.';
        msg.className = 'form-message error';
      } else {
        msg.textContent = 'Message sent. Thanks!';
        msg.className = 'form-message success';
        contactForm.reset();
      }
    });
  }

  // ---------- WHATSAPP ORDER BUTTON (pricing page) ----------
  const whatsappBtn = document.getElementById('whatsappOrderBtn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.getElementById('orderForm');
      const type = form ? form.querySelector('[name="type"]').value : 'custom';
      const size = form ? form.querySelector('[name="size"]').value : 'custom';
      const text = `Hello, I'd like to order a ${type} artwork (${size}). Can we discuss details?`;
      window.open(`https://wa.me/15551234567?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  // ---------- DARK/LIGHT TOGGLE (optional extra) ----------
  // Create toggle button if not exists (simple)
  const nav = document.querySelector('.navbar');
  if (nav && !document.getElementById('themeToggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'themeToggle';
    toggleBtn.innerHTML = '🌙';
    toggleBtn.style.background = 'none';
    toggleBtn.style.border = 'none';
    toggleBtn.style.color = 'white';
    toggleBtn.style.fontSize = '1.5rem';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.marginLeft = '1rem';
    nav.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      if (document.body.classList.contains('light-theme')) {
        toggleBtn.innerHTML = '☀️';
        // simple light theme override
        document.documentElement.style.setProperty('--bg-dark', '#f8fafc');
        document.documentElement.style.setProperty('--bg-card', '#ffffff');
        document.documentElement.style.setProperty('--text-light', '#0f172a');
        document.documentElement.style.setProperty('--text-muted', '#334155');
      } else {
        toggleBtn.innerHTML = '🌙';
        document.documentElement.style.setProperty('--bg-dark', '#0f172a');
        document.documentElement.style.setProperty('--bg-card', '#1e293b');
        document.documentElement.style.setProperty('--text-light', '#f1f5f9');
        document.documentElement.style.setProperty('--text-muted', '#94a3b8');
      }
    });
  }
});
