// public/soundtouch-processor.js

// This script is loaded by AudioWorklet.addModule() and runs in a separate thread.
// It cannot directly access the DOM or main thread variables.
// We need to import the soundtouch library here. Vite will handle the path correctly.
import { SimpleFilter, SoundTouch, WebAudioBufferSource } from '../src/soundtouch-js';

/**
 * A custom AudioWorkletProcessor to apply SoundTouch effects.
 */
class SoundTouchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.filter = null;

    // Listen for messages from the main thread
    this.port.onmessage = (event) => {
      const { type, data } = event.data;

      if (type === 'init') {
        // Create a mock AudioBuffer source that the library can use
        const source = {
          extract: (target, numFrames, position) => {
            const l = Math.min(data.samples.length - position, numFrames);
            for (let i = 0; i < l; i++) {
              target[i] = data.samples[i + position];
            }
            // Loop by resetting position if we reach the end
            if (l < numFrames) {
                this.port.postMessage({ type: 'loop' });
            }
            return l;
          },
        };
        
        const soundTouch = new SoundTouch();
        soundTouch.tempo = data.tempo;
        soundTouch.pitch = data.pitch;

        this.filter = new SimpleFilter(source, soundTouch);
      } else if (type === 'update') {
        if (this.filter) {
          this.filter.pipe.tempo = data.tempo;
          this.filter.pipe.pitch = data.pitch;
        }
      }
    };
  }

  /**
   * Called by the browser's audio engine to process audio.
   * @param {Float32Array[][]} inputs - An array of inputs, each with an array of channels.
   * @param {Float32Array[][]} outputs - An array of outputs, each with an array of channels.
   * @param {Record<string, Float32Array>} parameters - Audio parameters.
   * @returns {boolean} - Return false to stop the processor.
   */
  process(inputs, outputs, parameters) {
    if (!this.filter) {
      return true; // Not initialized yet
    }

    const outputChannel = outputs[0][0];
    const framesExtracted = this.filter.extract(outputChannel, outputChannel.length);

    if (framesExtracted === 0) {
      this.port.postMessage({ type: 'end' });
      return false; // Stop processing if no more frames
    }

    return true;
  }
}

registerProcessor('soundtouch-processor', SoundTouchProcessor);
