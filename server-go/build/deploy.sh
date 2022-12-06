echo "Start build!"
rm itom-admin
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
scp
ssh cdeer@cdeer > /dev/null 2>&1 << eeooff
rm 
kill -9 $(netstat -nlp | grep :81 | awk '{print $7}' | awk -F"/" '{ print $1 }')
nohup
exit
eeooff


