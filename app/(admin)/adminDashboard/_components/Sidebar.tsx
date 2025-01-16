'use client';



interface SidebarProps {
  selected: 'projects' |'flags' | 'payout'  ;
  onSelect: (list: 'projects' |  'flags' | 'payout' ) => void;
}

const Sidebar = ({ selected, onSelect }: SidebarProps) => {
  return (
    <aside className="w-64 bg-white p-6  flex-shrink-0">
      <nav className="flex flex-col space-y-4">
        <div
          onClick={() => onSelect('projects')}
          className={`cursor-pointer rounded-3xl p-3 transition-colors duration-300 ${
            selected === 'projects' 
              ? 'bg-blue-50 text-blue-400 border border-blue-200 font-bold' 
              : 'text-gray-500 font-normal hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Projects
        </div>
        
   
        <div
          onClick={() => onSelect('flags')}
          className={`cursor-pointer rounded-3xl p-3 transition-colors duration-300 ${
            selected === 'flags' 
              ? 'bg-blue-50 text-blue-400 border border-blue-200 font-bold' 
              : 'text-gray-500 font-normal hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Flags
        </div>
        <div
          onClick={() => onSelect('payout')}
          className={`cursor-pointer rounded-3xl p-3 transition-colors duration-300 ${
            selected === 'payout' 
              ? 'bg-blue-50 text-blue-400 border border-blue-200 font-bold' 
              : 'text-gray-500 font-normal hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Payout
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
