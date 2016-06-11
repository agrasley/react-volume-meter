# react-volume-meter
A volume meter react component

## Installation

```
npm install react-volume-meter
```

## Example

See a working example [here](https://agrasley.github.io/react-audio-example/).

This example uses this component as well as the [react-recorder](https://github.com/agrasley/react-recorder) component. It uses [redux](http://redux.js.org/) to manage state with the [react-recorder-redux](https://github.com/agrasley/react-recorder-redux) package. Check out the full source code for the example [here](https://github.com/agrasley/react-audio-example).

## Overview

This component animates a volume meter through an HTML5 `canvas` element. It takes a Web Audio node as input, creates an `AnalyserNode`, and computes the volume, which it then displays through the `canvas` element.

## Props

### audioContext

An instance of either `window.audioContext` or `window.webkitAudioContext`, depending on your browser. If you use the Web Audio API elsewhere on the page, be sure to pass the instance of `AudioContext` to this component, since you should generally only have one instantiation per page.

### src

Optional, although the animation won't start properly without it. A Web Audio Node object that implements the `connect` method. For example, you can call `audioContext.createMediaStreamSource(stream)` to create a node from the stream object returned by a `navigator.getUserMedia` recording.

### width

The width of the canvas in pixels. The canvas adjusts its animation automatically but is designed to look best when its width:height ratio is 3:2.

### height

The height of the canvas in pixels. The canvas adjusts its animation automatically but is designed to look best when its width:height ratio is 3:2.

### maxVolume

Optional. The maximum volume level for the volume meter. Its theoretical maximum is 255 but chances are you'll never get that high in normal use. When the volume exceeds the `maxVolume` level, the final bar of the meter turns red. Defaults to 50, which seems to work well for microphone recordings of normal human speech.

### style

Optional. Style of the canvas element.

### command

Optional. Permitted values are `'start'`, `'stop'`, and `'none'`. Useful for passing directives to the component in a redux-like system where state is communicated through props. When the value for the `command` prop is changed, the component calls the corresponding method (except in the default case of `'none'`). Users can also call these methods directly by accessing the component's `ref`.
