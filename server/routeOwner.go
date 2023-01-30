package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gorm.io/gorm"
)

func ApiOwner(db *gorm.DB) func(ctx *gin.Context) {
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

		// Get owners
		mid := ctx.Param("mid")
		ownerData := Get(fmt.Sprintf(GetOwnerSite, mid))
		nameJson := jsoniter.Get(ownerData, "data", "name")
		{
			err := nameJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
					"json":    ownerData,
				})
				return
			}
		}
		faceJson := jsoniter.Get(ownerData, "data", "face")
		{
			err := faceJson.LastError()
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
			"name":    nameJson.ToString(),
			"face":    faceJson.ToString(),
		})
	}
}
