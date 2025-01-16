'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ProjectsList from './ProjectsList';

import FlagsList from './FlagsList';

import Navbar from './Navbar';
import Payout from './Payout';



const AdminPage = () => {
  // State to track which list is currently selected
  const [selectedList, setSelectedList] = useState<'projects' |  'flags' |'payout' >('projects');

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar selected={selectedList} onSelect={(list) => setSelectedList(list)} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto ">
          {selectedList === 'projects' && <ProjectsList />}
       
        
          {selectedList === 'flags' && <FlagsList />}
          {selectedList === 'payout' && <Payout />}
         
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
