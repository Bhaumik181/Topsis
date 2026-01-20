const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// Ensure folders exist
["uploads", "results"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// --------------------
// POST: Calculate TOPSIS
// --------------------
app.post("/calculate", upload.single("file"), (req, res) => {
  const { weights, impacts } = req.body;
  const inputFile = req.file.path;

  const fileName = `result_${Date.now()}.csv`;      // only filename
  const resultFilePath = path.join("results", fileName);

  const python = spawn("python", [
    "../python/topsis.py",
    inputFile,
    weights,
    impacts,
    resultFilePath,
  ]);

  python.stdout.on("data", (data) => console.log(data.toString()));
  python.stderr.on("data", (data) => console.error(data.toString()));

  python.on("close", (code) => {
    if (code === 0) {
      res.json({
        success: true,
        file: fileName, // send only filename
      });
    } else {
      res.json({
        success: false,
        message: "TOPSIS execution failed",
      });
    }
  });
});

// --------------------
// GET: Download result
// --------------------
app.get("/download/:file", (req, res) => {
  const filePath = path.join(__dirname, "results", req.params.file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

// --------------------
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
