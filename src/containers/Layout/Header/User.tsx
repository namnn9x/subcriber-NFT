import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const options = [
  {
    name: 'Edit',
    href: '##',
  },
  {
    name: 'Log Out',
    href: '##',
  },
]

export const User = () => {
  return (
    <>
      <Popover>
        <Popover.Button>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm font-semibold leading-6 text-gray-300 flex items-center">
              <p>Nam NN</p>
              <img
                src="https://tecdn.b-cdn.net/img/new/avatars/5.webp"
                className="mx-auto w-10 rounded-lg ml-1"
                alt="Avatar"
              />
            </a>
          </div>
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute z-10">
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 mt-3">
              <div className="relative grid bg-white lg:grid-cols-1">
                {options.map((item) => (
                  <div className="hover:bg-gray-300  px-6 py-3">
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => console.log('====item', item.name)}
                      className=" rounded-lg transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  )
}
