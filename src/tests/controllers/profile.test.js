import chai from "chai";
import chaiHttp from "chai-http";
import server from "../../app";
import { user } from "./user-sign-in-test-data";
import profile from "./profile-data";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Update user profile", () => {
  let userToken;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data;
        done();
      });
  });
  it("should update a user profile successfully", (done) => {
    chai
      .request(server)
      .patch("/api/v1/users/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(profile)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Profile updated Successfully.");
        done();
      });
  });
  it("should only Update profile names with a strings", (done) => {
    chai
      .request(server)
      .patch("/api/v1/users/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send({ firstName: 86767, lastName: 787878 })
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
});
