import { useState, useEffect } from "react";
import { ClockCircleOutlined } from '@ant-design/icons'

export default function Computing_time (params) {
    const { create_time } = params

    const timeBlock = () => {
        let now = new Date(Date()).getTime() / 1000
        let create = (new Date(create_time).getTime()) / 1000
        let day = ( now - create ) / 86400
        let hour = (now - create ) / 3600
        let minute = (now - create ) / 60
        let second = (now - create )
        if (day > 1) {
            let days = Math.floor(day)
            return (
                    <div className="time-text">
                        {
                            days === 1 ? 
                            <p>{days} <span>day ago</span></p>
                            : 
                            <p>{days} <span>days ago</span></p>
                        }
                    </div>
            )
        }else if ( day < 1 && hour > 1 ) {
            let hours = Math.floor(hour);
            return (
                <div className="time-text">
                    {
                        hours === 1 ? 
                        <p>{hours} <span>hour ago</span></p>
                        : 
                        <p>{hours} <span>hours ago</span></p>
                    }
                </div>
            )
        }else if ( day < 1 && hour < 1 && minute > 1 ) {
            let minutes = Math.floor(minute)
            return (
                <div className="time-text">
                    {
                        minutes === 1 ? 
                        <p>{minutes} <span>minute ago</span></p>
                        : 
                        <p>{minutes} <span>minute ago</span></p>
                    }
                </div>
            )
        }else {
            let seconds = Math.floor(second)
            return (
                <div className="time-text">
                    {
                        seconds === 1 ? 
                        <p>{seconds} <span>second ago</span></p>
                        : 
                        <p>{seconds} <span>seconds ago</span></p>
                    }
                </div>
            )
        }
    } 

    return (
        timeBlock()
    )
}


