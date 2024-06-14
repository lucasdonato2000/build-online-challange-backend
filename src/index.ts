import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/UserRoutes";
import contactRoutes from "./routes/ContactRoutes";
import noteRoutes from "./routes/NoteRoutes";
import setupDatabase from "./db/setupDatabase";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", noteRoutes);

app.use(errorHandler);

setupDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
