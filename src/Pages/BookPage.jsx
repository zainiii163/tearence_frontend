import React from 'react'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import BookList from '../Component/BookList'

const BookPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BookList />
      <Footer />
    </div>
  )
}

export default BookPage
