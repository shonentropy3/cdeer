import { message, Popover } from "antd";
import { useEffect, useState } from "react";


export default function SkillsCard(params) {
    
    const { stree, value ,setValue } = params;
    let [selectItem,setSelectItem] = useState([]);
    let [tree1,setTree1] = useState([]);
    let [tree2,setTree2] = useState([]);
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
      setOpen(newOpen);
    };

    const changeTree1 = (e) => {
        checkItem(e)
        if (e.children) {
            tree1 = e.children;
        }else{
            tree1 = [];
        }
        setTree1([...tree1]);
        setTree2([...[]]);
    }

    const changeTree2 = (e) => {
        checkItem(e)
        if (e.children) {
            tree2 = e.children;
        }else{
            tree2 = [];
        }
        setTree2([...tree2]);
    }

    const checkItem = (e) => {
        // max显示
        if (selectItem.length === 4) {
            message.warning('最多可选4个')
            return
        }
        e.checked = e.checked ? false : true;
        let flag = true;
        selectItem.map((ele,index) => {
            if (ele.id === e.id) {
                selectItem.splice(index,1);
                flag = false;
            }
        })
        if (flag) {
            selectItem.push({
                en: e.en,
                zh: e.zh,
                id: e.id,
                index: e.index
            });
            setSelectItem([...selectItem]);
        }
    }

    const removeSelectItem = (e) => {
        selectItem.map((ele,index) => {
            if (ele.id === e.id) {
                selectItem.splice(index,1)
            }
        })
        tree2.map(ele => {
            if (ele.id === e.id) {
                ele.checked = !ele.checked
            }
        })
        tree1.map(ele => {
            if (ele.id === e.id) {
                ele.checked = !ele.checked
            }
        })
        stree.map(ele => {
            if (ele.id === e.id) {
                ele.checked = !ele.checked
            }
        })

        setSelectItem([...selectItem]);
    }

    useEffect(() => {
        let obj = JSON.stringify(selectItem);
        value.list = JSON.parse(obj);
        setValue({...value});
    },[selectItem])

    const panel = <div className="tree">
        <ul>
            {
                stree.map(e => 
                    <li 
                        key={e.id}
                        onClick={()=>changeTree1(e)}
                        className={e.checked ? 'active':''}
                    >{e.en}</li>
                )
            }
        </ul>
        <ul>
            {
                tree1.map(e => 
                    <li 
                        key={e.id}
                        className={e.checked ? 'active':''}
                        onClick={()=>changeTree2(e)}
                    >{e.en}</li>
                )
            }
        </ul>
        <ul>
            {
                tree2.map(e => 
                    <li 
                        key={e.id}
                        className={e.checked ? 'active':''}
                        onClick={()=>checkItem(e)}
                    >{e.en}</li>
                )
            }
        </ul>
    </div>

    return <div className="skillsCard">

        <Popover
            overlayClassName="Tree"
            placement="bottomLeft"
            content={panel}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            >
            <div className="inner">
                {
                    selectItem.map(e => 
                        <p key={e.id} className="checkItem" onClick={() => removeSelectItem(e)}>{e.en}</p>
                    )
                }
            </div>
        </Popover>
        {/* {
            tree.map(e => 
            
                <div className="skill-item" key={e.id} onClick={() => checkItem(e)}>
                    {e.en}
                </div>
            )
        } */}
    </div>
}