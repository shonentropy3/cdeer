import { Button, Input, message, Modal, Upload } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { uploadProps } from "../upload/config";
const { TextArea } = Input;

export default function DeliveryModal({close, updateDelivery, loading, stageIndex}) {
    
    let [fileList, setFileList] = useState([]);
    let [params, setParams] = useState({
        content: '', attachment: '', fileType: ''
    })

    const changeDesc = (e) => {
        params.content = e;
        setParams({...params});
    }

    const handleChange = (info, list) => {
        params.fileType = info.file.name;
        setParams({...params});
        fileList = info.fileList;
        setFileList([...fileList]);
    }

    const uploadSuccess = (res, file) => {
        if (res.code === 0) {
            message.success(res.msg);
            fileList[0].status = "success";
        } else {
            message.error(res.msg);
            fileList[0].status = "error";
        }
        if (res.code !== 7) {
            params.attachment = res.data.hash;
            setParams({...params});
        }
    }

    return  <Modal
        open
        footer={null}
        onCancel={() => close(false)}
        className="modal-order-receiver prolongModal deliveryModal"
        closeIcon={<img src="/closeIcon.png" />}
    >
        <div className="img">
            <Image src="/img/tipIcon.png" layout="fill" quality={100} />
        </div>
        <p className="title">Submit Deliverables</p> 
        <div className="inner">
            <p className="inner-title">Upload P{stageIndex+1} stage  delivery document link.</p>
            <TextArea value={params.content} onChange={e => changeDesc(e.target.value)} />
        </div>

        <Upload
            listType="picture"
            onChange={handleChange}
            onSuccess={uploadSuccess}
            className="item-upload"
            {...uploadProps}
            fileList={fileList}
            progress={{
                strokeColor: {
                  '0%': '#108ee9',
                  '100%': '#87d068',
                },
                strokeWidth: 3,
                format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
            }}
        >
            <Button><div className="img" /><p>It is recommended to upload encrypted attachments (zip, rar, cab,<br/> tar, etc., within 20MB)</p></Button>
        </Upload>

        <div className="btns">
            <Button onClick={() => close(false)} disabled={loading}>Cancel</Button>
            <Button onClick={() => updateDelivery(params)} loading={loading}>Submit</Button>
        </div>
    </Modal>
}