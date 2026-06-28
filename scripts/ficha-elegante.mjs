/**
 * Ligéia — Ficha Elegante
 * ------------------------------------------------------------------
 * Módulo de APARÊNCIA. Não toca no sistema "ligeia-rpg": apenas registra
 * uma ficha alternativa para o ator do tipo "personagem".
 *
 * A ficha herda a classe original do sistema (LigeiaCharacterSheet), então
 * TODA a lógica continua valendo sem duplicação: rolagens de atributo, ações
 * de item, efeitos aplicados, condições, cálculo de XP, arrastar e soltar e a
 * preservação de scroll. Aqui só trocamos o template do corpo por uma versão
 * em abas e acrescentamos ao contexto os dados das barras e da navegação.
 */

const MODULE_ID = "ligeia-ficha-elegante";

// Importa a ficha original servida pelo sistema (caminho absoluto a partir da
// raiz de Data). Requer o sistema "ligeia-rpg" instalado e ativo — declarado
// como dependência em module.json.
import { LigeiaCharacterSheet } from "/systems/ligeia-rpg/module/sheets/character-sheet.mjs";

class LigeiaFichaElegante extends LigeiaCharacterSheet {
  /** Aba ativa. Campo privado para sobreviver aos re-renders (submitOnChange). */
  #activeTab = "atributos";

  /**
   * Só os DELTAS. O ApplicationV2 funde DEFAULT_OPTIONS por toda a cadeia de
   * herança: as actions, o dragDrop, o form e a position do sistema continuam
   * valendo. Listamos as classes-raiz originais (arrays são substituídos na
   * fusão, não concatenados) e somamos a marca do módulo + a action "tab".
   */
  static DEFAULT_OPTIONS = {
    classes: ["ligeia", "sheet", "actor", "personagem", "ligeia-fe"],
    actions: {
      tab: LigeiaFichaElegante.#onTabClick,
    },
  };

  /** Troca o template do corpo pela versão em abas (mesma part "body"). */
  static PARTS = {
    body: {
      template: `modules/${MODULE_ID}/templates/ficha-elegante.hbs`,
    },
  };

  /** Definição das 7 abas, na ordem pedida. */
  static TABS = [
    { id: "atributos", label: "Atributos", icon: "fa-solid fa-dice-d20" },
    { id: "equipamentos", label: "Equipamentos", icon: "fa-solid fa-toolbox" },
    { id: "habilidades", label: "Habilidades", icon: "fa-solid fa-hand-fist" },
    { id: "magias", label: "Magias", icon: "fa-solid fa-wand-magic-sparkles" },
    { id: "tracos", label: "Traços", icon: "fa-solid fa-fingerprint" },
    { id: "efeitos", label: "Efeitos & Condições", icon: "fa-solid fa-bolt" },
    { id: "notas", label: "Personalidade & Notas", icon: "fa-solid fa-feather" },
  ];

  /** @override Acrescenta barras + abas ao contexto herdado da ficha original. */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const sys = this.document.system ?? {};

    // Percentuais das barras (o Handlebars não faz aritmética).
    const pct = (v, max) => {
      const m = Number(max) || 0;
      if (m <= 0) return 0;
      return Math.max(0, Math.min(100, Math.round(((Number(v) || 0) / m) * 100)));
    };
    const hp = sys.resources?.hp ?? {};
    const mp = sys.resources?.mp ?? {};
    const ph = sys.resources?.heroic ?? {};
    const hpPct = pct(hp.value, hp.max);
    context.bars = {
      hp: { pct: hpPct, tempPct: pct(hp.temp, hp.max), low: hpPct <= 30 },
      mp: { pct: pct(mp.value, mp.max) },
      heroic: { pct: pct(ph.value, ph.max) },
    };

    // Contadores por aba (reaproveitam dados já montados pela ficha original).
    const g = context.itemGroups ?? {};
    const counts = {
      atributos: 0,
      equipamentos: (g.equipamento ?? []).length,
      habilidades: (g.habilidade ?? []).length,
      magias: (g.magia ?? []).length,
      tracos: (g.traco ?? []).length,
      efeitos:
        (context.appliedEffects ?? []).length + (context.activeConditionCount ?? 0),
      notas: 0,
    };

    context.activeTab = this.#activeTab;
    context.tabs = LigeiaFichaElegante.TABS.map((t) => ({
      ...t,
      count: counts[t.id] ?? 0,
      active: t.id === this.#activeTab,
    }));

    return context;
  }

  /** @override Mantém a lógica original (scroll, drag&drop) e reaplica a aba. */
  _onRender(context, options) {
    super._onRender(context, options);
    this._applyActiveTab();
  }

  /** Liga as classes .active da aba e do painel correspondentes a #activeTab. */
  _applyActiveTab() {
    const root = this.element;
    if (!root) return;
    for (const btn of root.querySelectorAll(".lig-tab")) {
      btn.classList.toggle("active", btn.dataset.tab === this.#activeTab);
    }
    for (const panel of root.querySelectorAll(".lig-tab-panel")) {
      panel.classList.toggle("active", panel.dataset.tab === this.#activeTab);
    }
  }

  /** Troca de aba só no DOM — instantâneo, sem reprocessar a ficha inteira. */
  static #onTabClick(event, target) {
    const tab = target?.dataset?.tab;
    if (!tab) return;
    this.#activeTab = tab;
    this._applyActiveTab();
  }
}

/* ------------------------------------------------------------------ */
/*  Registro da ficha                                                  */
/* ------------------------------------------------------------------ */
Hooks.once("init", () => {
  // Helpers usados pelo template — registrados defensivamente (idempotente),
  // caso a ordem de carregamento mude. O sistema também os registra.
  if (!Handlebars.helpers.eq) {
    Handlebars.registerHelper("eq", (a, b) => a === b);
  }
  if (!Handlebars.helpers.lt) {
    Handlebars.registerHelper("lt", (a, b) => a < b);
  }
  if (!Handlebars.helpers.or) {
    Handlebars.registerHelper("or", (...args) => args.slice(0, -1).some(Boolean));
  }

  const DSC = foundry.applications.apps.DocumentSheetConfig;
  DSC.registerSheet(Actor, "ligeia-rpg", LigeiaFichaElegante, {
    types: ["personagem"],
    makeDefault: true,
    label: "Ligéia — Ficha Elegante (abas)",
  });

  console.log(`${MODULE_ID} | Ficha Elegante registrada para 'personagem'.`);
});

/* ------------------------------------------------------------------ */
/*  Pré-carrega os partials do sistema reaproveitados pelo template    */
/* ------------------------------------------------------------------ */
Hooks.once("setup", async () => {
  const loader =
    foundry.applications?.handlebars?.loadTemplates || globalThis.loadTemplates;
  if (!loader) return;
  await loader([
    "systems/ligeia-rpg/templates/actor/partials/item-actions.hbs",
    "systems/ligeia-rpg/templates/actor/partials/item-effects-inline.hbs",
  ]);
});
