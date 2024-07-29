"use client"

import React from 'react'
import Work from '../../components/Work'
import NavbarHome from '../../components/NavbarHome'

const page = () => {
  return (
    <div className='px-4 mx-auto'>
        <NavbarHome />
        <Work />
    </div>
  )
}

export default page