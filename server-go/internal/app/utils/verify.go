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
	GetApplyListVerify     = Rules{"TaskID": {NotEmpty()}}
	GetApplyVerify         = Rules{"ApplyAddr": {NotEmpty()}}
	CreateApplyVerify      = Rules{"Hash": {NotEmpty()}}
	UpdatedApplyVerify     = Rules{"TaskID": {NotEmpty()}, "ApplyAddr": {NotEmpty()}}
	UpdatedApplySortVerify = Rules{"ApplyAddr": {NotEmpty()}, "TaskID": {NotEmpty()}}
	DeleteApplyVerify      = Rules{"ApplyAddr": {NotEmpty()}, "TaskID": {NotEmpty()}, "Hash": {NotEmpty()}}
	// 需求
	CreateTaskVerify        = Rules{"Hash": {NotEmpty()}}
	UpdatedTaskVerify       = Rules{"Hash": {NotEmpty()}}
	DeleteTaskVerify        = Rules{"Hash": {NotEmpty()}}
	ModifyApplySwitchVerify = Rules{"TaskID": {NotEmpty()}}
	// 任务
	CreateOrderVerify = Rules{"TaskID": {NotEmpty()}}
	// 阶段划分
	CreatedStageVerify = Rules{"OrderId": {NotEmpty()}, "Signature": {NotEmpty()}, "SignAddress": {NotEmpty()}, "Stages": {NotEmpty()}}
)
