import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiMapPin } from 'react-icons/fi';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../constants/categoryThemes';
import { VENTURE_CAPITAL_FIRMS, BUSINESS_LOAN_LENDERS } from '../data/fundingDirectory';

const HERO_BG =
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1920&q=80';

/**
 * @param {'venture' | 'loans'} variant
 */
const FundingDirectoryPage = ({ variant = 'venture' }) => {
  const isVc = variant === 'venture';
  const theme = getCategoryTheme('funding');
  const items = isVc ? VENTURE_CAPITAL_FIRMS : BUSINESS_LOAN_LENDERS;

  return (
    <CategoryPageShell
      categoryId="funding"
      backHref="/funding"
      showBackBar
      backBarTo="/funding"
      backBarLabel="Back to Business Funding"
      hero={
        <BrowseMarketplaceHero
          title={isVc ? 'Venture Capital' : 'Business Loans'}
          eyebrow=""
          subtitle={
            isVc
              ? 'Find investors and funds that back startups and growing businesses'
              : 'Companies that offer business loans and trade finance'
          }
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
          searchPlaceholder={isVc ? 'Search investors…' : 'Search lenders…'}
        />
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((firm) => (
          <article
            key={firm.id}
            className="flex flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-36 bg-slate-100 overflow-hidden">
              <img src={firm.image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-base font-bold text-slate-900">{firm.name}</h2>
              <p className="mt-1 text-xs text-emerald-800 font-semibold">
                {isVc ? firm.focus : firm.product}
              </p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{firm.blurb}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-800">{isVc ? 'Stage' : 'Amount'}</dt>
                  <dd>{isVc ? firm.stage : firm.amount}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">{isVc ? 'Cheque size' : 'Term'}</dt>
                  <dd>{isVc ? firm.ticket : firm.term}</dd>
                </div>
              </dl>
              <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                <FiMapPin className="h-3 w-3" /> {firm.location}
              </p>
              <a
                href={`mailto:${firm.contactEmail}?subject=${encodeURIComponent(
                  isVc ? 'Pitch intro via Worldwide Adverts' : 'Loan enquiry via Worldwide Adverts'
                )}`}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <FiMail className="h-4 w-4" />
                Contact
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Looking for crowdfunding instead?{' '}
        <Link to="/funding" className="font-semibold text-emerald-700 hover:underline">
          Browse campaigns and donate
        </Link>
      </p>
    </CategoryPageShell>
  );
};

export const FundingVentureCapitalPage = () => <FundingDirectoryPage variant="venture" />;
export const FundingLoansPage = () => <FundingDirectoryPage variant="loans" />;

export default FundingDirectoryPage;
