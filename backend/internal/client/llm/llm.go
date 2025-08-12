package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"policy-match/internal/config"
	"policy-match/internal/repository"

	"github.com/rs/zerolog/log"
)

const (
	CHAT_SYSTEM_PROMPT = `
	You are PolicyMatch's analysis engine. You will receive input in the following exact format:

	Policy:
	<full policy text>

	Document:
	<full document text>

	Your task is to compare the Document against the Policy and output four fields:
	- is_compliant_with_policy  (boolean)
	- compliance_percentage      (number between 0 and 100)
	- violations                 (array of strings; each violated rule)
	- violation_percentage       (number between 0 and 100)

	The system will enforce the JSON schema for your response, so focus solely on accurately assessing compliance and identifying violations.
	`

	EXTRACT_RULES_SYSTEM_PROMPT = `
	You are PolicyMatch's rule-extraction engine.
	Input comes exactly as:

	Policy:
	<full policy text>

	Your task:
	• Identify each numbered clause or bullet as a “rule.”
	• Extract its identifier and full wording.
	• Normalize spacing, preserve numbering, drop boilerplate.

	IMPORTANT:
	- Your output will be wrapped by the JSON schema on the client.
	`
)

type LLMClient struct {
	cfg  *config.Config
	repo *repository.Repository
}

func NewLLMClient(cfg *config.Config, repo *repository.Repository) *LLMClient {
	return &LLMClient{cfg: cfg, repo: repo}
}

func (l *LLMClient) CheckCompliance(ctx context.Context, policyRules []repository.Rule, documentContent string) (*CheckComplianceResponse, error) {
	var sysBuf bytes.Buffer
	sysBuf.WriteString("Policy:\n")
	for _, rule := range policyRules {
		sysBuf.WriteString("- " + rule.RuleText + "\n")
	}
	sysBuf.WriteString("Document:\n")
	sysBuf.WriteString("- " + documentContent + "\n")

	msgs := []MessageRequest{
		{Role: "system", Content: CHAT_SYSTEM_PROMPT},
		{Role: "user", Content: sysBuf.String()},
	}

	reqBody := ChatRequest{
		Messages:            msgs,
		Temperature:         0,
		MaxCompletionTokens: 1024,
		TopP:                1.0,
		Stream:              false,
		Stop:                []string{"ERROR"},
		Model:               l.cfg.LLMModel,
		ResponseFormat: ResponseFormat{
			Type: "json_schema",
			JsonSchema: JsonSchema{
				Name: "response",
				Schema: ParametersRequest{
					Type: "object",
					Properties: map[string]any{
						"is_compliant": map[string]any{
							"type":        "boolean",
							"description": "Whether the document is compliant with the policy",
						},
						"compliance_percentage": map[string]any{
							"type":        "number",
							"description": "The compliance percentage with the policy",
						},
						"violations": map[string]any{
							"type":        "array",
							"description": "The violated rules of the policy",
							"items": map[string]any{
								"type": "string",
							},
						},
						"is_human_review_required": map[string]any{
							"type":        "boolean",
							"description": "Whether the document requires human review",
						},
					},
					Required: []string{"is_compliant", "compliance_percentage", "violations", "violation_percentage"},
				},
			},
		},
	}

	payload, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("checkCompliance :: error marshalling chat request: %w", err)
	}

	resp, err := CallGroqAPI(ctx, l.cfg, payload)
	if err != nil {
		return nil, fmt.Errorf("checkCompliance :: error calling groq API: %w", err)
	}

	log.Info().Msg("checkCompliance :: groq LLM response: " + resp)

	var checkComplianceResponse CheckComplianceResponse
	if err := json.Unmarshal([]byte(resp), &checkComplianceResponse); err != nil {
		return nil, fmt.Errorf("checkCompliance :: error unmarshalling check compliance response: %w", err)
	}

	return &checkComplianceResponse, nil
}

func (l *LLMClient) ExtractRules(ctx context.Context, policyContent string) ([]Rule, error) {
	var sysBuf bytes.Buffer
	sysBuf.WriteString("Policy:\n")
	sysBuf.WriteString("- " + policyContent + "\n")

	msgs := []MessageRequest{
		{Role: "system", Content: EXTRACT_RULES_SYSTEM_PROMPT},
		{Role: "user", Content: sysBuf.String()},
	}

	reqBody := ChatRequest{
		Messages:            msgs,
		Temperature:         0,
		MaxCompletionTokens: 8192,
		TopP:                1.0,
		Stream:              false,
		Stop:                []string{"___END___"},
		Model:               l.cfg.LLMModel,
		ResponseFormat: ResponseFormat{
			Type: "json_schema",
			JsonSchema: JsonSchema{
				Name: "response",
				Schema: ParametersRequest{
					Type: "object",
					Properties: map[string]any{
						"rules": map[string]any{
							"type":        "array",
							"description": "The rules of the policy",
							"items": map[string]any{
								"type": "object",
								"properties": map[string]any{
									"rule_id":   map[string]any{"type": "string"},
									"rule_text": map[string]any{"type": "string"},
								},
								"required": []string{"rule_id", "rule_text"},
							},
						},
					},
					Required: []string{"rules"},
				},
			},
		},
	}

	payload, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("extractRules :: error marshalling chat request: %w", err)
	}

	resp, err := CallGroqAPI(ctx, l.cfg, payload)
	if err != nil {
		return nil, fmt.Errorf("extractRules :: error calling groq API: %w", err)
	}

	raw := []byte(resp)

	if !bytes.HasSuffix(raw, []byte("}")) || !bytes.Contains(raw, []byte("]")) {
		raw = append(raw, []byte("]}")...)
	}

	var extractRulesResponse ExtractRulesResponse
	if err := json.Unmarshal([]byte(raw), &extractRulesResponse); err != nil {
		return nil, fmt.Errorf("extractRules :: error unmarshalling extract rules response: %w", err)
	}

	log.Info().Msg("extractRules :: unmarshalled response: " + resp)

	return extractRulesResponse.Rules, nil
}

func CallGroqAPI(ctx context.Context, cfg *config.Config, payload []byte) (string, error) {
	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewReader(payload))
	if err != nil {
		return "", fmt.Errorf("callGroqAPI :: error creating chat request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+cfg.GroqAPIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("callGroqAPI :: error calling chat API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("callGroqAPI :: chat API error [%d]: %s", resp.StatusCode, string(body))
	}

	var cr ChatResponse
	if err := json.NewDecoder(resp.Body).Decode(&cr); err != nil {
		return "", fmt.Errorf("callGroqAPI :: error decoding chat response: %w", err)
	}
	if len(cr.Choices) == 0 {
		return "", fmt.Errorf("callGroqAPI :: error no choices in chat response")
	}
	return cr.Choices[0].Message.Content, nil
}
