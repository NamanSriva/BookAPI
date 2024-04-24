import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/db.js";


config({
    path: "./config/config.env"
});



//MongoDB Database Connection
connectDatabase();


// server start
app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT " + process.env.PORT);
});