import { InjectedConnector,
    NoEthereumProviderError,
    UserRejectedRequestError} from '@web3-react/injected-connector'
  import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
  
  export const useConnectWallet = () => {
    const {activate, deactivate, active} = useWeb3React()
    const connectWallet = useCallback((connector, chainId) => {
      return changeNetwork(chainId).then(() => {
          return activate(connector, undefined, true)
            .then((e) => {
              if ( window.ethereum && window.ethereum.on) {
                // 监听钱包事件
                console.log('注册事件')
                // const { ethereum } = window
                window.ethereum.on('accountsChanged', (accounts) => {
                  if (accounts.length === 0) {
                    // 无账号，则代表锁定了,主动断开
                    deactivate()
                  }
                  // 账号改了，刷新网页
                  // window.location.reload()
                })
  
                window.ethereum.on('disconnect', () => {
                  // 断开连接
                  deactivate()
                })
  
                window.ethereum.on('close', () => {
                  // 断开连接
                  deactivate()
                })
  
                window.ethereum.on('message', message => {
                  console.log('message', message)
                })
  
              }
              reslove(e)
            })
            .catch((error) => {
              switch (true) {
                case error instanceof UnsupportedChainIdError:
                  console.log('链错了')
                  break
                case error instanceof NoEthereumProviderError:
                  console.log('不是钱包环境')
                  break
                case error instanceof UserRejectedRequestError:
                  console.log('用户拒绝连接钱包')
                  break
                default:
                  console.log(error)
              }
              reject(error)
            })
        })
      })
    }
  

  