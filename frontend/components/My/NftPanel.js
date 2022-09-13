import { Button } from "antd"
import { useState, useEffect } from "react"
import { getMyNftlist } from "../../http/api"
import { getDate } from "../../utils/getDate"



export default function NftPanel() {
    
    const erc_type = ['erc721','erc1155']
    const chains = [
        {title: 'Ethereum', value: 'restapi'},
        {title: 'BNB Chain', value: 'bnbapi'},
        {title: 'Polygon', value: 'polygonapi'},
        {title: 'Arbitrum', value: 'arbitrumapi'},
    ]
    let [nftList,setNftList] = useState([])

    const request = () => {
        let obj = {
            chain: 'polygonapi',
            account: '0x0a35Bc89BF340716Bc1098Df27A7f2BbDB8c9e57'
        }
        getMyNftlist({params: obj})
        .then(res => {
            nftList = res;
            parseImg(res)
        })
    }

    const parseImg = (arr) => {
        arr.map((e,i) => {
            let url = e.image_uri;
            if (url.indexOf('Qm') === 0 || url.indexOf('ba') === 0) {
                e.image_uri = "https://dweb.link/ipfs/"+url
            }
            if (url.indexOf('data:image/svg+xml;base64') === 0) {
                e.image_uri = url
            }
            if(url.indexOf('https://') === 0){
                e.image_uri = url
            }
            if(url.indexOf('ar://') === 0){
                e.image_uri = url
            }
            e.latest_trade_timestamp = getDate(e.latest_trade_timestamp)
        })
        setNftList([...nftList])
    }

    useEffect(() => {
        request()
    },[])


    return <div className="NftPanel">
        {
            nftList.map((e,i) => 
            <div key={i} className="card">
                <img src={e.image_uri} alt="" />
                <div className="desc">
                    <p>{e.name}</p>
                    <p>{e.latest_trade_timestamp}</p>
                </div>
            </div> )
        }

    </div>
}