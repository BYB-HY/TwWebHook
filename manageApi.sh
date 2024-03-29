#!/bin/bash
WORK_PATH='/usr/projects/TwManageApi'
cd $WORK_PATH
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "开始执行构建"
docker build -t TwManageApi .
echo "停止旧容器并删除旧容器"
docker stop TwManageApi-container
docker rm TwManageApi-container
echo "启动新容器"
docker container run -p 3000:3000 --name TwManageApi-container -d TwManageApi:1.0