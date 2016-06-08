'use strict'

import React, { PropTypes } from 'react'

const draw = (width, height, canvasCtx, prevVolume, volume, maxVolume) => {
  const vol = Math.max(volume, prevVolume * 0.95)
  canvasCtx.clearRect(0, 0, width, height)
  for (let i = 0; i < 5; i++) {
    canvasCtx.fillStyle = ((i + 1) * (maxVolume / 5) < vol) ? 'green' : 'grey'
    const x = width * i / 5
    const y = height * 0.6 - height * i * 0.15
    canvasCtx.fillRect(x, y, width / 6, height - y)
    if (i * 10 < vol) {
      canvasCtx.fillStyle = 'green'
      canvasCtx.fillRect(x, y, ((vol % (maxVolume / 5)) / (maxVolume / 5)) * (width / 6), height - y)
    }
  }
}

const VolumeMeter = React.createClass({
  getVolume () {
    this.analyser.getByteFrequencyData(this.array)
    const length = this.array.length
    let total = 0

    for (let i = 0; i < length; i++) {
      total += this.array[i]
    }
    return total / length
  },

  start () {
    const { width, height, maxVolume } = this.props
    const canvasCtx = this.refs.canvas.getContext('2d')
    let prevVolume = 0

    const drawLoop = () => {
      if (this.analyser.ended) return
      const volume = this.getVolume()
      draw(width, height, canvasCtx, volume, prevVolume, maxVolume || 50)
      prevVolume = volume
      this.rafId = window.requestAnimationFrame(drawLoop)
    }

    drawLoop()
  },

  stop () {
    const { width, height, maxVolume } = this.props
    const canvasCtx = this.refs.canvas.getContext('2d')
    window.cancelAnimationFrame(this.rafId)
    draw(width, height, canvasCtx, 0, 0, maxVolume || 50)
  },

  componentDidMount () {
    const { width, height, maxVolume } = this.props
    const canvasCtx = this.refs.canvas.getContext('2d')

    draw(width, height, canvasCtx, 0, 0, maxVolume || 50)
  },

  componentWillUpdate (nextProps) {
    if (!this.props.src && nextProps.src) {
      const { audioContext, src } = nextProps
      this.analyser = audioContext.createAnalyser()
      src.connect(this.analyser)
      this.array = new Uint8Array(this.analyser.frequencyBinCount)
    }
  },

  componentDidUpdate (prevProps) {
    if (this.props.command && this.props.command !== 'none' && prevProps.command !== this.props.command) {
      this[this.props.command]()
    }
  },

  render () {
    const { width, height } = this.props
    const st = {
      width: width,
      height: height
    }

    return (
      <canvas
        ref='canvas'
        style={st}
      />
    )
  },

  propTypes: {
    command: PropTypes.oneOf(['start', 'stop', 'none']),
    audioContext: PropTypes.object.isRequired,
    src: PropTypes.object,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    maxVolume: PropTypes.number
  }
})

export default VolumeMeter
