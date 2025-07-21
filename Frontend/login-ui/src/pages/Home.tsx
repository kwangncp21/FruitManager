import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Fruit {
  name: string;
  amount: number;
  unit: number;
  total: number;
}

const Home: React.FC = () => {

  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const pageSize = 5;
//   const totalPages = Math.ceil(fruits.length / pageSize); //frontend pagination
  const [totalPages, setTotalPages] = useState(1);

  const fetchFruits = async () => {
    try {
    //   const res = await axios.get('http://localhost:3000/api/v1/csv', { withCredentials: true });
      const res = await axios.get(`http://localhost:3000/api/v1/csv?page=${page}&limit=${pageSize}`, { withCredentials: true });
      setFruits(res.data.data); //ข้อมูลเเต่ละหน้า
      setTotalPages(res.data.pagination.totalPages); // ✅ มาจาก backend
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

//   const currentData = fruits.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🍍 Fruit Data</h1>

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
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {fruits.map((fruit, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2">{fruit.name}</td>
              <td className="px-4 py-2">{fruit.amount}</td>
              <td className="px-4 py-2">{fruit.unit}</td>
              <td className="px-4 py-2">{fruit.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FruitTable = () => {
//   const [fruits, setFruits] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(2);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchFruits = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/v1/csv?page=${page}&limit=${limit}`, {
//         withCredentials: true,
//       });
//       setFruits(res.data.data);
//       setTotalPages(res.data.pagination.totalPages);
//     } catch (err) {
//       console.error('Failed to fetch fruits', err);
//     }
//   };

//   useEffect(() => {
//     fetchFruits();
//   }, [page, limit]);

//   const handlePrev = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNext = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   return (
//     <div>
//       <h2>🍍 Fruit Data</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th><th>Amount</th><th>Unit</th><th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {fruits.map((fruit, index) => (
//             <tr key={index}>
//               <td>{fruit.name}</td>
//               <td>{fruit.amount}</td>
//               <td>{fruit.unit}</td>
//               <td>{fruit.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div style={{ marginTop: '10px' }}>
//         <button onClick={handlePrev} disabled={page === 1}>Prev</button>
//         <span style={{ margin: '0 10px' }}>Page {page} / {totalPages}</span>
//         <button onClick={handleNext} disabled={page === totalPages}>Next</button>
//       </div>
//     </div>
//   );
// };

// export default FruitTable;

