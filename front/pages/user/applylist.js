import { useEffect, useState } from "react"


export default function applylist() {
    
    let [taskId,setTaskId] = useState('');

    useEffect(() => {
        taskId = location.search.slice('?')[1];
        setTaskId(taskId);
        console.log(taskId);
    },[])

    return <div className="Applylist">
        
    </div>
}