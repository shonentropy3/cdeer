package config

type BlockChain struct {
	Name     string `mapstructure:"name" json:"name" yaml:"name"`             // 名称
	Provider string `mapstructure:"provider" json:"provider" yaml:"provider"` // RPC Provider
}
