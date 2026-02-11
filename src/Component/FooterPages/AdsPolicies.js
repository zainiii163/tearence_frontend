import React from "react";
import Navbar from "../Navbar";
import FooterBanner from "../FooterBanner";
import Footer from '../Footer'

function AdsPolicies() {
  return (
    <div>
      <Navbar />
      <FooterBanner  title={'Ads Policies'} />
      {/* <div className="w-full flex justify-center text-center relative">
            <div className="text-4xl font-bold pt-2 pb-4 text-blue-950 absolute">
              Ads Policies
            </div>
      </div> */}

      <div className="w-full pt-10 flex justify-center">
        <div className="w-10/12">
          {/* <div className="w-full flex justify-center text-center">
            <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
              Ads Policies
            </div>
          </div> */}
          {/* <div className="bg-blue-400">
            <hr className="border border-blue-600"></hr>
          </div> */}
          <div className="">
            <div className="pt-4 pb-4">Overview of our policies</div>
            <div className="pt-2 pb-2">
              We want to support a healthy digital advertising ecosystem—one
              that is trustworthy and transparent, and works for users,
              advertisers, and publishers. The purpose of this help center is to
              help you build Google Ads campaigns that align with our
              advertising policies listed below. These policies are designed not
              only to abide by laws but to ensure a safe and positive experience
              for our users. This means that our policies prohibit some content
              that we believe to be harmful to users and the overall advertising
              ecosystem.
            </div>
            <div className="pt-2 pb-2">
              We use a combination of automated and human evaluation to ensure
              Google Ads comply with these policies.{" "}
            </div>
            <div className="pt-2 pb-2">
              Our advertising policies cover four broad areas:
            </div>
            <div className="pt-2 pb-2">
              <span className="text-lg text-cyan-600 font-semibold">
                Prohibited content:{" "}
              </span>
              Content you can't advertise on the Google Network
            </div>
            <div className="pt-2 pb-2">
              <span className="text-lg text-cyan-600 font-semibold">
                Prohibited practices:{" "}
              </span>
              Things you can't do if you want to advertise with us
            </div>
            <div className="pt-2 pb-2">
              <span className="text-lg text-cyan-600 font-semibold">
                Restricted content and features:{" "}
              </span>{" "}
              Content you can advertise, but with limitations
            </div>
            <div className="pt-2 pb-2">
              <span className="text-lg text-cyan-600 font-semibold">
                Editorial and technical:{" "}
              </span>
              Quality standards for your ads, websites, and apps
            </div>

            <div className="pt-2 pb-2">
              Click through the policies below for policy definitions, examples,
              and troubleshooting steps.{" "}
            </div>
            <div className="pt-2 pb-2">Prohibited content</div>

            <div className="underline text-cyan-600 text-lg">
              Counterfeit goods
            </div>
            <div className="pt-2 pb-2">
              Google Ads prohibits the sale or promotion for sale of counterfeit
              goods. Counterfeit goods contain a trademark or logo that is
              identical to or substantially indistinguishable from the trademark
              of another. They mimic the brand features of the product in an
              attempt to pass themselves off as a genuine product of the brand
              owner. This policy applies to the content of your ad and your
              website or app.{" "}
            </div>

            <div className="underline text-cyan-600 text-lg">
              Dangerous products or services
            </div>
            <div className="pt-2 pb-2">
              We want to help keep people safe both online and offline, so we
              don't allow the promotion of some products or services that cause
              damage, harm, or injury.
            </div>
            <div className="pt-2 pb-2">
              Examples of dangerous content: Recreational drugs (chemical or
              herbal); psychoactive substances; equipment to facilitate drug
              use; weapons, ammunition, explosive materials and fireworks;
              instructions for making explosives or other harmful products;
              tobacco products
            </div>

            <div className="underline text-cyan-600 text-lg">
              Enabling dishonest behavior
            </div>
            <div className="pt-2 pb-2">
              We value honesty and fairness, so we don't allow the promotion of
              products or services that are designed to enable dishonest
              behavior.
            </div>
            <div className="pt-2 pb-2">
              Examples of products or services that enable dishonest behavior:
              Hacking software or instructions; services designed to
              artificially inflate ad or website traffic; fake documents;
              academic cheating services
            </div>

            <div className="underline text-cyan-600 text-lg">
              Inappropriate content
            </div>
            <div className="pt-2 pb-2">
              We value diversity and respect for others, and we strive to avoid
              offending users, so we don’t allow ads or destinations that
              display shocking content or promote hatred, intolerance,
              discrimination, or violence.
            </div>
            <div className="pt-2 pb-2">
              Examples of inappropriate or offensive content: bullying or
              intimidation of an individual or group, racial discrimination,
              hate group paraphernalia, graphic crime scene or accident images,
              cruelty to animals, murder, self-harm, extortion or blackmail,
              sale or trade of endangered species, ads using profane language
            </div>
            <div className="pt-2 pb-2">Prohibited practices</div>
            <div className="underline text-cyan-600 text-lg">
              Abusing the ad network
            </div>
            <div className="pt-2 pb-2">
              We want ads across the Google Network to be useful, varied,
              relevant, and safe for users. We don’t allow advertisers to run
              ads, content, or destinations that attempt to trick or circumvent
              our ad review processes.
            </div>
            <div className="pt-2 pb-2">
              Examples of abuse of the ad network: promoting content that
              contains malware; "cloaking" or using other techniques to hide the
              true destination that users are directed to; "arbitrage" or
              promoting destinations for the sole or primary purpose of showing
              ads; promoting "bridge" or "gateway" destinations that are solely
              designed to send users elsewhere; advertising with the sole or
              primary intent of gaining public social network endorsements from
              the user; "gaming" or manipulating settings in an attempt to
              circumvent our policy review systems
            </div>
            <div className="underline text-cyan-600 text-lg">
              Data collection and use
            </div>
            <div className="pt-2 pb-2">
              We want users to trust that information about them will be
              respected and handled with appropriate care. As such, our
              advertising partners should not misuse this information, nor
              collect it for unclear purposes or without appropriate disclosures
              or security measures.
            </div>
            <div className="pt-2 pb-2">
              Note that additional policies apply when using
              <span className="text-cyan-600 ">
                {" "}
                personalized advertising, which includes remarketing and custom
                audiences.
              </span>{" "}
              If you use personalized advertising targeting features, be sure to
              review the personalized ads{" "}
              <span className="text-cyan-600 underline">
                data collection and use policies.
              </span>
            </div>
            <div className="pt-2 pb-2">
              Examples of user information that should be handled with care:
              full name; email address; mailing address; phone number; national
              identity, pension, social security, tax ID, health care, or
              driver's license number; birth date or mother's maiden name in
              addition to any of the above information; financial status;
              political affiliation; sexual orientation; race or ethnicity;
              religion
            </div>
            <div className="pt-2 pb-2">
              Examples of irresponsible data collection & use: obtaining credit
              card information over a non-secure server, promotions that claim
              to know a user's sexual orientation or financial status,
              violations of our policies that apply to interest-based
              advertising and remarketing
            </div>
            <div className="underline text-cyan-600 text-lg">
              Misrepresentation
            </div>
            <div className="pt-2 pb-2">
              We want users to trust the ads on our platform, so we strive to
              ensure ads are clear and honest, and provide the information that
              users need to make informed decisions. We don’t allow ads or
              destinations that deceive users by excluding relevant product
              information or providing misleading information about products,
              services, or businesses.
            </div>
            <div className="pt-2 pb-2">
              Examples of misrepresentation: omitting or obscuring billing
              details such as how, what, and when users will be charged;
              omitting or obscuring charges associated with financial services
              such as interest rates, fees, and penalties; failing to display
              tax or licence numbers, contact information, or physical address
              where relevant; making offers that aren't actually available;
              making misleading or unrealistic claims regarding weight loss or
              financial gain; collecting donations under false pretenses;
              "phishing" or falsely purporting to be a reputable company in
              order to get users to part with valuable personal or financial
              information
            </div>
            <div className="pt-5 pb-2">Restricted content and features</div>
            <div className="pt-2 pb-2">
              The policies below cover content that is sometimes legally or
              culturally sensitive. Online advertising can be a powerful way to
              reach customers, but in sensitive areas, we also work hard to
              avoid showing these ads when and where they might be
              inappropriate.
            </div>
            <div className="pt-2 pb-2">
              For that reason, we allow the promotion of the content below, but
              on a limited basis. These promotions may not show to every user in
              every location, and advertisers may need to meet additional
              requirements before their ads are eligible to run. Note that not
              all ad products, features, or networks are able to support this
              restricted content. Further details can be found in the Policy
              Center.
            </div>
            <div className="underline text-cyan-600 text-lg">
              Default Ads Treatment
            </div>
            <div className="pt-2 pb-2">
              Google is committed to delivering a safe and trustworthy ad
              experience for all users. That’s why we limit serving certain
              types of ad categories for users that aren't signed in or users
              that our systems indicate are under 18.
            </div>
            <div className="underline text-cyan-600 text-lg">
              Sexual content
            </div>
            <div className="pt-2 pb-2">
              Ads should respect user preferences and comply with legal
              regulations, so we don't allow certain kinds of sexual content in
              ads and destinations. Some kinds of sexual content in ads and
              destinations are allowed only if they comply with the policies
              below and don't target minors, but they will only show in limited
              scenarios based on user search queries, user age, and local laws
              where the ad is being served.{" "}
            </div>
            <div className="pt-2 pb-2">
              Learn about
              <span className="text-cyan-600">
                {" "}
                what happens if you violate our policies.
              </span>
            </div>
            <div className="pt-2 pb-2">
              Examples of restricted sexual content: Visible genitalia and
              female breasts, hook-up dating, sex toys, strip clubs, sexually
              suggestive live chat, and models in sexualized poses.
            </div>
            <div className="underline text-cyan-600 text-lg">Alcohol</div>
            <div className="pt-2 pb-2">
              We abide by local alcohol laws and industry standards, so we don’t
              allow certain kinds of alcohol-related advertising, both for
              alcohol and drinks that resemble alcohol. Some types of
              alcohol-related ads are allowed if they meet the policies below,
              don’t target minors, and target only countries that are explicitly
              allowed to show alcohol ads.
            </div>
            <div className="pt-2 pb-2">
              Examples of restricted alcoholic beverages: beer, wine, sake,
              spirits or hard alcohol, Champagne, fortified wine, non-alcoholic
              beer, non-alcoholic wine, and non-alcoholic distilled spirits
            </div>
            <div className="underline text-cyan-600 text-lg">Copyrights</div>
            <div className="pt-2 pb-2">
              We abide by local copyright laws and protect the rights of
              copyright holders, so we don’t allow ads that are unauthorized to
              use copyrighted content. If you are legally authorized to use
              copyrighted content, apply for certification to advertise. If you
              see unauthorized content,
              <span className="text-cyan-600">
                {" "}
                submit a copyright-related complaint.
              </span>
            </div>
            <div className="underline text-cyan-600 text-lg">
              Gambling and games
            </div>
            <div className="pt-2 pb-2">
              We support responsible gambling advertising and abide by local
              gambling laws and industry standards, so we don’t allow certain
              kinds of gambling-related advertising. Gambling-related ads are
              allowed if they comply with the policies below and the advertiser
              has received the proper Google Ads certification. Gambling ads
              must target approved countries, have a landing page that displays
              information about responsible gambling, and never target minors.
              Check local regulations for the areas you want to target.
            </div>
            <div className="pt-2 pb-2">
              Examples of restricted gambling-related content: physical casinos;
              sites where users can bet on poker, bingo, roulette, or sports
              events; national or private lotteries; sports odds aggregator
              sites; sites offering bonus codes or promotional offers for
              gambling sites; online educational materials for casino-based
              games; sites offering "poker-for-fun" games; non-casino-based cash
              game sites
            </div>
            <div className="underline text-cyan-600 text-lg">
              Healthcare and medicines
            </div>
            <div className="pt-2 pb-2">
              We are dedicated to following advertising regulations for
              healthcare and medicine, so we expect that ads and destinations
              follow appropriate laws and industry standards. Some
              healthcare-related content can’t be advertised at all, while
              others can only be advertised if the advertiser is certified with
              Google and targets only approved countries. Check local
              regulations for the areas you want to target.
            </div>
            <div className="underline text-cyan-600 text-lg">
              Political content
            </div>
            <div className="pt-2 pb-2">
              We support responsible political advertising and expect all
              political ads and destinations to comply with local campaign and
              election laws for any areas they target. This policy includes
              legally mandated election “silence periods.”{" "}
            </div>
            <div className="pt-2 pb-2">
              Examples of political content: promotion of political parties or
              candidates, political issue advocacy
            </div>
            <div className="underline text-cyan-600 text-lg">
              Financial services
            </div>
            <div className="pt-2 pb-2">
              We want users to have adequate information to make informed
              financial decisions. Our policies are designed to give users
              information to weigh the costs associated with financial products
              and services, and to protect users from harmful or deceitful
              practices. For the purposes of this policy, we consider financial
              products and services to be those related to the management or
              investment of money and cryptocurrencies, including personalized
              advice.
            </div>
            <div className="pt-2 pb-2">
              When promoting financial products and services, you must comply
              with state and local regulations for any region or country that
              your ads target — for example, include specific disclosures
              required by local law. Refer to our non-exhaustive list of
              country-specific requirements for more information but note that
              advertisers are expected to do their own research on the local
              regulations for any location their ads target.
            </div>
            <div className="underline text-cyan-600 text-lg">Trademarks</div>
            <div className="pt-2 pb-2">
              There are multiple factors that determine when trademarks can be
              used in ads. Along with the factors described in our Policy
              Center, these policies apply only when a trademark owner has
              submitted a valid complaint to Google.
            </div>
            <div className="underline text-cyan-600 text-lg">
              Legal requirements
            </div>
            <div className="pt-2 pb-2">
              You’re always responsible for ensuring that you comply with all
              applicable laws and regulations, in addition to Google's
              advertising policies, for all of the locations where your ads are
              showing.
            </div>
            <div className="underline text-cyan-600 text-lg">
              Other restricted businesses
            </div>
            <div className="pt-2 pb-2">
              We restrict certain kinds of businesses from advertising with us
              to prevent users from being exploited, even if individual
              businesses appear to comply with our other policies. Based on our
              own continuous reviews, and feedback from users, regulators, and
              consumer protection authorities, we occasionally identify products
              or services that are prone to abuse. If we feel that certain kinds
              of businesses pose an unreasonable risk to user safety or user
              experience, then we may limit or stop related ads from running.
            </div>
            <div className="underline text-cyan-600 text-lg">
              Restricted ad formats and features
            </div>
            <div className="pt-2 pb-2">
              There are multiple factors that determine access to advanced ad
              formats and features on Google Ads. Certain ad formats are not
              available for all advertisers until they meet our specific
              requirements or complete the certification process.
            </div>
            <div className="pt-2 pb-2">
              Requirements for made for kids content
            </div>
            <div className="pt-2 pb-2">
              Advertisers may not run personalized ads on content set as made
              for kids. See here for categories restricted for advertising on
              made for kids content.
            </div>
            <div className="pt-2 pb-2">Editorial & technical requirements</div>
            <div className="pt-2 pb-2">
              We want to deliver ads that are engaging for users without being
              annoying or difficult to interact with, so we've developed
              editorial requirements to help keep your ads appealing to users.
              We've also specified technical requirements to help users and
              advertisers get the most out of the variety of ad formats we
              offer.
            </div>
            <div className="underline text-cyan-600 text-lg">Editorial</div>
            <div className="pt-2 pb-2">
              In order to provide a quality user experience, Google requires
              that all ads, extensions, and destinations meet high professional
              and editorial standards. We only allow ads that are clear,
              professional in appearance, and that lead users to content that is
              relevant, useful, and easy to interact with.
            </div>
            <div className="pt-2 pb-2">
              Examples of promotions that don't meet these editorial and
              professional requirements:
            </div>
            <div className="pt-2 pb-2">
              overly generic ads that contain vague phrases such as "Buy
              products here"
            </div>
            <div className="pt-2 pb-2">
              gimmicky use of words, numbers, letters, punctuation, or symbols
              such as FREE, f-r-e-e, and F₹€€!!
            </div>
            <div className="underline text-cyan-600 text-lg">
              Destination requirements
            </div>
            <div className="pt-2 pb-2">
              We want consumers to have a good experience when they click on an
              ad, so ad destinations must offer unique value to users and be
              functional, useful, and easy to navigate.
            </div>
            <div className="pt-2 pb-2">
              Examples of promotions that don't meet destination requirements:
            </div>
            <div className="pt-2 pb-2">
              a display URL that does not accurately reflect the URL of the
              landing page, such as "google.com" taking users to "gmail.com"
            </div>
            <div className="pt-2 pb-2">
              sites or apps that are under construction, parked domains, or are
              just not working
            </div>
            <div className="pt-2 pb-2">
              sites that are not viewable in commonly used browsers
            </div>
            <div className="pt-2 pb-2">
              sites that have disabled the browser's back button
            </div>
            <div className="underline text-cyan-600 text-lg">
              Technical requirements
            </div>
            <div className="pt-2 pb-2">
              To help us keep ads clear and functional, advertisers must meet
              our technical requirements.
            </div>
            <div className="underline text-cyan-600 text-lg">
              Ad format requirements
            </div>
            <div className="pt-2 pb-2">
              In order to help you provide a quality user experience and deliver
              attractive, professional-looking ads, we only allow ads that
              comply with specific requirements for each ad format. Review the
              requirements for all ad formats that you're using.
            </div>
            <div className="pt-2 pb-2">
              Note that we don't allow Non-family safe ads in image ads, video
              ads, and other non-text ad formats. Read more about our Adult
              content policy.
            </div>
            <div className="pt-2 pb-2">
              Advertisers participating in beta programs of new ad formats
              should reach out to their Google Ads representatives or Google Ads
              customer support to learn about format-specific policy
              requirements.
            </div>
            <div className="pt-2 pb-5">
              Examples of ad format requirements: character limits for the ad
              headline or body, image size requirements, file size limits, video
              length limits, aspect ratios
            </div>
            <div className="pt-2 pb-2">About our policies</div>
            <div className="pt-2 pb-2">
              Google Ads enables businesses of all sizes, from around the world,
              to promote a wide variety of products, services, applications, and
              websites on Google and across our network. We want to help you
              reach existing and potential customers and audiences. However, to
              help create a safe and positive experience for users, we listen to
              their feedback and concerns about the types of ads they see. We
              also regularly review changes in online trends and practices,
              industry norms, and regulations. And finally, in crafting our
              policies, we also think about our values and culture as a company,
              as well as operational, technical, and business considerations. As
              a result, we have created a set of policies that apply to all
              promotions on the Google Network.
            </div>
            <div className="pt-2 pb-2">
              Google requires that advertisers comply with all
              <span className="text-blue-600">
                {" "}
                applicable laws and regulations{" "}
              </span>
              and the Google policies described above. It's important that you
              familiarize yourself with and keep up to date on these
              requirements for the places where your business operates, as well
              as any other places your ads are showing. When we find content
              that violates these requirements, we may block it from appearing,
              and in cases of repeated or egregious violations, we may stop you
              from advertising with us.
            </div>
            <div className="underline text-cyan-600 text-lg"></div>
            <div className="pt-2 pb-2"></div>
            <div className="underline text-cyan-600 text-lg"></div>
            <div className="pt-2 pb-2"></div>
            <div className="underline text-cyan-600 text-lg"></div>
            <div className="pt-2 pb-2"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdsPolicies;
