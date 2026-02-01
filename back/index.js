import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import healthRoutes from "./routes/health.js";
import pasteRoutes from "./routes/paste.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// app.use(cors());

app.use(
    cors({
        origin: [
            "https://aganitha-paste-bin-assessemnt.vercel.app",
            "http://localhost:5173",
        ],
    })
);

app.use(express.json());

app.use("/home", (req, res) => {
    res.send("home page paste bin")
});

app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);

mongoose.connect(process.env.MONGO_URI, {
  dbName: "pastebin_public" // 👈 your NEW database name
})
.then(() => console.log("MongoDB ✅ connected"))
.catch(err => console.error("Mongo ❌ error ", err));


const port = process.env.PORT || 9500;
app.listen(port, () => console.log(`Server running at port http://localhost:${port}`));
