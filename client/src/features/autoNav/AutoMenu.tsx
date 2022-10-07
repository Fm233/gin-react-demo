import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { Menu } from 'antd';
import { getTranslation, menuItem as menuItems } from './config';

export const AutoMenu: React.FC = () => {
    const location = useLocation()
    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname.split('/')[1]]}
            items={menuItems.map((item, index) => {
                const key = item
                return {
                    key,
                    label: <Link to={key}>
                        {getTranslation(key)}
                    </Link>,
                }
            })}
        />
    )
};