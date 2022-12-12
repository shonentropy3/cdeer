package initialize

import (
	"context"
	"github.com/allegro/bigcache/v3"
	"time"
)

func Cache() *bigcache.BigCache {
	cache, err := bigcache.New(context.Background(), bigcache.DefaultConfig(time.Hour*24))
	if err != nil {
		panic(err)
	}
	return cache
}
