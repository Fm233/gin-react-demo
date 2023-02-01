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
				"message": "读取请求时出错",
				"error":   err.Error(),
			})
			return
		}
		bvJson := jsoniter.Get(postData, "bv")
		{
			err := bvJson.LastError()
			if err != nil {
				ctx.JSON(http.StatusCreated, gin.H{
					"success": false,
					"message": "获取 bv 号时出错",
					"error":   err.Error(),
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
					"message": "从数据库中获取视频数据时出错",
					"error":   err.Error(),
				})
				return
			}
		}
		if len(videos) >= 2 {
			log.Println("[ERROR] Video count >= 2")
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "数据库中出现重复视频，请通知服务器管理员",
				"error":   err.Error(),
			})
			return
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
					"message": "无法从 B 站获取视频发布者",
					"error":   err.Error(),
				})
				return
			}
		}
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
					"message": "无法从 B 站获取视频标题",
					"error":   err.Error(),
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
		pattern := `(?:(\d+)(?:min|[Mm:分]))?(\d+).?(\d+)?`
		re := regexp.MustCompile(pattern)
		params := re.FindStringSubmatch(title)
		if len(params) == 0 {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "视频标题中未匹配到通关时间信息，请尽量使用 1m56.237s 的格式",
			})
			return
		}
		paramsLen := len(params) - 1
		if paramsLen != 3 {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "正则表达式匹配出的数组长度错误，请告知服务器管理员",
			})
			return
		}
		if len(params[3]) > 3 {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "毫秒位数太多啦！不会是 11.4514s 罢！",
			})
			return
		}
		paramsParsed := make([]int, paramsLen)
		for i := 0; i < paramsLen; i++ {
			if params[i+1] == "" {
				paramsParsed[i] = 0
			} else {
				res, err := strconv.Atoi(params[i+1])
				if err != nil {
					fmt.Printf("[ERROR] Error while splitting %s\n", title)
					ctx.JSON(http.StatusCreated, gin.H{
						"success": false,
						"message": "匹配到了时间信息，但无法转换成数字，请告知服务器管理员",
						"error":   err.Error(),
					})
					return
				}
				paramsParsed[i] = res
			}
		}
		ms := paramsParsed[2]
		for i := 0; i < 3-len(params[3]); i++ {
			ms *= 10
		}
		ms += paramsParsed[0]*1000*60 + paramsParsed[1]*1000
		if ms >= MsUpperLimit {
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "视频通关时间慢于 2m30s 的入会线",
			})
			// TODO 手机端支持
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
					"message": "无法从数据库中获取频道所有者数据",
					"error":   err.Error(),
				})
				return
			}
		}
		if len(owners) >= 2 {
			log.Println("[Error] Owner 数量大于或等于两个")
			ctx.JSON(http.StatusCreated, gin.H{
				"success": false,
				"message": "Owner 数量大于或等于两个，请告知服务器管理员",
			})
			return
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
			// Create owner with data cached from Bilibili
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
						"json":    ownerData,
					})
					return
				}
			}
			owner = Owner{
				Mid:    mid,
				TimeMs: MsUpperLimit,
				Name:   nameJson.ToString(),
				Face:   faceJson.ToString(),
			}
			db.Create(&owner)
		}

		// Final success
		db.Create(&Video{
			Bvid:    bv,
			Owner:   owner,
			TimeMs:  ms,
			Pending: true,
			Valid:   false,
			Pic:     picJson.ToString(),
		})
		ctx.JSON(http.StatusCreated, gin.H{
			"success": true,
			"message": "Created new entry",
		})
	}
}
