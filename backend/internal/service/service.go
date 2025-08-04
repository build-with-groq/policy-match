package service

import (
	"context"
	"fmt"
	"path/filepath"
	"policy-match/internal/client/llm"
	"policy-match/internal/client/tika"
	"policy-match/internal/config"
	"policy-match/internal/dto"
	"policy-match/internal/repository"
	"regexp"
	"strings"

	"github.com/google/uuid"
)

type Service struct {
	cfg        *config.Config
	llmClient  *llm.LLMClient
	tikaClient *tika.TikaClient
	repository *repository.Repository
}

func NewService(
	cfg *config.Config,
	llmClient *llm.LLMClient,
	tikaClient *tika.TikaClient,
	repository *repository.Repository,
) *Service {
	return &Service{
		cfg:        cfg,
		llmClient:  llmClient,
		tikaClient: tikaClient,
		repository: repository,
	}
}

func (s *Service) UploadPolicy(ctx context.Context, req dto.UploadPolicyRequestDTO) error {
	f, err := req.File.Open()
	if err != nil {
		return fmt.Errorf("uploadPolicy :: open file: %w", err)
	}
	defer f.Close()

	extractedText, err := s.tikaClient.ExtractText(ctx, f)
	if err != nil {
		return fmt.Errorf("uploadPolicy :: extractText: %w", err)
	}

	cleanedText := cleanText(extractedText)
	rules, err := s.llmClient.ExtractRules(ctx, cleanedText)
	if err != nil {
		return fmt.Errorf("uploadPolicy :: extractRules: %w", err)
	}

	filename, ext := sanitizeFilename(req.File.Filename)
	docId := uuid.New()
	doc := &repository.Policy{
		BaseModel: repository.BaseModel{
			ID: docId,
		},
		Title:     req.Title,
		Category:  req.Category,
		Path:      filename,
		Extension: ext,
	}

	err = s.repository.CreatePolicy(ctx, doc)
	if err != nil {
		return fmt.Errorf("uploadPolicy :: createDocument: %w", err)
	}

	rulesModel := make([]repository.Rule, len(rules))
	for i, rule := range rules {
		rulesModel[i] = repository.Rule{
			BaseModel: repository.BaseModel{
				ID: uuid.New(),
			},
			PolicyID: docId,
			RuleID:   rule.RuleID,
			RuleText: rule.RuleText,
		}
	}

	err = s.repository.CreateRules(ctx, rulesModel)
	if err != nil {
		return fmt.Errorf("uploadPolicy :: createRules: %w", err)
	}

	return nil
}

func (s *Service) CheckDocumentCompliance(ctx context.Context, req dto.UploadDocumentRequestDTO) (*llm.CheckComplianceResponse, error) {
	f, err := req.File.Open()
	if err != nil {
		return nil, fmt.Errorf("checkDocumentCompliance :: open file: %w", err)
	}
	defer f.Close()

	docExtractedContent, err := s.tikaClient.ExtractText(ctx, f)
	if err != nil {
		return nil, fmt.Errorf("checkDocumentCompliance :: extractText: %w", err)
	}

	policy, err := s.repository.GetPolicyByID(ctx, uuid.MustParse(req.PolicyID))
	if err != nil {
		return nil, fmt.Errorf("checkDocumentCompliance :: getPolicyByID: %w", err)
	}

	checkComplianceResponse, err := s.llmClient.
		CheckCompliance(
			ctx,
			policy.Rules,
			docExtractedContent,
		)
	if err != nil {
		return nil, fmt.Errorf("checkDocumentCompliance :: chat: %w", err)
	}

	filename, ext := sanitizeFilename(req.File.Filename)
	s.repository.CreateDocument(ctx, &repository.Document{
		BaseModel: repository.BaseModel{
			ID: uuid.New(),
		},
		Title:     filename,
		Path:      filename,
		Extension: ext,

		Violations:            checkComplianceResponse.Violations,
		IsCompliant:           checkComplianceResponse.IsCompliant,
		IsHumanReviewRequired: checkComplianceResponse.IsHumanReviewRequired,
		CompliancePercentage:  checkComplianceResponse.CompliancePercentage,

		PolicyID: policy.ID,
	})
	return checkComplianceResponse, nil
}

func sanitizeFilename(filename string) (string, string) {
	ext := filepath.Ext(filename)
	filename = strings.TrimSuffix(filename, ext)

	filename = strings.TrimSpace(filename)
	filename = strings.ToLower(filename)
	filename = strings.ReplaceAll(filename, " ", "_")
	return filename, ext
}

func (s *Service) GetDocuments(ctx context.Context, page int, pageSize int) ([]repository.Document, int, error) {
	offset := (page - 1) * pageSize

	documents, total, err := s.repository.
		GetAllDocuments(
			ctx,
			offset,
			pageSize,
		)
	if err != nil {
		return nil, 0, fmt.Errorf("getDocuments :: getAllDocuments: %w", err)
	}
	return documents, total, nil
}

func cleanText(raw string) string {
	text := strings.ReplaceAll(raw, "\r\n", "\n")

	lines := strings.Split(text, "\n")
	for i, l := range lines {
		lines[i] = strings.TrimSpace(l)
	}
	joined := strings.Join(lines, "\n")

	blankLines := regexp.MustCompile(`\n{2,}`)
	collapsed := blankLines.ReplaceAllString(joined, "\n\n")

	multiSpaces := regexp.MustCompile(` {2,}`)
	cleaned := multiSpaces.ReplaceAllString(collapsed, " ")

	return cleaned
}

func (s *Service) GetPolicies(ctx context.Context, page int, pageSize int) ([]repository.Policy, int, error) {
	offset := (page - 1) * pageSize

	policies, total, err := s.repository.
		GetAllPolicies(
			ctx,
			offset,
			pageSize,
		)
	if err != nil {
		return nil, 0, fmt.Errorf("getPolicies :: getAllPolicies: %w", err)
	}
	return policies, total, nil
}

func (s *Service) DeleteDocument(ctx context.Context, id string) error {
	return s.repository.DeleteDocument(ctx, uuid.MustParse(id))
}

func (s *Service) DeletePolicy(ctx context.Context, id string) error {
	return s.repository.DeletePolicy(ctx, uuid.MustParse(id))
}

func (s *Service) DeleteRule(ctx context.Context, id string) error {
	return s.repository.DeleteRule(ctx, uuid.MustParse(id))
}

func (s *Service) UpdateRule(ctx context.Context, policyID uuid.UUID, ruleID string, updates map[string]interface{}) error {
	return s.repository.
		UpdateRule(
			ctx,
			policyID,
			ruleID,
			updates,
		)
}
