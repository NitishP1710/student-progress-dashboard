import React, { useEffect, useState } from 'react';
import StudentTable from './StudentTable';
import axios from 'axios';
import { Users, Download, Plus, Eye, Mail, Phone, Code, TrendingUp, Search } from 'lucide-react';
import AddStudentForm from './AddStudentForm';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/students');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cfHandle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Handle', 'Current Rating', 'Max Rating'];
    const rows = students.map(s => [s.name, s.email, s.phone, s.cfHandle, s.currentRating, s.maxRating]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_progress.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddStudent = async (newStudent) => {
    try {
      const res = await axios.post('http://localhost:5000/api/students', newStudent);
      const updated = await axios.post(`http://localhost:5000/api/students/${res.data._id}/sync`);
      setStudents(prev => [...prev, updated.data]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  const handleViewStudent = (studentId) => {
    window.location.href = `/student/${studentId}`;
  };

  const getRatingColor = (current, max) => {
    const percentage = (current / (max || 1)) * 100;
    if (percentage >= 95) return 'text-emerald-600 bg-emerald-50';
    if (percentage >= 85) return 'text-blue-600 bg-blue-50';
    if (percentage >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Student Progress Dashboard</h1>
                <p className="text-slate-600">Track and manage student coding performance</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{students.length}</p>
              <p className="text-sm text-slate-600">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={downloadCSV}
                className="inline-flex items-center px-4 py-2.5 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 shadow"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {showForm && <AddStudentForm onAdd={handleAddStudent} onCancel={() => setShowForm(false)} />}

        <StudentTable students={filteredStudents} onView={handleViewStudent} />
      </div>
    </div>
  );
}

export default StudentList;
