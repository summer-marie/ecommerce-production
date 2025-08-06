const AlertRed = ({ alertMsg, alertDescription, handleClose }) => {
  return (
    <div className='rounded-lg w-[600px] h-32 bg-red-800/80 text-[#ffffff] mx-auto sticky z-20'>
      <div className='flex flex-row gap-5 justify-center items-center px-5 w-full h-full'>
        <div className='my-auto text-lg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-alert-circle'
            width='50'
            height='50'
          >
            <circle cx='12' cy='12' r='10'></circle>
            <line x1='12' x2='12' y1='8' y2='12'></line>
            <line x1='12' x2='12.01' y1='16' y2='16'></line>
          </svg>
        </div>

        <div>
          <div className='font-bold text-lg'>{alertMsg}</div>
          <div className=' text-base'>{alertDescription}</div>
        </div>
        <div className='flex justify-end top-2 right-2 absolute p-2'>
          <button
            onClick={handleClose}
            type='button'
            className='ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 inline-flex items-center justify-center h-8 w-8 bg-gray-800 text-red-800 hover:bg-gray-700'
            data-dismiss-target='#alert-border-2'
            aria-label='Close'
          >
            <span className='sr-only'>Dismiss</span>
            <svg
              className='w-3 h-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertRed
