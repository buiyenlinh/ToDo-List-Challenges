import React from 'react'

interface IProps {
    content: string
}
function Notification(props: IProps) {
    return (
        <div>
            <div className="flex justify-start item-center">
                <div className="icon"></div>
                <div className="content">
                    <span>{props.content}</span>
                </div>
            </div>
            
        </div>
    )
}

export default Notification
