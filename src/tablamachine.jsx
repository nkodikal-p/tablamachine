import React, { useState, useRef, useEffect } from 'react';
import {
  SimpleFilter,
  SoundTouch,
  WebAudioBufferSource,
  getWebAudioNode,
} from './soundtouch-js';
import { FaPlay, FaStop } from 'react-icons/fa';

// List of available taals and their files
const TAAL_FILES = {
  'Japtaal': [
  { bpm: 100, file: 'sounds/taals/japtaal_100_G.mp3', key: 'G' },
  { bpm: 100, file: 'sounds/taals/japtaal_100_Cs.mp3', key: 'C#' },
  { bpm: 160, file: 'sounds/taals/japtaal_160_G.mp3', key: 'G' },
  { bpm: 160, file: 'sounds/taals/japtaal_160_Cs.mp3', key: 'C#' }

  ],
  'Bhajani': [
  { bpm: 80, file: 'sounds/taals/bhajani_80_G.mp3', key: 'G' },
  { bpm: 80, file: 'sounds/taals/bhajani_80_Cs.mp3', key: 'C#' },
  { bpm: 100, file: 'sounds/taals/bhajani_100_G.mp3', key: 'G' },
  { bpm: 100, file: 'sounds/taals/bhajani_100_Cs.mp3', key: 'C#' },
  ],
  'Teentaal': [
  { bpm: 80, file: 'sounds/taals/teentaal_80_G.mp3', key: 'G' },
  { bpm: 80, file: 'sounds/taals/teentaal_80_Cs.mp3', key: 'C#' },
  { bpm: 100, file: 'sounds/taals/teentaal_100_G.mp3', key: 'G' },
  { bpm: 100, file: 'sounds/taals/teentaal_100_Cs.mp3', key: 'C#' },
  { bpm: 120, file: 'sounds/taals/teentaal_120_G.mp3', key: 'G' },
  { bpm: 120, file: 'sounds/taals/teentaal_120_Cs.mp3', key: 'C#' },
  { bpm: 140, file: 'sounds/taals/teentaal_140_G.mp3', key: 'G' },
  { bpm: 140, file: 'sounds/taals/teentaal_140_Cs.mp3', key: 'C#' },
  { bpm: 160, file: 'sounds/taals/teentaal_160_G.mp3', key: 'G' },
  { bpm: 160, file: 'sounds/taals/teentaal_160_Cs.mp3', key: 'C#' },
  { bpm: 180, file: 'sounds/taals/teentaal_180_G.mp3', key: 'G' },
  { bpm: 180, file: 'sounds/taals/teentaal_180_Cs.mp3', key: 'C#' },
  { bpm: 200, file: 'sounds/taals/teentaal_200_G.mp3', key: 'G' },
  { bpm: 200, file: 'sounds/taals/teentaal_200_Cs.mp3', key: 'C#' },
  ],
  'Ektaal': [
  { bpm: 80, file: 'sounds/taals/ektaal_80_G.mp3', key: 'G' },
  { bpm: 80, file: 'sounds/taals/ektaal_80_Cs.mp3', key: 'C#' },
  { bpm: 100, file: 'sounds/taals/ektaal_100_G.mp3', key: 'G' },
  { bpm: 100, file: 'sounds/taals/ektaal_100_Cs.mp3', key: 'C#' },
  { bpm: 120, file: 'sounds/taals/ektaal_120_G.mp3', key: 'G' },
  { bpm: 120, file: 'sounds/taals/ektaal_120_Cs.mp3', key: 'C#' },
  { bpm: 140, file: 'sounds/taals/ektaal_140_G.mp3', key: 'G' },
  { bpm: 140, file: 'sounds/taals/ektaal_140_Cs.mp3', key: 'C#' },
  { bpm: 160, file: 'sounds/taals/ektaal_160_G.mp3', key: 'G' },
  { bpm: 160, file: 'sounds/taals/ektaal_160_Cs.mp3', key: 'C#' },
  { bpm: 180, file: 'sounds/taals/ektaal_180_G.mp3', key: 'G' },
  { bpm: 180, file: 'sounds/taals/ektaal_180_Cs.mp3', key: 'C#' },
  { bpm: 200, file: 'sounds/taals/ektaal_200_G.mp3', key: 'G' },
  { bpm: 200, file: 'sounds/taals/ektaal_200_Cs.mp3', key: 'C#' }
  ],
  'Roopak': [
  { bpm: 80, file: 'sounds/taals/roopak_80_G.mp3', key: 'G' },
  { bpm: 80, file: 'sounds/taals/roopak_80_Cs.mp3', key: 'C#' },
  { bpm: 100, file: 'sounds/taals/roopak_100_G.mp3', key: 'G' },
  { bpm: 100, file: 'sounds/taals/roopak_100_Cs.mp3', key: 'C#' },
  { bpm: 120, file: 'sounds/taals/roopak_120_G.mp3', key: 'G' },
  { bpm: 120, file: 'sounds/taals/roopak_120_Cs.mp3', key: 'C#' },
  { bpm: 140, file: 'sounds/taals/roopak_140_G.mp3', key: 'G' },
  { bpm: 140, file: 'sounds/taals/roopak_140_Cs.mp3', key: 'C#' },
  { bpm: 160, file: 'sounds/taals/roopak_160_G.mp3', key: 'G' },
  { bpm: 160, file: 'sounds/taals/roopak_160_Cs.mp3', key: 'C#' },
  { bpm: 180, file: 'sounds/taals/roopak_180_G.mp3', key: 'G' },
  { bpm: 180, file: 'sounds/taals/roopak_180_Cs.mp3', key: 'C#' },
  { bpm: 200, file: 'sounds/taals/roopak_200_G.mp3', key: 'G' },
  { bpm: 200, file: 'sounds/taals/roopak_200_Cs.mp3', key: 'C#' }
  ],
};

