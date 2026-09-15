const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.json({ message: "LEKH API is running" });
});

app.listen(PORT, () => {
    console.log(`LEKH server running on http://localhost:${PORT}`);
});