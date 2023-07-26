import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { useFormik } from "formik";
import { HiX } from "react-icons/hi";
import "./styles/index.css";

export const EventCreate = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState("");
  const [isDragEnter, setIsDragEnter] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      coverImage: "",
      description: "",
      eventTime: "",
      ticketLimit: "",
      nftReward: "",
    },
    onSubmit: ({}) => {},
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const onFileChange = (e: any) => {
    const newFile = e.target.files[0];
    if (newFile) {
      if (!newFile.type.match("image.*")) {
      } else {
        inputFileRef.current && (inputFileRef.current.value = '');
        setFile(newFile);
      }
    }
  };

  useEffect(() => {
    if (file) {
      setBlob(URL.createObjectURL(file));
    }

    return () => {
      URL.revokeObjectURL(blob);
    };
  }, [file]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create your event
                </Dialog.Title>
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                >
                  <HiX onClick={handleClose} />
                </button>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please fill the form to create your event
                  </p>
                </div>
                <form className="create-event" onSubmit={formik.handleSubmit}>
                  <div className="input-group">
                    <label
                      htmlFor="coverImage"
                      className="block text-start text-sm font-medium "
                    >
                      Cover image
                    </label>
                    <div
                      onClick={() =>
                        inputFileRef.current && inputFileRef.current.click()
                      }
                      className={`relative p-6 cursor-pointer h-[200px] w-full mx-auto mt-10 border-2 border-dashed border-blue-600 flex flex-col items-center text-base leading-[1.6] select-none`}
                    >
                      <input
                        ref={inputFileRef}
                        type="file"
                        onChange={onFileChange}
                        accept="image/*"
                        hidden
                      />
                      <p className="text-center my-3 pointer-events-none"></p>
                      <p className="text-center text-[#F05123] pointer-events-none"></p>
                    </div>
                  </div>
                  <div className="input-group">
                    <label
                      htmlFor="event_name"
                      className="block text-start text-sm font-medium "
                    >
                      Event name
                    </label>
                    <div className="form-control">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        className=""
                        placeholder="Event name"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-start"
                    >
                      Description
                    </label>
                    <div className="form-control">
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

                  <div className="input-group">
                    <label
                      htmlFor="eventTime"
                      className="block text-start text-sm font-medium "
                    >
                      Event time
                    </label>
                    <div className="form-control">
                      <input
                        type="date"
                        name="eventTime"
                        id="eventTime"
                        onChange={formik.handleChange}
                        value={formik.values.eventTime}
                        className=""
                        placeholder="Event time"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label
                      htmlFor="ticketLimit"
                      className="block text-start text-sm font-medium "
                    >
                      Ticket limitation
                    </label>
                    <div className="form-control">
                      <input
                        type="number"
                        name="ticketLimit"
                        id="ticketLimit"
                        onChange={formik.handleChange}
                        value={formik.values.ticketLimit}
                        className=""
                        placeholder="Ticket limit"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label
                      htmlFor="nftReward"
                      className="block text-start text-sm font-medium "
                    >
                      NFT reward
                      {/* tao sau bang cach them list or */}
                    </label>
                    <div className="form-control">
                      <span className="text-xs text-gray-500">
                        Choose an NFT from your wallet and send to your fans
                        when they subscribe your event.
                      </span>
                      <p>List NFT</p>
                      <p>List NFT</p>
                      <p>List NFT</p>
                      <p>List NFT</p>
                      <p>List NFT</p>
                      <p>List NFT</p>
                      <p>List NFT</p>
                      {/* <input
                type="text"
                name="nftReward"
                id="nftReward"
                onChange={formik.handleChange}
                value={formik.values.nftReward}
                className=""
                placeholder="NFT Reward"
              /> */}
                      <div className="input-group mb-10">
                        <p className="text-xs text-center">
                          <span className="opacity-80 pt-5 text-gray-500">
                            Don't have any NFT yet?{" "}
                          </span>
                          <Link
                            to={"/sign-up"}
                            className="text-color-primary hover:underline"
                          >
                            Create one
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="input-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-xl btn-block"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
