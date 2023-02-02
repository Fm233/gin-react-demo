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

// Pending = false, Valid = true: 审核通过
// Pending = false, Valid = false: 记录有争议
// Pending = true, Valid = true: 待审核
// Pending = true, Valid = false: 记录被忽略
