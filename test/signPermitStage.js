
async function signPermitStage(
  chainId,
  contractAddress,
  worker,
  orderId,
  amounts,
  periods,
  nonce,
  deadline,
) {
  const domain = {
    name: "DetaskOrder",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  const types = {
    PermitStage: [{ name: "orderId", type: "uint256" },
    { name: "amounts", type: "uint256[]" },
    { name: "periods", type: "uint256[]" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
  };

  const sig = await worker._signTypedData(domain, types, {
    orderId: orderId,
    amounts: amounts,
    periods: periods,
    nonce: nonce,
    deadline: deadline,
  });

  return sig
}

module.exports = {
  signPermitStage,
}