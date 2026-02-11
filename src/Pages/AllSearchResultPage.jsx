import React from 'react'
import AllSearchResult from '../Component/AllSearchResult'
import Footer from '../Component/Footer'
import Navbar from '../Component/Navbar'

const AllSearchResultPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AllSearchResult />
      <Footer />
    </div>
  )
}

export default AllSearchResultPage
