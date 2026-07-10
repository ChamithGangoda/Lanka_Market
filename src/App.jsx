import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import AdminLogin from './pages/AdminLogin'
import SellerAuth from './pages/SellerAuth'
import UserAuth from './pages/UserAuth'
import AdminDashboard from './pages/AdminDashboard'
import SellerDashboard from './pages/SellerDashboard'
import CreatePayment from './pages/CreatePayment'
import MyWhishlist from './pages/MyWhishlist'
import MyPayments from './pages/MyPayments'
import Profile from './pages/Profile'
import SellerProfile from './pages/SellerProfile'
import "antd/dist/reset.css"
import MyCart from './pages/MyCart'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/seller-login" element={<SellerAuth />} />
        <Route path="/login" element={<UserAuth />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/create-payment" element={<CreatePayment />} />
        <Route path="/my-wishlist" element={<MyWhishlist />} />
        <Route path="/my-payments" element={<MyPayments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller-profile" element={<SellerProfile />} />
        <Route path="/my-cart" element={<MyCart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App