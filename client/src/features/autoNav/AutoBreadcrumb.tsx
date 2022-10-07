import { Link, Location, useLocation } from 'react-router-dom';
import React, { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { getTranslation } from './config';

export const AutoBreadcrumb: React.FC = () => {
    const location = useLocation()
    const breadcrumbItems = useMemo(() => locationToBreadcrumb(location), [location])
    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbItems}
        </Breadcrumb>
    )
};

const locationToBreadcrumb = (location: Location) => {
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const extraBreadcrumbItems = pathSnippets.map((key, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{getTranslation(key)}</Link>
            </Breadcrumb.Item>
        );
    });

    return [
        <Breadcrumb.Item key="home">
            <Link to="/">首页</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);
};