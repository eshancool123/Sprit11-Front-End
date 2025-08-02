import React from 'react'
import { Outlet } from 'react-router'
import AdminNavbar from '../componants/AdminNavbar'
import Footer from '../componants/Footer'

const Admin = () => {
  return (
    <div>
        <AdminNavbar/>
        <Outlet/>
        <Footer/>
        
    </div>
  )
}

export default Admin