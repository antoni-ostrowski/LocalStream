package tracksync

import (
	"context"
	"localStream/internal/config"
	"localStream/internal/database"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type TrackSyncMangaer struct {
	Config *config.RuntimeConfigManager
	Db     *database.DBManager
}

func (s *TrackSyncMangaer) StartSync(ctx context.Context) error {
	runtime.LogInfo(ctx, "Starting track collection process")
	tracks, err := s.collectTracks(ctx)
	if err != nil {
		runtime.LogErrorf(ctx, "Tracks collector failed %v", err)
		return err
	}

	runtime.LogInfo(ctx, "Starting track db sync")
	err = s.SyncTracksWithDb(ctx, tracks)
	if err != nil {
		runtime.LogErrorf(ctx, "Tracks collector failed %v", err)
		return err
	}

	return nil
}
