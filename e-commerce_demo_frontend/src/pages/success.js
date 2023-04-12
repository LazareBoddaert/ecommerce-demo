import React, { useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useStateContext } from '@component/context/StateContext';
import { runFireworks } from '@component/lib/utils';

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    runFireworks();
  }, [])

  return (
    <div className='success-wrapper'>
      <div className='success'>
        <p className='icon'>
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className='email-msg'>Check your email inbox for your receipt.</p>
        <p className='description'>
          If you have any quastion please email
          <a className='email' href="mailto:demo@example.com">demo@example.com</a>
        </p>
        <Link href="/" >
          <button type="button" className='btn'>Continue shopping</button>
        </Link>
      </div>
    </div>
  )
}

export default Success
