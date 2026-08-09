import React from 'react';
import {
  FaClock,
  FaCalendarCheck,
  FaUtensils,
  FaLeaf,
  FaWrench,
  FaCar,
  FaPhoneAlt,
  FaStar,
  FaLink,
  FaHeartbeat,
  FaGraduationCap,
  FaHome,
  FaSpa,
  FaPaw,
  FaLaptop,
  FaDumbbell,
  FaIndustry,
  FaHandHoldingHeart,
  FaTicketAlt,
  FaPlane,
} from 'react-icons/fa';
import { CATEGORY_PROFILE_TEMPLATES } from '../../data/businessDirectoryExamples';

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const resolveCategoryKey = (business) => {
  const raw = String(
    business?.business_category_slug ||
      business?.category?.slug ||
      business?.category_slug ||
      business?.category_name ||
      business?.business_category ||
      business?.category?.name ||
      ''
  )
    .toLowerCase()
    .replace(/_/g, '-');

  if (raw.includes('restaurant') || raw.includes('food') || raw.includes('cafe')) {
    return 'restaurants';
  }
  if (raw.includes('auto') || raw.includes('garage') || raw.includes('mechanic')) {
    return 'automotive';
  }
  if (CATEGORY_PROFILE_TEMPLATES[raw]) return raw;

  const match = Object.keys(CATEGORY_PROFILE_TEMPLATES).find((k) => raw.includes(k));
  return match || 'services';
};

