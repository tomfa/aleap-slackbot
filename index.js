require("dotenv").config();
const app = require("./app");
require("./events");
require("./commands");

(async () => {
  await app.start(process.env.PORT);
  console.log(`⚡️ Bolt app is listening at localhost:${process.env.PORT}`);
})();
