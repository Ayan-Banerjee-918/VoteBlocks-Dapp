const Voters = artifacts.require("Voters");

module.exports = function(deployer) {
  deployer.deploy(Voters);
};
