# VoteBlocks DApp

![GitHub repo size](https://img.shields.io/github/repo-size/Ayan-Banerjee-918/VoteBlocks-Dapp)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Ayan-Banerjee-918/Voteblocks-dapp?color=%237b26d1)
![GitHub](https://img.shields.io/github/license/Ayan-Banerjee-918/Voteblocks-Dapp?color=orange)
![Website](https://img.shields.io/website?down_color=red&down_message=Offline&up_color=%2300cf30&up_message=Online&url=https%3A%2F%2Fvoteblocks.netlify.app)

__Live Website__ : <https://voteblocks.netlify.app/>

## :grey_question: What is this project about?

VoteBlocks Dapp is a decentralised web 3.0 based online voting system which allow voters to vote securely and anonymously while maintaining privacy and transparency.

## :desktop_computer: Project Framework

* __Frontend__ : React JS
* __BlockChain__ : Polygon Mumbai Testnet
* __Contract/Backend__ : Solidity
* __IPFS__ : Infura
* __Contract Management__ : Truffle

## :electron: Project Features

* Role Based Authorization
* Separate Dashboards for Voter/Admin
* TOTP 2FA with Google Authenticator
* Unique Password 🔑 Generation for addresses
* Unique Setup Key Generator for addresses for connection to Google Authenticator
* QR Code for scanning key directly into Google Authenticator 
* Decentralised file storage using Infura
* Communication with blockchain via Metamask

## :ballot_box_with_check: Admin Login Test Data <br>
* Import account 0x2AAD4FFDefCAB7D7Dd0B8D500a8f70c1A38513e4 into Metamask with private key
```bash
e439ae6593376e149f0421f7ae7b3c777cc1da5e7d47923766f2e0f85030e723
```
* Browse to https://voteblocks.netlify.app/adminApp/adminLogin or localhost:port/adminApp/adminLogin <br> Note : THIS PAGE IS ACCESSIBLE ONLY IF WALLET ADDRESS IS GIVEN ADMIN RIGHTS
* Aadhar ID : 111111111111
* Login Key
```text
d&0at5mh]25cD#Jf{edc8-0adf73W07@eK4df0fd4bF=HW17580d8d.<N05Haob3ix=Ka1v&%a
```
* Google Authenticator Setup Key
```bash
GNLTAN3FJM2GIZRQ
```

## :hammer_and_wrench: Build Setup
* Clone the repository
```git
git clone https://github.com/Ayan-Banerjee-918/VoteBlocks-Dapp
```
* Enter client directory
```bash
cd client
```
* Install dependencies
```npm
npm install
```
* Run Project for development 
```npm
npm run dev
```
* Run Project for production
```npm
npm run build
npm start
```
Additional Information:
* __Contract compilation__ : <br><br>
Use Remix Ethereum IDE or truffle migrate to compile and deploy.
Then copy the contract address and paste in 'client/src/config.js'.

* __Setup Infura__ : <br><br>
Before running the project, create an infura account and create a ipfs project.Grab the PROJECT_ID Key and API_KEY_SECRET Key.<br>Create a .env file in 'clients/' and paste the keys as:
```javascript
VITE_PROJECT_ID="your-project-id-key" //no space before and after =
VITE_API_KEY_SECRET="your-api-secret-key" //no space before and after =
```

## :handshake: Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## :old_key: License

MIT License

Copyright (c) 2022 Ayan Banerjee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
