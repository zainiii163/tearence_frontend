/**
 * YouTube Shopping-style deal / drop payload from a marketplace offer.
 */
export function getOfferShopping(offer = {}) {
  const fromApi =
    offer.shopping ||
    offer.shopping_activity ||
    offer.marketplace_stats?.shopping ||
    null;

  if (fromApi && typeof fromApi === 'object') {
    const hasSignal =
      fromApi.label ||
      fromApi.on_sale ||
      fromApi.dropping_soon ||
      fromApi.discount_code ||
      fromApi.type;
    if (hasSignal) return fromApi;
  }

  const price = Number(offer.sale_price ?? fromApi?.sale_price ?? fromApi?.price ?? 0);
  const compare = Number(offer.compare_at_price ?? fromApi?.compare_at_price ?? 0);
  const dropAt = offer.drop_at || fromApi?.drop_at || null;
  const dropDate = dropAt ? new Date(dropAt) : null;
  const droppingSoon = Boolean(dropDate && !Number.isNaN(dropDate.getTime()) && dropDate > new Date());
  const onSale = compare > 0 && price > 0 && compare > price;
  const percentOff = onSale ? Math.round(((compare - price) / compare) * 100) : null;
  let type = String(offer.promotion_type || fromApi?.type || 'none');
  if (!type || type === 'none') {
    if (droppingSoon) type = 'product_drop';
    else if (onSale) type = 'sale';
    else if (offer.discount_code) type = 'sale';
  }

  let label = offer.promotion_label || fromApi?.label || null;
  if (!label) {
    if (type === 'product_drop') label = droppingSoon ? 'Dropping soon' : 'Product drop';
    else if (type === 'price_drop' && onSale) label = 'Price drop';
    else if (onSale && percentOff) label = `${percentOff}% off`;
    else if (offer.discount_code) label = `Code: ${offer.discount_code}`;
  }

  return {
    type: type === 'none' ? null : type,
    label,
    price: price > 0 ? price : null,
    sale_price: price > 0 ? price : null,
    compare_at_price: compare > 0 ? compare : null,
    discount_code: offer.discount_code || fromApi?.discount_code || null,
    drop_at: dropAt,
    dropping_soon: droppingSoon,
    on_sale: onSale,
    percent_off: percentOff,
  };
}

export function offerHasDeal(offer) {
  const s = getOfferShopping(offer);
  return Boolean(s.on_sale || s.dropping_soon || s.discount_code || s.label);
}
