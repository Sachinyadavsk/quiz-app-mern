import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Sidebar from './components/Sidebar'
import MyResultPage from './pages/MyResultPage.jsx'

// private protected routes

 function RequireAuth({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/menu" element={<Sidebar />} />
      <Route path="/results" element={
        <RequireAuth>
          <MyResultPage />
        </RequireAuth>
      } />
    </Routes>
  )
}

export default App
