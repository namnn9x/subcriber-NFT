import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui'
import { ShyftSdk, Network } from '@shyft-to/js'
import NFTCard from '../../components/NFT'

export interface INFT {
  animation_url?: string
  attributes?: any
  attributes_array ?: []
  cached_animation_url ?: string
  cached_image_uri?: string
  collection?: string
  creators?: string[]
  description?: string
  external_url?: string
  files?: any
  image_uri: string
  is_loaded_metadata?: boolean
  is_mutable?: boolean
  metadata_uri?: string
  mint?: string
  name?: string
  owner?: string
  primary_sale_happened?: boolean
  royalty?: number
  symbol?: string
  token_standard?:string
  update_authority?: string
}

function NFTList() {
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNfts] = useState<INFT[]>([])

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
  }, [publicKey, ])


  console.log('=====================================',nfts)
  // THAY BANG LIB USENFT
  return (
    <div className=''>
      {!connected ? (
        <>
          <div>
            <div className='mt-72 pb-5'>Connect the wallet to continue</div>
            <WalletMultiButton />
          </div>
        </>
      ):
        <>{nfts.map((nft: INFT, index:number) => {
          return (
            <div key={index}>
              <NFTCard nft={nft}/>
            </div>
          )
        })}</>
      }
    </div>
  )
}

export default NFTList
