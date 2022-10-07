package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Audit(db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		// Check auth
		session := sessions.Default(ctx)
		if session.Get("password") != AdminPassword {
			ctx.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "Auth failed",
			})
			return
		}

		// Get videos
		var videos []Video
		{
			err := db.Model(&Video{}).Where("pending = 1").Find(&videos).Error
			if err != nil {
				ctx.JSON(http.StatusOK, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}

		// Respond
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"videos":  videos,
		})
	}
}
