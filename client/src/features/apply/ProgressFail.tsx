import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const ProgressFail: React.FC = () => (
    <Result
        style={{ margin: '120px auto' }}
        status="error"
        title="审核未通过"
        subTitle="请重新提交申请"
        extra={[
            <Link to="/apply">
                <Button type="primary" key="console">重新申请</Button>
            </Link>,
            <Link to="/">
                <Button key="buy">回到主页</Button>
            </Link>,
        ]}
    />
);

export default ProgressFail;