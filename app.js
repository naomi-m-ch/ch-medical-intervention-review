const pillars = [
  {
    id: "benefit",
    name: "Evidence of benefit",
    type: "Core",
    prompt: "Human evidence for patient-important outcomes, comparator, population, and magnitude of effect.",
    help: "Ask what human evidence shows meaningful improvement, in whom, compared with what, and how large the effect is. Prioritise patient-important outcomes over biomarkers or mechanism alone."
  },
  {
    id: "safety",
    name: "Safety and risk",
    type: "Core",
    prompt: "Known, plausible, and unknown harms; safety evidence; monitoring and contraindications.",
    help: "Assess known adverse effects, plausible harms, unknown long-term risks, contraindications, monitoring requirements, and whether the safety evidence is strong enough for the proposed setting."
  },
  {
    id: "governance",
    name: "Value, equity, ethics, and governance",
    type: "Core",
    prompt: "Cost, opportunity cost, equity, ethics, regulatory status, and professional defensibility.",
    help: "Decide whether this is a responsible, defensible choice considering cost, opportunity cost, access, regulation, off-label use, professional standards, and consent."
  },
  {
    id: "need",
    name: "Clinical need and intended role",
    type: "Supporting",
    prompt: "Meaningful clinical problem and pathway role: prevention, treatment, adjunct, recovery, or specialist use.",
    help: "Clarify the problem being solved and where the intervention sits in the pathway. A real need does not by itself prove the intervention should be used."
  },
  {
    id: "mechanism",
    name: "Mechanism and biological plausibility",
    type: "Supporting",
    prompt: "Physiological or pathophysiological rationale, and how much rests on surrogate or mechanistic evidence.",
    help: "Review whether the proposed mechanism is credible, and be explicit when the case relies mainly on animal, cell, biomarker, or surrogate evidence rather than clinical outcomes."
  },
  {
    id: "population",
    name: "Population fit and personalisation",
    type: "Supporting",
    prompt: "Suitable groups, excluded groups, subgroup tailoring, and individualisation logic.",
    help: "Define who may benefit, who should be excluded, and whether subgroup or personalised use is supported by evidence or strong clinical logic."
  },
  {
    id: "acceptability",
    name: "Patient-centred acceptability",
    type: "Supporting",
    prompt: "Health seeker and clinician acceptability once burden, uncertainty, side effects, stigma, and adherence are explicit.",
    help: "Consider whether informed health seekers and clinicians would still find the intervention acceptable after uncertainty, side effects, burden, stigma, and adherence demands are made clear."
  },
  {
    id: "feasibility",
    name: "Implementation feasibility",
    type: "Supporting",
    prompt: "Safe, consistent delivery in the intended setting with workflow, monitoring, training, and follow-up.",
    help: "Check whether Cascaid can deliver this consistently and safely, including workflow, training, monitoring, documentation, follow-up, escalation, and specialist requirements."
  }
];

