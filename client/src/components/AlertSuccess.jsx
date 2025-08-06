const AlertSuccess = ({ successMsg, successDescription }) => {
  return (
    <div className="rounded-lg w-[300px] h-16 bg-green-900 text-[#ffffff]">
      <div className="flex flex-row gap-5 justify-center items-center px-5 w-full h-full">
        <div className="my-auto text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check-circle"
            width="50"
            height="50"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <path d="m9 11 3 3L22 4"></path>
          </svg>
        </div>

        <div>
          <div className="font-bold text-md">{successMsg}</div>
          <div className=" text-base">{successDescription}</div>
        </div>
      </div>
    </div>
  );
};

export default AlertSuccess;
