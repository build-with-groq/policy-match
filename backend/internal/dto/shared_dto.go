package dto

import "mime/multipart"

type UploadPolicyRequestDTO struct {
	File     *multipart.FileHeader `form:"file"  binding:"required"`
	Title    string                `form:"title" binding:"required"`
	Category string                `form:"category" binding:"required"`
}

type UploadDocumentRequestDTO struct {
	File     *multipart.FileHeader `form:"file"  binding:"required"`
	PolicyID string                `form:"policy_id" binding:"required"`
}

type UploadDocumentResponseDTO struct {
	// TBD
}
