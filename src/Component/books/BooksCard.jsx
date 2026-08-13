import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { formatBookPrice, getBookCoverUrl } from '../../utils/bookFormHelpers';

/**
 * Bookwriting.com–style card: portrait cover, title, price, Add.
 */
const BooksCard = ({
  book,
  onView,
  onSave,
  showActions = true,
  compact = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(book.is_saved || false);
  const coverUrl = getBookCoverUrl(book);
  const priceLabel = formatBookPrice(book);
  const isFree = priceLabel === 'Free';
  const offerBadge =
    book.advert_type === 'promoted' || book.advert_type === 'featured'
      ? book.price != null && Number(book.price) > 0
        ? `OFFER $${Number(book.price).toFixed(2)}`
        : book.advert_type === 'featured'
          ? 'FEATURED'
          : 'OFFER'
      : null;

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!onSave) {
      onView?.(book);
      return;
    }
    try {
      const next = !isSaved;
      setIsSaved(next);
      await onSave(book.id, next);
    } catch {
      setIsSaved((prev) => !prev);
    }
  };

  return (
    <article
      className={`group cursor-pointer bg-white text-left ${
        compact ? '' : ''
      }`}
      onClick={() => onView?.(book)}
    >
      {/* Portrait cover — book aspect ratio */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 shadow-sm ring-1 ring-slate-200/80">
        {!imageError && coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title || 'Book cover'}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-slate-200 to-slate-300 px-3 text-center">
            <BookOpen className="h-8 w-8 text-slate-500" />
            <span className="line-clamp-3 text-xs font-semibold text-slate-700">
              {book.title || 'No cover'}
            </span>
          </div>
        )}

        {offerBadge && (
          <div className="absolute right-1.5 top-1.5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-center text-[9px] font-bold leading-tight text-slate-900 shadow ring-2 ring-white">
            {offerBadge}
          </div>
        )}
      </div>

      <div className="pt-2.5 pb-1 px-0.5">
        <h3 className="text-[13px] font-medium leading-snug text-slate-900 line-clamp-2 min-h-[2.4em]">
          {book.title}
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span
            className={`text-sm font-medium ${
              isFree ? 'text-sky-500' : 'text-slate-800'
            }`}
          >
            {priceLabel}
          </span>
          {showActions && (
            <button
              type="button"
              onClick={handleAdd}
              className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {isSaved ? 'Saved' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BooksCard;
