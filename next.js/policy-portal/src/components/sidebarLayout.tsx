'use client'
import Link from 'next/link';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faPlus,
  faListCheck,
  faKey,
  faHome,
  faFile,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { getAuthenticatedRole } from '@/utils/authenticate';
import { useSession } from 'next-auth/react';

  function SidebarLayout() {
  //  const { data: session } = useSession();
  // const role = session?.user?.role;
 const role = getAuthenticatedRole();


  return (
    <>
      <Menu rootStyles={{ marginTop: '10px' }}>
        <MenuItem icon={<FontAwesomeIcon icon={faHome} />} component={<Link href="/dashboard" />}>
          Home
        </MenuItem>
      </Menu>

      <Menu rootStyles={{ marginTop: '10px' }}>
        <MenuItem icon={<FontAwesomeIcon icon={faFile} />} component={<Link href="/view_policy" />}>
          View Policy
        </MenuItem>
      </Menu>

      <Menu rootStyles={{ marginTop: '10px' }}>
        <SubMenu label="Policies" icon={<FontAwesomeIcon icon={faAddressCard} />}>
          <MenuItem icon={<FontAwesomeIcon icon={faPlus} />} component={<Link href="/add_policy" />}>Add policy</MenuItem>
          <MenuItem icon={<FontAwesomeIcon icon={faListCheck} />} component={<Link href="/manage_policies" />}>
            Manage policy
          </MenuItem>
        </SubMenu>
        <MenuItem icon={<FontAwesomeIcon icon={faKey} />} component={<Link href="/change_password" />}>
          Change Password
        </MenuItem>
      </Menu>
      {role ==='admin' &&(
      <Menu rootStyles={{ marginTop: '10px' }}>
        <MenuItem icon={<FontAwesomeIcon icon={faUser} />} component={<Link href="/admin_panel" />}>
          Admin panel
        </MenuItem>
      </Menu>
    )}


      <div style={{ position: 'absolute', bottom: '40px', width: '100%' }}>
        <Menu>
          <MenuItem
            style={{ color: 'red', backgroundColor: 'rgba(191, 200, 214, 0.9)' }}
            icon={<FontAwesomeIcon icon={faRightFromBracket} />} component={<Link href="/logout" />}>
        
            Logout
          </MenuItem>
        </Menu>
  

      </div>
    </>
  );
}
export default React.memo(SidebarLayout);