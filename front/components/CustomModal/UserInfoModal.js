import { DoubleRightOutlined } from "@ant-design/icons"
import { Modal } from "antd"
import Identicon from "identicon.js";
import Image from "next/image"
import { useEffect } from "react";
import { deform_Skills } from "../../utils/Deform"



export default function UserInfoModal(params) {
    
    const { show, setShow, userInfo } = params;

    // 头像
    const hashAvt = (address) => {
        var hash = address;  // 15+ hex chars
        // var options = {
        //     foreground: [r, g, b, 255],               // rgba black
        //     background: [255, 255, 255, 255],         // rgba white
        //     margin: 0.2,                              // 20% margin
        //     size: 420,                                // 420px square
        //     format: 'svg'                             // use SVG instead of PNG
        //     };
        // create a base64 encoded SVG
        // var data = new Identicon(hash, options).toString();
        var data = new Identicon(hash, {format: 'svg'}).toString();
        data = `data:image/svg+xml;base64,${data}`
        return data
    }

    useEffect(() => {
        console.log(userInfo);
    },[])

    return <Modal
            footer={null}
            open={show}
            onCancel={()=>setShow(false)}
            className="personal-info"
            closeIcon={<img src="/closeIcon.png" />}
        >
            <div className="personal-info-topBackground"></div>
            
            {/* 详情 */}
            <div className="personal-info-btmBackground">
                    <div className="personal-info-avator">
                        {
                            userInfo.address &&
                            <img 
                                src={ userInfo.avatar ? 
                                "http://" + window.document.location.hostname + process.env.NEXT_PUBLIC_DEVELOPMENT_API + userInfo.avatar 
                                :
                                hashAvt(userInfo.address)} 
                            />
                        }
                    </div>
                    <p className="personal-info-name">{userInfo.username}</p>
                    <div className="personal-info-contact">
                        <div className="personal-info-contact-item">
                            <Image src="/icon/telegram.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/skype.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/wechat.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/discord.png" alt="" quality={100} width={29} height={29} />
                        </div>
                        <div className="personal-info-contact-item">
                            <Image src="/icon/whatsapp.png" alt="" quality={100} width={29} height={29} />
                        </div>
                    </div>
                    <div className="personal-info-goodSkill">
                        <p className="goodSkill-title">Good at skills</p>
                        { 
                            userInfo.role &&
                            deform_Skills(userInfo.role).map((e,i)=><span key={i} className="goodSkill-item">{e}</span>)
                        }
                    </div>
                    <div className="personal-info-NFTs">
                        <p className="NFTs-title">NFT held by him<span>more<DoubleRightOutlined /></span></p>
                        <div className="NFTs-img">
                            <div className="NFTs-img-item">
                                <p className="NFTs-img-item-image"></p>
                                <p className="NFTs-img-item-name">Okay Apes #12332</p>
                                <p className="NFTs-img-item-desc">Okay Apes Club</p>
                                <p className="NFTs-img-item-price">price</p>
                                <p className="NFTs-img-item-time">Ends in 15 hours</p>
                            </div>
                            <div className="NFTs-img-item">
                                <p className="NFTs-img-item-image"></p>
                                <p className="NFTs-img-item-name">Okay Apes #12332</p>
                                <p className="NFTs-img-item-desc">Okay Apes Club</p>
                                <p className="NFTs-img-item-price">price</p>
                                <p className="NFTs-img-item-time">Ends in 15 hours</p>
                            </div>
                            <div className="NFTs-img-item">
                                <p className="NFTs-img-item-image"></p>
                                <p className="NFTs-img-item-name">Okay Apes #12332</p>
                                <p className="NFTs-img-item-desc">Okay Apes Club</p>
                                <p className="NFTs-img-item-price">price</p>
                                <p className="NFTs-img-item-time">Ends in 15 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
        </Modal>
}