const sampleReview = {
  id: crypto.randomUUID(),
  updatedAt: new Date().toISOString(),
  intervention: "BPC-157",
  classification: "Unlicensed medicine / special",
  indication: "Musculoskeletal healing / recovery",
  population: "Adults considering recovery support; tested athletes excluded unless anti-doping status is resolved",
  comparator: "Usual care, rehabilitation, standard medical care, or placebo",
  setting: "Research-only setting",
  question: "Should Cascaid recommend BPC-157 for musculoskeletal healing or recovery?",
  redFlag: true,
  supplementIntegrity: false,
  offLabel: true,
  gateNotes: "Regulatory uncertainty, product quality variability, and anti-doping implications create a material governance constraint.",
  secondExpertEnabled: true,
  expert1Name: "Expert 1",
  expert2Name: "Expert 2",
  certainty: "Very low",
  maturity: "B",
  experts: "",
  coi: "",
  overrideDecision: "Use framework decision",
  reviewInterval: "6 months",
  rationale: "Meaningful clinical need and plausible mechanism are not enough to overcome weak human evidence, sparse safety data, and governance concerns.",
  restrictions: "Not for routine clinical use. Discuss only in formal research or tightly governed evidence-generation settings.",
  triggers: "Prospective controlled human trials, stronger safety data, standardised product quality, and clearer regulatory position.",
  pillars: {
    benefit: { score: 1, rationale: "Dominated by preclinical evidence with limited human clinical data and no robust comparative trials.", expert2Score: 1, expert2Rationale: "Agreement: no robust comparative human evidence for routine recommendation." },
    safety: { score: 1, rationale: "Sparse human safety data and unclear long-term risk.", expert2Score: 0, expert2Rationale: "More concerned about unknown long-term harms and product quality." },
    governance: { score: 0, rationale: "Regulatory uncertainty, anti-doping implications, and product quality issues.", expert2Score: 0, expert2Rationale: "Agreement: governance is an implementation blocker." },
    need: { score: 2, rationale: "Faster, safer recovery from injury is a legitimate clinical need.", expert2Score: 2, expert2Rationale: "Agreement: the clinical need is real but not sufficient." },
    mechanism: { score: 2, rationale: "Preclinical rationale around angiogenesis, inflammation, and tissue repair.", expert2Score: 2, expert2Rationale: "Agreement: plausible mechanism with uncertain translation." },
    population: { score: 1, rationale: "Insufficient evidence to define who benefits or who should avoid it.", expert2Score: 1, expert2Rationale: "Agreement: population boundaries are not established." },
    acceptability: { score: 1, rationale: "Appeal is high, but informed acceptability falls when uncertainty is explicit.", expert2Score: 2, expert2Rationale: "Potentially acceptable only if framed as research or highly restricted use." },
    feasibility: { score: 1, rationale: "No approved standardised product, dose-response model, or routine monitoring pathway.", expert2Score: 1, expert2Rationale: "Agreement: operational pathway is not routine-ready." }
  }
};

const emptyReview = () => ({
  id: crypto.randomUUID(),
  updatedAt: new Date().toISOString(),
  intervention: "",
  classification: "Food supplement",
  indication: "",
  population: "",
  comparator: "",
  setting: "Cascaid Clinic",
  question: "",
  redFlag: false,
  supplementIntegrity: false,
  offLabel: false,
  gateNotes: "",
  secondExpertEnabled: false,
  expert1Name: "",
  expert2Name: "",
  certainty: "Very low",
  maturity: "A",
  experts: "",
  coi: "",
  overrideDecision: "Use framework decision",
  reviewInterval: "6 months",
  rationale: "",
  restrictions: "",
  triggers: "",
  pillars: Object.fromEntries(pillars.map((pillar) => [pillar.id, { score: 0, rationale: "", expert2Score: "", expert2Rationale: "" }]))
});

const storageKey = "cascaid-medical-intervention-reviews";

const els = {
  form: document.querySelector("#reviewForm"),
  pillarInputs: document.querySelector("#pillarInputs"),
  reviewList: document.querySelector("#reviewList"),
  searchInput: document.querySelector("#searchInput"),
  newReviewButton: document.querySelector("#newReviewButton"),
  duplicateButton: document.querySelector("#duplicateButton"),
  saveButton: document.querySelector("#saveButton"),
  copySummaryButton: document.querySelector("#copySummaryButton"),
  decisionMetric: document.querySelector("#decisionMetric"),
  coreMetric: document.querySelector("#coreMetric"),
  supportMetric: document.querySelector("#supportMetric"),
  gateMetric: document.querySelector("#gateMetric"),
  agreementMetric: document.querySelector("#agreementMetric"),
  decisionBadge: document.querySelector("#decisionBadge"),
  decisionExplanation: document.querySelector("#decisionExplanation"),
  gateWarnings: document.querySelector("#gateWarnings"),
  pillarBars: document.querySelector("#pillarBars"),
  certaintyBadge: document.querySelector("#certaintyBadge"),
  comparisonBadge: document.querySelector("#comparisonBadge"),
  comparisonPanel: document.querySelector("#comparisonPanel"),
  summaryOutput: document.querySelector("#summaryOutput")
};

const state = {
  reviews: loadReviews(),
  activeId: null,
  query: ""
};

state.activeId = state.reviews[0]?.id || createReview(sampleReview);

function loadReviews() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return [sampleReview];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed.map(normalizeReview) : [sampleReview];
  } catch {
    return [sampleReview];
  }
}

