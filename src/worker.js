let _components
const eventHandlers = {}

function setData(data, compId) {
  self.postMessage({
    type: "SET_DATA",
    compId,
    data
  })
}

class Button {
  constructor(comp) {
    this.comp = comp
  }
  onClick(cb) {
    const callbackId = `${this.comp.compId}-onClick`
    eventHandlers[callbackId] = cb
    self.postMessage({
      type: "SET_EVENT_HANDLER",
      callbackId,
      compId: this.comp.compId
    })
  }
  set label(label) {
    setData({label}, this.comp.compId)
  }
  get label() {
    return this.comp.data.label
  }
}

class Text {
  constructor(comp) {
    this.comp = comp
  }
  set text(text) {
    setData({text}, this.comp.compId)
  }
  get text() {
    return this.comp.data.text
  }
}

class Image {
  constructor(comp) {
    this.comp = comp
  }
  set src(src) {
    setData({src}, this.comp.compId)
  }
  get src() {
    return this.comp.data.src
  }
}

const classes = {
  Button,
  Image,
  Text
}

self.$w = function (selector) {
  const comp = _components.find(comp => comp.wixCodeId === selector)
  return new classes[comp.type](comp)
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
