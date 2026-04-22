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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Items</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          {isAdding ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNew} className="bg-gray-50 p-4 rounded mb-4 space-y-3 border border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <input required name="name" value={newForm.name} onChange={handleNewChange} placeholder="Item Name" className="border p-2 rounded" />
            <input required type="number" name="price" value={newForm.price} onChange={handleNewChange} placeholder="Price ($)" className="border p-2 rounded" />
            <input required name="category" value={newForm.category} onChange={handleNewChange} placeholder="Category" className="border p-2 rounded" />
            <input name="image" value={newForm.image} onChange={handleNewChange} placeholder="Image URL" className="border p-2 rounded" />
          </div>
          <div className="flex items-center space-x-2 border p-2 rounded bg-white">
            <input type="checkbox" name="isAvailable" checked={newForm.isAvailable} onChange={handleNewChange} id="newAvail" />
            <label htmlFor="newAvail">Available</label>
          </div>
          <input name="description" value={newForm.description} onChange={handleNewChange} placeholder="Description" className="border p-2 rounded w-full" />
          <button type="submit" className="btn-primary w-full transition">
            Save New Item
          </button>
        </form>

      )}

      <div className="space-y-3">
        {menuItems.map(item => (
          <div key={item._id} className="border border-gray-200 rounded p-3 flex justify-between items-center hover:bg-gray-50 transition">
            {editingId === item._id ? (
              <div className="flex-1 grid grid-cols-2 gap-2 mr-4">
                <input name="name" value={editForm.name} onChange={handleEditChange} className="border p-1 rounded text-sm" />
                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="border p-1 rounded text-sm" />
                <input name="category" value={editForm.category} onChange={handleEditChange} className="border p-1 rounded text-sm" />
                <input name="image" value={editForm.image} onChange={handleEditChange} placeholder="Image URL" className="border p-1 rounded text-sm" />
                <div className="flex items-center space-x-2 col-span-2">
                  <input type="checkbox" name="isAvailable" checked={editForm.isAvailable} onChange={handleEditChange} />
                  <span className="text-sm">Available</span>
                </div>
                <input name="description" value={editForm.description} onChange={handleEditChange} className="border p-1 rounded text-sm col-span-2" />
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-4 mr-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-green-600 font-medium">${item.price}</span>
                    {!item.isAvailable && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Unavailable</span>}
                  </div>
                  <p className="text-sm text-gray-500">{item.category} • {item.description}</p>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 flex-shrink-0">
              {editingId === item._id ? (
                <>
                  <button onClick={handleSaveEdit} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
        {menuItems.length === 0 && !loading && (
          <div className="text-center py-6 text-gray-500 border border-dashed rounded bg-gray-50">
            No items in menu yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManager;
