import { useCallback, useEffect } from "react"
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

function My(params) {

    const { activate, accounts } = useWeb3React();
    useEffect(() => {
        console.log(accounts);
        // console.log(connector);
        // return
        // connectWallet(connectors.walletConnect).then()
    },[])

    const personalBar = () => {
        return <div className="personalBar">
            <div className="detail">
                <div className="detail_l round"></div>
                <div className="detail_r">
                    <p className="name">Ben</p>
                    <p className="type">developer</p>
                </div>
            </div>
            <ul className="list">
                <li>
                    <p>3</p>
                    开发
                </li>
                <li>
                    <p>3</p>
                    发布
                </li>
            </ul>
        </div>
    }    

    const listBar = () => {
        return <div className='listBar'>
            <ul className='list'>
                <li>基本信息</li>
                <li>开发记录</li>
                <li>发布记录</li>
                <li>NFT</li>
            </ul>
        </div>
    }


    return (
        <div className="My">
            <div className="my_l">
                {personalBar()}
                {listBar()}
            </div>
            <div className="my_r">
                <div className="label">

                </div>
                <div className="address">

                </div>
                <div className="completed">

                </div>
                <div className="nft">
                    
                </div>
            </div>
        </div>
    )
}
export default My