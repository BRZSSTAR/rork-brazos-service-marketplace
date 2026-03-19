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
      status: { pending: 'Pendiente', confirmed: 'Confirmado', inProgress: 'En curso', completed: 'Completado', cancelled: 'Cancelado' }
    }
  }
} as const;
