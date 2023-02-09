import { CloseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import { message, Space, Skeleton, Table } from "antd";
import React from "react";
import {
  useGetAuthQuery,
  useGetBoardQuery,
  usePostAuditMutation,
} from "../api/apiSlice";
import BoardFail from "./BoardFail";
import { Video } from "../model/Model";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  name: string;
  bvid: string;
  timeMs: number;
}

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

const columnsBase: ColumnsType<DataType> = [
  {
    title: "排名",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "玩家",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "视频",
    dataIndex: "bvid",
    key: "bvid",
    render: (text) => (
      <a href={`https://www.bilibili.com/video/${text}/`}>{text}</a>
    ),
  },
  {
    title: "时间",
    dataIndex: "timeMs",
    key: "timeMs",
    render: (text) => (
      <>
        {Math.floor(text / 1000)} 秒 {Math.floor(text % 1000)} 毫秒
      </>
    ),
  },
];

const Board: React.FC = () => {
  const videos = useGetBoardQuery(undefined);
  const authCheck = useGetAuthQuery(undefined);
  const isLogin = authCheck.isSuccess && authCheck.data.success;
  const [postAudit, { isLoading }] = usePostAuditMutation();
  const columnsAudit: ColumnsType<DataType> = [
    {
      title: "操作",
      key: "op",
      render: (_, record) => (
        <Space>
          <CheckCircleTwoTone
            key="check"
            onClick={async () =>
              await audit(
                true,
                false,
                record.bvid,
                record.timeMs,
                postAudit,
                isLoading
              )
            }
          />

          <CloseCircleTwoTone
            key="close"
            onClick={async () =>
              await audit(
                false,
                false,
                record.bvid,
                record.timeMs,
                postAudit,
                isLoading
              )
            }
          />
        </Space>
      ),
    },
  ];
  // 即使强行 isLogin = true 发 POST, 后端也会再次判断是否登入, 因此别急
  const columns = isLogin ? columnsBase.concat(columnsAudit) : columnsBase;
  let content, suffix;
  if (videos.isLoading) {
    content = <Skeleton />;
  } else if (videos.isSuccess) {
    if (videos.data.success) {
      const data: DataType[] = videos.data.videos
        .filter((video: Video) => !video.Pending)
        .map((video: Video, index: number) => ({
          key: index + 1,
          name: video.Owner.Name,
          bvid: video.Bvid,
          timeMs: video.TimeMs,
        }));
      content = <Table columns={columns} dataSource={data} />;
    } else {
      suffix = <BoardFail message={videos.data.message} />;
    }
  } else {
    suffix = <BoardFail message="网络异常" />;
  }
  return (
    <>
      {content}
      {suffix}
    </>
  );
};

export default Board;
