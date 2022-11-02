import { Input, Empty, Button,Pagination, message } from 'antd';
import { SearchOutlined, HistoryOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDebounce } from 'ahooks'
import { useRouter } from 'next/router'
import Computing_time from '../components/Computing_time';

import { getDemand, getFilter, getSearch } from '../http/api/task';
import { deform_Skills } from '../utils/Deform'

export default function Projects() {

    const _data = require('../data/data.json')
    
    let [search,setSearch] = useState();
    const debounceSearch = useDebounce(search,{wait:500})
    let [projects,setProjects] = useState([]);

    let [selectA,setSelectA] = useState(null); //  临时的
    let [tagsA,setTagsA] = useState([]);

    // 每页所显示的task
    let [pageProjects,setPageProjects] = useState([])
    // 当前页数
    let [pageNum,setPageNum] = useState(1)
    // 当前所获取的任务总数
    let [taskLength,setTaskLength] = useState()
    // 定时器开关
    let [timer,setTimer] = useState(null)

    // const tagsA = ['全部','后端','全栈','区块链','solidity','DeFi','NFT','Design','Smart Contract'] //  临时的
    const router = useRouter();

    const getScreen = () => {
        if(selectA) {
            screenTask()
        }else{
            getProjects()
        }
    }

    const getProjects = async () => {
        await getDemand({page:pageNum,search:search})
            .then(res => {
                let data = res.data;
                data.map(e => {
                    e.role = deform_Skills(e.role);
                })
                projects = data;
                taskLength = res.length
                setProjects([...projects]);
                setTaskLength(taskLength)
            })
            .catch(err => {
                console.log(err);
                message.error("获取任务列表失败")
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
                    // e.task_type = deform_ProjectTypes(e.task_type);
                })
                projects = data;
                setProjects([...projects]);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const init = () => {
        tagsA = _data.skills;
        setTagsA([...tagsA]);
    }

    // 分页
    const pageChange = (value) => {
        let page
        if (!value) {
            page = 1
        }else{
            page = value
        }
        pageNum = page
        setPageNum(pageNum)
    }

    // 标签筛选
    const screenTask = () => {
        let obj = {
            role: selectA,
            page: pageNum,
            search: search
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
            taskLength = res.length
            setProjects([...projects]);
            setTaskLength(taskLength)
        })
    }

    useEffect(() => {
        getProjects()
        init()
    },[])
    
    // useEffect(()=>{
    //     pageChange()
    // },[projects])

    useEffect(() => {
        screenTask()
    },[selectA])


    useEffect(() => {
        if (selectA) {
            screenTask()
        }else{
            getProjects()
        }
    },[pageNum])

    useEffect(()=>{
        console.log(search);
        getScreen()
    },[debounceSearch])

    return <div className="Projects">
        <div className='banner'>
            <div className='banner-content'>
                <p className='content-title'>Looking for items</p>
                <p className='content-subtitle'>There are skilled developers here</p>
            </div>
        </div>
        <div className='task-content'>
            <div className="search">
                <Input placeholder="搜索项目" onChange={(e)=>setSearch(e.target.value)} />
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
                                    <div className='time'>
                                        <div className='time-about'>
                                            <img className='time-icon' src='/clock.jpg' />
                                            <Computing_time create_time={e.create_time} />
                                        </div>
                                        <span className="date">cycle: &nbsp;{e.period / 60 / 60 / 24}天</span>
                                    </div>
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
                <Pagination 
                    className='item-pagination' 
                    pageSize={5} 
                    current={pageNum}
                    total={taskLength} 
                    onChange={pageChange}
                />
            </div>
        </div>
    </div>
}