package database

import (
	"context"
	"database/sql"
	"fmt"
	"localStream/sqlcDb"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	_ "modernc.org/sqlite"
)

type DBManager struct {
	DB      *sql.DB
	Queries *sqlcDb.Queries
}

func NewDBManager(ctx context.Context, dbFilePath string) (*DBManager, error) {
	runtime.LogInfof(ctx, "attemtping to open db at %s", dbFilePath)
	db, err := sql.Open("sqlite", dbFilePath)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to open database file %s: %v", dbFilePath, err)
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	defer func() {
		if err != nil {
			db.Close()
		}
	}()

	if err := db.PingContext(ctx); err != nil {
		runtime.LogErrorf(ctx, "Failed to ping database: %v", err)
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	db.SetMaxOpenConns(1)

	runtime.LogInfof(ctx, "Successfully opened database connection to %s", dbFilePath)

	queries := sqlcDb.New(db)

	return &DBManager{
		DB:      db,
		Queries: queries,
	}, nil
}

func (dm *DBManager) InitSchema(ctx context.Context, ddl string) error {

	runtime.LogInfo(ctx, "Initializing database schema...")
	if _, err := dm.DB.ExecContext(ctx, ddl); err != nil {
		runtime.LogErrorf(ctx, "Failed to execute database schema DDL: %v", err)
		return fmt.Errorf("schema init failed: %w", err)
	}

	runtime.LogInfo(ctx, "Database schema initialized successfully.")
	return nil
}
