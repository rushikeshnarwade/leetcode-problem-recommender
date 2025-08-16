require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.syncZerotracRatingsHttp = functions.https.onRequest(async (req, res) => {
  try {
    await syncZerotracRatingsImpl();
    res.status(200).send('Zerotrac ratings synced successfully');
  } catch (err) {
    res.status(500).send('Error syncing Zerotrac ratings: ' + err);
  }
});

async function syncZerotracRatingsImpl() {
  const zerotracUrl = process.env.ZEROTRAC_API_URL;
  const response = await fetch(zerotracUrl);
  const data = await response.json();

  const batch = admin.firestore().batch();
  for (const problem of data) {
    if (!problem.TitleSlug || typeof problem.TitleSlug !== 'string' || problem.TitleSlug.trim() === '') continue;
    const ref = admin.firestore().collection('problems').doc(problem.TitleSlug);
    batch.set(ref, {
      id: problem.ID,
      zerotracRating: problem.Rating,
      title: problem.Title,
      slug: problem.TitleSlug,
      contestSlug: problem.ContestSlug,
      problemIndex: problem.ProblemIndex,
      contestID_en: problem.ContestID_en,
      contestID_zh: problem.ContestID_zh,
      lastUpdated: admin.firestore.Timestamp ? admin.firestore.Timestamp.now() : new Date(),
    }, { merge: true });
  }
  await batch.commit();
}
