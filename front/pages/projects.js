import { Input, Empty } from 'antd';
import { SearchOutlined, HistoryOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import { getDemand, getSearch } from '../http/api';
import { deform_Skills, deform_ProjectTypes } from '../utils/Deform'

export default function Projects() {
    
    let [search,setSearch] = useState();
    let [projects,setProjects] = useState([]);

    let [selectA,setSelectA] = useState(0); //  临时的
    let [selectB,setSelectB] = useState(0); //  临时的
    const tagsA = ['全部','后端','全栈','区块链','solidity','DeFi','NFT','Design','Smart Contract'] //  临时的
    const tagsB = ['全部','后端','全栈','区块链','solidity','DeFi','NFT','Design','Smart Contract'] //  临时的
    const router = useRouter();


    const onChange = (value) => {
        search = value.target.value;
        setSearch(search);
    }

    const getProjects = async() => {
        await getDemand()
            .then(res => {
                let data = res.data;
                data.map(e => {
                    e.role = deform_Skills(e.role);
                    e.task_type = deform_ProjectTypes(e.task_type);
                })
                projects = data;
                setProjects([...projects]);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const goProject = (id) => {
        router.push({pathname:'/project',search: id})
    }

    const searchData = () => {
        getSearch(search)
        .then(res => {
            let data = res.data;
                data.map(e => {
                    e.role = deform_Skills(e.role);
                    e.task_type = deform_ProjectTypes(e.task_type);
                })
                projects = data;
                setProjects([...projects]);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getProjects()
    },[])

    return <div className="Projects">
        <div className="search">
            <Input placeholder="搜索项目" onChange={onChange} />
            <SearchOutlined className="search-btn" onClick={() => searchData()} />
        </div>
        <div className="tags">
            <div className="tags-list">
                {
                    tagsA.map((e,i) => <div 
                                        key={i} 
                                        className={`tags-li ${selectA === i ? 'tags-li-active':''}`}
                                        onClick={() =>{selectA = i,setSelectA(selectA)}}
                                        >
                        {e}
                    </div>)
                }
            </div>
            <div className="tags-list">
                {
                    tagsB.map((e,i) => <div 
                                        key={i} 
                                        className={`tags-li ${selectB === i ? 'tags-li-active':''}`} 
                                        onClick={() =>{selectB = i,setSelectB(selectB);}}
                                        >
                        {e}
                    </div>)
                }
            </div>
        </div>
        <div className="items">
            {
                projects.map((e,i) => 
                    <div key={i} className="item" onClick={() => goProject(e.id)}>
                        <div className="info">
                            <div className="info-img">
                                
                            </div>
                            <div className="info-detail">
                                <p className="title">{e.title}</p>
                                <div className="tags">
                                    技术要求: {
                                        e.role.map((ele,index) => 
                                            <span key={index}>{ele}</span>
                                        )
                                    }
                                </div>
                                <p className="date">项目周期: {e.period / 60 / 60 / 24}天</p>
                            </div>
                        </div>
                        <div className="price">
                            <p>项目预算: {e.budget}ETH</p>
                            <div className="time">
                                <HistoryOutlined className="time-icon" />
                                3小时前发布
                            </div>
                        </div>
                    </div>
                )
            }
            {
                projects.length === 0 ? 
                    <Empty />
                    :
                    ''
            }
        </div>
    </div>
}