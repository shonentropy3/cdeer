
import { Button } from 'antd';
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useProvider
  } from 'wagmi'
import { useEffect } from 'react';

export default function Card(props) {

    const { connect, chainId, connectors, error, isLoading, pendingConnector } = useConnect()
    const { cancel } = props

    return <>
        <div className="title">Welcome to Code-Market</div>
            <div className='strong'>Sign-in to get started</div>

            {
                connectors.map((connector,i) => 
                    <Button key={i} className="li" onClick={() => {connect({ connector }), cancel()}} >
                        {connector.name}
                    </Button>)
            }
            

    </>
}