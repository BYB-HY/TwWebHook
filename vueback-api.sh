#!/bin/bash
WORK_PATH='/usr/projects/manageApi'
cd $WORK_PATH
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "开始执行构建"
docker build -t manageApi .
echo "停止旧容器并删除旧容器"
docker stop manageApi-container
docker rm manageApi-container
echo "启动新容器"
docker container run -p 3000:3000 --name manageApi-container -d manageApi:1.0