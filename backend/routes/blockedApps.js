const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../blockedApps.json");

// Ensure the file exists
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// ✅ GET: Fetch all blocked apps
router.get("/", (req, res) => {
  const apps = JSON.parse(fs.readFileSync(filePath));
  res.json(apps);
});

// ✅ POST: Add an app to block list
router.post("/", (req, res) => {
  const { appName } = req.body;
  if (!appName) return res.status(400).json({ message: "App name is required" });

  const apps = JSON.parse(fs.readFileSync(filePath));
  if (!apps.includes(appName)) {
    apps.push(appName);
    fs.writeFileSync(filePath, JSON.stringify(apps, null, 2));
  }

  res.json({ message: "App added to block list", apps });
});

module.exports = router;
