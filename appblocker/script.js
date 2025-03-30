const { exec } = require("child_process");
const axios = require("axios");

// Function to fetch blocked apps from backend
const getBlockedApps = async () => {
  try {
    const res = await axios.get("http://localhost:5000/blocked-apps");
    return res.data;
  } catch (error) {
    console.error("Error fetching blocked apps:", error);
    return [];
  }
};

// Check and block apps every 5 seconds
setInterval(async () => {
  const blockedApps = await getBlockedApps();
  
  exec("tasklist", (err, stdout, stderr) => {
    if (err) return;
    
    blockedApps.forEach((app) => {
      if (stdout.toLowerCase().includes(app.toLowerCase())) {
        exec(`taskkill /IM ${app} /F`, (killErr) => {
          if (!killErr) console.log(`Blocked: ${app}`);
        });
      }
    });
  });
}, 5000);

