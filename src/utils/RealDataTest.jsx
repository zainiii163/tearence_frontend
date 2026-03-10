import React from 'react';
import resortsTravelApi from '../services/resortsTravelAPI';

// Simple test component to verify real data loading
const RealDataTest = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [advertTypes, categories, amenities, promotionTiers] = await Promise.all([
          resortsTravelApi.getAdvertTypes(),
          resortsTravelApi.getCategories(),
          resortsTravelApi.getAmenities(),
          resortsTravelApi.getPromotionTiers()
        ]);

        setData({
          advertTypes: advertTypes.data || [],
          categories: categories.data || [],
          amenities: amenities.data || [],
          promotionTiers: promotionTiers.data || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading real data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Real API Data Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Advert Types ({data.advertTypes.length})</h3>
          <ul className="space-y-1">
            {data.advertTypes.map(type => (
              <li key={type.id} className="text-sm">• {type.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Categories ({data.categories.length})</h3>
          <ul className="space-y-1">
            {data.categories.slice(0, 5).map(cat => (
              <li key={cat.id} className="text-sm">• {cat.name}</li>
            ))}
            {data.categories.length > 5 && <li className="text-sm">• ... and {data.categories.length - 5} more</li>}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Amenities ({data.amenities.length})</h3>
          <ul className="space-y-1">
            {data.amenities.slice(0, 5).map(amenity => (
              <li key={amenity.id} className="text-sm">• {amenity.name}</li>
            ))}
            {data.amenities.length > 5 && <li className="text-sm">• ... and {data.amenities.length - 5} more</li>}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Promotion Tiers ({data.promotionTiers.length})</h3>
          <ul className="space-y-1">
            {data.promotionTiers.map(tier => (
              <li key={tier.id} className="text-sm">• {tier.name} - {tier.price}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-green-800">✅ Real data successfully loaded from API!</p>
        <p className="text-sm text-green-600 mt-1">
          The TravelPostForm now uses real data instead of hardcoded arrays.
        </p>
      </div>
    </div>
  );
};

export default RealDataTest;
