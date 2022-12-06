import { Input, Empty, Button,Pagination, message } from 'antd';
import { SearchOutlined, HistoryOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi';
import Computing_time from '../components/Computing_time';

// import { getDemand, getFilter, getSearch } from '../http/api/task';
import { deform_Skills } from '../utils/Deform'
import { searchTask } from '../http/_api/public';

export default function Projects() {

    const { address } = useAccount()
    const router = useRouter();

    const _data = require('../data/data.json')
    const role = _data.skills;
    
    let [projects,setProjects] = useState([]);
    let [selectRole,setSelectRole] = useState(null);
    let [title,setTitle] = useState();
    let [pageConfig,setPageConfig] = useState({
        page: 1, pageSize: 10, total: 1
    })
    
    // 跳转
    const goProject = (id) => {
        projects.map(e=>{
            if(e.id === id && e.issuer === address) {
                router.push({pathname:'/issuer/applylist',search:id})
            }
        })
        router.push({pathname:'/project',search: id})
    }

    // 获取Tasklist
    const getTask = () => {
        searchTask({
            ...pageConfig,
            role: selectRole,
            title: title
        })
        .then(res => {
            if (res.code === 0) {
                let data = res.data.list
                data.map(e => {
                    e.role = deform_Skills(e.role);
                })
                projects = data;
                setProjects([...projects]);
                pageConfig.total = res.data.total;
                setPageConfig({...pageConfig});
            }
        })
    }

    const getTaskTitle = (e) => {
        title = e;
        setTitle(title);
    }

    // 防抖
    const { run } = useRequest(getTaskTitle, {
        debounceWait: 300,
        manual: true
    });

    useEffect(() => {
        getTask()
    },[selectRole, title, pageConfig.page])

    return <div className="Projects">
        <div className='banner'>
            <div className='banner-content'>
                <p className='content-title'>Looking for items</p>
                <p className='content-subtitle'>There are skilled developers here</p>
            </div>
        </div>
        <div className='task-content'>
            <div className="search">
                <Input placeholder="搜索项目" onChange={(e)=>run(e.target.value)} />
                {/* <SearchOutlined className="search-btn" onClick={() => searchData()} /> */}
                <div className="tags">
                    <span className='tags-keyword'>Screen</span>
                    <div className="tags-list">
                        {
                            role.map((e,i) => <div 
                                                key={i} 
                                                className={`tags-li ${selectRole === e.value ? 'tags-li-active':''}`}
                                                onClick={() =>{selectRole = e.value,setSelectRole(selectRole)}}
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
                    pageSize={pageConfig.pageSize} 
                    current={pageConfig.page}
                    total={pageConfig.total}
                    onChange={(e) => {pageConfig.page = e, setPageConfig({...pageConfig})}}
                />
            </div>
        </div>
    </div>
}