import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PortPolio from './components/portpolio/Portpolio'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PortPolio />
    </>
  )
}

export default App
