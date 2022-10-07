import React from 'react';
import Content from './Content';
import { Header } from './Header';

const Main: React.FC = () => {
    return (
        <div>
            <Header />
            <div style={{ margin: '100px auto', maxWidth: '1000px' }}>
                <Content />
            </div>
        </div>
    );
}

export default Main;