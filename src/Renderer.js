import React from 'react'
import _ from 'lodash'
import {observer} from 'mobx-react'

const Button = props => {
  const clickHandler = props.onClick || _.noop
  return <button onClick={clickHandler} style={{width: props.layout.width, height:props.layout.height}}>{props.data.label}</button>
}
const Image = props => <img style={{width: props.layout.width, height:props.layout.height}} src={props.data.src}/>
const Text = props => <div>{props.data.text}</div>
const viewerComponents = _.mapValues({
  Text,
  Button,
  Image
}, comp => observer(comp))

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
