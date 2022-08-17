import { Button } from "antd"
import { useState, useEffect } from "react"
import { getMyNftlist } from "../../http/api"



export default function NftPanel() {
    
    const erc_type = ['erc721','erc1155']
    const chains = [
        {title: 'Ethereum', value: 'restapi'},
        {title: 'BNB Chain', value: 'bnbapi'},
        {title: 'Polygon', value: 'polygonapi'},
        {title: 'Arbitrum', value: 'arbitrumapi'},
    ]
    let [erc,setErc] = useState('erc721')
    let [chain,setChain] = useState('restapi')

    const request = () => {
        let obj = {
            chain: 'polygonapi',
            account: '0xd2AEc55186F9f713128d48087f0e2EF5F453ca79'
        }
        getMyNftlist({params: obj})
        .then(res => {
            console.log(res);
        })
    }

    useEffect(() => {
        request()
    },[])


    return <div className="NftPanel">
        {/* <div className="top">
            <div className="box">
                {
                    erc_type.map((e,i) => <Button key={i} onClick={() => {erc=e,setErc(erc),request()}} type={erc === e ? 'primary':''}>{e}</Button>)
                }  
            </div>
            
            <div className="box">
                {
                    chains.map((e,i) => <Button key={i} onClick={() => {chain=e.value,setChain(chain),request()}} type={chain === e.value ? 'primary':''}>{e.title}</Button>) 
                }
            </div>

        </div> */}
        
    </div>
}