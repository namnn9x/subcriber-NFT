import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Network, Nft, ShyftSdk } from '@shyft-to/js'
import { AiOutlinePlus } from 'react-icons/ai'
import LoadingPage from '../../components/Loading'
import { shyft } from '../../App'

function NFTList() {
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNfts] = useState<Nft[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const countPerPage = 3
  const [collection, setCollection] = useState(
    (nfts?.slice(0, countPerPage))
  );

  const { connected, publicKey } = useWallet()

  const updatePage = (p: number) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setCollection(nfts?.slice(from, to))
  };

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

  return (
    <div className={`container mx-auto px-3 py-5`}>
      {nfts && nfts.length && <Pagination
        pageSize={countPerPage}
        onChange={updatePage}
        current={currentPage}
        total={nfts.length}
      />}
      <h1 className='text-4xl pb-4 font-bold tracking-tight'>List NFT</h1>
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
                <div className='grid grid-cols-5 gap-8'>
                  {collection?.map((nft, index: number) => (
                    <div className="bg-white rounded-lg group event-hover">
                      <div>
                        <div className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded xl:aspect-h-8 xl:aspect-w-7 relative">
                          <div className="w-full h-60 filter">
                            <img
                              src={nft.image_uri}
                              alt={index.toString()}
                              loading="lazy"
                              className="h-full w-full object-cover object-center group-hover:scale-105 ease-in duration-200"
                            />
                          </div>
                          <div className="pb-4">
                            <p className="mt-4 text-lg font-medium text-gray-900">
                              {nft.name}
                            </p>
                            <h3 className="mt-1 text-sm text-gray-700">
                              {nft.description}
                            </h3>
                          </div>  
                          <div className="mt-4 py-2 px-3 text-xs scale-100 btn-nft bg-opacity-60 absolute bottom-1/2">
                            Create event use NFT as reward
                            <span></span><span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pb-5 mt-72">
                  <div className="">You don't have any NFTs.</div>
                  <button className="btn btn-primary items-center mt-3">
                    <span className="font-bold text-base">Create one</span>
                    <AiOutlinePlus className="w-3 h-3 ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default NFTList;
