import { Button, Checkbox, Form, Input } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostAuthMutation } from '../api/apiSlice';

const Auth: React.FC = () => {

    const nav = useNavigate()
    const [password, setPassword] = useState('')
    const [inError, setInError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [postAuth, { isLoading }] = usePostAuthMutation();

    return (
        <Form
            name="basic"
            style={{ margin: '200px auto', maxWidth: '1000px' }}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 8 }}
            initialValues={{ username: 'Admin', agree: true }}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
            >
                <Input disabled />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                validateStatus={inError ? 'error' : ''}
                help={errorMessage}
            >
                <Input.Password
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Item>

            <Form.Item
                name="agree"
                valuePropName="checked"
                wrapperCol={{ offset: 9, span: 16 }}
            >
                <Checkbox>我已阅读规范审核协议</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    onClick={async () => {
                        try {
                            if (password === '') {
                                setInError(true)
                                setErrorMessage("请输入密码")
                                return
                            }
                            const result = await postAuth({ password }).unwrap()
                            if (result["success"] === false) {
                                setInError(true)
                                setErrorMessage(result["message"])
                                return
                            }
                            setInError(false)
                            nav(`/audit`)
                        }
                        catch (err: any) {
                            setInError(true)
                            console.log(err)
                            setErrorMessage("发生了错误 :(")
                        }
                    }}>
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Auth;