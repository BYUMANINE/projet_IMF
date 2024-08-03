export default {
  dateActuelle: function (separator = '/') {
    return new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, separator)
  },
  incremente: function (date, days, sep = '-', andHours = true) {
    let result = new Date(date)
    result.setDate(result.getDate() + days)

    return this.format(result, sep, andHours)
  },
  format: function (d, sep = '-', andHours = true) {
    let strDate = [
      d.getFullYear(),
      (d.getMonth() + 1).toString().padStart(2, '0'),
      d.getDate().toString().padStart(2, '0')
    ].join(sep)

    if (andHours) {
      strDate += ' ' + [d.getHours().toString().padStart(2, '0'),
        d.getMinutes().toString().padStart(2, '0')].join(':')
    }
    /* d.getSeconds().toString().padStart(2, '0') */
    return strDate
  },
  augmenterAnnee: function (myDate, anneePlus, separator = '/') {
    var arrayDate = myDate.split(separator)
    arrayDate[0] = parseInt(arrayDate[0]) + anneePlus
    return arrayDate.join(separator)
  },
  diminuerAnnee: function (myDate, anneePlus, separator = '/') {
    var arrayDate = myDate.split(separator)
    arrayDate[0] = parseInt(arrayDate[0]) - anneePlus
    return arrayDate.join(separator)
  },
  dateEgale (date1, date2) {
    return new Date(date1) < new Date(date2)
  },
  inferieurA (date1, date2) {
    return new Date(date1) < new Date(date2)
  },
  inferieurEgalA (date1, date2) {
    return new Date(date1) <= new Date(date2)
  },
  superieurA (date1, date2) {
    return new Date(date1) > new Date(date2)
  },
  superieurEgalA (date1, date2) {
    return new Date(date1) >= new Date(date2)
  },
  convertSeparator (date, odlSep, newSep) {
    let d = date.split(odlSep)
    if (d.length >= 3) {
      return `${d[0]}${newSep}${d[1]}${newSep}${d[2]}`
    }
    return date
  },
  firstDateOfMonth (separator = '/') {
    var arrayDate = this.dateActuelle().split(separator)
    return `${arrayDate[0]}${separator}${arrayDate[1]}${separator}01`
  },
  diff (d1, d2) {
    const date1 = new Date(d1)
    const date2 = new Date(d2)

    let diffTime = 0 // Milliseconds

    if (this.superieurA(date1, date2)) {
      diffTime = Math.abs(date1 - date2)
    }
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const days = Math.floor(diffTime / 86400000) // days
    const hours = Math.floor((diffTime % 86400000) / 3600000) // hours
    const minutes = Math.round(((diffTime % 86400000) % 3600000) / 60000)

    return { days, hours, minutes }
  }
}
