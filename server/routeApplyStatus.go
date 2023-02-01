package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ApplyStatus(db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		// Get param
		bv := ctx.Param("bv")

		// Get video
		var videos []Video
		{
			err := db.Model(&Video{}).Where("bvid = ?", bv).Find(&videos).Error
			if err != nil {
				ctx.JSON(http.StatusOK, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		if len(videos) >= 2 {
			log.Println("[Error] Video count >= 2")
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "数据库中有重复视频，请告知服务器管理员",
			})
			return
		}
		if len(videos) == 0 {
			ctx.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "Video not exist",
			})
			return
		}
		video := videos[0]

		// Send response
		ctx.JSON(http.StatusOK, gin.H{
			"success":  true,
			"owner_id": video.OwnerID,
			"pending":  video.Pending,
			"valid":    video.Valid,
		})
	}
}
