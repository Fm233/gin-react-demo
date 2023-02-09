import {
  PlayCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { Avatar, Card, message, Modal, Button, Input } from "antd";
import { useState } from "react";
import { usePostAuditMutation } from "../api/apiSlice";
import { Video } from "../model/Model";

const { Meta } = Card;

async function audit(
  valid: boolean,
  pending: boolean,
  bvid: string,
  timeMs: number,
  postAudit: Function,
  isLoading: boolean
) {
  if (isLoading) {
    return;
  }
  try {
    const result = await postAudit({
      id: bvid,
      TimeMs: timeMs,
      Valid: valid,
      Pending: pending,
    }).unwrap();
    if (!result.success) {
      message.error(result.message);
      return;
    }
    message.success("成功提交！");
  } catch {
    message.error("提交失败……");
  }
}

const AuditCard = (props: any) => {
  const video: Video = props.video;
  const pic = video.Pic;
  const bvid = video.Bvid;
  const owner = video.Owner;
  const ownerName = owner.Name;
  const face = owner.Face;
  const [postAudit, { isLoading }] = usePostAuditMutation();
  const [timeMs, setTimeMs] = useState(video.TimeMs);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Card
        style={{ width: 300 }}
        cover={<img alt="Cover" src={pic} />}
        actions={[
          <a
            href={`https://www.bilibili.com/video/${bvid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlayCircleOutlined key="play" />
          </a>,
          <FieldTimeOutlined key="time" onClick={() => setModalOpen(true)} />,
          <CheckCircleOutlined
            key="check"
            onClick={async () =>
              await audit(true, false, bvid, timeMs, postAudit, isLoading)
            }
          />,
          <CloseCircleOutlined
            key="close"
            onClick={async () =>
              await audit(false, false, bvid, timeMs, postAudit, isLoading)
            }
          />,
        ]}
      >
        <Meta
          avatar={<Avatar src={face} />}
          title={ownerName}
          description={timeMs}
        />
      </Card>
      ,
      <Modal
        open={modalOpen}
        // TODO onOk 的时候就 approve 是不是不太好
        onOk={async () => {
          await audit(true, false, bvid, timeMs, postAudit, isLoading);
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button
            key="back"
            loading={isLoading}
            onClick={() => setModalOpen(false)}
          >
            取消
          </Button>,
          <Button
            key="check"
            type="primary"
            loading={isLoading}
            onClick={async () => {
              await audit(true, false, bvid, timeMs, postAudit, isLoading);
              setModalOpen(false);
            }}
          >
            准许入会
          </Button>,
          <Button
            key="close"
            loading={isLoading}
            onClick={async () => {
              await audit(false, false, bvid, timeMs, postAudit, isLoading);
              setModalOpen(false);
            }}
          >
            驳回
          </Button>,
        ]}
      >
        <p>修改通关时间</p>
        <Input
          placeholder="通关时间……"
          value={timeMs}
          onChange={(e) => setTimeMs(+e.target.value)}
        />
      </Modal>
    </>
  );
};

export default AuditCard;
