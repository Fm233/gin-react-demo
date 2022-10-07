import React from 'react';
import { Layout } from 'antd';
import { AutoBreadcrumb } from '../autoNav/AutoBreadcrumb';
import { AutoMenu } from '../autoNav/AutoMenu';
const { Header, Content, Footer } = Layout;

type FrameProps = {
    children: React.ReactNode
}

export const Frame = (props: FrameProps) => {
    return (
        <Layout className="layout">
            <Header>
                <AutoMenu />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <AutoBreadcrumb />
                <div className="site-layout-content">
                    {props.children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>I love your mum</Footer>
        </Layout>
    );
}