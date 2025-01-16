'use client'
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const Logo = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    // Determine the base path based on the current pathname
    if (pathname.startsWith('/adminDashboard')) {
      router.push('/adminDashboard');
    } else if (pathname.startsWith('/pm_Dashboard')) {
      router.push('/pm_Dashboard');
    } else if (pathname.startsWith('/freelancer_Dashboard')) {
      router.push('/freelancer_Dashboard');
  } else if (pathname.startsWith('/client_Dashboard')) {
    router.push('/client_Dashboard');
  } else {
      // Default fallback route
      router.push('/');
    }
  };

  return (
    <div>
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <Image
          src="/agimrp_logo.png"
          alt="Company Logo"
          width={40}
          height={40}
        />
        <div className="text-xl font-bold ml-2">AGIMRP</div>
      </div>
    </div>
  );
};

export default Logo;
