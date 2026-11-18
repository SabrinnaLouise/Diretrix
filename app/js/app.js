/* ============================================================
   DIRETRIX · Módulos 1, 2, 6, 7, 8 e 9
   1 Interface e navegação · 2 Biblioteca · 6 Meu próximo passo
   7 Gerador de solicitações · 8 Perfil · 9 Planos
   ============================================================ */
(function (DX) {
  const $ = s => document.querySelector(s);
  const view = $('#view'), tabs = $('#tabs'), sheet = $('#sheet'), drawer = $('#drawer'), toastEl = $('#toast'), root = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const T = DX.Trixie;
  const IMG = { icone: 'img/trixie-icone.webp', chat: 'img/trixie-chat.webp', ola: 'img/trixie-ola.webp', ajuda: 'img/trixie-ajuda.webp' };

  /* ---------- ícones: só os funcionais, traço fino ---------- */
  const P = {
    casa: '<path d="M4 11l8-7 8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5z"/>',
    livro: '<path d="M5 4h13v16H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h11"/>',
    conversa: '<path d="M5 5h14v11H10l-5 4z"/>',
    pessoa: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    seta: '<path d="M9 6l6 6-6 6"/>', voltar: '<path d="M15 6l-6 6 6 6"/>',
    externo: '<path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5"/>',
    check: '<path d="M5 12l5 5 9-10"/>', copiar: '<rect x="9" y="9" width="10" height="10" rx="1.5"/><path d="M5 15V5h10"/>',
    enviar: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', mais: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    camera: '<path d="M4 8h3.5L9 6h6l1.5 2H20v11H4z"/><circle cx="12" cy="13" r="3.2"/>',
    clipe: '<path d="M19 11.5l-7.2 7.2a4.2 4.2 0 0 1-6-6L13 5.6a2.8 2.8 0 0 1 4 4l-7.1 7a1.4 1.4 0 0 1-2-2l6.4-6.3"/>',
    som: '<path d="M4 10v4h3l5 4V6l-5 4zM16 9a4 4 0 0 1 0 6"/>'
  };
  const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

  /* ---------- handlers por delegação ---------- */
  let H = {}, hid = 0;
  const h = fn => { H[++hid] = fn; return `data-h="${hid}"`; };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-h]');
    if (el && H[el.dataset.h]) H[el.dataset.h](e, el);
  });

  /* ---------- preferências (somente neste navegador) ---------- */
  const PADRAO = () => ({ tema: 'auto', fonte: 1, contraste: false, leitura: false, semAnim: false, onboard: false, plano: 'gratuito', checks: {}, uso: { d: '', c: 0, f: 0, k: 0 } });
  const store = DX.store = {
    data: PADRAO(),
    load() { try { Object.assign(this.data, JSON.parse(localStorage.getItem('diretrix') || '{}')); } catch (e) { } },
    save() { try { localStorage.setItem('diretrix', JSON.stringify(this.data)); } catch (e) { } },
    clear() { try { localStorage.removeItem('diretrix'); } catch (e) { } this.data = PADRAO(); }
  };
  DX.plano = () => DX.PLANOS[store.data.plano] || DX.PLANOS.gratuito;
  const premium = () => store.data.plano === 'premium';
  const temaHost = root.getAttribute('data-theme');
  function aplicarPrefs() {
    const s = store.data;
    if (s.tema === 'auto') { temaHost ? root.setAttribute('data-theme', temaHost) : root.removeAttribute('data-theme'); }
    else root.setAttribute('data-theme', s.tema === 'escuro' ? 'dark' : 'light');
    root.style.setProperty('--fs', s.fonte);
    s.contraste ? root.setAttribute('data-contraste', '1') : root.removeAttribute('data-contraste');
    s.leitura ? root.setAttribute('data-leitura', '1') : root.removeAttribute('data-leitura');
    s.semAnim ? root.setAttribute('data-semanim', '1') : root.removeAttribute('data-semanim');
  }

  /* ---------- navegação ---------- */
  const nav = { stack: [] };
  const ABA = { inicio: 'inicio', direitos: 'direitos', categoria: 'direitos', direito: 'direitos', passo: 'direitos', trixie: 'trixie', perfil: 'perfil', planos: 'perfil' };
  let post = [], timerCar = null;
  function go(name, p) { nav.stack.push({ name, p: p || {} }); render(); }
  function back() { nav.stack.length > 1 ? nav.stack.pop() : nav.stack = [{ name: 'inicio', p: {} }]; render(); }
  function aba(name) {
    nav.stack = [{ name, p: {} }];
    if (name === 'trixie' && !T.temConversa()) T.abrir('normal');
    render();
  }
  function render(manterRolagem) {
    const r = nav.stack[nav.stack.length - 1], y = view.scrollTop;
    fecharPainel(); fecharHistorico(); clearInterval(timerCar); H = {}; post = [];
    view.innerHTML = TELAS[r.name](r.p);
    tabs.hidden = r.name === 'onboarding';
    if (!tabs.hidden) tabs.innerHTML = [['inicio', 'Início', 'casa'], ['direitos', 'Direitos', 'livro'], ['trixie', 'Trixie', 'conversa'], ['perfil', 'Perfil', 'pessoa']]
      .map(([id, t, i]) => `<button class="tab" ${ABA[r.name] === id ? 'aria-current="page"' : ''} ${h(() => aba(id))}>${ic(i)}<span>${t}</span></button>`).join('');
    view.scrollTop = manterRolagem ? y : 0;
    post.forEach(f => f());
  }
  DX.ui = { go, render };

  function toast(msg) { toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.hidden = true, 2800); }
  function abrirPainel(titulo, corpo) {
    sheet.innerHTML = `<div class="panel"><div class="hd"><h3 id="sheet-t">${titulo}</h3><button class="ibtn" aria-label="Fechar" ${h(fecharPainel)}>${ic('x')}</button></div><div class="body">${corpo}</div></div>`;
    sheet.hidden = false;
  }
  function fecharPainel() { sheet.hidden = true; sheet.innerHTML = ''; }
  function fecharHistorico() { drawer.hidden = true; drawer.innerHTML = ''; }
  sheet.addEventListener('click', e => { if (e.target === sheet) fecharPainel(); });
  drawer.addEventListener('click', e => { if (e.target === drawer) fecharHistorico(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { fecharPainel(); fecharHistorico(); } });

  /* ---------- peças reutilizadas ---------- */
  const topo = (titulo, extra) => `<header class="top"><button class="ibtn" aria-label="Voltar" ${h(back)}>${ic('voltar')}</button><h2>${titulo}</h2>${extra || ''}</header>`;
  const selo = d => `<span class="badge ${d.status}">${DX.STATUS[d.status].rotulo}</span>`;
  const leiBtn = (id, dirId) => `<button class="lei" ${h(() => abrirLei(id, dirId))}>${DX.LEIS[id].rotulo}</button>`;
  const linkExt = (url, t) => `<a class="btn sec sm" href="${url}" target="_blank" rel="noopener">${t}${ic('externo')}</a>`;
  const linhaDireito = d => `<button class="row" ${h(() => go('direito', { id: d.id }))}><span class="tx"><b>${d.titulo}</b><span>${d.resumo}</span></span>${ic('seta')}</button>`;
  const grupo = itens => `<div class="group">${itens.join('')}</div>`;
  const linhaCat = c => `<button class="row cat ${c.id}" ${h(() => go('categoria', { id: c.id }))}><span class="tx"><b>${c.titulo}</b><span>${c.desc}</span></span><span class="n">${DX.daCategoria(c.id).length} situações</span>${ic('seta')}</button>`;
  const vazio = q => `<div class="empty"><img src="${IMG.ajuda}" alt="Trixie pensativa"><p><b>Nada encontrado para “${esc(q)}”.</b></p><p class="muted small">A busca procura apenas nos conteúdos cadastrados: Aeroportos, Restaurantes e Compras.</p></div>`;
  const lista = (itens) => `<div class="box"><ul>${itens.map(x => `<li>${x}</li>`).join('')}</ul></div>`;

  function abrirLei(id, dirId) {
    const l = DX.LEIS[id], f = DX.FONTES[l.fonte], d = dirId && DX.direito(dirId);
    abrirPainel(l.rotulo, `
      <div><span class="eyebrow">Norma</span><p><b>${f.nome}</b></p></div>
      <div><span class="eyebrow">Dispositivo verificado</span><p>${l.artigo}</p></div>
      <div><span class="eyebrow">Em palavras simples</span><p>${l.simples}</p></div>
      <p class="small muted">Fonte oficial: ${f.orgao}</p>
      ${linkExt(f.url, 'Abrir a fonte oficial')}
      <button class="btn pri" ${h(() => { if (d) T.abrir('contexto', d.id, id); else { T.nova('normal'); T.diz(`Você quer entender <b>${l.rotulo}</b>. Em palavras simples: ${l.simples}`, T.chipsCategorias(), [id]); } go('trixie'); })}>Entender com a Trixie</button>`);
  }

  /* ---------- histórico de conversas ---------- */
  function abrirHistorico() {
    const convs = T.conversas.filter(c => T.iniciada(c)).sort((a, b) => b.ts - a.ts);
    const data = ts => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    drawer.innerHTML = `<aside class="side" aria-label="Histórico de conversas">
      <div class="hd"><h3>Conversas</h3><button class="ibtn" aria-label="Fechar histórico" ${h(fecharHistorico)}>${ic('x')}</button></div>
      <div class="lst">${convs.length ? convs.map(c => `<div class="conv ${c.id === T.atualId ? 'on' : ''}">
          <button ${h(() => { T.retomar(c.id); render(); })}><b>${esc(c.titulo)}</b><span>${data(c.ts)} · ${c.msgs.length} mensagens</span></button>
          <button class="ibtn" aria-label="Apagar conversa" ${h(() => { T.apagar(c.id); if (!T.temConversa()) T.abrir('normal'); render(); abrirHistorico(); })}>${ic('x')}</button></div>`).join('')
        : `<div class="empty"><img src="${IMG.ajuda}" alt=""><p class="muted small">Suas conversas aparecem aqui depois da primeira mensagem.</p></div>`}</div>
      <div class="ft"><button class="btn pri sm" ${h(() => { T.abrir('normal'); render(); })}>${ic('mais')}Nova conversa</button>
        <p class="small muted">Plano ${DX.plano().nome}: guarda as ${DX.plano().historico} conversas mais recentes, só neste aparelho.</p></div>
    </aside>`;
    drawer.hidden = false;
  }

  /* ---------- anexos: foto e documento ---------- */
  function reduzir(file) {
    return new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => { const im = new Image(); im.onload = () => {
        const k = Math.min(1, 320 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', .7));
      }; im.onerror = () => res(null); im.src = fr.result; };
      fr.onerror = () => res(null); fr.readAsDataURL(file);
    });
  }
  async function receber(tipo, input) {
    const file = input.files && input.files[0]; input.value = '';
    if (!file) return;
    if (!T.temConversa()) T.abrir('normal');
    const anexo = { tipo, nome: file.name || (tipo === 'foto' ? 'foto.jpg' : 'documento'), tam: Math.max(1, Math.round(file.size / 1024)) + ' KB' };
    if (tipo === 'foto') anexo.thumb = await reduzir(file);
    T.anexar(tipo, anexo); T.salvar();
    if (nav.stack[nav.stack.length - 1].name === 'trixie') render();
  }
  $('#in-foto').addEventListener('change', e => receber('foto', e.target));
  $('#in-doc').addEventListener('change', e => receber('doc', e.target));

  function ouvir(html) {
    try {
      const txt = html.replace(/<li>/g, ' ').replace(/<[^>]+>/g, ' ');
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt); u.lang = 'pt-BR'; speechSynthesis.speak(u);
    } catch (e) { toast('Este navegador não permite leitura em voz alta aqui.'); }
  }

  /* ============================================================ TELAS */
  const TELAS = {

    /* ----- Abertura e apresentação ----- */
    onboarding(p) {
      const fim = () => { store.data.onboard = true; store.save(); nav.stack = []; go('inicio'); };
      if (!p.passo) return `<section class="onb">
        <div class="art"><img src="${IMG.ola}" alt="Trixie, a coruja do Diretrix, acenando"></div>
        <div class="sheet">
          <h1>Bem-vindo ao Diretrix!</h1>
          <p class="muted">Conheça seus direitos e descubra o que fazer em situações do dia a dia.</p>
          <p class="quote">Oi! Eu sou a Trixie, sua assistente do Diretrix. Estou aqui para ajudar você a entender seus direitos de forma simples e descobrir por onde começar!</p>
          <div class="dots"><i class="on"></i><i></i></div>
          <button class="btn pri" ${h(() => { nav.stack = [{ name: 'onboarding', p: { passo: 1 } }]; render(); })}>Começar</button>
          <button class="btn ghost" ${h(fim)}>Pular apresentação</button>
        </div></section>`;
      return `<section class="onb">
        <div class="art"><img src="${IMG.chat}" alt="Trixie segurando um livro de leis" style="max-height:210px"></div>
        <div class="sheet">
          <h1>Como o Diretrix funciona</h1>
          <div>
            <div class="num"><i>1</i><div><b>Consultar</b><span>Encontre sua situação na biblioteca de direitos.</span></div></div>
            <div class="num"><i>2</i><div><b>Entender</b><span>Leia a lei em linguagem simples, com a fonte oficial.</span></div></div>
            <div class="num"><i>3</i><div><b>Agir</b><span>Siga um roteiro e prepare sua solicitação.</span></div></div>
          </div>
          <p class="small muted">O Diretrix oferece informação educativa. Não substitui a orientação de um profissional habilitado.</p>
          <div class="dots"><i></i><i class="on"></i></div>
          <button class="btn pri" ${h(fim)}>Entrar no Diretrix</button>
        </div></section>`;
    },

    /* ----- Tela 1 · Início ----- */
    inicio() {
      const pq = DX.DADOS.pesquisa, cg = DX.DADOS.cgov, pct = n => String(n).replace('.', ',') + '%';
      post.push(() => {
        const inp = $('#q-inicio'), res = $('#res-inicio'), resto = $('#resto-inicio');
        inp.addEventListener('input', () => {
          const q = inp.value.trim();
          if (q.length < 2) { res.innerHTML = ''; resto.hidden = false; return; }
          const r = DX.buscar(q); resto.hidden = true;
          res.innerHTML = `<h3 class="sec-t">Resultados</h3>` + (r.length ? grupo(r.map(linhaDireito)) : vazio(q));
        });
        /* carrossel: pontos acompanham a rolagem; avanço automático discreto */
        const car = $('#car'), dots = [...document.querySelectorAll('#car-dots button')];
        const atual = () => Math.round(car.scrollLeft / car.clientWidth);
        const ir = i => car.scrollTo({ left: i * car.clientWidth, behavior: store.data.semAnim ? 'auto' : 'smooth' });
        car.addEventListener('scroll', () => dots.forEach((d, i) => d.classList.toggle('on', i === atual())), { passive: true });
        dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timerCar); ir(i); }));
        ['pointerdown', 'touchstart', 'wheel'].forEach(ev => car.addEventListener(ev, () => clearInterval(timerCar), { passive: true }));
        if (!store.data.semAnim && !matchMedia('(prefers-reduced-motion:reduce)').matches) timerCar = setInterval(() => ir((atual() + 1) % dots.length), 6000);
      });
      const comuns = ['cancelamento-voo', 'extravio-bagagem', 'arrependimento', 'defeito', 'taxa-servico', 'atraso-entrega'];
      return `<div class="pad">
        <div class="brand"><img class="logo sobre-claro" src="img/logo-diretrix.png" alt="Diretrix"><img class="logo sobre-escuro" src="img/logo-diretrix-claro.png" alt="Diretrix"><span class="plano">${DX.plano().nome}</span></div>

        <section class="stack" aria-label="Destaques">
          <div class="car" id="car">
            <article class="slide a">
              <span class="eyebrow">${pq.fonte} · ${pq.respostas} respostas</span>
              <div class="big">${pct(pq.sim)}</div>
              <p>já passaram por uma situação em que não sabiam quais eram seus direitos.</p>
              <div class="bar3"><i style="width:${pq.sim}%;background:#F2C058"></i><i style="width:${pq.nao}%;background:#48B897"></i><i style="width:${pq.talvez}%;background:#D0679A"></i></div>
              <div class="leg"><span style="--k:#F2C058">Sim ${pct(pq.sim)}</span><span style="--k:#48B897">Não ${pct(pq.nao)}</span><span style="--k:#D0679A">Não tenho certeza ${pct(pq.talvez)}</span></div>
            </article>
            <article class="slide b">
              <div class="txt"><h2>Seus direitos, sem complicação.</h2><p class="small muted">Consultar, entender e agir, com fonte oficial em cada explicação.</p></div>
              <img class="tr" src="${IMG.ola}" alt="Trixie acenando">
            </article>
            <a class="slide c" href="${cg.url}" target="_blank" rel="noopener">
              <span class="eyebrow">Consumidor.gov.br em 2025</span>
              <div class="big">${cg.finalizadas}</div>
              <p>reclamações finalizadas. ${cg.solucao} foram resolvidas pelas empresas, com resposta em ${cg.prazo}, em média.</p>
              <span class="small" style="opacity:.8;text-decoration:underline">Fonte: ${cg.fonte}</span>
            </a>
            <article class="slide d">
              <div class="txt"><h2>Não sabe por onde começar?</h2><p class="small">Conte o que aconteceu e a Trixie indica o caminho.</p>
              <button class="btn pri sm" ${h(() => { T.abrir('normal'); go('trixie'); })}>Falar com a Trixie</button></div>
              <img class="tr" src="${IMG.ajuda}" alt="Trixie pensativa">
            </article>
          </div>
          <div class="dots" id="car-dots">${[0, 1, 2, 3].map(i => `<button class="${i ? '' : 'on'}" aria-label="Destaque ${i + 1} de 4"></button>`).join('')}</div>
        </section>

        <label class="search">${ic('busca')}<input id="q-inicio" type="search" placeholder="Qual é a sua dúvida?" aria-label="Qual é a sua dúvida?" autocomplete="off"></label>
        <div id="res-inicio" class="stack"></div>
        <div id="resto-inicio" class="stack" style="gap:22px">
          <button class="btn pri" ${h(() => aba('direitos'))}>Explorar meus direitos</button>
          <section class="stack"><h3 class="sec-t">Categorias</h3>${grupo(DX.CATEGORIAS.map(linhaCat))}</section>
          <section class="stack"><h3 class="sec-t">Situações comuns</h3>
            <div class="hcar">${comuns.map(id => { const d = DX.direito(id), c = DX.categoria(d.cat); return `<button class="hcard" ${h(() => go('direito', { id }))}><span class="eyebrow">${c.curto || c.titulo}</span><b>${d.titulo}</b><span>${d.resumo}</span></button>`; }).join('')}</div>
          </section>
        </div>
      </div>`;
    },

    /* ----- Tela 2 · Biblioteca ----- */
    direitos() {
      post.push(() => {
        const inp = $('#q-bib'), res = $('#res-bib'), cats = $('#cats-bib');
        inp.addEventListener('input', () => {
          const q = inp.value.trim();
          if (q.length < 2) { res.innerHTML = ''; cats.hidden = false; return; }
          const r = DX.buscar(q); cats.hidden = true;
          res.innerHTML = r.length ? grupo(r.map(linhaDireito)) : vazio(q);
        });
      });
      return `<div class="pad">
        <div><h1 class="h-page">Biblioteca de direitos</h1><p class="muted">Consulte sem cadastro. Tudo aqui é gratuito.</p></div>
        <label class="search">${ic('busca')}<input id="q-bib" type="search" placeholder="Buscar em todos os direitos" aria-label="Buscar em todos os direitos" autocomplete="off"></label>
        <div id="res-bib"></div>
        <div id="cats-bib">${grupo(DX.CATEGORIAS.map(linhaCat))}</div>
      </div>`;
    },

    categoria(p) {
      const c = DX.categoria(p.id), todos = DX.daCategoria(c.id);
      post.push(() => {
        const inp = $('#q-cat'), res = $('#lista-cat');
        inp.addEventListener('input', () => {
          const q = inp.value.trim(), r = q.length < 2 ? todos : DX.buscar(q, c.id);
          res.innerHTML = r.length ? grupo(r.map(linhaDireito)) : vazio(q);
        });
      });
      return topo('Direitos') + `<div class="pad">
        <div class="stack" style="gap:6px"><h1 class="h-page">${c.titulo}</h1><p class="muted">${c.desc}</p><p class="small muted">${c.abrangencia}</p></div>
        <label class="search">${ic('busca')}<input id="q-cat" type="search" placeholder="Buscar em ${c.curto || c.titulo}" aria-label="Buscar nesta categoria" autocomplete="off"></label>
        <div id="lista-cat">${grupo(todos.map(linhaDireito))}</div>
        <button class="btn sec" ${h(() => { T.nova('normal'); T.situacoes(c); go('trixie'); })}>Perguntar à Trixie</button>
      </div>`;
    },

    /* ----- Tela 3 · Detalhes de um direito ----- */
    direito(p) {
      const d = DX.direito(p.id), c = DX.categoria(d.cat);
      const fontes = [...new Set(d.leis.map(l => DX.LEIS[l].fonte))].map(f => DX.FONTES[f]);
      return topo(c.curto || c.titulo) + `<div class="pad">
        <div class="stack" style="gap:6px">${selo(d)}<h1 class="h-page">${d.titulo}</h1></div>
        ${d.status !== 'verificado' ? `<p class="note"><b>${DX.STATUS[d.status].desc}.</b> ${d.nota}</p>` : ''}
        <section class="stack"><h3 class="sec-t">Em palavras simples</h3><div class="box"><p>${d.explicacao}</p></div></section>
        <section class="stack"><h3 class="sec-t">Quando se aplica</h3>${lista(d.condicoes)}</section>
        <section class="stack"><h3 class="sec-t">Exceções e pontos de atenção</h3>${lista(d.excecoes)}</section>
        <section class="stack"><h3 class="sec-t">Legislação</h3><p class="small muted">Toque em um artigo para ver a explicação.</p><div class="chips">${d.leis.map(l => leiBtn(l, d.id)).join('')}</div></section>
        <section class="stack"><h3 class="sec-t">Fonte oficial</h3><div class="box stack">
          ${fontes.map(f => `<div><b>${f.nome}</b><p class="small muted">${f.orgao}</p></div>`).join('')}
          <p class="small muted">Órgão responsável: ${c.orgao}<br>Abrangência: ${c.abrangencia}<br>Última revisão: ${DX.REVISAO} · ${DX.STATUS[d.status].rotulo}</p></div></section>
        <section class="stack"><h3 class="sec-t">Orientações práticas</h3>${lista(d.passos.slice(0, 4))}</section>
        <div class="stack">
          <button class="btn pri" ${h(() => { T.abrir('contexto', d.id); go('trixie'); })}>Tenho dúvidas sobre esse direito</button>
          <button class="btn sec" ${h(() => go('passo', { id: d.id }))}>Ver meu próximo passo</button>
          ${fontes.map(f => `<a class="btn ghost" href="${f.url}" target="_blank" rel="noopener">Ler a lei original${fontes.length > 1 ? ' · ' + f.curto : ''} ${ic('externo')}</a>`).join('')}
        </div>
      </div>`;
    },

    /* ----- Tela 4 · Chatbot Trixie ----- */
    trixie() {
      if (!T.temConversa()) T.abrir('normal');
      const empilhado = nav.stack.length > 1, ult = T.msgs[T.msgs.length - 1], u = T.uso(), pl = DX.plano();
      const rot = { normal: 'Conversa', contexto: 'Sobre um direito', rapido: 'Problema para resolver agora' }[T.modo];
      const enviar = e => {
        e.preventDefault();
        const inp = $('#msg-in'), txt = inp.value.trim();
        if (!txt) return;
        if (!T.restante()) semLimite(); else { T.contar(); T.usuario(txt); T.texto(txt); }
        T.salvar(); render();
      };
      post.push(() => { $('#form-chat').addEventListener('submit', enviar); const m = $('#msgs'); m.scrollTop = m.scrollHeight; });
      const anexoHtml = a => a.thumb ? `<div class="anexo"><img src="${a.thumb}" alt="Foto anexada: ${esc(a.nome)}"></div>` : `<div class="anexo">${ic(a.tipo === 'foto' ? 'camera' : 'clipe')}<span>${esc(a.nome)} · ${esc(a.tam)}</span></div>`;
      const bolha = m => m.de === 'u' ? `<div class="msg u">${m.anexo ? anexoHtml(m.anexo) : m.html}</div>` :
        `<div class="msg t">${m.html}${m.leis.length ? `<div class="fontes"><span class="eyebrow">Fontes</span>${m.leis.map(l => leiBtn(l, T.ctx)).join('')}</div>` : ''}</div>`;
      return `<div class="chat">
        <header class="top">${empilhado ? `<button class="ibtn" aria-label="Voltar" ${h(back)}>${ic('voltar')}</button>` : ''}
          <button class="ibtn" aria-label="Histórico de conversas" title="Histórico" ${h(abrirHistorico)}>${ic('menu')}</button>
          <img src="${IMG.chat}" alt="Trixie">
          <h2>Trixie<small>Guiada · sem IA generativa</small></h2>
          <button class="ibtn" aria-label="Nova conversa" title="Nova conversa" ${h(() => { T.abrir('normal'); render(); })}>${ic('mais')}</button>
        </header>
        <div class="msgs" id="msgs">
          <span class="modo">${rot}</span>
          ${T.msgs.map(bolha).join('')}
          ${ult && ult.de === 't' && premium() ? `<button class="ouvir" ${h(() => ouvir(ult.html))}>${ic('som')}Ouvir resposta</button>` : ''}
          ${ult && ult.de === 't' && ult.chips.length ? `<div class="chips">${ult.chips.map(c => `<button class="chip ${c.pri ? 'pri' : ''}" ${h(() => chip(c))}>${c.t}</button>`).join('')}</div>` : ''}
        </div>
        <div class="composer">
          <form id="form-chat">
            <button type="button" class="ibtn" aria-label="Tirar foto" title="Tirar foto" ${h(() => $('#in-foto').click())}>${ic('camera')}</button>
            <button type="button" class="ibtn" aria-label="Anexar documento" title="Anexar documento" ${h(() => $('#in-doc').click())}>${ic('clipe')}</button>
            <input id="msg-in" type="text" placeholder="Escreva sua dúvida" aria-label="Escreva sua dúvida" autocomplete="off" maxlength="300">
            <button class="send" aria-label="Enviar">${ic('enviar')}</button></form>
          <p class="disc">A Trixie oferece informações educativas e pode cometer erros. Não substitui a orientação de um profissional habilitado.<br>Plano ${pl.nome} hoje: ${u.c}/${pl.msgs} mensagens · ${u.f}/${pl.fotos} fotos · ${u.k}/${pl.docs} documentos</p>
        </div>
      </div>`;
    },

    /* ----- Tela 5 · Meu próximo passo ----- */
    passo(p) {
      const d = DX.direito(p.id);
      const caso = T.temConversa() ? T.caso : null;
      const resumo = caso && caso.dir === d.id ? caso.resumo : d.titulo + '. ' + d.resumo;
      const feitos = () => store.data.checks[d.id] || [];
      const prog = () => Math.round(feitos().length / d.passos.length * 100);
      const marcar = (i, el) => {
        let f = feitos(); f = f.includes(i) ? f.filter(x => x !== i) : [...f, i];
        store.data.checks[d.id] = f; store.save();
        el.setAttribute('aria-checked', f.includes(i));
        $('#prog').style.width = prog() + '%'; $('#prog-t').textContent = `${f.length} de ${d.passos.length}`;
      };
      const buscarEmpresa = () => {
        const nome = $('#emp-busca').value.trim(), out = $('#emp-res');
        if (!nome) { out.innerHTML = `<p class="small muted">Digite o nome da empresa.</p>`; return; }
        $('#sol-empresa').value = nome;
        const e = DX.EMPRESAS.find(x => DX.norm(x.nome).includes(DX.norm(nome)));
        out.innerHTML = e ? `<div class="box"><b>${esc(e.nome)}</b><p class="small">${esc(e.sac || '')}</p><p class="small muted">Verificado em ${esc(e.verificadoEm)}</p></div>` :
          `<p class="note">Ainda não há contato oficial verificado para “${esc(nome)}” no Diretrix. Consulte o site oficial da empresa e use somente os canais divulgados lá.</p>`;
      };
      const gerar = () => {
        const v = id => $(id).value.trim();
        const emp = v('#sol-empresa'), desc = v('#sol-desc'), dt = v('#sol-data'), sol = v('#sol-solucao');
        if (!emp || !desc) { toast('Preencha o nome da empresa e a descrição.'); return; }
        const data = dt ? dt.split('-').reverse().join('/') : '';
        const base = d.leis.map(l => DX.LEIS[l].rotulo).join('; ');
        const frase = desc.charAt(0).toLowerCase() + desc.slice(1).replace(/\.+$/, '');
        $('#sol-texto').value = `Assunto: Solicitação sobre ${d.titulo.toLowerCase()}\n\nPrezados(as) da ${emp},\n\n${data ? 'Em ' + data + ', ' + frase : desc.replace(/\.+$/, '')}.\n\nConsiderando o que dispõe a legislação de defesa do consumidor (${base}), solicito ${sol || d.solucao}.\n\nPeço, por gentileza, a confirmação do recebimento desta mensagem, o número de protocolo e uma resposta por escrito.\n\nAgradeço a atenção.\n\n[Seu nome]\n[Seu contato]`;
        $('#sol-saida').hidden = false; $('#sol-saida').scrollIntoView({ block: 'nearest' });
      };
      const copiar = async () => {
        const ta = $('#sol-texto');
        try { await navigator.clipboard.writeText(ta.value); toast('Texto copiado.'); }
        catch (e) { ta.focus(); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (x) { } toast(ok ? 'Texto copiado.' : 'Selecione o texto e copie manualmente.'); }
      };
      return topo('Meu próximo passo') + `<div class="pad">
        <section class="resumo"><span class="eyebrow">Resumo da situação</span><p>${resumo}</p>${selo(d)}</section>
        ${d.status !== 'verificado' ? `<p class="note"><b>${DX.STATUS[d.status].desc}.</b> ${d.nota}</p>` : ''}

        <section class="stack"><h3 class="sec-t">Checklist de orientação <span class="small muted" id="prog-t" style="font-family:var(--body);font-weight:600">${feitos().length} de ${d.passos.length}</span></h3>
          <div class="prog"><i id="prog" style="width:${prog()}%"></i></div>
          <p class="small muted">Ações que você pode considerar. Nenhum documento é exigido.</p>
          ${grupo(d.passos.map((x, i) => `<button class="check" role="checkbox" aria-checked="${feitos().includes(i)}" ${h((e, el) => marcar(i, el))}><i class="cb">${ic('check')}</i><span>${x}</span></button>`))}
        </section>

        <section class="stack"><h3 class="sec-t">Contatar a empresa</h3>
          <div class="stack" style="flex-direction:row"><label class="search" style="flex:1;min-width:0">${ic('busca')}<input id="emp-busca" type="text" placeholder="Nome da empresa" aria-label="Nome da empresa"></label><button class="btn sec sm" ${h(buscarEmpresa)}>Buscar</button></div>
          <div id="emp-res"><p class="small muted">O Diretrix mostra somente contatos oficiais verificados. Quando não houver, consulte o site oficial da empresa.</p></div>
        </section>

        <section class="stack"><h3 class="sec-t">Canais oficiais</h3>
          ${grupo(d.canais.map(k => { const c = DX.CANAIS[k]; return c.url ? `<a class="row" href="${c.url}" target="_blank" rel="noopener"><span class="tx"><b>${c.nome}</b><span>${c.desc}</span></span>${ic('externo')}</a>` : `<div class="row"><span class="tx"><b>${c.nome}</b><span>${c.desc}</span></span></div>`; }))}
        </section>

        <section class="stack"><h3 class="sec-t">Preparar uma solicitação</h3>
          <p class="small muted">Gere uma mensagem educada para enviar à empresa. O Diretrix não envia nada por você.</p>
          <div class="field"><label for="sol-empresa">Nome da empresa</label><input id="sol-empresa" type="text" autocomplete="off"></div>
          <div class="field"><label for="sol-desc">O que aconteceu</label><textarea id="sol-desc" placeholder="Descreva em poucas frases"></textarea></div>
          <div class="field"><label for="sol-data">Data do ocorrido</label><input id="sol-data" type="date"></div>
          <div class="field"><label for="sol-solucao">Solução desejada</label><input id="sol-solucao" type="text" value="${esc(d.solucao)}"></div>
          <button class="btn pri" ${h(gerar)}>Gerar mensagem</button>
          <div id="sol-saida" class="stack" hidden>
            <div class="field"><label for="sol-texto">Sua mensagem (você pode editar)</label><textarea id="sol-texto" style="min-height:300px"></textarea></div>
            <button class="btn sec" ${h(copiar)}>${ic('copiar')}Copiar texto</button>
          </div>
        </section>

        <div class="stack">
          <button class="btn sec" ${h(() => { if (!(T.temConversa() && T.ctx === d.id)) T.abrir('contexto', d.id); go('trixie'); })}>Continuar conversando com a Trixie</button>
          <button class="btn ghost" ${h(() => aba('inicio'))}>Voltar ao início</button>
        </div>
      </div>`;
    },

    /* ----- Tela 6 · Perfil e configurações ----- */
    perfil() {
      const s = store.data;
      const set = (k, v) => { s[k] = v; store.save(); aplicarPrefs(); render(true); };
      const seg = (k, ops) => `<div class="seg">${ops.map(([v, t]) => `<button aria-pressed="${s[k] === v}" ${h(() => set(k, v))}>${t}</button>`).join('')}</div>`;
      const sw = (k, t, sub) => `<button class="sw" role="switch" aria-checked="${!!s[k]}" ${h(() => set(k, !s[k]))}><span><b>${t}</b><br><span class="small muted">${sub}</span></span><i></i></button>`;
      const item = (t, f, sub) => `<button class="row" ${h(f)}><span class="tx"><b>${t}</b>${sub ? `<span>${sub}</span>` : ''}</span>${ic('seta')}</button>`;
      const info = k => () => abrirPainel(INFO[k][0], INFO[k][1]);
      const docs = () => {
        if (!premium()) return abrirPainel('Meus documentos', `<p>A organização de documentos por conversa faz parte do Premium.</p><button class="btn pri" ${h(() => go('planos'))}>Ver planos</button>`);
        const a = T.anexos();
        abrirPainel('Meus documentos', a.length ? grupo(a.map(x => `<div class="row"><span class="tx"><b>${esc(x.nome)}</b><span>${x.tipo === 'foto' ? 'Foto' : 'Documento'} · ${esc(x.tam)} · conversa “${esc(x.conversa)}”</span></span></div>`)) : `<p class="muted">Nenhum anexo ainda. Envie fotos ou documentos pela conversa com a Trixie.</p>`);
      };
      return `<div class="pad">
        <div><h1 class="h-page">Perfil</h1><p class="small muted">Sem cadastro. Suas preferências ficam só neste aparelho.</p></div>

        <section class="stack"><h3 class="sec-t">Assinatura</h3>
          ${grupo([item(`Plano atual: ${DX.plano().nome}`, () => go('planos'), 'Comparar Gratuito e Premium'), item('Meus documentos', docs, 'Fotos e arquivos enviados à Trixie')])}</section>

        <section class="stack"><h3 class="sec-t">Aparência</h3>
          <div class="box stack"><b>Tema</b>${seg('tema', [['auto', 'Automático'], ['claro', 'Claro'], ['escuro', 'Escuro']])}
            <b style="margin-top:6px">Tamanho da fonte</b>${seg('fonte', [[0.9, 'A−'], [1, 'A'], [1.12, 'A+'], [1.25, 'A++']])}</div></section>

        <section class="stack"><h3 class="sec-t">Acessibilidade</h3>
          ${grupo([sw('contraste', 'Contraste reforçado', 'Textos secundários mais fortes'), sw('leitura', 'Leitura confortável', 'Mais espaço entre linhas e palavras'), sw('semAnim', 'Reduzir animações', 'Desliga transições e o carrossel automático')])}</section>

        <section class="stack"><h3 class="sec-t">Informações</h3>
          ${grupo([item('Sobre o Diretrix', info('sobre')), item('Como funciona a Trixie', info('trixie')), item('Fontes jurídicas', info('fontes')), item('Limitações do aplicativo', info('limites')), item('Termos de uso', info('termos'))])}</section>

        <section class="stack"><h3 class="sec-t">Privacidade</h3>
          ${grupo([item('Política de privacidade', info('privacidade')), item('Permissões', info('permissoes')),
            item('Excluir dados armazenados', () => abrirPainel('Excluir dados armazenados', `<p>Isso apaga deste aparelho suas preferências, o plano de teste, os checklists, as conversas com anexos e os contadores de uso. Não há dados seus em servidores do Diretrix.</p><button class="btn pri" ${h(() => { store.clear(); T.apagarTudo(); aplicarPrefs(); render(); toast('Dados apagados deste aparelho.'); })}>Excluir agora</button><button class="btn ghost" ${h(fecharPainel)}>Cancelar</button>`), 'Preferências, checklists, conversas e anexos')])}</section>

        <section class="stack"><h3 class="sec-t">Ajuda</h3>
          ${grupo([item('Perguntas frequentes', info('faq')), item('Repetir tutorial', () => { nav.stack = []; go('onboarding'); })])}</section>
        <p class="small muted" style="text-align:center">Diretrix · protótipo · conteúdo revisado em ${DX.REVISAO}</p>
      </div>`;
    },

    /* ----- Planos ----- */
    planos() {
      const g = DX.PLANOS.gratuito, pr = DX.PLANOS.premium, ePrem = premium();
      const li = (t, nota) => `<li><span>${t}</span>${nota ? `<em>${nota}</em>` : ''}</li>`;
      const mudar = p => { store.data.plano = p; store.save(); T.salvar(); render(); toast(p === 'premium' ? 'Premium ativado. Neste protótipo não há cobrança.' : 'Você voltou ao plano Gratuito.'); };
      return topo('Planos') + `<div class="pad">
        <div><h1 class="h-page">Gratuito ou Premium</h1><p class="muted">As informações essenciais sobre seus direitos continuam gratuitas.</p></div>
        <section class="plan ${ePrem ? '' : 'atual'}">${ePrem ? '' : '<span class="atual-t">Seu plano atual</span>'}<h3>Gratuito</h3><div class="price">R$ 0</div>
          <ul>${['Biblioteca de direitos e fontes oficiais', 'Explicações legais em linguagem simples', `Trixie com ${g.msgs} mensagens por dia`, `${g.fotos} fotos e ${g.docs} documentos por dia`, `Histórico das ${g.historico} conversas mais recentes`, 'Meu próximo passo, checklist e canais oficiais', 'Preparação básica de solicitações'].map(t => li(t)).join('')}</ul>
          ${ePrem ? `<button class="btn ghost" ${h(() => mudar('gratuito'))}>Voltar ao Gratuito</button>` : ''}</section>
        <section class="plan prem ${ePrem ? 'atual' : ''}">${ePrem ? '<span class="atual-t">Seu plano atual</span>' : ''}<h3>Premium</h3>
          <div style="display:flex;gap:6px 22px;flex-wrap:wrap"><div class="price">R$ 9,90 <small>por mês</small></div><div class="price">R$ 54,90 <small>por semestre</small></div></div>
          <ul>${[[`${pr.msgs} mensagens por dia com a Trixie`], [`Envio de contratos e comprovantes: ${pr.fotos} fotos e ${pr.docs} documentos por dia`], ['Conversa por voz: ouvir as respostas da Trixie'], [`Histórico ampliado: ${pr.historico} conversas`], ['Organização de documentos por conversa'], ['Experiência sem anúncios'], ['Leitura assistida de documentos', 'depende de IA']].map(x => li(x[0], x[1])).join('')}</ul>
          ${ePrem ? '<p class="small" style="opacity:.85">Premium ativo neste aparelho, em modo de teste.</p>' : `<button class="btn gold" ${h(() => mudar('premium'))}>Assinar</button>`}</section>
        <p class="small muted">Este protótipo não processa pagamentos e não exibe anúncios. A assinatura aqui é uma simulação para testar os recursos.</p>
      </div>`;
    }
  };

  /* ---------- chat: clique em opção e limite ---------- */
  function semLimite() {
    const p = DX.plano();
    T.diz(`Você chegou ao limite de ${p.msgs} mensagens de hoje no plano ${p.nome}. A Biblioteca de direitos e o Meu próximo passo continuam liberados.`,
      [{ t: 'Explorar a biblioteca', nav: true, pri: true, f: () => aba('direitos') }, ...(premium() ? [] : [{ t: 'Ver planos', nav: true, f: () => go('planos') }])]);
  }
  function chip(c) {
    if (c.nav) return c.f();
    if (!T.restante()) semLimite(); else { T.contar(); T.usuario(c.t); c.f(); }
    T.salvar(); render();
  }

  /* ---------- textos informativos ---------- */
  const fontesHtml = grupo([...Object.values(DX.FONTES), { nome: 'Consumidor.gov.br', orgao: 'Plataforma pública de reclamações', url: DX.CANAIS.cgov.url }, { nome: DX.DADOS.cgov.fonte, orgao: 'Dados do carrossel da tela inicial', url: DX.DADOS.cgov.url }]
    .map(f => `<a class="row" href="${f.url}" target="_blank" rel="noopener"><span class="tx"><b>${f.nome}</b><span>${f.orgao}</span></span>${ic('externo')}</a>`));
  const INFO = {
    sobre: ['Sobre o Diretrix', `<p>O Diretrix ajuda pessoas comuns a entender direitos do consumidor no Brasil e a descobrir o que fazer em problemas do dia a dia.</p><p>O caminho é sempre o mesmo: <b>consultar</b> a situação, <b>entender</b> a regra em linguagem simples e <b>agir</b> com um roteiro prático.</p><p class="note">Esta é uma versão de protótipo, com três categorias: Aeroportos, Restaurantes e Compras.</p>`],
    trixie: ['Como funciona a Trixie', `<p>A Trixie é a assistente do Diretrix. Neste protótipo ela é um <b>assistente guiado</b>: faz perguntas curtas e responde com textos cadastrados e revisados na base jurídica do app.</p><p><b>Não há inteligência artificial generativa conectada.</b> Perguntas fora dos temas cadastrados recebem um aviso de que a consulta ainda não está disponível, e fotos e documentos enviados ficam guardados na conversa, mas não são lidos.</p><p>A Trixie não garante resultados nem indenizações, e não substitui um profissional habilitado.</p>`],
    fontes: ['Fontes jurídicas', `<p>O conteúdo se apoia em normas e páginas oficiais. Cada direito mostra seu estado: verificado, pendente de revisão ou desatualizado.</p>${fontesHtml}<p class="small muted">Também são consideradas orientações públicas de Procons. O dado de 80% vem da pesquisa do próprio Diretrix, com ${DX.DADOS.pesquisa.respostas} respostas. Última revisão geral: ${DX.REVISAO}.</p>`],
    limites: ['Limitações do aplicativo', `<ul><li>O Diretrix oferece informação educativa e orientações gerais. Não presta serviços jurídicos nem substitui advogado, Defensoria ou Procon.</li><li>As regras podem mudar. Conteúdos marcados como pendentes ainda não foram confirmados.</li><li>Leis estaduais e municipais podem trazer regras diferentes das descritas aqui.</li><li>O app não envia reclamações, não lê os documentos anexados e não tem contatos de empresas cadastrados nesta versão.</li></ul>`],
    termos: ['Termos de uso', `<p class="note">Rascunho do protótipo. O texto definitivo precisa de revisão jurídica antes do lançamento.</p><ul><li>O conteúdo tem finalidade educativa e informativa.</li><li>O uso da biblioteca não exige cadastro.</li><li>As decisões tomadas a partir das informações são de responsabilidade do usuário.</li><li>O Diretrix não garante resultados em reclamações ou processos.</li></ul>`],
    privacidade: ['Política de privacidade', `<p class="note">Rascunho do protótipo, pensado a partir da LGPD.</p><ul><li>O Diretrix não pede CPF, cadastro nem localização para consultar direitos.</li><li>Nesta versão, nada do que você digita ou anexa sai do seu aparelho: não há servidor nem IA externa conectada.</li><li>Ficam salvos apenas neste aparelho: preferências, checklists, conversas, miniaturas das fotos e nomes dos documentos.</li><li>Conversas não são usadas para publicidade nem compartilhadas com anunciantes.</li><li>Você pode apagar tudo em Perfil, Excluir dados armazenados.</li></ul>`],
    permissoes: ['Permissões', `<p>O Diretrix só acessa a câmera ou seus arquivos quando você toca em “Tirar foto” ou “Anexar documento”, e apenas para o item que você escolher.</p><p>Não usa localização, microfone nem contatos. A cópia de texto só acontece quando você toca em “Copiar texto”.</p>`],
    faq: ['Perguntas frequentes', `<p><b>Preciso pagar para consultar meus direitos?</b><br>Não. A biblioteca, as explicações e as fontes oficiais são gratuitas.</p><p><b>A Trixie é uma inteligência artificial?</b><br>Neste protótipo, não. Ela segue fluxos guiados com conteúdo cadastrado.</p><p><b>A Trixie lê os documentos que eu envio?</b><br>Ainda não. Eles ficam guardados na conversa para você consultar.</p><p><b>O Diretrix envia minha reclamação?</b><br>Não. Ele ajuda a preparar a mensagem; o envio é feito por você, nos canais oficiais.</p><p><b>Posso confiar nas informações?</b><br>Cada conteúdo mostra a fonte oficial, a data de revisão e se está verificado. Em casos complexos, procure um profissional habilitado.</p>`]
  };

  /* ---------- início ---------- */
  store.load(); T.carregar(); aplicarPrefs();
  go(store.data.onboard ? 'inicio' : 'onboarding');
})(window.DX);
