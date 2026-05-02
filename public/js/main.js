/* ============================================================
   Pure Excellence — Hoofdscript
   Versie: 2.0 — met NL/EN taalswitch
   ============================================================ */

let currentLang = localStorage.getItem('pe-lang') || 'nl';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('pe-lang', lang);
  document.documentElement.lang = lang === 'nl' ? 'nl' : 'en';

  ['btn-nl','btn-nl-m'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', lang === 'nl');
  });
  ['btn-en','btn-en-m'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', lang === 'en');
  });

  document.querySelectorAll('[data-nl]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (!text) return;
    if (el.tagName === 'H1' || el.tagName === 'BUTTON' || text.includes('<em>')) {
      el.innerHTML = text;
    } else if (el.tagName === 'OPTION') {
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  });

  document.querySelectorAll('[data-placeholder-nl]').forEach(el => {
    const ph = el.getAttribute('data-placeholder-' + lang);
    if (ph) el.placeholder = ph;
  });
}

document.addEventListener('DOMContentLoaded', () => { setLang(currentLang); });

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 20);
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

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const hash = this.getAttribute('href');
    if (hash === '#') return;
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      showMain();
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  });
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

function submitForm() {
  const fn = document.getElementById('fn').value.trim();
  const ln = document.getElementById('ln').value.trim();
  const em = document.getElementById('em').value.trim();
  const su = document.getElementById('su').value;
  const ms = document.getElementById('ms').value.trim();
  const ok = document.getElementById('co2').checked;
  const co = document.getElementById('co').value.trim();
  const elOk  = document.getElementById('fok');
  const elErr = document.getElementById('ferr');
  elOk.style.display = 'none';
  elErr.style.display = 'none';

  if (!fn || !ln || !em || !su || !ms || !ok) {
    elErr.textContent = currentLang === 'en'
      ? 'Please fill in all required fields and confirm your agreement with the privacy policy.'
      : 'Vul alle verplichte velden in en bevestig uw akkoord met de privacyverklaring.';
    elErr.style.display = 'block';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    elErr.textContent = currentLang === 'en' ? 'Please enter a valid email address.' : 'Vul een geldig e-mailadres in.';
    elErr.style.display = 'block';
    return;
  }
  const body = encodeURIComponent(`Naam: ${fn} ${ln}\nBedrijf: ${co}\nOnderwerp: ${su}\n\n${ms}`);
  window.location.href = `mailto:info@pureexcellence.be?subject=${encodeURIComponent(su + ' via Pure Excellence')}&body=${body}`;
  elOk.textContent = currentLang === 'en'
    ? '✓ Thank you for your message. We will personally get back to you within 2 working days.'
    : '✓ Bedankt voor uw bericht. Wij nemen binnen 2 werkdagen persoonlijk contact met u op.';
  elOk.style.display = 'block';
}
