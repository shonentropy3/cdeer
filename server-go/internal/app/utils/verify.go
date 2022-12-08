package utils

var (
	IdVerify             = Rules{"ID": {NotEmpty()}}
	PageInfoVerify       = Rules{"Page": {NotEmpty()}, "PageSize": {NotEmpty(), Le("30")}}
	PageSizeLimitVerify  = Rules{"PageSize": {Le("30")}}
	UserInfoVerify       = Rules{"Address": {NotEmpty()}}
	UpdateUserInfoVerify = Rules{"Address": {NotEmpty()}}
	CreateUserInfoVerify = Rules{"Address": {NotEmpty()}}
	ApplyListVerify      = Rules{"ApplyAddr": {NotEmpty()}}
	CreateTaskVerify     = Rules{"Issuer": {NotEmpty()}, "Hash": {NotEmpty()}, "Title": {NotEmpty()}, "Desc": {NotEmpty()}, "Budget": {NotEmpty()}, "Period": {NotEmpty()}, "Currency": {NotEmpty()}}
)
