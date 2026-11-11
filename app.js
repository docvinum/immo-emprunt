
"use strict";

/**
 * MON BUDGET IMMO
 * app.js
 *
 * Simulateur de capacité d'emprunt immobilier.
 * Application statique, sans dépendance externe.
 *
 * Les calculs sont indicatifs et ne constituent
 * ni un TAEG réglementaire ni une offre bancaire.
 */

(() => {
  // ==========================================================
  // 1. CONFIGURATION
  // ==========================================================

  const DEFAULTS = Object.freeze({
    salary1: 75000,
    salary2: 50000,
    coBorrower: true,
    status1: "cadre",
    status2: "cadre",
    net1Override: null,
    net2Override: null,

    duration: 20,
    interestRate: 3.62,

    insuranceRate: 0.20,
    insuranceDetailed: false,
    insurance1Rate: 0.20,
    insurance1Share: 100,
    insurance2Rate: 0.20,
    insurance2Share: 100,

    debtRatio: 35,
    existingLoans: 0,

    downPayment: 50000,
    propertyType: "old",
    purchaseFees: 8
  });

  const DEFAULT_RATES = Object.freeze({
    15: 3.43,
    20: 3.62,
    25: 3.77
  });

  const PROPERTY_FEES = Object.freeze({
    old: 8,
    new: 3
  });

  const NET_RATIOS = Object.freeze({
    cadre: 0.76,
    noncadre: 0.78
  });

  const LIMITS = Object.freeze({
    salary: [0, 1000000],
    net: [0, 100000],
    rate: [0, 30],
    insuranceRate: [0, 10],
    share: [0, 100],
    existingLoans: [0, 100000],
    downPayment: [0, 100000000],
    fees: [0, 30]
  });

  const URL_KEYS = Object.freeze({
    salary1: "salary1",
    salary2: "salary2",
    coBorrower: "co",
    status1: "status1",
    status2: "status2",
    net1Override: "net1",
    net2Override: "net2",
    duration: "years",
    interestRate: "rate",
    insuranceRate: "insurance",
    insuranceDetailed: "detailed",
    insurance1Rate: "insurance1",
    insurance1Share: "share1",
    insurance2Rate: "insurance2",
    insurance2Share: "share2",
    debtRatio: "debt",
    existingLoans: "loans",
    downPayment: "apport",
    propertyType: "type",
    purchaseFees: "fees"
  });

  const EURO = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  });

  const PERCENT = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const state = { ...DEFAULTS };

  // ==========================================================
  // 2. DOM
  // ==========================================================

  const $ = (id) => {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`Élément HTML introuvable : #${id}`);
    }

    return element;
  };

  const elements = {
    salary1: $("salary1"),
    salary1Range: $("salary1-range"),
    salary2: $("salary2"),
    salary2Range: $("salary2-range"),

    coBorrower: $("co-borrower"),
    coBorrowerFields: $("co-borrower-fields"),

    net1Override: $("net1-override"),
    net2Override: $("net2-override"),
    net2OverrideField: $("net2-override-field"),

    interestRate: $("interest-rate"),
    insuranceRate: $("insurance-rate"),

    insuranceDetailed: $("insurance-detailed"),
    insuranceDetails: $("insurance-details"),
    insurance1Rate: $("insurance1-rate"),
    insurance1Share: $("insurance1-share"),
    insurance2Rate: $("insurance2-rate"),
    insurance2Share: $("insurance2-share"),
    insurance2Fields: $("insurance2-fields"),
    insuranceEffective: $("insurance-effective"),

    existingLoans: $("existing-loans"),
    downPayment: $("down-payment"),
    purchaseFees: $("purchase-fees"),

    capitalResult: $("capital-result"),
    capitalCaption: $("capital-caption"),
    propertyResult: $("property-result"),
    monthlyResult: $("monthly-result"),

    net1Result: $("net1-result"),
    net2Result: $("net2-result"),

    budgetResult: $("budget-result"),
    householdNetResult: $("household-net-result"),
    maxDebtResult: $("max-debt-result"),
    existingLoansResult: $("existing-loans-result"),
    availableMonthlyResult: $("available-monthly-result"),

    loanCapitalResult: $("loan-capital-result"),
    loanPaymentResult: $("loan-payment-result"),
    insurancePaymentResult: $("insurance-payment-result"),
    totalInterestResult: $("total-interest-result"),
    totalInsuranceResult: $("total-insurance-result"),
    totalCreditCostResult: $("total-credit-cost-result"),
    totalRepaidResult: $("total-repaid-result"),

    downPaymentResult: $("down-payment-result"),
    purchaseFeesResult: $("purchase-fees-result"),
    propertyPriceResult: $("property-price-result"),

    warningMessage: $("warning-message"),
    shareButton: $("share-button"),
    resetButton: $("reset-button"),
    shareFeedback: $("share-feedback")
  };

  // ==========================================================
  // 3. UTILITAIRES
  // ==========================================================

  function formatEuro(value) {
    return EURO.format(
      Number.isFinite(value) ? value : 0
    );
  }

  function formatPercent(value) {
    return `${PERCENT.format(value)} %`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function isFiniteNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );
  }

  function parseNumber(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== "string") {
      return null;
    }

    const normalized = value
      .trim()
      .replace(/\s/g, "")
      .replace(",", ".");

    if (normalized === "") {
      return null;
    }

    const result = Number(normalized);

    return Number.isFinite(result) ? result : null;
  }

  function safeNumber(value, fallback, limits) {
    const parsed = parseNumber(value);

    if (parsed === null) {
      return fallback;
    }

    return clamp(parsed, limits[0], limits[1]);
  }

  function setText(element, value) {
    element.textContent = value;
  }

  function getCheckedRadio(name) {
    return document.querySelector(
      `input[name="${name}"]:checked`
    )?.value;
  }

  function setCheckedRadio(name, value) {
    const radios = document.querySelectorAll(
      `input[name="${name}"]`
    );

    for (const radio of radios) {
      radio.checked = radio.value === String(value);
    }
  }

  function setNumberInput(element, value) {
    element.value = String(value);
  }

  function show(element, visible) {
    element.hidden = !visible;
  }

  // ==========================================================
  // 4. MOTEUR FINANCIER
  // ==========================================================

  /**
   * Convertit un salaire brut annuel en net mensuel
   * avant prélèvement à la source.
   *
   * Le coefficient est indicatif.
   */
  function calculateNetSalary(
    annualGross,
    status,
    override = null
  ) {
    if (isFiniteNumber(override)) {
      return Math.max(0, override);
    }

    const ratio = NET_RATIOS[status] ?? NET_RATIOS.cadre;

    return Math.max(0, annualGross * ratio / 12);
  }

  /**
   * Calcule le taux annuel effectif d'assurance
   * sur le capital initial.
   *
   * Exemple :
   * 0,20 % × 100 % + 0,20 % × 100 % = 0,40 %.
   *
   * Les taux sont exprimés en pourcentage.
   */
  function calculateEffectiveInsurance(config) {
    if (!config.insuranceDetailed) {
      return config.insuranceRate;
    }

    const first =
      config.insurance1Rate *
      config.insurance1Share / 100;

    const second = config.coBorrower
      ? config.insurance2Rate *
        config.insurance2Share / 100
      : 0;

    return first + second;
  }

  /**
   * Facteur de mensualité d'un crédit amortissable.
   *
   * f = r / (1 - (1 + r)^(-n))
   *
   * r = taux annuel / 12
   * n = nombre de mensualités
   */
  function calculateAmortizationFactor(
    annualRatePercent,
    months
  ) {
    if (months <= 0) {
      return 0;
    }

    const monthlyRate =
      annualRatePercent / 100 / 12;

    if (monthlyRate === 0) {
      return 1 / months;
    }

    // log1p et expm1 améliorent la précision
    // pour les taux très proches de zéro.
    const denominator = -Math.expm1(
      -months * Math.log1p(monthlyRate)
    );

    return monthlyRate / denominator;
  }

  /**
   * Capital maximal à partir d'une mensualité
   * disponible assurance comprise.
   */
  function calculateBorrowableCapital({
    monthlyBudget,
    annualRatePercent,
    insuranceRatePercent,
    months
  }) {
    if (monthlyBudget <= 0 || months <= 0) {
      return 0;
    }

    const factor = calculateAmortizationFactor(
      annualRatePercent,
      months
    );

    const insuranceFactor =
      insuranceRatePercent / 100 / 12;

    const denominator = factor + insuranceFactor;

    if (denominator <= 0) {
      return 0;
    }

    return monthlyBudget / denominator;
  }

  /**
   * Produit l'intégralité des résultats.
   *
   * Fonction pure :
   * aucune lecture ou écriture dans le DOM.
   */
  function calculateSimulation(config) {
    const net1 = calculateNetSalary(
      config.salary1,
      config.status1,
      config.net1Override
    );

    const net2 = config.coBorrower
      ? calculateNetSalary(
          config.salary2,
          config.status2,
          config.net2Override
        )
      : 0;

    const householdNet = net1 + net2;

    const maxDebtMonthly =
      householdNet * config.debtRatio / 100;

    const existingLoans = Math.max(
      0,
      config.existingLoans
    );

    const availableMonthly = Math.max(
      0,
      maxDebtMonthly - existingLoans
    );

    const months = config.duration * 12;

    const effectiveInsurance =
      calculateEffectiveInsurance(config);

    const amortizationFactor =
      calculateAmortizationFactor(
        config.interestRate,
        months
      );

    const capital = calculateBorrowableCapital({
      monthlyBudget: availableMonthly,
      annualRatePercent: config.interestRate,
      insuranceRatePercent: effectiveInsurance,
      months
    });

    const loanMonthly =
      capital * amortizationFactor;

    const insuranceMonthly =
      capital * effectiveInsurance / 100 / 12;

    const totalMonthly =
      loanMonthly + insuranceMonthly;

    const totalInterest = Math.max(
      0,
      loanMonthly * months - capital
    );

    const totalInsurance =
      insuranceMonthly * months;

    const totalCreditCost =
      totalInterest + totalInsurance;

    const totalRepaid =
      capital + totalCreditCost;

    const downPayment = Math.max(
      0,
      config.downPayment
    );

    const acquisitionBudget =
      capital + downPayment;

    const feesRatio =
      config.purchaseFees / 100;

    const propertyPrice =
      acquisitionBudget / (1 + feesRatio);

    const acquisitionFees =
      propertyPrice * feesRatio;

    return {
      net1,
      net2,
      householdNet,

      maxDebtMonthly,
      existingLoans,
      availableMonthly,

      months,
      effectiveInsurance,

      capital,
      loanMonthly,
      insuranceMonthly,
      totalMonthly,

      totalInterest,
      totalInsurance,
      totalCreditCost,
      totalRepaid,

      downPayment,
      acquisitionBudget,
      propertyPrice,
      acquisitionFees,

      debtCapacityExceeded:
        existingLoans >= maxDebtMonthly &&
        existingLoans > 0
    };
  }

  // ==========================================================
  // 5. RENDU DES RÉSULTATS
  // ==========================================================

  function renderResults(result) {
    setText(
      elements.capitalResult,
      formatEuro(result.capital)
    );

    setText(
      elements.capitalCaption,
      `Sur ${state.duration} ans`
    );

    setText(
      elements.propertyResult,
      formatEuro(result.propertyPrice)
    );

    setText(
      elements.monthlyResult,
      formatEuro(result.availableMonthly)
    );

    setText(
      elements.net1Result,
      formatEuro(result.net1)
    );

    setText(
      elements.net2Result,
      formatEuro(result.net2)
    );

    setText(
      elements.budgetResult,
      formatEuro(result.acquisitionBudget)
    );

    setText(
      elements.householdNetResult,
      formatEuro(result.householdNet)
    );

    setText(
      elements.maxDebtResult,
      formatEuro(result.maxDebtMonthly)
    );

    setText(
      elements.existingLoansResult,
      formatEuro(result.existingLoans)
    );

    setText(
      elements.availableMonthlyResult,
      formatEuro(result.availableMonthly)
    );

    setText(
      elements.loanCapitalResult,
      formatEuro(result.capital)
    );

    setText(
      elements.loanPaymentResult,
      formatEuro(result.loanMonthly)
    );

    setText(
      elements.insurancePaymentResult,
      formatEuro(result.insuranceMonthly)
    );

    setText(
      elements.totalInterestResult,
      formatEuro(result.totalInterest)
    );

    setText(
      elements.totalInsuranceResult,
      formatEuro(result.totalInsurance)
    );

    setText(
      elements.totalCreditCostResult,
      formatEuro(result.totalCreditCost)
    );

    setText(
      elements.totalRepaidResult,
      formatEuro(result.totalRepaid)
    );

    setText(
      elements.downPaymentResult,
      formatEuro(result.downPayment)
    );

    setText(
      elements.purchaseFeesResult,
      formatEuro(result.acquisitionFees)
    );

    setText(
      elements.propertyPriceResult,
      formatEuro(result.propertyPrice)
    );

    setText(
      elements.insuranceEffective,
      `Taux global effectif : ${
        formatPercent(result.effectiveInsurance)
      }`
    );

    renderWarnings(result);
  }

  function renderWarnings(result) {
    const warnings = [];

    if (result.debtCapacityExceeded) {
      warnings.push(
        "Vos crédits existants atteignent ou dépassent " +
        "votre capacité d'endettement estimée. " +
        "Aucune mensualité supplémentaire n'est disponible."
      );
    }

    if (
      state.insuranceDetailed &&
      state.insurance1Share +
        (state.coBorrower ? state.insurance2Share : 0) < 100
    ) {
      warnings.push(
        "La quotité totale d'assurance est inférieure " +
        "à 100 %. Cette couverture peut être insuffisante " +
        "pour obtenir un financement."
      );
    }

    if (
      result.availableMonthly === 0 &&
      !result.debtCapacityExceeded
    ) {
      warnings.push(
        "La capacité mensuelle disponible est nulle " +
        "avec les paramètres actuels."
      );
    }

    if (warnings.length === 0) {
      elements.warningMessage.textContent = "";
      show(elements.warningMessage, false);
      return;
    }

    elements.warningMessage.textContent =
      warnings.join(" ");

    show(elements.warningMessage, true);
  }

  // ==========================================================
  // 6. AFFICHAGE DES CONTRÔLES
  // ==========================================================

  function renderControls() {
    setNumberInput(elements.salary1, state.salary1);
    setNumberInput(elements.salary2, state.salary2);

    elements.salary1Range.value = String(
      clamp(
        state.salary1,
        Number(elements.salary1Range.min),
        Number(elements.salary1Range.max)
      )
    );

    elements.salary2Range.value = String(
      clamp(
        state.salary2,
        Number(elements.salary2Range.min),
        Number(elements.salary2Range.max)
      )
    );

    elements.coBorrower.checked = state.coBorrower;

    show(
      elements.coBorrowerFields,
      state.coBorrower
    );

    show(
      elements.net2OverrideField,
      state.coBorrower
    );

    setCheckedRadio("status1", state.status1);
    setCheckedRadio("status2", state.status2);

    elements.net1Override.value =
      state.net1Override === null
        ? ""
        : String(state.net1Override);

    elements.net2Override.value =
      state.net2Override === null
        ? ""
        : String(state.net2Override);

    setCheckedRadio("duration", state.duration);

    setNumberInput(
      elements.interestRate,
      state.interestRate
    );

    setNumberInput(
      elements.insuranceRate,
      state.insuranceRate
    );

    elements.insuranceDetailed.checked =
      state.insuranceDetailed;

    show(
      elements.insuranceDetails,
      state.insuranceDetailed
    );

    elements.insuranceRate.disabled =
      state.insuranceDetailed;

    setNumberInput(
      elements.insurance1Rate,
      state.insurance1Rate
    );

    setNumberInput(
      elements.insurance1Share,
      state.insurance1Share
    );

    setNumberInput(
      elements.insurance2Rate,
      state.insurance2Rate
    );

    setNumberInput(
      elements.insurance2Share,
      state.insurance2Share
    );

    show(
      elements.insurance2Fields,
      state.coBorrower
    );

    setCheckedRadio(
      "debt-ratio",
      state.debtRatio
    );

    setNumberInput(
      elements.existingLoans,
      state.existingLoans
    );

    setNumberInput(
      elements.downPayment,
      state.downPayment
    );

    setCheckedRadio(
      "property-type",
      state.propertyType
    );

    setNumberInput(
      elements.purchaseFees,
      state.purchaseFees
    );
  }

  function update() {
    const result = calculateSimulation(state);

    renderResults(result);

    return result;
  }

  // ==========================================================
  // 7. SYNCHRONISATION DES CURSEURS
  // ==========================================================

  function bindSalary(numberInput, rangeInput, key) {
    rangeInput.addEventListener("input", () => {
      state[key] = safeNumber(
        rangeInput.value,
        state[key],
        LIMITS.salary
      );

      numberInput.value = String(state[key]);

      update();
    });

    numberInput.addEventListener("input", () => {
      const parsed = parseNumber(numberInput.value);

      if (parsed === null) {
        return;
      }

      state[key] = clamp(
        parsed,
        ...LIMITS.salary
      );

      rangeInput.value = String(
        clamp(
          state[key],
          Number(rangeInput.min),
          Number(rangeInput.max)
        )
      );

      update();
    });

    numberInput.addEventListener("change", () => {
      const normalized = safeNumber(
        numberInput.value,
        state[key],
        LIMITS.salary
      );

      state[key] = normalized;

      numberInput.value = String(normalized);

      rangeInput.value = String(
        clamp(
          normalized,
          Number(rangeInput.min),
          Number(rangeInput.max)
        )
      );

      update();
    });
  }

  // ==========================================================
  // 8. CHAMPS NUMÉRIQUES
  // ==========================================================

  function bindNumber(element, key, limits) {
    element.addEventListener("input", () => {
      const parsed = parseNumber(element.value);

      if (parsed === null) {
        return;
      }

      state[key] = clamp(parsed, ...limits);

      update();
    });

    element.addEventListener("change", () => {
      state[key] = safeNumber(
        element.value,
        state[key],
        limits
      );

      element.value = String(state[key]);

      update();
    });
  }

  function bindNullableNumber(element, key, limits) {
    element.addEventListener("input", () => {
      if (element.value.trim() === "") {
        state[key] = null;
        update();
        return;
      }

      const parsed = parseNumber(element.value);

      if (parsed === null) {
        return;
      }

      state[key] = clamp(parsed, ...limits);

      update();
    });

    element.addEventListener("change", () => {
      if (element.value.trim() === "") {
        state[key] = null;
      } else {
        state[key] = safeNumber(
          element.value,
          state[key] ?? 0,
          limits
        );
      }

      element.value =
        state[key] === null
          ? ""
          : String(state[key]);

      update();
    });
  }

  // ==========================================================
  // 9. RADIOS
  // ==========================================================

  function bindRadio(name, callback) {
    const radios = document.querySelectorAll(
      `input[name="${name}"]`
    );

    for (const radio of radios) {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          callback(radio.value);
          update();
        }
      });
    }
  }

  // ==========================================================
  // 10. URL PARTAGEABLE
  // ==========================================================

  function serializeState(config) {
    const params = new URLSearchParams();

    for (const [key, urlKey] of Object.entries(URL_KEYS)) {
      const value = config[key];

      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === "boolean") {
        params.set(urlKey, value ? "1" : "0");
      } else {
        params.set(urlKey, String(value));
      }
    }

    return params;
  }

  function readBoolean(value, fallback) {
    if (value === "1" || value === "true") {
      return true;
    }

    if (value === "0" || value === "false") {
      return false;
    }

    return fallback;
  }

  function readURLState() {
    const params = new URLSearchParams(
      window.location.search
    );

    const result = { ...DEFAULTS };

    const numericFields = {
      salary1: LIMITS.salary,
      salary2: LIMITS.salary,
      net1Override: LIMITS.net,
      net2Override: LIMITS.net,
      interestRate: LIMITS.rate,
      insuranceRate: LIMITS.insuranceRate,
      insurance1Rate: LIMITS.insuranceRate,
      insurance2Rate: LIMITS.insuranceRate,
      insurance1Share: LIMITS.share,
      insurance2Share: LIMITS.share,
      existingLoans: LIMITS.existingLoans,
      downPayment: LIMITS.downPayment,
      purchaseFees: LIMITS.fees
    };

    for (const [key, limits] of Object.entries(
      numericFields
    )) {
      const urlKey = URL_KEYS[key];

      if (!params.has(urlKey)) {
        continue;
      }

      const raw = params.get(urlKey);

      if (
        (key === "net1Override" ||
         key === "net2Override") &&
        raw === ""
      ) {
        result[key] = null;
        continue;
      }

      const parsed = parseNumber(raw);

      if (parsed !== null) {
        result[key] = clamp(parsed, ...limits);
      }
    }

    for (const key of [
      "coBorrower",
      "insuranceDetailed"
    ]) {
      const urlKey = URL_KEYS[key];

      if (params.has(urlKey)) {
        result[key] = readBoolean(
          params.get(urlKey),
          result[key]
        );
      }
    }

    for (const key of ["status1", "status2"]) {
      const value = params.get(URL_KEYS[key]);

      if (value === "cadre" || value === "noncadre") {
        result[key] = value;
      }
    }

    const duration = Number(
      params.get(URL_KEYS.duration)
    );

    if ([15, 20, 25].includes(duration)) {
      result.duration = duration;

      if (!params.has(URL_KEYS.interestRate)) {
        result.interestRate =
          DEFAULT_RATES[duration];
      }
    }

    const debt = Number(
      params.get(URL_KEYS.debtRatio)
    );

    if ([33, 35].includes(debt)) {
      result.debtRatio = debt;
    }

    const propertyType = params.get(
      URL_KEYS.propertyType
    );

    if (
      propertyType === "old" ||
      propertyType === "new"
    ) {
      result.propertyType = propertyType;

      if (!params.has(URL_KEYS.purchaseFees)) {
        result.purchaseFees =
          PROPERTY_FEES[propertyType];
      }
    }

    return result;
  }

  function buildShareURL() {
    const url = new URL(window.location.href);

    url.search = serializeState(state).toString();

    // Les fragments existants ne sont pas utiles
    // au partage de cette simulation.
    url.hash = "";

    return url.toString();
  }

  async function copyShareURL() {
    const url = buildShareURL();

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback pour certains contextes
        // où Clipboard API est indisponible.
        const textarea = document.createElement(
          "textarea"
        );

        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");

        textarea.remove();

        if (!copied) {
          throw new Error(
            "Copie non prise en charge"
          );
        }
      }

      elements.shareFeedback.textContent =
        "Lien copié. Attention : il contient les revenus saisis.";
    } catch (error) {
      elements.shareFeedback.textContent =
        "Copie impossible. Utilisez la barre d'adresse " +
        "ou un navigateur compatible.";

      // Afficher l'URL pour permettre
      // une copie manuelle.
      window.prompt(
        "Copiez ce lien de simulation :",
        url
      );
    }
  }

  // ==========================================================
  // 11. RÉINITIALISATION
  // ==========================================================

  function resetSimulation() {
    Object.assign(state, DEFAULTS);

    renderControls();
    update();

    elements.shareFeedback.textContent = "";

    // Retire les paramètres de simulation
    // sans recharger la page.
    try {
      const cleanURL = new URL(
        window.location.href
      );

      cleanURL.search = "";
      cleanURL.hash = "";

      window.history.replaceState(
        null,
        "",
        cleanURL.toString()
      );
    } catch {
      // L'interface reste fonctionnelle
      // si l'historique est inaccessible.
    }
  }

  // ==========================================================
  // 12. ÉVÉNEMENTS
  // ==========================================================

  function bindEvents() {
    bindSalary(
      elements.salary1,
      elements.salary1Range,
      "salary1"
    );

    bindSalary(
      elements.salary2,
      elements.salary2Range,
      "salary2"
    );

    elements.coBorrower.addEventListener(
      "change",
      () => {
        state.coBorrower =
          elements.coBorrower.checked;

        renderControls();
        update();
      }
    );

    bindRadio("status1", (value) => {
      state.status1 = value;
    });

    bindRadio("status2", (value) => {
      state.status2 = value;
    });

    bindNullableNumber(
      elements.net1Override,
      "net1Override",
      LIMITS.net
    );

    bindNullableNumber(
      elements.net2Override,
      "net2Override",
      LIMITS.net
    );

    bindRadio("duration", (value) => {
      state.duration = Number(value);

      state.interestRate =
        DEFAULT_RATES[state.duration];

      setNumberInput(
        elements.interestRate,
        state.interestRate
      );
    });

    bindNumber(
      elements.interestRate,
      "interestRate",
      LIMITS.rate
    );

    bindNumber(
      elements.insuranceRate,
      "insuranceRate",
      LIMITS.insuranceRate
    );

    elements.insuranceDetailed.addEventListener(
      "change",
      () => {
        state.insuranceDetailed =
          elements.insuranceDetailed.checked;

        renderControls();
        update();
      }
    );

    bindNumber(
      elements.insurance1Rate,
      "insurance1Rate",
      LIMITS.insuranceRate
    );

    bindNumber(
      elements.insurance2Rate,
      "insurance2Rate",
      LIMITS.insuranceRate
    );

    bindNumber(
      elements.insurance1Share,
      "insurance1Share",
      LIMITS.share
    );

    bindNumber(
      elements.insurance2Share,
      "insurance2Share",
      LIMITS.share
    );

    bindRadio("debt-ratio", (value) => {
      state.debtRatio = Number(value);
    });

    bindNumber(
      elements.existingLoans,
      "existingLoans",
      LIMITS.existingLoans
    );

    bindNumber(
      elements.downPayment,
      "downPayment",
      LIMITS.downPayment
    );

    bindRadio("property-type", (value) => {
      state.propertyType = value;

      state.purchaseFees =
        PROPERTY_FEES[value];

      setNumberInput(
        elements.purchaseFees,
        state.purchaseFees
      );
    });

    bindNumber(
      elements.purchaseFees,
      "purchaseFees",
      LIMITS.fees
    );

    elements.shareButton.addEventListener(
      "click",
      copyShareURL
    );

    elements.resetButton.addEventListener(
      "click",
      resetSimulation
    );

    // Navigation arrière / avant si l'URL
    // contient une simulation.
    window.addEventListener("popstate", () => {
      Object.assign(state, readURLState());

      renderControls();
      update();
    });
  }

  // ==========================================================
  // 13. INITIALISATION
  // ==========================================================

  function init() {
    Object.assign(state, readURLState());

    renderControls();
    bindEvents();
    update();
  }

  init();

})();
