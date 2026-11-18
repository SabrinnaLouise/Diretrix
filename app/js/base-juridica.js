/* ============================================================
   DIRETRIX · Módulo 3 · BASE JURÍDICA
   Fonte única de dados: a Biblioteca, a Trixie e o "Meu próximo
   passo" leem daqui. Para adicionar uma categoria, inclua um item
   em CATEGORIAS e os registros correspondentes em DIREITOS.

   Estados de verificação:
     verificado    -> conferido com a fonte oficial na data de revisão
     pendente      -> aguardando conferência; nunca é exibido como confirmado
     desatualizado -> norma mudou; conteúdo precisa ser refeito
   ============================================================ */
window.DX = window.DX || {};
(function (DX) {
  DX.REVISAO = '16/11/2026';

  /* Planos: limites configuráveis em um só lugar */
  DX.PLANOS = {
    gratuito: { nome: 'Gratuito', msgs: 20, fotos: 2, docs: 2, historico: 5 },
    premium: { nome: 'Premium', msgs: 200, fotos: 20, docs: 20, historico: 50 }
  };

  /* Dados exibidos no carrossel da tela inicial */
  DX.DADOS = {
    pesquisa: { fonte: 'Pesquisa Diretrix', respostas: 55, pergunta: 'Você já passou por uma situação em que não sabia quais eram seus direitos?', sim: 80, nao: 12.7, talvez: 7.3 },
    cgov: { fonte: 'Boletim Consumidor.gov.br 2025 · Senacon/MJSP', url: 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/defesadoconsumidor/Biblioteca/boletins-1/boletim-consumidor-gov-br-2025-vfinal.pdf', finalizadas: '2.328.863', solucao: '81,43%', prazo: '6 dias', cadastrados: '8,6 milhões' }
  };

  /* ---------- Fontes oficiais ---------- */
  DX.FONTES = {
    cdc: { nome: 'Código de Defesa do Consumidor (Lei nº 8.078/1990)', curto: 'CDC', orgao: 'Presidência da República · Planalto', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm' },
    dec: { nome: 'Decreto nº 7.962/2013 (comércio eletrônico)', curto: 'Decreto 7.962/2013', orgao: 'Presidência da República · Planalto', url: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm' },
    anac: { nome: 'Resolução ANAC nº 400/2016 (Condições Gerais de Transporte Aéreo)', curto: 'Res. ANAC 400/2016', orgao: 'ANAC · página oficial para passageiros', url: 'https://www.gov.br/anac/pt-br/assuntos/passageiros' }
  };

  /* ---------- Canais oficiais ---------- */
  DX.CANAIS = {
    cgov: { nome: 'Consumidor.gov.br', desc: 'Plataforma pública para registrar reclamação diretamente com a empresa cadastrada.', url: 'https://www.consumidor.gov.br/' },
    anac: { nome: 'ANAC · Passageiros', desc: 'Orientações oficiais sobre transporte aéreo. A ANAC acompanha as reclamações registradas no Consumidor.gov.br.', url: 'https://www.gov.br/anac/pt-br/assuntos/passageiros' },
    procon: { nome: 'Procon do seu estado ou município', desc: 'Cada Procon tem site e canais próprios. Procure o site oficial do Procon da sua região.', url: null }
  };

  /* ---------- Contatos de empresas ----------
     Somente contatos oficiais verificados entram aqui.
     Formato: { nome, site, sac, verificadoEm }
     O protótipo começa vazio de propósito: nada é inventado. */
  DX.EMPRESAS = [];

  /* ---------- Normas e artigos ---------- */
  DX.LEIS = {
    cdc6: { fonte: 'cdc', rotulo: 'CDC, art. 6º, III', artigo: 'Art. 6º, inciso III', simples: 'Você tem direito a informação adequada e clara sobre produtos e serviços, incluindo preço, características e riscos.' },
    cdc18: { fonte: 'cdc', rotulo: 'CDC, art. 18', artigo: 'Art. 18, caput, §1º e §3º', simples: 'Se o produto tem defeito, o fornecedor tem até 30 dias para consertar. Se não resolver, você escolhe: troca por outro igual, devolução do valor pago com atualização, ou desconto proporcional. Em produto essencial, a escolha pode ser imediata.' },
    cdc20: { fonte: 'cdc', rotulo: 'CDC, art. 20', artigo: 'Art. 20', simples: 'Se o serviço foi mal prestado, você pode escolher: que seja refeito sem custo, a devolução do valor pago, ou um desconto proporcional.' },
    cdc26: { fonte: 'cdc', rotulo: 'CDC, art. 26', artigo: 'Art. 26', simples: 'Prazo para reclamar de defeitos aparentes: 30 dias para produtos e serviços não duráveis e 90 dias para duráveis, contados da entrega. No defeito oculto, o prazo começa quando ele aparece.' },
    cdc30: { fonte: 'cdc', rotulo: 'CDC, art. 30', artigo: 'Art. 30', simples: 'Tudo o que a empresa anuncia ou promete de forma precisa passa a fazer parte do contrato e deve ser cumprido.' },
    cdc31: { fonte: 'cdc', rotulo: 'CDC, art. 31', artigo: 'Art. 31', simples: 'A oferta precisa trazer informações corretas, claras e visíveis, em português, sobre características, quantidade, preço e demais dados do produto ou serviço.' },
    cdc35: { fonte: 'cdc', rotulo: 'CDC, art. 35', artigo: 'Art. 35', simples: 'Se a empresa não cumpre o que ofertou, você escolhe: exigir o cumprimento, aceitar outro produto ou serviço equivalente, ou cancelar e receber de volta o que pagou, com atualização.' },
    cdc39i: { fonte: 'cdc', rotulo: 'CDC, art. 39, I', artigo: 'Art. 39, inciso I', simples: 'A empresa não pode condicionar a venda de um produto à compra de outro, nem impor, sem justa causa, quantidade mínima ou máxima.' },
    cdc39iii: { fonte: 'cdc', rotulo: 'CDC, art. 39, III', artigo: 'Art. 39, inciso III e parágrafo único', simples: 'Entregar produto ou serviço que você não pediu é prática abusiva. O que chega sem solicitação é tratado como amostra grátis.' },
    cdc39v: { fonte: 'cdc', rotulo: 'CDC, art. 39, V', artigo: 'Art. 39, inciso V', simples: 'A empresa não pode exigir do consumidor vantagem manifestamente excessiva.' },
    cdc42: { fonte: 'cdc', rotulo: 'CDC, art. 42, parágrafo único', artigo: 'Art. 42, parágrafo único', simples: 'Quem paga uma cobrança indevida tem direito a receber em dobro o valor pago a mais, com correção e juros, salvo engano justificável da empresa.' },
    cdc49: { fonte: 'cdc', rotulo: 'CDC, art. 49', artigo: 'Art. 49, caput e parágrafo único', simples: 'Em compras feitas fora da loja (internet, telefone, em casa), você pode desistir em até 7 dias, contados da assinatura do contrato ou do recebimento. Os valores pagos são devolvidos de imediato, com atualização.' },
    dec5: { fonte: 'dec', rotulo: 'Decreto 7.962/2013, art. 5º', artigo: 'Art. 5º', simples: 'Na internet, a loja deve informar claramente como desistir, aceitar o pedido pelo mesmo canal da compra, confirmar na hora que recebeu a desistência e avisar a administradora do cartão para que a cobrança não seja lançada ou seja estornada.' },
    anac11: { fonte: 'anac', rotulo: 'Res. ANAC 400, art. 11', artigo: 'Art. 11', simples: 'Você pode desistir da passagem sem custo em até 24 horas depois de receber o comprovante, desde que a compra tenha sido feita com 7 dias ou mais de antecedência do embarque.' },
    anac12: { fonte: 'anac', rotulo: 'Res. ANAC 400, art. 12', artigo: 'Art. 12', simples: 'Mudanças programadas pela companhia devem ser avisadas com pelo menos 72 horas de antecedência. Se o horário mudar mais de 30 minutos (voo doméstico) ou 1 hora (internacional) e você não concordar, pode pedir reacomodação ou reembolso integral.' },
    anac21: { fonte: 'anac', rotulo: 'Res. ANAC 400, art. 21', artigo: 'Art. 21', simples: 'Em atraso superior a 4 horas, cancelamento, interrupção do serviço ou embarque negado, a companhia deve oferecer reacomodação, reembolso ou transporte por outro meio. Quem escolhe é o passageiro.' },
    anac24: { fonte: 'anac', rotulo: 'Res. ANAC 400, arts. 23 e 24', artigo: 'Arts. 23 e 24', simples: 'Antes de negar embarque, a companhia deve procurar voluntários. Se mesmo assim você for impedido de embarcar, ela deve pagar de imediato uma compensação de 250 DES (voo doméstico) ou 500 DES (internacional). DES é uma unidade de referência internacional convertida em reais.' },
    anac27: { fonte: 'anac', rotulo: 'Res. ANAC 400, arts. 26 e 27', artigo: 'Arts. 26 e 27', simples: 'Assistência material gratuita conforme o tempo de espera: alimentação a partir de 2 horas e, a partir de 4 horas, hospedagem quando houver pernoite, com transporte de ida e volta. Redação alterada pela Resolução nº 813/2026.' },
    anac29: { fonte: 'anac', rotulo: 'Res. ANAC 400, art. 29', artigo: 'Art. 29', simples: 'O reembolso da passagem deve ser feito em até 7 dias, contados do pedido do passageiro.' },
    anac32: { fonte: 'anac', rotulo: 'Res. ANAC 400, art. 32', artigo: 'Art. 32', simples: 'Bagagem extraviada: registre o protesto na hora. A companhia tem 7 dias (voo doméstico) ou 21 dias (internacional) para devolver; depois disso, deve indenizar em até 7 dias. Bagagem danificada ou violada: você tem 7 dias após receber para reclamar, e a companhia tem 7 dias para reparar, substituir ou indenizar.' },
    anac33: { fonte: 'anac', rotulo: 'Res. ANAC 400, art. 33', artigo: 'Art. 33', simples: 'Se a bagagem for extraviada e você estiver fora da sua cidade, a companhia deve ressarcir despesas necessárias, mediante comprovantes.' }
  };

  /* ---------- Categorias ---------- */
  DX.CATEGORIAS = [
    { id: 'aeroportos', titulo: 'Aeroportos', icone: 'aviao', desc: 'Atrasos, cancelamentos, bagagem e passagens aéreas.', orgao: 'ANAC', abrangencia: 'Nacional. Vale para voos regulares; voos fretados seguem o contrato com a agência.' },
    { id: 'restaurantes', titulo: 'Restaurantes', icone: 'talheres', desc: 'Taxas, couvert, comanda e cobranças em bares e restaurantes.', orgao: 'Procons e Senacon', abrangencia: 'CDC vale em todo o país. Estados e municípios podem ter leis próprias sobre taxas e couvert.' },
    { id: 'compras', titulo: 'Compras on-line e presenciais', curto: 'Compras', icone: 'sacola', desc: 'Arrependimento, trocas, defeitos, entregas e cobranças.', orgao: 'Procons e Senacon', abrangencia: 'Nacional. Algumas regras mudam entre compra presencial e compra a distância.' }
  ];

  const AER = ['cgov', 'anac', 'procon'], GER = ['cgov', 'procon'];
  const notaAnac = 'A Resolução nº 400 foi alterada pela Resolução nº 813/2026, em vigor desde 26/10/2026. A oferta de meios de comunicação após 1 hora de espera deixou de constar, e novas regras de aviso ao passageiro passam a valer em 25/11/2026. Este conteúdo aguarda conferência com o texto consolidado publicado pela ANAC.';
  const notaLocal = 'Este resumo se baseia no CDC e em orientações públicas de Procons. Estados e municípios podem ter leis próprias sobre o tema. Confira a regra da sua região antes de tratar a informação como confirmada.';

  /* ---------- Direitos ---------- */
  DX.DIREITOS = [
    /* ===== AEROPORTOS ===== */
    {
      id: 'atraso-voo', cat: 'aeroportos', titulo: 'Atraso de voo', status: 'pendente', nota: notaAnac,
      resumo: 'A companhia deve informar, dar assistência conforme o tempo de espera e, acima de 4 horas, oferecer alternativas.',
      explicacao: 'Quando o voo atrasa, a companhia aérea deve manter você informado e oferecer assistência material gratuita de acordo com o tempo de espera: alimentação a partir de 2 horas e, a partir de 4 horas, hospedagem quando houver pernoite, com transporte de ida e volta. Se o atraso passar de 4 horas, você pode escolher entre reacomodação em outro voo, reembolso integral ou transporte por outro meio.',
      condicoes: ['Vale para voos regulares, domésticos e internacionais, com assistência prestada em território nacional.', 'A assistência material é devida mesmo quando o atraso tem causa externa, como mau tempo.', 'Em atraso superior a 4 horas, a escolha entre reacomodação, reembolso ou outro transporte é do passageiro.'],
      excecoes: ['Quem mora na cidade do aeroporto de origem pode não receber hotel; nesse caso a companhia custeia o transporte entre casa e aeroporto.', 'Voos fretados seguem o contrato com a agência de turismo.', 'Receber assistência não significa que haverá indenização. Isso depende de análise de cada caso.'],
      leis: ['anac27', 'anac21'],
      faq: [['O atraso foi por mau tempo. Tenho assistência?', 'Sim. Alimentação, hospedagem e transporte continuam devidos mesmo quando a causa está fora do controle da companhia.'], ['Tenho direito a indenização?', 'O Diretrix não garante indenizações. A assistência e as alternativas previstas na norma são devidas; outros valores dependem de análise do caso por um profissional habilitado.']],
      passos: ['Procurar o atendimento da companhia aérea.', 'Pedir a previsão atualizada de partida e as alternativas disponíveis.', 'Solicitar a assistência material conforme o tempo de espera.', 'Anotar o protocolo de atendimento.', 'Guardar cartão de embarque, mensagens e comprovantes de gastos.', 'Consultar canais oficiais de reclamação se não houver solução.'],
      solucao: 'assistência material e uma alternativa de reacomodação ou reembolso', canais: AER,
      tags: ['voo+atras', 'aviao+atras', 'voo+demor', 'atraso de voo', 'voo+esperando']
    },
    {
      id: 'cancelamento-voo', cat: 'aeroportos', titulo: 'Cancelamento de voo', status: 'pendente', nota: notaAnac,
      resumo: 'No cancelamento, você escolhe entre reacomodação, reembolso integral ou outro meio de transporte.',
      explicacao: 'Se a companhia cancela o voo, ela deve oferecer, para sua escolha, reacomodação em outro voo (próprio ou de outra empresa), reembolso integral ou transporte por outro meio. Enquanto você espera no aeroporto, também vale a assistência material: alimentação a partir de 2 horas e hospedagem a partir de 4 horas quando houver pernoite.',
      condicoes: ['A escolha entre as alternativas é do passageiro.', 'O reembolso deve ser feito em até 7 dias após o pedido.', 'Mudanças programadas devem ser avisadas com pelo menos 72 horas de antecedência.'],
      excecoes: ['Voos fretados seguem o contrato com a agência de turismo.', 'Em compras por agência pagas a ela, o reembolso pode ser feito à agência, que repassa o valor conforme o contrato.', 'Indenizações além do previsto na norma dependem de análise de cada caso.'],
      leis: ['anac21', 'anac27', 'anac12', 'anac29'],
      faq: [['Posso pedir reembolso em vez de outro voo?', 'Sim. No cancelamento, a escolha entre reacomodação, reembolso integral ou outro transporte é sua.'], ['Em quanto tempo recebo o reembolso?', 'A norma prevê até 7 dias contados do seu pedido.']],
      passos: ['Procurar o atendimento da companhia aérea.', 'Solicitar informações sobre as opções disponíveis.', 'Escolher entre reacomodação, reembolso ou outro transporte.', 'Anotar o protocolo de atendimento.', 'Guardar comprovantes e mensagens.', 'Consultar canais oficiais de reclamação quando necessário.'],
      solucao: 'reacomodação em outro voo ou reembolso integral, conforme minha escolha', canais: AER,
      tags: ['voo+cancel', 'aviao+cancel', 'cancelaram+passagem', 'cancelamento de voo']
    },
    {
      id: 'extravio-bagagem', cat: 'aeroportos', titulo: 'Extravio de bagagem', status: 'verificado',
      resumo: 'Registre o extravio ainda no aeroporto. A companhia tem prazo para devolver ou indenizar.',
      explicacao: 'Se a mala despachada não chegar, registre o protesto com a companhia imediatamente, ainda na área de desembarque. A partir daí, ela tem até 7 dias (voo doméstico) ou 21 dias (voo internacional) para devolver a bagagem no local que você indicar. Se não localizar nesse prazo, deve indenizar em até 7 dias.',
      condicoes: ['O protesto deve ser feito de imediato, junto à companhia aérea.', 'Guarde o comprovante de despacho da bagagem e o registro do protesto.', 'Se você estiver fora da sua cidade, despesas necessárias podem ser ressarcidas mediante comprovantes.'],
      excecoes: ['Sair do aeroporto sem registrar o protesto dificulta a comprovação do extravio.', 'O valor da indenização tem limites previstos em norma e, em voos internacionais, em tratados.'],
      leis: ['anac32', 'anac33'],
      faq: [['Estou viajando e fiquei sem roupas. E agora?', 'Fora da sua cidade, a norma prevê ressarcimento de despesas necessárias. Guarde as notas fiscais e apresente à companhia.'], ['E se a mala não aparecer?', 'Passado o prazo de 7 dias (doméstico) ou 21 dias (internacional), a companhia deve indenizar em até 7 dias.']],
      passos: ['Registrar o protesto no balcão da companhia antes de sair do desembarque.', 'Guardar o comprovante de despacho e o número do registro.', 'Informar o endereço para devolução da bagagem.', 'Guardar notas fiscais de despesas necessárias, se estiver fora de casa.', 'Acompanhar o prazo de devolução.', 'Consultar canais oficiais de reclamação se o prazo vencer sem solução.'],
      solucao: 'a localização e devolução da bagagem ou a indenização prevista', canais: AER,
      tags: ['bagagem+extrav', 'mala+extrav', 'mala+sumi', 'mala+perd', 'bagagem+perd', 'mala+nao chegou', 'bagagem+nao chegou', 'bagagem+sumi']
    },
    {
      id: 'bagagem-danificada', cat: 'aeroportos', titulo: 'Bagagem danificada', status: 'verificado',
      resumo: 'Você tem até 7 dias após receber a mala para reclamar de dano ou violação.',
      explicacao: 'Se a bagagem chegou danificada ou com sinais de violação, faça o protesto junto à companhia em até 7 dias após o recebimento. O ideal é registrar ainda no aeroporto. Depois do protesto, a companhia tem 7 dias para reparar o dano, substituir a mala por outra equivalente ou, em caso de violação, indenizar.',
      condicoes: ['O protesto deve ser feito em até 7 dias do recebimento da bagagem.', 'Registre fotos do dano e guarde o comprovante de despacho.'],
      excecoes: ['Receber a bagagem sem protestar gera a presunção de que ela foi entregue em bom estado.'],
      leis: ['anac32'],
      faq: [['Só percebi o dano em casa. Ainda posso reclamar?', 'Sim, desde que o protesto seja feito em até 7 dias após o recebimento da bagagem.']],
      passos: ['Fotografar a bagagem e o dano.', 'Registrar o protesto com a companhia, de preferência ainda no aeroporto.', 'Guardar o comprovante de despacho e o número do registro.', 'Acompanhar o prazo de 7 dias para a solução.', 'Consultar canais oficiais de reclamação se não houver resposta.'],
      solucao: 'o reparo, a substituição da bagagem ou a indenização prevista', canais: AER,
      tags: ['mala+quebr', 'mala+danific', 'bagagem+danific', 'mala+rasg', 'bagagem+violad', 'mala+violad', 'mala+avari', 'bagagem+avari', 'bagagem+quebr']
    },
    {
      id: 'embarque-negado', cat: 'aeroportos', titulo: 'Embarque negado', status: 'verificado',
      resumo: 'Se a companhia impedir seu embarque, deve pagar compensação imediata e oferecer alternativas.',
      explicacao: 'Quando há mais passageiros do que assentos, a companhia deve primeiro procurar voluntários para embarcar em outro voo, mediante compensação negociada. Se você for impedido de embarcar sem ter se voluntariado (preterição), ela deve pagar de imediato 250 DES em voo doméstico ou 500 DES em voo internacional, além de oferecer reacomodação, reembolso ou outro transporte, e assistência material.',
      condicoes: ['Você se apresentou para o embarque no horário e com a documentação exigida.', 'A compensação pode ser paga por transferência, voucher ou em dinheiro.'],
      excecoes: ['Quem aceita ser voluntário recebe a compensação combinada, e não a de preterição.', 'Não é preterição quando o embarque é recusado por atraso do passageiro ou falta de documento.'],
      leis: ['anac24', 'anac21'],
      faq: [['O que é DES?', 'Direito Especial de Saque, uma unidade de referência internacional. O valor em reais varia conforme a cotação do dia.']],
      passos: ['Pedir à companhia a confirmação por escrito do embarque negado.', 'Solicitar a compensação financeira imediata.', 'Escolher entre reacomodação, reembolso ou outro transporte.', 'Anotar o protocolo de atendimento.', 'Guardar cartão de embarque e comprovantes.', 'Consultar canais oficiais de reclamação quando necessário.'],
      solucao: 'a compensação financeira prevista e a reacomodação ou o reembolso', canais: AER,
      tags: ['overbooking', 'embarque+negad', 'nao+embarcar', 'preteri', 'impedi+embarc', 'barrad+embarque', 'nao me deixaram embarcar']
    },
    {
      id: 'reembolso-alteracao', cat: 'aeroportos', titulo: 'Reembolso e alteração de passagem', status: 'verificado',
      resumo: 'Há desistência sem custo em 24 horas e regras para quando a companhia muda o voo.',
      explicacao: 'Você pode desistir da passagem sem custo em até 24 horas depois de receber o comprovante, desde que a compra tenha sido feita com pelo menos 7 dias de antecedência do embarque. Se a companhia alterar o voo, deve avisar com 72 horas de antecedência; mudanças maiores que 30 minutos (doméstico) ou 1 hora (internacional) dão direito a reacomodação ou reembolso integral. O reembolso deve ser pago em até 7 dias após o pedido.',
      condicoes: ['Desistência sem custo: até 24 horas do comprovante e compra feita 7 dias ou mais antes do voo.', 'Alteração pela companhia: aviso com 72 horas de antecedência.', 'Reembolso: até 7 dias contados do pedido.'],
      excecoes: ['Fora dessas hipóteses, o cancelamento por vontade do passageiro segue as regras da tarifa contratada, que podem prever multas.', 'Em compras por agência pagas a ela, o reembolso pode ser feito à agência.'],
      leis: ['anac11', 'anac12', 'anac29'],
      faq: [['E o prazo de 7 dias do CDC para compras pela internet?', 'A aplicação do art. 49 do CDC a passagens aéreas é discutida nos tribunais. O Diretrix ainda não tem conteúdo verificado sobre isso.'], ['Comprei a passagem para daqui a 3 dias. Posso desistir sem custo?', 'A regra de 24 horas só vale para compras feitas com 7 dias ou mais de antecedência do embarque. Fora disso, valem as regras da tarifa.']],
      passos: ['Conferir a data da compra e a data do voo.', 'Pedir a desistência, alteração ou reembolso pelo canal oficial da companhia.', 'Anotar o protocolo de atendimento.', 'Guardar o comprovante da compra e as mensagens.', 'Acompanhar o prazo de 7 dias para o reembolso.', 'Consultar canais oficiais de reclamação quando necessário.'],
      solucao: 'o reembolso do valor pago, no prazo previsto', canais: AER,
      tags: ['reembolso+passagem', 'remarca', 'alterar+passagem', 'desistir+passagem', 'alteraram+voo', 'mudaram+voo', 'cancelar+passagem', 'trocar+passagem']
    },

    /* ===== RESTAURANTES ===== */
    {
      id: 'taxa-servico', cat: 'restaurantes', titulo: 'Taxa de serviço', status: 'pendente', nota: notaLocal,
      resumo: 'Os 10% são uma gorjeta sugerida. Procons orientam que o pagamento é opcional.',
      explicacao: 'A taxa de serviço, conhecida como os 10%, é uma gorjeta sugerida pelo estabelecimento. Procons orientam que o pagamento é opcional e que o restaurante deve informar isso de forma clara, por exemplo no cardápio ou na conta. Você pode pagar, pagar outro valor ou pedir que seja retirada.',
      condicoes: ['A taxa deve aparecer discriminada na conta e ser informada previamente.', 'A decisão de pagar é do consumidor.'],
      excecoes: ['Leis estaduais ou municipais podem tratar do tema de forma específica.', 'Procons orientam que a taxa não incida sobre o couvert artístico.'],
      leis: ['cdc6', 'cdc39v'],
      faq: [['Posso pedir para tirar os 10% da conta?', 'Segundo orientações de Procons, sim: o pagamento é opcional. Confira se há regra específica na sua região.']],
      passos: ['Conferir se a taxa aparece discriminada na conta.', 'Pedir, com educação, a retirada da taxa se não quiser pagar.', 'Guardar a nota fiscal ou a conta.', 'Fotografar o cardápio se a informação não estava clara.', 'Consultar o Procon da sua região em caso de cobrança forçada.'],
      solucao: 'a retirada da taxa de serviço da conta', canais: GER,
      tags: ['10%', 'dez por cento', 'taxa de servico', 'gorjeta', 'garcom']
    },
    {
      id: 'couvert-artistico', cat: 'restaurantes', titulo: 'Couvert artístico', status: 'pendente', nota: notaLocal,
      resumo: 'Só faz sentido quando há apresentação ao vivo e o valor foi informado antes.',
      explicacao: 'O couvert artístico é um valor cobrado por apresentação ao vivo no local. Procons orientam que a cobrança depende de aviso prévio, claro e visível sobre o valor, antes do consumo. Música ambiente, playlist ou telão não justificam a cobrança.',
      condicoes: ['Há apresentação artística ao vivo.', 'O valor foi informado antes, de forma clara, na entrada ou no cardápio.'],
      excecoes: ['Estados e municípios podem ter regras próprias sobre a forma de aviso.', 'Couvert de mesa (pães, entradas) é outro assunto: itens não solicitados podem ser questionados.'],
      leis: ['cdc6', 'cdc31'],
      faq: [['Não fui avisado do couvert. Preciso pagar?', 'Procons entendem que, sem informação prévia e clara, a cobrança pode ser questionada. Converse com o gerente e, se necessário, procure o Procon.']],
      passos: ['Verificar se havia aviso do couvert na entrada ou no cardápio.', 'Fotografar o cardápio e os avisos do local.', 'Questionar a cobrança com o gerente.', 'Guardar a conta ou nota fiscal.', 'Consultar o Procon da sua região se não houver acordo.'],
      solucao: 'a retirada do couvert artístico não informado previamente', canais: GER,
      tags: ['couvert', 'musica ao vivo', 'show+bar']
    },
    {
      id: 'consumacao-minima', cat: 'restaurantes', titulo: 'Consumação mínima', status: 'pendente', nota: notaLocal,
      resumo: 'Exigir um valor mínimo de consumo é tratado por Procons como prática abusiva.',
      explicacao: 'O CDC proíbe impor ao consumidor, sem justa causa, limites de quantidade. Com base nisso, Procons consideram abusiva a exigência de consumação mínima. O estabelecimento pode cobrar entrada, se informar antes, e o que foi efetivamente consumido.',
      condicoes: ['O local exige um valor mínimo de consumo para entrar ou permanecer.'],
      excecoes: ['Cobrança de entrada informada previamente é diferente de consumação mínima.', 'Alguns estados têm leis próprias sobre o tema.'],
      leis: ['cdc39i'],
      faq: [['O bar cobra entrada. Isso pode?', 'Cobrar entrada informada com antecedência é diferente de exigir consumo mínimo. O que Procons consideram abusivo é condicionar a permanência a um valor de consumo.']],
      passos: ['Pedir a retirada do valor de consumação mínima da conta.', 'Fotografar avisos ou o cardápio que mencionem a exigência.', 'Guardar a conta ou nota fiscal.', 'Consultar o Procon da sua região se a cobrança for mantida.'],
      solucao: 'a retirada da cobrança de consumação mínima', canais: GER,
      tags: ['consumacao', 'consumo minimo', 'valor minimo']
    },
    {
      id: 'perda-comanda', cat: 'restaurantes', titulo: 'Perda de comanda', status: 'pendente', nota: notaLocal,
      resumo: 'Procons consideram abusiva a multa por perda de comanda. Você paga o que consumiu.',
      explicacao: 'Controlar o que foi consumido é responsabilidade do estabelecimento. Por isso, Procons consideram abusiva a cobrança de multa ou de valor fixo pela perda da comanda. A orientação é que o consumidor pague o que efetivamente consumiu.',
      condicoes: ['A comanda foi perdida e o local quer cobrar multa ou valor fixo sem relação com o consumo.'],
      excecoes: ['Há entendimentos diferentes sobre cobranças proporcionais ao consumo real. Confira a orientação do Procon local.'],
      leis: ['cdc39v'],
      faq: [['Quanto devo pagar se perdi a comanda?', 'A orientação de Procons é pagar o que você consumiu. Informe ao estabelecimento o que pediu e peça a conferência.']],
      passos: ['Informar ao estabelecimento o que você consumiu.', 'Pedir a conferência do consumo pelos registros do local.', 'Recusar, com educação, multa ou valor fixo.', 'Guardar a conta ou nota fiscal do que pagou.', 'Consultar o Procon da sua região se houver cobrança forçada.'],
      solucao: 'a cobrança apenas do que foi efetivamente consumido, sem multa', canais: GER,
      tags: ['comanda']
    },
    {
      id: 'problemas-pedidos', cat: 'restaurantes', titulo: 'Problemas com pedidos', status: 'verificado',
      resumo: 'Pedido errado, diferente do cardápio ou não solicitado pode ser corrigido ou recusado.',
      explicacao: 'O que está no cardápio obriga o restaurante. Se o pedido vier diferente do anunciado, você pode exigir o que foi ofertado, aceitar outro item equivalente ou cancelar. Se o serviço foi mal prestado, pode pedir que seja refeito, a devolução do valor ou um desconto. Itens que você não pediu não precisam ser pagos.',
      condicoes: ['O pedido veio diferente do cardápio, com problema, ou chegou algo que você não solicitou.'],
      excecoes: ['Avise assim que perceber o problema: consumir o item por inteiro dificulta a reclamação.'],
      leis: ['cdc35', 'cdc20', 'cdc39iii'],
      faq: [['Trouxeram uma entrada que não pedi. Preciso pagar?', 'O CDC trata como amostra grátis o que é entregue sem solicitação. Avise que não pediu e peça a retirada da conta.']],
      passos: ['Avisar o atendimento assim que perceber o problema.', 'Pedir a correção, a troca ou o cancelamento do item.', 'Conferir a conta antes de pagar.', 'Guardar a conta ou nota fiscal.', 'Consultar canais oficiais de reclamação quando necessário.'],
      solucao: 'a correção do pedido ou a retirada do item da conta', canais: GER,
      tags: ['pedido+errad', 'prato', 'comida+errad', 'pedido+demor', 'comida+fria', 'nao pedi', 'pedido+restaurante']
    },
    {
      id: 'cobranca-indevida-rest', cat: 'restaurantes', titulo: 'Cobrança indevida', status: 'verificado',
      resumo: 'Valor cobrado a mais e já pago pode ser devolvido em dobro, salvo engano justificável.',
      explicacao: 'Você tem direito a informação clara sobre preços. Se a conta trouxer itens não consumidos ou valores diferentes do cardápio, peça a correção antes de pagar. Se já pagou um valor indevido, o CDC prevê a devolução em dobro do que foi pago a mais, com correção e juros, salvo engano justificável do estabelecimento.',
      condicoes: ['A conta tem item não consumido, preço diferente do cardápio ou taxa não informada.', 'A devolução em dobro se refere ao valor indevido que foi efetivamente pago.'],
      excecoes: ['Se o erro for um engano justificável, a devolução pode ser simples.'],
      leis: ['cdc42', 'cdc6', 'cdc31'],
      faq: [['Percebi o erro depois de pagar. E agora?', 'Peça a devolução ao estabelecimento, com a conta em mãos. O CDC prevê devolução em dobro do valor pago a mais, salvo engano justificável.']],
      passos: ['Conferir a conta item por item antes de pagar.', 'Pedir a correção ao atendimento.', 'Fotografar o cardápio com os preços.', 'Guardar a conta e o comprovante de pagamento.', 'Consultar canais oficiais de reclamação se o valor não for devolvido.'],
      solucao: 'a correção da conta e a devolução do valor cobrado a mais', canais: GER,
      tags: ['conta+errad', 'restaurante+cobr', 'conta+a mais', 'conta do restaurante', 'cardapio+preco']
    },

    /* ===== COMPRAS ===== */
    {
      id: 'arrependimento', cat: 'compras', titulo: 'Direito de arrependimento', status: 'verificado',
      resumo: 'Em compras fora da loja, como internet e telefone, você pode desistir em até 7 dias.',
      explicacao: 'Quando você compra fora do estabelecimento comercial, como pela internet ou por telefone, pode desistir em até 7 dias, sem precisar explicar o motivo. O prazo conta da assinatura do contrato ou do recebimento do produto ou serviço. Os valores pagos devem ser devolvidos de imediato, com atualização monetária.',
      condicoes: ['A compra foi feita fora do estabelecimento comercial: internet, telefone, catálogo ou em domicílio.', 'O pedido de desistência é feito em até 7 dias da assinatura do contrato ou do recebimento.', 'Na internet, a loja deve aceitar a desistência pelo mesmo canal usado na compra e confirmar o recebimento do pedido.'],
      excecoes: ['Compras feitas presencialmente na loja não têm, em regra, o direito de arrependimento do art. 49.', 'Em loja física, trocas sem defeito dependem da política da loja. Se a loja prometeu, deve cumprir.', 'Para passagens aéreas existe regra específica da ANAC (desistência em 24 horas).'],
      leis: ['cdc49', 'dec5'],
      faq: [['Preciso explicar o motivo?', 'Não. O art. 49 do CDC não exige justificativa para desistir dentro do prazo.'], ['Vale para compra em loja física?', 'Em regra, não. O art. 49 trata de compras fora do estabelecimento comercial. Em loja física, veja a política de troca da loja e as regras de produto com defeito.'], ['Como fica o valor que paguei?', 'O art. 49 determina a devolução imediata dos valores pagos a qualquer título, com atualização. Na internet, a loja deve avisar a administradora do cartão para estornar a cobrança.']],
      passos: ['Comunicar a desistência por escrito, pelo mesmo canal da compra.', 'Guardar a confirmação de que a loja recebeu o pedido.', 'Anotar o número de protocolo.', 'Guardar nota fiscal, e-mails e comprovante de pagamento.', 'Combinar com a loja como será a devolução do produto.', 'Acompanhar o estorno ou a devolução dos valores.', 'Consultar canais oficiais de reclamação se não houver resposta.'],
      solucao: 'o cancelamento da compra e a devolução dos valores pagos', canais: GER,
      tags: ['arrepend', 'desist+compra', 'devolver', 'devolucao', '7 dias', 'sete dias', 'cancelar+compra', 'cancelar+pedido', 'me arrependi', 'comprei+internet+nao quero']
    },
    {
      id: 'troca-produtos', cat: 'compras', titulo: 'Troca de produtos', status: 'verificado',
      resumo: 'Sem defeito, a troca em loja física depende da política da loja. Promessa feita deve ser cumprida.',
      explicacao: 'Em compra presencial, a loja não é obrigada por lei a trocar um produto sem defeito, por exemplo por tamanho, cor ou gosto. Mas se ela anunciou ou prometeu a troca, na etiqueta, em cartaz ou na nota, essa oferta passa a valer e deve ser cumprida nas condições informadas. Em compra a distância, você pode usar o direito de arrependimento em até 7 dias. Com defeito, valem as regras de produto com defeito.',
      condicoes: ['Compra presencial sem defeito: vale a política de troca que a loja informou.', 'Compra pela internet ou telefone: direito de arrependimento em até 7 dias.', 'Produto com defeito: regras do art. 18 do CDC.'],
      excecoes: ['A loja pode definir prazo e condições para a troca voluntária, desde que informe com clareza.', 'Produtos em promoção têm as mesmas regras quando há defeito.'],
      leis: ['cdc30', 'cdc49', 'cdc18'],
      faq: [['A loja disse que não troca presente. Pode?', 'Se o produto não tem defeito e a compra foi presencial, a troca depende da política da loja. Se ela prometeu troca, deve cumprir o que informou.']],
      passos: ['Verificar a política de troca informada pela loja.', 'Separar nota fiscal e etiqueta do produto.', 'Procurar a loja dentro do prazo informado.', 'Anotar o nome de quem atendeu e o protocolo, se houver.', 'Consultar canais oficiais de reclamação se a loja não cumprir o que prometeu.'],
      solucao: 'a troca do produto, conforme a política informada na compra', canais: GER,
      tags: ['troca', 'trocar']
    },
    {
      id: 'defeito', cat: 'compras', titulo: 'Produtos com defeito', status: 'verificado',
      resumo: 'O fornecedor tem até 30 dias para consertar. Depois disso, a escolha é sua.',
      explicacao: 'Se o produto apresenta defeito, o fornecedor tem até 30 dias para resolver. Se não resolver, você escolhe entre: troca por outro produto igual, devolução do valor pago com atualização, ou desconto proporcional. Para reclamar de defeitos aparentes, o prazo é de 30 dias para produtos não duráveis e 90 dias para duráveis, contados da entrega.',
      condicoes: ['O defeito torna o produto impróprio, diminui seu valor ou não corresponde ao que foi informado.', 'A reclamação é feita dentro do prazo: 30 dias (não duráveis) ou 90 dias (duráveis).', 'Vale para compras presenciais e a distância.'],
      excecoes: ['Em produto essencial, você pode escolher de imediato uma das três alternativas, sem esperar os 30 dias.', 'No defeito oculto, o prazo para reclamar começa quando ele aparece.', 'Dano causado por mau uso não é tratado como defeito do produto.'],
      leis: ['cdc18', 'cdc26'],
      faq: [['A loja mandou procurar a assistência técnica. Pode?', 'O art. 18 do CDC prevê a responsabilidade solidária dos fornecedores. O prazo de 30 dias para a solução conta a partir da sua reclamação.'], ['O defeito apareceu meses depois. Perdi o prazo?', 'No defeito oculto, o prazo de 30 ou 90 dias começa a contar quando o defeito fica evidente.']],
      passos: ['Reunir nota fiscal e fotos ou vídeos do defeito.', 'Reclamar por escrito com a loja ou o fabricante.', 'Anotar a data da reclamação e o protocolo.', 'Guardar a ordem de serviço se deixar o produto para conserto.', 'Acompanhar o prazo de 30 dias para a solução.', 'Escolher troca, devolução do valor ou desconto se não for resolvido.', 'Consultar canais oficiais de reclamação quando necessário.'],
      solucao: 'o conserto do produto no prazo legal ou, não sendo possível, a troca ou a devolução do valor pago', canais: GER,
      tags: ['defeito', 'quebrad', 'nao funciona', 'parou de funcionar', 'estragad', 'garantia', 'conserto', 'veio quebrado']
    },
    {
      id: 'atraso-entrega', cat: 'compras', titulo: 'Atraso na entrega', status: 'verificado',
      resumo: 'Prazo prometido faz parte da oferta. Se não for cumprido, você escolhe o que fazer.',
      explicacao: 'O prazo de entrega informado na compra faz parte da oferta e obriga a empresa. Se ele não for cumprido, você pode escolher: exigir a entrega, aceitar outro produto equivalente, ou cancelar a compra e receber de volta o que pagou, com atualização.',
      condicoes: ['A empresa informou um prazo de entrega e ele venceu.', 'Vale para compras presenciais com entrega e para compras a distância.'],
      excecoes: ['Alguns estados têm leis próprias sobre agendamento de data e turno de entrega.', 'Indenizações por prejuízos dependem de análise de cada caso.'],
      leis: ['cdc35', 'cdc30'],
      faq: [['Posso cancelar e pedir o dinheiro de volta?', 'Sim. Se o prazo ofertado não foi cumprido, o art. 35 do CDC permite cancelar e receber de volta o valor pago, com atualização.']],
      passos: ['Conferir o prazo informado no pedido ou na nota.', 'Entrar em contato com a empresa pelo canal oficial.', 'Informar por escrito qual solução você escolheu.', 'Anotar o protocolo de atendimento.', 'Guardar o comprovante da compra e as mensagens.', 'Consultar canais oficiais de reclamação se não houver solução.'],
      solucao: 'a entrega imediata do produto ou o cancelamento com devolução do valor pago', canais: GER,
      tags: ['entrega+atras', 'pedido+nao chegou', 'nao entreg', 'entrega+demor', 'encomenda', 'prazo de entrega', 'nao recebi', 'compra+nao chegou']
    },
    {
      id: 'cobranca-indevida-compras', cat: 'compras', titulo: 'Cobrança indevida', status: 'verificado',
      resumo: 'Valor indevido que você pagou pode ser devolvido em dobro, salvo engano justificável.',
      explicacao: 'Se você foi cobrado por algo que não devia e pagou, o CDC prevê a devolução em dobro do valor pago a mais, com correção monetária e juros, salvo quando a empresa demonstrar engano justificável. Cobranças duplicadas, valores diferentes do combinado e serviços não contratados são exemplos comuns.',
      condicoes: ['Houve cobrança de valor que não era devido.', 'A devolução em dobro se refere ao valor indevido efetivamente pago.'],
      excecoes: ['Em caso de engano justificável, a devolução pode ser simples.', 'Se a cobrança ainda não foi paga, peça o cancelamento ou a correção.'],
      leis: ['cdc42'],
      faq: [['Fui cobrado duas vezes no cartão. O que faço?', 'Peça a correção à loja por escrito e guarde a fatura. Se o valor já foi pago, o CDC prevê devolução em dobro do excesso, salvo engano justificável.']],
      passos: ['Reunir fatura, extrato ou boleto com a cobrança.', 'Pedir a correção ou o estorno à empresa, por escrito.', 'Anotar o protocolo de atendimento.', 'Guardar comprovantes de pagamento.', 'Consultar canais oficiais de reclamação se o valor não for devolvido.'],
      solucao: 'o cancelamento da cobrança indevida e a devolução do valor pago a mais', canais: GER,
      tags: ['cobranca indevida', 'cobraram duas', 'cobrado em dobro', 'cobranca duplicad', 'cobraram a mais', 'valor errado', 'cobranca+cartao', 'cobrado duas']
    },
    {
      id: 'produto-diferente', cat: 'compras', titulo: 'Produto diferente do anunciado', status: 'verificado',
      resumo: 'O anúncio obriga a empresa. Se o produto não corresponde, você escolhe a solução.',
      explicacao: 'Toda informação ou publicidade precisa obriga a empresa. Se o produto entregue é diferente do anunciado, você pode escolher: exigir o produto como foi ofertado, aceitar outro equivalente, ou cancelar e receber de volta o valor pago, com atualização. Em compras a distância, também é possível usar o direito de arrependimento em até 7 dias do recebimento.',
      condicoes: ['O produto recebido não corresponde ao anúncio, à embalagem ou à descrição.', 'Vale para compras presenciais e a distância.'],
      excecoes: ['Guarde o anúncio: sem registro da oferta, fica mais difícil demonstrar a diferença.'],
      leis: ['cdc30', 'cdc35', 'cdc18', 'cdc49'],
      faq: [['Comprei pela internet e veio outro modelo. Posso devolver?', 'Sim. Você pode exigir o produto anunciado, aceitar um equivalente ou cancelar a compra. Dentro de 7 dias do recebimento, também vale o direito de arrependimento.']],
      passos: ['Salvar o anúncio ou a página da oferta (print com data).', 'Fotografar o produto recebido.', 'Informar à empresa, por escrito, qual solução você escolheu.', 'Anotar o protocolo de atendimento.', 'Guardar nota fiscal e mensagens.', 'Consultar canais oficiais de reclamação quando necessário.'],
      solucao: 'a entrega do produto conforme anunciado ou o cancelamento com devolução do valor pago', canais: GER,
      tags: ['diferente do anunci', 'propaganda enganosa', 'veio errado', 'produto errado', 'veio diferente', 'veio outro', 'anuncio+diferente']
    }
  ];

  /* ---------- Categorias 4 e 5: Bancos e cartões · Telefonia e internet ---------- */
  Object.assign(DX.FONTES, {
    cmn3919: { nome: 'Resolução CMN nº 3.919/2010 (tarifas bancárias)', curto: 'Res. CMN 3.919/2010', orgao: 'Banco Central do Brasil', url: 'https://normativos.bcb.gov.br/Lists/Normativos/Attachments/49514/Res_3919_v7_P.pdf' },
    pix: { nome: 'Regulamento do Pix e Mecanismo Especial de Devolução (MED)', curto: 'Pix · MED', orgao: 'Banco Central do Brasil', url: 'https://www.bcb.gov.br/estabilidadefinanceira/pix' },
    stj: { nome: 'Súmulas do Superior Tribunal de Justiça', curto: 'Súmulas do STJ', orgao: 'Superior Tribunal de Justiça', url: 'https://scon.stj.jus.br/SCON/sumstj/' },
    rgc: { nome: 'Resolução Anatel nº 765/2023 (Regulamento Geral de Direitos do Consumidor de Telecomunicações)', curto: 'RGC · Res. Anatel 765/2023', orgao: 'Anatel · área do consumidor', url: 'https://www.gov.br/anatel/pt-br/consumidor' }
  });
  Object.assign(DX.CANAIS, {
    bcb: { nome: 'Banco Central · reclamações', desc: 'O Banco Central recebe reclamações contra bancos e instituições de pagamento. Use depois de tentar o SAC e a ouvidoria do banco.', url: 'https://www.bcb.gov.br/' },
    anatel: { nome: 'Anatel · consumidor', desc: 'Orientações oficiais e canal de reclamação contra operadoras de telefonia, internet e TV.', url: 'https://www.gov.br/anatel/pt-br/consumidor' }
  });
  Object.assign(DX.LEIS, {
    cdc14: { fonte: 'cdc', rotulo: 'CDC, art. 14', artigo: 'Art. 14', simples: 'O fornecedor de serviços responde pelos danos causados por falha no serviço, mesmo sem culpa.' },
    cdc42c: { fonte: 'cdc', rotulo: 'CDC, art. 42, caput', artigo: 'Art. 42, caput', simples: 'Na cobrança de dívidas, o consumidor não pode ser exposto ao ridículo nem sofrer constrangimento ou ameaça.' },
    cdc43: { fonte: 'cdc', rotulo: 'CDC, art. 43, §2º', artigo: 'Art. 43, § 2º', simples: 'A abertura de cadastro negativo em nome do consumidor deve ser comunicada a ele por escrito, antes.' },
    cmn2: { fonte: 'cmn3919', rotulo: 'Res. CMN 3.919, art. 2º', artigo: 'Art. 2º', simples: 'Na conta corrente de pessoa física, o banco não pode cobrar pelos serviços essenciais: cartão de débito, até 4 saques, até 2 transferências entre contas do mesmo banco e até 2 extratos por mês, além de consultas pela internet.' },
    med: { fonte: 'pix', rotulo: 'Pix · MED', artigo: 'Mecanismo Especial de Devolução', simples: 'Quem fez um Pix por causa de golpe pode pedir ao próprio banco a abertura do MED em até 80 dias da transferência. O dinheiro só volta se ainda houver saldo na conta que recebeu.' },
    s479: { fonte: 'stj', rotulo: 'Súmula 479 do STJ', artigo: 'Súmula 479', simples: 'Bancos respondem pelos danos causados por fraudes e delitos de terceiros em operações bancárias.' },
    s532: { fonte: 'stj', rotulo: 'Súmula 532 do STJ', artigo: 'Súmula 532', simples: 'Enviar cartão de crédito sem pedido expresso do consumidor é prática abusiva.' },
    s359: { fonte: 'stj', rotulo: 'Súmula 359 do STJ', artigo: 'Súmula 359', simples: 'Cabe ao órgão de cadastro (como SPC e Serasa) avisar o consumidor antes de incluir o nome dele.' },
    rgc: { fonte: 'rgc', rotulo: 'RGC da Anatel', artigo: 'Resolução nº 765/2023, em vigor desde 1º/9/2025', simples: 'Regulamento com os direitos de quem usa telefone, celular, internet e TV por assinatura: cancelamento, cobrança, contestação de faturas e atendimento.' }
  });
  DX.CATEGORIAS.push(
    { id: 'bancos', titulo: 'Bancos e cartões', curto: 'Bancos', icone: 'banco', desc: 'Tarifas, golpes no Pix, compras não reconhecidas e cobranças.', orgao: 'Banco Central e Procons', abrangencia: 'Nacional. Regras do Banco Central valem para bancos e instituições de pagamento.' },
    { id: 'telecom', titulo: 'Telefonia e internet', curto: 'Telefonia', icone: 'sinal', desc: 'Celular, internet e TV: cancelamento, fatura, fidelidade e falhas.', orgao: 'Anatel e Procons', abrangencia: 'Nacional. O RGC da Anatel vale para telefone fixo e móvel, internet e TV por assinatura.' }
  );
  const BAN = ['bcb', 'cgov', 'procon'], TEL = ['anatel', 'cgov', 'procon'];
  const notaRgc = 'Resumo baseado no novo RGC da Anatel (Resolução nº 765/2023), em vigor desde 1º/9/2025, e em fontes públicas. Partes do regulamento foram anuladas ou alteradas pela Anatel em 2024. Confira o texto oficial antes de tratar como confirmado.';
  DX.DIREITOS.push(
    /* ===== BANCOS E CARTÕES ===== */
    { id: 'tarifas-bancarias', cat: 'bancos', titulo: 'Tarifas na conta corrente', status: 'verificado',
      resumo: 'Todo banco deve oferecer um pacote de serviços essenciais sem tarifa.',
      explicacao: 'Na conta corrente de pessoa física, o banco não pode cobrar pelos serviços essenciais: cartão de débito, até 4 saques por mês, até 2 transferências entre contas do mesmo banco, até 2 extratos por mês e consultas pela internet. Você pode pedir a troca do seu pacote pago pelo pacote de serviços essenciais.',
      condicoes: ['Conta corrente de pessoa física.', 'Vale para os serviços dentro dos limites mensais.', 'Você pode cancelar um pacote de tarifas e voltar aos serviços essenciais.'],
      excecoes: ['O que passa dos limites mensais pode ser cobrado, se estiver previsto no contrato.', 'Contas digitais e contas salário têm regras próprias.'],
      leis: ['cmn2'],
      faq: [['Posso trocar minha conta paga por uma gratuita?', 'Sim. Peça ao banco a adesão ao pacote de serviços essenciais, sem tarifa mensal.']],
      passos: ['Conferir no extrato quais tarifas são cobradas.', 'Pedir ao banco, por escrito, a troca para o pacote de serviços essenciais.', 'Anotar o protocolo.', 'Pedir a devolução de tarifas cobradas sobre serviços essenciais.', 'Procurar a ouvidoria do banco se não resolver.', 'Registrar reclamação no Banco Central ou no Consumidor.gov.br.'],
      solucao: 'a troca para o pacote de serviços essenciais e a devolução das tarifas cobradas indevidamente', canais: BAN,
      tags: ['tarifa', 'pacote+banco', 'taxa+banco', 'cesta+servic', 'conta corrente', 'manutencao+conta'] },
    { id: 'golpe-pix', cat: 'bancos', titulo: 'Golpe no Pix', status: 'verificado',
      resumo: 'Avise seu banco o quanto antes: o MED pode ser pedido em até 80 dias.',
      explicacao: 'Se você fez um Pix por causa de golpe, peça ao seu próprio banco a abertura do Mecanismo Especial de Devolução (MED). O pedido pode ser feito em até 80 dias da transferência. O banco de quem recebeu analisa o caso e, se houver saldo, o valor pode ser bloqueado e devolvido. Quanto antes você avisar, maior a chance de o dinheiro ainda estar na conta.',
      condicoes: ['O Pix foi feito por causa de fraude ou golpe.', 'O pedido é feito pelo seu banco, em até 80 dias da transferência.'],
      excecoes: ['O MED não cobre desacordo comercial, como produto que não agradou.', 'A devolução depende de haver saldo na conta que recebeu.'],
      leis: ['med', 's479'],
      faq: [['Fiz o Pix há duas semanas. Ainda dá?', 'Sim. O prazo do MED é de até 80 dias da transferência. Mas avise já: o saldo pode ser retirado a qualquer momento.']],
      passos: ['Avisar o banco imediatamente, pelo app ou pela central.', 'Pedir a abertura do MED e anotar o protocolo.', 'Registrar boletim de ocorrência.', 'Guardar prints da conversa e o comprovante do Pix.', 'Acompanhar a resposta do banco.', 'Procurar a ouvidoria e o Banco Central se não houver retorno.'],
      solucao: 'a abertura do Mecanismo Especial de Devolução e o bloqueio dos valores', canais: BAN,
      tags: ['pix', 'golpe', 'fraude', 'caí num golpe', 'cai em golpe', 'transferi errado', 'med'] },
    { id: 'compra-nao-reconhecida', cat: 'bancos', titulo: 'Compra não reconhecida no cartão', status: 'verificado',
      resumo: 'Fraudes de terceiros em operações bancárias são responsabilidade do banco.',
      explicacao: 'Se aparece na fatura ou no extrato uma compra ou transação que você não fez, conteste com o banco ou a administradora do cartão. O STJ entende que bancos respondem pelos danos causados por fraudes de terceiros em operações bancárias, e o CDC trata a falha no serviço como responsabilidade do fornecedor.',
      condicoes: ['Você não fez nem autorizou a compra ou transação.', 'A contestação deve ser feita assim que perceber.'],
      excecoes: ['Se a pessoa usou cartão e senha que você entregou a ela, a análise muda.', 'Cada caso é analisado; o Diretrix não garante o estorno.'],
      leis: ['s479', 'cdc14'],
      faq: [['Devo bloquear o cartão?', 'Sim. Bloqueie pelo app ou pela central antes de contestar, para evitar novas compras.']],
      passos: ['Bloquear o cartão pelo app ou pela central.', 'Contestar cada compra não reconhecida.', 'Anotar o protocolo.', 'Guardar a fatura e prints do app.', 'Registrar boletim de ocorrência, se for fraude.', 'Procurar a ouvidoria e o Banco Central se não houver solução.'],
      solucao: 'o cancelamento das compras não reconhecidas e o estorno dos valores', canais: BAN,
      tags: ['compra+nao fiz', 'nao reconhe', 'clonad', 'fatura+compra', 'cartao+fraude', 'compra estranha'] },
    { id: 'cartao-nao-solicitado', cat: 'bancos', titulo: 'Cartão ou serviço não solicitado', status: 'verificado',
      resumo: 'Enviar cartão de crédito sem pedido é prática abusiva.',
      explicacao: 'O banco não pode enviar cartão de crédito, aumentar serviços ou contratar empréstimos sem o seu pedido. O CDC proíbe fornecer produto ou serviço sem solicitação, e o STJ considera abusivo o envio de cartão de crédito sem pedido expresso. Você pode pedir o cancelamento e a devolução de qualquer valor cobrado.',
      condicoes: ['Você não pediu o cartão, o serviço ou o empréstimo.'],
      excecoes: ['Se você assinou ou aceitou a oferta, mesmo pelo app, o caso muda.'],
      leis: ['s532', 'cdc39iii', 'cdc42'],
      faq: [['Chegou um cartão que não pedi. Preciso desbloquear?', 'Não. Não desbloqueie. Peça o cancelamento e guarde o protocolo.']],
      passos: ['Não desbloquear nem usar o cartão.', 'Pedir o cancelamento por escrito.', 'Pedir a devolução de anuidade ou valores cobrados.', 'Anotar o protocolo.', 'Procurar a ouvidoria e os canais oficiais se continuar.'],
      solucao: 'o cancelamento do cartão ou serviço não solicitado e a devolução de valores cobrados', canais: BAN,
      tags: ['cartao+nao pedi', 'nao solicit', 'emprestimo+nao', 'anuidade', 'chegou um cartao'] },
    { id: 'negativacao', cat: 'bancos', titulo: 'Nome negativado sem aviso', status: 'verificado',
      resumo: 'Você deve ser avisado por escrito antes de entrar em cadastro negativo.',
      explicacao: 'Antes de incluir seu nome em cadastros como SPC e Serasa, você precisa receber um aviso por escrito. Pelo STJ, essa comunicação é dever do órgão de cadastro. Se a dívida não existe ou já foi paga, você pode pedir a retirada do nome.',
      condicoes: ['Seu nome foi incluído sem aviso prévio por escrito, ou por dívida inexistente ou já paga.'],
      excecoes: ['Uma dívida real e atrasada pode ser cobrada; o problema está na falta de aviso ou na cobrança indevida.'],
      leis: ['cdc43', 's359'],
      faq: [['Como descubro quem me negativou?', 'Consulte seu CPF nos sites oficiais dos cadastros, como Serasa e SPC. Lá aparecem a empresa, o valor e a data.']],
      passos: ['Consultar o CPF nos cadastros para ver empresa, valor e data.', 'Reunir comprovantes de pagamento, se houver.', 'Pedir à empresa a retirada do nome, por escrito.', 'Anotar o protocolo.', 'Procurar os canais oficiais se não houver solução.'],
      solucao: 'a retirada do meu nome do cadastro de inadimplentes', canais: ['cgov', 'procon'],
      tags: ['negativ', 'serasa', 'spc', 'nome sujo', 'nome+sujo', 'cpf+restri'] },
    { id: 'cobranca-abusiva', cat: 'bancos', titulo: 'Cobrança de dívida abusiva', status: 'verificado',
      resumo: 'Cobrar é permitido, constranger ou ameaçar não.',
      explicacao: 'A empresa pode cobrar uma dívida, mas não pode expor você ao ridículo, ameaçar ou constranger. Ligações em excesso, contato com vizinhos ou colegas de trabalho e ameaças são exemplos de abuso. Se a cobrança for de valor que você não deve e você pagar, o CDC prevê a devolução em dobro.',
      condicoes: ['A cobrança expõe, ameaça ou constrange, ou cobra valor indevido.'],
      excecoes: ['Lembretes e contatos educados sobre uma dívida real são permitidos.'],
      leis: ['cdc42c', 'cdc42'],
      faq: [['Ligam várias vezes por dia. Posso reclamar?', 'Sim. Anote datas, horários e números. Insistência que constrange pode ser cobrança abusiva.']],
      passos: ['Anotar datas, horários e números das ligações.', 'Guardar mensagens e áudios.', 'Pedir à empresa, por escrito, que pare com a cobrança abusiva.', 'Anotar o protocolo.', 'Procurar o Procon ou o Consumidor.gov.br.'],
      solucao: 'o fim das cobranças constrangedoras e a correção dos valores cobrados', canais: ['cgov', 'procon'],
      tags: ['cobranca+ligac', 'ligam+muito', 'ameaca', 'cobrador', 'constrang', 'cobranca abusiva'] },

    /* ===== TELEFONIA E INTERNET ===== */
    { id: 'cancelar-plano', cat: 'telecom', titulo: 'Cancelar plano ou serviço', status: 'pendente', nota: notaRgc,
      resumo: 'O cancelamento deve ser possível sem falar com atendente.',
      explicacao: 'Pelo novo RGC da Anatel, a operadora deve oferecer o cancelamento automático, inclusive por opção no menu do atendimento, sem precisar falar com um atendente. No pedido, você deve ser informado se haverá multa de fidelidade ou cobrança proporcional aos dias usados.',
      condicoes: ['Vale para telefone fixo, celular, internet e TV por assinatura.'],
      excecoes: ['Se houver fidelidade em vigor, pode haver multa.', 'Em combos, o cancelamento de um item pode envolver o pacote todo.'],
      leis: ['rgc', 'cdc6'],
      faq: [['Preciso aceitar a oferta para ficar?', 'Não. Você pode recusar e manter o pedido de cancelamento.']],
      passos: ['Pedir o cancelamento pelo app, site ou menu do atendimento.', 'Anotar o protocolo e a data.', 'Conferir se a última fatura veio proporcional.', 'Guardar a confirmação do cancelamento.', 'Procurar a Anatel ou o Consumidor.gov.br se a cobrança continuar.'],
      solucao: 'o cancelamento imediato do serviço, sem novas cobranças', canais: TEL,
      tags: ['cancelar+plano', 'cancelar+internet', 'cancelar+tv', 'cancelar+linha', 'nao consigo cancelar', 'operadora+cancel'] },
    { id: 'fatura-indevida', cat: 'telecom', titulo: 'Cobrança indevida na fatura', status: 'pendente', nota: notaRgc,
      resumo: 'A fatura pode ser contestada em até 3 anos.',
      explicacao: 'Se a conta de telefone, internet ou TV traz valor que você não reconhece, conteste com a operadora. Pelo novo RGC, a contestação pode ser feita em até 3 anos da data da cobrança. Se você pagou um valor indevido, o CDC prevê a devolução em dobro, com correção e juros, salvo engano justificável.',
      condicoes: ['A fatura traz serviço não contratado, valor diferente do combinado ou cobrança duplicada.'],
      excecoes: ['Em caso de engano justificável, a devolução pode ser simples.'],
      leis: ['rgc', 'cdc42'],
      faq: [['Pago a conta contestada?', 'Pergunte à operadora sobre a emissão de uma nova fatura sem o valor contestado e guarde o protocolo.']],
      passos: ['Separar a fatura com o valor contestado.', 'Contestar com a operadora e pedir nova fatura.', 'Anotar o protocolo.', 'Pedir a devolução em dobro do que já foi pago a mais.', 'Procurar a Anatel ou o Consumidor.gov.br se não resolver.'],
      solucao: 'a correção da fatura e a devolução em dobro dos valores pagos a mais', canais: TEL,
      tags: ['fatura+operadora', 'conta de telefone', 'conta de internet', 'fatura+celular', 'cobrança+operadora', 'servico+nao contratei'] },
    { id: 'multa-fidelidade', cat: 'telecom', titulo: 'Multa de fidelidade', status: 'pendente', nota: notaRgc,
      resumo: 'A multa precisa estar informada na oferta e no contrato.',
      explicacao: 'A fidelidade é o tempo mínimo de permanência em troca de algum benefício, como desconto ou aparelho. A multa por sair antes precisa estar informada de forma clara na oferta. Pelo CDC, a operadora não pode exigir vantagem manifestamente excessiva.',
      condicoes: ['Você aceitou uma oferta com fidelidade e quer sair antes do fim do prazo.'],
      excecoes: ['Se a operadora não cumpre o contrato, como em falhas frequentes, a multa pode ser questionada.'],
      leis: ['rgc', 'cdc39v', 'cdc6'],
      faq: [['Quanto devo pagar de multa?', 'Confira o valor e a regra de cálculo na oferta e no contrato. Peça à operadora o cálculo por escrito.']],
      passos: ['Localizar a oferta e o contrato com a regra da multa.', 'Pedir à operadora o cálculo da multa por escrito.', 'Questionar se houver falhas no serviço.', 'Anotar o protocolo.', 'Procurar os canais oficiais se a cobrança parecer excessiva.'],
      solucao: 'a revisão da multa de fidelidade cobrada', canais: TEL,
      tags: ['fidelidade', 'multa+cancel', 'multa+operadora', 'multa+plano'] },
    { id: 'internet-lenta', cat: 'telecom', titulo: 'Internet abaixo do contratado', status: 'pendente', nota: notaRgc,
      resumo: 'A velocidade anunciada faz parte da oferta.',
      explicacao: 'O que a operadora anuncia sobre o plano, incluindo a velocidade, faz parte da oferta e deve ser cumprido. Se o serviço é prestado abaixo do contratado, você pode pedir a correção, um desconto proporcional ou o cancelamento. Faça medições e registre as reclamações.',
      condicoes: ['A velocidade fica abaixo do contratado com frequência.'],
      excecoes: ['Problemas no seu roteador, cabo ou Wi-Fi podem afetar a medição. Meça com cabo, se possível.'],
      leis: ['cdc30', 'cdc20', 'rgc'],
      faq: [['Como provo que a internet está lenta?', 'Faça medições em dias e horários diferentes, de preferência com cabo, e guarde os resultados.']],
      passos: ['Medir a velocidade em dias e horários diferentes.', 'Guardar prints das medições.', 'Abrir reclamação com a operadora.', 'Anotar o protocolo.', 'Pedir correção, desconto ou cancelamento sem multa.', 'Procurar a Anatel se não resolver.'],
      solucao: 'a correção da velocidade contratada ou o desconto proporcional', canais: TEL,
      tags: ['internet+lenta', 'velocidade', 'internet+ruim', 'internet+caindo', 'mega'] },
    { id: 'servico-interrompido', cat: 'telecom', titulo: 'Serviço fora do ar', status: 'pendente', nota: notaRgc,
      resumo: 'Interrupções dão direito a ressarcimento proporcional.',
      explicacao: 'Quando o telefone, a internet ou a TV ficam fora do ar, a operadora deve resolver e ressarcir o período sem serviço de forma proporcional, conforme o novo RGC. Registre a falha com a operadora para ter o protocolo e a data.',
      condicoes: ['O serviço ficou indisponível por falha da operadora.'],
      excecoes: ['Manutenções programadas e avisadas com antecedência podem ter regras próprias.'],
      leis: ['rgc', 'cdc20'],
      faq: [['Como recebo o desconto?', 'Peça à operadora o ressarcimento do período sem serviço e confira na fatura seguinte.']],
      passos: ['Registrar a falha com a operadora.', 'Anotar o protocolo, a data e o horário.', 'Pedir o ressarcimento proporcional.', 'Conferir o desconto na próxima fatura.', 'Procurar a Anatel se o problema se repetir.'],
      solucao: 'o restabelecimento do serviço e o ressarcimento proporcional do período sem funcionamento', canais: TEL,
      tags: ['sem internet', 'fora do ar', 'sem sinal', 'internet+caiu', 'sem servico', 'tv+nao funciona'] },
    { id: 'reajuste-plano', cat: 'telecom', titulo: 'Reajuste do plano', status: 'pendente', nota: notaRgc,
      resumo: 'Reajuste só depois de 12 meses e conforme o que foi informado na oferta.',
      explicacao: 'O RGC mantém a proibição de reajuste em contratos com menos de 12 meses de vigência. O reajuste deve seguir a regra informada na oferta, de forma clara. Mudanças de preço sem aviso ou fora da regra podem ser contestadas.',
      condicoes: ['O preço do plano mudou.'],
      excecoes: ['Em 2024 a Anatel passou a permitir alterações durante a vigência em alguns casos, desde que em benefício do consumidor.'],
      leis: ['rgc', 'cdc6', 'cdc30'],
      faq: [['A operadora aumentou o preço com 6 meses. Pode?', 'Pelo RGC, reajuste em contratos com menos de 12 meses é proibido. Conteste e guarde o protocolo.']],
      passos: ['Conferir a data de contratação e a regra de reajuste da oferta.', 'Comparar com a fatura atual.', 'Contestar com a operadora.', 'Anotar o protocolo.', 'Procurar a Anatel ou o Consumidor.gov.br se não resolver.'],
      solucao: 'a correção do valor do plano conforme a oferta contratada', canais: TEL,
      tags: ['reajuste', 'aumentou+plano', 'aumento+preco', 'plano+ficou mais caro'] }
  );

  /* ---------- Consultas ---------- */
  DX.norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  DX.direito = id => DX.DIREITOS.find(d => d.id === id);
  DX.categoria = id => DX.CATEGORIAS.find(c => c.id === id);
  DX.daCategoria = id => DX.DIREITOS.filter(d => d.cat === id);
  DX.STATUS = {
    verificado: { rotulo: 'Verificado', desc: 'Conferido com a fonte oficial' },
    pendente: { rotulo: 'Pendente de revisão', desc: 'Ainda não confirmado' },
    desatualizado: { rotulo: 'Desatualizado', desc: 'A norma mudou' }
  };

  /* Busca da barra de pesquisa: termos digitados dentro do conteúdo cadastrado */
  DX.buscar = function (q, cat) {
    const termos = DX.norm(q).split(/\s+/).filter(t => t.length > 1);
    if (!termos.length) return [];
    return DX.DIREITOS.filter(d => !cat || d.cat === cat).map(d => {
      const alvo = DX.norm([d.titulo, d.resumo, d.explicacao, d.tags.join(' '), DX.categoria(d.cat).titulo].join(' '));
      const titulo = DX.norm(d.titulo);
      let p = 0;
      termos.forEach(t => { if (titulo.includes(t)) p += 3; else if (alvo.includes(t)) p += 1; });
      return { d, p };
    }).filter(r => r.p > 0).sort((a, b) => b.p - a.p).map(r => r.d);
  };
})(window.DX);
