
# Dapp

## 📌 **Overview**
This project implements a **land grab application** where **users can claim any coordinates to their wallet address** deployed on **holesky network**

## 🧱 Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: Next.js, Tailwind
- **Network**: Holesky Testnet

## 🎯 Functionalities

- 📍 **Claim Land**: Users must be at the location (via Geolocation API) to claim a land coordinate.
- 🔄 **Swap Land**: Users can swap one of their owned lands with another user's land.
- 🗑️ **Release Land**: Users can release owned lands at any time.
- ⚙️ **Delete Account**: Deletes user data and releases all claimed lands.

## 📜 **Environment Variables**
Before running the **Hardhat** or **Frontend**, copy `.env.example` to `.env` in both directories:

```sh
cp hardhat/.env.example hardhat/.env
cp frontend/.env.example frontend/.env
```
## 🚀 Deploy & Verify Smart Contracts (Hardhat)

```shell
npx hardhat compile

npx hardhat ignition deploy ignition/modules/{CONTRACT_NAME} --network NETWORK_NAME

npx hardhat verify --network NETWORK_NAME CONTRACT_ADDRESS
```

## 🚀 Run the frontend

```shell
cd frontend

yarn

yarn dev
```

## 🛠️ Improvements
 - Integrate Google Maps to have customized to 9*9 meter land blocks
 - Refactor smart contracts to offload certain functionalities (e.g., getLands) to off-chain services or subgraphs for improved efficiency and scalability.