import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const AuditFail = (props: any) => (
    <Result
        style={{ margin: '150px auto' }}
        status="error"
        title="加载失败"
        subTitle={props.message}
        extra={[
            <Link to="/audit">
                <Button type="primary" key="console">刷新本页</Button>
            </Link>,
            <Link to="/">
                <Button key="buy">回到主页</Button>
            </Link>,
        ]}
    />
);

export default AuditFail;