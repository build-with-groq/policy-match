package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(dbURL string) *Repository {
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Error().Msg("Failed to connect to database: " + err.Error())
	}

	err = db.AutoMigrate(
		&Policy{},
		&Rule{},
		&Document{},
	)
	if err != nil {
		log.Error().Msg("migration failed: " + err.Error())
	}
	return &Repository{db: db}
}

func (r *Repository) CreatePolicy(ctx context.Context, policy *Policy) error {
	return r.db.
		WithContext(ctx).
		Create(policy).
		Error
}

func (r *Repository) CreateRules(ctx context.Context, rules []Rule) error {
	return r.db.
		WithContext(ctx).
		Create(rules).
		Error
}

func (r *Repository) CreateDocument(ctx context.Context, document *Document) error {
	return r.db.
		WithContext(ctx).
		Create(document).
		Error
}

func (r *Repository) GetAllPolicies(ctx context.Context, offset int, pageSize int) ([]Policy, int, error) {
	var policies []Policy
	var total int64

	err := r.db.
		WithContext(ctx).
		Preload("Rules").
		Offset(offset).
		Limit(pageSize).
		Find(&policies).
		Error
	if err != nil {
		return nil, 0, err
	}
	err = r.db.
		WithContext(ctx).
		Model(&Policy{}).
		Count(&total).
		Error
	if err != nil {
		return nil, 0, err
	}
	return policies, int(total), nil
}

func (r *Repository) GetAllDocuments(ctx context.Context, offset int, pageSize int) ([]Document, int, error) {
	var documents []Document
	var total int64

	err := r.db.
		WithContext(ctx).
		Offset(offset).
		Limit(pageSize).
		Find(&documents).
		Error
	if err != nil {
		return nil, 0, err
	}
	err = r.db.
		WithContext(ctx).
		Model(&Document{}).
		Count(&total).
		Error
	if err != nil {
		return nil, 0, err
	}
	return documents, int(total), nil
}

func (r *Repository) GetPolicyByID(ctx context.Context, id uuid.UUID) (*Policy, error) {
	var policy Policy

	err := r.db.
		WithContext(ctx).
		Preload("Rules").
		First(&policy, "id = ?", id).
		Error
	if err != nil {
		return nil, err
	}
	return &policy, nil
}

func (r *Repository) DeleteDocument(ctx context.Context, id uuid.UUID) error {
	return r.db.
		WithContext(ctx).
		Delete(&Document{}, id).
		Error
}

func (r *Repository) DeletePolicy(ctx context.Context, id uuid.UUID) error {
	return r.db.
		WithContext(ctx).
		Delete(&Policy{}, id).
		Error
}

func (r *Repository) DeleteRule(ctx context.Context, id uuid.UUID) error {
	return r.db.
		WithContext(ctx).
		Delete(&Rule{}, id).
		Error
}

func (r *Repository) UpdateRule(ctx context.Context, policyID uuid.UUID, ruleID string, updates map[string]any) error {
	return r.db.
		WithContext(ctx).
		Model(&Rule{}).
		Where("policy_id = ?", policyID).
		Where("rule_id = ?", ruleID).
		Updates(updates).
		Error
}
