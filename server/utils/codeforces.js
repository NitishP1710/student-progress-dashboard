const axios = require('axios');
const dayjs = require('dayjs');
const { sendReminderEmail } = require('./email');

async function fetchAndUpdateStudentData(student) {
  const handle = student.cfHandle;

  const [info, rating, submissionsRes] = await Promise.all([
    axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
    axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
    axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`)
  ]);

  const submissions = submissionsRes.data.result;
  student.currentRating = info.data.result[0].rating || 0;
  student.maxRating = info.data.result[0].maxRating || 0;
  student.contestHistory = rating.data.result;
  student.submissionData = submissions.map(s => ({
    verdict: s.verdict,
    problem: s.problem,
    creationTimeSeconds: s.creationTimeSeconds,
  }));
  student.lastSyncedAt = new Date();
  const heatmap = {};
  const solvedSet = new Set();
  const today = new Date().toISOString().substring(0, 10);
  for (let sub of submissions) {
    if (sub.verdict === 'OK') {
      const date = new Date(sub.creationTimeSeconds * 1000).toISOString().substring(0, 10);
      const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
      heatmap[date] = (heatmap[date] || 0) + 1;
      solvedSet.add(problemKey);
    }
  }

  student.submissionHeatmap = new Map(Object.entries(heatmap));
  student.totalProblems = solvedSet.size;
  student.todayProblems = heatmap[today] || 0;
  const recentSubmissions = submissions.filter(s =>
    dayjs.unix(s.creationTimeSeconds).isAfter(dayjs().subtract(7, 'day'))
  );
  if (recentSubmissions.length === 0 && student.reminderEmailEnabled) {
    await sendReminderEmail(student);
    student.reminderCount += 1;
  }

  await student.save();
}
module.exports = { fetchAndUpdateStudentData };
