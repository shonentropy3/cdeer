import { ethers } from "ethers";
import { Sysmbol } from "./Sysmbol";


export function Currency(token, value) {
    let newValue;
    switch (token) {
        case Sysmbol().dUSDT:
            newValue = value * Math.pow(10,6);
            break;
    
        default:
            newValue = ethers.utils.parseEther(`${value}`);
            break;
    }
    return newValue
}

export function ConvertTokenAddress(tokenAddress) {
    let token;
    switch (tokenAddress) {
        case Sysmbol().dUSDT:
            token = "dUSDT";
            break;
    
        default:
            token = "ETH";
            break;
    }
    return token
}