import { Skeleton, Table } from "antd";
import React from "react";
import { useGetBoardQuery } from "../api/apiSlice";
import BoardFail from "./BoardFail";
import { Video } from "../model/Model";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  name: string;
  bvid: string;
  time: number;
}

const columns: ColumnsType<DataType> = [
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
    dataIndex: "time",
    key: "time",
    render: (text) => (
      <>
        {Math.floor(text / 1000)} 秒 {Math.floor(text % 1000)} 毫秒
      </>
    ),
  },
];

const Board: React.FC = () => {
  const videos = useGetBoardQuery(undefined);
  let content, suffix;
  if (videos.isLoading) {
    content = <Skeleton />;
  } else if (videos.isSuccess) {
    if (videos.data.success) {
      const data: DataType[] = videos.data.videos.map(
        (video: Video, index: number) => ({
          key: index + 1,
          name: video.Owner.Name,
          bvid: video.Bvid,
          time: video.TimeMs,
        })
      );
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
