import React, { useState } from 'react';

function AddStudentForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone,setPhone] = useState('');
  const [cfHandle, setCfHandle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && cfHandle && phone) {
      onAdd({ name, email, phone, cfHandle });
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-6 shadow mb-8">
      <h2 className="text-lg font-bold mb-4">Add New Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded px-3 py-2 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="w-full border border-slate-300 rounded px-3 py-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Codeforces Handle</label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded px-3 py-2 mt-1"
            value={cfHandle}
            onChange={(e) => setCfHandle(e.target.value)}
            required
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-slate-700">Phone number</label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded px-3 py-2 mt-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" >
            Add Student
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-600 px-4 py-2 rounded border border-slate-300 hover:bg-slate-100"
          > Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudentForm;
