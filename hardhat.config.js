require("@nomiclabs/hardhat-waffle");



const fs = require('fs');
const mnemonic = fs.readFileSync(".env").toString().trim();
const infurakey='9aa3d95b3bc440fa88ea12eaa4456161';

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
  networks: {
    dev: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
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
  }
};
