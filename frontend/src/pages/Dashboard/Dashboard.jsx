import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import vehicleService from '../../services/vehicleService';
import SearchBar from '../../components/SearchBar/SearchBar';

const categoryIcons = {
  Sedan: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
  SUV: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  Truck: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2l3-4V8h-3m-1 8H3',
  default: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0V6.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.5M7.5 14.25V18',
};

const getCategoryIcon = (category) => categoryIcons[category] || categoryIcons.default;

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === 'success'
    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
    : 'bg-red-500/15 border-red-500/30 text-red-400';

  const icon = type === 'success' ? (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ) : (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-[slideIn_0.3s_ease-out]">
      <div className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-black/40 ${styles}`}>
        {icon}
        <span className="text-sm font-medium whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const inStock = vehicles.filter((v) => v.quantity > 0).length;
    const outOfStock = vehicles.filter((v) => v.quantity === 0).length;
    const categories = new Set(vehicles.map((v) => v.category)).size;
    return { total, inStock, outOfStock, categories };
  }, [vehicles]);

  const handlePurchase = async (vehicle) => {
    setPurchasing(vehicle.id);
    try {
      const updated = await vehicleService.purchase(vehicle.id);
      setVehicles((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v))
      );
      setToast({ message: `${updated.make} ${updated.model} purchased successfully`, type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Purchase failed', type: 'error' });
    } finally {
      setPurchasing(null);
    }
  };

  const handleSearch = async (params) => {
    setLoading(true);
    setError('');
    try {
      const data = Object.keys(params).length > 0
        ? await vehicleService.search(params)
        : await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-400 mt-2">
          {isAdmin ? 'Admin' : 'User'} Dashboard &mdash; Vehicle Inventory
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Total Vehicles', value: stats.total, gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/20' },
          { label: 'In Stock', value: stats.inStock, gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20' },
          { label: 'Out of Stock', value: stats.outOfStock, gradient: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/20' },
          { label: 'Categories', value: stats.categories, gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg ${stat.glow}`}>
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{loading ? '--' : stat.value}</p>
          </div>
        ))}
      </div>

      <SearchBar onSearch={handleSearch} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl mb-8 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gray-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-800 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-800 rounded-lg w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-800 rounded-lg w-full" />
                <div className="h-3 bg-gray-800 rounded-lg w-2/3" />
                <div className="h-8 bg-gray-800 rounded-xl w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
          <svg className="w-16 h-16 text-gray-700 mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons.default} />
          </svg>
          <p className="text-gray-400 text-lg">No vehicles in inventory yet</p>
          <p className="text-gray-600 text-sm mt-1">Vehicles will appear here once added</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((vehicle) => {
            const outOfStock = vehicle.quantity === 0;
            const isPurchasing = purchasing === vehicle.id;

            return (
              <div
                key={vehicle.id}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={getCategoryIcon(vehicle.category)} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold leading-tight">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {vehicle.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between py-2.5 border-t border-gray-800/60">
                    <span className="text-sm text-gray-400">Price</span>
                    <span className="text-lg font-bold text-white">
                      ${vehicle.price?.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-t border-gray-800/60">
                    <span className="text-sm text-gray-400">Quantity</span>
                    {outOfStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Out of stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {vehicle.quantity} units
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-800/60">
                  {outOfStock ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700/50"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(vehicle)}
                      disabled={isPurchasing}
                      className="w-full py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      {isPurchasing ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Purchasing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                          </svg>
                          Purchase
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
