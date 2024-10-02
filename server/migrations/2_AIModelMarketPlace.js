// 2_AIModelMarketPlace.js

const Migrations = artifacts.require("AIModelMarketplace");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
