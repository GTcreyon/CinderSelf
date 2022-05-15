const tokenTypes = ['fn', 'sn', 'ps', 'po', 'pa', 'pp', 'pr']
const optionTypes = ['plural']

function generateOutput () { // eslint-disable-line
  document.getElementById('output').innerText = replaceTokens(templates[0])
}

function replaceTokens (input) {
  const profile = grabProfile()
  const options = grabOptions()
  input.match(/%.*?%/g).forEach(token => {
    const subtoken = token.replaceAll('%', '')
    const parts = subtoken.split(';')
    let replacement
    const mainStr = parts[0]
    replacement = profile[mainStr].toLowerCase()
    if (parts.length > 1) {
      const params = parts[1].split(',')
      params.forEach(param => {
        switch (param) {
          case 'f':
            replacement = replacement.toUpperCase()
            break
          case 'c':
            replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1)
            break
          default:
            break
        }
      })
    }
    input = input.replace(token, replacement)
  })
  input.match(/\$.*?\$/g).forEach(token => {
    const subtoken = token.replaceAll('$', '')
    const parts = subtoken.split(';')
    if (options.plural) {
      input = input.replace(token, parts[1])
    } else {
      input = input.replace(token, parts[0])
    }
  })
  return input
}

function grabProfile () {
  const profile = {}
  tokenTypes.forEach(token => {
    profile[token] = document.getElementById('profile-' + token).value
  })
  return profile
}

function grabOptions () {
  const options = {}
  optionTypes.forEach(option => {
    options[option] = document.getElementById('option-' + option).checked
  })
  return options
}

// TEMPLATE CONTENT

// key:
// fn - forename, primary name
// ps/ey - subject
// po/em - object
// pa/eir - possessive adj
// pp/eirs - possessive pronoun
// pr/emself - reflexive

const templates = [
  'Hey, where is %fn;c%? I can\'t find %po% anywhere! %ps% said %ps% $was;were$ going to get %pr% to the store today, but %pa% car is still on the driveway.'
]
