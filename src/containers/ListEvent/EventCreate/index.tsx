import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { storage } from "../../../libs/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "./styles/index.css";
import Modal from "../../../components/Modal";
import { guidGenerator } from "../../../libs/utils";
import { message } from "../../../components/message";
import { IEvent, addEvent } from "../../../services/event";
import { Timestamp } from "firebase/firestore";
import { useUserStore } from "../../../store/user";
import { useEventStore } from "../../../store/event";

export const EventCreate = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [file, setFile] = useState<any>();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<string>('');
  const { user } = useUserStore()
  const { setEvent } = useEventStore()
  const formik = useFormik({
    initialValues: {
      uid: "",
      title: "",
      coverImage: "",
      description: "",
      createdBy: '',
      eventTime: new Date().toDateString(),
      ticketLimit: 0,
      nftReward: [],
    },
    onSubmit: async (event) => {
      // set image to store firebase
      const imageRef = ref(storage, `image/${file?.name + guidGenerator()}`)
      const resImage = await uploadBytes(imageRef, file)
      const imageURL = await getDownloadURL(resImage.ref)

      message.success('Upload image successfully')

      const getTime = new Date(event.eventTime).getTime()
      const newEvent = {
        ...event,
        coverImage: imageURL,
        eventTime: Timestamp.fromMillis(getTime),
        uid: user.uid || '',
        createdBy: user.fullname,
      }
      const resEvent = await addEvent(newEvent);
      setEvent(resEvent as IEvent)
      setIsOpen(false)
    },
  });

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

  useEffect(() => {
    if (file) {
      setBlob(URL.createObjectURL(file));
    }

    return () => {
      URL.revokeObjectURL(blob);
    };
  }, [file]);

  return (
    <Modal visible={isOpen} setVisible={setIsOpen}>
      <form className="create-event" onSubmit={formik.handleSubmit}>
        <h3 className="text-lg leading-6 pb-4 border-bottom dark:border-gray-700">
         Create your event
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
            className={`${
              blob ? "before-bg-file" : ""
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
            Event name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              id="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              className=""
              placeholder="Title"
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

        <div className="form-control no-icon">
          <label
            htmlFor="eventTime"
            className="block text-start text-sm font-medium my-2"
          >
            Event time
          </label>
          <div className="mt-1">
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
        <div className="form-control no-icon">
          <label
            htmlFor="ticketLimit"
            className="block text-start text-sm font-medium my-2"
          >
            Ticket limitation
          </label>
          <div className="mt-1">
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
  );
};
