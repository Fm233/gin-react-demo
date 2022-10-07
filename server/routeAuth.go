package main

import (
	"io"
	"net/http"
	"time"

	jsoniter "github.com/json-iterator/go"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Auth(db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		// Delay
		time.Sleep(time.Millisecond * 200)

		// Try parse request
		postData, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": err.Error(),
			})
			return
		}
		pwJson := jsoniter.Get(postData, "password")
		{
			err := pwJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}

		// Check password
		password := pwJson.ToString()
		if password != AdminPassword {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "Wrong password",
			})
			return
		}

		// Modify session and respond
		session := sessions.Default(ctx)
		session.Set("password", password)
		ctx.JSON(http.StatusCreated, gin.H{
			"success": true,
			"message": "Login successfully!",
		})
	}
}
