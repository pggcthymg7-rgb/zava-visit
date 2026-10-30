/**
 * ============================================================================
 * ZAVA VISIT — Script Principal (Issue #1: Identidade Oficial Zava & Tipologias)
 * ============================================================================
 * Responsabilidades deste módulo na Fase 1:
 * 1. Centralizar a configuração da marca Zava Imobiliária e do condomínio ativo
 *    ("Jardins Itália" — condomínio consolidado com curadoria por tipologia).
 * 2. Monitorar o container `#canvas-container` (100dvh) onde a base geográfica 3D
 *    em Grafite/Azul-Noite será renderizada na Fase 2.
 * 3. Controlar a barra interativa de filtros de tipologia no rodapé, aplicando
 *    o estado visual ativo (borda e fundo em tom Areia `#d2c2ac`) e disparando
 *    o evento customizado `zava:category-change` para filtrar os pinos/volumes 3D.
 */

'use strict';

const ZavaVisitApp = {
  config: {
    brandName: 'ZAVA VISIT',
    tagline: 'Curadoria Imobiliária 3D',
    currentCondominium: {
      id: 'jardins-italia',
      name: 'Jardins Itália',
      profile: 'Condomínio Fechado Consolidado'
    },
    activeCategory: 'todos',
    palette: {
      night: '#1a1d29',      // Azul-Noite
      graphite: '#3d3f4a',   // Grafite (quadras/lotes de contexto)
      sand: '#d2c2ac',       // Areia (Casas Térreas / destaque da marca)
      silver: '#b1b2b5',     // Prata (Lotes com borda Areia / textos secundários)
      platinum: '#e6e6e6',   // Platina (Sobrados / textos principais)
      champagne: '#e5d5c0',  // Champagne (Triplex)
      emerald: '#34d399'     // Verde Esmeralda/Água (Áreas de Lazer)
    }
  },

  elements: {
    canvasContainer: null,
    condoSelectorBtn: null,
    currentCondoName: null,
    categoryFilterBar: null,
    categoryButtons: null,
    activeFilterBadge: null
  },

  /**
   * Inicializa a aplicação assim que o DOM estiver pronto.
   */
  init() {
    this.cacheElements();
    this.validateViewportAndContainer();
    this.bindEvents();

    console.info(
      `%c ${this.config.brandName} %c ${this.config.tagline} — ${this.config.currentCondominium.name}`,
      'background: #d2c2ac; color: #1a1d29; font-weight: 700; padding: 2px 8px; border-radius: 4px;',
      'color: #e6e6e6; font-weight: 500;'
    );
  },

  /**
   * Armazena referências para os elementos interativos do DOM.
   */
  cacheElements() {
    this.elements.canvasContainer = document.getElementById('canvas-container');
    this.elements.condoSelectorBtn = document.getElementById('condo-selector-btn');
    this.elements.currentCondoName = document.getElementById('current-condo-name');
    this.elements.categoryFilterBar = document.getElementById('category-filter-bar');
    this.elements.categoryButtons = document.querySelectorAll('.category-btn[data-category]');
    this.elements.activeFilterBadge = document.getElementById('active-filter-badge');
  },

  /**
   * Valida o `#canvas-container` e registra suas dimensões e categoria ativa
   * em atributos `data-*` para consumo direto pelo motor Three.js na Fase 2.
   */
  validateViewportAndContainer() {
    if (!this.elements.canvasContainer) {
      console.error('[Zava Visit] Erro: #canvas-container não encontrado no DOM.');
      return;
    }

    this.elements.canvasContainer.setAttribute(
      'data-active-category',
      this.config.activeCategory
    );

    const updateDimensionsAttribute = () => {
      const { clientWidth, clientHeight } = this.elements.canvasContainer;
      this.elements.canvasContainer.setAttribute(
        'data-viewport',
        `${clientWidth}x${clientHeight}`
      );
    };

    updateDimensionsAttribute();
    window.addEventListener('resize', updateDimensionsAttribute, { passive: true });
  },

  /**
   * Registra os eventos de clique no seletor de condomínio e nos filtros de tipologia.
   */
  bindEvents() {
    // 1. Feedback interativo no seletor de condomínio do topo
    if (this.elements.condoSelectorBtn) {
      this.elements.condoSelectorBtn.addEventListener('click', () => {
        this.elements.condoSelectorBtn.classList.add('ring-1', 'ring-zava-sand');
        setTimeout(() => {
          this.elements.condoSelectorBtn.classList.remove('ring-1', 'ring-zava-sand');
        }, 350);
      });
    }

    // 2. Interação dos botões de filtro por tipologia e áreas de lazer no rodapé
    if (this.elements.categoryButtons && this.elements.categoryButtons.length > 0) {
      this.elements.categoryButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const selectedCategory = button.getAttribute('data-category');
          const selectedLabel = button.getAttribute('data-label') || button.textContent.trim();
          this.setActiveCategory(selectedCategory, selectedLabel, button);
        });
      });
    }
  },

  /**
   * Atualiza o estado visual dos botões de tipologia, centraliza suavemente o botão
   * clicado em telas mobile e dispara o evento customizado `zava:category-change`.
   *
   * @param {string} categorySlug - Identificador da categoria (ex: 'casas-terreas', 'sobrados')
   * @param {string} categoryLabel - Nome legível da categoria (ex: 'Casas Térreas')
   * @param {HTMLElement} clickedButton - Elemento do botão acionado
   */
  setActiveCategory(categorySlug, categoryLabel, clickedButton) {
    if (!categorySlug) return;

    this.config.activeCategory = categorySlug;

    // Atualiza classes visuais (.is-active aplica borda e fundo em Areia #d2c2ac) e acessibilidade
    this.elements.categoryButtons.forEach((btn) => {
      const isTarget = btn === clickedButton;
      btn.classList.toggle('is-active', isTarget);
      btn.classList.toggle('font-semibold', isTarget);
      btn.classList.toggle('font-medium', !isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Em telas mobile, desliza suavemente a barra horizontal para manter o botão visível ao centro
    if (clickedButton && typeof clickedButton.scrollIntoView === 'function') {
      clickedButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }

    // Atualiza o atributo no container 3D e o badge demonstrativo da Fase 1
    if (this.elements.canvasContainer) {
      this.elements.canvasContainer.setAttribute('data-active-category', categorySlug);
    }

    if (this.elements.activeFilterBadge) {
      this.elements.activeFilterBadge.textContent = categoryLabel;
    }

    // Dispara evento customizado global para que a cena Three.js (Fase 2) filtre os pinos/volumes 3D
    const filterEvent = new CustomEvent('zava:category-change', {
      detail: {
        category: categorySlug,
        label: categoryLabel,
        condominiumId: this.config.currentCondominium.id,
        timestamp: Date.now()
      }
    });

    window.dispatchEvent(filterEvent);

    console.info(
      `[Zava Visit] Filtro 3D alterado para: "${categoryLabel}" (data-category="${categorySlug}")`
    );
  }
};

// Inicializa quando o documento HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  ZavaVisitApp.init();
});
