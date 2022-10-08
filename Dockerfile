# 创建 Golang 编译镜像
FROM golang:1.19.1-alpine3.16 AS server-builder
WORKDIR /build
RUN adduser -u 10001 -D app-runner

# 下载依赖
ENV GOPROXY https://goproxy.cn
COPY ./server/go.mod .
COPY ./server/go.sum .
RUN go mod download

# 编译项目
COPY ./server .
RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -tags=jsoniter -a -o server .

# 创建 npm 编译镜像
FROM node:12-alpine as client-builder
WORKDIR /build

# 下载依赖
RUN npm config set registry https://registry.npm.taobao.org
COPY ./client/package.json .
RUN npm install --omit=dev

# 编译项目
COPY ./client .
RUN npm run build

# 创建纯净 Alpine 镜像
FROM alpine:3.16 AS final
WORKDIR /app

# 修改时区
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

# 复制资源
COPY --from=server-builder /build/server ./
COPY --from=server-builder /etc/passwd /etc/passwd
COPY --from=server-builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
RUN mkdir client
COPY --from=client-builder /build/build ./client

# 低权运行应用
USER app-runner
ENTRYPOINT ["/app/server"]