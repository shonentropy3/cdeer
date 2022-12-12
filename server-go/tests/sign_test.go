package tests

import (
	"code-market-admin/internal/app/blockchain"
	"testing"
)

func TestVerifySig(t *testing.T) {
	type args struct {
		from   string
		sigHex string
		msg    []byte
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{name: "验证通过#00", args: args{"0x0EaE3eF6CC7176553E6B45d94e9eFDE2Da7B82a5", "0x34850b7e36e635783df0563c7202c3ac776df59db5015d2b6f0add33955bb5c43ce35efb5ce695a243bc4c5dc4298db40cd765f3ea5612d2d57da1e4933b2f201b", []byte("Example `personal_sign` message")}, want: true},
		{name: "错误地址", args: args{"0x0EaE3eF6CC7176553E6B45d94e9eFDE2Da7B82a6", "0x34850b7e36e635783df0563c7202c3ac776df59db5015d2b6f0add33955bb5c43ce35efb5ce695a243bc4c5dc4298db40cd765f3ea5612d2d57da1e4933b2f201b", []byte("Example `personal_sign` message")}, want: false},
		{name: "错误签名", args: args{"0x0EaE3eF6CC7176553E6B45d94e9eFDE2Da7B82a5", "0x34850b7e36e635783df0563c7202c3ac776df59db5015d2b6f0add33955bb5c43ce35efb5ce695a243bc4c5dc4298db40cd765f3ea5612d2d57da1e4933b2f201c", []byte("Example `personal_sign` message")}, want: false},
		{name: "验证通过#01", args: args{"0x8d1db6abf4a696db99df0ed8efdde31f7caa7998", "0x0a344359e6987aff9688c7099db48c2533826f0cef9a7b88c4a11f96621997b55e3b45c9f9dd158b1746764842beb4322de16357ea275cb51cf301110a33fc401b", []byte("Hello，Dec")}, want: false},
		//{name: "验证通过#02", args: args{"0x8d1db6abf4a696db99df0ed8efdde31f7caa7998", "0x1cdc168c6a7292a7e213f191e4517a5ecbf291a1f1bbc7ba1737eb7e903856f571d0534146b3b4b077eae0ea9f4e1f1f4da4385ebaeb9b412148f1392ed444461b", []byte("Welcome to OpenSea!\n\nClick to sign in and accept the OpenSea Terms of Service: https://opensea.io/tos\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n0x8d1db6abf4a696db99df0ed8efdde31f7caa7998\n\nNonce:\ne3fb3103-1cae-4991-9b31-877bb1efb504")}, want: true},
		{name: "验证通过#03", args: args{"0x8d1db6abf4a696db99df0ed8efdde31f7caa7998", "0x7b2af1f0ea35ab7dd5d23cddd53cbb0a742aba6ba5f108825a3c247b20cdaa0a60e45c199edc27d66e34192df122a7a788d9a86dd3ae1a36c7ade8d03d908d571c", []byte("This transaction was processed at block \nhttps://etherscan.io/\nThis request will not trigger a blockchain transaction or cost any gas fees.")}, want: false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := blockchain.VerifySig(tt.args.from, tt.args.sigHex, tt.args.msg); got != tt.want {
				t.Errorf("VerifySig() = %v, want %v", got, tt.want)
			}
		})
	}
}
