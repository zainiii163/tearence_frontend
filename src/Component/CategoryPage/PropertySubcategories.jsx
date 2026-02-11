import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBuilding, FaIndustry, FaTree } from 'react-icons/fa';
import { propertySubcategories } from '../../data/propertySubcategories';

const PropertySubcategories = () => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'fa-home':
        return <FaHome className="h-6 w-6" />;
      case 'fa-building':
        return <FaBuilding className="h-6 w-6" />;
      case 'fa-industry':
        return <FaIndustry className="h-6 w-6" />;
      case 'fa-tree':
        return <FaTree className="h-6 w-6" />;
      default:
        return <FaHome className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Property Categories</h2>
        <p className="text-muted-foreground">Browse property listings by category</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {propertySubcategories.map((subcategory) => (
          <Link 
            key={subcategory.id} 
            to={`/category/property/${subcategory.slug}`}
            className="group"
          >
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mx-auto mb-4">
                {getIcon(subcategory.icon)}
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {subcategory.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {subcategory.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertySubcategories;