function normalizeReview(review) {
  const next = {
    ...emptyReview(),
    ...review,
    pillars: {}
  };
  next.secondExpertEnabled = Boolean(review.secondExpertEnabled);
  next.expert1Name = review.expert1Name || "";
  next.expert2Name = review.expert2Name || "";
  pillars.forEach((pillar) => {
    const value = review.pillars?.[pillar.id] || {};
    next.pillars[pillar.id] = {
      score: Number(value.score || 0),
      rationale: value.rationale || "",
      expert2Score: value.expert2Score === 0 || value.expert2Score ? String(value.expert2Score) : "",
      expert2Rationale: value.expert2Rationale || ""
    };
  });
  return next;
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state.reviews));
}

function createReview(review = emptyReview()) {
  state.reviews.unshift(review);
  persist();
  return review.id;
}

function activeReview() {
  return state.reviews.find((review) => review.id === state.activeId) || state.reviews[0];
}

function scoreLabel(score) {
  return ["Insufficient / unacceptable", "Weak / major uncertainty", "Acceptable / conditional", "Strong / decision-ready"][Number(score)] || "Unscored";
}

function maturityLabel(value) {
  return {
    A: "Level A: conceptual / mechanistic only",
    B: "Level B: early clinical signal",
    C: "Level C: emerging comparative evidence",
    D: "Level D: established in practice",
    E: "Level E: guideline-supported / standard of care"
  }[value] || value;
}

function getScores(review) {
  const core = pillars.filter((pillar) => pillar.type === "Core").map((pillar) => consensusScore(review, pillar.id));
  const supporting = pillars.filter((pillar) => pillar.type === "Supporting").map((pillar) => consensusScore(review, pillar.id));
  return {
    core,
    supporting,
    coreTotal: core.reduce((sum, score) => sum + score, 0),
    supportingTotal: supporting.reduce((sum, score) => sum + score, 0),
    minCore: Math.min(...core),
    zeroCount: [...core, ...supporting].filter((score) => score === 0).length,
    supportAtLeastTwo: supporting.filter((score) => score >= 2).length,
    supportOnes: supporting.filter((score) => score === 1).length
  };
}

function consensusScore(review, pillarId) {
  const value = review.pillars[pillarId] || {};
  const expert1 = Number(value.score || 0);
  if (!review.secondExpertEnabled || value.expert2Score === "") return expert1;
  return Math.min(expert1, Number(value.expert2Score));
}

function expertComparison(review) {
  if (!review.secondExpertEnabled) {
    return {
      enabled: false,
      agreements: [],
      disagreements: [],
      missing: [],
      priorities: []
    };
  }

  const agreements = [];
  const disagreements = [];
  const missing = [];

  pillars.forEach((pillar) => {
    const value = review.pillars[pillar.id] || {};
    const expert1 = Number(value.score || 0);
    const expert2Raw = value.expert2Score;
    if (expert2Raw === "") {
      missing.push(pillar.name);
      return;
    }
    const expert2 = Number(expert2Raw);
    const item = {
      pillar,
      expert1,
      expert2,
      gap: Math.abs(expert1 - expert2),
      crossesThreshold: (expert1 >= 2 && expert2 < 2) || (expert2 >= 2 && expert1 < 2)
    };
    if (expert1 === expert2) agreements.push(item);
    else disagreements.push(item);
  });

  const priorities = disagreements
    .filter((item) => item.pillar.type === "Core" || item.crossesThreshold || item.gap >= 2 || ["safety", "governance"].includes(item.pillar.id))
    .sort((a, b) => {
      const coreWeight = Number(b.pillar.type === "Core") - Number(a.pillar.type === "Core");
      return coreWeight || b.gap - a.gap;
    });

  return { enabled: true, agreements, disagreements, missing, priorities };
}

