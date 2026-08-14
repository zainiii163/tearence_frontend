import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Link2,
  Megaphone,
  Handshake,
  ArrowRight,
  Mail,
} from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';

const PARTNER_EMAIL = 'worldwideadvertsinfo@gmail.com';

/**
 * Partnership page — businesses & users who want to work with World Wide Adverts.
 */
const PartnershipPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UnifiedNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80')",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/55" />
          <div className="relative page-container py-16 sm:py-20 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 mb-3">
              World Wide Adverts
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Partner with us
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed">
              Work with WWA whether you run a business, promote offers, or want a
              longer-term marketing partnership across our global marketplace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${PARTNER_EMAIL}?subject=Partnership%20inquiry%20-%20World%20Wide%20Adverts`}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition"
              >
                <Mail className="h-4 w-4" />
                Contact partnerships
              </a>
              <Link
                to="/affiliates"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Affiliates hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Two audiences */}
        <section className="page-container py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center">
            Who can partner with us
          </h2>
          <p className="mt-2 text-sm text-slate-600 text-center max-w-2xl mx-auto">
            Choose the path that fits how you want to work with World Wide Adverts.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Businesses */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">For businesses</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                List your brand, publish an affiliate program for promoters to join,
                and reach buyers across WWA categories and adverts.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <Megaphone className="h-4 w-4 mt-0.5 shrink-0 text-sky-600" />
                  Advertise with featured, promoted, or sponsored placements
                </li>
                <li className="flex gap-2">
                  <Handshake className="h-4 w-4 mt-0.5 shrink-0 text-sky-600" />
                  Create a merchant affiliate program promoters can apply to
                </li>
                <li className="flex gap-2">
                  <Briefcase className="h-4 w-4 mt-0.5 shrink-0 text-sky-600" />
                  Grow with a business account and store presence
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/Login?tab=signup&type=business"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Register as business
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/affiliates/marketplace?postForm=true&mode=business"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Publish a program
                </Link>
              </div>
            </div>

            {/* Users / affiliates */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-700 text-white">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">For users & affiliates</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Join merchant programs for your own hop link, or post affiliate link
                ads you are already promoting (for example ClickBank hops).
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <Link2 className="h-4 w-4 mt-0.5 shrink-0 text-violet-600" />
                  Apply to programs and promote with a unique WWA hop URL
                </li>
                <li className="flex gap-2">
                  <Megaphone className="h-4 w-4 mt-0.5 shrink-0 text-violet-600" />
                  Post affiliate adverts for hops you are already marketing
                </li>
                <li className="flex gap-2">
                  <Users className="h-4 w-4 mt-0.5 shrink-0 text-violet-600" />
                  Browse live link ads that open ClickBank hop URLs as posted
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/Login?tab=signup&type=basic"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
                >
                  Create an account
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/affiliates"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Browse programs
                </Link>
                <Link
                  to="/affiliates"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  View link ads
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-200 bg-white">
          <div className="page-container py-12 sm:py-14">
            <h2 className="text-xl font-bold text-slate-900 text-center">How partnership works</h2>
            <ol className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Tell us what you need',
                  body: 'Business growth, affiliate distribution, or co-marketing — email us or start in the Affiliates hub.',
                },
                {
                  step: '2',
                  title: 'Choose your channel',
                  body: 'Programs for joinable offers, link ads for hops already being promoted, plus standard WWA advertising.',
                },
                {
                  step: '3',
                  title: 'Grow together',
                  body: 'Track interest, approve promoters where needed, and keep campaigns aligned with WWA marketplace standards.',
                },
              ].map((item) => (
                <li key={item.step} className="text-center sm:text-left">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contact strip */}
        <section className="border-t border-slate-200 bg-slate-900">
          <div className="page-container py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Ready to partner?</h2>
              <p className="mt-1 text-sm text-slate-300">
                Email {PARTNER_EMAIL} or use our contact page — we will guide the next step.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${PARTNER_EMAIL}?subject=Partnership%20inquiry%20-%20World%20Wide%20Adverts`}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
              >
                <Mail className="h-4 w-4" />
                Email us
              </a>
              <Link
                to="/about/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Contact page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnershipPage;
