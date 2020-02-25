FROM registry.cn-shenzhen.aliyuncs.com/hy1214/node_pm2
 

# copy files local file         Docker dir
ADD / /rxx
RUN npm i

EXPOSE 8090
CMD  pm2 start src/index.js -o NULL -e NULL -i 1  --no-daemon
