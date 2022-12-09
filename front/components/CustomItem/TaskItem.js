import { Button, Empty } from "antd";
import Link from "next/link";

export default function TaskItem(params) {
    
    const { taskList } = params;

    return (
        taskList.length > 0 ?
            taskList.map((e,i) => 
                <Link key={i} href={{pathname: '/issuer/applylist', search: e.id}}>
                    <div className="item">
                        <div className="li">
                            <div className="li-info">
                                <p className="title">{e.title}</p>
                                <p className="role">Recruitment type: {e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                <div className="detail">
                                    <p>Cycle: {e.period / 60 / 60 / 24}天 <span>&nbsp;</span></p>
                                    <p>Cost: <span>{e.budget}{e.currency}</span></p>
                                </div>
                            </div>
                            {/* TODO: 修改Task ==> resolution */}
                            {/* <Button onClick={() => }>修改</Button> */}
                            <div className="li-num">
                                <p>{e.apply_count}</p>
                                <p>Number of applicants</p>
                            </div>
                        </div>
                        <Button>Edit this item</Button>
                    </div>
                </Link>
            )
            :
            <Empty />
    )
}