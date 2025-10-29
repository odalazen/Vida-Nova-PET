//alto contraste
const openBtn = document.getElementById('aw-open');
    const closeBtn = document.getElementById('aw-close');
    const panel = document.getElementById('aw-panel');
    const contrastBtn = document.getElementById('contrast-toggle');
    const fontIncrease = document.getElementById('font-increase');
    const fontDecrease = document.getElementById('font-decrease');
    const fontReset = document.getElementById('font-reset');
    const resetAll = document.getElementById('aw-reset-all');
    const statusEl = document.getElementById('aw-status');

    // --- Configurações iniciais ---
    const STORAGE_KEY = 'accessibility_prefs_v1';
    const prefsDefault = {
      highContrast: false,
      fontScale: 100 // percent (100% base)
    };

    // carrega prefs
    function loadPrefs(){
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {...prefsDefault};
        return {...prefsDefault, ...JSON.parse(raw)};
      } catch(e) {
        console.warn('Não foi possível carregar preferências:', e);
        return {...prefsDefault};
      }
    }
    function savePrefs(p){
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
      catch(e){ console.warn('Não foi possível salvar preferências:', e); }
    }

    let prefs = loadPrefs();

    // Aplica preferências ao carregar
    function applyPrefs(){
      // contraste
      if (prefs.highContrast) document.body.classList.add('high-contrast');
      else document.body.classList.remove('high-contrast');
      contrastBtn.setAttribute('aria-pressed', prefs.highContrast ? 'true' : 'false');
      contrastBtn.querySelector('.aw-indicator').textContent = prefs.highContrast ? 'On' : 'Off';

      // fonte
      document.documentElement.style.setProperty('--font-scale', prefs.fontScale);
      statusEl.textContent = `Fonte ${prefs.fontScale}% • Contraste ${prefs.highContrast ? 'ativo' : 'padrão'}.`;
    }

    applyPrefs();

    // --- Funções de controle ---
    function togglePanel(open){
      const isOpen = panel.getAttribute('aria-hidden') === 'false';
      const shouldOpen = (typeof open === 'boolean') ? open : !isOpen;
      panel.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
      openBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      if (shouldOpen) {
        // foco no primeiro controle para acessibilidade
        contrastBtn.focus();
      } else {
        openBtn.focus();
      }
    }

    function toggleContrast(){
      prefs.highContrast = !prefs.highContrast;
      savePrefs(prefs);
      applyPrefs();
      announce(`Alto contraste ${prefs.highContrast ? 'ativado' : 'desativado'}`);
    }

    function setFontScale(scale){
      // limite entre 70% e 200%
      prefs.fontScale = Math.min(200, Math.max(70, scale));
      savePrefs(prefs);
      applyPrefs();
      announce(`Tamanho da fonte ${prefs.fontScale}%`);
    }

    function changeFont(delta){
      setFontScale(prefs.fontScale + delta);
    }

    function resetAllPrefs(){
      prefs = {...prefsDefault};
      savePrefs(prefs);
      applyPrefs();
      announce('Preferências de acessibilidade restauradas');
    }

    // Anúncio breve para leitores de tela
    function announce(text){
      // usa elemento com aria-live (statusEl)
      statusEl.textContent = text;
      // limpa depois de 2s
      setTimeout(()=> {
        statusEl.textContent = `Fonte ${prefs.fontScale}% • Contraste ${prefs.highContrast ? 'ativo' : 'padrão'}.`;
      }, 1800);
    }

    // --- Eventos ---
    openBtn.addEventListener('click', ()=> togglePanel(true));
    closeBtn.addEventListener('click', ()=> togglePanel(false));

    // fechar painel com ESC
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape') {
        const panelOpen = panel.getAttribute('aria-hidden') === 'false';
        if (panelOpen) togglePanel(false);
      }
    });

    contrastBtn.addEventListener('click', toggleContrast);

    fontIncrease.addEventListener('click', ()=> changeFont(10));
    fontDecrease.addEventListener('click', ()=> changeFont(-10));
    fontReset.addEventListener('click', ()=> setFontScale(100));
    resetAll.addEventListener('click', resetAllPrefs);

    // Permitir operação via teclado (Enter / Space para botões com role padrão já funciona,
    // mas garantimos comportamento consistente para elementos customizados se necessário).
    [contrastBtn, fontIncrease, fontDecrease, fontReset, resetAll, openBtn, closeBtn].forEach(el=>{
      el.addEventListener('keyup', (e)=>{
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });

    // Aplicar preferências caso usuário troque o modo do sistema (não obrigatório, mas útil)
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-contrast: more)');
      mq.addEventListener && mq.addEventListener('change', (e) => {
        // opcional: se o usuário não tiver preferência salva e o sistema exigir contraste,
        // podemos ativar automaticamente. Aqui apenas notificamos.
        if (e.matches) {
          // system prefers more contrast
          // announce('Sistema prefere alto contraste');
        }
      });
    }

    // Focar no conteúdo principal quando o usuário ativa algo (exemplo: alto contraste)
    contrastBtn.addEventListener('click', ()=> {
      // manter foco lógico
      document.getElementById('content').focus();
    });

    // garantias: se preferências estiverem inválidas, restauramos
    if (!prefs.fontScale || isNaN(prefs.fontScale)) prefs.fontScale = 100;
    applyPrefs();