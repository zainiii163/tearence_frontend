import React from 'react';
import { Car, Truck, Bike, Bus, Zap, Crown, Home, Ship, Tractor, HardHat } from 'lucide-react';
import CompactCategoryChips from '../shared/CompactCategoryChips';

const iconMap = {
  car: Car,
  van: Truck,
  motorbike: Bike,
  truck: Truck,
  bus: Bus,
  coach: Bus,
  electric_vehicle: Zap,
  classic_car: Crown,
  luxury_vehicle: Crown,
  caravan: Home,
  motorhome: Home,
  boat: Ship,
  jet_ski: Ship,
  agricultural: Tractor,
  construction: HardHat,
  other: Car,
};

const VehicleCategoryGrid = ({ vehicleTypes = {}, selectedCategoryId, onCategorySelect }) => {
  const items = Object.entries(vehicleTypes).map(([key, label]) => ({
    id: key,
    name: label,
  }));

  return (
    <CompactCategoryChips
      items={items}
      selectedId={selectedCategoryId}
      title="Categories"
      theme="red"
      initialVisible={30}
      onSelect={(item) => onCategorySelect?.(item.id)}
      renderIcon={(item, { active }) => {
        const Icon = iconMap[item.id] || Car;
        return (
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-md shrink-0 ${
              active ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'
            }`}
          >
            <Icon className="h-3 w-3" />
          </span>
        );
      }}
    />
  );
};

export default VehicleCategoryGrid;
