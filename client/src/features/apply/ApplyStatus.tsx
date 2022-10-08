import { Spin, Steps } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetApplyQuery } from '../api/apiSlice';
import ProgressError from './ProgressError';
import ProgressFail from './ProgressFail';
import ProgressPending from './ProgressPending';
import ProgressSuccess from './ProgressSuccess';

const { Step } = Steps;

const ApplyStatus: React.FC = () => {
    const params = useParams()
    const result = useGetApplyQuery(params.bvid)
    let content, title2, desc2, title3, desc3, step
    if (result.isError || (result.isSuccess && !result.data.success)) {
        content = <ProgressError />
        title2 = "申请不存在"
        desc2 = "请在申请页面提交申请"
        title3 = "审核未进行"
        desc3 = "正确提交申请后开审"
        step = 1
    } else {
        if (!result.isSuccess) {
            return (
                <Spin style={{ margin: '800px auto' }} spinning={!result.isSuccess} size="large" />
            )
        }
        const passed = (!result.data.pending) && result.data.valid
        const notFailed = result.data.pending || result.data.valid
        if (notFailed) {
            content = passed ? <ProgressSuccess /> : <ProgressPending />
        } else {
            content = <ProgressFail />
        }
        title2 = "等待审核"
        desc2 = "预计 5 个节假日内审核完成"
        title3 = notFailed ? "审核通过" : "审核未通过"
        desc3 = notFailed ? "正式成为协会成员！" : "可重新申请入会"
        step = result.data.pending ? 1 : 2
    }
    return (
        <div>
            <Steps current={step}>
                <Step title="提交申请" description={`已提交 ${params.bvid}`} />
                <Step title={title2} description={desc2} />
                <Step title={title3} description={desc3} />
            </Steps>
            {content}
        </div>
    )
};

export default ApplyStatus;