/**
 * Swine Weight & Growth Time Biometric Engine
 * Grounded in FAO and Iowa State University Swine Research
 */

const SwineEstimator = {
  // Breed morphometric multipliers
  BREEDS: {
    commercial: { name_en: 'Commercial Cross (Yorkshire/Landrace)', name_es: 'Cruzado Comercial (Yorkshire/Landrace)', factor: 1.00, matureWeight: 260 },
    duroc: { name_en: 'Duroc (Heavy Muscled)', name_es: 'Duroc (Alta Musculatura)', factor: 1.04, matureWeight: 280 },
    pietrain: { name_en: 'Pietrain (Lean Ham)', name_es: 'Pietrain (Pernil Magro)', factor: 1.06, matureWeight: 250 },
    berkshire: { name_en: 'Berkshire (Kurobuta)', name_es: 'Berkshire (Kurobuta)', factor: 1.02, matureWeight: 270 },
    iberian: { name_en: 'Iberian / Rustic', name_es: 'Ibérico / Rústico', factor: 0.96, matureWeight: 210 },
    potbellied: { name_en: 'Miniature / Potbellied', name_es: 'Miniatura / Viet Min', factor: 0.90, matureWeight: 75 }
  },

  // Body condition scores (1-5)
  BCS_FACTORS: {
    1: { factor: 0.88, label_en: 'Emaciated', label_es: 'Demacrado' },
    2: { factor: 0.94, label_en: 'Thin', label_es: 'Delgado' },
    3: { factor: 1.00, label_en: 'Ideal / Optimal', label_es: 'Ideal / Óptimo' },
    4: { factor: 1.06, label_en: 'Fat / Overconditioned', label_es: 'Graso / Sobrepeso' },
    5: { factor: 1.13, label_en: 'Obese', label_es: 'Obeso' }
  },

  // Standard Target Slaughter Weight (kg)
  DEFAULT_TARGET_WEIGHT_KG: 115.0,

  /**
   * Calculate live weight from body length and heart girth
   * @param {number} lengthCm - Snout-to-tail base length in centimeters
   * @param {number} girthCm - Thorax heart girth circumference in centimeters
   * @param {number} bcs - Body condition score (1-5)
   * @param {string} breedKey - Breed identifier
   * @returns {object} Calculated weights in kg and lbs with margin of error
   */
  calculateWeight(lengthCm, girthCm, bcs = 3, breedKey = 'commercial') {
    const breed = this.BREEDS[breedKey] || this.BREEDS.commercial;
    const bcsData = this.BCS_FACTORS[bcs] || this.BCS_FACTORS[3];

    // Standard metric swine volume formula: (Girth^2 * Length) / 14250
    // calibrated with empirical livestock constants
    const baseWeightKg = (Math.pow(girthCm, 2) * lengthCm) / 14250;
    const adjustedWeightKg = baseWeightKg * breed.factor * bcsData.factor;

    const weightKg = Math.round(adjustedWeightKg * 10) / 10;
    const weightLbs = Math.round((weightKg * 2.20462) * 10) / 10;

    // Confidence interval: 95% margin typically ± 3.5%
    const errorMarginKg = Math.round((weightKg * 0.038) * 10) / 10;
    const errorMarginLbs = Math.round((weightLbs * 0.038) * 10) / 10;

    // Dressing percentage (Carcass yield ~74% - 76%)
    const carcassWeightKg = Math.round((weightKg * 0.745) * 10) / 10;
    const carcassWeightLbs = Math.round((weightLbs * 0.745) * 10) / 10;

    return {
      weightKg,
      weightLbs,
      errorMarginKg,
      errorMarginLbs,
      carcassWeightKg,
      carcassWeightLbs,
      bcs,
      breedKey
    };
  },

  /**
   * Derive estimated age, growth stage, ADG, days to market, and feeding schedule
   * @param {number} weightKg - Estimated current weight in kg
   * @param {number} targetMarketKg - Target slaughter weight (default 115kg)
   */
  calculateGrowthTimeEstimates(weightKg, targetMarketKg = 115.0) {
    // Inverse Gompertz Swine Growth Function:
    // W(t) = W_mature * exp(-exp(-k * (t - t0)))
    // Solving for age t in days given weight W
    const W_mature = 260.0;
    const k = 0.0165; // growth rate constant
    const t0 = 85;    // inflection day

    let ageDays = 0;
    if (weightKg > 1.2 && weightKg < W_mature - 10) {
      const ratio = weightKg / W_mature;
      ageDays = Math.round(t0 - (Math.log(-Math.log(ratio)) / k));
    } else if (weightKg <= 1.2) {
      ageDays = Math.max(1, Math.round(weightKg * 4));
    } else {
      ageDays = 250 + Math.round((weightKg - (W_mature - 10)) * 2);
    }
    ageDays = Math.max(7, ageDays);
    const ageWeeks = Math.round((ageDays / 7) * 10) / 10;
    const ageMonths = Math.round((ageDays / 30.4) * 10) / 10;

    // Growth Stage Determination & Average Daily Gain (ADG)
    let stageKey = 'grower';
    let adgKg = 0.80; // default kg/day gain
    let fcr = 2.6;    // Feed Conversion Ratio (kg feed / kg gain)

    if (weightKg < 10) {
      stageKey = 'piglet';
      adgKg = 0.35;
      fcr = 1.3;
    } else if (weightKg < 28) {
      stageKey = 'nursery';
      adgKg = 0.55;
      fcr = 1.8;
    } else if (weightKg < 65) {
      stageKey = 'grower';
      adgKg = 0.78;
      fcr = 2.4;
    } else if (weightKg < 110) {
      stageKey = 'finisher';
      adgKg = 0.92;
      fcr = 2.9;
    } else if (weightKg < 135) {
      stageKey = 'market';
      adgKg = 0.85;
      fcr = 3.2;
    } else {
      stageKey = 'mature';
      adgKg = 0.30;
      fcr = 3.8;
    }

    // Days to Market Weight
    const weightGap = Math.max(0, targetMarketKg - weightKg);
    let daysToMarket = 0;
    if (weightGap > 0) {
      daysToMarket = Math.ceil(weightGap / adgKg);
    }

    // Projected Market Date
    const today = new Date();
    const marketDate = new Date(today);
    marketDate.setDate(today.getDate() + daysToMarket);

    // Total Feed Required to Market (kg)
    const feedRequiredKg = Math.round((weightGap * fcr) * 10) / 10;
    const feedRequiredLbs = Math.round((feedRequiredKg * 2.20462) * 10) / 10;

    // Growth curve progress percentage towards market weight (0 - 100%)
    const progressPercent = Math.min(100, Math.round((weightKg / targetMarketKg) * 100));

    return {
      ageDays,
      ageWeeks,
      ageMonths,
      stageKey,
      adgKg,
      adgLbs: Math.round((adgKg * 2.20462) * 100) / 100,
      fcr,
      targetMarketKg,
      targetMarketLbs: Math.round(targetMarketKg * 2.20462),
      daysToMarket,
      weeksToMarket: Math.round((daysToMarket / 7) * 10) / 10,
      marketDateStr: marketDate.toISOString().split('T')[0],
      feedRequiredKg,
      feedRequiredLbs,
      progressPercent
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SwineEstimator;
}
