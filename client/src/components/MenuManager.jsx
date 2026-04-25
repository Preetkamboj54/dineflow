import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MenuManager = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newForm, setNewForm] = useState({ name: '', description: '', price: '', category: '', image: '', isAvailable: true });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  const fetchMenu = async () => {
    try {
      const res = await api.get(`/api/restaurants/${restaurantId}/menu`);
      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ ...item });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/restaurants/${restaurantId}/menu/${editingId}`, editForm);
      setEditingId(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert('Failed to update menu item');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/api/restaurants/${restaurantId}/menu/${itemId}`);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert('Failed to delete menu item');
    }
  };

  const handleNewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/restaurants/${restaurantId}/menu`, newForm);
      setNewForm({ name: '', description: '', price: '', category: '', image: '', isAvailable: true });
      setIsAdding(false);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert('Failed to add new item');
    }
  };

  if (loading) return <div className="text-gray-500">Loading menu...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-xl font-black tracking-tight text-gray-900">Menu Catalog</h3>
          <p className="text-xs text-[var(--text-muted)] font-medium">{menuItems.length} items available</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-primary/10 ${
            isAdding ? 'bg-gray-100 text-gray-700' : 'btn-primary'
          }`}
        >
          {isAdding ? 'Cancel' : '+ New Item'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNew} className="card glass p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="text-lg font-black mb-6 tracking-tight">Add New Dish</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label>Dish Name</label>
              <input required name="name" value={newForm.name} onChange={handleNewChange} placeholder="e.g. Butter Chicken" />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input required type="number" name="price" value={newForm.price} onChange={handleNewChange} placeholder="e.g. 450" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input required name="category" value={newForm.category} onChange={handleNewChange} placeholder="e.g. Main Course" />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input name="image" value={newForm.image} onChange={handleNewChange} placeholder="https://images.unsplash.com/..." />
            </div>
          </div>
          
          <div className="form-group mt-6">
            <label>Description</label>
            <textarea name="description" value={newForm.description} onChange={handleNewChange} placeholder="Briefly describe the dish..." className="w-full border p-3 rounded-xl min-h-[100px]" />
          </div>

          <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <input type="checkbox" name="isAvailable" checked={newForm.isAvailable} onChange={handleNewChange} id="newAvail" className="w-5 h-5 rounded text-primary border-gray-300" />
            <label htmlFor="newAvail" className="text-sm font-bold text-gray-700 cursor-pointer">Mark as Available for Customers</label>
          </div>

          <button type="submit" className="btn-primary w-full mt-8 py-4 text-lg">
            Create Menu Item
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {menuItems.map(item => (
          <div key={item._id} className={`group card glass p-5 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 ${!item.isAvailable && 'opacity-60 grayscale-[0.5]'}`}>
            {editingId === item._id ? (
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="name" value={editForm.name} onChange={handleEditChange} className="border p-2 rounded-lg text-sm w-full" placeholder="Name" />
                  <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="border p-2 rounded-lg text-sm w-full" placeholder="Price" />
                  <input name="category" value={editForm.category} onChange={handleEditChange} className="border p-2 rounded-lg text-sm w-full" placeholder="Category" />
                </div>
                <input name="image" value={editForm.image} onChange={handleEditChange} placeholder="Image URL" className="border p-2 rounded-lg text-sm w-full" />
                <textarea name="description" value={editForm.description} onChange={handleEditChange} className="border p-2 rounded-lg text-sm w-full" placeholder="Description" />
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isAvailable" checked={editForm.isAvailable} onChange={handleEditChange} className="w-4 h-4 rounded text-primary" />
                  <span className="text-sm font-bold text-gray-700">Available</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-6 w-full">
                <div className="relative flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md" />
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                      <span className="text-[8px] font-black uppercase tracking-tighter text-white bg-red-500 px-1.5 py-0.5 rounded">Sold Out</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h4 className="font-black text-lg text-gray-900 truncate">{item.name}</h4>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-indigo-100">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-1 mb-2 font-medium">{item.description}</p>
                  <div className="text-xl font-black text-[var(--primary)]">₹{item.price}</div>
                </div>
              </div>
            )}
            
            <div className="flex md:flex-col gap-2 w-full md:w-auto">
              {editingId === item._id ? (
                <>
                  <button onClick={handleSaveEdit} className="btn-primary flex-1 py-2 text-sm">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditClick(item)} className="p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-gray-100 flex items-center justify-center gap-2 font-bold text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Item
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100 flex items-center justify-center gap-2 font-bold text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {menuItems.length === 0 && !loading && (
          <div className="text-center py-20 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl">
            <div className="text-4xl mb-4">🍱</div>
            <p className="text-[var(--text-muted)] font-bold">Your menu is empty.</p>
            <p className="text-xs text-[var(--text-muted)] mb-6">Start by adding your first delicious dish!</p>
            <button onClick={() => setIsAdding(true)} className="btn-primary px-8 py-3">Add Your First Item</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManager;
