const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const desktopNav = document.getElementById('desktopNav');
const navActions = document.querySelector('.nav-actions');
const navLinks = document.querySelectorAll('nav a, .mobile-nav a');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const testimonialTrack = document.getElementById('testimonialTrack');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');
const faqItems = document.querySelectorAll('.faq-item');
const projectGrid = document.getElementById('projectGrid');
const filterButtons = document.querySelectorAll('.btn-filter');
const counters = document.querySelectorAll('[data-target]');
const form = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const sections = document.querySelectorAll('.section');
let testimonialIndex = 0;

const hideAllSections = () => sections.forEach(section => section.classList.add('hidden'));
const showSection = (targetId) => {
  hideAllSections();
  const targetSection = document.querySelector(targetId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

hideAllSections();
const initialHash = window.location.hash;
if (initialHash && document.querySelector(initialHash)) {
  showSection(initialHash);
} else {
  showSection('#home');
}

desktopNav.classList.remove('active');
navActions.classList.remove('active');
mobileNav.classList.remove('active');
mobileNav.setAttribute('aria-hidden', 'true');
mobileBtn.setAttribute('aria-expanded', 'false');

mobileBtn.addEventListener('click', () => {
  const isMobile = window.innerWidth < 780;
  if (isMobile) {
    const isActive = mobileNav.classList.toggle('active');
    mobileBtn.setAttribute('aria-expanded', isActive);
    mobileNav.setAttribute('aria-hidden', !isActive);
  } else {
    const isActive = desktopNav.classList.toggle('active');
    navActions.classList.toggle('active');
    mobileBtn.setAttribute('aria-expanded', isActive);
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      event.preventDefault();
      showSection(targetId);
      window.history.replaceState(null, '', targetId);
    }

    if (window.innerWidth < 780) {
      mobileNav.classList.remove('active');
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });
});

const whatsappBaseUrl = 'https://wa.me/917078124039';
const createServiceQuoteButtons = () => {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    const serviceTitle = card.querySelector('h3')?.innerText.trim();
    if (!serviceTitle) return;

    const quoteLink = document.createElement('a');
    quoteLink.href = '#';
    quoteLink.className = 'btn-secondary btn-service-quote';
    quoteLink.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Get Quote';

    quoteLink.addEventListener('click', (event) => {
      event.preventDefault();
      const message = `Hello RP Enterprises,%0A%0AI am interested in your ${encodeURIComponent(serviceTitle)} service.%0APlease send me a quote and more details.%0A%0AThank you.`;
      window.open(`${whatsappBaseUrl}?text=${message}`, '_blank');
    });

    card.appendChild(quoteLink);
  });
};
createServiceQuoteButtons();

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  scrollTopBtn.classList.toggle('visible', currentScroll > 500);
  document.querySelectorAll('header a').forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      const sectionTop = section.offsetTop - 110;
      const sectionHeight = section.offsetHeight;
      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        document.querySelectorAll('header nav a').forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

scrollTopBtn.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

const animateCounters = () => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / 90;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 25);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

const statsSection = document.getElementById('stats');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(statsSection);
    }
  });
}, { threshold: 0.3 });
statsObserver.observe(statsSection);

const updateTestimonialPosition = () => {
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
};
prevTestimonial.addEventListener('click', () => {
  testimonialIndex = Math.max(testimonialIndex - 1, 0);
  updateTestimonialPosition();
});
nextTestimonial.addEventListener('click', () => {
  testimonialIndex = Math.min(testimonialIndex + 1, testimonialTrack.children.length - 1);
  updateTestimonialPosition();
});

faqItems.forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpening = !item.classList.contains('active');
    faqItems.forEach(i => {
      i.classList.remove('active');
      const icon = i.querySelector('.faq-question i');
      if (icon) {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
      }
    });

    if (isOpening) {
      item.classList.add('active');
      const icon = item.querySelector('.faq-question i');
      if (icon) {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      }
    }
  });
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.getAttribute('data-filter');
    projectGrid.querySelectorAll('.project-card').forEach(card => {
      const category = card.getAttribute('data-category');
      card.style.display = filter === 'all' || category === filter ? 'grid' : 'none';
    });
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const service = form.service.value;
  const message = form.message.value.trim();
  if (!name || !phone || !email || !service || !message) {
    formFeedback.textContent = 'Please fill in all fields before submitting.';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    formFeedback.textContent = 'Please enter a valid email address.';
    return;
  }

  const whatsappMessage = `Hello RP Enterprises,%0A%0AMy name is ${encodeURIComponent(name)}.%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0AService: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(message)}%0A%0APlease get back to me.`;
  const whatsappUrl = `https://wa.me/917078124039?text=${whatsappMessage}`;
  window.open(whatsappUrl, '_blank');

  formFeedback.textContent = 'Opening WhatsApp with your details...';
  form.reset();
  setTimeout(() => formFeedback.textContent = '', 5000);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const parentSection = target.closest('.section');
      if (target.classList.contains('section')) {
        showSection(targetId);
      } else if (parentSection) {
        showSection(`#${parentSection.id}`);
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
