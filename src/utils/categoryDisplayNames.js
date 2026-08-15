/**
 * Display-name overrides for marketplace category tiles.
 * Clive: Buy & Sell "Dogs" / pets category must read as "Animals & Pets".
 */
const ANIMALS_AND_PETS = 'Animals & Pets';

const ANIMALS_PETS_RE =
  /^(dogs?|pets?|pets?\s*&\s*(supplies|animals)|animals?\s*&\s*pets|pet\s*supplies)$/i;

export function displayMarketplaceCategoryName(name, slug = '') {
  const label = String(name || '').trim();
  const key = String(slug || '').trim();
  if (ANIMALS_PETS_RE.test(label) || /^(dogs?|pets?|pets-animals|pets-supplies)$/i.test(key)) {
    return ANIMALS_AND_PETS;
  }
  return label || name;
}
