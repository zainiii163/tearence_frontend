import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div className='w-full h-screen flex items-center flex-col justify-center bg-slate-100'>
       <div className='w-10/12 h-3/6 flex items-center flex-col justify-around'>
            <div><h1 className='font-bold text-4xl lg:text-8xl text-slate-500'>404</h1></div>
            <div><h1 className='text-2xl lg:text-6xl font-bold text-slate-500'>Page Not Found!</h1></div>
            <div><button className='bg-blue-500 text-lg rounded-xl text-white pt-4 pb-4 pl-6 pr-6'><Link to='/'>Go back to Home Page</Link></button></div>
       </div>
    </div>
  )
}

export default PageNotFound