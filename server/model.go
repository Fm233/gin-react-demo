package main

import (
	"gorm.io/gorm"
)

type Owner struct {
	gorm.Model
	Mid    string
	Videos []Video
	TimeMs int
}

type Video struct {
	gorm.Model
	Bvid    string
	OwnerId string
	Owner   Owner
	TimeMs  int
	Pending bool
	Valid   bool
}
