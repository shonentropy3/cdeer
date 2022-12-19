package middleware

import (
	"code-market-admin/internal/app/model/response"
	"code-market-admin/internal/app/utils"
	"github.com/gin-gonic/gin"
	"strings"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// jwt鉴权取头部信息： x-token
		token := c.Request.Header.Get("x-token")
		if token == "" {
			response.FailWithDetailed(gin.H{"reload": true}, "授权已过期或非法访问1", c)
			c.Abort()
			return
		}
		j := utils.NewJWT()
		// parseToken 解析token包含的信息
		claims, err := j.ParseToken(token)
		if err != nil {
			if err == utils.TokenExpired {
				response.FailWithDetailed(gin.H{"reload": true}, "授权已过期", c)
				c.Abort()
				return
			}
			response.FailWithDetailed(gin.H{"reload": true}, err.Error(), c)
			c.Abort()
			return
		}
		// 白名单模式
		//_, err = global.Cache.Get(claims.Address)
		//if err != nil {
		//	response.FailWithDetailed(gin.H{"reload": true}, "授权已过期或非法访问2", c)
		//	c.Abort()
		//	return
		//}
		// 校验请求头地址与JWT相同
		address := c.Request.Header.Get("x-address")
		if address == "" || strings.ToLower(address) != strings.ToLower(claims.Address) {
			response.FailWithDetailed(gin.H{"reload": true}, "授权已过期或非法访问3", c)
			c.Abort()
			return
		}
		// c.Set("claims", claims)
		c.Set("address", claims.Address)
		c.Set("userID", claims.UserID)

		c.Next()
	}
}
