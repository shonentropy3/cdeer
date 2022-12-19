import { useState } from "react";
import { getDate } from "../../utils/getDate";


export default function StageOutput(params) {
    
    const { data, index } = params;

    let [isOpen, setIsOpen] = useState(false);

    return <div className="itemCard">
        <div className="itemCard-nav">
            <p className="nav-index">P{index+1}</p>
            <p className="nav-title">{data.name}</p>
            <div className="operate">
                <div className="edit"></div>
                <div className="remove"></div>
            </div>
        </div>
        <div className={`itemCard-content ${isOpen ? 'open' : ''}`}>
            <p className="container">
                <span>Delivery duration:</span>
                {data.period}day
            </p>
            <p className="container">
                <span>Delivery date:</span>
                {
                    getDate(
                        new Date().getTime() + (data.deliveryDate * 24 * 60 * 60 * 1000), 'd'
                    )
                }
            </p>
            <p className="container">
                <span>Stage cost:</span>
                {data.amount}
            </p>
            <p className="container">
                <span>Delivery instructions:</span>
                {data.desc}
            </p>
            <div className="arrow" onClick={() => setIsOpen(!isOpen)}></div>
        </div>
    </div>
}