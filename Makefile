.PHONY: all mac win  clean mac_arm64 mac_amd64 win_arm64 win_amd64 

SRC_DIR := ./src
APP_NAME := LocalStream

all: mac win 

mac: mac_arm64 mac_amd64
win: win_arm64 win_amd64

mac_arm64:
	$(MAKE) build PLATFORM=darwin/arm64 OUTPUT=$(APP_NAME)-mac-arm64

mac_amd64:
	$(MAKE) build PLATFORM=darwin/amd64 OUTPUT=$(APP_NAME)-mac-amd64

win_arm64:
	$(MAKE) build PLATFORM=windows/arm64 OUTPUT=$(APP_NAME)-win-arm64.exe

win_amd64:
	$(MAKE) build PLATFORM=windows/amd64 OUTPUT=$(APP_NAME)-win-amd64.exe


build:
	cd $(SRC_DIR) && wails build -platform $(PLATFORM) -tags "$(TAGS)" -o $(OUTPUT)

clean:
	cd $(SRC_DIR) && rm -rf ./build
