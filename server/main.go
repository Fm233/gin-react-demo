package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/juju/ratelimit"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func RateLimitMiddleware(fillInterval time.Duration, cap, quantum int64) gin.HandlerFunc {
	bucket := ratelimit.NewBucketWithQuantum(fillInterval, cap, quantum)
	return func(c *gin.Context) {
		if bucket.TakeAvailable(1) < 1 {
			c.String(http.StatusForbidden, "请重试……\nPlease retry...")
			c.Abort()
			return
		}
		c.Next()
	}
}

func main() {
	// Init database
	db, err := gorm.Open(mysql.Open(DBStr), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}
	db.AutoMigrate(&Owner{})
	db.AutoMigrate(&Video{})

	// Init cookie store
	store := cookie.NewStore([]byte(SessionSecret))

	// Create server
	r := gin.Default()
	r.Use(sessions.Sessions("holder", store))
	r.Use(static.Serve("/", static.LocalFile("./client", false)))

	// Create route
	api := r.Group("api")
	{
		lim := api.Group("")
		{
			lim.Use(RateLimitMiddleware(time.Second, 100, 10))
			lim.POST("apply", Apply(db))
		}
		unlim := api.Group("")
		{
			unlim.GET("apply/:bv", ApplyStatus(db))
			unlim.POST("auth", Auth(db))
			unlim.GET("auth/check", AuthCheck(db))
			unlim.GET("audit", Audit(db))
			unlim.POST("audit/:bv", AuditConfirm(db))
		}
	}

	// Run server
	if err := r.Run(); err != nil {
		log.Fatalln(err)
	}
}
