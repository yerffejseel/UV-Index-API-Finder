import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const URL = "https://api.openuv.io/api/v1/uv";
const config = {
    headers: { 
        'x-access-token': "openuv-3i9h12zrlyc1ndlg-io",
        'Content-Type': 'application/json'
    },
  };

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    const lat = req.body.lat;
    const lng = req.body.lng;
    const alt = req.body.alt;
    try {
        const response = await axios.get(`${URL}?lat=${lat}&lng=${lng}&alt=${alt}&dt=`, config);
        const uv = response.data.result.uv;
        if (uv < 3) {
            res.render("index.ejs", {message: `UV Index is ${uv}. No need for sunscreen.`});
        } else {
            res.render("index.ejs", {message: `UV Index is ${uv}. Sunscreen is recommended.`});
        }
        
    } catch (error) {
        res.render("index.ejs", {message: "Invalid latitude or longitude."});
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});