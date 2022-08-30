import { useEffect, useState } from "react"
import { getDemandInfo, applyFor, getFile } from '../../http/api';
import NavigationBar from "../../components/NavigationBar";
import { translatedPjc, translatedRole, sToDays } from '../../utils/translated';
import { Modal, InputNumber, message, Button } from 'antd';
import { useRouter } from 'next/router'

import {
  useAccount, 
  useWaitForTransaction,
} from 'wagmi' 
import { useContracts } from '../../controller/index';

export default function ProjectDetail() {
    const { address, connector, isConnected } = useAccount()
    const { useTaskContractWrite } = useContracts('applyFor')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter()
    let [hash,setHash] = useState('');

    const { data, isError, isLoading } = useWaitForTransaction({
      hash: hash,
    })
    let [detail,detailSet] = useState({})
    let [param,setParam] = useState({count: '', phone: ''});
    let [params,setParams] = useState({})

    const navbar = [
        { label: '找项目', url: '/'},
        { label: '项目详情', url: '#'}
    ]
    
    useEffect(()=>{
        async function init() {
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
        if (!address) {
            alert('请登陆')
            return
        }
        setIsModalVisible(true);
    };

    const onChange = (e,type) => {
      if (type === "phone") {
        param.phone = e
      }else{
        param.count = e
      }
        setParam(param);
    }

    const handleOk = async() => {
        params = {
            demandId: detail.id,
            valuation: param.count,
            address: address
        }
        setParams({...params})
        useTaskContractWrite.write({
          recklesslySetUnpreparedArgs: [ 
            address, 
            Number(params.demandId), 
            params.valuation * 100, 
          ]
        })
      };

      useEffect(() => {
          useTaskContractWrite.isSuccess ?
          writeSuccess()
          :
          ''
      },[useTaskContractWrite.isSuccess])

      useEffect(() => {
        useTaskContractWrite.error !== null ?
          message.error('交易失败')
          :
          ''
      },[useTaskContractWrite.error])

      useEffect(() => {
        if (data !== undefined) {
          console.log('===>',data);
        }
      },[data])

      const writeSuccess = () => {
        params.hash = useTaskContractWrite.data.hash
        hash = params.hash;
        setHash(hash)
        applyFor({proLabel: JSON.stringify(params)})
              .then(res => {
                message.success('报名成功!')
                setTimeout(() => {
                  router.push('/')
                }, 500);
              })
              .catch(err => {
                console.log(err);
              })
        setIsModalVisible(false);
      }


    
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
              <div className="box">
                项目估价: <InputNumber size="large" min="1" onChange={(e) => onChange(e,'count')} />
              </div>
              <div className="box">
                联系方式: <InputNumber size="large" min="1" onChange={(e) => onChange(e,'phone')} />
              </div>
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
                            {/* <p>报名人数  xx</p> */}
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
                        <p>项目描述: {detail.desc} {isLoading}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
