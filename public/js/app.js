/**
 * PorciWeight Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize internationalization
  I18N.init();

  // Initialize computer vision canvas
  const vision = new SwineVision('visionCanvas');

  // DOM Elements
  const fileInput = document.getElementById('fileInput');
  const btnTakePhoto = document.getElementById('btnTakePhoto');
  const btnUploadFile = document.getElementById('btnUploadFile');
  const btnLiveCamera = document.getElementById('btnLiveCamera');
  const btnRetake = document.getElementById('btnRetake');
  const btnSaveScan = document.getElementById('btnSaveScan');
  const btnExportReport = document.getElementById('btnExportReport');
  const btnClearHistory = document.getElementById('btnClearHistory');
  const btnLangEn = document.getElementById('btnLangEn');
  const btnLangEs = document.getElementById('btnLangEs');

  // Sliders and Selects
  const sliderLength = document.getElementById('sliderLength');
  const sliderGirth = document.getElementById('sliderGirth');
  const valLength = document.getElementById('valLength');
  const valGirth = document.getElementById('valGirth');
  const selectBCS = document.getElementById('selectBCS');
  const selectBreed = document.getElementById('selectBreed');
  const inputTargetWeight = document.getElementById('inputTargetWeight');

  // Result displays
  const displayWeightKg = document.getElementById('displayWeightKg');
  const displayWeightLbs = document.getElementById('displayWeightLbs');
  const displayConfidenceRange = document.getElementById('displayConfidenceRange');
  const displayCarcassKg = document.getElementById('displayCarcassKg');
  const displayCarcassLbs = document.getElementById('displayCarcassLbs');

  // Time & Growth displays
  const displayAge = document.getElementById('displayAge');
  const displayDaysToMarket = document.getElementById('displayDaysToMarket');
  const displayMarketDate = document.getElementById('displayMarketDate');
  const displayADG = document.getElementById('displayADG');
  const displayFeedNeeded = document.getElementById('displayFeedNeeded');
  const displayFCR = document.getElementById('displayFCR');
  const displayStageBadge = document.getElementById('displayStageBadge');
  const displayStageAdvice = document.getElementById('displayStageAdvice');
  const progressBarMarket = document.getElementById('progressBarMarket');
  const progressPercentText = document.getElementById('progressPercentText');

  // Camera modal elements
  const cameraModal = document.getElementById('cameraModal');
  const videoFeed = document.getElementById('videoFeed');
  const btnCaptureVideo = document.getElementById('btnCaptureVideo');
  const btnCloseCamera = document.getElementById('btnCloseCamera');
  let currentVideoStream = null;

  // Preset buttons
  const presetButtons = document.querySelectorAll('[data-preset]');

  // History container
  const historyList = document.getElementById('historyList');

  // Current State
  let currentImageSrc = null;
  let currentResults = null;

  // Presets definition
  const PRESET_DATA = {
    piglet: {
      src: 'assets/samples/piglet.svg',
      lengthCm: 68,
      girthCm: 58,
      bcs: 3,
      breed: 'commercial'
    },
    grower: {
      src: 'assets/samples/grower.svg',
      lengthCm: 96,
      girthCm: 88,
      bcs: 3,
      breed: 'duroc'
    },
    finisher: {
      src: 'assets/samples/finisher.svg',
      lengthCm: 124,
      girthCm: 122,
      bcs: 3,
      breed: 'commercial'
    },
    sow: {
      src: 'assets/samples/sow.svg',
      lengthCm: 155,
      girthCm: 154,
      bcs: 4,
      breed: 'commercial'
    }
  };

  /**
   * Recalculate weights and time estimates
   */
  function updateCalculations() {
    const lengthCm = parseFloat(sliderLength.value);
    const girthCm = parseFloat(sliderGirth.value);
    const bcs = parseInt(selectBCS.value, 10);
    const breedKey = selectBreed.value;
    const targetKg = parseFloat(inputTargetWeight.value) || 115.0;

    valLength.textContent = `${lengthCm} cm (${Math.round(lengthCm / 2.54)} in)`;
    valGirth.textContent = `${girthCm} cm (${Math.round(girthCm / 2.54)} in)`;

    const weightData = SwineEstimator.calculateWeight(lengthCm, girthCm, bcs, breedKey);
    const growthData = SwineEstimator.calculateGrowthTimeEstimates(weightData.weightKg, targetKg);

    currentResults = { ...weightData, ...growthData, timestamp: new Date().toISOString() };

    renderResults(currentResults);
  }

  /**
   * Render calculated metrics to UI
   */
  function renderResults(res) {
    const isEs = I18N.currentLang === 'es';

    // Weights
    displayWeightKg.textContent = res.weightKg.toFixed(1);
    displayWeightLbs.textContent = res.weightLbs.toFixed(1);

    const minKg = Math.max(0, (res.weightKg - res.errorMarginKg)).toFixed(1);
    const maxKg = (res.weightKg + res.errorMarginKg).toFixed(1);
    const minLbs = Math.max(0, (res.weightLbs - res.errorMarginLbs)).toFixed(1);
    const maxLbs = (res.weightLbs + res.errorMarginLbs).toFixed(1);

    displayConfidenceRange.textContent = `${minKg} - ${maxKg} kg (${minLbs} - ${maxLbs} lbs)`;

    displayCarcassKg.textContent = `${res.carcassWeightKg} kg`;
    displayCarcassLbs.textContent = `${res.carcassWeightLbs} lbs`;

    // Time & Growth
    displayAge.textContent = isEs
      ? `${res.ageWeeks} sem (${res.ageDays} días)`
      : `${res.ageWeeks} wks (${res.ageDays} days)`;

    displayDaysToMarket.textContent = res.daysToMarket > 0
      ? (isEs ? `${res.daysToMarket} días (~${res.weeksToMarket} sem)` : `${res.daysToMarket} days (~${res.weeksToMarket} wks)`)
      : (isEs ? '¡Meta Cumplida!' : 'Target Reached!');

    displayMarketDate.textContent = res.daysToMarket > 0 ? res.marketDateStr : '---';

    displayADG.textContent = isEs
      ? `${res.adgKg} kg/día (${res.adgLbs} lb/d)`
      : `${res.adgKg} kg/day (${res.adgLbs} lb/d)`;

    displayFeedNeeded.textContent = res.feedRequiredKg > 0
      ? `${res.feedRequiredKg} kg (${res.feedRequiredLbs} lbs)`
      : '0 kg';

    displayFCR.textContent = `${res.fcr.toFixed(1)}:1`;

    // Stage Badge & Advice
    const stageTitle = I18N.get(`stage_${res.stageKey}`);
    const stageAdvice = I18N.get(`advice_${res.stageKey}`);

    displayStageBadge.textContent = stageTitle;
    displayStageAdvice.textContent = stageAdvice;

    // Progress Bar
    progressBarMarket.style.width = `${res.progressPercent}%`;
    progressPercentText.textContent = `${res.progressPercent}%`;
  }

  // Sync Vision landmarks dragging with sliders
  vision.onDimensionsChanged = ({ lengthCm, girthCm }) => {
    sliderLength.value = Math.max(30, Math.min(220, lengthCm));
    sliderGirth.value = Math.max(30, Math.min(220, girthCm));
    updateCalculations();
  };

  // Sync sliders to canvas landmarks
  sliderLength.addEventListener('input', () => {
    vision.setDimensionsFromSliders(parseFloat(sliderLength.value), parseFloat(sliderGirth.value));
    updateCalculations();
  });

  sliderGirth.addEventListener('input', () => {
    vision.setDimensionsFromSliders(parseFloat(sliderLength.value), parseFloat(sliderGirth.value));
    updateCalculations();
  });

  selectBCS.addEventListener('change', updateCalculations);
  selectBreed.addEventListener('change', updateCalculations);
  inputTargetWeight.addEventListener('input', updateCalculations);

  // File Upload Handlers
  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(I18N.get('alertImageError'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      currentImageSrc = e.target.result;
      vision.loadImage(currentImageSrc).then(() => {
        updateCalculations();
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
      });
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  btnTakePhoto.addEventListener('click', () => fileInput.click());
  btnUploadFile.addEventListener('click', () => fileInput.click());
  btnRetake.addEventListener('click', () => fileInput.click());

  // Live Camera Viewfinder Modal
  btnLiveCamera.addEventListener('click', async () => {
    try {
      currentVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      videoFeed.srcObject = currentVideoStream;
      cameraModal.classList.remove('hidden');
    } catch (err) {
      console.warn('Camera stream error:', err);
      alert(I18N.get('alertNoCamera'));
      fileInput.click();
    }
  });

  btnCloseCamera.addEventListener('click', () => {
    if (currentVideoStream) {
      currentVideoStream.getTracks().forEach(t => t.stop());
      currentVideoStream = null;
    }
    cameraModal.classList.add('hidden');
  });

  btnCaptureVideo.addEventListener('click', () => {
    if (!currentVideoStream) return;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = videoFeed.videoWidth || 640;
    offCanvas.height = videoFeed.videoHeight || 480;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(videoFeed, 0, 0, offCanvas.width, offCanvas.height);
    const dataUrl = offCanvas.toDataURL('image/jpeg', 0.92);

    // Stop camera
    currentVideoStream.getTracks().forEach(t => t.stop());
    currentVideoStream = null;
    cameraModal.classList.add('hidden');

    currentImageSrc = dataUrl;
    vision.loadImage(dataUrl).then(() => {
      updateCalculations();
      document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Preset Samples Click
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preset');
      const data = PRESET_DATA[key];
      if (data) {
        sliderLength.value = data.lengthCm;
        sliderGirth.value = data.girthCm;
        selectBCS.value = data.bcs;
        selectBreed.value = data.breed;

        currentImageSrc = data.src;
        vision.loadImage(data.src).then(() => {
          vision.setDimensionsFromSliders(data.lengthCm, data.girthCm);
          updateCalculations();
        });

        // Highlight active preset button
        presetButtons.forEach(b => b.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50'));
        btn.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50');
      }
    });
  });

  // Language Switcher buttons
  btnLangEn.addEventListener('click', () => I18N.setLang('en'));
  btnLangEs.addEventListener('click', () => I18N.setLang('es'));

  window.addEventListener('languageChanged', () => {
    updateCalculations();
    renderHistory();
  });

  // History Management
  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem('porciweight_history') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveScan(scan) {
    const list = getHistory();
    list.unshift(scan);
    if (list.length > 20) list.pop();
    try {
      localStorage.setItem('porciweight_history', JSON.stringify(list));
    } catch (e) {}
    renderHistory();
  }

  function renderHistory() {
    const list = getHistory();
    historyList.innerHTML = '';

    if (list.length === 0) {
      historyList.innerHTML = `
        <div class="text-center py-6 text-slate-400 text-sm">
          ${I18N.get('historyEmpty')}
        </div>
      `;
      return;
    }

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-sm';
      const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date(item.timestamp).toLocaleDateString();

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
            🐖
          </div>
          <div>
            <div class="font-bold text-slate-800">${item.weightKg} kg <span class="text-slate-500 font-normal">(${item.weightLbs} lbs)</span></div>
            <div class="text-xs text-slate-400">${dateStr} · ${timeStr} · ${I18N.get(`stage_${item.stageKey}`)}</div>
          </div>
        </div>
        <div class="text-right">
          <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ${item.daysToMarket} ${I18N.currentLang === 'es' ? 'días' : 'days'}
          </span>
        </div>
      `;
      historyList.appendChild(card);
    });
  }

  btnSaveScan.addEventListener('click', () => {
    if (!currentResults) return;
    saveScan(currentResults);
    alert(I18N.get('alertSaved'));
  });

  btnClearHistory.addEventListener('click', () => {
    localStorage.removeItem('porciweight_history');
    renderHistory();
  });

  // Export Report
  btnExportReport.addEventListener('click', () => {
    if (!currentResults) return;
    const isEs = I18N.currentLang === 'es';
    const lines = [
      `${isEs ? 'PORCIPESO - INFORME BIOMÉTRICO PORCINO' : 'PORCIWEIGHT - SWINE BIOMETRIC REPORT'}`,
      `----------------------------------------`,
      `${isEs ? 'Fecha' : 'Date'}: ${new Date().toLocaleString()}`,
      `${isEs ? 'Peso Vivo Estimado' : 'Estimated Live Weight'}: ${currentResults.weightKg} kg (${currentResults.weightLbs} lbs)`,
      `${isEs ? 'Rango de Confianza' : 'Confidence Range'}: ±${currentResults.errorMarginKg} kg`,
      `${isEs ? 'Rendimiento en Canal' : 'Est. Carcass Yield'}: ${currentResults.carcassWeightKg} kg`,
      `${isEs ? 'Longitud Corporal' : 'Body Length'}: ${sliderLength.value} cm`,
      `${isEs ? 'Perímetro Torácico' : 'Heart Girth'}: ${sliderGirth.value} cm`,
      `${isEs ? 'Condición Corporal' : 'Body Condition Score'}: ${selectBCS.value}/5`,
      `----------------------------------------`,
      `${isEs ? 'TIEMPOS Y CRECIMIENTO' : 'GROWTH & TIME ESTIMATES'}`,
      `${isEs ? 'Edad Estimada' : 'Estimated Age'}: ${currentResults.ageWeeks} ${isEs ? 'semanas' : 'weeks'} (${currentResults.ageDays} ${isEs ? 'días' : 'days'})`,
      `${isEs ? 'Fase de Crecimiento' : 'Growth Stage'}: ${I18N.get(`stage_${currentResults.stageKey}`)}`,
      `${isEs ? 'Ganancia Diaria (GDP)' : 'Avg Daily Gain (ADG)'}: ${currentResults.adgKg} kg/${isEs ? 'día' : 'day'}`,
      `${isEs ? 'Días para Faena/Mercado' : 'Days to Target Market'}: ${currentResults.daysToMarket} ${isEs ? 'días' : 'days'}`,
      `${isEs ? 'Fecha Estimada' : 'Projected Ready Date'}: ${currentResults.marketDateStr}`,
      `${isEs ? 'Alimento Restante Requerido' : 'Remaining Feed Needed'}: ${currentResults.feedRequiredKg} kg`,
      `${isEs ? 'Conversión Alimenticia (CA)' : 'Feed Conversion Ratio'}: ${currentResults.fcr}:1`,
      `----------------------------------------`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${isEs ? 'porcipeso-informe' : 'porciweight-report'}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Mobile Device Frame Toggle (Mobile simulator vs Full view)
  const btnToggleDeviceFrame = document.getElementById('btnToggleDeviceFrame');
  const appContainer = document.getElementById('appContainer');
  let isMobileFrame = true;

  if (btnToggleDeviceFrame) {
    btnToggleDeviceFrame.addEventListener('click', () => {
      isMobileFrame = !isMobileFrame;
      if (isMobileFrame) {
        appContainer.classList.add('max-w-md', 'shadow-2xl', 'rounded-3xl', 'border-8', 'border-slate-800');
        appContainer.classList.remove('max-w-4xl');
        btnToggleDeviceFrame.textContent = '📱 Mobile Frame (Active)';
      } else {
        appContainer.classList.remove('max-w-md', 'shadow-2xl', 'rounded-3xl', 'border-8', 'border-slate-800');
        appContainer.classList.add('max-w-4xl');
        btnToggleDeviceFrame.textContent = '💻 Desktop View (Active)';
      }
      vision.render();
    });
  }

  // Load default preset (Grower Pig) on start
  const defaultPreset = PRESET_DATA.grower;
  sliderLength.value = defaultPreset.lengthCm;
  sliderGirth.value = defaultPreset.girthCm;
  selectBCS.value = defaultPreset.bcs;
  selectBreed.value = defaultPreset.breed;
  vision.loadImage(defaultPreset.src).then(() => {
    vision.setDimensionsFromSliders(defaultPreset.lengthCm, defaultPreset.girthCm);
    updateCalculations();
  });

  // Initial render of history
  renderHistory();
});
