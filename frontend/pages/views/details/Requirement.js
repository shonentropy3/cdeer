import { useEffect, useState } from "react"
import { getDemandInfo, applyFor, getFile } from '../../../http/api';
import NavigationBar from "../../../components/NavigationBar";
import { translatedPjc, translatedRole, sToDays } from '../../../utils/translated';
import { ApplyProject } from '../../../controller/task';
import { Modal, InputNumber, message, Button } from 'antd';
import { checkWalletIsConnected } from '../../../utils/checkWalletIsConnected';
import { useRouter } from 'next/router'

import task from '../../../../deployments/abi/Task.json'
import taskAddr from '../../../contracts/deployments/Task.json'
import { ethers, logger } from 'ethers'
import { useSelector } from "react-redux";


export default function ProjectDetail() {

    const web3_react = useSelector(state => state.web3_react.value)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter()
    let [detail,detailSet] = useState({})
    let [count,setCount] = useState(null);

    const navbar = [
        { label: '找项目', url: '/'},
        { label: '项目详情', url: '#'}
    ]
    
    useEffect(()=>{
        
        async function init(params) {
            // 获取项目详情
            let oid = location.search
            oid = oid.replace('?','')
            
            await getDemandInfo({id: oid})
            .then(res=>{
                let data = res.data[0]
                data.role = translatedRole(data.role)
                data.task_type = translatedPjc(data.task_type)
                data.period = sToDays(data.period)
                detail = data
                detailSet({...detail})
            })
            .catch(err=>{
                console.log(err);
            })
            
        }
        init()
    },[])

    const showModal = () => {
        if (!web3_react.isActive) {
            alert('请登陆')
            return
        }
        setIsModalVisible(true);
    };

    const onChange = (e) => {
        count = e;
        setCount(count);
    }

    const handleOk = async() => {
        let obj = {
            demandId: detail.id,
            valuation: count,
            address: web3_react.accounts[0]
        }
        obj = JSON.stringify(obj)
        let tradeStatus = false

        await ApplyProject(obj)
        .then(res => {
            if (res) {
                if (res.code) {
                  tradeStatus = false
                  message.error('交易失败!');
                }else{
                  tradeStatus = true
                  obj = JSON.parse(obj)
                  obj.hash = res
                  obj = JSON.stringify(obj)
                }
            }
        })
        .catch(err => {
            console.log('err==>',err);
        })
  
        if (tradeStatus) {
            applyFor({proLabel: obj})
              .then(res => {
                message.success('报名成功!')
                router.push('/')
              })
              .catch(err => {
                console.log(err);
              })
        }
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const getBlob = (url,cb) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
          if (xhr.status === 200) {
            cb(xhr.response);
          }
        }
        xhr.send();
      }

      const courseDownload = (url, filename) => {
        getBlob(url, function(blob) {
          saveAs(blob, filename);
        })
      }

      const saveAs = (blob, filename) => {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
      }

    return(
        <>
            <Modal title="报名项目" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                项目估价: <InputNumber size="large" min="1" onChange={onChange} />
            </Modal>
            <div className="pjc_detail">
                <NavigationBar data={navbar} />

                <div className='container'>
                    <div className='top'>
                        <div>
                            <h1>{detail.title}</h1>
                            <p>No.{detail.id}</p>
                        </div>
                        <div>
                            <p>招募角色: {detail.role}</p>
                        </div>
                            <button onClick={()=>showModal()}>参加项目</button>
                        <div>
                            <p>金额 ${detail.budget}</p>
                            <p>类型  {detail.demand_type}</p>
                            <p>周期  {detail.period}</p>
                            <p>报名人数  xx</p>
                        </div>
                    </div>
                    <div className='content'>
                        {
                            detail.attachment !== '' ? 
                            <>
                                项目附件: {detail.suffix}
                                <Button type="primary" onClick={() => courseDownload("http://ipfs.learnblockchain.cn/" + detail.attachment, detail.suffix)}>download</Button>
                            </>
                            :
                            ''
                        }
                        <p>项目描述: {detail.desc}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
