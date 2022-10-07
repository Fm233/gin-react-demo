import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const ProgressSuccess: React.FC = () => (
    <Result
        style={{ margin: '120px auto' }}
        status="success"
        title="成功入会！"
        subTitle="入会证明已经发送至你或视频发布者的 B 站私信"
        extra={[
            <Link to="/">
                <Button type="primary" key="console">回到主页</Button>
            </Link>,
            <Link to="/apply">
                <Button key="buy">再次申请</Button>
            </Link>,
        ]}
    />
);

export default ProgressSuccess;