const attrName = 'has-focal-anchors'

function toggleAnchors (id) { // eslint-disable-line
  const container = document.getElementById(id)
  if (container.hasAttribute(attrName)) {
    clearAnchors(container)
  } else {
    addAnchors(container)
  }
}

function clearAnchors (container) {
  container.innerHTML = container.innerHTML.replaceAll('<b>', '')
  container.removeAttribute(attrName)
}

function addAnchors (container) {
  container.setAttribute(attrName, '')
  const lines = container.innerHTML.split('<br>')
  for (let lineID = 0; lineID < lines.length; lineID++) {
    const words = lines[lineID].split(' ')
    for (let wordID = 0; wordID < words.length; wordID++) {
      let word = words[wordID]
      const length = word.replaceAll(/\W/g, '').length
      const boldNum = Math.min(Math.ceil(length / 2), 2)
      word = '<b>' + word.substring(0, boldNum) + '</b>' + word.substring(boldNum)
      words[wordID] = word // using <b> here because the anchors aren't actually important, we just want to draw attention
    }
    lines[lineID] = words.join(' ')
  }
  container.innerHTML = lines.join('<br>')
}
