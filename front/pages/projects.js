import { Input, Empty, Button,Pagination } from 'antd';
import { SearchOutlined, HistoryOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import { getDemand, getFilter, getSearch } from '../http/api/task';
import { deform_Skills } from '../utils/Deform'

export default function Projects() {

    const _data = require('../data/data.json')
    
    let [search,setSearch] = useState();
    let [projects,setProjects] = useState([]);

    let [selectA,setSelectA] = useState(null); //  临时的
    let [tagsA,setTagsA] = useState([]);
    // const tagsA = ['全部','后端','全栈','区块链','solidity','DeFi','NFT','Design','Smart Contract'] //  临时的
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
                    // e.task_type = deform_ProjectTypes(e.task_type);
                })
                projects = data;
                setProjects([...projects]);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const goProject = (id) => {
        router.push({pathname:'/Project',search: id})
    }

    // const searchData = () => {
    //     getSearch(search)
    //     .then(res => {
    //         let data = res.data;
    //             data.map(e => {
    //                 e.role = deform_Skills(e.role);
    //                 // e.task_type = deform_ProjectTypes(e.task_type);
    //             })
    //             projects = data;
    //             setProjects([...projects]);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // }

    const init = () => {
        tagsA = _data.skills;
        setTagsA([...tagsA]);
    }

    useEffect(() => {
        getProjects()
        init()
    },[])

    useEffect(() => {
        let obj = {
          role: selectA,
        }
        obj = JSON.stringify(obj)
        getFilter({obj: obj})
        .then(res => {
            let data = res.data;
            data.map(e => {
                e.role = deform_Skills(e.role);
                // e.task_type = deform_ProjectTypes(e.task_type);
            })
            projects = data;
            setProjects([...projects]);
        })
    },[selectA])

    return <div className="Projects">
        <div className='banner'>
            <div className='banner-content'>
                <p className='content-title'>Looking for items</p>
                <p className='content-subtitle'>There are skilled developers here</p>
            </div>
        </div>
        <div className='task-content'>
            <div className="search">
                <Input placeholder="搜索项目" onChange={onChange} />
                {/* <SearchOutlined className="search-btn" onClick={() => searchData()} /> */}
                <div className="tags">
                    <span className='tags-keyword'>Screen</span>
                    <div className="tags-list">
                        {
                            tagsA.map((e,i) => <div 
                                                key={i} 
                                                className={`tags-li ${selectA === e.value ? 'tags-li-active':''}`}
                                                onClick={() =>{selectA = e.value,setSelectA(selectA)}}
                                                >
                                {e.name}
                            </div>)
                        }
                    </div>
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
                                    <span className="time">
                                        <HistoryOutlined className="time-icon" />
                                        Issued 10 hours ago
                                    </span>
                                    <span className="date">cycle: &nbsp;{e.period / 60 / 60 / 24}天</span>
                                    <div className="tags">
                                        <p className='tags-title'>Recruitment type: </p>
                                        {
                                            e.role.map((ele,index) => 
                                                <span className='tags-li' key={index}>{ele}</span>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="price">
                                    <p>
                                        <span className='price-cost'>Cost:</span> 
                                        <span className='price-num'>{e.budget/1000000000000000000}ETH</span>
                                    </p>
                                </div>
                                <div className='item-btn'>
                                    <Button className='btn'>Learn more</Button>
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
                <Pagination className='item-pagination' defaultCurrent={1} total={50} />
            </div>
        </div>
    </div>
}