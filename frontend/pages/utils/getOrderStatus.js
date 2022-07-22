// 有没有创建订单
export const getOrderStatus = async() => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      return account
    } else {
      console.log("No authorized account found");
      
    }
}
// 乙方是否设置阶段


// 甲方确认阶段
