const AlertSuccess2 = ({ successMsg, successDescription }) => {
  return (
    <div className="rounded-lg bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-[#ffffff] shadow-lg border border-green-500">
      <div className="flex flex-row gap-5 items-center px-5 py-6">
        <div className="my-auto text-lg flex-shrink-0 ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check-circle"
            width="100"
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

export default AlertSuccess2;
