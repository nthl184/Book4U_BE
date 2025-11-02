import "dotenv/config";
import "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Book4U API running at http://localhost:${PORT}`));
