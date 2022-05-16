import seeder from "mongoose-seed";
import config from "../config/index";

const userSeed = require("./userSeed");
const reviewSeed = require("./reviewSeed");

// Data array containing seed data - documents organized by Model
const data = [userSeed, reviewSeed];
seeder.connect(config.TEST_DATABASE_URL, () => {
  // load models
  seeder.loadModels(["./src/models/user.js", "./src/models/review.js"]);
  //   clear database
  seeder.clearModels(["user", "review"], () => {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, (err, done) => {
      if (err) {
        console.log(err);
        return err;
      }
      if (done) {
        console.log("seeding done");
      }
      seeder.disconnect();
    });
  });
});
