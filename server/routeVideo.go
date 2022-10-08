package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gorm.io/gorm"
)

func ApiVideo(db *gorm.DB) func(ctx *gin.Context) {
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
		bv := ctx.Param("bv")
		videoData := Get(fmt.Sprintf(GetVideoSite, bv))
		picJson := jsoniter.Get(videoData, "data", "pic")
		{
			err := picJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		titleJson := jsoniter.Get(videoData, "data", "title")
		{
			err := titleJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}

		// Respond
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"pic":     picJson.ToString(),
			"title":   titleJson.ToString(),
		})
	}
}
