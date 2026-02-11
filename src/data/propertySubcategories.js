export const propertySubcategories = [
  {
    id: 'houses',
    name: 'Houses',
    slug: 'houses',
    icon: 'fa-home',
    description: 'Residential houses, apartments, condos, and villas',
    property_types: ['house', 'apartment', 'condo', 'villa', 'townhouse']
  },
  {
    id: 'commercial',
    name: 'Commercial',
    slug: 'commercial',
    icon: 'fa-building',
    description: 'Commercial properties, office spaces, retail',
    property_types: ['commercial', 'office', 'retail', 'warehouse']
  },
  {
    id: 'industrial',
    name: 'Industrial',
    slug: 'industrial',
    icon: 'fa-industry',
    description: 'Industrial properties, factories, manufacturing',
    property_types: ['industrial', 'factory', 'manufacturing', 'warehouse']
  },
  {
    id: 'farm-plots',
    name: 'Farm & Plots',
    slug: 'farm-plots',
    icon: 'fa-tree',
    description: 'Agricultural land, farms, residential plots',
    property_types: ['land', 'farm', 'agricultural', 'plot']
  }
];

export const getPropertySubcategoryByType = (propertyType) => {
  return propertySubcategories.find(subcat => 
    subcat.property_types.includes(propertyType)
  );
};

export const getPropertySubcategoryBySlug = (slug) => {
  return propertySubcategories.find(subcat => subcat.slug === slug);
};
