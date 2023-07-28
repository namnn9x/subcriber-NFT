import { Fragment, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Network, Nft } from '@shyft-to/js'
import { AiOutlinePlus } from 'react-icons/ai'
import LoadingPage from '../../components/Loading'
import { shyft } from '../../App'
import { NftComponent } from './NFT'
import Slider from 'react-slick'
import { NFTCreate } from './NFTCreate'

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
const COUNT_PER_PAGE = 3

const NFTList = ({ isList = false }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNfts] = useState<Nft[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [open, setOpen] = useState<boolean>(false)
  const [collection, setCollection] = useState(nfts?.slice(0, COUNT_PER_PAGE))

  const { connected, publicKey } = useWallet()

  const updatePage = (p: number) => {
    setCurrentPage(p)
    const to = COUNT_PER_PAGE * p
    const from = to - COUNT_PER_PAGE
    setCollection(nfts?.slice(from, to))
  }

  //Tao file .env.local or .env, tao 1 bien

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
                              <NftComponent nft={nft} isList />
                            </Fragment>
                          ))}
                        </Slider>
                        <div>
                        <div className='pt-5'>
                          <div className=''>or </div>
                          <button className='btn btn-primary items-center mt-3' onClick={() => setOpen(true)}>
                            <span className='font-bold text-base'>Create one</span>
                            <AiOutlinePlus className='w-3 h-3 ml-1' />
                          </button>
                        </div>
                      </div>
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
        <NFTCreate isOpen={open} setIsOpen={setOpen} />
      </>
    )
  }

  if (isList) {
    return renderList()
  }

  return (
    <div className={`container mx-auto px-3 py-5`}>
      {nfts && nfts.length && (
        <Pagination pageSize={COUNT_PER_PAGE} onChange={updatePage} current={currentPage} total={nfts.length} />
      )}
      <h1 className='text-4xl pb-4 font-bold tracking-tight'>List NFT</h1>
      {renderList()}
    </div>
  )
}

export default NFTList
