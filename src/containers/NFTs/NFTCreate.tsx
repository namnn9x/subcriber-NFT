import { useFormik } from 'formik'
import Modal from '../../components/Modal'
import { Network } from '@shyft-to/js'
import { useEffect, useRef, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { FcCheckmark } from 'react-icons/fc'
import { MdDangerous } from 'react-icons/md'
import { shyft } from '../../App'
import { signAndConfirmTransaction } from '../../hooks'
import { IEvent, getEventById, updateEvent } from '../../services/event'
import { message } from '../../components/message'

interface INFTCreate {
  event?: IEvent
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface Attribute {
  trait_type: string
  value: string
}

interface NFTCreate {
  network?: Network
  creatorWallet: any
  name: string
  symbol: string
  description?: string
  attributes?: Attribute[]
  externalUrl?: string
  maxSupply?: number
  royalty?: number
  collectionAddress?: string
  feePayer?: string
  image: File | null
  data?: File
}

export const LAMPORT = 0.000000001 
export const NFTCreate = ({ setIsOpen, isOpen, event }: INFTCreate) => {

  const [loading, setLoading] = useState(false)
  const [minting, setMinting] = useState(false)
  const [mint, setMint] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [file, setFile] = useState<any>()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [blob, setBlob] = useState<string>('')
  const { publicKey, signTransaction } = useWallet()

  const [mssg, setMssg] = useState('');

  const callback = (signature: any, result: any) => {
    console.log("Signature ", signature);
    console.log("result ", result);

    try {
      if (signature.err === null) {
        setMssg("Minting successful. You can check your wallet");
        setSuccess(true)
      }
      else {
        setMssg("Signature Failed");
        setError(true)

      }
    } catch (error) {
      setMssg("Signature Failed, but check your wallet");
      setError(true)
    }

  }

  const formik = useFormik({
    initialValues: {
      network: Network.Devnet,
      creatorWallet: publicKey,
      name: '',
      symbol: '',
      description: '',
      maxSupply: 0,
      attributes: [
        {
          trait_type: '',
          value: '',
        },
      ],
      image: null,
    } as NFTCreate,
    onSubmit: async (nft) => {
      if (!publicKey || !signTransaction) {
        return
      }
      try {
        setLoading(true)
        const { mint, encoded_transaction } = await shyft.nft.createV2({
          creatorWallet: publicKey.toString(),
          name: nft.name,
          symbol: nft.symbol,
          maxSupply: nft.maxSupply,
          description: nft.description,
          image: file,
        })
        if (mint && encoded_transaction) {
          try {
            setMinting(true)
            await signAndConfirmTransaction(Network.Devnet, encoded_transaction, callback)
            setMint(mint)
          } catch (error) {
            setError(true)
            setLoading(false)
            console.log(error)
          } finally {
            setLoading(false)
            setMinting(false)
          }
        }
        console.log(mint, 'mint')
      } catch (error) {
        console.log(error)
        setError(true)
        setLoading(false)
        setSuccess(false)
      } finally {
        setLoading(false)
      }

    },
  })

  useEffect(() => {
    void( async () => {
      if (event && Array.isArray(event.nftReward)) {
        const getNewEvent = event.id && await getEventById(event.id) as IEvent
        if (!getNewEvent) {
          console.log('Not query newEvent')
          return
        }
        const newEvent: IEvent = {
          ...getNewEvent,
          nftReward: [...getNewEvent.nftReward, mint]
        }
        await updateEvent({ newEvent })
      }
    })()
  }, [mint])
  
  useEffect(() => {
    if (file) {
      setBlob(URL.createObjectURL(file))
    }
    
    return () => {
      URL.revokeObjectURL(blob)
    }
  }, [file])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false)
        setIsOpen(false)
        formik.resetForm()
        setFile(null)
        setBlob('')
        setError(false)
      }, 2000)
    }
  }, [success])
  
  const onFileChange = (e: any) => {
    const newFile = e.target.files[0]
    if (newFile) {
      if (!newFile.type.match('image.*')) {
      } else {
        inputFileRef.current && (inputFileRef.current.value = '')
        setFile(newFile)
      }
    }
  }

  return (
    <Modal visible={isOpen} setVisible={setIsOpen}>
      <div className={`relative ${(loading || minting) && 'animate-pulse'}`}>
        <div className={`${success && 'invisible'}`}>
          <form className="create-event" onSubmit={formik.handleSubmit}>
            <h3 className="text-lg leading-6 pb-4 border-bottom dark:border-gray-700">Create NFT for my event</h3>
            <div className="">
              <label htmlFor="coverImage" className="block text-start text-sm font-medium my-2">
                Cover image
              </label>
              <div
                style={
                  {
                    '--bg': `url(${blob})`,
                  } as React.CSSProperties
                }
                onClick={() => inputFileRef.current && inputFileRef.current.click()}
                className={`${blob ? 'before-bg-file' : ''
                  } relative p-6 cursor-pointer h-[200px] w-full mx-auto flex flex-col items-center border-2 border-dashed border-blue-600 text-base leading-[1.6] select-none`}
              >
                <input ref={inputFileRef} type="file" onChange={onFileChange} accept="image/*" hidden required />
                <p className="text-sm font-medium text-start my-2">Click to select photo</p>
                <p className="text-center text-[#F05123] pointer-events-none"></p>
              </div>
            </div>
            <div className="form-control no-icon">
              <label htmlFor="event_name" className="block text-start text-sm font-medium my-2">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  required
                  className=""
                  placeholder="name"
                />
              </div>
            </div>

            <div className="form-control no-icon">
              <label htmlFor="Symbol" className="block text-sm font-medium text-start my-2">
                Symbol
              </label>
              <div className="mt-1">
                <textarea
                  name="symbol"
                  id="symbol"
                  onChange={formik.handleChange}
                  value={formik.values.symbol}
                  required
                  className=""
                  placeholder="Symbol"
                />
              </div>
            </div>

            <div className="form-control no-icon">
              <label htmlFor="maxSupply" className="block text-sm font-medium text-start my-2">
                 Max supply
              </label>
              <div className="mt-1">
                <input
                  type='number'
                  min={0}
                  name="maxSupply"
                  id="maxSupply"
                  onChange={formik.handleChange}
                  value={formik.values.maxSupply}
                  className=""
                  placeholder="Add max supply (total supply is limit ticket of your event)"
                />
              </div>
            </div>

            <div className="form-control no-icon">
              <label htmlFor="description" className="block text-sm font-medium text-start my-2">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  name="description"
                  id="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  className=""
                  placeholder="Description your event"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex gap-4 flex-row-reverse">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  Create
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="btn btn-lg" disabled={loading}>
                  Close
                </button>
              </div>
            </div>
          </form>
          {(loading || minting) && (
            <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </div>
        {success && (
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <div>
              <FcCheckmark className='mx-auto mb-5 w-20 h-20 ease-in duration-1000' />
              {mssg}
            </div>
          </div>
        )}
        {error && (
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <div>
              <MdDangerous className='mx-auto mb-5 w-20 h-20 ease-in duration-1000' />
              {mssg}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
