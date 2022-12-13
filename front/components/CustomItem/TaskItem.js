import { Button, Empty } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function TaskItem(params) {
    
    const { taskList, select } = params;
    const router = useRouter();

    const print = () => {
        switch (select) {
            case 'tasks':
                return taskList.map((e,i) => 
                    <div className="item" key={i}>
                        <div className="li" onClick={() => router.push(`/applylist?task_id=${e.task_id}`)}>
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
                        <Button>报名开关</Button>
                        <Button>删除需求</Button>
                    </div>
                )
            case 'apply':
                return taskList.map((e,i) => 
                    <div className="item" key={i}>
                        <div className="li">
                            <div className="li-info">
                                <p className="title">{e.title}</p>
                                <p className="role">Recruitment type: {e.role.map((ele,index) => <span key={index}>{ele}</span> )}</p>
                                <div className="detail">
                                    <p>Cycle: {e.period / 60 / 60 / 24}天 <span>&nbsp;</span></p>
                                    <p>Cost: <span>{e.budget}{e.currency}</span></p>
                                </div>
                            </div>
                        </div>
                        <Button>修改报名</Button>
                        <Button>取消报名</Button>
                    </div>
                )
            default:
                break;
        }
    }

    useEffect(() => {
        console.log(select);
    },[select])

    return (
        taskList.length > 0 ?
            print()
            :
            <Empty />
    )
}