# VoteBlocks DApp

## :grey_question: What is this project about?

VoteBlocks Dapp is a decentralised web 3.0 based online voting system which allow voters to vote securely and anonymously while maintaining privacy and transparency.

## :desktop_computer: Project Framework

* __Frontend__ : React JS
* __Backend/BlockChain__ : Polygon Mumbai Testnet
* __Contract__ : Solidity
* __IPFS__ : Infura
* __Contract Management__ : Truffle

## :electron: Project Features

* Role Based Authorization
* Separate Dashboards for Voter/Admin
* TOTP 2FA with Google Authenticator
* Decentralised file storage using Infura
* Communication with blockchain via Metamask

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
Before running the project, create an infura account and create a ipfs project.Grab the PROJECT_ID Key and API_KEY_SECRET Key.Create a .infuraConfig file in 'clients/src/ipfs' and paste the keys as:
```javascript
export const PROJECT_ID = "your-project-id-key"
export const API_KEY_SECRET = "your-api-secret-key"
```

## :handshake: Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## :old_key: License

MIT License

Copyright (c) [2022] [Ayan Banerjee]

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
