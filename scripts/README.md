# 🔧 Scripts Documentation

This directory contains utility scripts for maintaining and updating the LeetCode problems database.

## 📁 Files

### `fetch-all-problems.js`
The main script for fetching all LeetCode problems from their official API.

**Features:**
- Fetches all 3,662+ problems from LeetCode's GraphQL API
- Includes authentic tags, difficulty levels, and acceptance rates
- Estimates zerotrac ratings based on difficulty and acceptance rate
- Handles rate limiting and API errors gracefully
- Includes fallback to Alpha LeetCode API
- Outputs comprehensive statistics

**Usage:**
```bash
cd scripts
npm install
node fetch-all-problems.js
```

**Output:**
- Updates `../app/src/data/problems.json` with latest problems
- Displays statistics (Easy/Medium/Hard counts, tags, etc.)
- Shows progress during fetching process

### `package.json`
Dependencies for the scripts:
- No external dependencies required (uses Node.js built-ins)
- Lightweight and fast execution

## 🔄 Updating the Database

To get the latest LeetCode problems:

1. **Navigate to scripts directory:**
   ```bash
   cd scripts
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Run the fetcher:**
   ```bash
   node fetch-all-problems.js
   ```

4. **Verify the update:**
   The script will show statistics like:
   ```
   📊 Statistics:
      Easy: 892
      Medium: 1907  
      Hard: 863
      Premium: 730
      Free: 2932
      Unique Tags: 72
   ```

## 🛡️ Error Handling

The script includes robust error handling:

- **Rate Limiting**: Includes delays between API requests
- **Network Errors**: Automatic retry with fallback API
- **Invalid Responses**: Graceful error messages and troubleshooting tips
- **File System**: Creates directories if they don't exist

## 🔧 Configuration

The script can be customized by modifying these variables:

```javascript
// Batch size for API requests
const limit = 100;

// Delay between requests (milliseconds)  
const delay = 1000;

// Rating estimation parameters
const baseRatings = {
  'Easy': 1000,
  'Medium': 1500, 
  'Hard': 2000
};
```

## 📊 Output Format

The generated `problems.json` follows this structure:

```json
[
  {
    "id": 1,
    "title": "Two Sum",
    "slug": "two-sum", 
    "difficulty": "easy",
    "acceptanceRate": 0.5618,
    "isPremium": false,
    "zerotracRating": 969,
    "tags": ["Array", "Hash Table"],
    "contestSlug": null,
    "problemIndex": null
  }
]
```

## 🔄 Automation

For automated updates, you can run the script on a schedule:

**Windows Task Scheduler:**
```cmd
cd C:\path\to\leetcode\scripts
node fetch-all-problems.js
```

**Linux/Mac Cron:**
```bash
0 0 * * 0 cd /path/to/leetcode/scripts && node fetch-all-problems.js
```

This will update the problems database weekly with any new LeetCode problems.