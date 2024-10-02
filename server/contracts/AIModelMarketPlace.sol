// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
  struct Model {
    string name;
    string description;
    uint256 price;
    address payable creator;
    uint8 totalRating;
    uint256 ratingCount;
  }

  mapping(uint256 => Model) public models;
  mapping(address => uint256) public userFunds;
  mapping(address => uint256[]) public userPurchasedModels;
  uint256 public modelCount;

  // Event to signal when a model is listed
  event ModelListed(uint256 modelId, string name, address creator);
  event ModelPurchased(uint256 modelId, address buyer);
  event ModelRated(uint256 modelId, uint8 rating, address rater);
  event FundsWithdrawn(address owner, uint256 amount);
  event BalanceUpdated(address user, uint256 newBalance);
  event BalanceClaimed(address user, uint256 amount);

  // List a new model
  function listModel(string memory name, string memory description, uint256 price) public {
    require(bytes(name).length > 0, "The model name is empty");
    require(bytes(description).length > 0, "The model name is empty");

    models[modelCount] = Model(name, description, price, payable(msg.sender), 0, 0);

    emit ModelListed(modelCount, name, msg.sender);
    modelCount++;
  }

  // Purchase a model
  function purchaseModel(uint256 modelId) public payable {
    Model storage model = models[modelId];

//    require(model.creator != msg.sender, "The model's creator cannot buy its own model");

    (bool success,) = model.creator.call{value: model.price}("");

    require(success, "Incorrect payment amount");

    userFunds[model.creator] += model.price;

    userPurchasedModels[msg.sender].push(modelId);

    emit ModelPurchased(modelId, msg.sender);
  }

  // Rate a purchased model
  function rateModel(uint256 modelId, uint8 rating) public {
    Model storage model = models[modelId];

    bool hasPurchased = false;

    for (uint256 i = 0; i < userPurchasedModels[msg.sender].length; i++) {
      if (userPurchasedModels[msg.sender][i] == modelId) {
        hasPurchased = true;
        break;
      }
    }

    require(msg.sender != model.creator && hasPurchased, "A model cannot be rated by its creator or people who didn't purchase it.");
    require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

    model.totalRating += rating;
    model.ratingCount++;

    emit ModelRated(modelId, rating, msg.sender);
  }

  // Withdraw accumulated funds for the creator
  function withdrawFunds() public {
    uint256 amount = userFunds[msg.sender];
    require(amount > 0, "No funds to withdraw");

    (bool success,) = payable(msg.sender).call{value: amount}("");

    require(success, "Transaction error");

    userFunds[msg.sender] = 0;

    emit FundsWithdrawn(msg.sender, amount);
  }

  // Get model details
  function getModelDetails(uint256 modelId) public view returns (uint256, string memory, string memory, uint256, address, uint8) {
    Model storage model = models[modelId];
    uint8 averageRating = uint8(model.ratingCount > 0 ? model.totalRating / model.ratingCount : 0);
    return (modelId, model.name, model.description, model.price, model.creator, averageRating);
  }

  // New function to retrieve user's purchased models
  function getUserPurchasedModels() public view returns (uint256[] memory) {
    return userPurchasedModels[msg.sender];
  }
}