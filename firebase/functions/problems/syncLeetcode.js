require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.syncLeetcodeProblemsHttp = functions.https.onRequest(async (req, res) => {
  try {
    await syncLeetcodeProblemsImpl();
    res.status(200).send('LeetCode problems synced successfully');
  } catch (err) {
    res.status(500).send('Error syncing LeetCode problems: ' + err);
  }
});

async function syncLeetcodeProblemsImpl() {
  console.log('Starting LeetCode sync...');
  
  const leetcodeUrl = process.env.LEETCODE_API_URL;
  const response = await fetch(leetcodeUrl);
  const data = await response.json();

  console.log(`Fetched ${data.stat_status_pairs?.length || 0} problems from LeetCode`);

  const batch = admin.firestore().batch();
  let count = 0;
  
  for (const problem of data.stat_status_pairs) {
    const ref = admin.firestore().collection('problems').doc(problem.stat.question__title_slug);
    batch.set(ref, {
      id: problem.stat.question_id,
      title: problem.stat.question__title,
      slug: problem.stat.question__title_slug,
      difficulty: problem.difficulty.level === 1 ? 'easy' : problem.difficulty.level === 2 ? 'medium' : 'hard',
      acceptanceRate: problem.stat.total_acs / problem.stat.total_submitted,
      isPremium: problem.paid_only,
      lastUpdated: admin.firestore.Timestamp ? admin.firestore.Timestamp.now() : new Date(),
    }, { merge: true });
    count++;
  }
  
  console.log(`Prepared batch with ${count} problems`);
  await batch.commit();
  console.log('Batch committed successfully');
}
