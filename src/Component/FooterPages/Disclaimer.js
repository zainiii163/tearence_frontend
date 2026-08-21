import React from 'react'
import UnifiedNavbar from '../UnifiedNavbar'
import FooterBanner from '../FooterBanner'
import Footer from '../Footer'

function Disclaimer() {
  return (
    <div>
      <UnifiedNavbar />
      <FooterBanner title={'DISCLAIMER'} />
      <div className="w-full pt-32 flex justify-center">
        <div className="w-10/12">
          {/* <div className="w-full flex justify-center text-center">
            <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
            DISCLAIMER
            </div>
          </div>
          <div className="bg-blue-400">
            <hr className="border border-blue-600"></hr>
          </div> */}
          <div className="">
                <div className="text-lg font-bold pt-4 pb-4 text-blue-900">DISCLAIMER STATEMENT</div>
                <div className="pt-2 pb-2">This disclaimer statement governs your use of this website. By using and/or accessing the Website available through WorldwideAdverts.info, you accept this disclaimer in full; accordingly, if you disagree with this disclaimer or any part of this disclaimer, you must not use this website.</div>
                <div className="text-lg font-bold pt-4 pb-4 text-blue-900">Disclaimer and Limitation of Liability</div>
                <div className="pt-2 pb-2">You assume all responsibility and risk with respect to your use of our website, which are provided “as is” without warranties, representations or conditions of any kind, either express or implied, with regard to information accessed from or via our website, including without limitation, all content and materials, and functions provided on our website, all of which are provided without warranty of any kind, including but not limited to warranties concerning the availability, accuracy, completeness or usefulness of content or information, uninterrupted access, and any warranties of title, non-infringement, merchantability or fitness for a particular purpose.</div>
                <div className="pt-2 pb-2">We do not warrant that our website or its functioning or the content and material made available thereby will be timely, secure, uninterrupted or error-free, that defects will be corrected, or that our websites or the servers that make our website available are free of viruses or other harmful components.</div>
                <div className="pt-2 pb-2">In no event will Worldwide Adverts and/or third parties be liable for any damages including, but not limited to, indirect or consequential damages or any damages including, but not limited to, errors or omissions, indirect or consequential damages or any damages whatsoever arising from use, loss of use, data or profits, whether in action of contract, negligence or other action, arising out of or in connection with the use of the content and material made available through this website. These exclusions do not apply to death or personal injury caused by Worldwide Adverts' negligence and only applies to the extent permitted by law.</div>
                <div className="text-lg font-bold pt-4 pb-4 text-blue-900">Law and Jurisdiction</div>
                <div className="pt-2 pb-2">Certain jurisdictions do not allow the limitation of liability or the exclusion or limitation of certain damages. In such jurisdictions, some or all of the above disclaimers, exclusions, or limitations, may not apply to you and our liability will be limited to the maximum extent permitted by law. We may be contacted through email at <span className='text-cyan-600'>worldwideadvertsinfo@gmail.com.</span></div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Disclaimer