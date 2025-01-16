import CustomSignIn from '@/app/_components/CustomSignIn';
import Logo from '@/app/_components/Logo';
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center p-5">
        <Logo />
      </div>
      <div className="w-full h-0.5 bg-gray-300"></div>
      <div className="flex-1 flex">
        <div className="w-2/3 flex flex-col justify-center px-24 gap-5">
          <div className="text-blue-500 font-bold text-lg ">
            WELCOME BACK TO AGIMRP
          </div>
          <h1 className="text-black font-bold text-4xl mt-2">
            Continue working with <br /> Accurate labelling and <br /> Data Collections!
          </h1>
          <p className="text-gray-600 mt-4">
            Sign in to access your account and start labelling data with our powerful tools.
          </p>
        </div>
        <div className="w-1/3 flex flex-col items-center justify-center bg-white p-10">
         <SignIn redirectUrl={'/adminDashboard'}/>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
