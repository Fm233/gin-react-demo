import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const ProgressSuccess: React.FC = () => (
  <Result
    style={{ margin: "120px auto" }}
    status="success"
    title="成功入会！"
    subTitle="本页面可以视为该视频作者的入会证明"
    extra={[
      <Link to="/">
        <Button type="primary" key="console">
          回到主页
        </Button>
      </Link>,
      <Link to="/apply">
        <Button key="buy">再次申请</Button>
      </Link>,
    ]}
  />
);

export default ProgressSuccess;

