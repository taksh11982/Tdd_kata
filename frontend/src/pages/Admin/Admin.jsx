import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../../services/vehicleService';
import Pagination from '../../components/Pagination/Pagination';

const emptyVehicle = { make: '', model: '', category: '', price: '', quantity: '' };

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-black/50 animate-[fadeUp_0.2s_ease-out]">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  </div>
);

const VehicleForm = ({ initialData, onSubmit, onCancel, buttonText }) => {
  const [form, setForm] = useState(initialData || emptyVehicle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        make: form.make,
        model: form.model,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Make</label>
          <input value={form.make} onChange={set('make')} required className={inputClass} placeholder="Toyota" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Model</label>
          <input value={form.model} onChange={set('model')} required className={inputClass} placeholder="Camry" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
        <input value={form.category} onChange={set('category')} required className={inputClass} placeholder="Sedan" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Price ($)</label>
          <input type="number" step="0.01" min="0.01" value={form.price} onChange={set('price')} required className={inputClass} placeholder="25000" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Quantity</label>
          <input type="number" min="0" value={form.quantity} onChange={set('quantity')} required className={inputClass} placeholder="10" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2">
          {saving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
          {saving ? 'Saving...' : buttonText}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-[fadeUp_0.3s_ease-out]">
      <div className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-black/40 ${
        type === 'success'
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          : 'bg-red-500/15 border-red-500/30 text-red-400'
      }`}>
        {type === 'success' ? (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        )}
        <span className="text-sm font-medium whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
};

const Admin = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState({ totalVehicles: 0, totalStock: 0, lowStock: 0, outOfStock: 0 });

  const [showCreate, setShowCreate] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [restockVehicle, setRestockVehicle] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [restockSaving, setRestockSaving] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchVehicles = useCallback(async (p = 0) => {
    try {
      let [paged, statsData] = await Promise.all([
        vehicleService.getAll(p, 6),
        vehicleService.getStats(),
      ]);

      if (paged.content.length === 0 && p > 0) {
        paged = await vehicleService.getAll(0, 6);
        p = 0;
      }

      setVehicles(paged.content);
      setTotalPages(paged.totalPages);
      setPage(p);
      setStats({
        totalVehicles: statsData.totalVehicles,
        totalStock: statsData.totalStock,
        lowStock: statsData.lowStock,
        outOfStock: statsData.outOfStock,
      });
    } catch {
      showToast('Failed to load vehicles', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(0); }, [fetchVehicles]);

  const handlePageChange = (newPage) => {
    setLoading(true);
    fetchVehicles(newPage);
  };

  const handleCreate = async (data) => {
    await vehicleService.create(data);
    setShowCreate(false);
    showToast('Vehicle created');
    fetchVehicles(0);
  };

  const handleUpdate = async (data) => {
    await vehicleService.update(editVehicle.id, data);
    setEditVehicle(null);
    showToast('Vehicle updated');
    fetchVehicles(0);
  };

  const handleDelete = async () => {
    await vehicleService.delete(deleteVehicle.id);
    showToast(`${deleteVehicle.make} ${deleteVehicle.model} deleted`);
    setDeleteVehicle(null);
    fetchVehicles(0);
  };

  const handleRestock = async () => {
    setRestockSaving(true);
    try {
      await vehicleService.restock(restockVehicle.id, parseInt(restockQty));
      showToast(`${restockVehicle.make} ${restockVehicle.model} restocked`);
      setRestockVehicle(null);
      setRestockQty('');
      fetchVehicles(0);
    } catch (err) {
      showToast(err.response?.data?.message || 'Restock failed', 'error');
    } finally {
      setRestockSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-400 text-xs font-semibold uppercase tracking-wider">Admin</span>
          </div>
          <p className="text-gray-400">Create, edit, restock, and delete vehicles</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Vehicles', value: stats.totalVehicles, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Total Stock', value: stats.totalStock, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Out of Stock', value: stats.outOfStock, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            { label: 'Low Stock', value: stats.lowStock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border ${s.bg} p-4`}>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded-lg w-3/4" />
                <div className="h-3 bg-gray-800 rounded-lg w-1/2" />
                <div className="h-3 bg-gray-800 rounded-lg w-full mt-4" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 bg-gray-800 rounded-lg flex-1" />
                  <div className="h-8 bg-gray-800 rounded-lg flex-1" />
                  <div className="h-8 bg-gray-800 rounded-lg flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
          <svg className="w-16 h-16 text-gray-700 mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="text-gray-400 text-lg font-medium">No vehicles yet</p>
          <p className="text-gray-600 text-sm mt-1 mb-6">Click "Add Vehicle" to create your first entry</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Vehicle
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0V6.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.5M7.5 14.25V18" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{vehicle.make} {vehicle.model}</h3>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{vehicle.category}</span>
                    </div>
                  </div>
                  {vehicle.quantity === 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 text-[11px] font-semibold uppercase">Out</span>
                  )}
                </div>

                <div className="space-y-2.5 flex-1 mb-4">
                  <div className="flex items-center justify-between py-2 border-t border-gray-800/60">
                    <span className="text-sm text-gray-400">Price</span>
                    <span className="text-lg font-bold text-white">${vehicle.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-800/60">
                    <span className="text-sm text-gray-400">In Stock</span>
                    {vehicle.quantity === 0 ? (
                      <span className="text-sm font-semibold text-red-400">0 units</span>
                    ) : vehicle.quantity <= 5 ? (
                      <span className="text-sm font-semibold text-amber-400">{vehicle.quantity} units</span>
                    ) : (
                      <span className="text-sm font-semibold text-emerald-400">{vehicle.quantity} units</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-800/60">
                  <button
                    onClick={() => setEditVehicle(vehicle)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => { setRestockVehicle(vehicle); setRestockQty(''); }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Restock
                  </button>
                  <button
                    onClick={() => setDeleteVehicle(vehicle)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <h2 className="text-lg font-bold text-white mb-5">Add New Vehicle</h2>
          <VehicleForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} buttonText="Create Vehicle" />
        </Modal>
      )}

      {editVehicle && (
        <Modal onClose={() => setEditVehicle(null)}>
          <h2 className="text-lg font-bold text-white mb-5">Edit Vehicle</h2>
          <VehicleForm
            initialData={{ make: editVehicle.make, model: editVehicle.model, category: editVehicle.category, price: editVehicle.price, quantity: editVehicle.quantity }}
            onSubmit={handleUpdate}
            onCancel={() => setEditVehicle(null)}
            buttonText="Update Vehicle"
          />
        </Modal>
      )}

      {deleteVehicle && (
        <Modal onClose={() => setDeleteVehicle(null)}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Delete Vehicle</h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{deleteVehicle.make} {deleteVehicle.model}</span>?
              <br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-500 transition-all">
                Delete
              </button>
              <button onClick={() => setDeleteVehicle(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {restockVehicle && (
        <Modal onClose={() => { setRestockVehicle(null); setRestockQty(''); }}>
          <h2 className="text-lg font-bold text-white mb-1">Restock Vehicle</h2>
          <p className="text-gray-400 text-sm mb-5">
            <span className="text-white font-medium">{restockVehicle.make} {restockVehicle.model}</span>
            {' '}&mdash; Current stock: <span className="text-emerald-400 font-medium">{restockVehicle.quantity}</span>
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Quantity to Add</label>
            <input
              type="number"
              min="1"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="Enter quantity"
            />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleRestock} disabled={!restockQty || parseInt(restockQty) < 1 || restockSaving}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 rounded-xl text-sm font-medium hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2">
              {restockSaving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {restockSaving ? 'Restocking...' : 'Restock'}
            </button>
            <button onClick={() => { setRestockVehicle(null); setRestockQty(''); }}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white transition-all">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
