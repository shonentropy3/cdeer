

export const checkWalletIsConnected = async() => {
    const { ethereum } = window;
  
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      // const account = accounts[0];
      return accounts[0]
    } else {
      console.log("No authorized account found");
      
    }
}