/* ==========================================================================
   NAV: mobile toggle
   ========================================================================== */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  });
});

/* ==========================================================================
   ABOUT: skills / education tabs
   ========================================================================== */
const aboutTabs = document.querySelectorAll('#aboutTabs .tab');
aboutTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    aboutTabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    const key = tab.dataset.tab;
    document.querySelectorAll('#about .tab-panel').forEach(panel => {
      panel.classList.remove('is-active');
    });
    const target = document.getElementById('panel-' + key);
    if (target) target.classList.add('is-active');
  });
});

/* ==========================================================================
   PROJECTS: filter pills over a card grid
   ========================================================================== */
const projectFilters = document.querySelectorAll('#projectFilters .tab');
const projectCards = document.querySelectorAll('#projectGrid .proj-card');

projectFilters.forEach(pill => {
  pill.addEventListener('click', () => {
    projectFilters.forEach(p => p.classList.remove('is-active'));
    pill.classList.add('is-active');

    const filter = pill.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

/* ==========================================================================
   CONTACT FORM: submit to Google Sheets + custom success modal
   ========================================================================== */
const scriptURL = 'https://script.google.com/macros/s/AKfycbzK2AYsTVDLnlU6u_t8b688bOi_kho02JoB4Orwtb9XjdSC3O1ew88EYfUbTPkInpu1_Q/exec';
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submit-btn');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalOkay = document.getElementById('modalOkay');

function openModal() {
  modalBackdrop.classList.add('is-open');
}
function closeModal() {
  modalBackdrop.classList.remove('is-open');
}
modalClose.addEventListener('click', closeModal);
modalOkay.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('your-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email.includes('@') || !message) {
    alert('Please fill out all fields with valid information.');
    return;
  }

  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(() => {
      openModal();
      form.reset();
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert('There was an error submitting your form. Please try again.');
    })
    .finally(() => {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    });
});

/* ==========================================================================
   SCROLL REVEAL
   ========================================================================== */
if (window.ScrollReveal) {
  const sr = ScrollReveal({
    reset: false,
    distance: '48px',
    duration: 900,
    delay: 100,
    easing: 'cubic-bezier(.22,.61,.36,1)'
  });

  sr.reveal('.hero-copy', { origin: 'left' });
  sr.reveal('.hero-figure', { origin: 'right', delay: 200 });
  sr.reveal('.about-text', { origin: 'left' });
  sr.reveal('.about-figure', { origin: 'right', delay: 150 });
  sr.reveal('.achv-card', { origin: 'bottom', interval: 100 });
  sr.reveal('.exp-card', { origin: 'bottom', interval: 100 });
  sr.reveal('.featured-project', { origin: 'bottom' });
  sr.reveal('.proj-card', { origin: 'bottom', interval: 80 });
  sr.reveal('.cred-list', { origin: 'left' });
  sr.reveal('.lang-list', { origin: 'right', delay: 150 });
  sr.reveal('.contact-details', { origin: 'left' });
  sr.reveal('.contact-form-wrap', { origin: 'right', delay: 150 });
}

(function () {
  const track = document.getElementById('sweepTrack-am');
  const dotsWrap = document.getElementById('sweepDots-am');
  if (!track || !dotsWrap) return;

  const slides = track.children.length;
  let index = 0;

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.children;

  function goTo(i) {
    index = (i + slides) % slides;
    track.style.transform = `translateX(-${index * (100 / slides)}%)`;
    [...dots].forEach((d, di) => d.classList.toggle('is-active', di === index));
    track.querySelectorAll('video').forEach(v => { if (!v.parentElement.isEqualNode(track.children[index])) v.pause(); });
  }

  // Arrow buttons
  const prevBtn = document.getElementById('sweepPrev-am');
  const nextBtn = document.getElementById('sweepNext-am');
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); clearInterval(auto); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); clearInterval(auto); });


  // Swipe support
  let startX = 0, isDown = false;
  track.addEventListener('pointerdown', e => { isDown = true; startX = e.clientX; });
  track.addEventListener('pointerup', e => {
    if (!isDown) return;
    isDown = false;
    const diff = e.clientX - startX;
    if (diff > 40) goTo(index - 1);
    else if (diff < -40) goTo(index + 1);
  });

  // Auto-sweep every 4s, pauses while a video plays
  let auto = setInterval(() => {
    const activeSlide = track.children[index];
    const vid = activeSlide.querySelector('video');
    if (vid && !vid.paused) return;
    goTo(index + 1);
  }, 4000);

  track.addEventListener('pointerdown', () => clearInterval(auto));
})();

/* ==========================================================================
   TYPED.JS — rotating role text
   ========================================================================== */
if (window.Typed) {
  new Typed('.typed-text', {
    strings: ['Mechanical Engineering Undergrad', 'Frontend Developer'],
    typeSpeed: 65,
    backSpeed: 40,
    backDelay: 1400,
    smartBackspace: true,
    loop: true
  });
}