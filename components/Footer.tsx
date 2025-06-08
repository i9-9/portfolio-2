import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='py-1 md:pb-2  px-4 z-10 w-full'>
      <div className='mx-auto text-center flex items-center justify-between border-t-[1px] border-b-[1px] border-solid border-mid-gray/50 '>
        <h5 className='text-verde font-light text-sm'>☯ {new Date().getFullYear() }</h5>
        <Link href='/'>
          <h6 className='font-bold text-verde text-md'>I / N</h6>
        </Link>
      </div>
    </footer>
  )
}

export default Footer