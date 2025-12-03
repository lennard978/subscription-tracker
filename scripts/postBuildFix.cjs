// postBuildFix.js
const fs = require("fs");
const path = require("path");

const distPath = path.join(__dirname, "..", "dist");
const targetFolder = path.join(distPath, "subscription-tracker");

// 1. Create /subscription-tracker folder inside dist
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder);
  console.log("Created folder:", targetFolder);
}

// 2. Move all files & folders inside dist → dist/subscription-tracker
fs.readdirSync(distPath).forEach((item) => {
  if (item === "subscription-tracker") return; // skip our own folder

  const source = path.join(distPath, item);
  const destination = path.join(targetFolder, item);

  fs.renameSync(source, destination);
  console.log(`Moved: ${item} → subscription-tracker/${item}`);
});

console.log("Post-build folder structure fixed!");
