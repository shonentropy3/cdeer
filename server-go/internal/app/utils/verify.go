package utils

var (
	IdVerify            = Rules{"ID": {NotEmpty()}}
	PageInfoVerify      = Rules{"Page": {NotEmpty()}, "PageSize": {NotEmpty(), Le("30")}}
	PageSizeLimitVerify = Rules{"PageSize": {Le("30")}}
	// 用户
	UserInfoVerify       = Rules{"Address": {NotEmpty()}}
	UpdateUserInfoVerify = Rules{"Address": {NotEmpty()}}
	CreateUserInfoVerify = Rules{"Address": {NotEmpty()}}
	// 报名
	ApplyListVerify    = Rules{"ApplyAddr": {NotEmpty()}}
	CreateApplyVerify  = Rules{"ApplyAddr": {NotEmpty()}}
	UpdatedApplyVerify = Rules{"ID": {NotEmpty()}}
	DeleteApplyVerify  = Rules{"ID": {NotEmpty()}}
	// 需求
	CreateTaskVerify  = Rules{"Issuer": {NotEmpty()}, "Hash": {NotEmpty()}, "Title": {NotEmpty()}, "Desc": {NotEmpty()}, "Budget": {NotEmpty()}, "Period": {NotEmpty()}, "Currency": {NotEmpty()}}
	UpdatedTaskVerify = Rules{"TaskID": {NotEmpty()}}
	DeleteTaskVerify  = Rules{"TaskID": {NotEmpty()}}
	// 任务
	GetOrderListVerify = Rules{"Issuer": {NotEmpty()}}
)
