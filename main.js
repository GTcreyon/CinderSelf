// this is just here to circumvent an issue with StandardJS while keeping the code clean
const templates = exportTemplates // eslint-disable-line

// types of simple swap token
const tokenTypes = ['nf', 'ns', 'ps', 'po', 'pa', 'pp', 'pr', 'tc', 'tf', 'tn']

// default values for swap tokens that are used when nothing is entered in the input fields - this prevents strange outputs that might confuse the user
const profileDefaults = {
  nf: 'Creyon',
  ns: 'GT',
  ps: 'They',
  po: 'Them',
  pa: 'Their',
  pp: 'Theirs',
  pr: 'Themself',
  tc: 'Person', // TODO: better default terms
  tf: 'Buddy',
  tn: 'Person'
}

function getOutput() { // eslint-disable-line
  document.getElementById('output').innerText = generateFromTemplates(5)
}

// generate an output from *num* templates
// TODO: make num customisable, while avoiding it being bigger than the number of templates (maybe just an alert for now?)
function generateFromTemplates (num) {
  const IDs = getTemplateIDs(num)
  let output = ''
  for (let i = 0; i < num; i++) {
    output += replaceTokens(templates[IDs[i]]) + '\n'
  }
  return output
}

// get a random set of template IDs, ensuring there are no duplicates
// TODO: select based on template themes, attributes, and tokens used, e.g. positive, negative, includes primary name, includes reflexive
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

// replace all tokens with relevant text
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
        // use default value
        replacement = profileDefaults[mainStr]
      }
      replacement = replacement.toLowerCase()
      if (parts.length > 1) {
        const params = parts[1].split(',')
        params.forEach(param => {
          switch (param) {
            // full caps param
            case 'f':
              replacement = replacement.toUpperCase()
              break
            // capitalise first letter, e.g. for sentence start or names
            case 'c':
              replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1)
              break
            default:
              break
          }
        })
      }
      // replace the full token with the new string
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
        // plural tags - words that sound weird after plural-like pronouns such as they/them can be specified here, e.g. "they were" not "they was"
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

// get swap token profile data from the input fields, return it as an object
function grabProfile () {
  const profile = {}
  tokenTypes.forEach(token => {
    profile[token] = document.getElementById('profile-' + token).value
  })
  return profile
}
