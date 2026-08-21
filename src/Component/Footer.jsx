import React, { useEffect, useRef, useState } from "react";
import {
  BsInstagram,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import SafetyTrustBar from "./shared/SafetyTrustBar";

/**
 * Trust-forward footer for World Wide Adverts.
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

  const socialClass =
    "inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/10 text-white hover:bg-primary transition-colors";

  return (
    <footer className="w-full bg-[#0b1c2c] text-slate-50 mt-auto">
      <SafetyTrustBar variant="dark" />

      <div className="page-container py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {/* Business */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-white">Business</h3>
          <img src="/img/wwaLogoTransparantStroke.png" className="h-9" alt="World Wide Adverts" />
          <p className="text-xs text-slate-400 leading-relaxed max-w-[16rem]">
            Helping people and brands advertise with clarity and trust — worldwide.
          </p>
          <div className="flex space-x-2 pt-1">
            <a
              href="https://www.facebook.com/worldwideadverts.info/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialClass}
              aria-label="Facebook"
            >
              <FaFacebookF className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.instagram.com/worldadverts/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialClass}
              aria-label="Instagram"
            >
              <BsInstagram className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://twitter.com/worldwidead"
              target="_blank"
              rel="noopener noreferrer"
              className={socialClass}
              aria-label="Twitter"
            >
              <BsTwitter className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/company/world-wide-adverts/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialClass}
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.youtube.com/@worldwideadverts3670"
              target="_blank"
              rel="noopener noreferrer"
              className={socialClass}
              aria-label="YouTube"
            >
              <BsYoutube className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-white">About</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <Link to="/about/company" className="text-xs text-slate-400 hover:text-white transition-colors">Company</Link>
            <Link to="/about/about-us" className="text-xs text-slate-400 hover:text-white transition-colors">About us</Link>
            <Link to="/about/business" className="text-xs text-slate-400 hover:text-white transition-colors">Business</Link>
            <Link to="/about/career-with-us" className="text-xs text-slate-400 hover:text-white transition-colors">Career with us</Link>
            <Link to="/about/intern-program" className="text-xs text-slate-400 hover:text-white transition-colors">Intern program</Link>
            <Link to="/about/developer" className="text-xs text-slate-400 hover:text-white transition-colors">Developer</Link>
            <Link to="/about/contact" className="text-xs text-slate-400 hover:text-white transition-colors">Contact</Link>
            <Link to="/partners" className="text-xs text-slate-400 hover:text-white transition-colors">Partners</Link>
            <Link to="/affiliates" className="text-xs text-slate-400 hover:text-white transition-colors">Affiliates</Link>
            <Link to="/blog" className="text-xs text-slate-400 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>

        {/* Help */}
        <div className="space-y-3 sm:text-right">
          <h3 className="text-sm font-semibold tracking-wide text-white">Help & trust</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:ml-auto sm:max-w-xs">
            <Link to="/help/ads-policies" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Ads Policies</Link>
            <Link to="/help/cookie-policy" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Cookie policy</Link>
            <Link to="/help/terms-of-use" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Terms of use</Link>
            <Link to="/help/user-agreement" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">User agreement</Link>
            <Link to="/help/terms-and-condition" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Terms and condition</Link>
            <Link to="/help/data-protection" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Data protection</Link>
            <Link to="/help/privacy-policy" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Privacy policy</Link>
            <Link to="/help/laws-regulations" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Adverts policy</Link>
            <Link to="/help/disclaimer" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Disclaimer</Link>
            <Link to="/help/help" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Help</Link>
            <Link to="/calculators" className="text-xs text-slate-400 hover:text-white transition-colors sm:text-right">Calculators</Link>
          </div>
        </div>
      </div>

      {/* Address + map */}
      <div className="border-t border-white/10">
        <div className="page-container py-4 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(160px,240px)] gap-4 items-center">
          <div>
            <h3 className="text-xs font-semibold mb-1 text-white">Kington Office</h3>
            <address className="not-italic text-xs text-slate-400 leading-relaxed">
              61 Bridge Street, Kington, HR5 3DJ, Herefordshire
            </address>
            <a
              href="https://www.google.com/maps/search/?api=1&query=61+Bridge+Street,+Kington,+HR5+3DJ,+Herefordshire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 underline"
            >
              View on Google Maps
            </a>
          </div>
          <div
            ref={mapRef}
            className="rounded-lg overflow-hidden border border-white/10 bg-[#132839] h-24 sm:h-28"
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

      <div className="border-t border-white/10 py-3 text-center">
        <p className="text-xs text-slate-500">
          © World Wide Adverts 2017-{new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
