#!/usr/bin/env bash
# Download the pinned font sources into _build/.src (git-ignored).
# Every face is OFL-1.1; each source directory keeps its licence beside it.
set -euo pipefail
cd "$(dirname "$0")"
SRC=.src
GF=b68b528a75da7d9b73f3928899c07a23083a6633        # google/fonts
GEIST=b5d164a0c066c2c9bfcd5ab65dd8244551f0ac06     # vercel/geist-font

get() { mkdir -p "$(dirname "$2")"; [ -s "$2" ] || curl -fsSL -o "$2" "$1"; }
enc() { python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))' "$1"; }

while read -r dir file; do
  get "https://raw.githubusercontent.com/google/fonts/$GF/ofl/$dir/$(enc "$file")" "$SRC/gf/$dir/$file"
  get "https://raw.githubusercontent.com/google/fonts/$GF/ofl/$dir/OFL.txt" "$SRC/gf/$dir/OFL.txt"
done <<'LIST'
wixmadefordisplay WixMadeforDisplay[wght].ttf
wixmadefortext WixMadeforText[wght].ttf
jetbrainsmono JetBrainsMono[wght].ttf
geist Geist[wght].ttf
geistmono GeistMono[wght].ttf
monasans MonaSans[wdth,wght].ttf
sourcecodepro SourceCodePro[wght].ttf
brygada1918 Brygada1918[wght].ttf
brygada1918 Brygada1918-Italic[wght].ttf
martianmono MartianMono[wdth,wght].ttf
hostgrotesk HostGrotesk[wght].ttf
sofiasansextracondensed SofiaSansExtraCondensed[wght].ttf
sofiasans SofiaSans[wght].ttf
kodemono KodeMono[ROND,wdth,wght].ttf
schibstedgrotesk SchibstedGrotesk[wght].ttf
chivomono ChivoMono[wght].ttf
literata Literata[opsz,wght].ttf
archivo Archivo[wdth,wght].ttf
bitcountgridsingle BitcountGridSingle[CRSV,ELSH,ELXP,slnt,wght].ttf
fragmentmono FragmentMono-Regular.ttf
LIST

get "https://raw.githubusercontent.com/vercel/geist-font/$GEIST/fonts/GeistPixel/ttf/GeistPixel-Square.ttf" "$SRC/geist/GeistPixel-Square.ttf"
get "https://raw.githubusercontent.com/vercel/geist-font/$GEIST/OFL.txt" "$SRC/geist/OFL.txt"

zip_release() { # url sha256 dir
  local zip="$SRC/$3.zip"
  get "$1" "$zip"
  echo "$2  $zip" | shasum -a 256 -c - >/dev/null
  mkdir -p "$SRC/$3" && unzip -oq "$zip" -d "$SRC/$3"
}
zip_release https://github.com/eigilnikolajsen/commit-mono/releases/download/v1.143/CommitMono-1.143.zip \
  f7d1f26a7c7554800a996f76f5d706bf0648b936ca2a66b5bc4d46e3a2c49ed0 commit
zip_release https://github.com/rektdeckard/departure-mono/releases/download/v1.500/DepartureMono-1.500.zip \
  bf3e48059aeef4617ec585bdea81dcc3491c576b3e7a472f52faf40e09ee5c3a departure
echo "sources ready in $(pwd)/$SRC"
