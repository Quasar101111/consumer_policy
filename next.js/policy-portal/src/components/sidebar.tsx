'use client';
import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAddressCard,
    faPlus,
    faListCheck,
    faLock,
    faKey,
    faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

function CollapsibleSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
            {/* Collapse button OUTSIDE the Sidebar */}
            <button
                onClick={toggleSidebar}
                style={{
                    position: 'absolute',
                    top: '16px',
                    left: collapsed ? '16px' : '226px', // 250px - button width/2 when expanded, 80px + margin when collapsed
                    transition: 'left 0.3s',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '50%',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    userSelect: 'none',
                    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                }}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 5l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5l-6 5 6 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            <Sidebar
                collapsed={collapsed}
                width="250px"
                collapsedWidth="80px"
                backgroundColor="rgb(249, 249, 249, 0.6)"
                image='https://t4.ftcdn.net/jpg/12/67/56/29/360_F_1267562960_W9EtaNdIBcJCtGK1IUOkq4a5FnLHRwmw.jpg'
                rootStyles={{
                    position: 'relative',
                    paddingTop: '40px',
                }}
            >

                <Menu
                    rootStyles={{
                        marginTop: '10px',
                    }}
                >
                    <SubMenu label="Policies" icon={<FontAwesomeIcon icon={faAddressCard} />}>
                        <MenuItem icon={<FontAwesomeIcon icon={faPlus} />}>Add policy</MenuItem>
                        <MenuItem icon={<FontAwesomeIcon icon={faListCheck} />}>Manage policy</MenuItem>
                    </SubMenu>
                    <MenuItem icon={<FontAwesomeIcon icon={faKey} />}>change password</MenuItem>

                </Menu>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        width: '100%',
                    }}
                >
                    <Menu >
                        <MenuItem
                            style={{
                                marginTop: 'auto',
                                color: 'red',
                                backgroundColor: '(191, 200, 214,.9)'
                            }}
                            icon={<FontAwesomeIcon icon={faRightFromBracket} />}

                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </Sidebar>


         




        </div>

        
    );
}

export default CollapsibleSidebar;