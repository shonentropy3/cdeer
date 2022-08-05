
import ConnectMetaMask from '../redux/ConnectMetaMask';
import ConnectWalletConnect from '../redux/ConnectWalletConnect';

export default function Card(props) {
    
    const { cancel } = props
    return <>
        <div className="title">Welcome to Code-Market</div>
            <div className='strong'>Sign-in to get started</div>
            
            <ConnectMetaMask className="li" cancel={cancel}></ConnectMetaMask>

            <ConnectWalletConnect className="li" cancel={cancel}></ConnectWalletConnect>

            {/* <Button className="li" onClick={() => {
                // activate(connectors.coinbaseWallet);
                // handleCancel();
            }}>coinbaseWallet</Button> */}
    </>
}