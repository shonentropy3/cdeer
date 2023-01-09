package config

type Contract struct {
	DefaultNet string `mapstructure:"default-net" json:"default-net" yaml:"default-net"` // 默认网络
	Signature  string `mapstructure:"signature" json:"signature" yaml:"signature"`       // 签名信息
}
