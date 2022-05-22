// this is just here to circumvent an issue with StandardJS while keeping the code clean
const templates = exportTemplates // eslint-disable-line

// types of simple swap token
const tokenTypes = ['nf', 'ns', 'ps', 'po', 'pa', 'pp', 'pr', 'tc', 'tf', 'tn']

// default values for swap tokens that are used when nothing is entered in the input fields - this prevents strange outputs that might confuse the user
const profileDefaults = {
  nf: 'Cinder',
  ns: 'Smith',
  ps: 'They',
  po: 'Them',
  pa: 'Their',
  pp: 'Theirs',
  pr: 'Themself',
  tc: 'Person', // TODO: better default terms
  tf: 'Buddy',
  tn: 'Person'
}

function getOutput () { // eslint-disable-line
  document.getElementById('output').innerText = generateFromTemplates(document.getElementById('option-count').value)
}

// generate an output from *num* templates
// TODO: make num customisable, while avoiding it being bigger than the number of templates (maybe just an alert for now?)
function generateFromTemplates (num) {
  const chosenTemplates = getTemplates(num)
  let output = ''
  chosenTemplates.forEach(template => {
    output += replaceTokens(template) + '\n'
  })
  return output
}

// get a random set of template IDs, ensuring there are no duplicates
function getTemplates (num) {
  const usableTemplates = [...templates] // duplicate the array to prevent overwrite issues
  const filters = grabFilters()
  const outputTemplates = []
  let randomTemplate
  for (let i = 0; i < num; i++) {
    let isUsable = false
    let abort = false
    let templateID
    do {
      templateID = Math.floor(Math.random() * usableTemplates.length)
      randomTemplate = usableTemplates[templateID]
      if (meetsFilters(filters, randomTemplate)) {
        isUsable = true
        outputTemplates.push(randomTemplate)
      }
      usableTemplates.splice(templateID, 1)
      if (usableTemplates.length <= 0) {
        window.alert('Not enough valid templates!')
        console.error('Not enough valid templates!')
        i = num
        abort = true
      }
    }
    while (!isUsable && !abort)
  }
  return outputTemplates
}

// checks if a string meets filter requirements
function meetsFilters (filters, str) {
  let output = true
  filters.forEach(filter => {
    if (!str.includes('%' + filter)) {
      output = false
    }
  })
  return output
}

// grab an array of the filters
function grabFilters () {
  const filters = []
  tokenTypes.forEach(token => {
    if (document.getElementById('filter-' + token).checked) {
      filters.push(token)
    }
  })
  return filters
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
