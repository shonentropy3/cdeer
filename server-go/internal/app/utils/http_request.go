package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"strings"
	"time"
)

// GetRequest 发送GET请求
// url：         请求地址
// response：    请求返回的内容
func GetRequest(url string) (string, error) {
	// 超时时间：60秒
	client := &http.Client{Timeout: time.Second * 60}
	req, err := http.NewRequest("GET", url, nil)
	req.Header.Set("Accept", "*/*")
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		return "", err
	}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	result, _ := io.ReadAll(resp.Body)
	return string(result), nil
}

// PostRequest 发送POST请求
// url：         请求地址
// data：        POST请求提交的数据
// contentType： 请求体格式，如：application/json
// content：     请求放回的内容
func PostRequest(url string, data interface{}, contentType string) ([]byte, error) {
	// 超时时间：60秒
	client := &http.Client{Timeout: 60 * time.Second}
	jsonStr, _ := json.Marshal(data)
	resp, err := client.Post(url, contentType, bytes.NewBuffer(jsonStr))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	result, _ := io.ReadAll(resp.Body)
	return result, nil
}

// PostFileRequest 发送POST请求 上传文件
// url：         请求地址
// data：        POST请求提交的数据
func PostFileRequest(url string, header *multipart.FileHeader) ([]byte, error) {
	file, err := header.Open()
	if err != nil {
		return err, hash
	}
	defer file.Close()

	body := &bytes.Buffer{}
	//创建一个multipart类型的写文件
	writer := multipart.NewWriter(body)
	//使用给出的属性名paramName和文件名filePath创建一个新的form-data头
	part, err := writer.CreateFormFile("file", header.Filename)
	if err != nil {
		fmt.Println(" post err=", err)
	}
	//将源复制到目标，将file写入到part   是按默认的缓冲区32k循环操作的，不会将内容一次性全写入内存中,这样就能解决大文件的问题
	_, err = io.Copy(part, file)
	err = writer.Close()
	if err != nil {
		fmt.Println(" post err=", err)
	}
	request, err := http.NewRequest("POST", uri, body)
	request.Header.Add("S-COOKIE2", "a=2l=310260000000000&m=460&n=00")
	//writer.FormDataContentType() ： 返回w对应的HTTP multipart请求的Content-Type的值，多以multipart/form-data起始
	request.Header.Set("Content-Type", writer.FormDataContentType())
	//设置host，只能用request.Host = “”，不能用request.Header.Add(),也不能用request.Header.Set()来添加host
	request.Host = "api.shouji.com"
	t := http.DefaultTransport.(*http.Transport).Clone()
	t.MaxIdleConns = 100
	t.MaxConnsPerHost = 100
	t.MaxIdleConnsPerHost = 100
	clt := http.Client{
		Timeout:   10 * time.Second,
		Transport: t,
	}
	defer clt.CloseIdleConnections()
	res, err := clt.Do(request)
	//http返回的response的body必须close,否则就会有内存泄露
	defer func() {
		res.Body.Close()
		fmt.Println("finish")
	}()
	if err != nil {
		fmt.Println("err is ", err)
	}
	body1, err1 := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println("ioutil.ReadAll  err is ", err1)
		return
	}
}

func GraphQlRequest(url string, payload *strings.Reader) (body []byte, err error) {
	client := &http.Client{}
	req, err := http.NewRequest("POST", url, payload)

	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err = io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	return
}
