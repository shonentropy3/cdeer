echo "Start build!"
cd ..
rm code-market-admin
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
ssh cdeer@cdeer > /dev/null 2>&1 << eeooff
kill -9 $(netstat -nlp | grep :8086 | awk '{print $7}' | awk -F"/" '{ print $1 }')
exit
eeooff
scp code-market-admin cdeer@cdeer:/home/cdeer/code/code-market-server
echo "Start exe"
ssh cdeer@cdeer > /dev/null 2>&1 << eeooff
nohup /home/cdeer/code/code-market-server/code-market-admin &
exit
eeooff


