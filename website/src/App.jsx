import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import OnBoarding from './pages/OnBoarding'

function App() {
  const [count, setCount] = useState(0)

  return (
    <OnBoarding />
  )
}

export default App
