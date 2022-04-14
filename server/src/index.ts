import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection";
import { expenseRoute } from "./routes/expense.route";
import cors from "cors";

dotenv.config();

const HOST = process.env.HOST || "http://localhost";
const PORT = parseInt(process.env.PORT || "5000");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
  cors({
    origin: "*",
    // optionsSuccessStatus: 200,
  })
);

app.use("/", expenseRoute());

app.get("/", (req, res) => {
  return res.json({ message: "/" });
});

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
