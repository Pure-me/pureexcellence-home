/* Pure Excellence — main.js v2.4 — EmailJS */

let currentLang = localStorage.getItem('pe-lang') || 'nl';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('pe-lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'btn-' + lang || btn.id === 'btn-' + lang + '-m');
  });

  document.querySelectorAll('[data-nl]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val === null) return;
    if (el.tagName === 'OPTION') { el.textContent = val; return; }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
    el.innerHTML = val;
  });

  document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
  emailjs.init('XVdPeDzgrfbrzUJc1');
});

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

function toggleM() { document.getElementById('mm').classList.toggle('open'); }
function closeM()  { document.getElementById('mm').classList.remove('open'); }

function showPage(page) {
  document.getElementById('main').classList.add('hidden');
  document.querySelectorAll('.legal-page').forEach(x => x.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0, 0);
  closeM();
}

function showMain() {
  document.getElementById('main').classList.remove('hidden');
  document.querySelectorAll('.legal-page').forEach(x => x.classList.remove('active'));
  closeM();
}

document.addEventListener('click', function(e) {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute('href');
  if (hash === '#') return;
  const target = document.querySelector(hash);
  if (target) {
    e.preventDefault();
    showMain();
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* Contactformulier via EmailJS */
async function submitForm() {
  const fn = document.getElementById('fn').value.trim();
  const ln = document.getElementById('ln').value.trim();
  const em = document.getElementById('em').value.trim();
  const su = document.getElementById('su').value;
  const ms = document.getElementById('ms').value.trim();
  const ok = document.getElementById('co2').checked;
  const co = document.getElementById('co').value.trim();
  const elOk  = document.getElementById('fok');
  const elErr = document.getElementById('ferr');
  const btn   = document.querySelector('.cform .btn-primary');

  elOk.style.display  = 'none';
  elErr.style.display = 'none';

  if (!fn || !ln || !em || !su || !ms || !ok) {
    elErr.textContent = currentLang === 'en'
      ? 'Please fill in all required fields and confirm your agreement with the privacy policy.'
      : 'Vul alle verplichte velden in en bevestig uw akkoord met de privacyverklaring.';
    elErr.style.display = 'block';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    elErr.textContent = currentLang === 'en'
      ? 'Please enter a valid email address.'
      : 'Vul een geldig e-mailadres in.';
    elErr.style.display = 'block';
    return;
  }

  btn.textContent = currentLang === 'en' ? 'Sending...' : 'Versturen...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  try {
    await emailjs.send(
      'service_ftwzxj',
      'template_zxdcki4',
      {
        name:    `${fn} ${ln}`,
        email:   em,
        company: co || 'Niet opgegeven',
        subject: su,
        message: ms
      },
      'XVdPeDzgrfbrzUJc1'
    );

    elOk.textContent = currentLang === 'en'
      ? '✓ Thank you for your message. We will personally get back to you within 2 working days.'
      : '✓ Bedankt voor uw bericht. Wij nemen binnen 2 werkdagen persoonlijk contact met u op.';
    elOk.style.display = 'block';

    ['fn','ln','em','co','su','ms'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('co2').checked = false;

  } catch (err) {
    console.error('EmailJS error:', err);
    elErr.textContent = currentLang === 'en'
      ? 'Something went wrong. Please email us directly at info@pureexcellence.be'
      : 'Er ging iets mis. Stuur ons een e-mail op info@pureexcellence.be';
    elErr.style.display = 'block';
  } finally {
    btn.textContent = currentLang === 'en' ? 'Send message →' : 'Verstuur bericht →';
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}
