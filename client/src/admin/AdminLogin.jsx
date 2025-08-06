import { login } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";

const svgPrint = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    // width='20'
    // height='20'
    fill="currentColor"
    className="bi bi-fingerprint w-10 h-10 text-red-700"
    viewBox="0 0 16 16"
  >
    <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z" />
    <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329" />
    <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z" />
    <path d="M3.902 4.222a5 5 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 4 4 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556m6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705M3.68 5.842a.5.5 0 0 1 .422.568q-.044.289-.044.59c0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.5 6.5 0 0 0 3.058 7q0-.375.054-.736a.5.5 0 0 1 .568-.422m8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.5 10.5 0 0 0 .584-2.678.5.5 0 0 1 .54-.456" />
    <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865m-.89 1.257a.5.5 0 0 1 .04.706A5.48 5.48 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346m12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49" />
  </svg>
);

// const svgLock = (
//   <svg
//     xmlns='http://www.w3.org/2000/svg'
//     fill='currentColor'
//     className='bi bi-lock-fill w-6 h-6'
//     viewBox='0 0 16 16'
//   >
//     <path d='M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2' />
//   </svg>
// )

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginForm.email === "" || loginForm.password === "") {
      console.log("Login form error");
    } else {
      dispatch(login(loginForm))
        .unwrap()
        .then(() => {
          navigate("/open-orders");
        })
        .catch((err) => {
          console.log("Login failed", err);
        });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-400 flex items-center justify-center">
        <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 rounded-2xl shadow-2xl bg-[#e4dcdc]">
          <div className="flex flex-row gap-3 pb-4">
            <div>{svgPrint}</div>

            <h1 className="text-3xl font-bold text-[#4B5563]  my-auto">
              Administrator Portal
            </h1>
          </div>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="pb-2">
              <label
                htmlFor="admin-email"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Email
              </label>
              <div className="relative text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-mail"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </span>
                <input
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  type="admin-email"
                  name="admin-email"
                  id="admin-email"
                  className="pl-12 mb-2 focus:border-transparent sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden  block w-full p-2.5 rounded-l-lg py-3 px-4
                  bg-gray-50 
                  text-gray-600 border 
                  border-gray-300 
                  focus:ring-gray-400"
                  placeholder="name@something.com"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="pb-6">
              <label
                htmlFor="admin-password"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Password
              </label>
              <div className="relative text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-square-asterisk"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M12 8v8"></path>
                    <path d="m8.5 14 7-4"></path>
                    <path d="m8.5 10 7 4"></path>
                  </svg>
                </span>
                <input
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  type="password"
                  id="admin-password"
                  placeholder="••••••••••"
                  className="pl-12 mb-2 border focus:border-transparent sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden block w-full p-2.5 rounded-l-lg py-3 px-4
                bg-gray-50 
                text-gray-600 
                border-gray-300 
                focus:ring-gray-400"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 text-[#FFFFFF] bg-[#ae0404] cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* <div className='borderShadow min-h-screen bg-gray-400 p-10'>
        <div className='flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#d9e4e5] rounded-2xl shadow-xl'>

          <div className='flex flex-row gap-3 pb-4'>
            <div>{svgPrint}</div>

            <h1 className='text-3xl font-bold text-[#4B5563] my-auto'>
              Create Admin Account
            </h1>
          </div>
          <div className='text-sm font-light text-black pb-8 '>
            Must have authentication code before creating an account
          </div>

          <form className='flex flex-col'>
            <div className='pb-2'>
              <label
                htmlFor='admin-name'
                className='block mb-2 text-sm font-medium text-[#111827]'
              >
                Name
              </label>
              <div className='relative text-gray-400'>
                <span className='absolute inset-y-0 left-0 flex items-center p-1 pl-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-mail'
                  >
                    <rect width='20' height='16' x='2' y='4' rx='2'></rect>
                    <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
                  </svg>
                </span>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4'
                  placeholder='Your Name'
                  autoComplete='off'
                />
              </div>
            </div>
            <div className='pb-2'>
              <label
                htmlFor='admin-create-email'
                className='block mb-2 text-sm font-medium text-[#111827]'
              >
                Email
              </label>
              <div className='relative text-gray-400'>
                <span className='absolute inset-y-0 left-0 flex items-center p-1 pl-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-mail'
                  >
                    <rect width='20' height='16' x='2' y='4' rx='2'></rect>
                    <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
                  </svg>
                </span>
                <input
                  type='admin-create-email'
                  name='admin-create-email'
                  id='admin-create-email'
                  className='pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4'
                  placeholder='name@company.com'
                  autoComplete='off'
                  required
                />
              </div>
            </div>
            <div className='pb-6'>
              <label
                htmlFor='admin-create-password'
                className='block mb-2 text-sm font-medium text-[#111827]'
              >
                Password
              </label>
              <div className='relative text-gray-400'>
                <span className='absolute inset-y-0 left-0 flex items-center p-1 pl-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-square-asterisk'
                  >
                    <rect width='18' height='18' x='3' y='3' rx='2'></rect>
                    <path d='M12 8v8'></path>
                    <path d='m8.5 14 7-4'></path>
                    <path d='m8.5 10 7 4'></path>
                  </svg>
                </span>
                <input
                  type='admin-create-password'
                  name='admin-create-password'
                  id='admin-create-password'
                  placeholder='••••••••••'
                  className='pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4'
                  autoComplete='off'
                  required
                />
              </div>
            </div>
            <div className='pb-6'>
              <label
                htmlFor='admin-code'
                className='block mb-2 text-sm font-medium text-[#111827]'
              >
                Admin Auth Code
              </label>
              <div className='relative text-gray-400'>
                <span className='absolute inset-y-0 left-0 flex items-center p-1 pl-3'>
                  {svgLock}
                </span>

                <input
                  type='admin-code'
                  name='admin-code'
                  id='admin-code'
                  placeholder='••••••••••'
                  className='pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4'
                  autoComplete='off'
                  required
                />
              </div>
            </div>
            <button
              type='submit'
              className='w-full text-[#FFFFFF] bg-[#4796e6] focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6'
            >
              Create Account
            </button>
            <div className='text-sm font-light text-[#6B7280] text-center'>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/admin-login")}
                className='font-medium text-[#4796e6] hover:underline'
              >
                Login
              </span>
            </div>
          </form>
        </div>
      </div> */}
    </>
  );
};

export default AdminLogin;
