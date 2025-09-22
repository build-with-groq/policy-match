package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

type Config struct {
	GroqAPIKey string
	LLMModel   string
	DBURL      string
	TikaURL    string
	Origin     string
}

func Load() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}

	if os.Getenv("DB_HOST") == "" || os.Getenv("DB_PORT") == "" || os.Getenv("DB_USER") == "" || os.Getenv("DB_PASSWORD") == "" || os.Getenv("DB_NAME") == "" {
		return nil, fmt.Errorf("missing required environment variables")
	}

	sslMode := "disable"
	if os.Getenv("IS_PROD") == "true" {
		sslMode = "require"
	}

	dbURL := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		sslMode,
	)

	origin := os.Getenv("ORIGIN")
	if origin == "" {
		log.Info().Msg("ORIGIN is not set, using default origin http://localhost")
		origin = "http://localhost"
	}

	cfg := &Config{
		GroqAPIKey: os.Getenv("GROQ_API_KEY"),
		LLMModel:   os.Getenv("LLM_MODEL"),
		DBURL:      dbURL,
		TikaURL:    os.Getenv("TIKA_URL"),
		Origin:     origin,
	}

	missing := make([]string, 0, 3)
	if cfg.GroqAPIKey == "" {
		missing = append(missing, "GROQ_API_KEY")
	}
	if cfg.LLMModel == "" {
		missing = append(missing, "LLM_MODEL")
	}
	if cfg.TikaURL == "" {
		missing = append(missing, "TIKA_URL")
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("missing required environment variables: %v", missing)
	}

	return cfg, nil
}
