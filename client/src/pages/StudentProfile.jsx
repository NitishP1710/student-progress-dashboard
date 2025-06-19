import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.post(`http://localhost:5000/api/students/${id}/sync`)
      .then(() => axios.get(`http://localhost:5000/api/students/${id}/details`))
      .then(res => setStudent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!student) return <div className="p-4">Loading...</div>;

  if (!student.contestHistory?.length && !student.submissionData?.length) {
    return <div className="p-4">No Codeforces data available for this student.</div>;
  }

  const ratingData = (student.contestHistory || []).map(c => ({
    name: c.contestName,
    rating: c.newRating
  }));

  const problemBuckets = {};
  (student.submissionData || []).forEach(s => {
    if (s.verdict === 'OK') {
      const rating = s.problem?.rating || 0;
      const bucket = Math.floor(rating / 200) * 200;
      problemBuckets[bucket] = (problemBuckets[bucket] || 0) + 1;
    }
  });

  const bucketChart = Object.entries(problemBuckets).map(([key, val]) => ({
    name: key,
    count: val
  }));

  const heatmapValues = Object.entries(student.submissionHeatmap || {}).map(([date, count]) => ({ date, count }));
  const today = new Date().toISOString().substring(0, 10);
  const totalSolved = student.totalProblems || 0;
  const todaySolved = student.todayProblems || 0;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {student.name} ({student.cfHandle})
      </h2>

      <div className="mb-4 text-sm text-slate-700">
        <p><strong>Total Solved:</strong> {totalSolved}</p>
        <p><strong>Solved Today:</strong> {todaySolved}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold">Rating Progress</h3>
        <LineChart width={600} height={300} data={ratingData}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rating" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold">Problem Solving by Rating Bucket</h3>
        <BarChart width={600} height={300} data={bucketChart}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold">Submission Heatmap</h3>
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={heatmapValues}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            if (value.count < 2) return 'color-scale-1';
            if (value.count < 4) return 'color-scale-2';
            if (value.count < 6) return 'color-scale-3';
            return 'color-scale-4';
          }}
        />
      </div>
    </div>
  );
}

export default StudentProfile;
