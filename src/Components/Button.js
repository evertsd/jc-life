import React from 'react';

const buttonClassNames = [
  'br2',
  'f5',
  'no-underline',
  'black',
  'bg-white bg-animate',
  'hover-bg-black',
  'hover-white',
  'inline-flex',
  'items-center',
  'pa2',
  'ba border-box'
].join(' ');

export const Button = ({ children, onClick }) => (
  <a
    href="#"
    onClick={onClick}
    className={buttonClassNames}>
    {children}
  </a>
)
