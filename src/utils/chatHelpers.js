/**
 * Resolve seller/owner user id from listing payloads across marketplace verticals.
 */
export function resolveSellerId(entity) {
  if (!entity || typeof entity !== 'object') return null;
  const id =
    entity.customer_id ??
    entity.seller_id ??
    entity.user_id ??
    entity.owner_id ??
    entity.agent_id ??
    entity.employer_id ??
    entity.posted_by ??
    entity.seller?.customer_id ??
    entity.seller?.id ??
    entity.seller?.user_id ??
    entity.customer?.customer_id ??
    entity.customer?.id ??
    entity.user?.customer_id ??
    entity.user?.id ??
    entity.service_provider?.user_id ??
    entity.service_provider?.customer_id ??
    entity.employer?.customer_id ??
    entity.employer?.id ??
    null;
  return id == null || id === '' ? null : id;
}

/**
 * Build listing context for StartChatModal / chat API.
 */
export function buildListingChatContext(entity, categoryLabel = 'Listing') {
  if (!entity) return null;
  const listingId =
    entity.listing_id ??
    entity.id ??
    entity.advert_id ??
    entity.service_id ??
    null;
  const title = entity.title || entity.name || entity.job_title || 'Listing';
  const image =
    entity.images?.[0]?.image_path ||
    entity.images?.[0]?.url ||
    entity.main_image ||
    entity.image ||
    entity.cover_image ||
    entity.thumbnail ||
    null;

  return {
    listing_id: listingId,
    title,
    image,
    category: categoryLabel,
    listing_type: String(categoryLabel || 'listing')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, ''),
  };
}

export function resolveSellerName(entity, fallback = 'Seller') {
  if (!entity) return fallback;
  return (
    entity.seller_name ||
    entity.customer?.name ||
    entity.user?.name ||
    entity.service_provider?.business_name ||
    entity.serviceProvider?.business_name ||
    entity.business_name ||
    entity.business_owner ||
    entity.company_name ||
    entity.employer?.name ||
    entity.agent_name ||
    entity.name ||
    fallback
  );
}