function isBlankReview(review) {
  const hasProfile = [review.intervention, review.indication, review.population, review.comparator, review.question].some((value) => String(value || "").trim());
  const hasNotes = [review.gateNotes, review.rationale, review.restrictions, review.triggers].some((value) => String(value || "").trim());
  const hasFlags = review.redFlag || review.supplementIntegrity || review.offLabel || review.secondExpertEnabled;
  const hasReviewers = [review.expert1Name, review.expert2Name].some((value) => String(value || "").trim());
  const hasScores = pillars.some((pillar) => {
    const value = review.pillars[pillar.id] || {};
    return Number(value.score || 0) > 0 || String(value.rationale || "").trim() || value.expert2Score !== "" || String(value.expert2Rationale || "").trim();
  });
  return !hasProfile && !hasNotes && !hasFlags && !hasReviewers && !hasScores;
}

function frameworkDecision(review) {
  if (isBlankReview(review)) {
    return {
      label: "Draft",
      reason: "Start by defining the intervention profile, initial screen, and pillar scores."
    };
  }

  if (review.overrideDecision !== "Use framework decision") {
    return {
      label: review.overrideDecision,
      reason: "Manual override selected. Ensure rationale explains why the panel decision differs from automatic thresholds."
    };
  }

  const scores = getScores(review);
  const certaintyCap = ["Very low", "Low"].includes(review.certainty);
  const hasGovernanceFlag = review.redFlag || Number(review.pillars.governance?.score || 0) < 2;

  if (review.redFlag || scores.zeroCount > 0 || scores.minCore < 2) {
    return {
      label: "Do not implement",
      reason: review.secondExpertEnabled
        ? "Automatic exclusion applies using the conservative unresolved expert score: unresolved red flag, a score of 0, or a core pillar below 2."
        : "Automatic exclusion applies: unresolved red flag, a score of 0, or a core pillar below 2."
    };
  }

  if (scores.core.every((score) => score === 3) && scores.supportAtLeastTwo >= 5 && !certaintyCap && !hasGovernanceFlag) {
    return {
      label: "Implement",
      reason: "Core pillars are decision-ready and supporting pillars meet the implementation threshold."
    };
  }

  if (scores.minCore >= 2 && scores.supportAtLeastTwo >= 4 && scores.supportOnes <= 2 && !hasGovernanceFlag) {
    return {
      label: certaintyCap ? "Implement with Restrictions" : "Implement with Restrictions",
      reason: "Minimum core gates are met, but conditions, monitoring, population boundaries, or evidence limits remain material."
    };
  }

  return {
    label: "Re-Review when further evidence supports",
    reason: "The case is not routine-ready, but may be reviewable with stronger evidence, clearer governance, or a specialist context."
  };
}

