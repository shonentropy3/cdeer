import { useEffect, useState } from "react";



export default function SkillsCard(params) {
    
    const { stree } = params;
    let [selectItem,setSelectItem] = useState();
    let [tree,setTree] = useState([]);

    const checkItem = (e) => {
        setSelectItem(e.en);
        if (e.children) {
            tree = e.children;
            setTree([...tree])
        }
    }

    useEffect(() => {
        if (stree) {
            tree = stree;
            setTree([...tree]);
        }
    },[stree])

    return <div className="skillsCard">
        <h1 className="checkItem">{selectItem}</h1>
        {
            tree.map(e => 
            
                <div className="skill-item" key={e.id} onClick={() => checkItem(e)}>
                    {e.en}
                </div>
            )
        }
    </div>
}