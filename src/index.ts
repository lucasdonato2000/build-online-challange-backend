import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { authRoutes, userRoutes, contactRoutes, noteRoutes } from "./routes";
import setupDatabase from "./db/setupDatabase";
import errorHandler from "./middleware/errorHandler";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../images")));
app.use("/api", authRoutes.router);
app.use("/api", userRoutes.router);
app.use("/api", contactRoutes.router);
app.use("/api", noteRoutes.router);

app.use(errorHandler);

if (require.main === module) {
  setupDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}

export default app;
