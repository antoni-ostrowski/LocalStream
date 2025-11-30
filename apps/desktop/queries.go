package main

import (
	"fmt"
)

func (a *App) Testt(someNum int) string {
	return fmt.Sprintf("Hello %s, It's show time!", someNum)
}
