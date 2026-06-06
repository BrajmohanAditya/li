import React from 'react'
import MainRoutes from './routes/mainRoute'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <div><MainRoutes/></div>
    </BrowserRouter>
  )
}

export default App
