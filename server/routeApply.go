package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	jsoniter "github.com/json-iterator/go"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Apply(db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		// Try parse request
		postData, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": err.Error(),
			})
			return
		}
		bvJson := jsoniter.Get(postData, "bv")
		{
			err := bvJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		bv := bvJson.ToString()

		// Try get video from db
		var videos []Video
		{
			err := db.Model(&Video{}).Where("bvid = ?", bv).Find(&videos).Error
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
		if len(videos) != 0 {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": true,
				"message": "Already in database",
			})
			return
		}

		// Try get video information
		videoData := Get(fmt.Sprintf(GetVideoSite, bv))
		midJson := jsoniter.Get(videoData, "data", "owner", "mid")
		{
			err := midJson.LastError()
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

		// Check if relates to goi
		title := titleJson.ToString()
		if !(strings.Contains(title, "goi") ||
			strings.Contains(title, "GOI") ||
			strings.Contains(title, "掘地求升") ||
			strings.Contains(title, "和班尼特福迪一起攻克难关")) {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "视频标题与 GOI 无关",
			})
			return
		}

		// Check if contains a valid time
		pattern := `(\d)?[m:分]?(\d{2})[s\.秒](\d{3})?`
		re := regexp.MustCompile(pattern)
		params := re.FindStringSubmatch(title)
		if len(params) == 0 {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "视频标题不含通关时间信息",
			})
			return
		}
		paramsLen := len(params) - 1
		var ms int
		paramsParsed := make([]int, paramsLen)
		for i := 0; i < paramsLen; i++ {
			res, err := strconv.Atoi(params[i+1])
			if err != nil {
				log.Fatalln(err)
			}
			paramsParsed[i] = res
		}
		if paramsLen == 1 {
			ms = paramsParsed[0] * 1000
		} else if paramsLen == 2 {
			// Minute missing
			if len(params[2]) == 3 {
				ms = paramsParsed[0]*1000 + paramsParsed[1]
			} else {
				// Worst-case scenario
				ms = paramsParsed[0]*1000*60 + paramsParsed[1]*1000 + 999
			}
		} else if paramsLen == 3 {
			ms = paramsParsed[0]*1000*60 + paramsParsed[1]*1000 + paramsParsed[2]
		}
		if ms >= MsUpperLimit {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "视频通关时间慢于 2m30s 的入会线",
			})
			return
		}

		// Check if owner exists or have faster record
		mid := midJson.ToString()
		var owners []Owner
		{
			err := db.Model(&Owner{}).Where("mid = ?", mid).Find(&owners).Error
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": err.Error(),
				})
				return
			}
		}
		if len(owners) >= 2 {
			log.Fatalln("Owner 数量大于或等于两个！")
		}
		var owner Owner
		if len(owners) == 1 {
			if owners[0].TimeMs <= ms {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": "你或视频发布者已有相同或更快的记录",
				})
				return
			}
			owner = owners[0]
		} else {
			owner = Owner{Mid: mid, TimeMs: MsUpperLimit}
			db.Create(&owner)
		}

		// Final success
		db.Create(&Video{Bvid: bv, Owner: owner, TimeMs: ms, Pending: true, Valid: false})
		ctx.JSON(http.StatusCreated, gin.H{
			"success": true,
			"message": "Created new entry",
		})
	}
}
