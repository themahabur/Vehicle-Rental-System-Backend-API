import dotenv from "dotenv";
import app from "./app";
import { initDB } from "./config/database";
import config from "./config";



const PORT = config.port || 5000;


const startServer = async () => {
  await initDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
