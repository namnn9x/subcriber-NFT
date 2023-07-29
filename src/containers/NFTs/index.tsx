import { Fragment, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Network, Nft } from '@shyft-to/js'
import { AiOutlinePlus } from 'react-icons/ai'
import LoadingPage from '../../components/Loading'
import { shyft } from '../../App'
import { NftComponent } from './NFT'
import Slider from 'react-slick'

interface Props {
  isList?: boolean
  setNFTRewards?: (nfts: Nft[]) => void
  nftRewards?: Nft[]
}

const settings = {
  focusOnSelect: false,
  infinite: false,
  slidesToShow: 2,
  touchMove: false,
  slidesToScroll: 1,
  speed: 500,
}

const NFTList = ({ isList = false, nftRewards, setNFTRewards }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNfts] = useState<Nft[] | null>(null)
  const { connected, publicKey } = useWallet()

  useEffect(() => {
    async function fetchNFT(publicKey: string) {
      try {
        setLoading(true)
        const nfts = await shyft.nft.getNftByOwner({
          owner: publicKey,
          network: Network.Devnet,
        })
        setNfts(nfts)
      } catch (error: any) {
        // throw new Error(error)
      } finally {
        setLoading(false)
      }
    }

    if (publicKey) {
      fetchNFT(publicKey.toBase58())
    }
  }, [publicKey])

  const renderList = () => {
    return (
      <>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {!connected ? (
              <>
                <div>
                  <div className='mt-72 pb-5'>Connect the wallet to continue</div>
                  <WalletMultiButton />
                </div>
              </>
            ) : (
              <>
                {nfts && nfts.length ? (
                  <>
                    {!isList ? (
                      <div className='grid grid-cols-5 gap-8'>
                        {nfts.map((nft, index: number) => (
                          <Fragment key={index}>
                            <NftComponent nft={nft} isList />
                          </Fragment>
                        ))}
                      </div>
                    ) : (
                      <>
                        <Slider {...settings}>
                          {nfts.map((nft, index: number) => (
                            <Fragment key={index}>
                              <NftComponent nft={nft} isList nftRewards={nftRewards} setNFTRewards={setNFTRewards}/>
                            </Fragment>
                          ))}
                        </Slider>
                      </>
                    )}
                  </>
                ) : (
                  <div className='pb-5 mt-72'>
                    <div className=''>You don't have any NFTs.</div>
                    <button className='btn btn-primary items-center mt-3'>
                      <span className='font-bold text-base'>Create one</span>
                      <AiOutlinePlus className='w-3 h-3 ml-1' />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </>
    )
  }

  if (isList) {
    return renderList()
  }

  return (
    <div className={`container mx-auto px-3 py-5`}>
      <h1 className='text-4xl font-bold tracking-tight mb-5'>List NFTs</h1>
      {renderList()}
    </div>
  )
}

export default NFTList
