package handler

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler) {
	api := r.Group("/api/v1")
	{
		api.GET("/health", h.HandleGetHealth)

		api.POST("/policy", h.HandleUploadPolicy)
		api.POST("/document", h.HandleCheckDocumentCompliance)

		api.GET("/documents", h.HandleGetDocuments)
		api.GET("/policies", h.HandleGetPolicies)

		api.DELETE("/document/:id", h.HandleDeleteDocument)
		api.DELETE("/policy/:id", h.HandleDeletePolicy)

		api.DELETE("/policy/:id/rule/:rule_id", h.HandleDeleteRule)
		api.PATCH("/policy/:id/rule/:rule_id", h.HandleUpdateRule)
	}
}
