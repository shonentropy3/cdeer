require("@nomiclabs/hardhat-waffle");
// npx hardhat size-contracts
// require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-etherscan");

let dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const mnemonic = process.env.MNEMONIC
const infurakey = process.env.INFURA_API_KEY
const scankey = process.env.ETHERSCAN_API_KEY

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  // {
  //   version: "0.8.15",
  //   settings: {
  //     optimizer: {
  //       enabled: true,
  //       // runs: 1000,
  //     },
  //   },
  // },
  networks: {
    localdev: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      gas: 12000000,
    },
    dev: {
      url: "https://backend.buildbear.io/node/charming-bohr-99d0de",
      accounts: ["42fcbcb9196e00f7e9b7e0cf0fb7cb1d1889b1d4c052fb6dbc2f3ff3a8944d44"],
      chainId: 8478
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${infurakey}`,
      accounts: {
        mnemonic: mnemonic,
      },
      chainId: 3,
    },
    goerli:{
      url: "https://goerli.infura.io/v3/d3fe47cdbf454c9584113d05a918694f",
      accounts: ["0x391aa244dd1808334d3fb3b0998ba951f244104d1725168f36e393ad61f1a88c"],
      chainId: 5,
    },

    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: {
        mnemonic: mnemonic,
      },
      chainId: 80001,
    },
    testbsc: {
      // url: "https://data-seed-prebsc-2-s3.binance.org:8545",
      // url: "https://bsctestapi.terminet.io/rpc",
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      // url: "https://data-seed-prebsc-1-s2.binance.org:8545",
      // url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      accounts: {
        mnemonic: mnemonic,
      },
      chainId: 97,
    }
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: scankey
},
};
