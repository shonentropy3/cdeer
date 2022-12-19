package initialize

import (
	"context"
	"github.com/allegro/bigcache/v3"
	"time"
)

func Cache() *bigcache.BigCache {
	config := bigcache.Config{
		Shards:             1024,
		LifeWindow:         time.Hour * 24,
		CleanWindow:        5 * time.Minute,
		MaxEntriesInWindow: 10000,
		MaxEntrySize:       500,
		StatsEnabled:       false,
		Verbose:            true,
		HardMaxCacheSize:   0,
		Logger:             bigcache.DefaultLogger(),
	}
	cache, err := bigcache.New(context.Background(), config)
	if err != nil {
		panic(err)
	}
	return cache
}
