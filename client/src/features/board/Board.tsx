import {
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  DownOutlined,
} from "@ant-design/icons";
import { message, Menu, Dropdown, Space, Skeleton, Table } from "antd";
import React, { useState, useMemo } from "react";
import {
  useGetAuthQuery,
  useGetBoardQuery,
  usePostAuditMutation,
} from "../api/apiSlice";
import BoardFail from "./BoardFail";
import { Video } from "../model/Model";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";

interface DataType {
  key: string;
  name: string;
  status: string;
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
    title: "状态",
    dataIndex: "status",
    key: "status",
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

function vidToStatus(video: Video) {
  if (video.Valid && video.Pending) {
    return "待审核";
  } else if (video.Valid && !video.Pending) {
    return "已过审";
  } else if (!video.Valid && video.Pending) {
    return "已忽略";
  } else {
    return "未过审";
  }
}

const Board: React.FC = () => {
  const videos = useGetBoardQuery(undefined);
  const authCheck = useGetAuthQuery(undefined);
  const [viewMode, setViewMode] = useState(1);
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
  const onClick = ({ key }: any) => {
    setViewMode(+key);
  };
  const viewFilter = (video: Video) => {
    if (viewMode === 3) {
      return true;
    } else if (viewMode === 2) {
      return video.Valid;
    } else {
      return video.Valid && !video.Pending;
    }
  };
  const data: DataType[] = useMemo(() => {
    if (videos.isSuccess && videos.data.success) {
      const videosData = videos.data.videos;
      return videosData
        .filter(viewFilter)
        .map((video: Video, index: number) => ({
          key: index + 1,
          status: vidToStatus(video),
          name: video.Owner.Name,
          bvid: video.Bvid,
          timeMs: video.TimeMs,
        }));
    } else {
      return null;
    }
  }, [videos, viewMode]);
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">只看已过审</Menu.Item>
      <Menu.Item key="2">已过审和待审</Menu.Item>
      <Menu.Item key="3">全部记录</Menu.Item>
    </Menu>
  );
  if (videos.isLoading) {
    return <Skeleton />;
  } else if (videos.isSuccess) {
    if (videos.data.success) {
      return (
        <>
          <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                筛选
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <div style={{ margin: "8px" }}></div>
          <Table columns={columns} dataSource={data} />
        </>
      );
    } else {
      return <BoardFail message={videos.data.message} />;
    }
  } else {
    return <BoardFail message="网络异常" />;
  }
};

export default Board;
