import { Space } from 'antd';
import React from 'react';
import { useGetAuditQuery } from '../api/apiSlice';
import AuditCard from './AuditCard';
import AuditFail from './AuditFail';
import AuditSkeleton from './AuditSkeleton';

const Audit: React.FC = () => {
    const videos = useGetAuditQuery(undefined)
    let content, suffix
    if (videos.isLoading) {
        content = new Array(10).fill(null).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <AuditSkeleton key={index} />
        ))
    } else if (videos.isSuccess) {
        if (videos.data.success) {
            content = videos.data.videos.map((video: any, index: number) => (
                <AuditCard key={index} video={video} />
            ))
        } else {
            suffix = <AuditFail message={videos.data.message} />
        }
    } else {
        suffix = <AuditFail message="网络异常" />
    }
    return (
        <>
            <Space size={[8, 16]} wrap>
                {content}
            </Space>
            {suffix}
        </>
    )
};

export default Audit;