const TAAL_NAMES = Object.keys(TAAL_FILES);

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const TAAL_BEATS = {
  'Roopak': 7,
  'Dadra': 6,
  'Japtaal': 10,
  'Ektaal': 12,
  'Teentaal': 16,
  'Bhajani': 8,
  'Keherwa': 8,
  'Choutaal': 12,
  'Dhamaar': 14,
  'Deepchandi': 14,
  'Jhoomra': 14,
  'Tilwada': 16,
};

const getSourceFile = (taalName, targetBpm, selectedKey) => {
  const filesForTaal = TAAL_FILES[taalName];
  const specialKeys = ['A', 'A#', 'B', 'C', 'C#'];
  // Use the canonical key label that matches TAAL_FILES metadata
  let keyToUse = specialKeys.includes(selectedKey) ? 'C#' : 'G';
  const filesForKey = filesForTaal.filter(f => f.key === keyToUse);
  const suitableFiles = filesForKey.filter(f => f.bpm <= targetBpm);
  let pickedFile;
  if (suitableFiles.length > 0) {
    pickedFile = suitableFiles.reduce((prev, current) => (prev.bpm > current.bpm) ? prev : current);
  } else if (filesForKey.length > 0) {
    pickedFile = filesForKey.reduce((prev, current) => (prev.bpm < current.bpm) ? prev : current);
  } else {
    pickedFile = filesForTaal.reduce((prev, current) => (prev.bpm < current.bpm) ? prev : current);
  }
  return pickedFile;
};


