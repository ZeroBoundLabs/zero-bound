import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogin }) => {
  return (
    <header
      style={{ background: '#2F2F3C' }}
      className='relative flex h-20 flex-wrap justify-between items-center py-0 px-6 w-full'
    >
      <img className='absolute left-12 w-16 h-16 top-1' src={'zb-logo.jpg'} alt={'logo'} />
      <img className='relative left-24 top-0 w-32 h-8' src={'zb-text.jpg'} alt={'logo'} />
      <div className='space-x-2 absolute right-8 top-2'>
        <a href='#' onClick={onLogin} className='text-white px-2 hover:underline'>
          {isLoggedIn ? 'Change User' : 'Login'}
        </a>
        {isLoggedIn && (
          <a href='#' onClick={onLogin} className='text-white px-2 hover:underline'>
            Signout
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
