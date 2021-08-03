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

export const Button = ({ children, className, onClick }) => (
  <a
    href="#"
    onClick={onClick}
    className={className ? [buttonClassNames, className].join(' ') : buttonClassNames}>
    {children}
  </a>
)
