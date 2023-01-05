import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button } from 'antd';
import Link from 'next/link';
export default function Home() {

  return (
    <div>
      <Head>
        <title>Detask</title>
        <meta name="description" content="Detask" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="Index">

          <div className="banner">
            <div className="banner-left">
              <p className="title">GUARANTEE THE DEVELOPER&apos;S EXPENSES</p>
              <div className="info">
                <Link href={{pathname:'/publish'}}>
                  <Button className="btn">发布需求</Button>
                </Link>
                <Link href={{pathname:'/projects'}}>
                  <Button className="btn">寻找项目</Button>
                </Link>
              </div>
            </div>
            <div className="banner-right">
              <Image className="img" src="/banner1.png" alt="" layout="fill" objectFit="cover" />
            </div>
            <div className="absolute a1">
              <p className="title">200w</p>
              <p className="subtitle">Community members</p>
            </div>
            <div className="absolute a2">
              <p className="title">300</p>
              <p className="subtitle">project</p>
            </div>
            <div className="absolute a3">
              <p className="title">800</p>
              <p className="subtitle">NFT quantity</p>
            </div>
          </div>

          <div className="data">
              <div className="data-li">
                <div className="img"></div>
                <p className="title">Reference project</p>
                <p className="text">Browse past project works, sort out complete project needs, or directly find professionals you can trust.</p>
              </div>
              <div className="data-li">
                <div className="img"></div>
                <p className="title">Smart contract</p>
                <p className="text">After confirming the cooperation, execute the smart contract, confirm the delivery of automatic payment, and reduce other transaction costs related to the contract.</p>
              </div>
              <div className="data-li">
                <div className="img"></div>
                <p className="title">NFT display</p>
                <p className="text">Each time the project is completed, NFTs are displayed on both sides. You can choose the people you trust by the number of NFTs displayed.</p>
              </div>
          </div>

          <div className="ucan">
            <div className="Index-title">
              <div className="img"></div>
              <p className="font-Title">You can</p>
              <div className="point"/>
            </div>
            <div className="ucan-list">
              <div className="list-li">
                <div className="li-info">
                  <div className="img"></div>
                  <p className="title">Release requirements</p>
                  <div className="content">
                    <p>Release project requirements and find reliable developers。</p>
                    <p>Here, through the developer&apos;s NFT, evaluate the developer&apos;s ability。</p>
                    <p>Get project NFT and improve your credibility</p>
                  </div>
                  {/* <Button className="btn">Learn more</Button> */}
                </div>
              </div>
              <div className="list-li">
                <div className="li-info">
                  <div className="img"></div>
                  <p className="title">Release requirements</p>
                  <div className="content">
                    <p>Release project requirements and find reliable developers。</p>
                    <p>Here, through the developer&apos;s NFT, evaluate the developer&apos;s ability。</p>
                    <p>Get project NFT and improve your credibility</p>
                  </div>
                  {/* <Button className="btn">Learn more</Button> */}
                </div>
              </div>
            </div>
          </div>

          <div className="example">
            <div className="Index-title">
              <div className="img"></div>
              <p className="font-Title">Reference case</p>
              <div className="point"/>
            </div>
            <div className="example-list">
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              <div className="list-li">
                <div className="img"></div>
                <div className="info">
                  <p className="title">Entry name <span>label</span><span>label</span></p>
                  <p className="content">Project description Project description Project</p>
                  <div className="more">
                    <p className="time">3 days ago</p>
                    <Button className="btn">Learn more</Button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          <div className="evaluation">
            <div className="Index-title">
              <div className="img"></div>
              <p className="font-Title">User evaluation</p>
              <div className="point"/>
            </div>
            <div className="evaluation-list">
              <div className="list-li">
                <div className="li-info">
                  <div className="info-img"></div>
                  <p className="info-name">Mike</p>
                  <p className="info-role">Designer</p>
                </div>
                <div className="li-content">
                  “I think as detask becomes bigger and bigger, more and more people begin to understand the power of crowdsourcing, which is the way of working in the future. I&apos;m glad to be involved.”
                </div>
              </div>

              <div className="list-li">
                <div className="li-info">
                  <div className="info-img"></div>
                  <p className="info-name">Mike</p>
                  <p className="info-role">Designer</p>
                </div>
                <div className="li-content">
                  “I think as detask becomes bigger and bigger, more and more people begin to understand the power of crowdsourcing, which is the way of working in the future. I&apos;m glad to be involved.”
                </div>
              </div>

              <div className="list-li">
                <div className="li-info">
                  <div className="info-img"></div>
                  <p className="info-name">Mike</p>
                  <p className="info-role">Designer</p>
                </div>
                <div className="li-content">
                  “I think as detask becomes bigger and bigger, more and more people begin to understand the power of crowdsourcing, which is the way of working in the future. I&apos;m glad to be involved.”
                </div>
              </div>

            </div>
            
          </div>

          <div className="h100"></div>
        </div>
      </main>

    </div>
  )
}
