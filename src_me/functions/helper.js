import { Notify, Dark } from 'quasar'

export default {
  // Constantes
  PREF_USER: 'da572d0KDSJK8743gsbhl062568',
  PREF_PARAMS: 'JK872g0658ghd4g06583gsb',
  PREF_DROITS: '8ghd2ghdd08gh2ghdd0d4g064g06',
  PREF_SOUVENIR: '62uiaa5edfre4a57dae02d09306452',
  PREF_THEME: '62uh02ghdd093mkjhg065852',
  PREF_CHOOSE_CAISSE: 'dd093658a572ghd4gmkjhg065852',

  cellEmptyImg: "background-image:url('statics/images/icone/points.png') !important",
  isNumber: function (value) {
    return /^[0-9]+$/.test(value)
  },
  isTelephone: function (value) {
    return /^[+]*[0-9]+$/.test(value)
  },
  isTelephoneVirgule: function (value) {
    return /^[+]*[0-9;]+$/.test(value)
  },
  isTelephoneWithoutCode: function (value) {
    return /^[0-9]+$/.test(value)
  },
  isMail: function (chaine) {
    return /^[a-zA-Z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(chaine)
  },
  isDate (dateStr) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
  },
  roundNombre: function (nombre, precision = 2, force = false) {
    // precision = precision || 2
    if (force === true) {
      precision = 6
    }
    var temps = Math.pow(10, precision)
    return Math.round(nombre * temps) / temps
  },
  complexePassword (password) {
    var myRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&])/
    return myRegex.test(password)
  },
  isNumeric (chaine) {
    if (!chaine) return false

    var myRegex = /^-?\d*\.?\d*$/
    return myRegex.test(chaine)
  },
  toDouble (val) {
    if (!this.isNumeric(val)) return 0
    return parseFloat(val)
  },
  toInt (val) {
    if (!this.isNumeric(val)) return 0
    return parseInt(val)
  },
  //    isNumeric(n) {
  //   return !isNaN(parseFloat(n)) && isFinite(n);
  // },
  autoGenerateCleComplexe: function (longuer = 8) {
    // 0-68
    const alphabet = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'm',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '!',
      '@',
      '#',
      '/',
      '$',
      '%',
      '&'
    ]
    var trouver = false
    var cle = ''

    var longeur = longuer
    var myRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&])/

    while (trouver === false) {
      for (var i = 0; i < longeur; i++) {
        cle += alphabet[Math.floor(Math.random() * 69)]
      }
      trouver = myRegex.test(cle)
      if (!trouver) {
        cle = ''
      }
    }

    return cle
  },
  dateLong (myDate) {
    myDate = myDate.split(' ')[0]
    let mois = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aôut', 'Septembre', 'Octobre', 'Novrembre', 'Décembre']

    let tabDate = myDate.split('-')
    return tabDate[2] + ' ' + mois[tabDate[1] - 1] + ' ' + tabDate[0]
  },
  datePassee (date1, date2 = null) {
    let diff = {}
    date2 = date2 ? Date.parse(date2) : new Date()
    date1 = Date.parse(date1)

    let tmp = date2 - date1

    tmp = Math.floor(tmp / 1000)
    diff.sec = tmp % 60

    tmp = Math.floor((tmp - diff.sec) / 60)
    diff.min = tmp % 60

    tmp = Math.floor((tmp - diff.min) / 60)
    diff.hour = tmp % 24

    tmp = Math.floor((tmp - diff.hour) / 24)
    diff.day = tmp

    let dateStr = ''

    if (diff.day > 0) { dateStr = diff.day + ' J' }
    if (diff.hour > 0) { dateStr += ' et ' + diff.hour + ' H' }
    // if (diff.min > 0) { dateStr += ' ' + diff.min + ' Min' }

    return dateStr
  },
  noRef (obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  objectToform (obj) {
    var formData = new FormData()
    for (var key in obj) {
      formData.append(key, obj[key])
    }
    return formData
  },

  urls () {
    let domaine = 'http://localhost'

    // let domaine = 'https://garec.net'

    let dossier = '/Projet_IMF_BACK'
    // let dossier = '/banco_backend'

    let base = domaine + dossier

    return {
      BASE_URL: base,
      IMG_AGENT: base + '/assets/images/agents/',
      IMG_GARANT: base + '/assets/images/garants/',
      IMG_MANDATAIRE: base + '/assets/images/mandataires/',
      IMG_ACTIONNAIRE: base + '/assets/images/actionnaires/',
      IMG_HERITIER: base + '/assets/images/heritiers/',
      IMG_MEMBRE: base + '/assets/images/membres/',
      IMG_SIGNATURE: base + '/assets/images/signatures/',
      IMG_PIECE: base + '/assets/images/pieces/',
      IMG_LOGO: base + '/assets/images/logos/',
      DOSSIER: dossier
    }
  },
  isUrl (chaine) {
    return /^[a-zA-Z0-9\- ]+$/.test(chaine)
  },

  getSonnerie () {
    let t = localStorage.getItem(this.PREF_SON) || null
    let defaut = { label: 'Sonnerie 9', value: '9.wav' }

    if (t && t !== 'null') {
      try {
        return JSON.parse(t)
      } catch (e) {
        return defaut
      }
    }
    return defaut
  },
  getConnectedUser () {
    let user = localStorage.getItem(this.PREF_USER) || null

    if (this.isNotEmpty(user)) {
      if (user.indexOf('username') > -1) {
        user = JSON.parse(user)
      } else {
        localStorage.setItem(this.PREF_USER, null)
        user = null
      }
    } else {
      user = null
    }

    return user
  },
  getParametres () {
    let params = localStorage.getItem(this.PREF_PARAMS) || null

    if (this.isNotEmpty(params)) {
      return JSON.parse(params)
    }
    return null
  },
  getDroits () {
    let droits = localStorage.getItem(this.PREF_DROITS) || null

    if (this.isNotEmpty(droits)) {
      return JSON.parse(droits)
    }
    return []
  },
  deconnexion () {
    localStorage.setItem(this.PREF_USER, null)
    localStorage.setItem(this.PREF_PARAMS, null)
    localStorage.setItem(this.PREF_DROITS, null)
  },
  getSouvenir () {
    let souvenir = localStorage.getItem(this.PREF_SOUVENIR) || null

    if (souvenir != null) {
      if (souvenir.indexOf('username') > -1) {
        souvenir = JSON.parse(souvenir)
      } else {
        localStorage.setItem(this.PREF_SOUVENIR, null)
        souvenir = null
      }
    }

    return souvenir
  },

  isAutorise (user, action) {
    return true
  },

  messages: {
    // erreurConnexion: 'Une erreur s\'est produite  ! Verifiez votre connexion internet puis réessayez, si l\'erreur persiste n\'hesitez pas à nous faire part'
    erreurConnexion: 'Verifiez votre connexion internet puis réessayez, si l\'erreur persiste n\'hesitez pas à nous faire part'
  },
  grouperTableau (tab, groupePar = 1) {
    let nbGroupe = Math.ceil(tab.length / groupePar)
    let min = 0
    let groupe = groupePar

    let tab2 = []

    if (tab !== undefined) {
      for (let i = 0; i < nbGroupe; i++) {
        tab2.push(tab.slice(min, groupe))
        min = groupe
        groupe += groupePar
      }
    }

    return tab2
  },
  message () {
    return {
      // connexion: 'Une erreur est survenue! Vérifiez votre connexion internet puis réessayez'
      connexion: 'Un erreur est survenu; Veuillez réessayer ultérieurement ou contacter votre administrateur'
    }
  },

  showMessage (message = null, type = 0, position = 'bottom') {
    message = message || this.message().connexion
    position = 'bottom-right'

    if (type === 0) {
      Notify.create({
        color: 'red',
        textColor: 'white',
        icon: 'las la-exclamation-circle',
        html: true,
        message: `<div class="notif-style"><small>${message}</small><div>`,
        badgeColor: 'pink',
        badgeTextColor: 'white',
        position: position,
        progress: true
        // timeout: 0
      })
    } else if (type === 1) {
      Notify.create({
        color: 'primary',
        textColor: 'white',
        icon: 'las la-check-circle',
        html: true,
        message: `<div class="notif-style"><small>${message}</small><div>`,
        badgeColor: 'grey-7',
        badgeTextColor: 'white',
        position: position,
        progress: true
      })
    } else if (type === 2) {
      Notify.create({
        color: 'blue',
        textColor: 'white',
        icon: 'las la-info-circle',
        html: true,
        message: `<small>${message}</small>`,
        badgeColor: 'grey-7',
        badgeTextColor: 'white',
        position: position,
        progress: true
      })
    }
  },

  urlencode (str) {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/~/g, '%7E')
      // .replace(/%20/g, '+')
  },
  dateSeparator (date, odlSep, newSep) {
    let d = date.split(odlSep)
    if (d.length >= 3) {
      return `${d[0]}${newSep}${d[1]}${newSep}${d[2]}`
    }
    return d.length
  },

  // SOLUTION SIMPLE
  // (12345678901234567).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')
  number_format (number, decimals, decPoint, thousandsSep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
      dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + Math.round(n * k) / k
      }
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  },
  formatMoney (number, decimals = 2) {
    return this.number_format(number, decimals, ',', ' ')
  },
  isDark () {
    let t = localStorage.getItem(this.PREF_THEME)
    if (t) {
      let v = t === 'Dark'
      Dark.set(v)
      return v
    }
    return false
  },
  theme () {
    if (Dark.isActive) {

    } else {

    }
  },
  now (separator = '/', includeHour = false, lg = 'an') {
    let d = new Date()
    let date = ''

    if (lg === 'an') {
      date = d.toJSON()
        .slice(0, 10)
        .replace(/-/g, separator)
    } else {
      date = d.toLocaleDateString().replace(/[/]/g, separator)
    }
    let time = includeHour ? ' ' + d.toLocaleTimeString() : ''
    return date + time
  },
  isNotEmpty (v) {
    if (typeof v === 'undefined' || v === null) return false

    if (typeof v === 'string') {
      if (v.length === 0) return false
    } else if (typeof v === 'number') {
      return !isNaN(v)
    } else if (typeof v === 'object') {
      if (Array.isArray(v)) {
        return v.length > 0
      } else {
        return Object.keys(v).length > 0
      }
    }
    return true
  },
  isEmpty (v) {
    return !this.isNotEmpty(v)
  },
  parseNumeric (val) {
    if (this.isNumeric(val)) {
      return parseFloat(val)
    }
    return 0
  },
  urlencode_v2 (str) {
    let newStr = ''
    const len = str.length

    for (let i = 0; i < len; i++) {
      let c = str.charAt(i)
      let code = str.charCodeAt(i)

      // Spaces
      if (c === ' ') {
        newStr += '+'
      // Non-alphanumeric characters except "-", "_", and "."
      } else if ((code < 48 && code !== 45 && code !== 46) ||
             (code < 65 && code > 57) ||
             (code > 90 && code < 97 && code !== 95) ||
             (code > 122)) {
        newStr += '%' + code.toString(16).toUpperCase()
        // Alphanumeric characters
      } else {
        newStr += c
      }
    }

    return newStr
  },
  dateBien (chaine, showTime = true) {
    if (chaine === null || chaine === undefined) return null

    const HeureEtDate = chaine.split(' ')
    const dateS = HeureEtDate[0].split('-')

    let time = ''

    if (showTime) {
      const heure = HeureEtDate[1].split(':')
      time = ` à ${heure[0]} : ${heure[1]}`
    }

    return `${dateS[2]} ${this.long_mois(dateS[1])} ${dateS[0]}${time}`
  },
  long_mois (index, long = false) {
    return long
      ? ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][index - 1]
      : ['Janv.', 'Fev.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'][index - 1]
  },
  checkResponse (data) {
    if (data.status_code === 200) {
      return true
    } else if (data.status_code === 403) {
      // acces refusé
      // console.log('ACCES REFUSE')
    } else if (data.status_code === 401) {
      // acces refusé token invalide ou expiré
      // console.log('TOKEN EXPIRE')
    }

    return false
  },
  copy (text) {
    navigator.clipboard.writeText(text)
    this.showMessage('Copier dans le presse-papiers', 1)
  },
  isExpireDate (date) {
    if (!date) return false

    return this.now('-', false) > date
  }

}

/**************************************************************/
/**************************************************************/
/**************************************************************/
if (!window.navigator.onLine) {
  messageOnlineOffLine(false, 'Aucune connexion internet')
}

function messageOnlineOffLine (isOnLine = false, title = '') {
  let message = ''
  let icone = ''

  if (isOnLine) {
    icone = 'wifi'
    title = title || 'Connexion internet rétablie'
    message = "Vous pouvez à present utiliser l'application"
  } else {
    icone = 'wifi_off'
    title = title || 'Connexion internet perdue'
    message = 'Vous ne pouvez rien faire tant que vous ne serez pas connecté'
  }

  Notify.create({
    color: 'black-5',
    textColor: 'white',
    icon: icone,
    html: true,
    message: `<div ><strong>${title}</strong><br/>${message}<div>`,
    badgeColor: 'pink',
    badgeTextColor: 'white',
    position: 'bottom-right',
    progress: false
    // timeout: 0
  })
}

window.addEventListener('offline', function (e) {
  messageOnlineOffLine(false)
})

window.addEventListener('online', function (e) {
  messageOnlineOffLine(true)
})
