package main

import (
	"io"
	"log"
	"net/http"
	"strconv"

	jsoniter "github.com/json-iterator/go"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuditConfirm(db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		// Check auth
		session := sessions.Default(ctx)
		if session.Get("password") != AdminPassword {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "Auth failed",
			})
			return
		}

		// Get param
		bv := ctx.Param("bv")

		// Try parse request
		postData, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": err.Error(),
			})
			return
		}
		timeJson := jsoniter.Get(postData, "time_ms")
		{
			err := timeJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		timeMsStr := timeJson.ToString()
		timeMs, err := strconv.Atoi(timeMsStr)
		{
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		validJson := jsoniter.Get(postData, "valid")
		{
			err := validJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		validStr := validJson.ToString()
		valid, err := strconv.ParseBool(validStr)
		{
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}

		// Try get video from db
		var videos []Video
		{
			err := db.Model(&Video{}).Preload("Owner").Where("bvid = ?", bv).Find(&videos).Error
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		if len(videos) >= 2 {
			log.Fatalln("Video count >= 2")
		}
		if len(videos) == 0 {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "Video not exist",
			})
			return
		}
		video := videos[0]

		// Check if owner has faster record
		if video.Owner.TimeMs < timeMs {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "Owner has faster record",
			})
			return
		}

		// Final success
		video.Pending = false
		video.Valid = valid
		video.TimeMs = timeMs
		video.Owner.TimeMs = timeMs
		db.Save(&video)
		ctx.JSON(http.StatusCreated, gin.H{
			"success": true,
			"message": "Created new entry",
		})
	}
}
