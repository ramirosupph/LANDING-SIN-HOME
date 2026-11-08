/**
 * LANDING DE LECTURA — COMPORTAMIENTOS ERGONÓMICOS
 * Gestiona el progreso de lectura, temas de contraste y ajustes de legibilidad.
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initReadingTime();
  initThemeSwitcher();
  initFontFamilyToggle();
  initFontSizeControls();
});

/* ==========================================================================
   1. BARRA DE PROGRESO DE LECTURA CONTINUA
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const percentage = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = `${percentage}%`;
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   2. CÁLCULO DINÁMICO DEL TIEMPO ESTIMADO DE LECTURA
   ========================================================================== */
function initReadingTime() {
  const article = document.getElementById('reading-article');
  const display = document.getElementById('reading-time-display');
  if (!article || !display) return;

  const text = article.innerText || article.textContent || '';
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  
  // Promedio de lectura para prosa reflexiva: ~190-200 palabras por minuto
  const minutes = Math.ceil(wordCount / 195);
  display.textContent = `${minutes} min de lectura`;
}

/* ==========================================================================
   3. SELECTOR DE TEMAS ERGONÓMICOS (CLARO, SEPIA, NOCHE)
   ========================================================================== */
function initThemeSwitcher() {
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('[data-set-theme]');
  const savedTheme = localStorage.getItem('reading_palette') || 'light';

  const applyTheme = (themeName) => {
    root.setAttribute('data-theme', themeName);
    localStorage.setItem('reading_palette', themeName);

    themeButtons.forEach(btn => {
      const isActive = btn.getAttribute('data-set-theme') === themeName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-set-theme');
      applyTheme(selectedTheme);
    });
  });

  // Aplicar tema guardado
  applyTheme(savedTheme);
}

/* ==========================================================================
   4. ALTERNADOR DE FAMILIA TIPOGRÁFICA (SERIF / SANS)
   ========================================================================== */
function initFontFamilyToggle() {
  const btnSerif = document.getElementById('btn-font-serif');
  const btnSans = document.getElementById('btn-font-sans');
  if (!btnSerif || !btnSans) return;

  const savedFont = localStorage.getItem('reading_font_family') || 'serif';

  const setFont = (type) => {
    if (type === 'sans') {
      document.body.classList.remove('font-serif');
      document.body.classList.add('font-sans');
      btnSans.classList.add('active');
      btnSans.setAttribute('aria-pressed', 'true');
      btnSerif.classList.remove('active');
      btnSerif.setAttribute('aria-pressed', 'false');
    } else {
      document.body.classList.remove('font-sans');
      document.body.classList.add('font-serif');
      btnSerif.classList.add('active');
      btnSerif.setAttribute('aria-pressed', 'true');
      btnSans.classList.remove('active');
      btnSans.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('reading_font_family', type);
  };

  btnSerif.addEventListener('click', () => setFont('serif'));
  btnSans.addEventListener('click', () => setFont('sans'));

  setFont(savedFont);
}

/* ==========================================================================
   5. AJUSTE DE TAMAÑO DE FUENTE (A- / A+)
   ========================================================================== */
function initFontSizeControls() {
  const btnDec = document.getElementById('btn-font-decrease');
  const btnInc = document.getElementById('btn-font-increase');
  if (!btnDec || !btnInc) return;

  // Escala de tamaños en rem
  const sizes = [1.05, 1.1875, 1.32, 1.45];
  let currentIndex = 1; // Tamaño por defecto (1.1875rem ~ 19px)

  const savedSize = localStorage.getItem('reading_font_size');
  if (savedSize) {
    const parsed = parseFloat(savedSize);
    const foundIndex = sizes.findIndex(s => Math.abs(s - parsed) < 0.02);
    if (foundIndex !== -1) currentIndex = foundIndex;
  }

  const applySize = (index) => {
    const sizeVal = sizes[index];
    document.documentElement.style.setProperty('--font-size-base', `${sizeVal}rem`);
    localStorage.setItem('reading_font_size', sizeVal.toString());

    btnDec.disabled = (index === 0);
    btnInc.disabled = (index === sizes.length - 1);

    btnDec.style.opacity = (index === 0) ? '0.4' : '1';
    btnInc.style.opacity = (index === sizes.length - 1) ? '0.4' : '1';
  };

  btnDec.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      applySize(currentIndex);
    }
  });

  btnInc.addEventListener('click', () => {
    if (currentIndex < sizes.length - 1) {
      currentIndex++;
      applySize(currentIndex);
    }
  });

  applySize(currentIndex);
}

/* ==========================================================================
   6. GESTIÓN DEL FORMULARIO DE CORRESPONDENCIA
   ========================================================================== */
window.handleSubscribe = function(form) {
  const input = form.querySelector('input[type="email"]');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = form.querySelector('.sub-submit-btn');

  if (!input || !input.value.trim()) return;

  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  // Simulación de envío elegante
  setTimeout(() => {
    feedback.textContent = `Has quedado registrado con ${input.value}. Recibirás la próxima carta mensual.`;
    feedback.style.color = 'var(--accent-color)';
    input.value = '';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }, 400);
};
