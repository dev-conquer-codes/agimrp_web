'use client'
import Logo from '@/app/_components/Logo'
import { UserButton } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <header className="w-full bg-white p-6 ">
      <div className="flex items-center justify-between">
        <Logo />
       <UserButton/>
      </div>
    </header>
  )
}

export default Navbar;
