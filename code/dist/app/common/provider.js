const { ethers } = require('ethers');
const PROVIDER_URL = process.env.PROVIDER_URL;
let rpcProvider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
module.exports = {
    rpcProvider
};
//# sourceMappingURL=provider.js.map