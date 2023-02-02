package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Board(db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		// Get Videos
		var videos []Video
		{
			err := db.Model(&Video{}).Order("TimeMs").Preload("Owner").Where("valid = 1").Find(&videos).Error
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
