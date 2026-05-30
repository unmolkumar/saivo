require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");

(async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log("server started at port 3000");
  });
})();
