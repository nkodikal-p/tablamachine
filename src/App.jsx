import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TablaMachine from './tablamachine';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <TablaMachine />
      </div>
    </>
  )
}

export default App
