import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const ProgressPending: React.FC = () => (
    <Result
        style={{ margin: '120px auto' }}
        title="入会申请已成功提交！"
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

export default ProgressPending;