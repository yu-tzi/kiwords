import React from "react";
import { useState, useEffect } from 'react';
import '../style/Effect.scss';

const RippleButton = (props) => {

  const [circle, setCircle] = useState({ x: -1, y: -1 })
  useEffect(() => {
    console.log(circle)
    if (circle.x !== -1 && circle.y !== -1) {
      setRippling(true)
      setTimeout((() => { setRippling(false) }), 1200)
    } else {
      setRippling(false)
    }
  }, [circle])


  const [rippling, setRippling] = useState(false)
  useEffect(() => {
    if (!rippling) {
      setCircle({ x: -1, y: -1 })
    }
  }, [rippling])

  const clickBottom = (e) => {
    console.log('click!')
    let btnViewDistance = e.target.getBoundingClientRect()
    let x = e.clientX - btnViewDistance.left
    let y = e.clientY - btnViewDistance.bottom
    console.log(x + 10)
    console.log(y + 15)
    setCircle({ x: x + 10, y: y + 15 })
  }

  return (
    <div className={props.effectClass}
      onClick={(e) => {
        clickBottom(e)
      }}
    >
      {
        rippling ?
          <span className="rippleCir"
            style={{
              left: circle.x,
              top: circle.y
            }}
          >
          </span>
          :
          <span>
          </span>
      }
      <span className="childContent">{props.children}
      </span>
    </div>
  )
}

export { RippleButton }