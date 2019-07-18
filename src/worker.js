let _components

self.$w = function (selector) {
  const comp = _components.find(comp => comp.wixCodeId === selector)
  return {
    set text(newText) {
      self.postMessage({
        compId: comp.compId,
        data: {
          text: newText
        },
        type: "SET_DATA"
      })
    }
  }
}

function start({components, wixCode}) {
  _components = components
  eval(wixCode)
  self.postMessage({type: "WORKER_DONE"})
}
const handlers = {
  'START': start
}

self.onmessage = ({data}) => handlers[data.type](data)
