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
	tracks, err := s.collectTracks(ctx)
	if err != nil {
		runtime.LogErrorf(ctx, "Tracks collector failed %v", err)
		return err
	}
	// runtime.LogPrintf(ctx, "Tracks collected %v", tracks)

	runtime.LogPrint(ctx, "satrt db sync")
	err = s.SyncTracksWithDb(ctx, tracks)
	if err != nil {
		runtime.LogErrorf(ctx, "Tracks collector failed %v", err)
		return err
	}

	return nil
}
