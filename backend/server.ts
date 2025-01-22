import express from "express";
import cors from "cors";
import multer from "multer";
import CSVtoJson from "convert-csv-to-json";

const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });
const loadSingleFile = upload.single("file");

let userData: Array<Record<string, string>> = [];

const app = express();
app.use(cors());

app.post("/api/files", loadSingleFile, async (req, res) => {
  // 1. Extract file from request
  const { file } = req.body;
  // 2. Validate that have the file
  if (!file) {
    res.status(400).json({ message: "Not send the file" });
    return;
  }
  // 3. Validate the mime type (csv)
  if (file.mimetype !== "text/csv") {
    res.status(400).json({ message: "File must be csv" });
    return;
  }

  let json: Array<Record<string, string>> = [];
  // 4. Transform the file (buffer) to string
  try {
    const rawCSV = Buffer.from(file.buffer).toString("utf8");
    console.log(rawCSV);
    // 5. Transform the string to JSON
    json = CSVtoJson.csvStringToJson(rawCSV);
    console.log(json);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error parsing the file" });
    return;
  }
  // 6. Save the JSON to db (or memory)
  userData = json;
  // 7. Return status 200 with the message and JSON
  res.status(200).json({ data: json, message: "File loaded succefull" });
});

app.get("/api/users", async (req, res) => {
  // 1. Extract the query parameter q
  const { q } = req.query;
  // 2. Validate the parameter
  if (!q) {
    res.status(400).json({ message: "Not filter param" });
    return;
  }

  const search = q?.toString().toLowerCase();
  console.log(search);

  // 3. Filter the data from the bd (or memory) with the query parameter
  const dataFiltered = userData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLowerCase().includes(search),
    );
  });
  // 4. Return status 200 with the filtered data
  res.status(200).json({ data: [dataFiltered] });
});

app.listen(port, () => {
  console.log("\u{1F497} \u{1F525} \u{1F680}Server running in port ", port);
});
