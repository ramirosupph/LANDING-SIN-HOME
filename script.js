/**
 * PROMPI - PET SHOP, VETERINARIA & PELUQUERÍA CANINA
 * Lógica interactiva inspirada en Centro Pet:
 * Filtros de catálogo dinámicos, calculadora de ración, buscador de matapulgas y pedidos directos a WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductCatalog();
  initPetCalculators();
  initOrderForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. FILTRADO DINÁMICO DE PRODUCTOS DEL CATÁLOGO
   ========================================================================== */
function initProductCatalog() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const productCards = document.querySelectorAll('.pet-item-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterCategory = chip.getAttribute('data-filter');

      productCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || categories.includes(filterCategory)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Función global accesible desde las tarjetas de categorías principales
window.filterCatalog = function(category) {
  const catalogEl = document.getElementById('catalogo');
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: 'smooth' });
  }

  const targetChip = document.querySelector(`.filter-chip[data-filter="${category}"]`);
  if (targetChip) {
    targetChip.click();
  }
};

/* ==========================================================================
   2. HERRAMIENTAS INTERACTIVAS: CALCULADORA NUTRICIONAL & MATAPULGAS
   ========================================================================== */
function initPetCalculators() {
  // Manejo de pestañas
  const tabs = document.querySelectorAll('.calc-pill-tab');
  const panels = document.querySelectorAll('.pet-calc-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = `tab-${tab.getAttribute('data-tab')}`;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
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
      let factor = 16;
      if (activity === 'alta') factor = 20;
      if (activity === 'baja') factor = 13;
      if (activity === 'cachorro') factor = 25;
      dailyGrams = Math.round(weight * factor);
    } else {
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
      const msg = `Hola Prompi! Hice el cálculo en su web para mi ${species} de ${weight}kg (${activity}). Necesita unos ${dailyGrams}g por día. ¿Qué alimento balanceado premium me recomiendan y qué precio tiene la bolsa de 15kg?`;
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
        prod = 'Bravecto Plus Felina Spot-on o Credelio Gatos';
        duration = '12 semanas (Bravecto) o 30 días continuos';
        covers = 'Pulgas, garrapatas, ácaros del oído y parásitos internos';
      } else {
        prod = 'Pipeta Frontline Plus Felina / Revolution Plus';
        duration = '30 días de cobertura dérmica';
        covers = 'Pulgas adultas, huevos, larvas y garrapatas';
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
        duration = '30 días a 12 semanas (según presentación)';
        covers = 'Pulgas, garrapatas, ácaros de sarna y parásitos intestinales';
      } else {
        prod = `Pipeta Frontline Plus o Advantix Canina (${weightRange})`;
        duration = '30 días de protección sobre el pelaje';
        covers = 'Pulgas, larvas, garrapatas y repelente de mosquitos';
      }
    }

    const resProd = document.getElementById('res-flea-prod');
    const resDuration = document.getElementById('res-flea-duration');
    const resCovers = document.getElementById('res-flea-covers');

    if (resProd) resProd.textContent = prod;
    if (resDuration) resDuration.textContent = duration;
    if (resCovers) resCovers.textContent = covers;

    if (btnWhatsAppFlea) {
      const msg = `Hola Prompi! En su buscador vi el antipulgas sugerido: "${prod}" para mi ${species}. ¿Tienen stock disponible y cuánto sale el envío a domicilio?`;
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
   3. FORMULARIO DE PEDIDOS Y TURNOS
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
      feedback.className = 'form-feedback-pill success';
    }

    const message = `🐾 *NUEVO PEDIDO PROMPI* 🐾
*Cliente:* ${name}
*Teléfono:* ${phone}
*Mascota:* ${pet || 'No especificada'}
*Solicitud:* ${service}
*Dirección:* ${address || 'A convenir'}
*Detalle:*
${details}`;

    setTimeout(() => {
      const waUrl = `https://wa.me/5491148907700?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      form.reset();
    }, 850);
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
