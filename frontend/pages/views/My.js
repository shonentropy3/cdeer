import { useCallback, useEffect, useState } from "react"
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import axios from "axios";

function My(params) {

    const address = '0xa854772db43b52d7b456c2b5a40bd41627b316c2';
    const erc_type = 'erc721';
    const key = 'Ovzh6fBZ';
    let [nftList,setNftList] = useState([])
    
    useEffect(() => {
        async function init() {
            await axios({
                method:'get',
                // url:`https://restapi.nftscan.com/api/v2/account/own/${address}?erc_type= ${erc_type}`,
                url: `https://restapi.nftscan.com/api/v2/account/own/${address}?erc_type=${erc_type}`,
                headers: {'X-API-KEY': key},
            }).then(res => {
                let data = res.data.data
                nftList = data.content;
                setNftList([...nftList])
            })

            nftList.forEach((e,i) => {
                let url = e.image_uri;
                if (url.indexOf('data:image/svg+xml;base64') === 0) {
                    nftList[i].imgType = 'base64';
                    // TODO: 完成imgType赋值, 待完成: 1、img输出. 2、自定义组件nft.js 3、imgType switch输出
                }else if(url.indexOf('QM') === 0 || url.indexOf('ba') === 0){
                    nftList[i].imgType = 'ipfs';
                }else if(url.indexOf('https://') === 0){
                    nftList[i].imgType = 'uri';
                }else if(url.indexOf('ar://') === 0){
                    nftList[i].imgType = 'Arweave';
                }
            })
        }
        init()
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