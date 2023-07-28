import { useFormik } from "formik";
import Modal from "../../components/Modal"
import { Network } from "@shyft-to/js";
import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { shyft } from "../../App";

interface INFTCreate {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Attribute {
  trait_type: string,
  value: string
}

interface NFTCreate {
  network?: Network;
  creatorWallet: string;
  name: string;
  symbol: string;
  description?: string;
  attributes?: Attribute[];
  externalUrl?: string;
  maxSupply?: number;
  royalty?: number;
  collectionAddress?: string;
  feePayer?: string;
  image: File | null;
  data?: File;
}

export const NFTCreate = ({ setIsOpen, isOpen }: INFTCreate) => {

  const [file, setFile] = useState<any>();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<string>('');
  const { publicKey } = useWallet()

  const formik = useFormik({
    initialValues: {
      network: Network.Devnet,
      creatorWallet: '',
      name: '',
      symbol: '',
      description: '',
      attributes: [
        {
          trait_type: '',
          value: ''
        }
      ],
      image: null,
    } as NFTCreate,
    onSubmit: async (nft) => {
      try {
        const { mint, encoded_transaction } = await shyft.nft.createV2({
          creatorWallet: publicKey || '',
          name: nft.name,
          symbol: nft.symbol,
          description: nft.description,
          image: file
        });
      } catch (error) {
        
      }
      console.log(nft, 'nft')
    },
  });

  useEffect(() => {
    if (file) {
      setBlob(URL.createObjectURL(file));
    }

    return () => {
      URL.revokeObjectURL(blob);
    };
  }, [file]);

  const onFileChange = (e: any) => {
    const newFile = e.target.files[0];
    if (newFile) {
      if (!newFile.type.match("image.*")) {
      } else {
        inputFileRef.current && (inputFileRef.current.value = "");
        setFile(newFile);
      }
    }
  };

  return (
    <Modal visible={isOpen} setVisible={setIsOpen}>
      <form className="create-event" onSubmit={formik.handleSubmit}>
        <h3 className="text-lg leading-6 pb-4 border-bottom dark:border-gray-700">
          Create NFT for my event
        </h3>
        <div className="">
          <label
            htmlFor="coverImage"
            className="block text-start text-sm font-medium my-2"
          >
            Cover image
          </label>
          <div
            style={
              {
                "--bg": `url(${blob})`,
              } as React.CSSProperties
            }
            onClick={() => inputFileRef.current && inputFileRef.current.click()}
            className={`${blob ? "before-bg-file" : ""
              } relative p-6 cursor-pointer h-[200px] w-full mx-auto flex flex-col items-center border-2 border-dashed border-blue-600 text-base leading-[1.6] select-none`}
          >
            <input
              ref={inputFileRef}
              type="file"
              onChange={onFileChange}
              accept="image/*"
              hidden
            />
            <p className="text-sm font-medium text-start my-2">
              Click to select photo
            </p>
            <p className="text-center text-[#F05123] pointer-events-none">

            </p>
          </div>
        </div>
        <div className="form-control no-icon">
          <label
            htmlFor="event_name"
            className="block text-start text-sm font-medium my-2"
          >
            Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className=""
              placeholder="name"
            />
          </div>
        </div>

        <div className="form-control no-icon">
          <label
            htmlFor="Symbol"
            className="block text-sm font-medium text-start my-2"
          >
            Symbol
          </label>
          <div className="mt-1">
            <textarea
              name="symbol"
              id="symbol"
              onChange={formik.handleChange}
              value={formik.values.symbol}
              className=""
              placeholder="Symbol"
            />
          </div>
        </div>      

        <div className="form-control no-icon">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-start my-2"
          >
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
            <button type="submit" className="btn btn-primary btn-lg">
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-lg"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}