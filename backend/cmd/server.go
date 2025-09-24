package main

import (
	"os"
	"policy-match/internal/client/llm"
	"policy-match/internal/client/tika"
	"policy-match/internal/config"
	"policy-match/internal/handler"
	logger "policy-match/internal/log"
	"policy-match/internal/middleware"
	"policy-match/internal/repository"
	"policy-match/internal/service"
	"policy-match/internal/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

type Server struct {
	router *gin.Engine
}

func NewServer(cfg *config.Config) *Server {
	r := gin.New()

	r.Use(middleware.LocaleMiddleware(utils.Bundle))
	r.Use(middleware.RequestID())

	r.Use(gin.Recovery())
	r.Use(cors.Default())

	r.Use(logger.Init())

	repository := repository.NewRepository(cfg.DBURL)
	llmClient := llm.NewLLMClient(cfg, repository)
	tikaClient := tika.NewTikaClient(cfg)
	chatService := service.NewService(cfg, llmClient, tikaClient, repository)
	h := handler.NewHandler(chatService)

	handler.RegisterRoutes(r, h)

	return &Server{router: r}
}

func (s *Server) Run() error {
	port := os.Getenv("PORT")
	if port == "" {
		log.Info().Msg("PORT is not set, using default port 8080")
		port = "8080"
	}
	return s.router.Run(":" + port)
}
