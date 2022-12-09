package request

import "code-market-admin/internal/app/model"

type SetNftCacheRequest struct {
	model.Nft
}
type GetNftCacheRequest struct {
	model.Nft
}
type UpdateNftCacheRequest struct {
	model.Nft
}
type HaveNftRequest struct {
	model.Nft
}