function decisionClass(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function updateReviewFromForm() {
  const review = activeReview();
  const data = new FormData(els.form);
  ["intervention", "classification", "indication", "population", "comparator", "setting", "question", "gateNotes", "expert1Name", "expert2Name", "certainty", "maturity", "experts", "coi", "overrideDecision", "reviewInterval", "rationale", "restrictions", "triggers"].forEach((name) => {
    review[name] = data.get(name) || "";
  });
  review.redFlag = data.get("redFlag") === "on";
  review.supplementIntegrity = data.get("supplementIntegrity") === "on";
  review.offLabel = data.get("offLabel") === "on";
  review.secondExpertEnabled = data.get("secondExpertEnabled") === "on";
  pillars.forEach((pillar) => {
    review.pillars[pillar.id] = {
      score: Number(data.get(`${pillar.id}Score`) || 0),
      rationale: data.get(`${pillar.id}Rationale`) || "",
      expert2Score: data.get(`${pillar.id}Expert2Score`) || "",
      expert2Rationale: data.get(`${pillar.id}Expert2Rationale`) || ""
    };
  });
  review.updatedAt = new Date().toISOString();
}

function fillForm(review) {
  els.form.reset();
  Object.entries(review).forEach(([key, value]) => {
    const field = els.form.elements[key];
    if (!field || typeof value === "object") return;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else field.value = value;
  });
  ["redFlag", "supplementIntegrity", "offLabel"].forEach((key) => {
    els.form.elements[key].checked = Boolean(review[key]);
  });
  els.form.elements.secondExpertEnabled.checked = Boolean(review.secondExpertEnabled);
  pillars.forEach((pillar) => {
    const pillarValue = review.pillars[pillar.id] || { score: 0, rationale: "", expert2Score: "", expert2Rationale: "" };
    els.form.elements[`${pillar.id}Score`].value = pillarValue.score;
    els.form.elements[`${pillar.id}Rationale`].value = pillarValue.rationale;
    els.form.elements[`${pillar.id}Expert2Score`].value = pillarValue.expert2Score === 0 ? "0" : pillarValue.expert2Score;
    els.form.elements[`${pillar.id}Expert2Rationale`].value = pillarValue.expert2Rationale;
  });
  syncSecondExpertVisibility(review);
}

function renderPillarInputs() {
  els.pillarInputs.innerHTML = "";
  pillars.forEach((pillar) => {
    const card = document.createElement("article");
    card.className = `pillar-input ${pillar.type.toLowerCase()}`;
    card.innerHTML = `
      <div class="pillar-title">
        <span>${pillar.type}</span>
        <h4 class="help-label">${pillar.name} <button class="help-dot" type="button" aria-label="Help: ${pillar.name}" data-help="${pillar.help}">?</button></h4>
        <p>${pillar.prompt}</p>
      </div>
      <div class="expert-scoring">
        <div>
          <h5>Expert 1</h5>
          <label>
            <span class="help-label">Score <button class="help-dot" type="button" aria-label="Help: score ${pillar.name}" data-help="0 = insufficient or unacceptable; 1 = weak or major uncertainty; 2 = acceptable for conditional or restricted use; 3 = strong and decision-ready for the intended setting.">?</button></span>
            <select name="${pillar.id}Score">
              <option value="0">0 - Insufficient / unacceptable</option>
              <option value="1">1 - Weak / major uncertainty</option>
              <option value="2">2 - Acceptable / conditional</option>
              <option value="3">3 - Strong / decision-ready</option>
            </select>
          </label>
          <label>
            <span>Rationale and evidence gaps</span>
            <textarea name="${pillar.id}Rationale" rows="3" placeholder="Capture evidence, harms, uncertainty, restrictions, and what would change the score."></textarea>
          </label>
        </div>
        <div class="expert-two-fields">
          <h5>Expert 2</h5>
          <label>
            <span>Score</span>
            <select name="${pillar.id}Expert2Score">
              <option value="">Not scored</option>
              <option value="0">0 - Insufficient / unacceptable</option>
              <option value="1">1 - Weak / major uncertainty</option>
              <option value="2">2 - Acceptable / conditional</option>
              <option value="3">3 - Strong / decision-ready</option>
            </select>
          </label>
          <label>
            <span>Rationale and evidence gaps</span>
            <textarea name="${pillar.id}Expert2Rationale" rows="3" placeholder="Capture the second expert's independent view."></textarea>
          </label>
        </div>
      </div>
    `;
    els.pillarInputs.append(card);
  });
}

function syncSecondExpertVisibility(review = activeReview()) {
  document.body.classList.toggle("second-expert-on", Boolean(review.secondExpertEnabled));
}

function renderReviewList() {
  const query = state.query.toLowerCase().trim();
  const reviews = state.reviews.filter((review) => {
    const haystack = [review.intervention, review.indication, review.population, frameworkDecision(review).label].join(" ").toLowerCase();
    return !query || haystack.includes(query);
  });

  els.reviewList.innerHTML = "";
  if (!reviews.length) {
    els.reviewList.innerHTML = `<div class="empty">No saved reviews match this search.</div>`;
    return;
  }

  reviews.forEach((review) => {
    const decision = frameworkDecision(review);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `review-card ${review.id === state.activeId ? "active" : ""}`;
    button.innerHTML = `
      <span class="mini-badge ${decisionClass(decision.label)}">${decision.label}</span>
      <strong>${review.intervention || "Untitled intervention"}</strong>
      <small>${review.indication || "No indication entered"}</small>
    `;
    button.addEventListener("click", () => {
      updateReviewFromForm();
      state.activeId = review.id;
      fillForm(activeReview());
      render();
    });
    els.reviewList.append(button);
  });
}

function renderSummary() {
  const review = activeReview();
  const decision = frameworkDecision(review);
  const scores = getScores(review);
  const comparison = expertComparison(review);

  els.decisionMetric.textContent = decision.label.replace(" when further evidence supports", "");
  els.coreMetric.textContent = `${scores.coreTotal}/9`;
  els.supportMetric.textContent = `${scores.supportingTotal}/15`;
  els.gateMetric.textContent = review.redFlag ? "Fail" : "Pass";
  els.agreementMetric.textContent = comparison.enabled ? `${comparison.agreements.length}/${pillars.length}` : "-";
  els.decisionBadge.textContent = decision.label;
  els.decisionBadge.className = `decision-badge ${decisionClass(decision.label)}`;
  els.decisionExplanation.textContent = decision.reason;
  els.certaintyBadge.textContent = `${review.certainty} certainty`;

  const warnings = [];
  if (review.redFlag) warnings.push("Unresolved red flag blocks routine recommendation.");
  if (review.offLabel) warnings.push("Off-label or non-standard use needs explicit informed consent and traditional-care comparison.");
  if (review.classification === "Food supplement" && !review.supplementIntegrity) warnings.push("Supplement integrity has not been confirmed.");
  if (["Very low", "Low"].includes(review.certainty)) warnings.push("Low certainty should cap the output at restrictions, re-review, or expert-use only.");
  if (comparison.enabled && comparison.priorities.length) warnings.push("Expert disagreement affects core, safety, governance, or threshold-sensitive scoring.");
  els.gateWarnings.innerHTML = warnings.map((warning) => `<div>${warning}</div>`).join("");

  els.pillarBars.innerHTML = "";
  pillars.forEach((pillar) => {
    const value = review.pillars[pillar.id] || {};
    const score = consensusScore(review, pillar.id);
    const expert1 = Number(value.score || 0);
    const expert2Text = review.secondExpertEnabled && value.expert2Score !== "" ? ` | Expert 2 ${value.expert2Score}` : "";
    const row = document.createElement("div");
    row.className = "pillar-row";
    row.innerHTML = `
      <div>
        <strong>${pillar.name}</strong>
        <small>${pillar.type} | Conservative score ${score} | Expert 1 ${expert1}${expert2Text}</small>
      </div>
      <div class="bar"><span class="${score <= 1 ? "risk" : score === 2 ? "warn" : ""}" style="width:${(score / 3) * 100}%"></span></div>
      <b>${score}</b>
    `;
    els.pillarBars.append(row);
  });

  renderComparison(comparison);
  els.summaryOutput.textContent = buildSummary(review, decision);
}

function renderComparison(comparison) {
  if (!comparison.enabled) {
    els.comparisonBadge.textContent = "Single review";
    els.comparisonPanel.innerHTML = `<p class="muted-copy">Enable second expert review to compare independent scores and prepare panel discussion points.</p>`;
    return;
  }

  els.comparisonBadge.textContent = `${comparison.disagreements.length} disagreements`;
  const priorityMarkup = comparison.priorities.length
    ? comparison.priorities.map((item) => `
      <article class="comparison-item priority">
        <strong>${item.pillar.name}</strong>
        <span>Expert 1: ${item.expert1} | Expert 2: ${item.expert2}</span>
        <p>${item.crossesThreshold ? "Discuss whether this pillar is above or below the implementation threshold." : "Resolve the scoring gap before final decision."}</p>
      </article>
    `).join("")
    : `<article class="comparison-item"><strong>No priority disagreements</strong><p>Experts may still discuss minor score differences, but none currently affect core gates or thresholds.</p></article>`;

  const agreementText = comparison.agreements.length
    ? comparison.agreements.map((item) => item.pillar.name).join(", ")
    : "No matched scores yet.";
  const missingText = comparison.missing.length
    ? `<p><strong>Awaiting Expert 2:</strong> ${comparison.missing.join(", ")}</p>`
    : "";

  els.comparisonPanel.innerHTML = `
    <div class="comparison-summary">
      <p><strong>Agreements:</strong> ${agreementText}</p>
      <p><strong>Disagreements:</strong> ${comparison.disagreements.length ? comparison.disagreements.map((item) => `${item.pillar.name} (${item.expert1} vs ${item.expert2})`).join(", ") : "None"}</p>
      ${missingText}
    </div>
    <div class="discussion-priorities">${priorityMarkup}</div>
  `;
}

function buildSummary(review, decision) {
  const lines = [
    `Intervention: ${review.intervention || "Untitled"}`,
    `Use case: ${review.indication || "Not specified"}`,
    `Population: ${review.population || "Not specified"}`,
    `Comparator: ${review.comparator || "Not specified"}`,
    `Setting: ${review.setting}`,
    `Decision: ${decision.label}`,
    `Evidence certainty: ${review.certainty}`,
    `Evidence maturity: ${maturityLabel(review.maturity)}`,
    `Expert 1: ${review.expert1Name || "Not recorded"}`,
    `Expert 2: ${review.secondExpertEnabled ? review.expert2Name || "Not recorded" : "Not enabled"}`,
    "",
    "Core pillar scores:"
  ];

  pillars.filter((pillar) => pillar.type === "Core").forEach((pillar) => {
    const value = review.pillars[pillar.id];
    const expert2 = review.secondExpertEnabled && value.expert2Score !== "" ? `; Expert 2 ${value.expert2Score} (${scoreLabel(value.expert2Score)})` : "";
    lines.push(`- ${pillar.name}: Expert 1 ${value.score} (${scoreLabel(value.score)})${expert2}; conservative ${consensusScore(review, pillar.id)}`);
  });

  lines.push("", "Supporting pillar scores:");
  pillars.filter((pillar) => pillar.type === "Supporting").forEach((pillar) => {
    const value = review.pillars[pillar.id];
    const expert2 = review.secondExpertEnabled && value.expert2Score !== "" ? `; Expert 2 ${value.expert2Score} (${scoreLabel(value.expert2Score)})` : "";
    lines.push(`- ${pillar.name}: Expert 1 ${value.score} (${scoreLabel(value.score)})${expert2}; conservative ${consensusScore(review, pillar.id)}`);
  });

  const comparison = expertComparison(review);
  if (comparison.enabled) {
    lines.push(
      "",
      "Expert agreement summary:",
      `- Agreements: ${comparison.agreements.length}/${pillars.length}`,
      `- Disagreements: ${comparison.disagreements.length ? comparison.disagreements.map((item) => `${item.pillar.name} (${item.expert1} vs ${item.expert2})`).join("; ") : "None"}`,
      `- Discussion priorities: ${comparison.priorities.length ? comparison.priorities.map((item) => item.pillar.name).join("; ") : "None"}`
    );
  }

  lines.push(
    "",
    `Rationale: ${review.rationale || decision.reason}`,
    `Restrictions / conditions: ${review.restrictions || "Not specified"}`,
    `Re-review interval: ${review.reviewInterval}`,
    `Re-review triggers: ${review.triggers || "Not specified"}`,
    `Subject matter experts: ${review.experts || "Not recorded"}`,
    `Conflict of interest: ${review.coi || "Not recorded"}`
  );

  return lines.join("\n");
}

function render() {
  syncSecondExpertVisibility(activeReview());
  renderReviewList();
  renderSummary();
}

renderPillarInputs();
fillForm(activeReview());
render();

els.form.addEventListener("input", () => {
  updateReviewFromForm();
  render();
});

els.form.addEventListener("change", () => {
  updateReviewFromForm();
  render();
});

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderReviewList();
});

els.newReviewButton.addEventListener("click", () => {
  updateReviewFromForm();
  state.activeId = createReview(emptyReview());
  fillForm(activeReview());
  render();
});

els.duplicateButton.addEventListener("click", () => {
  updateReviewFromForm();
  const copy = JSON.parse(JSON.stringify(activeReview()));
  copy.id = crypto.randomUUID();
  copy.intervention = `${copy.intervention || "Untitled intervention"} copy`;
  copy.updatedAt = new Date().toISOString();
  state.activeId = createReview(copy);
  fillForm(activeReview());
  render();
});

els.saveButton.addEventListener("click", () => {
  updateReviewFromForm();
  persist();
  els.saveButton.textContent = "Saved";
  window.setTimeout(() => {
    els.saveButton.textContent = "Save review";
  }, 1200);
  render();
});

els.copySummaryButton.addEventListener("click", async () => {
  updateReviewFromForm();
  await navigator.clipboard.writeText(els.summaryOutput.textContent);
  els.copySummaryButton.textContent = "Copied";
  window.setTimeout(() => {
    els.copySummaryButton.textContent = "Copy";
  }, 1200);
});
