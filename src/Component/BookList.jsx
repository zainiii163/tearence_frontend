import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../slice/BookSlice";
import { FaChevronLeft, FaChevronRight, FaBook, FaExternalLinkAlt, FaDollarSign, FaSearch, FaFilter, FaHeadphones } from "react-icons/fa";

const BookList = () => {
  const dispatch = useDispatch();
  const booksListData = useSelector((store) => {
    return store.book?.bookList;
  });
  const bookListRecords = booksListData?.data || [];

  const itemsPerPage = 20;
  const totalDataCount = bookListRecords?.total || 0;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  // Book genres/filters
  const genres = [
    { value: "all", label: "All Genres" },
    { value: "action", label: "Action" },
    { value: "education", label: "Education" },
    { value: "drama", label: "Drama" },
    { value: "thriller", label: "Thriller" },
    { value: "romance", label: "Romance" },
    { value: "scifi", label: "Science Fiction" },
    { value: "fantasy", label: "Fantasy" },
    { value: "mystery", label: "Mystery" },
    { value: "biography", label: "Biography" },
    { value: "history", label: "History" },
    { value: "selfhelp", label: "Self-Help" },
    { value: "business", label: "Business" },
    { value: "cooking", label: "Cooking" },
    { value: "children", label: "Children's Books" }
  ];

  // Book formats
  const formats = [
    { value: "all", label: "All Formats" },
    { value: "hardcover", label: "Hardcover" },
    { value: "paperback", label: "Paperback" },
    { value: "ebook", label: "E-book" },
    { value: "audiobook", label: "Audiobook" },
    { value: "pdf", label: "PDF" }
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "title_az", label: "Title: A-Z" },
    { value: "title_za", label: "Title: Z-A" }
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    dispatch(
      getBooks({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        format: selectedFormat !== "all" ? selectedFormat : undefined,
        search: searchQuery || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        sortBy: sortBy
      })
    );
  }, [currentPage, dispatch, selectedGenre, selectedFormat, searchQuery, priceRange, sortBy]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(totalDataCount / itemsPerPage);

  // Filter books based on selected criteria
  const filteredBooks = bookListRecords?.items?.filter(book => {
    if (selectedGenre !== "all" && book.genre !== selectedGenre) return false;
    if (selectedFormat !== "all" && book.format !== selectedFormat) return false;
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (priceRange.min && book.price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && book.price > parseFloat(priceRange.max)) return false;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-24 pb-12">
        {/* Header Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FaBook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Book Collection
              </h1>
              <p className="text-muted-foreground">
                Discover our curated selection of books with advanced filters
              </p>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {genres.map(genre => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>

            {/* Format Filter */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {formats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Price Range:</span>
            <div className="flex gap-2 flex-1 max-w-xs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Audiobook Section */}
          {selectedFormat === "audiobook" && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FaHeadphones className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Audiobooks</h3>
              </div>
              <p className="text-sm text-blue-700">
                Listen to your favorite books on the go. Perfect for commuting, exercising, or relaxing.
              </p>
            </div>
          )}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {filteredBooks.map((item, i) => (
            <div
              key={i}
              className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-muted relative">
                <img
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  src={item.image_url}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = "/img/no-image.png";
                  }}
                />
                {item.format === "audiobook" && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <FaHeadphones className="h-3 w-3" />
                    Audiobook
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {item.genre || "General"}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {item.format || "Book"}
                  </span>
                </div>
                <h3 className="font-semibold leading-tight text-foreground line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {item.short_description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                    <FaDollarSign className="h-4 w-4" />
                    {item.price}
                  </div>
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 gap-2"
                  >
                    <span>View</span>
                    <FaExternalLinkAlt className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!filteredBooks || filteredBooks.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FaBook className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No books found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalDataCount > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {startIndex + 1}-{Math.min(endIndex, totalDataCount)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalDataCount}</span>{" "}
              results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
              >
                <FaChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Page</span>
                <span className="text-sm font-medium text-foreground">
                  {currentPage} of {totalPages}
                </span>
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
              >
                Next
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookList;
