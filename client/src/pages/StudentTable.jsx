import React from 'react';
import { Eye, Mail, Phone, Code, TrendingUp } from 'lucide-react';

function StudentTable({ students, onView }) {
  const getRatingColor = (current, max) => {
    const percentage = (current / (max || 1)) * 100;
    if (percentage >= 95) return 'text-emerald-600 bg-emerald-50';
    if (percentage >= 85) return 'text-blue-600 bg-blue-50';
    if (percentage >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed text-sm text-left border border-slate-200 rounded-xl overflow-hidden">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="w-1/6 px-6 py-3 text-left">Name</th>
            <th className="w-1/6 px-6 py-3 text-left">Email</th>
            <th className="w-1/6 px-6 py-3 text-left">Phone</th>
            <th className="w-1/6 px-6 py-3 text-left">CF Handle</th>
            <th className="w-1/6 px-6 py-3 text-left">Current Rating</th>
            <th className="w-1/6 px-6 py-3 text-left">Max Rating</th>
            <th className="w-1/6 px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {students.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center px-6 py-6 text-slate-500">
                No students found.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                <td className="px-6 py-4 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{student.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{student.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-blue-600">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-slate-400" />
                    <span>{student.cfHandle}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 font-semibold ${getRatingColor(student.currentRating, student.maxRating)}`}>
                  {student.currentRating}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                    <span>{student.maxRating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onView(student._id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
