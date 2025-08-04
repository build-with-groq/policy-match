package llm

type Role string

const (
	UserRole      Role = "user"
	AssistantRole Role = "assistant"
	SystemRole    Role = "system"
)

type ChatMessageBlock struct {
	Role    Role   `json:"role"`
	Content string `json:"content"`
}

type ParametersRequest struct {
	Type                 string                 `json:"type"`
	Required             []string               `json:"required"`
	AdditionalProperties bool                   `json:"additionalProperties"`
	Properties           map[string]interface{} `json:"properties"`
}

type ToolCallFunctionRequest struct {
	Name        string            `json:"name"`
	Description string            `json:"description"`
	Parameters  ParametersRequest `json:"parameters"`
}

type ToolCallRequest struct {
	Type     string                  `json:"type"`
	Function ToolCallFunctionRequest `json:"function"`
}

type JsonSchema struct {
	Name   string            `json:"name"`
	Schema ParametersRequest `json:"schema"`
}

type ResponseFormat struct {
	Type       string     `json:"type"`
	JsonSchema JsonSchema `json:"json_schema"`
}

type ChatRequest struct {
	Model               string             `json:"model"`
	Messages            []ChatMessageBlock `json:"messages"`
	Temperature         float32            `json:"temperature"`
	MaxCompletionTokens int                `json:"max_completion_tokens"`
	TopP                float32            `json:"top_p"`
	Stream              bool               `json:"stream"`
	Stop                interface{}        `json:"stop"`
	Tools               []ToolCallRequest  `json:"tools,omitempty"`
	ToolChoice          string             `json:"tool_choice,omitempty"`
	ResponseFormat      ResponseFormat     `json:"response_format"`
}

type ChatChoice struct {
	Message ChatMessageBlock `json:"message"`
}

type ChatResponse struct {
	Choices []ChatChoice `json:"choices"`
}

type Rules struct {
	RuleID   string `json:"rule_id"`
	RuleText string `json:"rule_text"`
}

type ExtractRulesResponse struct {
	Rules []Rules `json:"rules"`
}

type CheckComplianceResponse struct {
	IsCompliant           bool     `json:"is_compliant"`
	CompliancePercentage  int      `json:"compliance_percentage"`
	Violations            []string `json:"violations"`
	IsHumanReviewRequired bool     `json:"is_human_review_required"`
}
