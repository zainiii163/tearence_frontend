import React, { useEffect, useRef, useState } from "react";
import {
  BsInstagram,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import moment from 'moment';

/**
 * Compact footer (Clive): no categories; Business | About | Help (Help far right);
 * address beside map; reduced height/padding.
 */
function Footer() {
  const mapRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = mapRef.current;
    if (!el || showMap) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setShowMap(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [showMap]);

  return (
    <footer className="w-full bg-slate-900 text-slate-50 mt-auto">
      <div className="page-container py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Business */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Business</h3>
          <img src="/img/wwaLogoTransparantStroke.png" className="h-8" alt="World Wide Adverts" />
          <p className="text-[11px] text-slate-400 leading-snug max-w-[14rem]">
            Helping businesses and brands grow globally.
          </p>
          <div className="flex space-x-1.5 pt-0.5">
            <a
              href="https://www.facebook.com/worldwideadverts.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-7 w-7 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaFacebookF className="h-3 w-3" />
            </a>
            <a
              href="https://www.instagram.com/worldadverts/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-7 w-7 rounded bg-pink-600 text-white hover:bg-pink-700"
            >
              <BsInstagram className="h-3 w-3" />
            </a>
            <a
              href="https://twitter.com/worldwidead"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-7 w-7 rounded bg-sky-500 text-white hover:bg-sky-600"
            >
              <BsTwitter className="h-3 w-3" />
            </a>
            <a
              href="https://www.linkedin.com/company/world-wide-adverts/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-7 w-7 rounded bg-blue-700 text-white hover:bg-blue-800"
            >
              <FaLinkedinIn className="h-3 w-3" />
            </a>
            <a
              href="https://www.youtube.com/@worldwideadverts3670"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-7 w-7 rounded bg-red-600 text-white hover:bg-red-700"
            >
              <BsYoutube className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* About — next to Business */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">About</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <Link to="/about/company" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">Company</Link>
            <Link to="/about/about-us" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">About us</Link>
            <Link to="/about/business" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">Business</Link>
            <Link to="/about/career-with-us" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">Career with us</Link>
            <Link to="/about/intern-program" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">Intern program</Link>
            <Link to="/about/developer" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">Developer</Link>
            <Link to="/about/contact" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">Contact</Link>
            <Link to="/blog" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors">Blog</Link>
          </div>
        </div>

        {/* Help — far right */}
        <div className="space-y-2 sm:text-right">
          <h3 className="text-sm font-semibold">Help</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:ml-auto sm:max-w-xs">
            <Link to="/help/ads-policies" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Ads Policies</Link>
            <Link to="/help/cookie-policy" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Cookie policy</Link>
            <Link to="/help/terms-of-use" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Terms of use</Link>
            <Link to="/help/user-agreement" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">User agreement</Link>
            <Link to="/help/terms-and-condition" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Terms and condition</Link>
            <Link to="/help/data-protection" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Data protection</Link>
            <Link to="/help/privacy-policy" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Privacy policy</Link>
            <Link to="/help/laws-regulations" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Adverts policy</Link>
            <Link to="/help/disclaimer" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Disclaimer</Link>
            <Link to="/help/help" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Help</Link>
            <Link to="/calculators" className="text-[11px] text-slate-400 hover:text-slate-50 transition-colors sm:text-right">Calculators</Link>
          </div>
        </div>
      </div>

      {/* Address + map side by side */}
      <div className="border-t border-slate-800">
        <div className="page-container py-3 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(160px,240px)] gap-3 items-center">
          <div>
            <h3 className="text-xs font-semibold mb-0.5">Kington Office</h3>
            <address className="not-italic text-[11px] text-slate-400 leading-snug">
              61 Bridge Street, Kington, HR5 3DJ, Herefordshire
            </address>
            <a
              href="https://www.google.com/maps/search/?api=1&query=61+Bridge+Street,+Kington,+HR5+3DJ,+Herefordshire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-[11px] font-medium text-sky-400 hover:text-sky-300 underline"
            >
              View on Google Maps
            </a>
          </div>
          <div
            ref={mapRef}
            className="rounded-md overflow-hidden border border-slate-700 bg-slate-800 h-24 sm:h-28"
          >
            {showMap ? (
              <iframe
                title="World Wide Adverts — Kington Office map"
                src="https://maps.google.com/maps?q=61%20Bridge%20Street%2C%20Kington%2C%20HR5%203DJ%2C%20Herefordshire&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 px-3 text-center">
                Map loads when you scroll here
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-2 text-center">
        <p className="text-[11px] text-slate-400">
          © World Wide Adverts 2017-{moment().format('YYYY')}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
