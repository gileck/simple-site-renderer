import ReactDOM from 'react-dom'
import React from 'react'
import Renderer from './Renderer'

let components

function platform() {
  return new Promise(async resolve => {
    const wixCode = await fetch('/wixCode').then(res => res.text())
    const worker = new Worker('/worker.js')
    worker.postMessage({
      wixCode,
      components,
      type: "START"
    })
    const handlers = {
      SET_DATA: function ({compId, data}) {
        const component = components.find(comp => compId === comp.compId)
        Object.assign(component.data, data)
      },
      WORKER_DONE: () => resolve(),
    }
    worker.onmessage = ({data}) => handlers[data.type](data)
  })
}

async function startViewer() {
  components = await fetch('/siteStructure').then(res => res.json())
  await platform()
  ReactDOM.render(<Renderer components={components}/>, document.getElementById('root'))
}

startViewer()
