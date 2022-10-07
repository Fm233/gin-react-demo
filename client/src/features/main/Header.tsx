import { Carousel } from 'antd';
import React from 'react';

const contentStyle: React.CSSProperties = {
    height: '500px',
    color: '#fff',
    lineHeight: '500px',
    textAlign: 'center',
    background: '#364d79',
};

export const Header: React.FC = () => (
    <Carousel autoplay>
        <div>
            <h3 style={contentStyle}>没有要展示的内容</h3>
        </div>
        <div>
            <h3 style={contentStyle}>真的没有！</h3>
        </div>
        <div>
            <h3 style={contentStyle}>……确实没有</h3>
        </div>
        <div>
            <h3 style={contentStyle}>没有捏</h3>
        </div>
    </Carousel>
);