

import Logo from '@/app/_components/Logo';
import { SignUp } from '@clerk/nextjs';


 const SignUpPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center p-5">
        <Logo />
      </div>
      <div className="w-full h-0.5 bg-gray-300"></div>
      <div className="flex-1 flex">
        <div className="w-2/3 flex flex-col justify-center px-24 gap-5">
          <div className="text-blue-500 font-bold text-lg ">
            JOIN AGIMRP TODAY
          </div>
          <h1 className="text-black font-bold text-4xl mt-2">
            Step into the future of Human Data, <br /> Accurate labelling and <br /> Data collection in one app!
          </h1>
          <p className="text-gray-600 mt-4">
            Sign up today to experience seamless community of Human Data with accurate labelling and Data collection. Get started now!
          </p>
        </div>
        <div className="w-1/3 flex flex-col items-center justify-center bg-white p-10">
          <SignUp redirectUrl={'/adminDashboard'}/>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
