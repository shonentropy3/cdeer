import { Input  } from 'antd';
import { SearchOutlined, HistoryOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default function Projects() {
    
    let [search,setSearch] = useState();
    let [selectA,setSelectA] = useState(0); //  临时的
    let [selectB,setSelectB] = useState(0); //  临时的
    const tagsA = ['全部','后端','全栈','区块链','solidity','DeFi','NFT','Design','Smart Contract'] //  临时的
    const tagsB = ['全部','后端','全栈','区块链','solidity','DeFi','NFT','Design','Smart Contract'] //  临时的

    const onChange = (value) => {
        search = value.target.value;
        setSearch(search);
    }

    return <div className="Projects">
        <div className="search">
            <Input placeholder="搜索项目" onChange={onChange} />
            <SearchOutlined className="search-btn"/>
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
                <div className="item">
                    <div className="info">
                        <div className="info-img">
                            
                        </div>
                        <div className="info-detail">
                            <p className="title">XDAO运维+数据系统开发</p>
                            <div className="tags">
                                技术要求: <span>solidity</span> <span>javascript</span>
                            </div>
                            <p className="date">项目周期: 20天</p>
                        </div>
                    </div>
                    <div className="price">
                        <p>项目预算: 5ETH</p>
                        <div className="time">
                            <HistoryOutlined className="time-icon" />
                            3小时前发布
                        </div>
                    </div>
                </div>
        </div>
    </div>
}