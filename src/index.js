import ReactDOM from 'react-dom'
import React from 'react'
import Renderer from './Renderer'

let _workerFinishResolver

function waitForWorkerToFinish() {
  return new Promise(resolve => {
    _workerFinishResolver = resolve
  })
}

async function startViewer() {
  const {components} = await fetch(window.RendererModel.siteStructureUrl).then(res => res.json())
  const wixCode = await fetch(window.RendererModel.wixCodeUrl).then(res => res.text())

  const worker = new Worker('/worker.js')
  worker.postMessage({
    wixCode,
    components,
  })

  worker.onmessage = function ({data: {compId, data}}) {
    const component = components.find(comp => compId === comp.compId)
    Object.assign(component.data, data)
    _workerFinishResolver()
  }

  await waitForWorkerToFinish()

  ReactDOM.render(<Renderer components={components}/>, document.getElementById('root'))
}

startViewer()
