const mobileToggle = document.querySelector('.mobile-menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');

mobileToggle.addEventListener('click', () => {
  const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
  mobileToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('site-nav-mobile');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (siteNav.classList.contains('site-nav-mobile')) {
      siteNav.classList.remove('site-nav-mobile');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.45,
};

const highlightNav = (entries) => {
  entries.forEach((entry) => {
    const navLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
    if (!navLink) return;
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove('active'));
      navLink.classList.add('active');
    }
  });
};

const sectionObserver = new IntersectionObserver(highlightNav, observerOptions);
sections.forEach((section) => sectionObserver.observe(section));

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

const handleContactSubmit = async (event) => {
  event.preventDefault();

  if (!contactForm) {
    return;
  }

  const formData = new FormData(contactForm);
  const payload = {
    contactName: formData.get('contactName'),
    contactEmail: formData.get('contactEmail'),
    contactMessage: formData.get('contactMessage'),
  };

  contactStatus.textContent = '';
  contactStatus.classList.remove('success', 'error');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      contactStatus.textContent = result.message || 'Message sent successfully.';
      contactStatus.classList.add('success');
      contactForm.reset();
      return;
    }

    contactStatus.textContent = result.message || 'Unable to send your message. Please try again.';
    contactStatus.classList.add('error');
  } catch (error) {
    console.error('Contact submission failed:', error);
    contactStatus.textContent = 'Unable to send your message. Please try again.';
    contactStatus.classList.add('error');
  }
};

if (contactForm) {
  contactForm.addEventListener('submit', handleContactSubmit);
}
