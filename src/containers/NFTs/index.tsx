import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ShyftSdk, Network, Nft } from '@shyft-to/js'
import { HiGift } from 'react-icons/hi'
import { LuPartyPopper } from 'react-icons/lu'
import { BtnEventCreate } from '../Event/EventCreate/components/btnEventCreate'
import { AiOutlinePlus } from 'react-icons/ai'

function NFTList() {
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNfts] = useState<Nft[] | null>(null)

  const { connected, publicKey } = useWallet()

  //Tao file .env.local or .env, tao 1 bien

  useEffect(() => {
    async function fetchNFT(publicKey: string) {
      try {
        setLoading(true)
        const shyft = new ShyftSdk({ apiKey: process.env.REACT_APP_SHYFT_API_KEY!, network: Network.Devnet })
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
      <h1 className="text-4xl pb-4 font-bold tracking-tight">List NFT</h1>
      {!connected ? (
        <>
          <div>
            <div className="mt-72 pb-5">Connect the wallet to continue</div>
            <WalletMultiButton />
          </div>
        </>
      ) : (
        <>
          {nfts && nfts.length ? (
            <div className="grid grid-cols-5 gap-8">
              {nfts.map((nft, index: number) => (
                <div className="bg-white rounded-lg group">
                  <a href="general-event">
                    <div className="aspect-h-1 aspect-w-1 w-full h-100 overflow-hidden rounded-l xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src={nft.image_uri}
                        alt={index.toString()}
                        loading="lazy"
                        className="h-auto w-72 object-cover object-center group-hover:scale-105 ease-in duration-200"
                      />
                      <p className="mt-4 text-lg font-medium text-gray-900">{nft.name}</p>
                      <h3 className="mt-1 text-sm text-gray-700">{nft.description}</h3>
                    </div>

                    <div className="mt-3 py-2 bg-blue-400 rounded-b-lg invisible group-hover:visible ease-up duration-100">
                      <div className="flex flex-row text-white font-bold items-center justify-center group-hover:ease-in scale-100">
                        <LuPartyPopper />
                        <span>Create event use NFT as reward </span>
                        <HiGift />
                      </div>
                    </div>
                  </a>
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
    </div>
  )
}

export default NFTList
