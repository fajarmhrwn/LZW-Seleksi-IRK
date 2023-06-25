import React, { useEffect } from 'react'

import { Dropdown, Navbar, Avatar } from 'flowbite-react';
import { useStateContext } from '../contexts/ContextProvider';

export default function Navbars() {
    const {currentUser, setToken,setUser} = useStateContext();
    const logout = () => {
        setToken(null,null);
        setUser(null);
    }
    useEffect(() => {
      // Check if user data exists in localStorage on component mount
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, [setUser]);
  return (
    <Navbar
      fluid
      rounded
    >
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          (De)Compress
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          inline
          label={<Avatar alt="User settings" img={`${currentUser.photoURL}`} rounded/>}
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {currentUser.name}
            </span>
            <span className="block truncate text-sm font-medium">
              {currentUser.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>
            Sign out
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          active
          href="/dashboard"
        >
          <p>
            Home
          </p>
        </Navbar.Link>
        <Navbar.Link href="/history">
          History
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
