
export function Sysmbol(params) {
    const chainName = process.env.NEXT_PUBLIC_DEVELOPMENT_CHAIN;
    const dUSDT = require(`../../deployments/${chainName}/dUSDT.json`).address;
    const DeOrder = require(`../../deployments/${chainName}/DeOrder.json`).address;

    return {dUSDT, DeOrder}
}