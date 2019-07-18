import ReactDOM from 'react-dom'
import React from 'react'
import Renderer from './Renderer'
import {observable, toJS} from 'mobx'

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

function setEventHandler({compId, callbackId}) {
  const component = components.find(comp => compId === comp.compId)
  component.onClick = function () {
    worker.postMessage({
      type: "HANDLE_EVENT",
      callbackId
    })
  }

}

const handlers = {
  SET_DATA: setComponentData,
  WORKER_DONE: () => workerFinishResolver(),
  SET_EVENT_HANDLER: setEventHandler
}

async function startViewer() {
  components = await fetch('/siteStructure').then(res => res.json()).then(data => observable(data))
  const wixCode = await fetch('/wixCode').then(res => res.text())

  worker = new Worker('/worker.js')
  worker.postMessage({
    wixCode,
    components: toJS(components, {recurseEverything: true}),
    type: "START"
  })

  worker.onmessage = ({data}) => handlers[data.type](data)
  await waitForWorkerToFinish()

  ReactDOM.render(<Renderer components={components}/>, document.getElementById('root'))
}

startViewer()
