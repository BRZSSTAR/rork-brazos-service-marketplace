import { catalogPtBR, catalogEn, catalogEs } from './catalogTranslations';

export const resources = {
  'pt-BR': {
    translation: {
      common: { appName: 'BRAZOS', back: 'Voltar', soon: 'Em breve', or: 'ou', continue: 'Continuar' },
      locale: { portuguese: 'Português (BR)', english: 'English', spanish: 'Español' },
      auth: {
        tagline: 'Seu serviço, do seu jeito',
        login: {
          title: 'Entrar', subtitle: 'Bem-vindo de volta! Entre na sua conta.', email: 'E-mail', password: 'Senha',
          forgotPassword: 'Esqueceu sua senha?', submit: 'Entrar', noAccount: 'Não tem uma conta?', createAccount: 'Criar conta',
          errorTitle: 'Erro', fillAllFields: 'Por favor, preencha todos os campos.', failure: 'Não foi possível fazer login. Tente novamente.'
        },
        register: {
          headerSubtitle: 'Criar sua conta', roleTitle: 'Como deseja usar o BRAZOS?', roleSubtitle: 'Escolha seu perfil. Não é possível alterar depois.',
          customerTitle: 'Estou procurando serviços', customerDescription: 'Encontre e contrate profissionais qualificados',
          providerTitle: 'Estou oferecendo serviços', providerDescription: 'Ofereça seus serviços e conquiste novos clientes',
          continue: 'Continuar', detailsTitle: 'Seus dados', detailsSubtitleCustomer: 'Crie sua conta para encontrar profissionais.',
          detailsSubtitleProvider: 'Crie sua conta para oferecer seus serviços.', fullName: 'Nome completo', fullNamePlaceholder: 'João Silva',
          email: 'E-mail', emailPlaceholder: 'seu@email.com', password: 'Senha', passwordPlaceholder: 'Mínimo 8 caracteres',
          submit: 'Criar conta', hasAccount: 'Já tem uma conta?', login: 'Entrar', errorTitle: 'Erro',
          fillAllFields: 'Por favor, preencha todos os campos.', failure: 'Não foi possível criar sua conta. Tente novamente.'
        }
      },
      bootstrap: { tagline: 'Seu serviço, do seu jeito' },
      languageSelection: {
        title: 'Escolha seu idioma',
        subtitle: 'Selecione seu idioma preferido para continuar',
        confirm: 'Continuar'
      },
      notFound: { title: 'Página não encontrada', subtitle: 'Esta tela não existe.', backHome: 'Voltar ao início' },
      tabs: {
        customer: { home: 'Início', explore: 'Explorar', bookings: 'Reservas', profile: 'Perfil' },
        provider: { home: 'Início', orders: 'Pedidos', schedule: 'Agenda', earnings: 'Ganhos', profile: 'Perfil' }
      },
      customer: {
        home: {
          greeting: 'Olá, {{name}}', title: 'O que você precisa\nhoje?', highlights: 'Destaques', featuredBadge: 'Novo',
          featuredTitle: 'Encontre profissionais perto de você', featuredDescription: 'Explore serviços de qualidade com preços transparentes e pagamento seguro.',
          nextBookings: 'Próximas reservas', noBookings: 'Nenhuma reserva agendada', noBookingsDescription: 'Explore profissionais para agendar seu primeiro serviço',
          fallbackName: 'Olá',
          quickServicesTitle: 'Serviços Populares', seeAll: 'Ver todos',
          promoAvailNow: 'Disponível Agora', promoAvailNowDesc: 'Profissionais prontos para atender você hoje',
          promoVerified: 'Profissionais Verificados', promoVerifiedDesc: 'Com verificação e certificação',
          categories: {
            home: { label: 'Casa', subtitle: 'Limpeza, reparos & mais' }, beauty: { label: 'Beleza', subtitle: 'Cabelo, unhas & estética' },
            health: { label: 'Saúde', subtitle: 'Bem-estar & cuidados' }, chef: { label: 'Chef', subtitle: 'Culinária & eventos' }
          }
        },
        explore: {
          searchPlaceholder: 'Buscar serviços, profissionais...', title: 'Explore profissionais', subtitle: 'Pesquise por serviço ou profissional na sua região.',
          popularServices: 'Serviços Populares', trending: 'Em alta', results: 'resultados', noResults: 'Nenhum resultado encontrado', noResultsHint: 'Tente buscar por um serviço diferente',
          filters: {
            title: 'Filtros', reset: 'Limpar', apply: 'Aplicar filtros',
            sortBy: 'Ordenar por', sortRelevance: 'Relevância', sortRatingHigh: 'Melhor avaliação', sortPriceLow: 'Menor preço', sortPriceHigh: 'Maior preço', sortDistance: 'Mais perto', sortNewest: 'Mais recentes',
            availability: 'Disponibilidade', availAny: 'Qualquer', availNow: 'Disponível agora', availToday: 'Hoje', availWeek: 'Esta semana',
            rating: 'Avaliação', ratingAny: 'Qualquer', topRated: 'Melhor avaliados',
            priceRange: 'Faixa de preço', priceAny: 'Qualquer', priceBudget: 'Econômico', priceMid: 'Intermediário', pricePremium: 'Premium',
            category: 'Categoria', catAll: 'Todas',
            lowestPrice: 'Menor preço', nearby: 'Perto de mim'
          }
        },
        bookings: { tabs: { active: 'Ativas', completed: 'Concluídas', cancelled: 'Canceladas' }, emptyTitle: 'Nenhuma reserva', emptySubtitle: 'Suas reservas {{tab}} aparecerão aqui.' },
        profile: {
          fallbackName: 'Usuário', logout: 'Sair da conta', version: 'BRAZOS v1.0.0', languageSection: 'Idioma',
          menu: { settings: 'Configurações', paymentMethods: 'Métodos de pagamento', notifications: 'Notificações', support: 'Ajuda e suporte' },
          becomeProvider: 'Torne-se um Profissional', becomeProviderDesc: 'Comece a ganhar dinheiro com Brazos',
          switchToProvider: 'Mudar para modo Profissional', switchToProviderDesc: 'Acessar seu painel de profissional',
          approvalPending: 'Aprovação Pendente', approvalPendingDesc: 'Seu perfil está em análise',
          continueOnboarding: 'Completar Cadastro Profissional'
        }
      },
      provider: {
        home: {
          fallbackName: 'Profissional', greeting: 'Olá, {{name}}', title: 'Painel do\nProfissional', nextBookings: 'Próximos agendamentos',
          noSchedule: 'Nenhum agendamento', noScheduleDescription: 'Novos pedidos aparecerão aqui.', recentActivity: 'Atividade recente',
          noRecentActivity: 'Sem atividade recente', noRecentActivityDescription: 'Complete seus primeiros serviços para ver seu histórico.',
          stats: { earningsMonth: 'Ganhos (mês)', rating: 'Avaliação', bookings: 'Reservas', hours: 'Horas' }
        },
        orders: { tabs: { new: 'Novos', accepted: 'Aceitos', completed: 'Concluídos' }, emptyTitle: 'Nenhum pedido', emptySubtitle: 'Pedidos {{tab}} aparecerão aqui.' },
        earnings: {
          balanceLabel: 'Saldo disponível', received: 'R$ 0,00 recebido', withdrawn: 'R$ 0,00 sacado', transactions: 'Transações',
          emptyTitle: 'Nenhuma transação', emptySubtitle: 'Seus ganhos e saques aparecerão aqui.'
        },
        profile: {
          fallbackName: 'Profissional', roleLabel: 'Profissional', logout: 'Sair da conta', version: 'BRAZOS v1.0.0', languageSection: 'Idioma',
          switchToCustomer: 'Mudar para modo Cliente', switchToCustomerDesc: 'Acessar como cliente',
          menu: {
            professionalProfile: 'Perfil profissional', reviews: 'Avaliações', settings: 'Configurações', bankData: 'Dados bancários',
            notifications: 'Notificações', support: 'Ajuda e suporte'
          }
        }
      },
      onboarding: {
        title: 'Cadastro Profissional',
        saveLater: 'Salvar',
        phases: {
          SIGNUP: { short: 'Cadastro', title: 'Cadastro rápido', subtitle: 'Entre na plataforma em 2 minutos' },
          ACTIVATION: { short: 'Ativação', title: 'Ative sua conta', subtitle: 'Comece a receber pedidos (5-10 min)' },
          ENHANCEMENT: { short: 'Destaque', title: 'Destaque seu perfil', subtitle: 'Aumente sua visibilidade e ranking' }
        },
        phaseComplete: {
          signupTitle: 'Você está dentro!',
          signupSubtitle: 'Cadastro inicial concluído. Agora vamos ativar sua conta para você começar a receber pedidos.',
          activationTitle: 'Conta ativada!',
          activationSubtitle: 'Seu perfil está pronto para aparecer para clientes. Continue para destacar ainda mais seu perfil — ou envie para aprovação agora.',
          continueActivation: 'Ativar agora (5 min)',
          continueEnhancement: 'Destacar meu perfil',
          finishLater: 'Terminar depois',
          submitNow: 'Enviar para aprovação'
        },
        steps: {
          cpf: 'CPF', category: 'Categoria', details: 'Detalhes', pricing: 'Preço', availability: 'Disponibilidade', review: 'Revisão',
          account: 'Conta', categories: 'Categorias', questionnaire: 'Perguntas', services: 'Serviços', profile: 'Perfil', location: 'Localização',
          payout: 'Pagamentos', policies: 'Políticas', trust: 'Confiança'
        },
        account: {
          title: 'Cadastro profissional', subtitle: 'Escolha o tipo de cadastro. Isso define como você emite notas e recebe pagamentos.',
          types: { CPF: 'CPF', MEI: 'MEI', CNPJ: 'CNPJ' },
          typesDesc: { CPF: 'Autônomo informal', MEI: 'Microempreendedor', CNPJ: 'Empresa formal' },
          cpfLabel: 'CPF', cnpjLabel: 'CNPJ',
          razaoSocialLabel: 'Razão social', razaoSocialPlaceholder: 'Ex: Silva Serviços LTDA',
          nomeFantasiaLabel: 'Nome fantasia (opcional)', nomeFantasiaPlaceholder: 'Ex: Silva Limpezas',
          invalidCpf: 'CPF inválido.', invalidCnpj: 'CNPJ inválido.',
          hint: 'Armazenamos com segurança. Usado apenas para notas fiscais e compliance.'
        },
        payout: {
          title: 'Como você vai receber?', subtitle: 'Configure sua chave Pix para receber repasses automaticamente.',
          keyTypeLabel: 'Tipo de chave Pix',
          keyTypes: { CPF: 'CPF', CNPJ: 'CNPJ', EMAIL: 'E-mail', PHONE: 'Telefone', RANDOM: 'Aleatória' },
          keyLabel: 'Chave Pix', keyPlaceholder: 'CPF, e-mail, telefone ou chave aleatória',
          holderLabel: 'Nome do titular', holderPlaceholder: 'Nome completo do titular da conta',
          infoTitle: 'Repasses via Pix', infoBody: 'Os valores dos serviços concluídos são repassados via Pix em até 1 dia útil após a confirmação do cliente.'
        },
        policies: {
          title: 'Políticas & diferenciais', subtitle: 'Configure como você trabalha e o que te destaca.',
          cancellationTitle: 'Política de cancelamento',
          cancellation: {
            FLEXIBLE: { title: 'Flexível', desc: 'Reembolso total até 1h antes do serviço.' },
            MODERATE: { title: 'Moderada', desc: 'Reembolso total até 24h antes. Após, 50%.' },
            STRICT: { title: 'Rígida', desc: 'Sem reembolso após confirmação do agendamento.' }
          },
          languagesTitle: 'Idiomas que você atende',
          languages: { PT: 'Português', EN: 'Inglês', ES: 'Espanhol' },
          emergencyTitle: 'Atendimento de emergência', emergencyDesc: 'Permitir solicitações de última hora (filtro premium).',
          travelTitle: 'Taxa de deslocamento',
          freeRadiusLabel: 'Raio grátis (km)', perKmLabel: 'Valor por km',
          referralTitle: 'Código de indicação', referralPlaceholder: 'Ex: MARIA2025',
          referralHint: 'Se alguém te indicou, insira o código aqui.'
        },
        trust: {
          title: 'Confiança & verificação', subtitle: 'Esses itens aumentam sua visibilidade e conversão. Envios são opcionais, consentimentos são obrigatórios.',
          verificationTitle: 'Verificação (opcional, recomendado)',
          selfieTitle: 'Selfie de verificação', selfieDesc: 'Comparamos com sua foto de perfil para prevenir perfis falsos.', selfieError: 'Não foi possível abrir a câmera.',
          bgTitle: 'Antecedentes criminais', bgDesc: 'Envie seu atestado — selo de confiança extra no seu perfil.',
          insuranceTitle: 'Seguro de responsabilidade', insuranceDesc: 'Tenho seguro que cobre danos durante o serviço.',
          consentsTitle: 'Consentimentos obrigatórios',
          lgpdTitle: 'LGPD — Lei Geral de Proteção de Dados', lgpdDesc: 'Autorizo o tratamento dos meus dados conforme nossa política de privacidade.',
          tosTitle: 'Termos de Uso', tosDesc: 'Li e concordo com os Termos de Uso da plataforma.',
          contractorTitle: 'Contrato do profissional', contractorDesc: 'Aceito o contrato de prestação de serviços autônomos com a BRAZOS.',
          uploaded: 'Enviado'
        },
        categories: {
          title: 'O que você oferece?', subtitle: 'Selecione suas categorias, especialidades e serviços. Você pode escolher mais de uma.',
          summary: '{{categories}} categoria(s) · {{services}} serviço(s)',
          catMeta: '{{subs}} especialidade(s) · {{services}} serviço(s)',
          tapToPick: 'Toque para escolher especialidades', selectedCount: '{{n}} selecionado(s)',
          suggestNew: 'Sugerir nova especialidade', suggestPlaceholder: 'Ex: Instalação de painéis solares...', suggestSend: 'Enviar',
          suggestionSentTitle: 'Sugestão enviada', suggestionSentDesc: 'Nossa equipe revisará sua sugestão em breve.'
        },
        questionnaire: {
          title: 'Conte-nos sobre seu trabalho', subtitle: 'Responda algumas perguntas para que possamos conectá-lo aos clientes certos.'
        },
        services: {
          title: 'Construa seus serviços', subtitle: 'Crie ofertas claras com preço, duração e adicionais.',
          emptyTitle: 'Nenhum serviço ainda', emptyDesc: 'Adicione pelo menos um serviço para continuar.',
          addService: 'Adicionar serviço', editorTitle: 'Editar serviço', saveService: 'Salvar serviço',
          titleLabel: 'Título do serviço', titlePlaceholder: 'Ex: Limpeza pesada residencial',
          descLabel: 'Descrição', descPlaceholder: 'O que está incluído neste serviço?',
          subcategoryLabel: 'Especialidade relacionada',
          pricingLabel: 'Modelo de preço',
          pricingFixed: 'Fixo', pricingHourly: 'Por hora', pricingStarting: 'A partir de', pricingQuote: 'Sob consulta', pricingQuoteShort: 'Sob consulta',
          priceLabel: 'Preço (R$)', durationLabel: 'Duração',
          addOnsTitle: 'Adicionais', addAddOn: 'Adicionar', edit: 'Editar',
          addOnNamePh: 'Nome do adicional', addOnDescPh: 'Descrição (opcional)',
          untitled: 'Sem título', titleTooShort: 'Título precisa ter pelo menos 3 caracteres.', noCategoryFirst: 'Selecione ao menos uma categoria primeiro.'
        },
        profilePro: {
          title: 'Perfil profissional', subtitle: 'Sua vitrine para conquistar mais clientes.',
          photoLabel: 'Toque para adicionar uma foto', photoError: 'Não foi possível selecionar a foto.',
          bioLabel: 'Biografia', bioPlaceholder: 'Fale sobre sua experiência, estilo de trabalho e diferenciais...',
          experienceLabel: 'Anos de experiência',
          portfolioTitle: 'Portfólio', portfolioDesc: 'Mostre seu trabalho com fotos (até 6).', addPhotos: 'Adicionar fotos',
          certsTitle: 'Certificações e licenças', certsDesc: 'Envie documentos para agilizar sua verificação.',
          certNamePlaceholder: 'Nome do certificado', uploadDoc: 'Enviar documento'
        },
        coverage: {
          title: 'Cobertura e agendamento', subtitle: 'Onde você atende e como deseja receber pedidos.',
          baseAddressLabel: 'Endereço base', baseAddressPlaceholder: 'Rua, bairro...',
          cityLabel: 'Cidade', cityPlaceholder: 'São Paulo', stateLabel: 'UF',
          useGps: 'Usar minha localização', locating: 'Localizando...',
          gpsPermission: 'Permissão de localização negada.', gpsError: 'Não foi possível obter sua localização.', gpsUnavailable: 'GPS indisponível.',
          radiusLabel: 'Raio de atendimento', radiusHint: 'Distância máxima que você está disposto a viajar.',
          zipLabel: 'CEPs específicos (opcional)', zipPlaceholder: '00000-000',
          bookingModelLabel: 'Como deseja receber pedidos?', bookingModelHint: 'Você pode alterar depois.',
          instantTitle: 'Agendamento instantâneo', instantDesc: 'Clientes reservam direto pelo seu calendário.',
          requestTitle: 'Solicitação com aprovação', requestDesc: 'Você aprova cada pedido antes de confirmar.'
        },
        cpf: {
          title: 'Informe seu CPF', subtitle: 'Precisamos do seu CPF para cadastro profissional e emissão de notas fiscais.',
          hint: 'Seu CPF é armazenado com segurança e usado apenas para fins fiscais e regulatórios.'
        },
        category: {
          title: 'Qual serviço você oferece?', subtitle: 'Selecione a categoria do seu serviço.',
          selectSubcategory: 'Escolha sua especialidade', selectServices: 'Selecione os serviços que você oferece.',
          home: 'Casa', homeDesc: 'Limpeza, reparos, manutenção',
          beauty: 'Beleza', beautyDesc: 'Cabelo, unhas, estética',
          health: 'Saúde', healthDesc: 'Bem-estar, massagem, cuidados',
          chef: 'Chef', chefDesc: 'Culinária, eventos, refeições'
        },
        details: {
          title: 'Descreva seu serviço', subtitle: 'Conte aos clientes sobre você.',
          serviceTitleLabel: 'Título do serviço', serviceTitlePlaceholder: 'Ex: Limpeza residencial profissional',
          descriptionLabel: 'Descrição', descriptionPlaceholder: 'Descreva sua experiência e o que você oferece...',
          serviceAreaLabel: 'Área de atendimento', serviceAreaPlaceholder: 'Ex: São Paulo - Zona Sul',
          experienceLabel: 'Anos de experiência'
        },
        pricing: {
          title: 'Defina seu preço', subtitle: 'Quanto você cobra por hora?',
          priceLabel: 'Preço por hora (R$)', pricePlaceholder: '0,00',
          hint: 'Você pode alterar o preço a qualquer momento.'
        },
        availability: {
          title: 'Sua disponibilidade', subtitle: 'Quais dias e horários você trabalha?',
          days: { monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta', thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo' },
          start: 'Início', end: 'Fim'
        },
        review: {
          title: 'Revise seu perfil', subtitle: 'Confira os dados antes de enviar.',
          categoryLabel: 'Categoria', serviceLabel: 'Serviço', descriptionLabel: 'Descrição',
          subcategoryLabel: 'Especialidade', servicesLabel: 'Serviços oferecidos',
          areaLabel: 'Área', experienceLabel: 'Experiência', priceLabel: 'Preço/hora',
          availabilityLabel: 'Disponibilidade', yearsUnit: 'anos',
          categoriesLabel: 'Categorias', questionnaireLabel: 'Questionário', profileLabel: 'Perfil', coverageLabel: 'Cobertura',
          accountLabel: 'Cadastro', payoutLabel: 'Recebimento', policiesLabel: 'Políticas', trustLabel: 'Consentimentos',
          qualityScoreLabel: 'Pontuação do perfil', qualityScoreHint: 'Perfis mais completos recebem mais pedidos.',
          incomplete: 'Incompleto', accepted: 'Aceito',
          submit: 'Enviar para aprovação', editing: 'Editar'
        },
        submitted: {
          title: 'Cadastro enviado!', subtitle: 'Seu perfil profissional foi enviado para análise. Você será notificado quando for aprovado.',
          backToHome: 'Voltar ao início', failure: 'Não foi possível enviar. Tente novamente.'
        }
      },
      placeholders: {
        chat: { title: 'Chat', subtitle: 'Converse com seu profissional ou cliente em tempo real.' },
        customer: {
          activeBooking: { title: 'Reserva Ativa', subtitle: 'Acompanhe o status da sua reserva em tempo real.' },
          tracking: { title: 'Rastreamento', subtitle: 'Acompanhe a localização do profissional no mapa.' },
          history: { title: 'Histórico', subtitle: 'Veja todas as suas reservas anteriores.' },
          review: { title: 'Avaliação', subtitle: 'Avalie o profissional e compartilhe sua experiência.' },
          categoryBrowse: { title: 'Explorar Categoria', subtitle: 'Navegue por profissionais disponíveis nesta categoria.' },
          providerDetail: { title: 'Perfil do Profissional', subtitle: 'Veja avaliações, preços e disponibilidade do profissional.' },
          bookingFlow: { title: 'Agendar Serviço', subtitle: 'Escolha data, horário e confirme seu agendamento.' }
        },
        provider: {
          activeBooking: { title: 'Serviço Ativo', subtitle: 'Gerencie o serviço em andamento e atualize o status.' },
          schedule: { title: 'Agenda', subtitle: 'Gerencie seus horários disponíveis e agendamentos confirmados.' },
          approvalPending: { title: 'Aprovação Pendente', subtitle: 'Seu perfil está sendo analisado. Avisaremos quando for aprovado.' },
          onboardingWizard: { title: 'Cadastro Profissional', subtitle: 'Complete seu perfil profissional para começar a receber pedidos.' }
        }
      },
      navigation: {
        chatTitle: 'Chat',
        customerBookings: { root: 'Reservas', activeBooking: 'Reserva Ativa', tracking: 'Rastreamento', history: 'Histórico', review: 'Avaliação' },
        customerExplore: { root: 'Explorar' }, customerHome: { categoryBrowse: 'Categoria', providerDetail: 'Profissional', bookingFlow: 'Agendar' },
        customerProfile: { root: 'Perfil' }, providerEarnings: { root: 'Ganhos' }, providerHome: { onboardingWizard: 'Cadastro Profissional', approvalPending: 'Aprovação' },
        providerOrders: { root: 'Pedidos', activeBooking: 'Serviço Ativo' }, providerProfile: { root: 'Perfil' }, providerSchedule: { root: 'Agenda' }
      },
      booking: {
        steps: { cpf: 'CPF', address: 'Endereço', payment: 'Pagamento', addOns: 'Adicionais', summary: 'Resumo' },
        flow: { demoService: 'Limpeza residencial' },
        cpf: {
          title: 'Informe seu CPF', subtitle: 'Precisamos do seu CPF para emitir notas fiscais e garantir sua segurança.',
          invalid: 'CPF inválido. Verifique os números.', incomplete: 'CPF incompleto.',
          hint: 'Seu CPF é armazenado com segurança e usado apenas para fins fiscais.'
        },
        address: {
          title: 'Endereço do serviço', subtitle: 'Onde o serviço será realizado?',
          addTitle: 'Novo endereço', editTitle: 'Editar endereço',
          labelField: 'Tipo de endereço', labels: { home: 'Casa', work: 'Trabalho', travel: 'Viagem', other: 'Outro' },
          customLabelPlaceholder: 'Nome personalizado', useGps: 'Usar minha localização atual',
          streetField: 'Rua', streetPlaceholder: 'Nome da rua',
          numberField: 'Número', complementField: 'Complemento', complementPlaceholder: 'Apto, bloco...',
          neighborhoodField: 'Bairro', neighborhoodPlaceholder: 'Nome do bairro',
          cityField: 'Cidade', cityPlaceholder: 'Nome da cidade', stateField: 'UF', zipField: 'CEP',
          recipientToggle: 'Serviço para outra pessoa?',
          recipientNamePlaceholder: 'Nome do destinatário', recipientPhonePlaceholder: 'Telefone do destinatário',
          addButton: 'Salvar endereço', saveChanges: 'Salvar alterações', addNew: 'Adicionar novo endereço',
          deleteTitle: 'Excluir endereço', deleteMessage: 'Tem certeza que deseja excluir este endereço?', deleteConfirm: 'Excluir',
          gpsDetected: 'Localização detectada', gpsError: 'Não foi possível obter sua localização.', gpsPermission: 'Permissão de localização negada.',
          default: 'Padrão', setAsDefault: 'Definir como endereço padrão'
        },
        payment: {
          title: 'Método de pagamento', subtitle: 'Como deseja pagar pelo serviço?',
          addTitle: 'Adicionar pagamento', typeLabel: 'Tipo de pagamento', card: 'Cartão',
          pixKeyLabel: 'Chave Pix', pixKeyPlaceholder: 'CPF, e-mail, telefone ou chave aleatória',
          pixHint: 'Insira sua chave Pix para pagamentos instantâneos.',
          cardLabelField: 'Nome do cartão', cardLabelPlaceholder: 'Ex: Nubank, Itaú...',
          lastFourField: 'Últimos 4 dígitos', cardHint: 'A integração completa com gateway será adicionada em breve.',
          setDefault: 'Definir como pagamento padrão', addButton: 'Salvar método', addNew: 'Adicionar novo método',
          deleteTitle: 'Excluir método', deleteMessage: 'Tem certeza que deseja excluir este método de pagamento?', deleteConfirm: 'Excluir'
        },
        summary: {
          title: 'Resumo da reserva', subtitle: 'Confira os detalhes antes de confirmar.',
          provider: 'Profissional', dateTime: 'Data e horário', address: 'Endereço', payment: 'Pagamento',
          noProvider: 'Nenhum profissional selecionado', noDate: 'Data não selecionada',
          noAddress: 'Nenhum endereço selecionado', noPayment: 'Nenhum pagamento selecionado',
          notesLabel: 'Observações', notesPlaceholder: 'Informações adicionais para o profissional...',
          total: 'Total', confirmTitle: 'Confirmar reserva?', confirmMessage: 'Deseja confirmar esta reserva?',
          confirmButton: 'Confirmar reserva', successTitle: 'Reserva confirmada!', successMessage: 'Sua reserva foi realizada com sucesso.',
          service: 'Serviço'
        },
        addOns: {
          title: 'Adicionais', subtitle: 'Personalize seu serviço com extras opcionais.',
          perHour: 'Por hora', fixed: 'Valor fixo', perJob: 'Por serviço', perSession: 'Por sessão', perUnit: 'Por unidade',
          addOnsTotal: 'Total dos adicionais', quoteOnRequest: 'Sob consulta',
          continueWith: 'Continuar com {{count}} extra(s)', skip: 'Pular extras',
          items: {
            cleaning_supplies: { name: 'Produtos de limpeza', desc: 'Produtos profissionais inclusos' },
            inside_fridge: { name: 'Limpeza interna da geladeira', desc: 'Limpeza completa do interior' },
            inside_oven: { name: 'Limpeza interna do forno', desc: 'Remoção de gordura e sujeira' },
            laundry_fold: { name: 'Lavar e dobrar roupas', desc: 'Lavagem e organização de roupas' },
            ironing: { name: 'Passar roupas', desc: 'Serviço de passar roupas' },
            organize_closets: { name: 'Organizar armários', desc: 'Organização completa de armários' },
            emergency_surcharge: { name: 'Taxa de emergência', desc: 'Atendimento urgente/emergencial' },
            materials_included: { name: 'Materiais inclusos', desc: 'Peças e materiais necessários' },
            warranty_extension: { name: 'Garantia estendida', desc: 'Garantia adicional do serviço' },
            debris_removal: { name: 'Remoção de entulho', desc: 'Limpeza e descarte de resíduos' },
            weekend_surcharge: { name: 'Taxa de fim de semana', desc: 'Atendimento aos sábados e domingos' },
            holiday_surcharge: { name: 'Taxa de feriado', desc: 'Atendimento em feriados' },
            premium_products: { name: 'Produtos premium', desc: 'Uso de produtos de alta qualidade' },
            deep_conditioning: { name: 'Hidratação profunda', desc: 'Tratamento capilar intensivo' },
            scalp_massage: { name: 'Massagem no couro cabeludo', desc: 'Relaxamento e estímulo capilar' },
            blowout_addon: { name: 'Escova adicional', desc: 'Escova profissional' },
            nail_art_addon: { name: 'Nail art', desc: 'Decoração artística nas unhas' },
            gel_removal: { name: 'Remoção de gel', desc: 'Remoção segura de esmalte em gel' },
            hand_massage: { name: 'Massagem nas mãos', desc: 'Relaxamento e hidratação' },
            paraffin_treatment: { name: 'Tratamento de parafina', desc: 'Hidratação intensa com parafina' },
            travel_fee: { name: 'Taxa de deslocamento', desc: 'Custo de transporte até o local' },
            night_shift: { name: 'Plantão noturno', desc: 'Atendimento no período noturno' },
            medical_report: { name: 'Relatório médico', desc: 'Relatório detalhado do atendimento' },
            equipment_rental: { name: 'Aluguel de equipamentos', desc: 'Equipamentos especializados' },
            progress_report: { name: 'Relatório de progresso', desc: 'Acompanhamento da evolução' },
            home_exercise_plan: { name: 'Plano de exercícios', desc: 'Exercícios para fazer em casa' },
            grocery_shopping: { name: 'Compra de ingredientes', desc: 'Seleção e compra no mercado' },
            kitchen_cleanup: { name: 'Limpeza da cozinha', desc: 'Limpeza completa após o serviço' },
            meal_storage: { name: 'Armazenamento de refeições', desc: 'Porcionamento e armazenamento' },
            dietary_consultation: { name: 'Consultoria alimentar', desc: 'Orientação nutricional personalizada' },
            table_setup: { name: 'Montagem de mesa', desc: 'Decoração e organização da mesa' },
            waitstaff: { name: 'Garçom/Garçonete', desc: 'Serviço de mesa profissional' },
            dishwashing: { name: 'Lavagem de louça', desc: 'Limpeza completa da louça' }
          }
        }
      },
      status: { pending: 'Pendente', confirmed: 'Confirmado', inProgress: 'Em andamento', completed: 'Concluído', cancelled: 'Cancelado' },
      promos: {
        welcome: { title: 'Bem-vindo ao BRAZOS!', subtitle: 'Encontre profissionais qualificados perto de você. Agende seu primeiro serviço agora.' },
        referral: { title: 'Indique e Ganhe', subtitle: 'Convide amigos e ganhe desconto no próximo serviço.' },
        trending: { title: 'Em Alta Agora', subtitle: 'Confira os serviços mais procurados da semana na sua região.' }
      },
      quickServices: {
        cleaning: 'Limpeza', haircut: 'Corte de Cabelo', massage: 'Massagem',
        chef: 'Chef em Casa', plumbing: 'Encanamento', nails: 'Manicure'
      },
      catalog: catalogPtBR
    }
  },
  en: {
    translation: {
      common: { appName: 'BRAZOS', back: 'Back', soon: 'Coming soon', or: 'or', continue: 'Continue' },
      locale: { portuguese: 'Português (BR)', english: 'English', spanish: 'Español' },
      auth: {
        tagline: 'Your service, your way',
        login: {
          title: 'Sign in', subtitle: 'Welcome back! Sign in to your account.', email: 'Email', password: 'Password',
          forgotPassword: 'Forgot password?', submit: 'Sign in', noAccount: "Don't have an account?", createAccount: 'Create account',
          errorTitle: 'Error', fillAllFields: 'Please fill in all fields.', failure: 'Could not sign in. Please try again.'
        },
        register: {
          headerSubtitle: 'Create your account', roleTitle: 'How do you want to use BRAZOS?', roleSubtitle: 'Choose your profile. It cannot be changed later.',
          customerTitle: 'I am looking for services', customerDescription: 'Find and hire qualified professionals',
          providerTitle: 'I am offering services', providerDescription: 'Offer your services and gain new clients', continue: 'Continue',
          detailsTitle: 'Your details', detailsSubtitleCustomer: 'Create your account to find professionals.', detailsSubtitleProvider: 'Create your account to offer your services.',
          fullName: 'Full name', fullNamePlaceholder: 'John Doe', email: 'Email', emailPlaceholder: 'you@email.com', password: 'Password',
          passwordPlaceholder: 'Minimum 8 characters', submit: 'Create account', hasAccount: 'Already have an account?', login: 'Sign in',
          errorTitle: 'Error', fillAllFields: 'Please fill in all fields.', failure: 'Could not create your account. Please try again.'
        }
      },
      bootstrap: { tagline: 'Your service, your way' },
      languageSelection: {
        title: 'Choose your language',
        subtitle: 'Select your preferred language to continue',
        confirm: 'Continue'
      },
      notFound: { title: 'Page not found', subtitle: 'This screen does not exist.', backHome: 'Back to home' },
      tabs: {
        customer: { home: 'Home', explore: 'Explore', bookings: 'Bookings', profile: 'Profile' },
        provider: { home: 'Home', orders: 'Orders', schedule: 'Schedule', earnings: 'Earnings', profile: 'Profile' }
      },
      customer: {
        home: {
          greeting: 'Hi, {{name}}', title: 'What do you need\ntoday?', highlights: 'Highlights', featuredBadge: 'New',
          featuredTitle: 'Find professionals near you', featuredDescription: 'Explore high-quality services with transparent pricing and secure payment.',
          nextBookings: 'Upcoming bookings', noBookings: 'No bookings scheduled', noBookingsDescription: 'Explore professionals to book your first service', fallbackName: 'Hi',
          quickServicesTitle: 'Popular Services', seeAll: 'See all',
          promoAvailNow: 'Available Now', promoAvailNowDesc: 'Professionals ready to serve you today',
          promoVerified: 'Verified Pros', promoVerifiedDesc: 'Background-checked & certified',
          categories: {
            home: { label: 'Home', subtitle: 'Cleaning, repairs & more' }, beauty: { label: 'Beauty', subtitle: 'Hair, nails & aesthetics' },
            health: { label: 'Health', subtitle: 'Wellness & care' }, chef: { label: 'Chef', subtitle: 'Cuisine & events' }
          }
        },
        explore: {
          searchPlaceholder: 'Search services, professionals...', title: 'Explore professionals', subtitle: 'Search by service or professional in your area.',
          popularServices: 'Popular Services', trending: 'Trending', results: 'results', noResults: 'No results found', noResultsHint: 'Try searching for a different service',
          filters: {
            title: 'Filters', reset: 'Reset', apply: 'Apply filters',
            sortBy: 'Sort by', sortRelevance: 'Relevance', sortRatingHigh: 'Highest rated', sortPriceLow: 'Lowest price', sortPriceHigh: 'Highest price', sortDistance: 'Nearest', sortNewest: 'Newest',
            availability: 'Availability', availAny: 'Any', availNow: 'Available now', availToday: 'Today', availWeek: 'This week',
            rating: 'Rating', ratingAny: 'Any', topRated: 'Top rated',
            priceRange: 'Price range', priceAny: 'Any', priceBudget: 'Budget', priceMid: 'Mid-range', pricePremium: 'Premium',
            category: 'Category', catAll: 'All',
            lowestPrice: 'Lowest price', nearby: 'Near me'
          }
        },
        bookings: { tabs: { active: 'Active', completed: 'Completed', cancelled: 'Cancelled' }, emptyTitle: 'No bookings', emptySubtitle: 'Your {{tab}} bookings will appear here.' },
        profile: {
          fallbackName: 'User', logout: 'Sign out', version: 'BRAZOS v1.0.0', languageSection: 'Language',
          menu: { settings: 'Settings', paymentMethods: 'Payment methods', notifications: 'Notifications', support: 'Help & support' },
          becomeProvider: 'Become a Service Provider', becomeProviderDesc: 'Start earning money with Brazos',
          switchToProvider: 'Switch to Provider Mode', switchToProviderDesc: 'Access your professional dashboard',
          approvalPending: 'Approval Pending', approvalPendingDesc: 'Your profile is under review',
          continueOnboarding: 'Complete Professional Signup'
        }
      },
      provider: {
        home: {
          fallbackName: 'Professional', greeting: 'Hi, {{name}}', title: 'Professional\nDashboard', nextBookings: 'Upcoming appointments', noSchedule: 'No appointments',
          noScheduleDescription: 'New orders will appear here.', recentActivity: 'Recent activity', noRecentActivity: 'No recent activity',
          noRecentActivityDescription: 'Complete your first services to see your history.', stats: { earningsMonth: 'Earnings (month)', rating: 'Rating', bookings: 'Bookings', hours: 'Hours' }
        },
        orders: { tabs: { new: 'New', accepted: 'Accepted', completed: 'Completed' }, emptyTitle: 'No orders', emptySubtitle: '{{tab}} orders will appear here.' },
        earnings: {
          balanceLabel: 'Available balance', received: 'R$ 0.00 received', withdrawn: 'R$ 0.00 withdrawn', transactions: 'Transactions',
          emptyTitle: 'No transactions', emptySubtitle: 'Your earnings and withdrawals will appear here.'
        },
        profile: {
          fallbackName: 'Professional', roleLabel: 'Professional', logout: 'Sign out', version: 'BRAZOS v1.0.0', languageSection: 'Language',
          switchToCustomer: 'Switch to Customer Mode', switchToCustomerDesc: 'Access as a customer',
          menu: {
            professionalProfile: 'Professional profile', reviews: 'Reviews', settings: 'Settings', bankData: 'Bank details',
            notifications: 'Notifications', support: 'Help & support'
          }
        }
      },
      onboarding: {
        title: 'Professional Onboarding',
        saveLater: 'Save',
        phases: {
          SIGNUP: { short: 'Sign up', title: 'Quick sign up', subtitle: 'Join the platform in 2 minutes' },
          ACTIVATION: { short: 'Activate', title: 'Activate your account', subtitle: 'Start receiving orders (5-10 min)' },
          ENHANCEMENT: { short: 'Stand out', title: 'Stand out', subtitle: 'Boost your visibility & ranking' }
        },
        phaseComplete: {
          signupTitle: "You're in!",
          signupSubtitle: 'Initial sign up complete. Now let\'s activate your account so you can start receiving orders.',
          activationTitle: 'Account activated!',
          activationSubtitle: 'Your profile is ready to be shown to clients. Continue to stand out even more — or submit for approval now.',
          continueActivation: 'Activate now (5 min)',
          continueEnhancement: 'Boost my profile',
          finishLater: 'Finish later',
          submitNow: 'Submit for approval'
        },
        steps: {
          cpf: 'CPF', category: 'Category', details: 'Details', pricing: 'Pricing', availability: 'Availability', review: 'Review',
          account: 'Account', categories: 'Categories', questionnaire: 'Questions', services: 'Services', profile: 'Profile', location: 'Location',
          payout: 'Payouts', policies: 'Policies', trust: 'Trust'
        },
        account: {
          title: 'Professional registration', subtitle: 'Pick your registration type. This defines how you invoice and get paid.',
          types: { CPF: 'CPF', MEI: 'MEI', CNPJ: 'CNPJ' },
          typesDesc: { CPF: 'Independent', MEI: 'Micro-entrepreneur', CNPJ: 'Registered company' },
          cpfLabel: 'CPF', cnpjLabel: 'CNPJ',
          razaoSocialLabel: 'Legal name', razaoSocialPlaceholder: 'e.g. Silva Services LTDA',
          nomeFantasiaLabel: 'Trade name (optional)', nomeFantasiaPlaceholder: 'e.g. Silva Cleaning',
          invalidCpf: 'Invalid CPF.', invalidCnpj: 'Invalid CNPJ.',
          hint: 'Stored securely. Used only for tax and compliance.'
        },
        payout: {
          title: 'How will you get paid?', subtitle: 'Set up your Pix key to receive automatic payouts.',
          keyTypeLabel: 'Pix key type',
          keyTypes: { CPF: 'CPF', CNPJ: 'CNPJ', EMAIL: 'Email', PHONE: 'Phone', RANDOM: 'Random' },
          keyLabel: 'Pix key', keyPlaceholder: 'CPF, email, phone or random key',
          holderLabel: 'Account holder', holderPlaceholder: 'Full name of the account holder',
          infoTitle: 'Payouts via Pix', infoBody: 'Completed service payments are sent via Pix within 1 business day after client confirmation.'
        },
        policies: {
          title: 'Policies & perks', subtitle: 'Set how you work and what makes you stand out.',
          cancellationTitle: 'Cancellation policy',
          cancellation: {
            FLEXIBLE: { title: 'Flexible', desc: 'Full refund up to 1h before service.' },
            MODERATE: { title: 'Moderate', desc: 'Full refund up to 24h before. After that, 50%.' },
            STRICT: { title: 'Strict', desc: 'No refund after booking confirmation.' }
          },
          languagesTitle: 'Languages you speak',
          languages: { PT: 'Portuguese', EN: 'English', ES: 'Spanish' },
          emergencyTitle: 'Emergency availability', emergencyDesc: 'Accept last-minute requests (premium filter).',
          travelTitle: 'Travel fee',
          freeRadiusLabel: 'Free radius (km)', perKmLabel: 'Per km rate',
          referralTitle: 'Referral code', referralPlaceholder: 'e.g. MARIA2025',
          referralHint: 'If someone referred you, enter their code here.'
        },
        trust: {
          title: 'Trust & verification', subtitle: 'These items boost your visibility. Uploads are optional, consents are required.',
          verificationTitle: 'Verification (optional, recommended)',
          selfieTitle: 'Verification selfie', selfieDesc: 'We compare with your profile photo to prevent fake accounts.', selfieError: 'Could not open the camera.',
          bgTitle: 'Background check', bgDesc: 'Upload a clean record certificate — extra trust badge on your profile.',
          insuranceTitle: 'Liability insurance', insuranceDesc: 'I carry insurance that covers damages during service.',
          consentsTitle: 'Required consents',
          lgpdTitle: 'LGPD — Brazilian Data Protection Law', lgpdDesc: 'I authorize the processing of my data according to the privacy policy.',
          tosTitle: 'Terms of Service', tosDesc: 'I have read and agree to the platform Terms of Service.',
          contractorTitle: 'Contractor agreement', contractorDesc: 'I accept the independent contractor agreement with BRAZOS.',
          uploaded: 'Uploaded'
        },
        categories: {
          title: 'What do you offer?', subtitle: 'Pick your categories, specialties and services. You can select more than one.',
          summary: '{{categories}} category · {{services}} service(s)',
          catMeta: '{{subs}} specialty · {{services}} service(s)',
          tapToPick: 'Tap to choose specialties', selectedCount: '{{n}} selected',
          suggestNew: 'Suggest new specialty', suggestPlaceholder: 'E.g. Solar panel installation...', suggestSend: 'Send',
          suggestionSentTitle: 'Suggestion sent', suggestionSentDesc: 'Our team will review your suggestion soon.'
        },
        questionnaire: {
          title: 'Tell us about your work', subtitle: 'Answer a few questions so we can match you with the right clients.'
        },
        services: {
          title: 'Build your services', subtitle: 'Create clear offerings with pricing, duration and add-ons.',
          emptyTitle: 'No services yet', emptyDesc: 'Add at least one service to continue.',
          addService: 'Add service', editorTitle: 'Edit service', saveService: 'Save service',
          titleLabel: 'Service title', titlePlaceholder: 'E.g. Deep home cleaning',
          descLabel: 'Description', descPlaceholder: 'What’s included in this service?',
          subcategoryLabel: 'Linked specialty',
          pricingLabel: 'Pricing model',
          pricingFixed: 'Fixed', pricingHourly: 'Hourly', pricingStarting: 'Starting at', pricingQuote: 'Custom quote', pricingQuoteShort: 'On request',
          priceLabel: 'Price (R$)', durationLabel: 'Duration',
          addOnsTitle: 'Add-ons', addAddOn: 'Add', edit: 'Edit',
          addOnNamePh: 'Add-on name', addOnDescPh: 'Description (optional)',
          untitled: 'Untitled', titleTooShort: 'Title needs at least 3 characters.', noCategoryFirst: 'Please select a category first.'
        },
        profilePro: {
          title: 'Professional profile', subtitle: 'Your showcase to win more clients.',
          photoLabel: 'Tap to add a photo', photoError: 'Could not pick the photo.',
          bioLabel: 'Bio', bioPlaceholder: 'Tell clients about your experience and what makes you unique...',
          experienceLabel: 'Years of experience',
          portfolioTitle: 'Portfolio', portfolioDesc: 'Show your work with photos (up to 6).', addPhotos: 'Add photos',
          certsTitle: 'Certifications & licenses', certsDesc: 'Upload documents to speed up verification.',
          certNamePlaceholder: 'Certificate name', uploadDoc: 'Upload document'
        },
        coverage: {
          title: 'Coverage & booking', subtitle: 'Where you work and how you want to receive bookings.',
          baseAddressLabel: 'Base address', baseAddressPlaceholder: 'Street, neighborhood...',
          cityLabel: 'City', cityPlaceholder: 'São Paulo', stateLabel: 'State',
          useGps: 'Use my location', locating: 'Locating...',
          gpsPermission: 'Location permission denied.', gpsError: 'Could not get your location.', gpsUnavailable: 'GPS unavailable.',
          radiusLabel: 'Service radius', radiusHint: 'Maximum distance you are willing to travel.',
          zipLabel: 'Specific ZIPs (optional)', zipPlaceholder: '00000-000',
          bookingModelLabel: 'How do you want bookings?', bookingModelHint: 'You can change this later.',
          instantTitle: 'Instant booking', instantDesc: 'Clients book directly from your calendar.',
          requestTitle: 'Request-based', requestDesc: 'You approve each request before confirming.'
        },
        cpf: {
          title: 'Enter your CPF', subtitle: 'We need your CPF for professional registration and invoice issuance.',
          hint: 'Your CPF is stored securely and used only for tax and regulatory purposes.'
        },
        category: {
          title: 'What service do you offer?', subtitle: 'Select your service category.',
          selectSubcategory: 'Choose your specialty', selectServices: 'Select the services you offer.',
          home: 'Home', homeDesc: 'Cleaning, repairs, maintenance',
          beauty: 'Beauty', beautyDesc: 'Hair, nails, aesthetics',
          health: 'Health', healthDesc: 'Wellness, massage, care',
          chef: 'Chef', chefDesc: 'Cuisine, events, meals'
        },
        details: {
          title: 'Describe your service', subtitle: 'Tell clients about yourself.',
          serviceTitleLabel: 'Service title', serviceTitlePlaceholder: 'E.g.: Professional house cleaning',
          descriptionLabel: 'Description', descriptionPlaceholder: 'Describe your experience and what you offer...',
          serviceAreaLabel: 'Service area', serviceAreaPlaceholder: 'E.g.: Downtown Manhattan',
          experienceLabel: 'Years of experience'
        },
        pricing: {
          title: 'Set your price', subtitle: 'How much do you charge per hour?',
          priceLabel: 'Price per hour (R$)', pricePlaceholder: '0.00',
          hint: 'You can change your price at any time.'
        },
        availability: {
          title: 'Your availability', subtitle: 'Which days and hours do you work?',
          days: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
          start: 'Start', end: 'End'
        },
        review: {
          title: 'Review your profile', subtitle: 'Check your details before submitting.',
          categoryLabel: 'Category', serviceLabel: 'Service', descriptionLabel: 'Description',
          subcategoryLabel: 'Specialty', servicesLabel: 'Services offered',
          areaLabel: 'Area', experienceLabel: 'Experience', priceLabel: 'Price/hour',
          availabilityLabel: 'Availability', yearsUnit: 'years',
          categoriesLabel: 'Categories', questionnaireLabel: 'Questionnaire', profileLabel: 'Profile', coverageLabel: 'Coverage',
          accountLabel: 'Registration', payoutLabel: 'Payout', policiesLabel: 'Policies', trustLabel: 'Consents',
          qualityScoreLabel: 'Profile quality score', qualityScoreHint: 'More complete profiles get more bookings.',
          incomplete: 'Incomplete', accepted: 'Accepted',
          submit: 'Submit for approval', editing: 'Edit'
        },
        submitted: {
          title: 'Application submitted!', subtitle: 'Your professional profile has been submitted for review. You will be notified when approved.',
          backToHome: 'Back to home', failure: 'Could not submit. Please try again.'
        }
      },
      placeholders: {
        chat: { title: 'Chat', subtitle: 'Talk to your professional or customer in real time.' },
        customer: {
          activeBooking: { title: 'Active Booking', subtitle: 'Track your booking status in real time.' },
          tracking: { title: 'Tracking', subtitle: 'Track the professional location on the map.' },
          history: { title: 'History', subtitle: 'See all your previous bookings.' },
          review: { title: 'Review', subtitle: 'Rate the professional and share your experience.' },
          categoryBrowse: { title: 'Browse Category', subtitle: 'Browse available professionals in this category.' },
          providerDetail: { title: 'Professional Profile', subtitle: 'See ratings, prices, and professional availability.' },
          bookingFlow: { title: 'Book Service', subtitle: 'Choose date, time, and confirm your booking.' }
        },
        provider: {
          activeBooking: { title: 'Active Service', subtitle: 'Manage the ongoing service and update status.' },
          schedule: { title: 'Schedule', subtitle: 'Manage your availability and confirmed appointments.' },
          approvalPending: { title: 'Approval Pending', subtitle: 'Your profile is being reviewed. We will notify you when approved.' },
          onboardingWizard: { title: 'Professional Onboarding', subtitle: 'Complete your professional profile to start receiving orders.' }
        }
      },
      navigation: {
        chatTitle: 'Chat',
        customerBookings: { root: 'Bookings', activeBooking: 'Active Booking', tracking: 'Tracking', history: 'History', review: 'Review' },
        customerExplore: { root: 'Explore' }, customerHome: { categoryBrowse: 'Category', providerDetail: 'Professional', bookingFlow: 'Book' },
        customerProfile: { root: 'Profile' }, providerEarnings: { root: 'Earnings' }, providerHome: { onboardingWizard: 'Professional Onboarding', approvalPending: 'Approval' },
        providerOrders: { root: 'Orders', activeBooking: 'Active Service' }, providerProfile: { root: 'Profile' }, providerSchedule: { root: 'Schedule' }
      },
      booking: {
        steps: { cpf: 'CPF', address: 'Address', payment: 'Payment', addOns: 'Add-ons', summary: 'Summary' },
        flow: { demoService: 'House cleaning' },
        cpf: {
          title: 'Enter your CPF', subtitle: 'We need your CPF to issue invoices and ensure your safety.',
          invalid: 'Invalid CPF. Please check the numbers.', incomplete: 'Incomplete CPF.',
          hint: 'Your CPF is stored securely and used only for tax purposes.'
        },
        address: {
          title: 'Service address', subtitle: 'Where will the service take place?',
          addTitle: 'New address', editTitle: 'Edit address',
          labelField: 'Address type', labels: { home: 'Home', work: 'Work', travel: 'Travel', other: 'Other' },
          customLabelPlaceholder: 'Custom name', useGps: 'Use my current location',
          streetField: 'Street', streetPlaceholder: 'Street name',
          numberField: 'Number', complementField: 'Unit/Apt', complementPlaceholder: 'Apt, suite...',
          neighborhoodField: 'Neighborhood', neighborhoodPlaceholder: 'Neighborhood name',
          cityField: 'City', cityPlaceholder: 'City name', stateField: 'State', zipField: 'Zip code',
          recipientToggle: 'Service for someone else?',
          recipientNamePlaceholder: 'Recipient name', recipientPhonePlaceholder: 'Recipient phone',
          addButton: 'Save address', saveChanges: 'Save changes', addNew: 'Add new address',
          deleteTitle: 'Delete address', deleteMessage: 'Are you sure you want to delete this address?', deleteConfirm: 'Delete',
          gpsDetected: 'Location detected', gpsError: 'Could not get your location.', gpsPermission: 'Location permission denied.',
          default: 'Default', setAsDefault: 'Set as default address'
        },
        payment: {
          title: 'Payment method', subtitle: 'How would you like to pay for the service?',
          addTitle: 'Add payment', typeLabel: 'Payment type', card: 'Card',
          pixKeyLabel: 'Pix key', pixKeyPlaceholder: 'CPF, email, phone, or random key',
          pixHint: 'Enter your Pix key for instant payments.',
          cardLabelField: 'Card name', cardLabelPlaceholder: 'E.g.: Visa, Mastercard...',
          lastFourField: 'Last 4 digits', cardHint: 'Full payment gateway integration coming soon.',
          setDefault: 'Set as default payment', addButton: 'Save method', addNew: 'Add new method',
          deleteTitle: 'Delete method', deleteMessage: 'Are you sure you want to delete this payment method?', deleteConfirm: 'Delete'
        },
        summary: {
          title: 'Booking summary', subtitle: 'Review the details before confirming.',
          provider: 'Professional', dateTime: 'Date & time', address: 'Address', payment: 'Payment',
          noProvider: 'No professional selected', noDate: 'Date not selected',
          noAddress: 'No address selected', noPayment: 'No payment selected',
          notesLabel: 'Notes', notesPlaceholder: 'Additional information for the professional...',
          total: 'Total', confirmTitle: 'Confirm booking?', confirmMessage: 'Do you want to confirm this booking?',
          confirmButton: 'Confirm booking', successTitle: 'Booking confirmed!', successMessage: 'Your booking has been successfully placed.',
          service: 'Service'
        },
        addOns: {
          title: 'Add-ons', subtitle: 'Customize your service with optional extras.',
          perHour: 'Per hour', fixed: 'Fixed', perJob: 'Per job', perSession: 'Per session', perUnit: 'Per unit',
          addOnsTotal: 'Add-ons total', quoteOnRequest: 'Quote on request',
          continueWith: 'Continue with {{count}} extra(s)', skip: 'Skip extras',
          items: {
            cleaning_supplies: { name: 'Cleaning supplies', desc: 'Professional products included' },
            inside_fridge: { name: 'Inside fridge cleaning', desc: 'Complete interior cleaning' },
            inside_oven: { name: 'Inside oven cleaning', desc: 'Grease and dirt removal' },
            laundry_fold: { name: 'Laundry & fold', desc: 'Wash and organize clothes' },
            ironing: { name: 'Ironing', desc: 'Clothes ironing service' },
            organize_closets: { name: 'Organize closets', desc: 'Full closet organization' },
            emergency_surcharge: { name: 'Emergency surcharge', desc: 'Urgent/emergency service' },
            materials_included: { name: 'Materials included', desc: 'Necessary parts and materials' },
            warranty_extension: { name: 'Extended warranty', desc: 'Additional service warranty' },
            debris_removal: { name: 'Debris removal', desc: 'Cleanup and waste disposal' },
            weekend_surcharge: { name: 'Weekend surcharge', desc: 'Saturday and Sunday service' },
            holiday_surcharge: { name: 'Holiday surcharge', desc: 'Service on holidays' },
            premium_products: { name: 'Premium products', desc: 'High-quality product usage' },
            deep_conditioning: { name: 'Deep conditioning', desc: 'Intensive hair treatment' },
            scalp_massage: { name: 'Scalp massage', desc: 'Relaxation and hair stimulation' },
            blowout_addon: { name: 'Blowout add-on', desc: 'Professional blowout' },
            nail_art_addon: { name: 'Nail art', desc: 'Artistic nail decoration' },
            gel_removal: { name: 'Gel removal', desc: 'Safe gel polish removal' },
            hand_massage: { name: 'Hand massage', desc: 'Relaxation and hydration' },
            paraffin_treatment: { name: 'Paraffin treatment', desc: 'Intense paraffin hydration' },
            travel_fee: { name: 'Travel fee', desc: 'Transport cost to location' },
            night_shift: { name: 'Night shift', desc: 'Nighttime service' },
            medical_report: { name: 'Medical report', desc: 'Detailed service report' },
            equipment_rental: { name: 'Equipment rental', desc: 'Specialized equipment' },
            progress_report: { name: 'Progress report', desc: 'Evolution tracking' },
            home_exercise_plan: { name: 'Exercise plan', desc: 'Home exercise program' },
            grocery_shopping: { name: 'Grocery shopping', desc: 'Ingredient selection and purchase' },
            kitchen_cleanup: { name: 'Kitchen cleanup', desc: 'Full cleanup after service' },
            meal_storage: { name: 'Meal storage', desc: 'Portioning and storage' },
            dietary_consultation: { name: 'Dietary consultation', desc: 'Personalized nutrition guidance' },
            table_setup: { name: 'Table setup', desc: 'Table decoration and arrangement' },
            waitstaff: { name: 'Waitstaff', desc: 'Professional table service' },
            dishwashing: { name: 'Dishwashing', desc: 'Complete dishwashing' }
          }
        }
      },
      promos: {
        welcome: { title: 'Welcome to BRAZOS!', subtitle: 'Find qualified professionals near you. Book your first service now.' },
        referral: { title: 'Refer & Earn', subtitle: 'Invite friends and get a discount on your next service.' },
        trending: { title: 'Trending Now', subtitle: 'Check out the most requested services this week in your area.' }
      },
      quickServices: {
        cleaning: 'Cleaning', haircut: 'Haircut', massage: 'Massage',
        chef: 'Home Chef', plumbing: 'Plumbing', nails: 'Manicure'
      },
      status: { pending: 'Pending', confirmed: 'Confirmed', inProgress: 'In progress', completed: 'Completed', cancelled: 'Cancelled' },
      catalog: catalogEn
    }
  },
  es: {
    translation: {
      common: { appName: 'BRAZOS', back: 'Volver', soon: 'Próximamente', or: 'o', continue: 'Continuar' },
      locale: { portuguese: 'Português (BR)', english: 'English', spanish: 'Español' },
      auth: {
        tagline: 'Tu servicio, a tu manera',
        login: {
          title: 'Iniciar sesión', subtitle: '¡Bienvenido de nuevo! Inicia sesión en tu cuenta.', email: 'Correo electrónico', password: 'Contraseña',
          forgotPassword: '¿Olvidaste tu contraseña?', submit: 'Iniciar sesión', noAccount: '¿No tienes una cuenta?', createAccount: 'Crear cuenta',
          errorTitle: 'Error', fillAllFields: 'Por favor, completa todos los campos.', failure: 'No se pudo iniciar sesión. Inténtalo de nuevo.'
        },
        register: {
          headerSubtitle: 'Crear tu cuenta', roleTitle: '¿Cómo deseas usar BRAZOS?', roleSubtitle: 'Elige tu perfil. No se puede cambiar después.',
          customerTitle: 'Estoy buscando servicios', customerDescription: 'Encuentra y contrata profesionales calificados',
          providerTitle: 'Estoy ofreciendo servicios', providerDescription: 'Ofrece tus servicios y consigue nuevos clientes', continue: 'Continuar',
          detailsTitle: 'Tus datos', detailsSubtitleCustomer: 'Crea tu cuenta para encontrar profesionales.', detailsSubtitleProvider: 'Crea tu cuenta para ofrecer tus servicios.',
          fullName: 'Nombre completo', fullNamePlaceholder: 'Juan Pérez', email: 'Correo electrónico', emailPlaceholder: 'tu@correo.com', password: 'Contraseña',
          passwordPlaceholder: 'Mínimo 8 caracteres', submit: 'Crear cuenta', hasAccount: '¿Ya tienes una cuenta?', login: 'Iniciar sesión',
          errorTitle: 'Error', fillAllFields: 'Por favor, completa todos los campos.', failure: 'No se pudo crear tu cuenta. Inténtalo de nuevo.'
        }
      },
      bootstrap: { tagline: 'Tu servicio, a tu manera' },
      languageSelection: {
        title: 'Elige tu idioma',
        subtitle: 'Selecciona tu idioma preferido para continuar',
        confirm: 'Continuar'
      },
      notFound: { title: 'Página no encontrada', subtitle: 'Esta pantalla no existe.', backHome: 'Volver al inicio' },
      tabs: {
        customer: { home: 'Inicio', explore: 'Explorar', bookings: 'Reservas', profile: 'Perfil' },
        provider: { home: 'Inicio', orders: 'Pedidos', schedule: 'Agenda', earnings: 'Ingresos', profile: 'Perfil' }
      },
      customer: {
        home: {
          greeting: 'Hola, {{name}}', title: '¿Qué necesitas\nhoy?', highlights: 'Destacados', featuredBadge: 'Nuevo',
          featuredTitle: 'Encuentra profesionales cerca de ti', featuredDescription: 'Explora servicios de calidad con precios transparentes y pago seguro.',
          nextBookings: 'Próximas reservas', noBookings: 'Sin reservas programadas', noBookingsDescription: 'Explora profesionales para reservar tu primer servicio', fallbackName: 'Hola',
          quickServicesTitle: 'Servicios Populares', seeAll: 'Ver todos',
          promoAvailNow: 'Disponible Ahora', promoAvailNowDesc: 'Profesionales listos para atenderte hoy',
          promoVerified: 'Pros Verificados', promoVerifiedDesc: 'Con verificación y certificación',
          categories: {
            home: { label: 'Hogar', subtitle: 'Limpieza, reparaciones y más' }, beauty: { label: 'Belleza', subtitle: 'Cabello, uñas y estética' },
            health: { label: 'Salud', subtitle: 'Bienestar y cuidados' }, chef: { label: 'Chef', subtitle: 'Cocina y eventos' }
          }
        },
        explore: {
          searchPlaceholder: 'Buscar servicios, profesionales...', title: 'Explorar profesionales', subtitle: 'Busca por servicio o profesional en tu zona.',
          popularServices: 'Servicios Populares', trending: 'Tendencia', results: 'resultados', noResults: 'Sin resultados', noResultsHint: 'Intenta buscar un servicio diferente',
          filters: {
            title: 'Filtros', reset: 'Limpiar', apply: 'Aplicar filtros',
            sortBy: 'Ordenar por', sortRelevance: 'Relevancia', sortRatingHigh: 'Mejor calificación', sortPriceLow: 'Menor precio', sortPriceHigh: 'Mayor precio', sortDistance: 'Más cercano', sortNewest: 'Más recientes',
            availability: 'Disponibilidad', availAny: 'Cualquiera', availNow: 'Disponible ahora', availToday: 'Hoy', availWeek: 'Esta semana',
            rating: 'Calificación', ratingAny: 'Cualquiera', topRated: 'Mejor calificados',
            priceRange: 'Rango de precio', priceAny: 'Cualquiera', priceBudget: 'Económico', priceMid: 'Intermedio', pricePremium: 'Premium',
            category: 'Categoría', catAll: 'Todas',
            lowestPrice: 'Menor precio', nearby: 'Cerca de mí'
          }
        },
        bookings: { tabs: { active: 'Activas', completed: 'Completadas', cancelled: 'Canceladas' }, emptyTitle: 'Sin reservas', emptySubtitle: 'Tus reservas {{tab}} aparecerán aquí.' },
        profile: {
          fallbackName: 'Usuario', logout: 'Cerrar sesión', version: 'BRAZOS v1.0.0', languageSection: 'Idioma',
          menu: { settings: 'Configuración', paymentMethods: 'Métodos de pago', notifications: 'Notificaciones', support: 'Ayuda y soporte' },
          becomeProvider: 'Conviértete en Profesional', becomeProviderDesc: 'Empieza a ganar dinero con Brazos',
          switchToProvider: 'Cambiar a modo Profesional', switchToProviderDesc: 'Accede a tu panel profesional',
          approvalPending: 'Aprobación Pendiente', approvalPendingDesc: 'Tu perfil está en revisión',
          continueOnboarding: 'Completar Registro Profesional'
        }
      },
      provider: {
        home: {
          fallbackName: 'Profesional', greeting: 'Hola, {{name}}', title: 'Panel del\nProfesional', nextBookings: 'Próximas citas', noSchedule: 'Sin citas',
          noScheduleDescription: 'Los nuevos pedidos aparecerán aquí.', recentActivity: 'Actividad reciente', noRecentActivity: 'Sin actividad reciente',
          noRecentActivityDescription: 'Completa tus primeros servicios para ver tu historial.', stats: { earningsMonth: 'Ingresos (mes)', rating: 'Calificación', bookings: 'Reservas', hours: 'Horas' }
        },
        orders: { tabs: { new: 'Nuevos', accepted: 'Aceptados', completed: 'Completados' }, emptyTitle: 'Sin pedidos', emptySubtitle: 'Los pedidos {{tab}} aparecerán aquí.' },
        earnings: {
          balanceLabel: 'Saldo disponible', received: 'R$ 0,00 recibido', withdrawn: 'R$ 0,00 retirado', transactions: 'Transacciones',
          emptyTitle: 'Sin transacciones', emptySubtitle: 'Tus ingresos y retiros aparecerán aquí.'
        },
        profile: {
          fallbackName: 'Profesional', roleLabel: 'Profesional', logout: 'Cerrar sesión', version: 'BRAZOS v1.0.0', languageSection: 'Idioma',
          switchToCustomer: 'Cambiar a modo Cliente', switchToCustomerDesc: 'Acceder como cliente',
          menu: {
            professionalProfile: 'Perfil profesional', reviews: 'Reseñas', settings: 'Configuración', bankData: 'Datos bancarios',
            notifications: 'Notificaciones', support: 'Ayuda y soporte'
          }
        }
      },
      onboarding: {
        title: 'Registro Profesional',
        saveLater: 'Guardar',
        phases: {
          SIGNUP: { short: 'Registro', title: 'Registro rápido', subtitle: 'Únete en 2 minutos' },
          ACTIVATION: { short: 'Activa', title: 'Activa tu cuenta', subtitle: 'Empieza a recibir pedidos (5-10 min)' },
          ENHANCEMENT: { short: 'Destaca', title: 'Destaca tu perfil', subtitle: 'Aumenta visibilidad y ranking' }
        },
        phaseComplete: {
          signupTitle: '¡Estás dentro!',
          signupSubtitle: 'Registro inicial completado. Ahora activemos tu cuenta para empezar a recibir pedidos.',
          activationTitle: '¡Cuenta activada!',
          activationSubtitle: 'Tu perfil está listo para mostrarse a clientes. Continua para destacar aún más o envía para aprobación.',
          continueActivation: 'Activar ahora (5 min)',
          continueEnhancement: 'Destacar mi perfil',
          finishLater: 'Terminar después',
          submitNow: 'Enviar para aprobación'
        },
        steps: {
          cpf: 'CPF', category: 'Categoría', details: 'Detalles', pricing: 'Precio', availability: 'Disponibilidad', review: 'Revisión',
          account: 'Cuenta', categories: 'Categorías', questionnaire: 'Preguntas', services: 'Servicios', profile: 'Perfil', location: 'Ubicación',
          payout: 'Pagos', policies: 'Políticas', trust: 'Confianza'
        },
        account: {
          title: 'Registro profesional', subtitle: 'Elige el tipo de registro. Define cómo facturas y recibes pagos.',
          types: { CPF: 'CPF', MEI: 'MEI', CNPJ: 'CNPJ' },
          typesDesc: { CPF: 'Independiente', MEI: 'Microemprendedor', CNPJ: 'Empresa registrada' },
          cpfLabel: 'CPF', cnpjLabel: 'CNPJ',
          razaoSocialLabel: 'Razón social', razaoSocialPlaceholder: 'Ej: Silva Servicios LTDA',
          nomeFantasiaLabel: 'Nombre comercial (opcional)', nomeFantasiaPlaceholder: 'Ej: Silva Limpiezas',
          invalidCpf: 'CPF inválido.', invalidCnpj: 'CNPJ inválido.',
          hint: 'Se almacena de forma segura. Solo se usa para fines fiscales.'
        },
        payout: {
          title: '¿Cómo cobrarás?', subtitle: 'Configura tu clave Pix para recibir pagos automáticos.',
          keyTypeLabel: 'Tipo de clave Pix',
          keyTypes: { CPF: 'CPF', CNPJ: 'CNPJ', EMAIL: 'Correo', PHONE: 'Teléfono', RANDOM: 'Aleatoria' },
          keyLabel: 'Clave Pix', keyPlaceholder: 'CPF, correo, teléfono o clave aleatoria',
          holderLabel: 'Titular de la cuenta', holderPlaceholder: 'Nombre completo del titular',
          infoTitle: 'Pagos vía Pix', infoBody: 'Los pagos de servicios completados se envían vía Pix en hasta 1 día hábil después de la confirmación.'
        },
        policies: {
          title: 'Políticas y diferenciales', subtitle: 'Define cómo trabajas y qué te hace destacar.',
          cancellationTitle: 'Política de cancelación',
          cancellation: {
            FLEXIBLE: { title: 'Flexible', desc: 'Reembolso total hasta 1h antes del servicio.' },
            MODERATE: { title: 'Moderada', desc: 'Reembolso total hasta 24h antes. Luego, 50%.' },
            STRICT: { title: 'Estricta', desc: 'Sin reembolso después de la confirmación.' }
          },
          languagesTitle: 'Idiomas que hablas',
          languages: { PT: 'Portugués', EN: 'Inglés', ES: 'Español' },
          emergencyTitle: 'Disponibilidad de emergencia', emergencyDesc: 'Aceptar solicitudes de última hora (filtro premium).',
          travelTitle: 'Tarifa de desplazamiento',
          freeRadiusLabel: 'Radio gratis (km)', perKmLabel: 'Tarifa por km',
          referralTitle: 'Código de referencia', referralPlaceholder: 'Ej: MARIA2025',
          referralHint: 'Si alguien te refirió, ingresa su código aquí.'
        },
        trust: {
          title: 'Confianza y verificación', subtitle: 'Estos ítems aumentan tu visibilidad. Los envíos son opcionales, los consentimientos son obligatorios.',
          verificationTitle: 'Verificación (opcional, recomendado)',
          selfieTitle: 'Selfie de verificación', selfieDesc: 'Comparamos con tu foto de perfil para prevenir cuentas falsas.', selfieError: 'No se pudo abrir la cámara.',
          bgTitle: 'Antecedentes penales', bgDesc: 'Sube tu certificado — sello extra de confianza en tu perfil.',
          insuranceTitle: 'Seguro de responsabilidad', insuranceDesc: 'Tengo seguro que cubre daños durante el servicio.',
          consentsTitle: 'Consentimientos obligatorios',
          lgpdTitle: 'LGPD — Ley Brasileña de Protección de Datos', lgpdDesc: 'Autorizo el tratamiento de mis datos según la política de privacidad.',
          tosTitle: 'Términos de Uso', tosDesc: 'He leído y acepto los Términos de Uso de la plataforma.',
          contractorTitle: 'Contrato del profesional', contractorDesc: 'Acepto el contrato de prestación de servicios autónomos con BRAZOS.',
          uploaded: 'Subido'
        },
        categories: {
          title: '¿Qué ofreces?', subtitle: 'Elige tus categorías, especialidades y servicios. Puedes seleccionar más de uno.',
          summary: '{{categories}} categoría(s) · {{services}} servicio(s)',
          catMeta: '{{subs}} especialidad(es) · {{services}} servicio(s)',
          tapToPick: 'Toca para elegir especialidades', selectedCount: '{{n}} seleccionado(s)',
          suggestNew: 'Sugerir nueva especialidad', suggestPlaceholder: 'Ej: Instalación de paneles solares...', suggestSend: 'Enviar',
          suggestionSentTitle: 'Sugerencia enviada', suggestionSentDesc: 'Nuestro equipo revisará tu sugerencia pronto.'
        },
        questionnaire: {
          title: 'Cuéntanos sobre tu trabajo', subtitle: 'Responde unas preguntas para conectarte con los clientes correctos.'
        },
        services: {
          title: 'Crea tus servicios', subtitle: 'Crea ofertas claras con precio, duración y extras.',
          emptyTitle: 'Sin servicios aún', emptyDesc: 'Agrega al menos un servicio para continuar.',
          addService: 'Agregar servicio', editorTitle: 'Editar servicio', saveService: 'Guardar servicio',
          titleLabel: 'Título del servicio', titlePlaceholder: 'Ej: Limpieza profunda del hogar',
          descLabel: 'Descripción', descPlaceholder: '¿Qué incluye este servicio?',
          subcategoryLabel: 'Especialidad vinculada',
          pricingLabel: 'Modelo de precio',
          pricingFixed: 'Fijo', pricingHourly: 'Por hora', pricingStarting: 'Desde', pricingQuote: 'Cotización', pricingQuoteShort: 'A consultar',
          priceLabel: 'Precio (R$)', durationLabel: 'Duración',
          addOnsTitle: 'Extras', addAddOn: 'Agregar', edit: 'Editar',
          addOnNamePh: 'Nombre del extra', addOnDescPh: 'Descripción (opcional)',
          untitled: 'Sin título', titleTooShort: 'El título debe tener al menos 3 caracteres.', noCategoryFirst: 'Selecciona primero una categoría.'
        },
        profilePro: {
          title: 'Perfil profesional', subtitle: 'Tu vitrina para ganar más clientes.',
          photoLabel: 'Toca para agregar una foto', photoError: 'No se pudo seleccionar la foto.',
          bioLabel: 'Biografía', bioPlaceholder: 'Cuéntale a los clientes sobre tu experiencia y diferenciales...',
          experienceLabel: 'Años de experiencia',
          portfolioTitle: 'Portafolio', portfolioDesc: 'Muestra tu trabajo con fotos (hasta 6).', addPhotos: 'Agregar fotos',
          certsTitle: 'Certificaciones y licencias', certsDesc: 'Sube documentos para agilizar la verificación.',
          certNamePlaceholder: 'Nombre del certificado', uploadDoc: 'Subir documento'
        },
        coverage: {
          title: 'Cobertura y reservas', subtitle: 'Dónde atiendes y cómo quieres recibir pedidos.',
          baseAddressLabel: 'Dirección base', baseAddressPlaceholder: 'Calle, colonia...',
          cityLabel: 'Ciudad', cityPlaceholder: 'São Paulo', stateLabel: 'Estado',
          useGps: 'Usar mi ubicación', locating: 'Localizando...',
          gpsPermission: 'Permiso de ubicación denegado.', gpsError: 'No se pudo obtener tu ubicación.', gpsUnavailable: 'GPS no disponible.',
          radiusLabel: 'Radio de servicio', radiusHint: 'Distancia máxima que estás dispuesto a viajar.',
          zipLabel: 'Códigos postales (opcional)', zipPlaceholder: '00000-000',
          bookingModelLabel: '¿Cómo quieres recibir reservas?', bookingModelHint: 'Puedes cambiarlo luego.',
          instantTitle: 'Reserva instantánea', instantDesc: 'Los clientes reservan directamente desde tu calendario.',
          requestTitle: 'Solicitud con aprobación', requestDesc: 'Apruebas cada solicitud antes de confirmar.'
        },
        cpf: {
          title: 'Ingresa tu CPF', subtitle: 'Necesitamos tu CPF para el registro profesional y la emisión de facturas.',
          hint: 'Tu CPF se almacena de forma segura y se usa solo con fines fiscales y regulatorios.'
        },
        category: {
          title: '¿Qué servicio ofreces?', subtitle: 'Selecciona la categoría de tu servicio.',
          selectSubcategory: 'Elige tu especialidad', selectServices: 'Selecciona los servicios que ofreces.',
          home: 'Hogar', homeDesc: 'Limpieza, reparaciones, mantenimiento',
          beauty: 'Belleza', beautyDesc: 'Cabello, uñas, estética',
          health: 'Salud', healthDesc: 'Bienestar, masaje, cuidados',
          chef: 'Chef', chefDesc: 'Cocina, eventos, comidas'
        },
        details: {
          title: 'Describe tu servicio', subtitle: 'Cuéntale a los clientes sobre ti.',
          serviceTitleLabel: 'Título del servicio', serviceTitlePlaceholder: 'Ej: Limpieza profesional del hogar',
          descriptionLabel: 'Descripción', descriptionPlaceholder: 'Describe tu experiencia y lo que ofreces...',
          serviceAreaLabel: 'Área de servicio', serviceAreaPlaceholder: 'Ej: Ciudad de México - Centro',
          experienceLabel: 'Años de experiencia'
        },
        pricing: {
          title: 'Define tu precio', subtitle: '¿Cuánto cobras por hora?',
          priceLabel: 'Precio por hora (R$)', pricePlaceholder: '0,00',
          hint: 'Puedes cambiar tu precio en cualquier momento.'
        },
        availability: {
          title: 'Tu disponibilidad', subtitle: '¿Qué días y horarios trabajas?',
          days: { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo' },
          start: 'Inicio', end: 'Fin'
        },
        review: {
          title: 'Revisa tu perfil', subtitle: 'Verifica los datos antes de enviar.',
          categoryLabel: 'Categoría', serviceLabel: 'Servicio', descriptionLabel: 'Descripción',
          subcategoryLabel: 'Especialidad', servicesLabel: 'Servicios ofrecidos',
          areaLabel: 'Área', experienceLabel: 'Experiencia', priceLabel: 'Precio/hora',
          availabilityLabel: 'Disponibilidad', yearsUnit: 'años',
          categoriesLabel: 'Categorías', questionnaireLabel: 'Cuestionario', profileLabel: 'Perfil', coverageLabel: 'Cobertura',
          accountLabel: 'Registro', payoutLabel: 'Pagos', policiesLabel: 'Políticas', trustLabel: 'Consentimientos',
          qualityScoreLabel: 'Puntaje de perfil', qualityScoreHint: 'Los perfiles más completos reciben más reservas.',
          incomplete: 'Incompleto', accepted: 'Aceptado',
          submit: 'Enviar para aprobación', editing: 'Editar'
        },
        submitted: {
          title: '¡Solicitud enviada!', subtitle: 'Tu perfil profesional ha sido enviado para revisión. Serás notificado cuando sea aprobado.',
          backToHome: 'Volver al inicio', failure: 'No se pudo enviar. Inténtalo de nuevo.'
        }
      },
      placeholders: {
        chat: { title: 'Chat', subtitle: 'Habla con tu profesional o cliente en tiempo real.' },
        customer: {
          activeBooking: { title: 'Reserva Activa', subtitle: 'Sigue el estado de tu reserva en tiempo real.' },
          tracking: { title: 'Seguimiento', subtitle: 'Sigue la ubicación del profesional en el mapa.' },
          history: { title: 'Historial', subtitle: 'Ve todas tus reservas anteriores.' },
          review: { title: 'Reseña', subtitle: 'Califica al profesional y comparte tu experiencia.' },
          categoryBrowse: { title: 'Explorar Categoría', subtitle: 'Busca profesionales disponibles en esta categoría.' },
          providerDetail: { title: 'Perfil del Profesional', subtitle: 'Ve calificaciones, precios y disponibilidad del profesional.' },
          bookingFlow: { title: 'Reservar Servicio', subtitle: 'Elige fecha, hora y confirma tu reserva.' }
        },
        provider: {
          activeBooking: { title: 'Servicio Activo', subtitle: 'Gestiona el servicio en curso y actualiza el estado.' },
          schedule: { title: 'Agenda', subtitle: 'Gestiona tus horarios disponibles y citas confirmadas.' },
          approvalPending: { title: 'Aprobación Pendiente', subtitle: 'Tu perfil está siendo revisado. Te avisaremos cuando sea aprobado.' },
          onboardingWizard: { title: 'Registro Profesional', subtitle: 'Completa tu perfil profesional para empezar a recibir pedidos.' }
        }
      },
      navigation: {
        chatTitle: 'Chat',
        customerBookings: { root: 'Reservas', activeBooking: 'Reserva Activa', tracking: 'Seguimiento', history: 'Historial', review: 'Reseña' },
        customerExplore: { root: 'Explorar' }, customerHome: { categoryBrowse: 'Categoría', providerDetail: 'Profesional', bookingFlow: 'Reservar' },
        customerProfile: { root: 'Perfil' }, providerEarnings: { root: 'Ingresos' }, providerHome: { onboardingWizard: 'Registro Profesional', approvalPending: 'Aprobación' },
        providerOrders: { root: 'Pedidos', activeBooking: 'Servicio Activo' }, providerProfile: { root: 'Perfil' }, providerSchedule: { root: 'Agenda' }
      },
      booking: {
        steps: { cpf: 'CPF', address: 'Dirección', payment: 'Pago', addOns: 'Adicionales', summary: 'Resumen' },
        flow: { demoService: 'Limpieza del hogar' },
        cpf: {
          title: 'Ingresa tu CPF', subtitle: 'Necesitamos tu CPF para emitir facturas y garantizar tu seguridad.',
          invalid: 'CPF inválido. Verifica los números.', incomplete: 'CPF incompleto.',
          hint: 'Tu CPF se almacena de forma segura y se usa solo con fines fiscales.'
        },
        address: {
          title: 'Dirección del servicio', subtitle: '¿Dónde se realizará el servicio?',
          addTitle: 'Nueva dirección', editTitle: 'Editar dirección',
          labelField: 'Tipo de dirección', labels: { home: 'Casa', work: 'Trabajo', travel: 'Viaje', other: 'Otro' },
          customLabelPlaceholder: 'Nombre personalizado', useGps: 'Usar mi ubicación actual',
          streetField: 'Calle', streetPlaceholder: 'Nombre de la calle',
          numberField: 'Número', complementField: 'Complemento', complementPlaceholder: 'Apto, bloque...',
          neighborhoodField: 'Barrio', neighborhoodPlaceholder: 'Nombre del barrio',
          cityField: 'Ciudad', cityPlaceholder: 'Nombre de la ciudad', stateField: 'Estado', zipField: 'Código postal',
          recipientToggle: '¿Servicio para otra persona?',
          recipientNamePlaceholder: 'Nombre del destinatario', recipientPhonePlaceholder: 'Teléfono del destinatario',
          addButton: 'Guardar dirección', saveChanges: 'Guardar cambios', addNew: 'Agregar nueva dirección',
          deleteTitle: 'Eliminar dirección', deleteMessage: '¿Estás seguro de que deseas eliminar esta dirección?', deleteConfirm: 'Eliminar',
          gpsDetected: 'Ubicación detectada', gpsError: 'No se pudo obtener tu ubicación.', gpsPermission: 'Permiso de ubicación denegado.',
          default: 'Predeterminado', setAsDefault: 'Establecer como dirección predeterminada'
        },
        payment: {
          title: 'Método de pago', subtitle: '¿Cómo deseas pagar por el servicio?',
          addTitle: 'Agregar pago', typeLabel: 'Tipo de pago', card: 'Tarjeta',
          pixKeyLabel: 'Clave Pix', pixKeyPlaceholder: 'CPF, correo, teléfono o clave aleatoria',
          pixHint: 'Ingresa tu clave Pix para pagos instantáneos.',
          cardLabelField: 'Nombre de la tarjeta', cardLabelPlaceholder: 'Ej: Visa, Mastercard...',
          lastFourField: 'Últimos 4 dígitos', cardHint: 'La integración completa con pasarela de pago se agregará pronto.',
          setDefault: 'Establecer como pago predeterminado', addButton: 'Guardar método', addNew: 'Agregar nuevo método',
          deleteTitle: 'Eliminar método', deleteMessage: '¿Estás seguro de que deseas eliminar este método de pago?', deleteConfirm: 'Eliminar'
        },
        summary: {
          title: 'Resumen de la reserva', subtitle: 'Revisa los detalles antes de confirmar.',
          provider: 'Profesional', dateTime: 'Fecha y hora', address: 'Dirección', payment: 'Pago',
          noProvider: 'Ningún profesional seleccionado', noDate: 'Fecha no seleccionada',
          noAddress: 'Ninguna dirección seleccionada', noPayment: 'Ningún pago seleccionado',
          notesLabel: 'Observaciones', notesPlaceholder: 'Información adicional para el profesional...',
          total: 'Total', confirmTitle: '¿Confirmar reserva?', confirmMessage: '¿Deseas confirmar esta reserva?',
          confirmButton: 'Confirmar reserva', successTitle: '¡Reserva confirmada!', successMessage: 'Tu reserva se ha realizado con éxito.',
          service: 'Servicio'
        },
        addOns: {
          title: 'Adicionales', subtitle: 'Personaliza tu servicio con extras opcionales.',
          perHour: 'Por hora', fixed: 'Fijo', perJob: 'Por trabajo', perSession: 'Por sesión', perUnit: 'Por unidad',
          addOnsTotal: 'Total de adicionales', quoteOnRequest: 'Bajo consulta',
          continueWith: 'Continuar con {{count}} extra(s)', skip: 'Omitir extras',
          items: {
            cleaning_supplies: { name: 'Productos de limpieza', desc: 'Productos profesionales incluidos' },
            inside_fridge: { name: 'Limpieza interior del refrigerador', desc: 'Limpieza completa del interior' },
            inside_oven: { name: 'Limpieza interior del horno', desc: 'Eliminación de grasa y suciedad' },
            laundry_fold: { name: 'Lavar y doblar ropa', desc: 'Lavado y organización de ropa' },
            ironing: { name: 'Planchar ropa', desc: 'Servicio de planchado' },
            organize_closets: { name: 'Organizar armarios', desc: 'Organización completa de armarios' },
            emergency_surcharge: { name: 'Recargo de emergencia', desc: 'Servicio urgente/emergencia' },
            materials_included: { name: 'Materiales incluidos', desc: 'Piezas y materiales necesarios' },
            warranty_extension: { name: 'Garantía extendida', desc: 'Garantía adicional del servicio' },
            debris_removal: { name: 'Remoción de escombros', desc: 'Limpieza y eliminación de residuos' },
            weekend_surcharge: { name: 'Recargo de fin de semana', desc: 'Servicio sábados y domingos' },
            holiday_surcharge: { name: 'Recargo de feriado', desc: 'Servicio en feriados' },
            premium_products: { name: 'Productos premium', desc: 'Uso de productos de alta calidad' },
            deep_conditioning: { name: 'Hidratación profunda', desc: 'Tratamiento capilar intensivo' },
            scalp_massage: { name: 'Masaje del cuero cabelludo', desc: 'Relajación y estímulo capilar' },
            blowout_addon: { name: 'Secado adicional', desc: 'Secado profesional' },
            nail_art_addon: { name: 'Nail art', desc: 'Decoración artística de uñas' },
            gel_removal: { name: 'Remoción de gel', desc: 'Remoción segura de esmalte en gel' },
            hand_massage: { name: 'Masaje de manos', desc: 'Relajación e hidratación' },
            paraffin_treatment: { name: 'Tratamiento de parafina', desc: 'Hidratación intensa con parafina' },
            travel_fee: { name: 'Tarifa de desplazamiento', desc: 'Costo de transporte al lugar' },
            night_shift: { name: 'Turno nocturno', desc: 'Servicio en horario nocturno' },
            medical_report: { name: 'Informe médico', desc: 'Informe detallado del servicio' },
            equipment_rental: { name: 'Alquiler de equipos', desc: 'Equipos especializados' },
            progress_report: { name: 'Informe de progreso', desc: 'Seguimiento de la evolución' },
            home_exercise_plan: { name: 'Plan de ejercicios', desc: 'Ejercicios para hacer en casa' },
            grocery_shopping: { name: 'Compra de ingredientes', desc: 'Selección y compra en el mercado' },
            kitchen_cleanup: { name: 'Limpieza de cocina', desc: 'Limpieza completa después del servicio' },
            meal_storage: { name: 'Almacenamiento de comidas', desc: 'Porcionado y almacenamiento' },
            dietary_consultation: { name: 'Consulta alimentaria', desc: 'Orientación nutricional personalizada' },
            table_setup: { name: 'Montaje de mesa', desc: 'Decoración y organización de mesa' },
            waitstaff: { name: 'Mesero/Mesera', desc: 'Servicio de mesa profesional' },
            dishwashing: { name: 'Lavado de platos', desc: 'Lavado completo de vajilla' }
          }
        }
      },
      promos: {
        welcome: { title: '¡Bienvenido a BRAZOS!', subtitle: 'Encuentra profesionales calificados cerca de ti. Reserva tu primer servicio ahora.' },
        referral: { title: 'Invita y Gana', subtitle: 'Invita amigos y obtén descuento en tu próximo servicio.' },
        trending: { title: 'Tendencia Ahora', subtitle: 'Descubre los servicios más solicitados esta semana en tu zona.' }
      },
      quickServices: {
        cleaning: 'Limpieza', haircut: 'Corte de Pelo', massage: 'Masaje',
        chef: 'Chef en Casa', plumbing: 'Plomería', nails: 'Manicure'
      },
      status: { pending: 'Pendiente', confirmed: 'Confirmado', inProgress: 'En curso', completed: 'Completado', cancelled: 'Cancelado' },
      catalog: catalogEs
    }
  }
} as const;
