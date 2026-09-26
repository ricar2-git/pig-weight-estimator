/**
 * Internationalization (i18n) Dictionary
 * English (en) and Spanish (es)
 */

const I18N = {
  currentLang: 'en',

  translations: {
    en: {
      appName: 'PorciWeight',
      appSubtitle: 'Mobile Swine Weight & Growth Estimator',
      tagline: 'Computer Vision & Livestock Biometrics in your pocket',
      navScanner: 'Scanner',
      navPresets: 'Sample Pigs',
      navHistory: 'History',
      navGuide: 'Guide',

      // Language Switcher
      langEn: 'English',
      langEs: 'Español',

      // Hero & Input
      cameraTitle: 'Capture or Upload Pig Image',
      cameraSubtitle: 'Take a lateral (side-view) photo of the pig for maximum accuracy',
      btnTakePhoto: 'Take Photo',
      btnUploadFile: 'Upload Image',
      btnLiveCamera: 'Use Camera',
      btnSamplePigs: 'Try Sample Pig',
      btnRetake: 'New Photo',
      btnAnalyze: 'Estimate Weight & Growth',
      btnSaveScan: 'Save to Farm Log',
      btnExportReport: 'Export PDF / Report',

      // Measurement adjustments
      adjustmentsTitle: 'Biometric Measurements',
      adjustmentsHint: 'Drag the pins on the image or use sliders below to refine anatomical bounds:',
      labelLength: 'Body Length (Snout to Tail base)',
      labelGirth: 'Heart Girth (Chest Circumference)',
      labelBCS: 'Body Condition Score (BCS 1-5)',
      labelBreed: 'Breed / Genetics',
      labelTargetWeight: 'Target Market Weight',
      unitCm: 'cm',
      unitIn: 'in',
      unitKg: 'kg',
      unitLbs: 'lbs',

      // BCS descriptions
      bcs1: '1 - Emaciated (Hips/ribs prominent)',
      bcs2: '2 - Thin (Easily felt bones)',
      bcs3: '3 - Ideal / Market Standard',
      bcs4: '4 - Overconditioned / Fat',
      bcs5: '5 - Obese (Flank folds)',

      // Breeds
      breedCommercial: 'Commercial White (Yorkshire / Landrace)',
      breedDuroc: 'Duroc (High Muscle)',
      breedPietrain: 'Pietrain (Lean Ham)',
      breedBerkshire: 'Berkshire (Marbled)',
      breedIberian: 'Iberian / Pasture',
      breedPotbellied: 'Miniature / Potbellied',

      // Results Section
      resultsTitle: 'Estimation Results',
      confidenceBadge: 'High Confidence (±3.8%)',
      estimatedLiveWeight: 'Estimated Live Weight',
      carcassYield: 'Est. Carcass Weight (74.5% Dressing)',
      confidenceRange: 'Expected Range',

      // Growth & Time Estimates
      timeEstimatesTitle: 'Growth Timeline & Market Time Estimates',
      timeEstimatesSubtitle: 'Projected swine growth trajectory based on Gompertz biological curve',
      statAge: 'Estimated Age',
      statDaysToMarket: 'Days to Market Weight',
      statProjectedDate: 'Estimated Ready Date',
      statADG: 'Avg Daily Gain (ADG)',
      statFeedNeeded: 'Remaining Feed Needed',
      statFCR: 'Feed Conv. Ratio (FCR)',
      statMarketProgress: 'Market Readiness',

      // Growth Stages
      stage_piglet: 'Suckling Piglet (Lactancia)',
      stage_nursery: 'Nursery / Weaned (Destete)',
      stage_grower: 'Grower Stage (Crecimiento)',
      stage_finisher: 'Finisher Stage (Cebo / Engorde)',
      stage_market: 'Market Ready (Listo para Faena)',
      stage_mature: 'Mature / Breeding Stock (Adulto / Cría)',

      // Stage Advice
      advice_piglet: 'Provide creep feed and warm creep area. Monitor sow milk intake and colostrum.',
      advice_nursery: 'High energy nursery diet with accessible clean water. Maintain optimal pen ventilation.',
      advice_grower: 'Rapid muscle deposition phase. Balanced protein/lysine ratio and free-choice feeding.',
      advice_finisher: 'Final finishing phase. Monitor feed conversion ratio. Prepare sorting for slaughter target.',
      advice_market: 'Optimal market weight reached! Schedule shipping to avoid excessive fat deposition costs.',
      advice_mature: 'Maintenance feeding regime to prevent overconditioning in breeding stock.',

      // Presets
      presetsTitle: 'Quick Test Pig Presets',
      preset1Title: 'Weaner Piglet (~18 kg)',
      preset2Title: 'Grower Pig (~52 kg)',
      preset3Title: 'Finisher Hog (~108 kg)',
      preset4Title: 'Mature Sow (~215 kg)',

      // Instructions / Tips
      tipTitle: 'Best Photo Practices',
      tip1: '1. Position camera at pig eye level, parallel to the body side (lateral view).',
      tip2: '2. Ensure full body is visible: snout, withers, backline, and rump.',
      tip3: '3. Good ambient lighting without harsh cast shadows on the flank.',

      // History
      historyTitle: 'Recent Farm Measurements',
      historyEmpty: 'No scans saved yet. Take or upload an image above to start your log!',
      historyCleared: 'History cleared',
      btnClearHistory: 'Clear History',

      // Alerts
      alertSaved: 'Measurement saved to Farm History!',
      alertImageError: 'Could not load image. Please select a valid photo file (JPG, PNG, WEBP).',
      alertNoCamera: 'Camera not available on this device or permission denied. Please use photo upload.'
    },

    es: {
      appName: 'PorciWeight',
      appSubtitle: 'Estimador Móvil de Peso y Tiempos de Crecimiento Porcino',
      tagline: 'Visión computacional y biometría porcina en tu bolsillo',
      navScanner: 'Escáner',
      navPresets: 'Muestras',
      navHistory: 'Historial',
      navGuide: 'Guía',

      // Selector de idioma
      langEn: 'English',
      langEs: 'Español',

      // Portada y Entrada
      cameraTitle: 'Tomar o Subir Foto del Cerdo',
      cameraSubtitle: 'Toma una foto lateral del porcino para máxima precisión biométrica',
      btnTakePhoto: 'Tomar Foto',
      btnUploadFile: 'Subir Imagen',
      btnLiveCamera: 'Usar Cámara',
      btnSamplePigs: 'Probar Muestra',
      btnRetake: 'Nueva Foto',
      btnAnalyze: 'Estimar Peso y Tiempos',
      btnSaveScan: 'Guardar en Cuaderno',
      btnExportReport: 'Exportar Informe / PDF',

      // Ajustes biométricos
      adjustmentsTitle: 'Mediciones Biométricas',
      adjustmentsHint: 'Arrastra los puntos en la foto o ajusta las barras para calibrar la anatomía:',
      labelLength: 'Longitud Corporal (Hocico a Base de Cola)',
      labelGirth: 'Perímetro Torácico (Circunferencia Cardíaca)',
      labelBCS: 'Condición Corporal (CC 1-5)',
      labelBreed: 'Raza / Línea Genética',
      labelTargetWeight: 'Peso Objetivo para Mercado / Faena',
      unitCm: 'cm',
      unitIn: 'pulg',
      unitKg: 'kg',
      unitLbs: 'lb',

      // Calificaciones CC (BCS)
      bcs1: '1 - Demacrado (Caderas y costillas muy salientes)',
      bcs2: '2 - Delgado (Huesos palpables sin presión)',
      bcs3: '3 - Ideal / Óptimo Comercial',
      bcs4: '4 - Sobrepeso / Graso',
      bcs5: '5 - Obeso (Pliegues gruesos de grasa)',

      // Razas
      breedCommercial: 'Blanco Comercial (Yorkshire / Landrace)',
      breedDuroc: 'Duroc (Alta Masa Muscular)',
      breedPietrain: 'Pietrain (Pernil Magro)',
      breedBerkshire: 'Berkshire (Grasa Infiltrada)',
      breedIberian: 'Ibérico / Rústico extensivo',
      breedPotbellied: 'Miniatura / Viet Min / Barrigón',

      // Resultados
      resultsTitle: 'Resultados de la Estimación',
      confidenceBadge: 'Alta Confianza (±3.8%)',
      estimatedLiveWeight: 'Peso Vivo Estimado',
      carcassYield: 'Rendimiento en Canal (~74.5%)',
      confidenceRange: 'Rango de Confianza',

      // Tiempos y Crecimiento
      timeEstimatesTitle: 'Cronograma y Tiempos Estimados de Crecimiento',
      timeEstimatesSubtitle: 'Curva de crecimiento biológico Gompertz proyectada para el porcino',
      statAge: 'Edad Estimada',
      statDaysToMarket: 'Días para Peso de Faena',
      statProjectedDate: 'Fecha Estimada de Venta',
      statADG: 'Ganancia Diaria Promedio (GDP)',
      statFeedNeeded: 'Alimento Restante Requerido',
      statFCR: 'Conversión Alimenticia (CA)',
      statMarketProgress: 'Progreso para Faena',

      // Fases de Crecimiento
      stage_piglet: 'Lechón Lactante (0 a 4 semanas)',
      stage_nursery: 'Destete / Transición (4 a 10 semanas)',
      stage_grower: 'Crecimiento / Levante (10 a 16 semanas)',
      stage_finisher: 'Cebo / Engorde (16 a 22 semanas)',
      stage_market: 'Listo para Mercado / Faena (>110 kg)',
      stage_mature: 'Adulto / Pie de Cría (>135 kg)',

      // Consejos por fase
      advice_piglet: 'Suministrar alimento pre-iniciador y mantener área térmica cálida. Controlar consumo de leche.',
      advice_nursery: 'Dieta de transición de alta digestibilidad con agua fresca a libre disposición. Ventilación óptima.',
      advice_grower: 'Etapa de máximo desarrollo muscular y óseo. Relación lisina/energía equilibrada.',
      advice_finisher: 'Fase final de engorde. Supervisar índice de conversión y programar lotes para faena.',
      advice_market: '¡Peso óptimo alcanzado! Comercializar para evitar sobrecostos por engrasamiento.',
      advice_mature: 'Ración de mantenimiento controlada para evitar sobrepeso en reproductores.',

      // Muestras
      presetsTitle: 'Muestras Rápidas de Prueba',
      preset1Title: 'Lechón Destetado (~18 kg)',
      preset2Title: 'Cerdo de Crecimiento (~52 kg)',
      preset3Title: 'Capón de Cebo (~108 kg)',
      preset4Title: 'Cerda Reproductora (~215 kg)',

      // Consejos / Recomendaciones
      tipTitle: 'Buenas Prácticas para la Fotografía',
      tip1: '1. Coloca la cámara a la altura del ojo del cerdo, perpendicular al costado (vista lateral).',
      tip2: '2. Asegúrate de encuadrar el cerdo completo: hocico, cruz, dorso y base de la cola.',
      tip3: '3. Iluminación uniforme sin sombras fuertes en los flancos para mayor precisión.',

      // Historial
      historyTitle: 'Registros Recientes de la Granja',
      historyEmpty: 'Aún no hay mediciones guardadas. ¡Toma o sube una foto arriba para comenzar!',
      historyCleared: 'Historial vaciado',
      btnClearHistory: 'Vaciar Historial',

      // Alertas
      alertSaved: '¡Medición guardada en el historial de la granja!',
      alertImageError: 'No se pudo cargar la imagen. Selecciona un archivo válido (JPG, PNG, WEBP).',
      alertNoCamera: 'Cámara no disponible en este dispositivo o permiso denegado. Puedes subir una foto.'
    }
  },

  get(key) {
    const lang = this.currentLang;
    if (this.translations[lang] && this.translations[lang][key]) {
      return this.translations[lang][key];
    }
    return this.translations.en[key] || key;
  },

  setLang(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      try {
        localStorage.setItem('porciweight_lang', lang);
      } catch (e) {}
      this.applyTranslations();
      return true;
    }
    return false;
  },

  toggleLang() {
    const nextLang = this.currentLang === 'en' ? 'es' : 'en';
    return this.setLang(nextLang);
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.get(key);
      if (text) {
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update active state on language toggle buttons
    const btnEn = document.getElementById('btnLangEn');
    const btnEs = document.getElementById('btnLangEs');
    if (btnEn && btnEs) {
      if (this.currentLang === 'en') {
        btnEn.classList.add('bg-white', 'text-emerald-700', 'shadow-sm');
        btnEn.classList.remove('text-emerald-100');
        btnEs.classList.remove('bg-white', 'text-emerald-700', 'shadow-sm');
        btnEs.classList.add('text-emerald-100');
      } else {
        btnEs.classList.add('bg-white', 'text-emerald-700', 'shadow-sm');
        btnEs.classList.remove('text-emerald-100');
        btnEn.classList.remove('bg-white', 'text-emerald-700', 'shadow-sm');
        btnEn.classList.add('text-emerald-100');
      }
    }

    // Trigger custom event so components can update dynamic text
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  },

  init() {
    let savedLang = 'en';
    try {
      savedLang = localStorage.getItem('porciweight_lang') || (navigator.language.startsWith('es') ? 'es' : 'en');
    } catch (e) {}
    this.currentLang = (savedLang === 'es') ? 'es' : 'en';
    this.applyTranslations();
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18N;
}
