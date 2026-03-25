import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/comment";
import app from "./server";

const PORT = 3000;

const handleListening = () =>
  console.log(`Server listening on port ${PORT} 🚀`);

app.listen(PORT, handleListening);
