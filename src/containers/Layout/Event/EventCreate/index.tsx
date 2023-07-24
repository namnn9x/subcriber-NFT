import { Link, useNavigate } from "react-router-dom";
import { HiKey } from "react-icons/hi";
import { useFormik } from "formik";
import { Dialog } from "@headlessui/react";

export const EventCreate = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const navigate = useNavigate();

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

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="w-96 m-auto bg-slate-500 create-event">
        <h2 className="sign-title flex items-center gap-3">
          <span className="">Create your event</span>
        </h2>
        <p className="sign-desc">Please fill the form to create your event</p>
      </div>
      <form className="" onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <label
            htmlFor="coverImage"
            className="block text-start text-sm font-medium "
          >
            Cover image
          </label>
          <div className="">
            {formik.values.coverImage && (
              <img src={formik.values.coverImage} alt="event-img" />
            )}
            <input
              type="file"
              name="coverImage"
              id="coverImage"
              onChange={formik.handleChange}
              value={formik.values.coverImage}
              className=""
              placeholder="Event Image"
            />
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
            <span className="text-xs">
              Choose an NFT from your wallet and send to your fans when they
              subscribe your event.
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
              <p className="text-xs">
                <span className="opacity-80">Don't have any NFT yet? </span>
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
          <button type="submit" className="btn btn-primary btn-xl btn-block">
            Sign in
          </button>
        </div>
      </form>
    </Dialog>
  );
};
