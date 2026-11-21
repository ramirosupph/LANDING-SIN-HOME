/**
 * PROMPI - VETERINARIA, ALIMENTOS BALANCEADOS & PET SHOP
 * Lógica interactiva: Filtros de catálogo, calculadora de nutrición, recomendador de matapulgas y formulario.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductFilters();
  initPetCalculators();
  initOrderForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. FILTRADO DINÁMICO DE PRODUCTOS (INSPIRADO EN PUPPIS)
   ========================================================================== */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Función global para filtrar desde las tarjetas de categoría
window.filterCatalog = function(category) {
  const catalogEl = document.getElementById('catalogo');
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: 'smooth' });
  }

  const targetBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
  if (targetBtn) {
    targetBtn.click();
  }
};

/* ==========================================================================
   2. CALCULADORA INTERACTIVA PROMPI (RACIÓN DIARIA & MATAPULGAS)
   ========================================================================== */
function initPetCalculators() {
  // Manejo de Tabs
  const tabs = document.querySelectorAll('.calc-tab');
  const contents = document.querySelectorAll('.calc-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = `tab-${tab.getAttribute('data-tab')}`;

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // TAB 1: Ración Diaria
  const selectSpecies = document.getElementById('pet-species');
  const inputWeight = document.getElementById('pet-weight');
  const selectActivity = document.getElementById('pet-activity');
  const btnCalcFood = document.getElementById('btn-calc-food');
  const btnWhatsAppFood = document.getElementById('btn-whatsapp-food-calc');

  const calcFood = () => {
    if (!selectSpecies || !inputWeight || !selectActivity) return;

    const species = selectSpecies.value; // 'perro' o 'gato'
    const weight = Math.max(0.5, parseFloat(inputWeight.value) || 5);
    const activity = selectActivity.value;

    let dailyGrams = 0;

    if (species === 'perro') {
      // Cálculo aproximado para perros: ~15 a 20g por kg según actividad
      let factor = 16;
      if (activity === 'alta') factor = 20;
      if (activity === 'baja') factor = 13;
      if (activity === 'cachorro') factor = 25;

      dailyGrams = Math.round(weight * factor);
    } else {
      // Gatos: ~12 a 15g por kg
      let factor = 13;
      if (activity === 'alta') factor = 16;
      if (activity === 'baja') factor = 10;
      if (activity === 'cachorro') factor = 20;

      dailyGrams = Math.round(weight * factor);
    }

    const serving = Math.round(dailyGrams / 2);
    const bagDuration = Math.round(15000 / dailyGrams);

    const resDaily = document.getElementById('res-food-daily');
    const resServing = document.getElementById('res-food-serving');
    const resDuration = document.getElementById('res-food-duration');

    if (resDaily) resDaily.textContent = `${dailyGrams} g / día`;
    if (resServing) resServing.textContent = `${serving} g por toma (2 tomas)`;
    if (resDuration) resDuration.textContent = `~${bagDuration} días`;

    if (btnWhatsAppFood) {
      const msg = `Hola Prompi! Hice el cálculo en su web para mi ${species} de ${weight}kg (${activity}). Necesita unos ${dailyGrams}g por día. ¿Qué alimento balanceado me recomiendan y qué precio tiene la bolsa?`;
      btnWhatsAppFood.href = `https://wa.me/5491148907700?text=${encodeURIComponent(msg)}`;
    }
  };

  if (btnCalcFood) btnCalcFood.addEventListener('click', calcFood);
  if (inputWeight) inputWeight.addEventListener('input', calcFood);
  if (selectSpecies) selectSpecies.addEventListener('change', calcFood);
  if (selectActivity) selectActivity.addEventListener('change', calcFood);

  calcFood();

  // TAB 2: Buscador de Antipulgas & Matapulgas
  const fleaSpecies = document.getElementById('flea-species');
  const fleaWeight = document.getElementById('flea-weight');
  const fleaFormat = document.getElementById('flea-format');
  const btnCalcFlea = document.getElementById('btn-calc-flea');
  const btnWhatsAppFlea = document.getElementById('btn-whatsapp-flea-calc');

  const calcFlea = () => {
    if (!fleaSpecies || !fleaWeight || !fleaFormat) return;

    const species = fleaSpecies.value;
    const weightRange = fleaWeight.value;
    const format = fleaFormat.value;

    let prod = '';
    let duration = '';
    let covers = '';

    if (species === 'gato') {
      if (format === 'oral') {
        prod = 'Bravecto Plus Spot-on o Credelio Gatos';
        duration = '12 semanas (Bravecto) o 30 días';
        covers = 'Pulgas, garrapatas, ácaros del oído y parásitos internos';
      } else {
        prod = 'Pipeta Frontline Plus Felina / Revolution Plus';
        duration = '30 días de cobertura tópica';
        covers = 'Pulgas, huevos, larvas y garrapatas';
      }
    } else {
      // Perro
      if (format === 'oral') {
        if (weightRange === 'toy') {
          prod = 'NexGard Spectra 2 a 3.5 kg / Simparica 2.5-5kg';
        } else if (weightRange === 'chico') {
          prod = 'NexGard Spectra 3.5 a 7.5 kg / Bravecto 4.5-10kg';
        } else if (weightRange === 'mediano') {
          prod = 'NexGard Spectra 7.5 a 15 kg o 15 a 30 kg';
        } else if (weightRange === 'grande') {
          prod = 'NexGard Spectra 30 a 60 kg / Bravecto 20-40kg';
        } else {
          prod = 'Bravecto 40-56 kg / Nexgard Spectra Gigante';
        }
        duration = '30 días a 12 semanas según laboratorio';
        covers = 'Pulgas, garrapatas, ácaros de sarna y parásitos gastrointestinales';
      } else {
        prod = `Pipeta Frontline Plus o Advantix Canina (${weightRange})`;
        duration = '30 días de protección sobre la piel';
        covers = 'Pulgas adultas, larvas, garrapatas y repelente de mosquitos';
      }
    }

    const resProd = document.getElementById('res-flea-prod');
    const resDuration = document.getElementById('res-flea-duration');
    const resCovers = document.getElementById('res-flea-covers');

    if (resProd) resProd.textContent = prod;
    if (resDuration) resDuration.textContent = duration;
    if (resCovers) resCovers.textContent = covers;

    if (btnWhatsAppFlea) {
      const msg = `Hola Prompi! En su buscador vi el antipulgas recomendado: "${prod}" para mi ${species}. ¿Tienen stock y cuánto sale con envío?`;
      btnWhatsAppFlea.href = `https://wa.me/5491148907700?text=${encodeURIComponent(msg)}`;
    }
  };

  if (btnCalcFlea) btnCalcFlea.addEventListener('click', calcFlea);
  if (fleaSpecies) fleaSpecies.addEventListener('change', calcFlea);
  if (fleaWeight) fleaWeight.addEventListener('change', calcFlea);
  if (fleaFormat) fleaFormat.addEventListener('change', calcFlea);

  calcFlea();
}

/* ==========================================================================
   3. FORMULARIO DE PEDIDOS & TURNOS CON ENVÍO DIRECTO A WHATSAPP
   ========================================================================== */
function initOrderForm() {
  const form = document.getElementById('order-form');
  const feedback = document.getElementById('order-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('order-name')?.value.trim();
    const phone = document.getElementById('order-phone')?.value.trim();
    const pet = document.getElementById('order-pet')?.value.trim();
    const service = document.getElementById('order-service')?.value;
    const address = document.getElementById('order-address')?.value.trim();
    const details = document.getElementById('order-details')?.value.trim();

    if (!name || !phone || !details) {
      alert('Por favor completá los campos obligatorios (*)');
      return;
    }

    if (feedback) {
      feedback.textContent = '¡Gracias! Redirigiendo a WhatsApp para confirmar tu pedido con un asesor de Prompi...';
      feedback.className = 'form-feedback success';
    }

    const message = `🐾 *NUEVO PEDIDO PROMPI WEB* 🐾
*Cliente:* ${name}
*Teléfono:* ${phone}
*Mascota:* ${pet || 'No especificada'}
*Motivo:* ${service}
*Dirección:* ${address || 'A convenir'}
*Detalle:*
${details}`;

    setTimeout(() => {
      const waUrl = `https://wa.me/5491148907700?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      form.reset();
    }, 900);
  });
}

/* ==========================================================================
   4. SCROLL SUAVE PARA ENLACES INTERNOS
   ========================================================================== */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
