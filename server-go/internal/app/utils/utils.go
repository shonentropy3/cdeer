package utils

// SliceIsExist 判断元素是否在slice
func SliceIsExist[T comparable](slice []T, val T) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}
