// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {
    mapping(string => address) public landToOwner;
    mapping(address => uint256) public landBalanceOf;
    mapping(address => string[]) private userLands;

    event LandClaimed(address indexed user, string w3wName);
    event LandReleased(address indexed user, string w3wName);
    event LandSwapped(address indexed user1, address indexed user2, string w3wName1, string w3wName2);
    event UserDeleted(address indexed user);

    function claimLand(string calldata w3wName) external {
        require(landToOwner[w3wName] == address(0), "Land already claimed");

        landToOwner[w3wName] = msg.sender;
        landBalanceOf[msg.sender]++;
        userLands[msg.sender].push(w3wName);

        emit LandClaimed(msg.sender, w3wName);
    }

    function releaseLand(string calldata w3wName) external {
        require(landToOwner[w3wName] == msg.sender, "You do not own this land");

        _removeLandFromUser(msg.sender, w3wName);

        delete landToOwner[w3wName];
        landBalanceOf[msg.sender]--;

        emit LandReleased(msg.sender, w3wName);
    }

    function swapLand(string calldata yourW3W, string calldata theirW3W) external {
        address yourAddress = msg.sender;
        address theirAddress = landToOwner[theirW3W];

        require(landToOwner[yourW3W] == yourAddress, "You don't own the land you're offering");
        require(theirAddress != address(0), "Other land is unclaimed");

        _removeLandFromUser(yourAddress, yourW3W);
        _removeLandFromUser(theirAddress, theirW3W);

        landToOwner[yourW3W] = theirAddress;
        landToOwner[theirW3W] = yourAddress;

        userLands[yourAddress].push(theirW3W);
        userLands[theirAddress].push(yourW3W);

        emit LandSwapped(yourAddress, theirAddress, yourW3W, theirW3W);
    }

    function deleteUser(address user) external {
        require(msg.sender == user, "Only user can delete themselves");

        string[] storage lands = userLands[user];

        for (uint256 i = lands.length; i > 0; i--) {
            string memory name = lands[i - 1];

            delete landToOwner[name];
            landBalanceOf[user]--;

            emit LandReleased(user, name);
        }

        delete userLands[user];

        emit UserDeleted(user);
    }

    function getLandsOf(address user) external view returns (string[] memory) {
        return userLands[user];
    }

    function getLandOwner(string calldata w3wName) external view returns (address) {
        return landToOwner[w3wName];
    }

    function _removeLandFromUser(address user, string memory w3wName) internal {
        string[] storage lands = userLands[user];
        uint256 len = lands.length;

        for (uint256 i = 0; i < len; i++) {
            if (keccak256(bytes(lands[i])) == keccak256(bytes(w3wName))) {
                lands[i] = lands[len - 1];
                lands.pop();
                return;
            }
        }

        revert("Land not found in user's list");
    }
}
