/* ============================================================
   DIRETRIX · Módulo 4 · ASSISTENTE GUIADO TRIXIE
   Motor de conversa por fluxos condicionais. Todas as respostas
   vêm da base jurídica. Modos: normal, contexto, rapido.
   As conversas ficam guardadas neste aparelho (histórico).
   ============================================================ */
(function (DX) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lista = itens => '<ul>' + itens.map(i => `<li>${i}</li>`).join('') + '</ul>';
  const CHAVE = 'diretrix-conversas';

  const T = DX.Trixie = {
    conversas: [], atualId: null,

    /* ---------- conversas e histórico ---------- */
    get c() { return this.conversas.find(x => x.id === this.atualId) || this.nova('normal'); },
    get msgs() { return this.c.msgs; },
    get modo() { return this.c.modo; }, set modo(v) { this.c.modo = v; },
    get ctx() { return this.c.ctx; }, set ctx(v) { this.c.ctx = v; },
    get caso() { return this.c.caso; }, set caso(v) { this.c.caso = v; },
    temConversa() { return !!this.conversas.find(x => x.id === this.atualId); },
    iniciada(c) { return c.msgs.some(m => m.de === 'u'); },
    nova(modo) {
      this.conversas = this.conversas.filter(c => this.iniciada(c)); // descarta conversas vazias
      const c = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), titulo: 'Nova conversa', ts: Date.now(), modo, ctx: null, caso: null, msgs: [] };
      this.conversas.unshift(c); this.atualId = c.id; return c;
    },
    salvar() {
      const max = DX.plano().historico;
      const dados = this.conversas.filter(c => this.iniciada(c)).sort((a, b) => b.ts - a.ts).slice(0, max)
        .map(c => ({ ...c, msgs: c.msgs.map(m => ({ de: m.de, html: m.html, leis: m.leis || [], anexo: m.anexo || null })) }));
      try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) { }
    },
    carregar() {
      try { this.conversas = JSON.parse(localStorage.getItem(CHAVE) || '[]').map(c => ({ ...c, msgs: c.msgs.map(m => ({ ...m, chips: [], leis: m.leis || [] })) })); } catch (e) { this.conversas = []; }
      const ult = this.conversas.slice().sort((a, b) => b.ts - a.ts)[0];
      this.atualId = ult ? ult.id : null;   // reabre a conversa mais recente
      if (ult) this.retomar(ult.id);
    },
    retomar(id) {
      this.conversas = this.conversas.filter(c => this.iniciada(c));
      this.atualId = id;
      const c = this.c, ult = c.msgs[c.msgs.length - 1], d = c.ctx && DX.direito(c.ctx);
      if (ult && ult.de === 't') ult.chips = d ? this.seguir(d) : this.chipsCategorias();
    },
    apagar(id) { this.conversas = this.conversas.filter(c => c.id !== id); if (this.atualId === id) this.atualId = null; this.salvar(); },
    apagarTudo() { this.conversas = []; this.atualId = null; try { localStorage.removeItem(CHAVE); } catch (e) { } },
    anexos() { return this.conversas.flatMap(c => c.msgs.filter(m => m.anexo).map(m => ({ ...m.anexo, conversa: c.titulo, ts: c.ts }))); },

    /* ---------- limites diários do plano ---------- */
    uso() {
      const u = DX.store.data.uso, hoje = new Date().toISOString().slice(0, 10);
      if (u.d !== hoje) { u.d = hoje; u.c = 0; u.f = 0; u.k = 0; }
      u.f = u.f || 0; u.k = u.k || 0;
      return u;
    },
    restante() { return Math.max(0, DX.plano().msgs - this.uso().c); },
    contar() { this.uso().c++; DX.store.save(); },

    /* ---------- mensagens ---------- */
    diz(html, chips, leis) { this.c.ts = Date.now(); this.msgs.push({ de: 't', html, chips: chips || [], leis: leis || [] }); },
    usuario(txt, anexo) {
      const c = this.c;
      if (c.titulo === 'Nova conversa' && txt) c.titulo = txt.slice(0, 42);
      c.msgs.push({ de: 'u', html: esc(txt), anexo: anexo || null });
    },

    /* anexos: foto ou documento. Sem IA conectada, a Trixie guarda mas não lê. */
    anexar(tipo, anexo) {
      const u = this.uso(), p = DX.plano(), chave = tipo === 'foto' ? 'f' : 'k', limite = tipo === 'foto' ? p.fotos : p.docs;
      const ult = this.msgs[this.msgs.length - 1], chips = ult && ult.de === 't' ? ult.chips : [];
      if (u[chave] >= limite) {
        this.diz(`Você já enviou ${limite} ${tipo === 'foto' ? 'fotos' : 'documentos'} hoje, que é o limite do plano ${p.nome}.${p.nome === 'Gratuito' ? ' No Premium o limite é maior.' : ''}`,
          p.nome === 'Gratuito' ? [{ t: 'Ver planos', nav: true, pri: true, f: () => DX.ui.go('planos') }, ...chips] : chips);
        return false;
      }
      u[chave]++; DX.store.save();
      if (this.c.titulo === 'Nova conversa') this.c.titulo = anexo.nome.slice(0, 42);
      this.usuario('', anexo);
      this.diz(`Recebi ${tipo === 'foto' ? 'sua foto' : 'seu documento'} <b>${esc(anexo.nome)}</b> e guardei nesta conversa, só neste aparelho.<p>Ainda não consigo ler o conteúdo: a leitura de arquivos depende da integração com IA, que este protótipo não tem. Use o anexo como referência ao preparar sua solicitação.</p>`, chips);
      return true;
    },

    abrir(modo, dirId, leiId) {
      this.nova(modo); this.ctx = dirId || null;
      const d = dirId && DX.direito(dirId);
      if (modo === 'contexto' && d) {
        this.c.titulo = d.titulo;
        if (leiId && DX.LEIS[leiId]) {
          const l = DX.LEIS[leiId];
          this.diz(`Você quer entender <b>${l.rotulo}</b>. Em palavras simples: ${l.simples}`, [], [leiId]);
        }
        if (d.id === 'arrependimento') return this.fluxoArrependimento(true);
        this.diz(`Você está vendo <b>${d.titulo}</b>. ${d.resumo} O que você quer saber?`, this.seguir(d));
      } else if (modo === 'rapido') {
        this.problemaAgora();
      } else {
        this.diz('Oi! Eu sou a Trixie. Explico direitos do consumidor em ' + DX.CATEGORIAS.map(c => c.curto || c.titulo).join(', ').replace(/, ([^,]*)$/, ' e $1') + '. Escolha um tema ou escreva sua dúvida.',
          [...this.chipsCategorias(), { t: 'Tenho um problema agora', f: () => { this.modo = 'rapido'; this.problemaAgora(); } }]);
      }
    },
    problemaAgora() {
      this.diz('Vamos resolver. Conte em poucas palavras o que aconteceu, ou toque em uma situação.', [
        ...['cancelamento-voo', 'atraso-voo', 'extravio-bagagem', 'defeito', 'cobranca-indevida-compras'].map(id => this.chipTema(DX.direito(id), true)),
        { t: 'Quero devolver uma compra', f: () => this.tema(DX.direito('arrependimento'), true) },
        { t: 'Outro assunto', f: () => this.menuCategorias() }
      ]);
    },

    /* ---------- navegação por temas ---------- */
    chipsCategorias() { return DX.CATEGORIAS.map(c => ({ t: c.curto || c.titulo, f: () => this.situacoes(c) })); },
    menuCategorias() { this.diz('Sobre qual tema é a sua dúvida?', this.chipsCategorias()); },
    situacoes(c) { this.diz(`Em <b>${c.curto || c.titulo}</b>, qual destas situações é a sua?`, DX.daCategoria(c.id).map(d => this.chipTema(d))); },
    chipTema(d, rapido) { return { t: d.titulo, f: () => this.tema(d, rapido) }; },

    tema(d, rapido) {
      this.ctx = d.id; this.c.titulo = d.titulo;
      if (d.id === 'arrependimento') return this.fluxoArrependimento(false);
      this.caso = { dir: d.id, resumo: d.titulo + '. ' + d.resumo };
      const aviso = d.status !== 'verificado' ? `<p class="aviso-msg"><b>Conteúdo pendente de revisão.</b> Trate como orientação preliminar e confira a fonte oficial.</p>` : '';
      const intro = rapido ? `Entendi: o assunto é <b>${d.titulo}</b>.` : `<b>${d.titulo}</b>`;
      this.diz(`${intro}${aviso}<p>${d.explicacao}</p><p><b>Por onde começar:</b></p>${lista(d.passos.slice(0, 3))}`, this.seguir(d), d.leis);
    },

    /* perguntas de continuação, sempre a partir da base */
    seguir(d, usados) {
      usados = usados || [];
      const c = [{ t: 'Ver meu próximo passo', nav: true, pri: true, f: () => DX.ui.go('passo', { id: d.id }) }];
      const add = (chave, t, f) => { if (!usados.includes(chave)) c.push({ t, f: () => f([...usados, chave]) }); };
      add('cond', 'Quando se aplica?', u => this.diz(`<b>${d.titulo}</b> se aplica quando:${lista(d.condicoes)}`, this.seguir(d, u), d.leis));
      add('exc', 'Há exceções?', u => this.diz(`Pontos de atenção:${lista(d.excecoes)}`, this.seguir(d, u)));
      d.faq.forEach((f, i) => add('faq' + i, f[0], u => this.diz(f[1], this.seguir(d, u), d.leis)));
      c.push({ t: 'Outro assunto', f: () => this.menuCategorias() });
      return c;
    },

    /* ---------- FLUXO OBRIGATÓRIO: direito de arrependimento ---------- */
    fluxoArrependimento(contexto) {
      const d = DX.direito('arrependimento'); this.ctx = d.id; this.c.titulo = d.titulo;
      const r = {};
      const fim = (html, resumo) => {
        this.caso = { dir: d.id, resumo };
        this.diz(html, [
          { t: 'Ver meu próximo passo', nav: true, pri: true, f: () => DX.ui.go('passo', { id: d.id }) },
          { t: 'Continuar conversando', f: () => this.diz('Claro! Escolha uma dúvida ou escreva sua pergunta.', this.seguir(d).slice(1)) }
        ], d.leis);
      };
      const p3 = () => this.diz('<b>3 de 3.</b> Quando recebeu ou contratou?', [
        { t: 'Há até sete dias', f: () => fim(`<p>Pelas suas respostas, o direito de arrependimento <b>pode se aplicar</b> ao seu caso.</p><p>Em compras feitas fora do estabelecimento, você pode desistir em até 7 dias do recebimento ou da assinatura do contrato, sem precisar explicar o motivo. Os valores pagos devem ser devolvidos de imediato, com atualização monetária.</p><p>${r.onde === 'internet' ? 'Na internet, a loja deve aceitar a desistência pelo mesmo canal da compra e confirmar o recebimento do pedido.' : 'Comunique a desistência por escrito e guarde o comprovante.'}</p>`, `Compra ${r.ondeTxt}, ${r.recTxt}, há até sete dias. O direito de arrependimento pode se aplicar.`) },
        { t: 'Há mais de sete dias', f: () => fim(`<p>Pelas suas respostas, o prazo de 7 dias do art. 49 já teria passado. Nesse caso, o direito de arrependimento, em regra, <b>não se aplica mais</b>.</p><p>Outros direitos podem existir, dependendo da situação: produto com defeito, produto diferente do anunciado ou a política de devolução da própria loja.</p>`, `Compra ${r.ondeTxt}, ${r.recTxt}, há mais de sete dias. O prazo do art. 49 teria passado; outros direitos podem existir.`) },
        { t: 'Não lembro', f: () => fim(`<p>Sem a data, não dá para saber se o prazo de 7 dias ainda vale.</p><p>Confira a data de recebimento na nota fiscal, no rastreamento ou no e-mail de confirmação. Se estiver dentro de 7 dias, comunique a desistência por escrito o quanto antes.</p>`, `Compra ${r.ondeTxt}, ${r.recTxt}, data a confirmar. É preciso conferir se o prazo de 7 dias ainda vale.`) }
      ]);
      const p2 = () => this.diz('<b>2 de 3.</b> Você já recebeu o produto?', [
        { t: 'Sim', f: () => { r.recTxt = 'produto recebido'; p3(); } },
        { t: 'Não', f: () => fim(`<p>Pelas suas respostas, o direito de arrependimento <b>pode se aplicar</b> ao seu caso.</p><p>O prazo de 7 dias conta do recebimento do produto ou da assinatura do contrato. Como você ainda não recebeu, já pode comunicar a desistência. Os valores pagos devem ser devolvidos de imediato, com atualização monetária.</p>`, `Compra ${r.ondeTxt}, produto ainda não recebido. O direito de arrependimento pode se aplicar.`) },
        { t: 'Minha situação é diferente', f: () => { r.recTxt = 'situação específica (serviço ou pedido em andamento)'; this.diz('Sem problema. Em serviços ou pedidos em andamento, o prazo conta da assinatura do contrato ou do recebimento.'); p3(); } }
      ]);
      this.diz(`${contexto ? 'Você está vendo <b>Direito de arrependimento</b>. ' : ''}Vou fazer até 3 perguntas rápidas para entender o seu caso.<br><b>1 de 3.</b> Onde você realizou a compra?`, [
        { t: 'Pela internet', f: () => { r.onde = 'internet'; r.ondeTxt = 'pela internet'; p2(); } },
        { t: 'Por telefone', f: () => { r.onde = 'telefone'; r.ondeTxt = 'por telefone'; p2(); } },
        { t: 'Em loja física', f: () => {
          this.caso = { dir: 'troca-produtos', resumo: 'Compra em loja física. O direito de arrependimento do art. 49 não se aplica automaticamente; valem a política de troca da loja e as regras de produto com defeito.' };
          this.diz(`<p>Em compras feitas presencialmente, o direito de arrependimento do art. 49 do CDC, em regra, <b>não se aplica automaticamente</b>: ele trata de compras fora do estabelecimento comercial.</p><p>Você ainda pode ter opções:</p>${lista(['Se a loja prometeu troca ou devolução, essa oferta deve ser cumprida.', 'Se o produto tem defeito, valem as regras de produtos com defeito.'])}`, [
            { t: 'Ver meu próximo passo', nav: true, pri: true, f: () => DX.ui.go('passo', { id: 'troca-produtos' }) },
            { t: 'Troca de produtos', f: () => this.tema(DX.direito('troca-produtos')) },
            { t: 'Produtos com defeito', f: () => this.tema(DX.direito('defeito')) },
            { t: 'Continuar conversando', f: () => this.diz('Claro! Escolha uma dúvida ou escreva sua pergunta.', this.seguir(d).slice(1)) }
          ], ['cdc49', 'cdc30', 'cdc18']);
        } }
      ]);
    },

    /* ---------- texto livre ---------- */
    texto(txt) {
      const q = DX.norm(txt).trim();
      if (/^(oi|ola|bom dia|boa tarde|boa noite|e ai|hey)\b/.test(q) && q.length < 20) return this.diz('Oi! Sobre qual tema é a sua dúvida?', this.chipsCategorias());
      if (/obrigad|valeu/.test(q) && q.length < 30) return this.diz('De nada! Se precisar, é só chamar.', this.chipsCategorias());
      const achados = DX.IA.recuperar(txt);
      if (!achados.length) {
        return this.diz('Essa consulta ainda não está disponível. Neste protótipo eu respondo por fluxos guiados, com conteúdo cadastrado sobre Aeroportos, Restaurantes e Compras. Não há IA generativa conectada, então não consigo interpretar perguntas livres fora desses temas.', this.chipsCategorias());
      }
      const melhor = achados[0];
      const empate = achados.filter(a => a.p === melhor.p);
      if (empate.length === 1) return this.tema(melhor.d, this.modo === 'rapido');
      this.diz('Encontrei mais de um assunto parecido. Qual deles é o seu?', [...empate.slice(0, 4).map(a => this.chipTema(a.d, this.modo === 'rapido')), { t: 'Nenhum destes', f: () => this.menuCategorias() }]);
    }
  };
})(window.DX);
