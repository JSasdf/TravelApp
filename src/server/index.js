const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8080;
let projectData = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));

console.log(__dirname);

app.get("/", function(req, res) {
  res.sendFile("dist/index.html");
});

// designates what port the app will listen to for incoming requests
app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});

app.post("/add", add);
function add(req, res) {
  projectData["depCity"] = req.body.depCity;
  projectData["arrCity"] = req.body.arrCity;
  projectData["date"] = req.body.date;
  projectData["weather"] = req.body.weather;
  projectData["summary"] = req.body.summary;
  res.send(projectData);
}
