/**
 * VÉRTICE MATERIALES DE CONSTRUCCIÓN
 * Lógica interactiva: Calculadoras de obra, generación de cotizaciones y formularios.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMaterialCalculators();
  initSmoothScroll();
});

/* ==========================================================================
   1. CALCULADORAS INTERACTIVAS DE MATERIALES DE OBRA
   ========================================================================== */
function initMaterialCalculators() {
  // Manejo de pestañas (Tabs)
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

  // TAB 1: Cálculo de Ladrillos
  const btnCalcLadrillo = document.getElementById('btn-calc-ladrillo');
  const selectLadrillo = document.getElementById('ladrillo-tipo');
  const inputLadrilloM2 = document.getElementById('ladrillo-m2');
  const btnSendWhatsApp = document.getElementById('btn-send-whatsapp-calc');

  const calcularLadrillos = () => {
    if (!selectLadrillo || !inputLadrilloM2) return;
    const m2 = Math.max(1, parseFloat(inputLadrilloM2.value) || 0);
    const selectedOption = selectLadrillo.options[selectLadrillo.selectedIndex];
    const perM2 = parseFloat(selectedOption.getAttribute('data-per-m2')) || 16;
    const tipoTexto = selectedOption.text.split('(')[0].trim();

    // 10% de desperdicio estimado
    const totalLadrillos = Math.round(m2 * perM2 * 1.1);

    // Cemento estimado: ~0.10 bolsas de 50kg por m2 de pared
    const bolsasCemento = Math.max(1, Math.round(m2 * 0.10 * 1.1));

    // Cal hidratada: ~0.20 bolsas de 25kg por m2
    const bolsasCal = Math.max(1, Math.round(m2 * 0.20 * 1.1));

    // Arena: ~0.04 m3 por m2
    const m3Arena = (m2 * 0.04 * 1.1).toFixed(1);

    document.getElementById('res-ladrillos-unidades').textContent = `${totalLadrillos} unidades`;
    document.getElementById('res-ladrillos-cemento').textContent = `${bolsasCemento} bolsas (50kg)`;
    document.getElementById('res-ladrillos-cal').textContent = `${bolsasCal} bolsas (25kg)`;
    document.getElementById('res-ladrillos-arena').textContent = `${m3Arena} m³`;

    // Enlace dinámico a WhatsApp con los datos calculados
    if (btnSendWhatsApp) {
      const mensaje = `Hola Vértice Materiales! Hice un cálculo en su web para una pared de ${m2} m² con ${tipoTexto}. Necesito cotizar: ${totalLadrillos} ladrillos, ${bolsasCemento} bolsas de cemento, ${bolsasCal} bolsas de cal y ${m3Arena} m³ de arena.`;
      btnSendWhatsApp.href = `https://wa.me/5491100000000?text=${encodeURIComponent(mensaje)}`;
    }
  };

  if (btnCalcLadrillo) btnCalcLadrillo.addEventListener('click', calcularLadrillos);
  if (inputLadrilloM2) inputLadrilloM2.addEventListener('input', calcularLadrillos);
  if (selectLadrillo) selectLadrillo.addEventListener('change', calcularLadrillos);

  // Inicializar cálculo por defecto
  calcularLadrillos();

  // TAB 2: Cálculo de Contrapiso
  const btnCalcContrapiso = document.getElementById('btn-calc-contrapiso');
  const inputContraM2 = document.getElementById('contrapiso-m2');
  const inputContraEsp = document.getElementById('contrapiso-espesor');

  const calcularContrapiso = () => {
    if (!inputContraM2 || !inputContraEsp) return;
    const m2 = Math.max(1, parseFloat(inputContraM2.value) || 0);
    const espCm = Math.max(1, parseFloat(inputContraEsp.value) || 10);
    const espesorMetros = espCm / 100;

    // Volumen en m³ con 10% de esponjamiento/desperdicio
    const volumenM3 = (m2 * espesorMetros * 1.1).toFixed(1);

    // Para 1 m³ de contrapiso estándar: ~3 bolsas cal/plasticor, ~0.6m³ arena, ~0.9m³ cascote
    const calBolsas = Math.ceil(volumenM3 * 3.2);
    const arenaM3 = (volumenM3 * 0.6).toFixed(1);
    const cascoteM3 = (volumenM3 * 0.9).toFixed(1);

    document.getElementById('res-contra-vol').textContent = `${volumenM3} m³`;
    document.getElementById('res-contra-cal').textContent = `${calBolsas} bolsas`;
    document.getElementById('res-contra-arena').textContent = `${arenaM3} m³`;
    document.getElementById('res-contra-cascote').textContent = `${cascoteM3} m³`;
  };

  if (btnCalcContrapiso) btnCalcContrapiso.addEventListener('click', calcularContrapiso);
  if (inputContraM2) inputContraM2.addEventListener('input', calcularContrapiso);
  if (inputContraEsp) inputContraEsp.addEventListener('input', calcularContrapiso);

  calcularContrapiso();

  // TAB 3: Cálculo de Hormigón H21
  const btnCalcHormigon = document.getElementById('btn-calc-hormigon');
  const inputHormM3 = document.getElementById('hormigon-m3');

  const calcularHormigon = () => {
    if (!inputHormM3) return;
    const m3 = Math.max(0.5, parseFloat(inputHormM3.value) || 0);

    // Dosificación típica H21 por m3: 350kg cemento (7 bolsas de 50kg), 0.67m³ arena, 0.87m³ piedra partida
    const cementoBolsas = Math.ceil(m3 * 7);
    const arenaM3 = (m3 * 0.67).toFixed(1);
    const piedraM3 = (m3 * 0.87).toFixed(1);

    document.getElementById('res-horm-cemento').textContent = `${cementoBolsas} bolsas (50kg)`;
    document.getElementById('res-horm-arena').textContent = `${arenaM3} m³`;
    document.getElementById('res-horm-piedra').textContent = `${piedraM3} m³`;
  };

  if (btnCalcHormigon) btnCalcHormigon.addEventListener('click', calcularHormigon);
  if (inputHormM3) inputHormM3.addEventListener('input', calcularHormigon);

  calcularHormigon();
}

/* ==========================================================================
   2. SCROLL SUAVE PARA BOTONES DE ACCIÓN INTERNOS
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

/* ==========================================================================
   3. GESTIÓN DEL FORMULARIO DE PRESUPUESTO DE OBRA
   ========================================================================== */
window.handleQuoteSubmit = function(form) {
  const submitBtn = document.getElementById('btn-submit-quote');
  const feedback = document.getElementById('quote-feedback');

  const name = form.querySelector('#quote-name').value;
  const phone = form.querySelector('#quote-phone').value;
  const materials = form.querySelector('#quote-materials').value;

  if (!name || !phone || !materials) return;

  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  submitBtn.querySelector('span').textContent = 'Procesando cotización...';

  setTimeout(() => {
    feedback.className = 'form-feedback success';
    feedback.innerHTML = `
      ✓ <strong>¡Solicitud enviada correctamente, ${name}!</strong><br>
      Recibimos tu lista de materiales. Un asesor de logística comercial te contactará al <strong>${phone}</strong> dentro de las próximas 2 horas hábiles con el presupuesto formal y los plazos de entrega en obra.
    `;

    form.reset();
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.querySelector('span').textContent = 'Enviar Solicitud de Presupuesto';
  }, 600);
};
