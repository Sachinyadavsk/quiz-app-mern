import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Sidebar from './components/Sidebar'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/menu" element={<Sidebar />} />
      
    </Routes>
  )
}

export default App
