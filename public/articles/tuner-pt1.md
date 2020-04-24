---
title: How to build a tuner in Javascript ? - Part 1
description: With no prior DSP knowledge
creationDate: 04/18/2020
---
## What is a tuner ?

A tuner is a device that helps tune (mostly strings based) instruments. It takes a sound in input and output a note name if it's close enough.

## Get audio data from the microphone

First, we need some audio stream from the microphpone to analyze. Request access to it, and store the audio stream in a variable.

```js
const audioStreamRequest = navigator.mediaDevices.getUserMedia({ audio: true })

audioStreamRequest
  .then((audioStream) => {
    /* ... Following source code will be there ... */
  })
  .catch(err => {
    console.error("Error when requesting mic audio stream", err)
  })
```

## Inserting our audio in a context

Second we'll need to inject this audio stream in a context we can analyse. We can use the [Web Audio Api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for that. It provides a [context](), [audio nodes](), [filters]() and many more, that we can use to manipulate and analyse sound with browser javascript.

```js
const ctx = new AudioContext()
```

We'll also define the audio stream from the mic as a "source node" for our chain.

```js
const sourceNode = ctx.createMediaStreamSource(audioStream)
```

## Analyse the sound

### How do I want to do it ?

I have a very crude idea in mind.
Extract frequencies from the stream and see if there are frequencies with high magnitude.

_Spoiler: This is not how to do it_

### Let's do it

#### Extracting the data

Now that we have an Audio Context we can play with, we can analyse the audio stream from the mic. The Web audio Api provides an [Analyser Node](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) for that.

> The AnalyserNode interface represents a node able to provide real-time frequency and time-domain analysis information. It is an AudioNode that passes the audio stream unchanged from the input to the output, but allows you to take the generated data, process it, and create audio visualizations.

It seems that the [Analyse Node](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) can output frequencies with their magnitudes ? Let's dig into it.

In the documentation there are two methods that we may have a use for :
- [getFloatFrequencyData](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData)
> Copies the current frequency data into a Float32Array array passed into it.
- [getByteFrequencyData](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData)
> Copies the current frequency data into a Uint8Array (unsigned byte array) passed into it.

Let's try extracting data from out mic input and see what it looks like.

So, we'll create an [Analyser Node](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) and connect it to our source node. Since we do not plan to do anything else with our audio stream, we can ommit to connect the analyse node output.

```js
const analyserNode = ctx.createAnalyser()
sourceNode.connect(analyserNode)
```

For now our chain looks like this :

```plaintext
---------------         ----------------
| Source Node | ------> | AnalyserNode |
---------------         ----------------
```

We'll use the `getByteFrequencyData` since it is easier to use. Let's try requesting the data from the Analyser Node each 300ms. Let's follow MDN's documentation.

```js
function collectAnalyserData() {
  // Uint8Array should be the same length as the frequencyBinCount
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount)
  analyserNode.getByteFrequencyData(dataArray)
  console.log(dataArray)

  setTimeout(collectAnalyserData, 300)
}

collectAnalyserData()
```


Let's look at the console for a moment. We see, each 300ms an Uint8Array of 1024 numbers. Those numbers are bytes, so are ranging between 0 and 255.
What do we do with that ?
![Uint8Array from the console](/articles/images/tuner-pt1/uint-array.png)

#### Understanding the data

After a few seconds looking online, I found out that what `getByteFrequencyData` does under the hood is a Fast Fourier Transform (FFT).

_A FFT is a formula used to switch between time domain to frequency domain._

Let's skip forward a few days trying to understand what FFT is. I found 2 videos on YouTube that sums it pretty well. Watch the [first](https://www.youtube.com/watch?v=mkGsMWi_j4Q) one, then the [second](https://www.youtube.com/watch?v=htCj9exbGo0) one.

Since we are now in the frequency domain, we have 1024 `frequencyBins`. But what are those `frequencyBins` ? And why 1024 ?

We've 1024 frequency bins because the size of the FFT by default is 2048 and we cannot calculate magnitudes above the Nyquist limit (go check out video two if you didn't). It means that the FFT will take our audio stream and output 1024 numbers each representing a value related to a frequency bin.

After a few research frequency bin is a range between two frequencies and is calculated as follow : `sampleRate / fftSize`. What is this `sampleRate` ?

If I check the `sampleRate` from my current audio context I get `48000`. It means that I get `48000` samples per second. Well, that's a lot. But for now, I don't need this information. Though, I can use it to calculate the frequency bin range.

```js
const frequencyBinRange = ctx.sampleRate / analyserNode.fftSize
console.log(frequencyBinRange)
```

With my values I end up with a `frequencyBinRange` of `23.4375`. That's a huge range. Let's try to reduce it a bit. Can we increase the `fftSize` ? Yes ! As long that it's a power of 2 and within the range of `2⁵` and `2¹⁵`. Let's set it to the maximum, see where we can end up. So, let's set the `fftSize` to `32768` before calculating that range.

```js
analyserNode.fftSize = 32768
```

I end up with a much smaller range of `1.46484375`. That is ok but I would prefer below 1Hz. Let's see if we can lower that a bit.