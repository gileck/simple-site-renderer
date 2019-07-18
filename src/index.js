import ReactDOM from 'react-dom'
import React from 'react'
import Renderer from './Renderer'

let workerFinishResolver, worker, components

function waitForWorkerToFinish() {
  return new Promise(resolve => {
    workerFinishResolver = resolve
  })
}

function setComponentData({compId, data}) {
  const component = components.find(comp => compId === comp.compId)
  Object.assign(component.data, data)
}

const handlers = {
  SET_DATA: setComponentData,
  WORKER_DONE: () => workerFinishResolver()
}

async function startViewer() {
  components = await fetch('/siteStructure').then(res => res.json())
  const wixCode = await fetch('/wixCode').then(res => res.text())

  worker = new Worker('/worker.js')
  worker.postMessage({
    wixCode,
    components,
    type: "START"
  })

  worker.onmessage = ({data}) => handlers[data.type](data)
  await waitForWorkerToFinish()

  ReactDOM.render(<Renderer components={components}/>, document.getElementById('root'))
}

startViewer()
