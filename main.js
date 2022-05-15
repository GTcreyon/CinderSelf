const tokenTypes = ['nf', 'ns', 'ps', 'po', 'pa', 'pp', 'pr', 'tc', 'tf', 'tn']
const profileDefaults = {
  nf: 'Creyon',
  ns: 'GT',
  ps: 'They',
  po: 'Them',
  pa: 'Their',
  pp: 'Theirs',
  pr: 'Themself',
  tc: 'Person',
  tf: 'Buddy',
  tn: 'Person'
}

function getOutput(){ // eslint-disable-line
  document.getElementById('output').innerText = generateFromTemplates(5)
}

function generateFromTemplates (num) {
  const IDs = getTemplateIDs(num)
  let output = ''
  for (let i = 0; i < num; i++) {
    output += replaceTokens(templates[IDs[i]]) + '\n'
  }
  return output
}

function getTemplateIDs (num) {
  const IDs = []
  let random
  for (let i = 0; i < num; i++) {
    do {
      random = Math.floor(Math.random() * templates.length)
    }
    while (IDs.includes(random))
    IDs.push(random)
  }
  return IDs
}

function replaceTokens (input) {
  // simple swap tokens
  const profile = grabProfile()
  const profileTokens = input.match(/%.*?%/g)
  if (profileTokens !== null) {
    profileTokens.forEach(token => {
      const tokenBody = token.replaceAll('%', '')
      const parts = tokenBody.split(';')
      let replacement
      const mainStr = parts[0]
      replacement = profile[mainStr]
      if (replacement === '') {
        replacement = profileDefaults[mainStr]
      }
      console.log(token)
      replacement = replacement.toLowerCase()
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
  }

  // complex tokens
  const complexTokens = input.match(/\$.*?\$/g)
  if (complexTokens !== null) {
    complexTokens.forEach(token => {
      const tokenBody = token.replaceAll('$', '')
      const parts = tokenBody.split(';')
      let complexArgs = []
      if (parts.length > 1) {
        complexArgs = parts[1].split(',')
      }
      switch (parts[0]) {
        case 'p':
          if (document.getElementById('option-plural').checked) {
            input = input.replace(token, complexArgs[1])
          } else {
            input = input.replace(token, complexArgs[0])
          }
          break

        default:
          break
      }
    })
  }
  return input
}

function grabProfile () {
  const profile = {}
  tokenTypes.forEach(token => {
    profile[token] = document.getElementById('profile-' + token).value
  })
  return profile
}

// TEMPLATE CONTENT

// key:
// nf - forename, primary name
// ps/ey - subject
// po/em - object
// pa/eir - possessive adj
// pp/eirs - possessive pronoun
// pr/emself - reflexive

const templates = [
  'Hey, where is %nf;c%? I can\'t find %po% anywhere! %ps;c% said %ps% $p;was,were$ going to get %pr% to the store today, but %pa% car is still on the driveway.',
  '%nf;c% looks great in %pa% new outfit!',
  '%nf;c% told me to meet at %pa% house.',
  'Have you seen %nf;c%? %ps;c% said %ps% would be here.',
  '%nf;c%? Yeah, I think I saw %po% out back.',
  'I know this really cool %tc% called %nf;c%!!',
  '%ps;c%\'$p;s,re$ super awesome and I\'m really happy to be around %po%.',
  '%pa;c% personality is super unique, and I really love that!!',
  '%ps;c% deserve$p;s,$ so much love, and I hope %ps% continue$p;s,$ to practice self care and love %pr% <3',
  'Hey, look! It\'s %nf;c%!',
  'I wonder what %ps%$p;\'s,\'re$ up to, and I hope %pa% day\'s going okay.'
]
