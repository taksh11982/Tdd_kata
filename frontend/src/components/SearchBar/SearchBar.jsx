import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [expanded, setExpanded] = useState(false);

  const hasFilters = make || model || category || minPrice || maxPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (make.trim()) params.make = make.trim();
    if (model.trim()) params.model = model.trim();
    if (category.trim()) params.category = category.trim();
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    onSearch(params);
  };

  const handleClear = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/10 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white">Search Vehicles</span>
          {hasFilters && (
            <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-xs font-medium">
              Active
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Make</label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Toyota"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Camry"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Sedan"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="No limit"
                min="0"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-violet-500 hover:to-purple-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg shadow-violet-500/25"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
