package config

type Contract struct {
	Net       string `mapstructure:"net" json:"net" yaml:"net"`                   // 网络
	Provider  string `mapstructure:"provider" json:"provider" yaml:"provider"`    // API
	Signature string `mapstructure:"signature" json:"signature" yaml:"signature"` // 签名信息
}
