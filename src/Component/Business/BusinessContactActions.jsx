import React from 'react';
import {
  FaCalendarCheck,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from 'react-icons/fa';
import ChatButton from '../Chat/ChatButton';
import {
  buildListingChatContext,
  resolveSellerId,
} from '../../utils/chatHelpers';
import { resolveBusinessContactActions } from '../../utils/businessSocial';

/**
 * Primary CTAs on a business profile: Book, Call, Email, Message, WhatsApp.
 */
const BusinessContactActions = ({
  business,
  isOwner = false,
  social = null,
  layout = 'row',
  className = '',
}) => {
  if (!business) return null;

  const { bookingUrl, phone, email, whatsapp } = resolveBusinessContactActions(
    business,
    social
  );
  const sellerId = resolveSellerId(business);
  const showMessage = !isOwner && Boolean(sellerId);
  const sellerName =
    business.business_name || business.business_owner || business.name || 'Business';

  const items = [];

  if (bookingUrl) {
    items.push({
      key: 'book',
      href: bookingUrl,
      external: true,
      label: 'Book',
      icon: FaCalendarCheck,
      className: 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600',
    });
  }
  if (phone) {
    items.push({
      key: 'call',
      href: `tel:${String(phone).replace(/\s+/g, '')}`,
      label: 'Call',
      icon: FaPhoneAlt,
      className: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200',
    });
  }
  if (email) {
    items.push({
      key: 'email',
      href: `mailto:${email}`,
      label: 'Email',
      icon: FaEnvelope,
      className: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200',
    });
  }
  if (whatsapp) {
    items.push({
      key: 'whatsapp',
      href: whatsapp,
      external: true,
      label: 'WhatsApp',
      icon: FaWhatsapp,
      className: 'bg-[#25D366] text-white hover:bg-[#1ebe57] border-[#25D366]',
    });
  }

  if (!items.length && !showMessage) return null;

  const wrap =
    layout === 'stack'
      ? 'flex flex-col gap-2'
      : 'flex flex-wrap items-center gap-2';

  const btnBase =
    layout === 'stack'
      ? 'inline-flex w-full items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors'
      : 'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors';

  return (
    <div className={`${wrap} ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.key}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className={`${btnBase} ${item.className}`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {item.label}
          </a>
        );
      })}

      {showMessage ? (
        <ChatButton
          sellerId={sellerId}
          sellerName={sellerName}
          listing={buildListingChatContext(
            { ...business, title: sellerName, name: sellerName },
            'Business'
          )}
          label="Message"
          className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600`}
          variant="custom"
        />
      ) : null}
    </div>
  );
};

export default BusinessContactActions;
