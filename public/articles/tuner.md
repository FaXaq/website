---
title: How to build a tuner in Javascript ?
creationDate: 04/18/2020
---
## What is a tuner ?

A tuner is a device that helps tune (mostly strings based) instruments. It takes a sound in input and output a note name if it's close enough.

## Get audio data from the microphone

First, we need some audio stream from the microphpone to analyze. Request access to it, and store the audio stream in a variable.

```js
try {
  const audioStream = navigator.mediaDevices.getUserMedia({ audio: true })
} catch (err) {
  console.error('Error while requesting microphone access', err)
}
```