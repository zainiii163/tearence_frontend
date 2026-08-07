import React from 'react'
import UnifiedNavbar from '../Component/UnifiedNavbar'
import Classified from '../Component/Classified'
import Footer from '../Component/Footer'
import BottomAds from '../Component/BottomAds'
import BrowseBottomPostCta from '../Component/shared/BrowseBottomPostCta'
import { useNavigate } from 'react-router-dom'
import useAuthRedirect from '../hooks/useAuthRedirect'

function ClassifiedPage() {
  const navigate = useNavigate()
  const { requireAuth } = useAuthRedirect()

  const handlePost = () => {
    if (requireAuth('/postclassified', 'You must be logged in to post a classified.')) {
      navigate('/postclassified')
    }
  }

  return (
    <div>
      <UnifiedNavbar />
      <Classified />
      <div className="page-container pb-8">
        <BrowseBottomPostCta
          buttonLabel="Post your classified"
          onPostClick={handlePost}
          theme="blue"
          buttonOnly
        />
      </div>
      <BottomAds />
      <Footer />
    </div>
  )
}

export default ClassifiedPage
