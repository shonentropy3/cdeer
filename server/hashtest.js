const rpcProvider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
async function main() {
    const log = await rpcProvider.waitForTransaction('0xf137a6ff05c115fa607a4251eb6ad5d7063c076bf69415715207be5ac892b5e1')
    console.log(log);
}
