import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiKey, HiClipboardList, HiOutlineClipboardList } from 'react-icons/hi'
import { signIn } from '../../services/sign'
import { useFormik } from 'formik'
import { message } from '../../components/message'

export const EventForm = () => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      title: '',
      coverImage: '',
      description: '',
      eventTime: '',
      ticketLimit: '',
      nftReward: '',
    },
    onSubmit: ({}) => {},
  })

  return (
    <div>
      <div className=" sign-in">
        <h2 className="sign-title flex items-center gap-3">
          <HiKey className="h-7 w-7 rounded-full text-green-500 p-1.5 bg-green-100" />
          <span>Create your event</span>
        </h2>
        <p className="sign-desc">Please fill the form to create your event</p>

        <form className="sign-form px-28 py-5" onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label htmlFor="coverImage" className="block text-start text-sm font-medium ">
              Cover image
            </label>
            <div className="form-control">
              {formik.values.coverImage && <img src={formik.values.coverImage} alt="event-img" />}
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
            <label htmlFor="event_name" className="block text-start text-sm font-medium ">
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
            <label htmlFor="description" className="block text-sm font-medium text-start">
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
            <label htmlFor="eventTime" className="block text-start text-sm font-medium ">
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
            <label htmlFor="ticketLimit" className="block text-start text-sm font-medium ">
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
            <label htmlFor="nftReward" className="block text-start text-sm font-medium ">
              NFT reward
              {/* tao sau bang cach them list or */}
            </label>
            <div className="form-control">
              <span className='text-xs'>Choose an NFT from your wallet and send to your fans when they subscribe your event.</span>
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
                  <Link to={'/signup'} className="text-color-primary hover:underline">
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
      </div>
    </div>
  )
}
