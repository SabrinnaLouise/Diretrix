/* ============================================================
   DIRETRIX · Módulo 5 · INTEGRAÇÃO FUTURA COM IA
   Hoje NÃO há IA generativa conectada. A Trixie funciona como
   assistente guiado, com respostas condicionais vindas da base
   jurídica (js/base-juridica.js).

   Como ligar uma IA depois (ex.: Gemini):
   1. Criar um backend próprio (ex.: POST /api/trixie) que guarda a
      chave da API. A chave NUNCA entra neste código, que roda no
      navegador.
   2. O backend recebe { pergunta, trechos } e devolve { resposta,
      fontes }. Os "trechos" saem de DX.IA.recuperar(), que já faz a
      etapa de recuperação (RAG) usando somente conteúdo verificado.
   3. Trocar `configurada` para true e implementar `responder`.
   ============================================================ */
(function (DX) {
  DX.IA = {
    configurada: false,
    provedor: null,
    endpoint: null, // ex.: '/api/trixie' (backend próprio)

    /* Recuperação: encontra os direitos cadastrados que combinam com a
       pergunta. Cada tag pode exigir vários termos juntos ("voo+cancel"). */
    recuperar(pergunta) {
      const q = DX.norm(pergunta);
      return DX.DIREITOS.map(d => {
        let p = 0;
        d.tags.forEach(tag => {
          const partes = tag.split('+');
          if (partes.every(t => q.includes(t))) p += partes.length;
        });
        if (q.includes(DX.norm(d.titulo))) p += 3;
        return { d, p };
      }).filter(r => r.p > 0).sort((a, b) => b.p - a.p);
    },

    /* Ponto de extensão. Sem backend configurado, recusa de forma explícita:
       o app nunca finge ter IA generativa. */
    async responder(pergunta) {
      if (!this.configurada || !this.endpoint) {
        throw new Error('IA generativa não configurada neste protótipo.');
      }
      const trechos = this.recuperar(pergunta).filter(r => r.d.status === 'verificado').slice(0, 3)
        .map(r => ({ id: r.d.id, titulo: r.d.titulo, texto: r.d.explicacao, leis: r.d.leis }));
      const resp = await fetch(this.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pergunta, trechos }) });
      return resp.json();
    }
  };
})(window.DX);
