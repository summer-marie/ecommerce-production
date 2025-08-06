import React from "react"

const AlertBlack = ({
  alertMsg,
  alertDescription,
  handleCancel,
  handleConfirm,
}) => {
  return (
    <div className='rounded-lg w-[600px] h-35  bg-[#000402] text-[#ffffff] sticky z-20'>
      <div className='flex flex-row gap-2 justify-center items-center px-2 w-full h-full'>
        <div className='text-lg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            className='bi bi-question-diamond-fill mt-3'
            viewBox='0 0 24 24'
            width='70'
            height='70'
          >
            <path d='M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927' />
          </svg>
        </div>

        <div>
          <div className='font-bold text-lg'>{alertMsg}</div>
          <div className='text-base'>{alertDescription}</div>
        </div>

        <div className='flex justify-end bottom-0 right-0 absolute p-2 mt-2'>
          <button
            onClick={handleConfirm}
            type='button'
            className='text-white bg-green-600 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center'
          >
            <svg
              className='me-2 h-3 w-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 14'
            >
              <path d='M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z' />
            </svg>
            Yes
          </button>
          <button
            onClick={handleCancel}
            type='button'
            className='text-stone-300 bg-transparent border border-stone-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-700 font-medium rounded-lg text-xs px-3 py-1.5 text-center'
          >
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertBlack
