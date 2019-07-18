let _components
const eventHandlers = {}

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
    },
    onClick(cb) {
      const callbackId = `${comp.compId}-onClick`
      eventHandlers[callbackId] = cb
      self.postMessage({
        type: "SET_EVENT_HANDLER",
        callbackId,
        compId: comp.compId
      })
    },
    set src(newSrc) {
      self.postMessage({
        compId: comp.compId,
        data: {
          src: newSrc
        },
        type: "SET_DATA"
      })
    }
  }
}

function handleEvent({callbackId}) {
  eventHandlers[callbackId]()
}

function start({components, wixCode}) {
  _components = components
  eval(wixCode)
  self.postMessage({type: "WORKER_DONE"})
}
const handlers = {
  'START': start,
  'HANDLE_EVENT': handleEvent
}

self.onmessage = ({data}) => handlers[data.type](data)
