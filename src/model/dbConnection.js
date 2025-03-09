const mongoose = require("mongoose");
const config = require("../utils/config");
mongoose
  // @ts-ignore
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log(process.env.NODE_ENV);
    console.log("✅ Santou Pro database connected successfully ✨✨");
  })
  .catch((error) => {
    console.log(config.MONGODB_URI);
    console.log("Santou Pro database is not connected❌", error);
  });