function TablaMachine() {
  // Ref for BPM debounce timer
  const bpmDebounceRef = useRef(null);
  const [selectedTaalName, setSelectedTaalName] = useState('Teentaal');
  const [selectedKey, setSelectedKey] = useState('G#');
  // Remove default margin and padding from body and html to eliminate gaps around the background
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, []);
  const [bpm, setBpm] = useState(150);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatCounter, setBeatCounter] = useState(0);
  const [tanpuraOn, setTanpuraOn] = useState(false);
  const tanpuraAudioRef = useRef(null);
  // Add state for tanpura volume
  const [tanpuraVolume, setTanpuraVolume] = useState(0.1);
  // Add state for fine-tune pitch adjustment (in cents)
  const [pitchFinetuneInCents, setPitchFinetuneInCents] = useState(0);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const startTimeRef = useRef(0);
  const animationFrameRef = useRef(null);

  const sourceFile = getSourceFile(selectedTaalName, bpm, selectedKey);



  // Calculate tempo ratio
  const getTempoRatio = () => bpm / sourceFile.bpm;

  useEffect(() => {
    const beats = TAAL_BEATS[selectedTaalName] || 0;

    const animate = () => {
      if (audioCtxRef.current && startTimeRef.current > 0) {
        // A small latency offset to align the counter with the audio output.
        // This value may need tuning, but it's a starting point.
        const LATENCY_OFFSET_S = 0.15; // 150ms
        const elapsedTime = audioCtxRef.current.currentTime - startTimeRef.current - LATENCY_OFFSET_S;

        if (elapsedTime > 0) {
          const newBeat = Math.floor((elapsedTime * bpm) / 60) % beats + 1;
          setBeatCounter(newBeat);
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const handlePlay = async (loop = false) => {
      // Helper to calculate pitch shift in semitones between selectedKey and sourceFile.key
      const getPitchShift = () => {
        // Normalize key naming: some source files use 'Cs' while KEYS uses 'C#'.
        const normalize = (k) => {
          if (!k) return k;
          // Convert 'Cs' -> 'C#', 'Ds' -> 'D#', etc. Also accept either '#'.
          return k.replace(/s$/, '#');
        };

        const origKey = normalize(sourceFile.key);
        const targetKey = normalize(selectedKey);

  const origKeyIdx = KEYS.indexOf(origKey);
  const newKeyIdx = KEYS.indexOf(targetKey);
  if (origKeyIdx === -1 || newKeyIdx === -1) return 0;
  // Compute minimal semitone difference within an octave.
  // This maps the raw difference into the range [-6, +5], which
  // prefers downward shifts when that yields a smaller magnitude
  // (e.g. C# -> A: raw diff 8 becomes -4).
  const rawDiff = newKeyIdx - origKeyIdx;
  let semitoneDiff = ((rawDiff + 6) % 12) - 6;
  // As a safety, clamp to -12..+12 (shouldn't be needed here).
  if (semitoneDiff > 12) semitoneDiff = 12;
  if (semitoneDiff < -12) semitoneDiff = -12;
  // Add fine-tune adjustment in cents (convert to semitones: 100 cents = 1 semitone)
  const finetuneInSemitones = pitchFinetuneInCents / 100;
  return semitoneDiff + finetuneInSemitones;
      };
      // On the first run (not a loop), ensure the context is created.
      if (!loop && !audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Disconnect and clear the previous source if it exists.
      if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
          sourceNodeRef.current = null;
      }

  // Stop any previous animation frame.
  cancelAnimationFrame(animationFrameRef.current);

  // Log chosen audio file and metadata for debugging
  console.log('Playing file:', sourceFile.file, 'sourceKey:', sourceFile.key, 'sourceBpm:', sourceFile.bpm, 'selectedKey:', selectedKey, 'targetBpm:', bpm);

  const response = await fetch(`${import.meta.env.BASE_URL}${sourceFile.file.replace(/^\//, '')}`);
      const arrayBuffer = await response.arrayBuffer();
      // Use a try-catch block to handle potential decoding errors.
      let audioBuffer;
      try {
        audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
      } catch (e) {
        console.error('Error decoding audio data:', e);
        setIsPlaying(false); // Stop playback if audio is invalid.
        return;
      }


  const source = new WebAudioBufferSource(audioBuffer);
  const soundTouch = new SoundTouch();
  soundTouch.tempo = getTempoRatio();
  const pitchShift = getPitchShift();
  const pitchValue = Math.pow(2, pitchShift / 12);
  console.log('Selected Key:', selectedKey, 'Pitch shift (semitones):', pitchShift, 'Pitch value:', pitchValue);
  soundTouch.pitch = pitchValue; // Shift pitch to selected key

  const filter = new SimpleFilter(source, soundTouch);
  const node = getWebAudioNode(audioCtxRef.current, filter);
  sourceNodeRef.current = node;
      
  node.connect(audioCtxRef.current.destination);
      
      // A small delay before starting the counter to allow for audio processing latency.
      const startDelay = 150; // milliseconds
      setTimeout(() => {
        startTimeRef.current = audioCtxRef.current.currentTime;
        if (beats > 0) {
          setBeatCounter(1); // Start at 1
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }, startDelay);

      // When the track ends, if we are still in "playing" state, loop it.
      node.onended = () => {
          if (isPlaying) {
              handlePlay(true); // Recursively call handlePlay to loop
          }
      };
    };

    if (isPlaying) {
      handlePlay();
    } else {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      cancelAnimationFrame(animationFrameRef.current);
      setBeatCounter(0);
    }
    
    // Cleanup function: this runs when isPlaying becomes false or the component unmounts.
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, sourceFile, selectedKey, bpm, selectedTaalName, pitchFinetuneInCents]);

  // Handle Tanpura playback when toggled or key changes
  useEffect(() => {
    // Always stop previous audio before changing
    if (tanpuraAudioRef.current) {
      tanpuraAudioRef.current.pause();
      tanpuraAudioRef.current = null;
    }
    if (tanpuraOn) {
      const note = selectedKey.replace('#', 's');
      const audio = new Audio(`${import.meta.env.BASE_URL}sounds/tanpura/${note}.mp3`);
      audio.loop = true;
      audio.volume = 0.2; // Set default volume
      audio.play();
      tanpuraAudioRef.current = audio;
    }
    return () => {
      if (tanpuraAudioRef.current) {
        tanpuraAudioRef.current.pause();
        tanpuraAudioRef.current = null;
      }
    };
  }, [tanpuraOn, selectedKey]);

  // Update tanpura audio volume when changed
  useEffect(() => {
    if (tanpuraAudioRef.current) {
      tanpuraAudioRef.current.volume = tanpuraVolume;
    }
  }, [tanpuraVolume]);

  const updateBpm = (amount) => {
    const newBpm = bpm + amount;
    if (newBpm >= 40 && newBpm <= 300) {
      setBpm(newBpm);
    }
  };

  const handleSliderChange = (value) => {
    setBpm(value);
    if (isPlaying) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      setIsPlaying(false);
      // Debounce: only restart playback after user stops moving slider for 200ms
      if (bpmDebounceRef.current) {
        clearTimeout(bpmDebounceRef.current);
      }
      bpmDebounceRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, 200);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      fontFamily: 'sans-serif',
      backgroundImage: `url('${import.meta.env.BASE_URL}Tablas_Kodikal_highres.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        maxWidth: 400,
        width: '90vw',
        margin: 0,
        padding: '20px 12.5%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{ textAlign: 'center', fontSize: '2.0em', fontWeight: 'bold', color: '#333', marginBottom: '10px', height: '2.2em' }}>
          {isPlaying && (
            <span style={{ minWidth: '2em', display: 'inline-block', textAlign: 'center' }}>{beatCounter}</span>
          )}
          {isPlaying && ` / ${TAAL_BEATS[selectedTaalName] || 0}`}
        </div>
        <h1 style={{ textAlign: 'center', color: '#676767ff' }}>e-Tabla</h1>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', color: '#676767ff', fontSize: '1.0em'  }}>Taal: </label>
          <select value={selectedTaalName} style={{ fontSize: '1.25em', width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#efeeeeff', textAlign: 'center' }} onChange={e => {
            const newTaalName = e.target.value;
            setSelectedTaalName(newTaalName);
          }}>
            {[...TAAL_NAMES]
              .sort((a, b) => (TAAL_BEATS[a] || 0) - (TAAL_BEATS[b] || 0))
              .map(t => (
                <option key={t} value={t}>
                  {t} {TAAL_BEATS[t] ? TAAL_BEATS[t] : ''}
                </option>
              ))}
          </select>
        </div>
        <div style={{ marginTop: 20, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <button 
            onClick={() => setIsPlaying(true)} 
            disabled={isPlaying} 
            style={{
              flex: '1 1 48%',
              backgroundColor: isPlaying ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              margin: '4px 2px',
              cursor: isPlaying ? 'not-allowed' : 'pointer',
              borderRadius: '8px',
              transition: 'background-color 0.3s',
            }}
          >
            <FaPlay style={{ marginRight: '8px' }} /> Play
          </button>
          <button 
            onClick={() => setIsPlaying(false)} 
            disabled={!isPlaying} 
            style={{
              flex: '1 1 48%',
              backgroundColor: !isPlaying ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              margin: '4px 2px',
              cursor: !isPlaying ? 'not-allowed' : 'pointer',
              borderRadius: '8px',
              transition: 'background-color 0.3s',
            }}
          >
            <FaStop style={{ marginRight: '8px' }} /> Stop
          </button>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold', color: '#676767ff', marginRight: '10px', fontSize: '1.0em' }}>BPM: </label>
            <button onClick={() => updateBpm(-5)} disabled={bpm < 45} style={{ flex: '0 0 auto', padding: '10px', marginRight: '5px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', color: '#333' }}>-5</button>
            <button onClick={() => updateBpm(-1)} disabled={bpm <= 40} style={{ flex: '0 0 auto', padding: '10px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', color: '#333' }}>-</button>
            <span style={{ minWidth: '3em', textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>{bpm}</span>
            <button onClick={() => updateBpm(1)} disabled={bpm >= 300} style={{ flex: '0 0 auto', padding: '10px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', color: '#333' }}>+</button>
            <button onClick={() => updateBpm(5)} disabled={bpm >= 296} style={{ flex: '0 0 auto', padding: '10px', marginLeft: '5px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', color: '#333' }}>+5</button>
          </div>
          <input 
            type="range" 
            min="40" 
            max="300" 
            step="5"
            value={bpm} 
            onChange={(e) => handleSliderChange(Number(e.target.value))} 
            style={{ width: '100%' }} 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', color: '#676767ff', marginRight: '8px', fontSize: '1.0em' }}>Key:</label>
            <select
              value={selectedKey}
              onChange={e => setSelectedKey(e.target.value)}
              style={{ width: '33%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#efeeeeff', marginRight: '16px' }}
            >
              {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#333', cursor: 'pointer' }}>
              <input type="checkbox" checked={tanpuraOn} onChange={() => setTanpuraOn(!tanpuraOn)} style={{ marginRight: '6px' }} />
              Tanpura
            </label>
          </div>
          <div style={{ height: '40px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {tanpuraOn ? (
              <>
                <label style={{ fontWeight: 'bold', color: '#333', marginRight: '8px' }}>Volume:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tanpuraVolume}
                  onChange={e => setTanpuraVolume(parseFloat(e.target.value))}
                  style={{ width: '50%', cursor: 'pointer' }}
                />
              </>
            ) : null}
          </div>
        </div>
        <div style={{ marginBottom: '20px', marginTop: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold', color: '#676767ff', marginRight: '10px', fontSize: '1.0em' }}>Fine-tune: </label>
            <button onClick={() => setPitchFinetuneInCents(pitchFinetuneInCents - 5)} disabled={pitchFinetuneInCents <= -100} style={{ flex: '0 0 auto', padding: '10px', marginRight: '5px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', color: '#333' }}>-</button>
            <span style={{ minWidth: '3em', textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>{pitchFinetuneInCents > 0 ? '+' : ''}{pitchFinetuneInCents}¢</span>
            <button onClick={() => setPitchFinetuneInCents(pitchFinetuneInCents + 5)} disabled={pitchFinetuneInCents >= 100} style={{ flex: '0 0 auto', padding: '10px', marginLeft: '5px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer', color: '#333' }}>+</button>
          </div>
        </div>
      </div>
      <div style={{ width: '100vw', textAlign: 'center', color: '#888', fontSize: '0.8em', marginTop: '16px', marginBottom: '8px', letterSpacing: '1px', position: 'absolute', bottom: '16px' }}>
        Nilesh Kodikal 2026.10.01
      </div>
    </div>
  );
}

export default TablaMachine;