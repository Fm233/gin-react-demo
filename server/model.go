package main

import (
	"gorm.io/gorm"
)

type Owner struct {
	gorm.Model
	Mid    string
	Name   string
	Face   string
	Videos []Video
	TimeMs int
}

type Video struct {
	gorm.Model
	Bvid    string
	OwnerID string
	Owner   Owner
	Pic     string
	TimeMs  int
	Pending bool
	Valid   bool
}
