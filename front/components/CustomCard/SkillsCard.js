import { useEffect, useState } from "react";



export default function SkillsCard(params) {
    
    const { stree,value } = params;
    let [selectItem,setSelectItem] = useState([]);
    let [tree,setTree] = useState([]);

    const checkItem = (e) => {
        selectItem[0] = e.en;
        setSelectItem([...selectItem]);
        value.push(e.index);
        console.log(e.index);
        if (e.children) {
            tree = e.children;
            setTree([...tree])
        }
    }

    const removeSelectItem = () => {

    }

    useEffect(() => {
        if (stree) {
            tree = stree;
            setTree([...tree]);
        }
    },[stree])

    return <div className="skillsCard">
        {
            selectItem.map((e,i) => 
                <h1 key={i} className="checkItem" onClick={() => removeSelectItem()}>{e}</h1>
            )
        }
        {
            tree.map(e => 
            
                <div className="skill-item" key={e.id} onClick={() => checkItem(e)}>
                    {e.en}
                </div>
            )
        }
    </div>
}