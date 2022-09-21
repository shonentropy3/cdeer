async function balanceOf(tokenAddr, userAddr) {
    let abi = [
        'function balanceOf(address account) view returns (uint256)',
    ]
    let erc20 = await ethers.getContractAt(abi, tokenAddr);

    let balance = '';
    try {
        balance = await erc20.balanceOf(userAddr);
        balance = balance.toString();
        let bal = ethers.utils.formatUnits(balance)
        console.log('balance:', { userAddr,  bal,  tokenAddr});
    } catch (err) {
        console.log('erc20Balance failed', { tokenAddr, userAddr, balance });

    }
    return balance;
}

async function approve(account, token, spender, amount) {
    let abi = [
        'function approve(address spender, uint256 value) returns (bool)',
    ]
    let erc20 = await ethers.getContractAt(abi, token);

    try {
        let tx = await erc20.connect(account).approve(spender, amount);
        await tx.wait();
    } catch (err) {
        console.log('erc20Approve failed', { token, owner: account.address, spender, amount });
    }
}

async function transfer(owner, tokenAddr, dstAddr, amount) {
    let abi = [
        'function transfer(address dst, uint256 wad) returns (bool)'
    ]

    let erc20 = await ethers.getContractAt(abi, tokenAddr, owner);

    try {
        let tx = await erc20.transfer(dstAddr, amount);
        await tx.wait();
    } catch (err) {
        console.log('transfer failed', { token, owner: owner.address, dstAddr, amount });
    }
}

async function allowance(token, owner, spender) {
    let abi = [
        'function allowance(address owner, address spender) view returns (uint256)',
    ]

    let erc20 = await ethers.getContractAt(abi, token);

    let allow = '';
    try {
        allow = await erc20.allowance(owner, spender);
        allow = allow.toString();
        console.log('erc20Allowance', { allow, owner, spender, token });
    } catch (err) {
        console.log('erc20Allowance failed', { token, owner, spender });
    }

    return allow;
}


async function deposit(owner, tokenAddr, amount) {
    let abi = [
        'function deposit() payable',
    ]

    let bnb = await ethers.getContractAt(abi, tokenAddr, owner);

    try {
        let tx = await bnb.deposit({ value: amount });
        await tx.wait()
    } catch (err) {
        console.log('deposit failed');
    }

}



module.exports = {
    balanceOf,
    transfer,
    approve,
    allowance,
    deposit
}