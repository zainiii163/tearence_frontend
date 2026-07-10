import React from 'react'
import AllSearchResult from '../Component/AllSearchResult'
import Footer from '../Component/Footer'
import UnifiedNavbar from '../Component/UnifiedNavbar'

const AllSearchResultPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavbar />
      <AllSearchResult />
      <Footer />
    </div>
  )
}

export default AllSearchResultPage
