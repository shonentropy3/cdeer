import React from 'react';
import PropTypes from 'prop-types';
 
function SomeComponent(props, context) {
  const web3Context = context.web3;
    console.log('props==>',props);
    console.log('context==>',context);
    // onChangeAccount={nextAddress => console.log(nextAddress)}
    // web3UnavailableScreen={() => <div>You need web3!</div>}
  /**
   * web3Context = {
   *   accounts: {Array<string>} - All accounts
   *   selectedAccount: {string} - Default ETH account address (coinbase)
   *   network: {string} - One of 'MAINNET', 'ROPSTEN', or 'UNKNOWN'
   *   networkId: {string} - The network ID (e.g. '1' for main net)
   * }
   */
 
  return (
    <div>
      Hello Web3
    </div>
  );
}
 
SomeComponent.contextTypes = {
  web3: PropTypes.object
};
 
export default SomeComponent;