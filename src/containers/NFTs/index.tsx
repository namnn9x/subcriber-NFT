import { Fragment, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Network, Nft } from '@shyft-to/js'
import { AiOutlinePlus } from 'react-icons/ai'
import LoadingPage from '../../components/Loading'
import { shyft } from '../../App'
import { NftComponent } from './NFT'
import Slider from 'react-slick'

interface Props {
  isList?: boolean
}

const settings = {
  focusOnSelect: false,
  infinite: false,
  slidesToShow: 2,
  touchMove: false,
  slidesToScroll: 1,
  speed: 500,
}

const NFTList = ({ isList = false }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNfts] = useState<Nft[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const countPerPage = 3
  const [nftPages, setNftPages] = useState<Nft[] | null>(null)
  const { connected, publicKey } = useWallet()

  const updatePage = (p: number) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setNftPages(nfts && nfts.slice(from, to))
  };

  useEffect(() => {
    async function fetchNFT(publicKey: string) {
      try {
        setLoading(true)
        const nfts = await shyft.nft.getNftByOwner({
          owner: publicKey,
          network: Network.Devnet,
        })
        setNfts(nfts)
        setNftPages(nfts.slice(0, countPerPage))
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
                {nftPages && nftPages.length ? (
                  <>
                    {!isList ? (
                      <div className='grid grid-cols-5 gap-8'>
                        {nftPages.map((nft, index: number) => (
                          <Fragment key={index}>
                            <NftComponent nft={nft} isList />
                          </Fragment>
                        ))}
                      </div>
                    ) : (
                      <>
                        <Slider {...settings}>
                          {nftPages.map((nft, index: number) => (
                            <Fragment key={index}>
                              <NftComponent nft={nft} isList />
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
      <h1 className='text-4xl font-bold tracking-tight'>List NFTs</h1>
      <div className='pb-12 relative'>
        {nfts && nfts.length && <Pagination
          pageSize={countPerPage}
          onChange={updatePage}
          current={currentPage}
          total={nfts.length}
        />}
      </div>
      {renderList()}
    </div>
  )
}

export default NFTList
