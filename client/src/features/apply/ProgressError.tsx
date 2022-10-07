import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const ProgressError: React.FC = () => (
    <Result
        style={{ margin: '120px auto' }}
        status="error"
        title="申请不存在"
        subTitle="请在申请页面提交申请"
        extra={[
            <Link to="/apply">
                <Button type="primary" key="console">现在申请</Button>
            </Link>,
            <Link to="/">
                <Button key="buy">回到主页</Button>
            </Link>,
        ]}
    />
);

export default ProgressError;