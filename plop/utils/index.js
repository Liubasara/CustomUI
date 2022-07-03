const convertStrToJoiner = (
  /** @type {string} */
  s
) => {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase()
}

const convertStrToUppercase = (
  /** @type {string} */
  s
) => {
  return s.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

module.exports = {
  convertStrToJoiner,
  convertStrToUppercase
}
