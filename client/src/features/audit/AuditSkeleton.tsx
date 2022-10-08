import { PlayCircleOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton } from 'antd';
import React from 'react';

const { Meta } = Card;

const AuditSkeleton: React.FC = () => {
    return (
        <Card
            style={{ width: 300 }}
            cover={
                <img
                    alt="Cover"
                    src="loading.png"
                />
            }
            actions={[
                <PlayCircleOutlined key="play" />,
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
            ]}
        >
            <Skeleton loading avatar active>
                <Meta
                    avatar={<Avatar src="favicon.ico" />}
                    title="昵称加载失败"
                    description="标题加载失败"
                />
            </Skeleton>
        </Card>
    )
};

export default AuditSkeleton;