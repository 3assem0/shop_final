import { useState } from 'react'
import { X } from 'lucide-react'

export default function Banner() {
  const [showBanner, setShowBanner] = useState(true)

  if (!showBanner) return null

  return (
    <div className='px-10 lg:px-12 w-full'>
    <div className="relative w-full mx-auto px-6 lg:px-8 isolate flex items-center gap-x-6 overflow-hidden bg-[#de0ee1] py-2 rounded-b-lg after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:before:flex-1 transition-all duration-300">
      {/* Background shapes */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-[gradient-to-r from-[#a71cd9] to-[#de0ee1]] opacity-40"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#a71cd9] to-[#de0ee1] opacity-40"
        />
      </div>

      {/* Content */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        <p className="text-sm/6 text-gray-100">
          Sale 50% OFF
        </p>
        <a
          href="#"
          className="flex-none underline rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
        >
          Shop Now
        </a>
      </div>

      {/* Close Button */}
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          className="-m-3 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white hover:bg-white/10 rounded-full transition-colors duration-200"
        >
          <span className="sr-only">Dismiss</span>
          <X aria-hidden="true" className="h-5 w-5 text-gray-100" />
        </button>
      </div>
    </div>
    </div>
  )
}