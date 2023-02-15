build-darwin:
	cargo build --release --target "x86_64-apple-darwin"
	cargo build --release --target "aarch64-apple-darwin"
	mkdir -p build/jscythe-darwin-x64
	mkdir -p build/jscythe-darwin-arm64
	cp target/x86_64-apple-darwin/release/jscythe build/jscythe-darwin-x64
	cp target/aarch64-apple-darwin/release/jscythe build/jscythe-darwin-arm64

build:
	make build-darwin
	make tar

tar:
	mkdir -p dist
	tar -C build -czvf dist/jscythe-darwin-x64.tar.gz jscythe-darwin-x64
	tar -C build -czvf dist/jscythe-darwin-arm64.tar.gz jscythe-darwin-arm64
