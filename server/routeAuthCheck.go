package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthCheck(db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		// Delay
		time.Sleep(time.Millisecond * 200)

		// Check auth
		session := sessions.Default(ctx)
		if session.Get("password") != AdminPassword {
			ctx.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "Auth failed",
			})
			return
		}

		// Respond
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Auth succeed",
		})
	}
}
