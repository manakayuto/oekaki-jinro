#!/bin/sh
# 1台版（Artifact用のソース）から、GitHub Pages用の local.html を作る
cd "$(dirname "$0")"
{
  printf '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>\n'
  cat pass-and-play.src.html
  printf '\n</body></html>\n'
} > local.html
echo "built local.html"
