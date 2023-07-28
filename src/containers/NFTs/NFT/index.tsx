import { Nft } from '@shyft-to/js'

interface Props {
  nft: Nft
  isList: boolean
}
export const NftComponent = ({ nft, isList }: Props) => {
  return (
    <div className='bg-white rounded-lg group event-hover'>
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
          <div className='mt-4 py-2 px-3 text-xs group-hover:ease-in scale-100 btn-nft bg-opacity-60 absolute bottom-1/2'>
            Create event use NFT as reward
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
