import { useCallback, useEffect, useState } from "react"
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import axios from "axios";
import NftPanel from "../../components/My/NftPanel";

function My(params) {

    let [item,setItem] = useState('nft')
    



    const print = () => {
        switch (item) {
            case 'nft':
                return  <NftPanel></NftPanel>
            case 'develop_records':
                return  <h1>develop_records</h1>
            case 'publish_records':
                return  <h1>publish_records</h1>
        }
    }


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
                <li onClick={() => {setItem('nft')}}>NFT</li>
                <li onClick={() => {setItem('develop_records')}}>开发记录</li>
                <li onClick={() => {setItem('publish_records')}}>发布记录</li>
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
                {print()}
            </div>
        </div>
    )
}
export default My