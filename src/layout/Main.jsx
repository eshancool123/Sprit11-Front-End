import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../componants/Navbar'
import Footer from '../componants/Footer'


const Main = () => {
  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
        
    </div>
  )
}

export default Main