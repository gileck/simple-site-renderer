let _components

self.$w = function (selector) {
  const comp = _components.find(comp => comp.wixCodeId === selector)
  return {
    set text(newText) {
      self.postMessage({
        compId: comp.compId,
        data: {
          text: newText
        }
      })
    }
  }
}

self.onmessage = function ({data: {components, wixCode}}) {
  _components = components
  eval(wixCode)
}
