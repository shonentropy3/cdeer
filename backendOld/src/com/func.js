const { ethers } = require('ethers');
const { rpcProvider } = require('./provider');
const abis = require('./abis.json');

async function isAddress(address) {
    return ethers.utils.isAddress(address);
}

async function getNativeCoinBalance(address) {
    let balance = await rpcProvider.getBalance(address);
    return balance;
}

async function getErc20Balance(contractAddr, address) {
    let erc20 = new ethers.Contract(contractAddr, abis['erc20'], rpcProvider);
    let balance = await erc20.balanceOf(address);
    return balance;
}

async function getTransactionReceipt(txid) {
    let receipt;
    try {
        receipt = await rpcProvider.getTransactionReceipt(txid);
    } catch (err) {
        console.error('====getTransactionReceipt====', txid, err);
    }

    if (!receipt) return {};

    receipt['from'] = receipt['from'].toLowerCase();
    receipt['to'] = receipt['to'].toLowerCase();
    receipt['gasUsed'] = receipt['gasUsed'].toString();
    receipt['cumulativeGasUsed'] = receipt['cumulativeGasUsed'].toString();

    return receipt;
    // {
    //     to: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    //     from: '0xbcd6082F938b52ABB7c2298df5367286DcE18636',
    //     contractAddress: null,
    //     transactionIndex: 81,
    //     gasUsed: BigNumber { _hex: '0x5287', _isBigNumber: true },
    //     logsBloom: '0x00000000000000100000000000000000000000000000000000000000000000000000000000000000000000000002000000000000100000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000002000000020000000000001000000000000000000000000000000000000000000000000000000800040000000000000000000000000000000000000000',
    //     blockHash: '0x5f71b14d134f79a161c202ff39f2605d9edc0cd91e5018b3a109d0e9ffdf6737',
    //     transactionHash: '0xb84eb41313c9dc663b55e9135f4975220c78c1491ba00807305889b7aa77632c',
    //     logs: [
    //       {
    //         transactionIndex: 81,
    //         blockNumber: 15467692,
    //         transactionHash: '0xb84eb41313c9dc663b55e9135f4975220c78c1491ba00807305889b7aa77632c',
    //         address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    //         topics: [Array],
    //         data: '0x0000000000000000000000000000000000000000000000005fd8768dee7b1ce5',
    //         logIndex: 253,
    //         blockHash: '0x5f71b14d134f79a161c202ff39f2605d9edc0cd91e5018b3a109d0e9ffdf6737'
    //       }
    //     ],
    //     blockNumber: 15467692,
    //     confirmations: 184,
    //     cumulativeGasUsed: BigNumber { _hex: '0x9f1721', _isBigNumber: true },
    //     status: 1,
    //     type: 0,
    //     byzantium: true
    //   }
}

async function getTransaction(txid) {
    let tx;
    try {
        tx = await rpcProvider.getTransaction(txid);
    } catch (err) {
        console.error('====getTransactionInfo====', txid, err);
    }
    if (!tx) return {};

    tx['from'] = tx['from'].toLowerCase();
    tx['to'] = tx['to'].toLowerCase();
    tx['gasPrice'] = tx['gasPrice'].toString();
    tx['gasLimit'] = tx['gasLimit'].toString();
    tx['value'] = tx['value'].toString();

    return tx;
    // {
    //     hash: '0xb84eb41313c9dc663b55e9135f4975220c78c1491ba00807305889b7aa77632c',
    //     type: 0,
    //     accessList: null,
    //     blockHash: '0x5f71b14d134f79a161c202ff39f2605d9edc0cd91e5018b3a109d0e9ffdf6737',
    //     blockNumber: 15467692,
    //     transactionIndex: 81,
    //     confirmations: 63,
    //     from: '0xbcd6082F938b52ABB7c2298df5367286DcE18636',
    //     gasPrice: BigNumber { _hex: '0x012a05f200', _isBigNumber: true },
    //     gasLimit: BigNumber { _hex: '0xd3ae', _isBigNumber: true },
    //     to: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    //     value: BigNumber { _hex: '0x00', _isBigNumber: true },
    //     nonce: 53,
    //     data: '0xa9059cbb000000000000000000000000840253ca3016899a71d6626fa243cb034444cc980000000000000000000000000000000000000000000000005fd8768dee7b1ce5',
    //     r: '0xf60305e1035f68141a933b2b91f28de88d92a0116aa471448f941269ae956169',
    //     s: '0x5aef076737a6f2bb0dd4cdadb345b17586da72f7cdb6d45cf4c9955ee537a9f7',
    //     v: 147,
    //     creates: null,
    //     chainId: 56,
    //     wait: [Function (anonymous)]
    //   }
}

async function isContract(address) {
    var code = await rpcProvider.getCode(address);
    return code !== '0x';
}


async function getNounce(address) {
    let nonce;
    try {
        nonce = await rpcProvider.getTransactionCount(address);
    } catch (err) {
        console.error('getNounce', err.message);
    }
    return nonce;
}

async function getGasPrice() {
    let gasPrice;
    try {
        gasPrice = await rpcProvider.getGasPrice();
    } catch (err) {
        console.error('getGasPrice', err.message);
    }
    return gasPrice;
}

async function getCurBlock() {
    let num;
    try {
        num = await rpcProvider.getBlockNumber();
    } catch (err) {
        console.error('getCurBlock', err.message);
    }
    return num;
}


module.exports = {
    isAddress,
    getNativeCoinBalance,
    getErc20Balance,
    getTransaction,
    getTransactionReceipt,
    isContract,
    getNounce,
    getGasPrice,
    getCurBlock,
};