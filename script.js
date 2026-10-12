// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .skill-card, .project-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => { follower.style.width = '50px'; follower.style.height = '50px'; follower.style.borderColor = 'rgba(167,139,250,0.8)'; });
  el.addEventListener('mouseleave', () => { follower.style.width = '32px'; follower.style.height = '32px'; follower.style.borderColor = 'rgba(167,139,250,0.5)'; });
});

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// ===== ACTIVE NAV LINKS =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector('.nav-link[href="#' + id + '"]');
    if (link) {
      if (scrollY >= top && scrollY < top + height) { link.classList.add('active'); }
      else { link.classList.remove('active'); }
    }
  });
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== TYPED TEXT =====
const typedEl = document.getElementById('typed-text');
const words = ['Web Apps', 'Scalable APIs', 'Beautiful UIs', 'Digital Experiences', 'Full-Stack Solutions'];
let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
  const word = words[wordIndex];
  typedEl.textContent = isDeleting ? word.substring(0, charIndex--) : word.substring(0, charIndex++);
  if (!isDeleting && charIndex > word.length) {
    setTimeout(() => { isDeleting = true; typeWriter(); }, 2000);
    return;
  }
  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeWriter, 400);
    return;
  }
  setTimeout(typeWriter, isDeleting ? 60 : 100);
}
setTimeout(typeWriter, 800);

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => observer.observe(el));

// ===== SKILL BAR ANIMATIONS =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        setTimeout(() => { fill.style.width = fill.getAttribute('data-width') + '%'; }, 300);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// ===== SKILL FILTER =====
document.querySelectorAll('.skill-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.getAttribute('data-cat');
    document.querySelectorAll('.skill-card').forEach(card => {
      if (cat === 'all' || card.getAttribute('data-cat') === cat) {
        card.classList.remove('hidden');
        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; card.style.transition = 'opacity 0.3s, transform 0.3s'; }, 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 40);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
  particles = [];
  const count = Math.floor(window.innerWidth / 20);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1
    });
  }
}
createParticles();

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(167, 139, 250, ' + p.opacity + ')';
    ctx.fill();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = 'rgba(167, 139, 250, ' + (0.06 * (1 - dist / 120)) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const label = document.getElementById('submit-label');
  const success = document.getElementById('form-success');
  label.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    label.textContent = 'Send Message';
    btn.disabled = false;
    success.classList.add('show');
    e.target.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1500);
});

// ===== FOOTER YEAR =====
document.getElementById('footer-year').textContent = new Date().getFullYear();

