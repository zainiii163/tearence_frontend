import React from "react";
import UnifiedNavbar from "../UnifiedNavbar";
import FooterBanner from "../FooterBanner";
import Footer from "../Footer";

/**
 * Published child safety standards (CSAE).
 *
 * This page is referenced from the Google Play Console "Child safety standards"
 * declaration, which requires the URL to be active, publicly reachable
 * worldwide, non-editable by the public, and not a PDF. It must therefore stay
 * on a public route with no auth guard.
 */
function ChildSafetyStandards() {
  const CONTACT = "help@worldwideadverts.info";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UnifiedNavbar />
      <FooterBanner title="Child Safety Standards" />
      <div className="page-container py-10 flex-1 w-full max-w-4xl mx-auto">
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed">

          <div className="pt-4 pb-4 font-semibold text-lg text-slate-900">
            STANDARDS AGAINST CHILD SEXUAL ABUSE AND EXPLOITATION (CSAE)
          </div>

          <div className="pt-2 pb-2">
            World Wide Adverts ("we", "us", "our") operates the WorldwideAdverts.info
            website and the World Wide Adverts mobile application. These standards
            set out our position on child sexual abuse and exploitation and explain
            how we prevent, detect, remove and report it. They apply to every user,
            every listing, every image and every message on our platform, worldwide.
          </div>

          <div className="pt-4 pb-4 font-semibold">1. ZERO TOLERANCE</div>
          <div className="pt-2 pb-2">
            We prohibit child sexual abuse material (CSAM) and any content or conduct
            that sexualises, exploits or endangers a minor. This includes, without
            limitation: sexual depictions of minors, whether real, edited or
            computer-generated; grooming, solicitation or sextortion of a minor;
            trafficking of or advertising access to a minor; and off-platform
            coordination of any of the above. There is no context in which such
            content or conduct is permitted on our platform.
          </div>
          <div className="pt-2 pb-2">
            A minor is any person under the age of 18, regardless of the age of
            majority or age of consent in their jurisdiction.
          </div>

          <div className="pt-4 pb-4 font-semibold">2. ELIGIBILITY TO USE THE PLATFORM</div>
          <div className="pt-2 pb-2">
            World Wide Adverts is intended for adults. Users must be 18 or older to
            create an account, post a listing, or send or receive messages. Accounts
            we identify as belonging to a minor are removed.
          </div>

          <div className="pt-4 pb-4 font-semibold">3. HOW TO REPORT</div>
          <div className="pt-2 pb-2">
            Anyone can report suspected child sexual abuse or exploitation to us,
            whether or not they hold an account:
          </div>
          <div className="pt-2 pb-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Use the <strong>Report</strong> control available on a listing or a
                conversation, and select the child safety reason.
              </li>
              <li>
                Email <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>{" "}
                with a link to the content and a short description.
              </li>
            </ul>
          </div>
          <div className="pt-2 pb-2">
            Reports concerning child safety are prioritised above all other report
            categories. You do not need to be certain — report it and let us assess.
            Please do not download, copy or forward suspected CSAM; send us the link
            or the listing reference only.
          </div>

          <div className="pt-4 pb-4 font-semibold">4. WHAT WE DO WITH A REPORT</div>
          <div className="pt-2 pb-2">
            On receiving a report or otherwise identifying such content, we remove or
            disable access to the content, suspend the account(s) involved, preserve
            the associated records as required by applicable law, and refer the matter
            to the relevant authority. Where the law requires it, we report to the
            National Center for Missing &amp; Exploited Children (NCMEC) and to the
            competent national or regional authority. Accounts removed for child
            safety reasons are not reinstated.
          </div>

          <div className="pt-4 pb-4 font-semibold">5. PREVENTION AND DETECTION</div>
          <div className="pt-2 pb-2">
            Listings are subject to review before they become publicly visible.
            Reports are triaged by category, with child safety reports escalated
            immediately. We act on credible information received from users, from
            authorities and from our own review of the platform.
          </div>

          <div className="pt-4 pb-4 font-semibold">6. LEGAL COMPLIANCE</div>
          <div className="pt-2 pb-2">
            We comply with the child safety laws applicable to the jurisdictions in
            which we operate, and we cooperate with law enforcement requests that are
            valid under applicable law.
          </div>

          <div className="pt-4 pb-4 font-semibold">7. POINT OF CONTACT</div>
          <div className="pt-2 pb-2">
            Our designated point of contact for child safety matters, including
            enquiries from Google, regulators and law enforcement, is:
            <br />
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </div>

          <div className="pt-4 pb-4 font-semibold">8. REVIEW</div>
          <div className="pt-2 pb-2">
            These standards are reviewed at least annually and updated when our
            practices or the applicable law change.
          </div>

          <div className="pt-6 pb-2 text-slate-500 text-xs">
            Published by World Wide Adverts. Last updated: 26 September 2026.
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChildSafetyStandards;
