export default (user) => [
  {
    label: 'Demarrage',
    icon: 'menu/chart.png',
    icon2: 'chart.png',
    icon3: 'las la-chart-bar',
    color: 'red-7',
    route: '/home'
  },
  {
    label: 'Adhésions',
    icon: 'menu/membre.png',
    icon2: 'eleves.png',
    icon3: 'las la-users',
    color: 'blue',
    route: '/adhesions'
  },
  {
    label: 'Epargnes',
    icon: 'menu/produit.png',
    icon2: 'classe.png',
    icon3: 'las la-sticky-note',
    color: 'blue-3',
    route: '/epargnes'
    // subOptions: [
    //   { label: 'Gestion DAT', icon: 'las la-user-lock', route: '/dat' },
    //   { label: 'Gestion DARS', icon: 'las la-business-time', route: '/dars' },
    //   { label: 'Gestion EAC', icon: 'las la-file-invoice-dollar', route: '/eac' }
    // ]
  },
  {
    label: 'Crédits',
    icon: 'menu/epargne.png',
    icon2: 'demand_money.png',
    icon3: 'las la-sticky-note',
    color: 'blue-3',
    route: 'credit'
  },
  {
    label: 'Caisses',
    icon: 'menu/caisse.png',
    icon2: 'caisse.png',
    icon3: 'las la-money-check',
    color: 'green',
    route: '/caisse'
  },
  {
    label: 'Chéquiers',
    icon: 'menu/chequier.png',
    icon2: 'chequier.png',
    icon3: 'las la-biefcase',
    color: 'orange-8',
    route: '/chequiers'
  },
  {
    label: 'Comptabilité',
    icon: 'menu/comptabilite.png',
    icon2: 'comptabilite.png',
    icon3: 'las la-file-invoice-dollar',
    color: 'light-blue-6',
    route: '/comptabilite'
  },
  {
    label: 'Rapports',
    icon: 'menu/rapport.png',
    icon2: 'operation.png',
    icon3: 'las la-file-alt',
    color: 'teal-7',
    route: '/rapports'
  },
  {
    label: 'SMS Banking',
    icon: 'menu/sms.png',
    icon2: 'sms.png',
    icon3: 'las la-comment-dots',
    color: 'indigo-7',
    route: '/sms'
  },
  {
    label: 'Paramètres',
    icon: 'menu/setting.png',
    icon2: 'setting.png',
    icon3: 'las la-cog',
    color: 'cyan-9',
    route: '/parametre'
  }
]
