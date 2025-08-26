# 📊 How to Populate Problems Data

Your LeetCode Problem Recommender is live but needs problems data! Here are 3 ways to populate your database:

## 🚀 Option 1: Automated Script (Recommended)

### **Step 1: Install Firebase Admin**
```bash
cd C:\Users\Rushikesh\Desktop\leetcode\frontend
npm install firebase-admin
```

### **Step 2: Get Service Account Key**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Click **Service Accounts** tab
5. Click **Generate new private key**
6. Save as `firebase-service-account-key.json` in your frontend folder

### **Step 3: Update Script Configuration**
Edit `populate-problems.js`:
```javascript
const serviceAccountPath = './firebase-service-account-key.json'; 
const databaseURL = 'https://your-project-id-default-rtdb.firebaseio.com/';
```

### **Step 4: Run the Script**
```bash
node populate-problems.js
```

✅ **This will add 20+ sample problems instantly!**

---

## 🖱️ Option 2: Firebase Console (Manual)

### **Step 1: Open Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database**

### **Step 2: Create Problems Collection**
1. Click **Start collection**
2. Collection ID: `problems`
3. Click **Next**

### **Step 3: Add Problems Manually**
For each problem, create a document with:

**Document ID**: `two-sum` (use the slug)

**Fields**:
```
id: 1 (number)
title: "Two Sum" (string)
slug: "two-sum" (string)
difficulty: "easy" (string)
acceptanceRate: 0.51 (number)
isPremium: false (boolean)
zerotracRating: 1200 (number)
lastUpdated: [current timestamp]
contestSlug: null
problemIndex: null
```

**Sample Problems to Add**:
1. Two Sum (easy, rating: 1200)
2. Add Two Numbers (medium, rating: 1400)
3. Longest Substring Without Repeating Characters (medium, rating: 1500)
4. Valid Parentheses (easy, rating: 1100)
5. Merge Two Sorted Lists (easy, rating: 1000)

---

## 📄 Option 3: JSON Import

### **Step 1: Use Firebase CLI Import**
```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login
firebase login

# Import from JSON file
firebase firestore:import --collection-ids problems problems-data.json
```

### **Step 2: Using the Sample Data File**
I've created `problems-data.json` with 20 sample problems. You can:

1. **Modify the file**: Add more problems or edit existing ones
2. **Import it**: Use the Firebase CLI command above
3. **Expand it**: Add hundreds more problems as needed

---

## 🎯 Recommended Approach

**For quick testing**: Use **Option 1** (Automated Script)
- ✅ Fast setup (5 minutes)
- ✅ 20+ problems instantly
- ✅ Properly formatted data
- ✅ Easy to run again with more data

**For production**: Combine approaches
- 🚀 Start with Option 1 for initial data
- 📝 Use Option 2 to manually add specific problems
- 📄 Use Option 3 for bulk imports

---

## 🗂️ Problem Data Structure

Each problem should have these fields:

```javascript
{
  id: 1,                    // LeetCode problem ID
  title: "Two Sum",         // Problem title
  slug: "two-sum",         // URL slug (unique)
  difficulty: "easy",       // easy, medium, or hard
  acceptanceRate: 0.51,     // Decimal (0.51 = 51%)
  isPremium: false,         // Always false (we filter these)
  zerotracRating: 1200,     // Difficulty rating for filtering
  lastUpdated: [timestamp], // When last updated
  contestSlug: null,        // Contest info (optional)
  problemIndex: null        // Contest problem index (optional)
}
```

---

## 🚨 Important Notes

### **Firestore Rules**
Make sure your `firestore.rules` allows reading problems:
```javascript
match /problems/{problemId} {
  allow read: if request.auth != null; // Authenticated users can read
  allow write: if false; // Only manual updates
}
```

### **Indexing**
The app creates these indexes automatically:
- `zerotracRating` (for filtering by difficulty)
- `difficulty + zerotracRating` (for combined filters)
- `isPremium + zerotracRating` (for premium filtering)

### **Free Tier Limits**
- ✅ **Reads**: 50,000/day (plenty for your app)
- ✅ **Writes**: 20,000/day (more than enough for manual updates)
- ✅ **Storage**: 1GB (thousands of problems fit easily)

---

## 🎉 After Populating Data

1. **Refresh your app** - Problems should appear immediately
2. **Test filtering** - Try different difficulty levels and ratings
3. **Check curated sections** - Should show recommended problems
4. **Test search** - Make sure all features work

Your LeetCode Problem Recommender will now be fully functional! 🚀

---

## 🛠️ Expanding Your Database

To add more problems later:

1. **Use the script** - Add problems to the array and re-run
2. **Import from API** - Fetch from LeetCode's public data
3. **Manual addition** - Add specific problems via Firebase Console
4. **Bulk import** - Use JSON files for large datasets

Need help? Check the Firebase Console logs or browser developer tools for any errors.