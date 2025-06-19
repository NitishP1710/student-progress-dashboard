const cron = require('node-cron');
const Student = require('../models/Students');
const { fetchAndUpdateStudentData } = require('../utils/codeforces');
function startCronJob() {
  const schedule = process.env.CRON_SCHEDULE || '0 2 * * *'; 
  cron.schedule(schedule, async () => {
    console.log('Running scheduled Codeforces sync...');
    const students = await Student.find();
    for (const student of students) {
      try {
        await fetchAndUpdateStudentData(student);
      } catch (err) {
        console.error(`Failed to sync ${student.cfHandle}`, err.message);
      }
    }
  });
}
module.exports = startCronJob;