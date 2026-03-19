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
          categories: {
            home: { label: 'Casa', subtitle: 'Limpeza, reparos & mais' }, beauty: { label: 'Beleza', subtitle: 'Cabelo, unhas & estética' },
            health: { label: 'Saúde', subtitle: 'Bem-estar & cuidados' }, chef: { label: 'Chef', subtitle: 'Culinária & eventos' }
          }
        },
        explore: { searchPlaceholder: 'Buscar serviços, profissionais...', title: 'Explore profissionais', subtitle: 'Pesquise por serviço ou profissional na sua região.' },
        bookings: { tabs: { active: 'Ativas', completed: 'Concluídas', cancelled: 'Canceladas' }, emptyTitle: 'Nenhuma reserva', emptySubtitle: 'Suas reservas {{tab}} aparecerão aqui.' },
        profile: {
          fallbackName: 'Usuário', logout: 'Sair da conta', version: 'BRAZOS v1.0.0', languageSection: 'Idioma',
          menu: { settings: 'Configurações', paymentMethods: 'Métodos de pagamento', notifications: 'Notificações', support: 'Ajuda e suporte' }
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
          menu: {
            professionalProfile: 'Perfil profissional', reviews: 'Avaliações', settings: 'Configurações', bankData: 'Dados bancários',
            notifications: 'Notificações', support: 'Ajuda e suporte'
          }
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
        steps: { cpf: 'CPF', address: 'Endereço', payment: 'Pagamento', summary: 'Resumo' },
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
          gpsDetected: 'Localização detectada', gpsError: 'Não foi possível obter sua localização.', gpsPermission: 'Permissão de localização negada.'
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
          confirmButton: 'Confirmar reserva', successTitle: 'Reserva confirmada!', successMessage: 'Sua reserva foi realizada com sucesso.'
        }
      },
      status: { pending: 'Pendente', confirmed: 'Confirmado', inProgress: 'Em andamento', completed: 'Concluído', cancelled: 'Cancelado' }
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
          categories: {
            home: { label: 'Home', subtitle: 'Cleaning, repairs & more' }, beauty: { label: 'Beauty', subtitle: 'Hair, nails & aesthetics' },
            health: { label: 'Health', subtitle: 'Wellness & care' }, chef: { label: 'Chef', subtitle: 'Cuisine & events' }
          }
        },
        explore: { searchPlaceholder: 'Search services, professionals...', title: 'Explore professionals', subtitle: 'Search by service or professional in your area.' },
        bookings: { tabs: { active: 'Active', completed: 'Completed', cancelled: 'Cancelled' }, emptyTitle: 'No bookings', emptySubtitle: 'Your {{tab}} bookings will appear here.' },
        profile: {
          fallbackName: 'User', logout: 'Sign out', version: 'BRAZOS v1.0.0', languageSection: 'Language',
          menu: { settings: 'Settings', paymentMethods: 'Payment methods', notifications: 'Notifications', support: 'Help & support' }
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
          menu: {
            professionalProfile: 'Professional profile', reviews: 'Reviews', settings: 'Settings', bankData: 'Bank details',
            notifications: 'Notifications', support: 'Help & support'
          }
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
        steps: { cpf: 'CPF', address: 'Address', payment: 'Payment', summary: 'Summary' },
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
          gpsDetected: 'Location detected', gpsError: 'Could not get your location.', gpsPermission: 'Location permission denied.'
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
          confirmButton: 'Confirm booking', successTitle: 'Booking confirmed!', successMessage: 'Your booking has been successfully placed.'
        }
      },
      status: { pending: 'Pending', confirmed: 'Confirmed', inProgress: 'In progress', completed: 'Completed', cancelled: 'Cancelled' }
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
          categories: {
            home: { label: 'Hogar', subtitle: 'Limpieza, reparaciones y más' }, beauty: { label: 'Belleza', subtitle: 'Cabello, uñas y estética' },
            health: { label: 'Salud', subtitle: 'Bienestar y cuidados' }, chef: { label: 'Chef', subtitle: 'Cocina y eventos' }
          }
        },
        explore: { searchPlaceholder: 'Buscar servicios, profesionales...', title: 'Explorar profesionales', subtitle: 'Busca por servicio o profesional en tu zona.' },
        bookings: { tabs: { active: 'Activas', completed: 'Completadas', cancelled: 'Canceladas' }, emptyTitle: 'Sin reservas', emptySubtitle: 'Tus reservas {{tab}} aparecerán aquí.' },
        profile: {
          fallbackName: 'Usuario', logout: 'Cerrar sesión', version: 'BRAZOS v1.0.0', languageSection: 'Idioma',
          menu: { settings: 'Configuración', paymentMethods: 'Métodos de pago', notifications: 'Notificaciones', support: 'Ayuda y soporte' }
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
          menu: {
            professionalProfile: 'Perfil profesional', reviews: 'Reseñas', settings: 'Configuración', bankData: 'Datos bancarios',
            notifications: 'Notificaciones', support: 'Ayuda y soporte'
          }
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
        steps: { cpf: 'CPF', address: 'Dirección', payment: 'Pago', summary: 'Resumen' },
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
          gpsDetected: 'Ubicación detectada', gpsError: 'No se pudo obtener tu ubicación.', gpsPermission: 'Permiso de ubicación denegado.'
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
          confirmButton: 'Confirmar reserva', successTitle: '¡Reserva confirmada!', successMessage: 'Tu reserva se ha realizado con éxito.'
        }
      },
      status: { pending: 'Pendiente', confirmed: 'Confirmado', inProgress: 'En curso', completed: 'Completado', cancelled: 'Cancelado' }
    }
  }
} as const;
