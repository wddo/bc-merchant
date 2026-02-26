./bin/esbuild.exe \
  bundle=./src/scripts/index.js \
  pd=./src/scripts/pages/pd.js \
  --bundle \
  --outdir=static/scripts \
  --alias:@root=./src/scripts \
  --alias:@config=./src/scripts/config \
  --alias:@pages=./src/scripts/pages \
  --alias:@components=./src/scripts/components \
  --alias:@layout=./src/scripts/layout \
  --alias:@library=./src/scripts/library \
  --alias:@utils=./src/scripts/utils \
  --alias:@vendors=./src/scripts/vendors \
  "$@"
