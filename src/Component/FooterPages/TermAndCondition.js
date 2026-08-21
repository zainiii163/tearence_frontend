import React from 'react'
import UnifiedNavbar from '../UnifiedNavbar'
import FooterBanner from '../FooterBanner';
import Footer from '../Footer'

function TermAndCondition() {
  return (
    <div>
        <UnifiedNavbar />
        <FooterBanner title={'TERMS AND CONDITIONS'} />
        <div className="w-full pt-10 flex justify-center">
            <div className="w-10/12">
                {/* <div className="w-full flex justify-center">
                    <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">TERMS AND CONDITIONS</div>
                </div>
                <div className="bg-blue-400">
                    <hr className="border border-cyan-600"></hr>
                </div> */}
                <div className='text-slate-500'>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">TERMS AND CONDITIONS FOR WORLDWIDE ADVERTS</div>
                    <div className="pt-2 pb-2">MGNIT LTD (worldwideadverts.info) owns and operates this Website.  This document governs your relationship with WorldwideAdverts.info (“Website”). By using this Website and the Ad Listing Service available through this Website (collectively, the "Services"), you are agreeing to all of the Terms and Conditions, as may be updated by us from time to time. You should check this page regularly to take notice of any changes we may have made to the Terms and Conditions.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">User obligation</div>
                    <div className="pt-2 pb-2">Use of our Website and Services constitutes your acknowledgment and acceptance of these Terms and Conditions, which take effect on the date on which you first use our Website and Services. By accessing, and/or using this website, you agree to abide by the terms and conditions set forth below. If these Terms and Conditions are not accepted in full, you do not have permission to access the contents of this service and therefore should cease using our Website and services immediately.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Privacy Policy</div>
                    <div className="pt-2 pb-2">You agree that you have read, understood and accept the terms of Worldwide Adverts’ Privacy Policy. That Policy governs the collection, use and sharing of personal and non-personal information from you when using this website.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Account and Password</div>
                    <div className="pt-2 pb-2">If you choose, or you are provided with, a user identification code, password or any other piece of information as part of our security procedures, you must treat such information as confidential. You must not disclose it to any third party. We have the right to disable any user identification code or password, whether chosen by you or allocated by us, at any time, if in our reasonable opinion you have failed to comply with any of the provisions of these Terms and Conditions. If you know or suspect that anyone other than you knows your user identification code or password, you must promptly notify us in writing to <span className='text-cyan-600'>worldwideadvertsinfo@gmail.com.</span></div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Responsibility for Content</div>
                    <div className="pt-2 pb-2">Worldwide Adverts takes no responsibility for any User content created, accessible or delivered on or through the Services. We do not monitor or exercise any editorial control over such content. The User is solely responsible for (i) any content stored, published or made available through our Website and Services by its Users and (ii) compliance with all laws applicable to the publication and distribution of such content. User shall be solely responsible for maintaining a copy of its content.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Third Party Links</div>
                    <div className="pt-2 pb-2">We are not responsible for the availability or content of any third party websites or material you access through this service. If you decide to visit any linked site, you do so at your own risk. Worldwide Adverts does not endorse and is not responsible or liable for any content, advertising, products, services or information on or available from third party websites or material. We are not responsible for any damage, loss or offence caused by or, in connection with, any content, advertising, products, services or information available on such websites or material.  </div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Disclaimer Statement</div>
                    <div className="pt-2 pb-2">The materials on our website are provided "as is". Worldwide Adverts makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Limitations</div>
                    <div className="pt-2 pb-2">In no event shall Worldwide Adverts or its operators be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Worldwide Adverts’ Website, even if Worldwide Adverts has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Indemnity</div>
                    <div className="pt-2 pb-2">You agree to indemnify and keep indemnified Worldwide Adverts from and against all claims, damages, expenses, costs and liabilities arising in any manner from your entry to and use of our Website and Services other than in accordance with these terms and conditions.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Law and jurisdiction</div>
                    <div className="pt-2 pb-2">You expressly understand and agree to submit to the personal and exclusive jurisdiction of the courts of the country, state, province or territory determined solely by MGNIT LTD to resolve any legal matter arising from these Terms and Conditions. If the court of law having jurisdiction, rules that any provision of the agreement is invalid, then that provision will be removed from the Terms and the remaining Terms will continue to be valid.</div>
                    <div className="text-lg font-bold text-blue-900 pt-4 pb-4">Changes to these Terms</div>
                    <div className="pt-2 pb-2">We reserve the right to amend this Terms from time-to-time, in its sole discretion, effective upon posting a revised copy of the Terms and Conditions on this page. Any use of the Services after such modification shall constitute acceptance of such modification. For any questions or comments, or to report violations of these terms, let us know by contacting us at <span className='text-cyan-600'>worldwideadvertsinfo@gmail.com.</span></div>
                    <div className="text-lg font-bold text-blue-900 pt-8 pb-8 italic">First Published: July 6, 2017</div>
                   
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default TermAndCondition;