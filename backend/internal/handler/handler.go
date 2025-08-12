package handler

import (
	"policy-match/internal/dto"
	"policy-match/internal/service"
	"policy-match/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

type Handler struct {
	service *service.Service
}

func NewHandler(service *service.Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) HandleGetHealth(c *gin.Context) {
	c.JSON(200, NewResponse("OK", utils.Localize(c, "system_is_up_and_running")))
}

func (h *Handler) HandleUploadPolicy(c *gin.Context) {
	var request dto.UploadPolicyRequestDTO
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "request_is_invalid")))
		return
	}

	err := h.service.UploadPolicy(c.Request.Context(), request)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, err.Error()))
		return
	}

	c.JSON(200, NewResponse(nil, utils.Localize(c, "file_uploaded_successfully")))
}

func (h *Handler) HandleCheckDocumentCompliance(c *gin.Context) {
	var request dto.UploadDocumentRequestDTO
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "request_is_invalid")))
		return
	}

	checkComplianceResponse, err := h.service.CheckDocumentCompliance(c.Request.Context(), request)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, err.Error()))
		return
	}

	c.JSON(200, NewResponse(checkComplianceResponse, utils.Localize(c, "file_uploaded_successfully")))
}

func (h *Handler) HandleGetPolicies(c *gin.Context) {
	var request PaginationRequest
	if err := c.ShouldBindQuery(&request); err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "request_is_invalid")))
		return
	}

	policies, total, err := h.service.GetPolicies(c.Request.Context(), request.Page, request.PageSize)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}
	policiesDTO := make([]Policy, len(policies))
	for i, policy := range policies {
		rulesDTO := make([]Rule, len(policy.Rules))
		for j, rule := range policy.Rules {
			rulesDTO[j] = Rule{
				RuleID:   rule.RuleID,
				RuleText: rule.RuleText,
			}
		}
		policiesDTO[i] = Policy{
			PolicyID:   policy.ID.String(),
			Title:      policy.Title,
			Category:   policy.Category,
			Extension:  Extension(policy.Extension),
			Rules:      rulesDTO,
			UploadedAt: policy.CreatedAt.Format("2006-01-02"),
		}
	}

	c.JSON(200, NewResponse(GetPoliciesResponseDTO{
		Policies: policiesDTO,
		PageSize: request.PageSize,
		Page:     request.Page,
		Total:    total,
	}, utils.Localize(c, "documents_fetched_successfully")))
}

func (h *Handler) HandleGetDocuments(c *gin.Context) {
	var request PaginationRequest
	if err := c.ShouldBindQuery(&request); err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "request_is_invalid")))
		return
	}

	documents, total, err := h.service.GetDocuments(c.Request.Context(), request.Page, request.PageSize)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}

	documentsDTO := make([]Document, len(documents))
	for i, document := range documents {
		documentsDTO[i] = Document{
			DocumentID:            document.ID.String(),
			Title:                 document.Title,
			Path:                  document.Path,
			Extension:             Extension(document.Extension),
			Violations:            document.Violations,
			IsCompliant:           document.IsCompliant,
			IsHumanReviewRequired: document.IsHumanReviewRequired,
			CompliancePercentage:  document.CompliancePercentage,

			PolicyTitle: document.Policy.Title,
		}
	}

	c.JSON(200, NewResponse(GetDocumentsResponseDTO{
		Documents: documentsDTO,
		PageSize:  request.PageSize,
		Page:      request.Page,
		Total:     total,
	}, utils.Localize(c, "documents_fetched_successfully")))
}

func (h *Handler) HandleDeleteDocument(c *gin.Context) {
	id := c.Param("id")
	err := h.service.DeleteDocument(c.Request.Context(), id)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}

	c.JSON(200, NewResponse(nil, utils.Localize(c, "document_deleted_successfully")))
}

func (h *Handler) HandleDeletePolicy(c *gin.Context) {
	id := c.Param("id")
	err := h.service.DeletePolicy(c.Request.Context(), id)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}

	c.JSON(200, NewResponse(nil, utils.Localize(c, "policy_deleted_successfully")))
}

func (h *Handler) HandleDeleteRule(c *gin.Context) {
	id := c.Param("id")
	err := h.service.DeleteRule(c.Request.Context(), id)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}

	c.JSON(200, NewResponse(nil, utils.Localize(c, "rule_deleted_successfully")))
}

func (h *Handler) HandleUpdateRule(c *gin.Context) {
	var req UpdateRuleRequestDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "request_is_invalid")))
		return
	}

	policyID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "policy_id_is_required")))
		return
	}

	ruleID := c.Param("rule_id")
	if ruleID == "" {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "rule_id_is_required")))
		return
	}

	updates := map[string]any{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.RuleText != nil {
		updates["rule_text"] = *req.RuleText
	}

	if len(updates) == 0 {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "no_fields_to_update")))
		return
	}

	err = h.service.UpdateRule(c.Request.Context(), policyID, ruleID, updates)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}

	c.JSON(200, NewResponse(nil, utils.Localize(c, "rule_updated_successfully")))
}
