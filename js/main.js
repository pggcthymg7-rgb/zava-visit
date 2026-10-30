/**
 * ============================================================================
 * ZAVA VISIT — Script Principal (Issue #1: Estrutura Base e Identidade Visual)
 * ============================================================================
 * Objetivo deste arquivo na Issue #1:
 * 1. Centralizar o estado inicial da aplicação (condomínio ativo e categorias).
 * 2. Validar a presença do container `#canvas-container` onde o mapa 3D será
 *    renderizado nas próximas etapas.
 * 3. Gerenciar interações iniciais da HUD (seletor de condomínio e legenda).
 */

'use strict';

/**
 * Estado global inicial da aplicação Zava Visit.
 * Facilita a futura integração com o motor Three.js e dados dos lotes.
 */
const ZavaVisitApp = {
  config: {
    appName: 'ZAVA VISIT',
    currentCondominium: {
      id: 'jardins-italia',
      name: 'Jardins Itália',
      city: 'Condomínio Fechado de Alto Padrão'
    },
    statusColors: {
      disponivel: '#D4AF37',   // Dourado
      lazer: '#38BDF8',        // Azul/Ciano elegante
      indisponivel: '#52525B'  // Grafite
    }
  },

  elements: {
    canvasContainer: null,
    condoSelectorBtn: null,
    currentCondoName: null,
    legendItems: null
  },

  /**
   * Inicializa a interface assim que o DOM estiver completamente carregado.
   */
  init() {
    this.cacheElements();
    this.validateViewportAndContainer();
    this.bindEvents();

    console.info(
      `%c ${this.config.appName} %c Condomínio ativo: ${this.config.currentCondominium.name}`,
      'background: #D4AF37; color: #0A0A0A; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #D4AF37; font-weight: 500;'
    );
  },

  /**
   * Armazena referências para os elementos principais do DOM.
   */
  cacheElements() {
    this.elements.canvasContainer = document.getElementById('canvas-container');
    this.elements.condoSelectorBtn = document.getElementById('condo-selector-btn');
    this.elements.currentCondoName = document.getElementById('current-condo-name');
    this.elements.legendItems = document.querySelectorAll('.legend-item');
  },

  /**
   * Verifica se o container do mapa 3D está pronto e monitora redimensionamentos
   * (como rotação do celular ou recolhimento de barras do navegador mobile).
   */
  validateViewportAndContainer() {
    if (!this.elements.canvasContainer) {
      console.error('[Zava Visit] Erro: #canvas-container não encontrado no DOM.');
      return;
    }

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
   * Registra eventos básicos de UI para feedback visual imediato.
   */
  bindEvents() {
    if (this.elements.condoSelectorBtn) {
      this.elements.condoSelectorBtn.addEventListener('click', () => {
        // Feedback sutil de clique no seletor (preparado para futura lista de condomínios)
        this.elements.condoSelectorBtn.classList.add('ring-1', 'ring-zava-gold');
        setTimeout(() => {
          this.elements.condoSelectorBtn.classList.remove('ring-1', 'ring-zava-gold');
        }, 350);
      });
    }
  }
};

// Inicializa quando o documento HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  ZavaVisitApp.init();
});
