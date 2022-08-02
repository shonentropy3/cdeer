import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
// import { abi } from "../../../deployments/abi/";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
export const injected = new InjectedConnector();
import orderAddr from '../../contracts/deployments/Order.json'
import order from '../../../deployments/abi/Order.json'

// import { injected } from "../../test/Connectors"

export default function test() {

  const [hasMetamask, setHasMetamask] = useState(false);
useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
      connect();
    }
  },[]);

  // web3-react 查看相关信息
const {
    active,
    activate,
    chainId,
    account,
    deactivate,
    library,
    library:provider
  } = useWeb3React();


async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected)
        .then(res => {
          console.log('res==>',res);
        })
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    }
  }
async function execute() {
  console.log(account);
  return
  // web3-react 查看相关信息
  console.log('activate==>',activate);
  console.log('library==>',library);
  console.log('deactivate==>',deactivate);
  console.log('chainId==>',chainId);
  console.log('account==>',account);
  console.log('active==>',active);
  console.log('provider==>',provider.getSigner());

  return
    if (active) {
      const signer = provider.getSigner();
      const orderContract = new ethers.Contract(orderAddr.address, order.abi, signer);
      await orderContract.applyOrderIds('3', '0x70997970c51812dc3a010c7d01b50e0d17dc79c8')
      .then(res => {
        console.log('res==>',res.toString());
      })
      } else {
        console.log("Ethereum object does not exist");
      }
  }
return (
    <div>
      {/* <MetaMaskCard /> */}

      {hasMetamask ? (
        active ? (
          "Connected! "
        ) : (
          <button onClick={() => connect()}>Connect</button>
        )
      ) : (
        "Please install metamask"
      )}
        {active ? <button onClick={() => execute()}>Execute</button> : ""}
    </div>
  );
}