const Section = ({ icon: Icon, title, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-purple-600" />
      {title}
    </h3>
    {children}
  </div>
);

const HoursTable = ({ hours }) => {
  if (!hours || typeof hours !== 'object') return null;
  return (
    <ul className="space-y-1.5">
      {DAY_ORDER.map((day) =>
        hours[day] ? (
          <li
            key={day}
            className="flex items-center justify-between gap-3 text-sm text-slate-700"
          >
            <span className="capitalize font-medium text-slate-600">{day}</span>
            <span className="font-semibold text-slate-900">{hours[day]}</span>
          </li>
        ) : null
      )}
    </ul>
  );
};

const ChipList = ({ items }) => {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

/**
 * Category-specific business profile panels (hours, booking, services, menu, etc.).
 */
const BusinessCategoryProfilePanel = ({ business }) => {
  if (!business) return null;

  const categoryKey = resolveCategoryKey(business);
  const template = CATEGORY_PROFILE_TEMPLATES[categoryKey] || CATEGORY_PROFILE_TEMPLATES.services;
  const profile = {
    ...(business.profile || business.category_profile || {}),
  };

  // Seed sensible defaults for API businesses that only have contact fields
  if (!profile.opening_hours && !profile.operating_hours && !business.opening_hours) {
    // leave empty — Hours section will prompt to add times
  }

  if (!profile.booking_slots) {
    if (categoryKey === 'restaurants') {
      profile.booking_slots = profile.booking_slots || [
        'Lunch service',
        'Dinner service',
        'Weekend brunch',
      ];
    } else if (categoryKey === 'automotive') {
      profile.booking_slots = profile.booking_slots || [
        'Morning drop-off',
        'Afternoon collection',
        'MOT appointment',
      ];
    } else if (categoryKey === 'beauty' || categoryKey === 'healthcare' || categoryKey === 'pets') {
      profile.booking_slots = profile.booking_slots || [
        'Morning appointment',
        'Afternoon appointment',
      ];
    } else if (categoryKey === 'sports-fitness') {
      profile.booking_slots = profile.booking_slots || ['Class booking', 'PT session'];
    } else if (categoryKey === 'real-estate') {
      profile.booking_slots = profile.booking_slots || ['Weekday viewing', 'Weekend viewing'];
    } else if (categoryKey === 'travel') {
      profile.booking_slots = profile.booking_slots || ['Check-in from 15:00', 'Check-out by 11:00'];
    } else if (categoryKey === 'services' || categoryKey === 'technology') {
      profile.booking_slots = profile.booking_slots || [
        'Consultation call',
        'On-site visit',
      ];
    }
  }

  if (!profile.highlights) {
    const defaults = {
      restaurants: ['Reservations welcome', 'Ask about private dining'],
      automotive: ['Book MOT & servicing online', 'All makes welcome'],
      retail: ['In-store & click-and-collect'],
      healthcare: ['Appointments available', 'Patient-first care'],
      beauty: ['Walk-ins when available', 'Book treatments ahead'],
      travel: ['Enquire for packages', 'Flexible booking'],
      education: ['Enrolment open', 'Course advice available'],
      'sports-fitness': ['Trial sessions', 'Membership options'],
      pets: ['Grooming & care by appointment'],
      technology: ['Support tickets & demos'],
      services: ['Free initial consultation'],
      'real-estate': ['Book a viewing'],
      entertainment: ['Tickets & private hire'],
      industrial: ['Trade enquiries welcome'],
      'non-profit': ['Donations & volunteering'],
      'home-garden': ['Showroom visits by appointment'],
    };
    profile.highlights = defaults[categoryKey] || ['Contact us for details'];
  }

  const hours =
    profile.opening_hours ||
    profile.operating_hours ||
    business.opening_hours ||
    business.operating_hours ||
    null;

  const bookingUrl =
    profile.booking_url || business.booking_url || business.business_website || null;
  const bookingPhone =
    profile.booking_phone || business.booking_phone || business.business_phone_number || null;
  const bookingSlots = profile.booking_slots || business.booking_slots || [];

  const sections = template.sections || [];

  const rendered = [];

  if (sections.includes('opening_hours') || sections.includes('support_hours') || sections.includes('term_hours') || sections.includes('check_in')) {
    if (hours) {
      rendered.push(
        <Section key="hours" icon={FaClock} title="Opening times">
          <HoursTable hours={hours} />
        </Section>
      );
    } else {
      rendered.push(
        <Section key="hours" icon={FaClock} title="Opening times">
          <p className="text-sm text-slate-500">
            Add opening hours so customers know when you are available.
          </p>
        </Section>
      );
    }
  }

  if (sections.includes('booking') || sections.includes('viewings') || sections.includes('enrollment')) {
    rendered.push(
      <Section key="booking" icon={FaCalendarCheck} title="Booking">
        <div className="space-y-3">
          {bookingSlots.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Available slots</p>
              <ChipList items={bookingSlots} />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {bookingPhone && (
              <a
                href={`tel:${bookingPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700"
              >
                <FaPhoneAlt className="h-3 w-3" />
                Book by phone
              </a>
            )}
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-white border border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <FaLink className="h-3 w-3" />
                Book online
              </a>
            )}
          </div>
          {!bookingPhone && !bookingUrl && !bookingSlots.length && (
            <p className="text-sm text-slate-500">Add booking times or a booking link for this category.</p>
          )}
        </div>
      </Section>
    );
  }

  if (sections.includes('cuisine') && (profile.cuisine || profile.price_range)) {
    rendered.push(
      <Section key="cuisine" icon={FaUtensils} title="Cuisine & dining">
        <ChipList items={profile.cuisine} />
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {profile.price_range && (
            <div>
              <p className="text-xs text-slate-500">Price range</p>
              <p className="font-semibold text-slate-900">{profile.price_range}</p>
            </div>
          )}
          {profile.seating_capacity && (
            <div>
              <p className="text-xs text-slate-500">Seats</p>
              <p className="font-semibold text-slate-900">{profile.seating_capacity}</p>
            </div>
          )}
          {profile.outdoor_seating != null && (
            <div>
              <p className="text-xs text-slate-500">Outdoor</p>
              <p className="font-semibold text-slate-900">
                {profile.outdoor_seating ? 'Yes' : 'No'}
              </p>
            </div>
          )}
          {(profile.delivery || profile.takeaway) && (
            <div>
              <p className="text-xs text-slate-500">Orders</p>
              <p className="font-semibold text-slate-900">
                {[profile.delivery && 'Delivery', profile.takeaway && 'Takeaway']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
          )}
        </div>
      </Section>
    );
  }

  if (sections.includes('menu') && Array.isArray(profile.menu_samples) && profile.menu_samples.length) {
    rendered.push(
      <Section key="menu" icon={FaUtensils} title="Menu highlights">
        <ul className="space-y-2">
          {profile.menu_samples.map((item) => (
            <li
              key={item.name}
              className="flex items-start justify-between gap-3 text-sm border-b border-slate-100 pb-2 last:border-0"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
              </div>
              {item.price && <span className="font-bold text-purple-700 shrink-0">{item.price}</span>}
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  if (sections.includes('dietary') && profile.dietary) {
    rendered.push(
      <Section key="dietary" icon={FaLeaf} title="Dietary options">
        <ChipList items={profile.dietary} />
      </Section>
    );
  }

  if (sections.includes('services') && profile.services) {
    const Icon = categoryKey === 'automotive' ? FaWrench : categoryKey === 'beauty' ? FaSpa : categoryKey === 'pets' ? FaPaw : FaStar;
    rendered.push(
      <Section key="services" icon={Icon} title="Services offered">
        <ChipList items={profile.services} />
      </Section>
    );
  }

  if (sections.includes('makes') && profile.makes_serviced) {
    rendered.push(
      <Section key="makes" icon={FaCar} title="Makes serviced">
        <ChipList items={profile.makes_serviced} />
        {profile.warranties && (
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Warranty: </span>
            {profile.warranties}
          </p>
        )}
      </Section>
    );
  }

  if (sections.includes('tow') && (profile.emergency_tow || profile.tow_phone)) {
    rendered.push(
      <Section key="tow" icon={FaPhoneAlt} title="Emergency / tow">
        <p className="text-sm text-slate-700 mb-2">
          {profile.emergency_tow ? '24/7 tow coordination available' : 'Tow partners on request'}
        </p>
        {profile.tow_phone && (
          <a
            href={`tel:${profile.tow_phone}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:underline"
          >
            <FaPhoneAlt className="h-3 w-3" />
            {profile.tow_phone}
          </a>
        )}
      </Section>
    );
  }

  if (sections.includes('specialties') || sections.includes('courses') || sections.includes('classes') || sections.includes('products') || sections.includes('programs') || sections.includes('amenities') || sections.includes('events') || sections.includes('areas') || sections.includes('capacity') || sections.includes('consultation') || sections.includes('click_collect') || sections.includes('callouts') || sections.includes('donation') || sections.includes('insurance')) {
    const extras = profile.specialties || profile.courses || profile.classes || profile.products || profile.programs || profile.amenities || profile.events || profile.areas || profile.capacity_notes || profile.consultation_types || profile.click_collect_notes || profile.callouts || profile.donation_info || profile.insurance_accepted;
    if (extras) {
      const Icon =
        categoryKey === 'healthcare'
          ? FaHeartbeat
          : categoryKey === 'education'
            ? FaGraduationCap
            : categoryKey === 'travel'
              ? FaPlane
              : categoryKey === 'entertainment'
                ? FaTicketAlt
                : categoryKey === 'technology'
                  ? FaLaptop
                  : categoryKey === 'sports-fitness'
                    ? FaDumbbell
                    : categoryKey === 'industrial'
                      ? FaIndustry
                      : categoryKey === 'non-profit'
                        ? FaHandHoldingHeart
                        : categoryKey === 'real-estate'
                          ? FaHome
                          : FaStar;
      rendered.push(
        <Section key="extras" icon={Icon} title="Category details">
          {Array.isArray(extras) ? <ChipList items={extras} /> : <p className="text-sm text-slate-700">{extras}</p>}
        </Section>
      );
    }
  }

  if (sections.includes('highlights') && Array.isArray(profile.highlights) && profile.highlights.length) {
    rendered.push(
      <Section key="highlights" icon={FaStar} title="Why choose us">
        <ul className="space-y-1.5">
          {profile.highlights.map((h) => (
            <li key={h} className="text-sm text-slate-700 flex gap-2">
              <span className="text-purple-500 font-bold">·</span>
              {h}
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  if (!rendered.length) return null;

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-2xl font-bold text-gray-900">{template.label}</h2>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${template.accent}`}
        >
          Category template
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{rendered}</div>
    </div>
  );
};

export default BusinessCategoryProfilePanel;
