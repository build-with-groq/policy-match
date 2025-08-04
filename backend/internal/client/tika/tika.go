package tika

import (
	"context"
	"mime/multipart"
	"net/http"
	"policy-match/internal/config"

	"github.com/google/go-tika/tika"
)

type TikaClient struct {
	config *config.Config
	client *tika.Client
}

func NewTikaClient(config *config.Config) *TikaClient {
	return &TikaClient{
		config: config,
		client: tika.NewClient(nil, config.TikaURL),
	}
}

func (t *TikaClient) ExtractText(ctx context.Context, f multipart.File) (string, error) {
	header := http.Header{}
	header.Set("Accept", "text/plain")
	text, err := t.client.ParseWithHeader(ctx, f, header)
	if err != nil {
		return "", err
	}
	return text, nil
}

func (t *TikaClient) ExtractMetaData(ctx context.Context, f multipart.File) (string, error) {
	f.Seek(0, 0)
	meta, err := t.client.Meta(ctx, f)
	if err != nil {
		return "", err
	}
	return meta, nil
}

func (t *TikaClient) DetectMIMEType(ctx context.Context, f multipart.File) (string, error) {
	mimeType, err := t.client.Detect(ctx, f)
	if err != nil {
		return "", err
	}
	return mimeType, nil
}
