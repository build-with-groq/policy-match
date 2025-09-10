package handler

import (
	"mime/multipart"
)

type HandlerResponse struct {
	Data    any    `json:"data"`
	Message string `json:"message"`
}

func NewResponse(data any, message string) HandlerResponse {
	return HandlerResponse{
		Data:    data,
		Message: message,
	}
}

type ChatResponseDTO struct {
	Answer string `json:"answer"`
}

type UploadRequestDTO struct {
	File     *multipart.FileHeader `form:"file"  binding:"required"`
	Title    string                `form:"title" binding:"required"`
	Category string                `form:"category" binding:"required"`
}

type Extension string

const (
	ExtensionPDF  Extension = ".pdf"
	ExtensionDOC  Extension = ".doc"
	ExtensionJPG  Extension = ".jpg"
	ExtensionDOCX Extension = ".docx"
	ExtensionTXT  Extension = ".txt"
	ExtensionCSV  Extension = ".csv"
	ExtensionXLSX Extension = ".xlsx"
	ExtensionXLS  Extension = ".xls"
	ExtensionPPTX Extension = ".pptx"
	ExtensionPPT  Extension = ".ppt"
	ExtensionJPEG Extension = ".jpeg"
	ExtensionPNG  Extension = ".png"
)

type PaginationRequest struct {
	Page     int `form:"page,default=1"    binding:"min=1"`
	PageSize int `form:"page_size,default=10" binding:"min=1,max=50"`
}

type Rule struct {
	RuleID   string `json:"rule_id"`
	RuleText string `json:"rule_text"`
}

type Policy struct {
	PolicyID  string    `json:"policy_id"`
	Title     string    `json:"title"`
	Category  string    `json:"category"`
	Extension Extension `json:"extension"`

	Rules      []Rule `json:"rules"`
	UploadedAt string `json:"uploaded_at"`
}

type GetPoliciesResponseDTO struct {
	Policies []Policy `json:"policies"`
	PageSize int      `json:"page_size"`
	Page     int      `json:"page"`
	Total    int      `json:"total"`
}

type Document struct {
	DocumentID string    `json:"document_id"`
	Title      string    `json:"title"`
	Path       string    `json:"path"`
	Extension  Extension `json:"extension"`

	PolicyTitle string `json:"policy_title"`

	Violations            []string `json:"violations"`
	IsCompliant           bool     `json:"is_compliant"`
	IsHumanReviewRequired bool     `json:"is_human_review_required"`
	CompliancePercentage  int      `json:"compliance_percentage"`
	ViolationPercentage   int      `json:"violation_percentage"`
}

type GetDocumentsResponseDTO struct {
	Documents []Document `json:"documents"`
	PageSize  int        `json:"page_size"`
	Page      int        `json:"page"`
	Total     int        `json:"total"`
}

type UpdateRuleRequestDTO struct {
	Title    *string `json:"title,omitempty"`
	Category *string `json:"category,omitempty"`
	RuleText *string `json:"rule_text,omitempty"`
}
