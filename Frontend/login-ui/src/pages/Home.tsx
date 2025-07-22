import React, { useState, useEffect } from 'react';
import axios from 'axios';

  interface Fruit {
    _id?: string;
    date: string;
    productName: string;
    color: string;
    amount: number;
    unit: number;
    total:number;
  }

const Home: React.FC = () => {

  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFruit, setEditFruit] = useState<Partial<Fruit>>({});

  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  const fetchFruits = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/csv?page=${page}&limit=${pageSize}`, { withCredentials: true });
      console.log('Fetched response:', res.data); // DevTools

      setFruits(
      res.data.data.map((item: any) => ({
        _id: item._id,
        date: item.date? item.date.slice(0, 10) : '',
        productName: item.productName,
        color: item.color,
        amount: item.amount,
        unit: item.unit,
        total: item.amount * item.unit
      }))
    );
      setTotalPages(res.data.pagination.totalPages); // มาจาก backend
    } catch (err) {
      console.error('Failed to fetch fruits', err);
    }
  };

  useEffect(() => {
    fetchFruits();
  }, [page]);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/api/v1/csv/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      fetchFruits(); // รีโหลดข้อมูลหลังอัปโหลด
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/csv/delRecord/${id}`);
      fetchFruits();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (fruit: Fruit) => {
    setEditingId(fruit._id || null);
    setEditFruit({
      date: fruit.date.slice(0, 10), // แปลงเป็น yyyy-MM-dd
      productName: fruit.productName,
      color: fruit.color,
      amount: fruit.amount,
      unit: fruit.unit
    });
  };

  const handleUpdate = async () => {
    try {
      if (!editingId) return;
      console.log('🟡 Data to update:', editFruit);
      const res = await axios.put(`http://localhost:3000/api/v1/csv/updateRecord/${editingId}`, editFruit);
      console.log('✅ Updated result:', res.data);
      setEditingId(null);
      setEditFruit({});
      fetchFruits();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleLogout = async () => {
  try {
    await axios.get('http://localhost:3000/api/v1/auth/logout', { withCredentials: true });
    window.location.href = '/'; // navigate to login
  } catch (err) {
    console.error('Logout failed:', err);
  }
};

return (

    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🍍 Fruit Data</h1>
      <div className="flex justify-end mb-4">
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            Logout
        </button>
    </div>

      <div className="flex items-center gap-4 mb-6">
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Upload CSV
        </button>
      </div>

      <table className="w-full border table-auto">
        <thead className="bg-gray-200">
  <tr>
    <th className="px-4 py-2">Date</th>
    <th className="px-4 py-2">Product Name</th>
    <th className="px-4 py-2">Color</th>
    <th className="px-4 py-2">Amount</th>
    <th className="px-4 py-2">Unit</th>
    <th className="px-4 py-2">Total</th>
    <th className="px-4 py-2 text-right">Actions</th>
  </tr>
</thead>

<tbody>
  {fruits.map((fruit, index) => (
    <tr key={index} className="text-center border-t">
      <td className="px-4 py-2">
        {editingId === fruit._id ? (
          <input
            type="date"
            value={editFruit.date}
            onChange={(e) => setEditFruit({ ...editFruit, date: e.target.value })}
          />
        ) : fruit.date}
      </td>
      <td className="px-4 py-2">
        {editingId === fruit._id ? (
          <input
            value={editFruit.productName}
            onChange={(e) => setEditFruit({ ...editFruit, productName: e.target.value })}
          />
        ) : fruit.productName}
      </td>
      <td className="px-4 py-2">
        {editingId === fruit._id ? (
          <input
            value={editFruit.color}
            onChange={(e) => setEditFruit({ ...editFruit, color: e.target.value })}
          />
        ) : fruit.color}
      </td>
      <td className="px-4 py-2">
        {editingId === fruit._id ? (
          <input
            type="number"
            value={editFruit.amount}
            onChange={(e) => setEditFruit({ ...editFruit, amount: Number(e.target.value) })}
          />
        ) : fruit.amount}
      </td>
      <td className="px-4 py-2">
        {editingId === fruit._id ? (
          <input
            type="number"
            value={editFruit.unit}
            onChange={(e) => setEditFruit({ ...editFruit, unit: Number(e.target.value) })}
          />
        ) : fruit.unit}
      </td>
      <td className="px-4 py-2">
        {editingId === fruit._id
          ? Number(editFruit.amount) * Number(editFruit.unit)
          : fruit.total}
      </td>


      <td className="px-4 py-2 space-x-2">
        {editingId === fruit._id ? (
          <>
            <button onClick={handleUpdate} className="text-green-600">Save</button>
            <button onClick={() => setEditingId(null)} className="text-gray-600">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => handleEdit(fruit)} className="text-blue-600">Edit</button>
            <button onClick={() => handleDelete(fruit._id!)} className="text-red-600">Delete</button>
          </>
        )}
      </td>

    </tr>
  ))}
</tbody>
        
      </table>

      <div className="flex justify-between mt-6">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="self-center">Page {page} / {totalPages}</span>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;