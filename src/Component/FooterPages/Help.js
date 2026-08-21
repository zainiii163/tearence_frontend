import React from 'react'
import { Link } from 'react-router-dom'
import UnifiedNavbar from '../UnifiedNavbar'
import FooterBanner from '../FooterBanner'
import Footer from '../Footer'

function Help() {
  const topics = [
    {
      title: 'How to sign up / register',
      body: 'Open Register from the account menu, enter your details, then verify your email so you can post and message securely.',
    },
    {
      title: 'How to post adverts',
      body: 'Use Post Ad in the header (or the Post button on mobile), choose a category, add photos and details, then publish.',
      link: { to: '/post-ad', label: 'Start posting' },
    },
    {
      title: 'Products and services you can advertise',
      body: 'Most legitimate products and services are welcome. Restricted or prohibited items are listed in Ads Policies.',
      link: { to: '/help/ads-policies', label: 'Read Ads Policies' },
    },
    {
      title: 'Privacy & account security',
      body: 'We use encrypted login and clear privacy rules. See Privacy Policy for how your data is handled.',
      link: { to: '/help/privacy-policy', label: 'Privacy Policy' },
    },
    {
      title: 'Staying safe while browsing',
      body: 'Prefer on-platform messaging, avoid sharing payment details off-site, and report anything suspicious via Contact.',
      link: { to: '/about/contact', label: 'Contact us' },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UnifiedNavbar />
      <FooterBanner
        title="Help"
        subtitle="Questions & answers — how to use World Wide Adverts safely."
      />
      <div className="page-container py-10 flex-1 w-full max-w-3xl mx-auto">
        <div className="space-y-6">
          {topics.map((topic) => (
            <section key={topic.title} className="border-b border-slate-200 pb-5 last:border-0">
              <h2 className="text-lg font-semibold text-slate-900">{topic.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{topic.body}</p>
              {topic.link ? (
                <Link
                  to={topic.link.to}
                  className="inline-block mt-2 text-sm font-semibold text-primary hover:underline underline-offset-2"
                >
                  {topic.link.label}
                </Link>
              ) : null}
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Help
