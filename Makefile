.PHONY: all mac win clean win_arm64 win_amd64 

SRC_DIR := ./src
APP_NAME := LocalStream

all: mac win 


mac:
	$(MAKE) build PLATFORM=darwin/universal OUTPUT=$(APP_NAME)

win: win_arm64 win_amd64

win_arm64:
	$(MAKE) build PLATFORM=windows/arm64 OUTPUT=$(APP_NAME)-win-arm64.exe

win_amd64:
	$(MAKE) build PLATFORM=windows/amd64 OUTPUT=$(APP_NAME)-win-amd64.exe


build:
	cd $(SRC_DIR) && wails build -platform $(PLATFORM) -o $(OUTPUT)

clean:
	cd $(SRC_DIR) && rm -rf ./build

zips:
	cd ./src/build/bin && tar -czf LocalStream-win-amd64.tar.gz LocalStream-win-amd64.exe
	cd ./src/build/bin && tar -czf LocalStream-win-arm64.tar.gz LocalStream-win-arm64.exe
	cd ./src/build/bin && tar -czf LocalStream-mac.tar.gz LocalStream.app

