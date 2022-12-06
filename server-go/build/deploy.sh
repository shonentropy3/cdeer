echo "Start build!"
cd ..
rm code-market-admin
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
ssh cdeer@cdeer "killall -9 code-market-admin"
scp code-market-admin cdeer@cdeer:/home/cdeer/code/code-market-server
echo "Start exe"
ssh cdeer@cdeer > /dev/null 2>&1 << eeooff
cd /home/cdeer/code/code-market-server/
nohup ./code-market-admin > ./nohup.log 2>&1 &
exit
eeooff


