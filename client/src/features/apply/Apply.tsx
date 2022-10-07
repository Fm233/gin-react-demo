import React, { useState } from 'react';
import { Alert, Input } from 'antd';
import { usePostApplyMutation } from '../api/apiSlice';
import { useNavigate } from 'react-router-dom';
const { Search } = Input;

const Apply: React.FC = () => {
    const [bv, setBV] = useState('');
    const [inError, setInError] = useState(false)
    const nav = useNavigate()
    const [postApply, { isLoading }] = usePostApplyMutation();
    const [errorMessage, setErrorMessage] = useState('')
    const alert = inError ? <Alert style={{ margin: '5px 0' }} message={errorMessage} type="error" /> : undefined
    return (
        <div style={{ margin: '300px auto', maxWidth: '400px' }}>
            <Search
                placeholder="输入视频 BV 号"
                allowClear
                status={inError ? 'error' : ''}
                value={bv}
                loading={isLoading}
                onChange={(e) => { setBV(e.target.value) }}
                onSearch={async (value: string) => {
                    const bv = value.startsWith('BV') ? value : (value.startsWith('bv') ? 'BV' + value.substring(2) : 'BV' + value)
                    if (bv.length !== 12) {
                        setInError(true)
                        setErrorMessage("BV 号长度错误！")
                        return
                    }
                    try {
                        const result = await postApply({ bv }).unwrap()
                        console.log(result)
                        if (result["success"] === false) {
                            setInError(true)
                            setErrorMessage(result["message"])
                            return
                        }
                        setInError(false)
                        nav(`/apply/${bv}`)
                    }
                    catch (err: any) {
                        setInError(true)
                        console.log(err)
                        setErrorMessage("Some error occurred :(")
                    }
                }}
                enterButton="提交"
                size="large"
            />
            {alert}
        </div>
    );
};

export default Apply;