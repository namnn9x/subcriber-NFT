import { Nft } from '@shyft-to/js'
import { useState } from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
interface Props {
  nft: Nft
  isList?: boolean
  nftRewards?: Nft[]
  setNFTRewards?: (nfts: Nft[]) => void
}
  
export const NftComponent = ({ nft, isList, nftRewards, setNFTRewards }: Props) => {
  const [selected, setSelected] = useState(false)
  const className = isList ? 'w-56 my-0 mx-auto bg-white rounded-lg group event-hover' : 'bg-white rounded-lg group event-hover'
  const handleClickNFT = (nft: Nft) => {
    if (!nftRewards || !setNFTRewards) {
      return
    }
    let newList = [...nftRewards]

    if (!selected) {
      newList.push(nft)
    } else {
      const index = nftRewards.indexOf(nft)
      if (index > -1) {
        // only splice array when item is found
        newList.splice(index, 1) // 2nd parameter means remove one item only
      }
    }
    setNFTRewards(newList)
    setSelected(!selected)
  }

  return (
    <div className={className}  onClick={() => handleClickNFT(nft)}>
      <div>
        <div className='aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded xl:aspect-h-8 xl:aspect-w-7 relative'>
          <div className='w-full h-60 filter'>
            <img
              src={nft.image_uri}
              alt={nft.external_url}
              loading='lazy'
              className='h-full w-full object-cover object-center group-hover:scale-105 ease-in duration-200'
            />
          </div>
          <div className='pb-4'>
            <p className='mt-4 text-lg font-medium text-gray-900'>{nft.name}</p>
            <h3 className='mt-1 text-sm text-gray-700'>{nft.description}</h3>
          </div>
          {!selected && (
            <div className='mt-4 py-2 px-3 text-xs group-hover:ease-in scale-100 btn-nft bg-opacity-60 absolute bottom-1/2'>
              Create event use NFT as reward
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          {isList && selected && (
            <div className=''>
              <BsFillCheckCircleFill className='text-green-600 w-7 h-7 absolute bottom-5 left-5' />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
