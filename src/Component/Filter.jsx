import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrency, getFilterCat } from "../slice/CategorySlice";
import { getAdsListFilter } from "../slice/ListSlice";
import { useParams } from "react-router-dom";
import { FaFilter, FaChevronDown, FaSearch, FaTags, FaMapMarkerAlt, FaDollarSign, FaHandshake } from "react-icons/fa";

function Filter() {
  const dispatch = useDispatch();
  const categoryAdsData = useSelector((store) => store.categories.catFilter);
  const CatFilter = categoryAdsData?.data;
  const catCurrency = useSelector((store) => store.categories.currency);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [negotiablePrice, setNegotiablePrice] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const applyFilters = () => {
    dispatch(
      getAdsListFilter({
        category: selectedCategory,
        skip: 0,
        limit: 10,
        currencies: selectedCurrency,
        min_price: minPrice,
        max_price: maxPrice,
      })
    );
  };
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCities([]);
    setSelectedCurrency("");
    setNegotiablePrice("");
    setCitySearch("");
    setMinPrice("");
    setMaxPrice("");
  };
  const { slug } = useParams();
  useEffect(() => {
    setSelectedCategory(slug);
  }, [slug]);

  useEffect(() => {
    dispatch(getFilterCat());
    dispatch(getCurrency());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory && CatFilter?.items) {
      const selectedCategoryData = CatFilter.items.find(
        (item) => item?.slug === selectedCategory
      );
      if (selectedCategoryData) {
        setSubcategories(selectedCategoryData.childs || []);
      } else {
        setSubcategories([]);
      }
    } else if (!selectedCategory) {
      setSubcategories([]);
    }
  }, [selectedCategory, CatFilter?.items]);
  return (
    <div className="w-full flex flex-col gap-4 md:w-full lg:w-1/4 xl:w-1/5 max-w-xs">
      {/* Filter Header */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center gap-2 p-4 border-b">
          <FaFilter className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold sr-only">Options</h3>
        </div>
      </div>

      {/* Category Filter */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaTags className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Category</h4>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8"
                value={selectedCategory}
                onChange={(e) => {
                  const category = e.target.value;
                  setSelectedCategory(category);
                }}
              >
                <option value="">Select a Category</option>
                {CatFilter?.items?.map((category) => (
                  <option key={category.category_id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          
            {subcategories.length > 0 && selectedCategory && (
              <div className="relative">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                >
                  <option value="">Select a Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.slug} value={subcategory.slug}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cities Filter */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Location</h4>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search for cities..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
            />
          </div>
          {/* Display selected cities */}
          {selectedCities?.length > 0 && (
            <div className="mt-3 space-y-2">
              <label className="text-sm font-medium">Selected Cities:</label>
              <div className="flex flex-wrap gap-2">
                {selectedCities.map((city) => (
                  <div key={city} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
                    {city}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Currency Filter */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaDollarSign className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Currency</h4>
          </div>
          <div className="relative">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="">Select a Currency</option>
              {catCurrency?.data?.items.map((currency) => (
                <option key={currency.currency_id} value={currency.name}>
                  {currency.name}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Price Filter */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaDollarSign className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Price Range</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Min Price</label>
              <input
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Max Price</label>
              <input
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="∞"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Negotiable Price Filter */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FaHandshake className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Negotiable Price</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="negotiable-yes"
                value="yes"
                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={negotiablePrice === "yes"}
                onChange={() => setNegotiablePrice("yes")}
              />
              <label
                htmlFor="negotiable-yes"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="negotiable-no"
                value="no"
                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={negotiablePrice === "no"}
                onChange={() => setNegotiablePrice("no")}
              />
              <label
                htmlFor="negotiable-no"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                No
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <div className="flex gap-3">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
