import React from 'react'
import _ from 'lodash'

const Button = (props) => {
  return <button style={{width: props.layout.width, height:props.layout.height}}>{props.data.label}</button>
}

const Image = (props) => {
  return <img src={props.data.src} width={props.layout.width} height={props.layout.height}/>
}

const Text = (props) => {
  return <div>{props.data.text}</div>
}

const viewerComponents = {
  Text,
  Button,
  Image
}

export default ({components}) => {
  return (<div>
    {
      components.map(comp => {
        const Comp = viewerComponents[comp.type];
        if (!Comp) return <div key={comp.compId}/>
        return (<div key={comp.compId}
                     style={{position: "absolute",
                       top: comp.layout.y,
                       left: comp.layout.x}}>
          <Comp {...comp}/>
        </div>)
      })
    }
  </div>)
}
