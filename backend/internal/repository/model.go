package repository

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uuid.UUID      `gorm:"primaryKey;type:uuid;"`
	CreatedAt time.Time      `gorm:"not null;autoCreateTime"`
	UpdatedAt time.Time      `gorm:"not null;autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"default:null"`
}

type Policy struct {
	BaseModel
	Title     string `gorm:"not null;type:varchar(255)"`
	Category  string `gorm:"not null;type:varchar(255)"`
	Path      string `gorm:"not null;type:varchar(255)"`
	Extension string `gorm:"not null;type:varchar(255)"`

	Rules []Rule `gorm:"foreignKey:PolicyID"`
}

type Rule struct {
	BaseModel
	PolicyID uuid.UUID `gorm:"not null;type:uuid;"`
	RuleID   string    `gorm:"not null;type:varchar(255)"`
	RuleText string    `gorm:"not null;type:text"`

	Policy Policy `gorm:"foreignKey:PolicyID"`
}

type Document struct {
	BaseModel
	Title                 string    `gorm:"not null;type:varchar(255)"`
	Path                  string    `gorm:"not null;type:varchar(255)"`
	Extension             string    `gorm:"not null;type:varchar(255)"`
	Violations            []string  `gorm:"type:jsonb;serializer:json"`
	IsCompliant           bool      `gorm:"not null;type:boolean"`
	IsHumanReviewRequired bool      `gorm:"not null;type:boolean"`
	CompliancePercentage  int       `gorm:"not null;type:integer"`
	PolicyID              uuid.UUID `gorm:"not null;type:uuid;"`

	Policy Policy `gorm:"foreignKey:PolicyID"`
}
