# Third-party notices

## RomPatcher.js

The browser-local BPS workflow uses an unmodified subset of
[RomPatcher.js](https://github.com/marcrobledo/RomPatcher.js) **v3.2.1**
(commit `91e522e247f709e894761157ccba3189004d0859`):

- `modules/HashCalculator.js`
- `modules/BinFile.js`
- `modules/RomPatcher.format.bps.js`

The vendored files retain these upstream SHA-256 values:

- `HashCalculator.js`: `10296c3605a9b2df56afd0cae30e4d3d88c554c35ac668d52b6e0622fcf391fa`
- `BinFile.js`: `f50e1a095ad3356e34af21317de3b56cb61334dd45eeae55663cef3045948143`
- `RomPatcher.format.bps.js`: `aa32b54b8ab71be7911f28a419b671c1eee9130e01e5a5af5e1339b68df2a5cc`

Copyright (c) 2017-2024 Marc Robledo. RomPatcher.js is distributed under the
MIT License. The complete upstream license is retained at
`public/vendor/rom-patcher-js/v3.2.1/LICENSE`.

`public/vendor/rom-patcher-js/v3.2.1/adapter.js` is Project Portal integration
code and is not an upstream RomPatcher.js file.

## Narikiri Dungeon 2 v0.9 and v0.9a BPS

`public/patches/narikiri2-save-compat/v0.9/NARIKIRI2_AN9J_K_DALMOORI_v0.9_FROM_FFR.bps`
is the unchanged public prerelease asset from
[`GimoXagros/gba-narikiri2-kor` v0.9](https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v0.9).

- Size: `145379 bytes`
- SHA-256: `38cba8fbf0fee41af02859df1a607eda2dbedee17f37afbb05fac05316449866`

`public/patches/narikiri2-save-compat/v0.9a/NARIKIRI2_AN9J_K_DALMOORI_v0.9a_FROM_FFR.bps`
is the unchanged public prerelease asset from
[`GimoXagros/gba-narikiri2-kor` v0.9a](https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v0.9a).

- Size: `501338 bytes`
- SHA-256: `9289ff85f946fa661c17dee9a9cb6afcd91278caf1af23590e59964ad461810a`

No source ROM or patched ROM is included in this repository.

## Narikiri Dungeon 2 v0.9b and v0.9c BETA3 BPS

The BETA3 assets in `public/patches/narikiri2-save-compat/v0.9b/` and
`public/patches/narikiri2-save-compat/v0.9c/` are the unchanged public assets from
[v0.9b](https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v0.9b) and
[v0.9c](https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v0.9c).
They are byte-for-byte identical; v0.9c changes PC tools and verification records.

- Size (each): `3189401 bytes`
- SHA-256 (each): `51dbdb8ef24a32ca5efb05ec3196b98ae08a32f3a4d6bb88673d58266837dcf6`

New tool code/documents are MIT; Dalmoori-derived font terms are Apache-2.0.
Original game, existing FFR translation and identification image rights are excluded.
See the release package's RIGHTS.md and THIRD_PARTY_NOTICES.md for the boundaries.
No source ROM, output ROM, save or BIOS is included.

## Narikiri Dungeon 2 v0.9d BPS

Unmodified public asset from https://github.com/GimoXagros/gba-narikiri2-kor/releases/tag/v0.9d.

- File: `public/patches/narikiri2-save-compat/v0.9d/Xagros_Narikiri2_KOR_v0.9d.bps`
- Size: `4881466 bytes`
- SHA-256: `efcbbcc5b0973ecf27ed73e4223211a9875cac0d4ba6192e26e1ea535ac6bcb5`
- Input: unmodified Japanese AN9J (8388608 bytes); output: 13107200 bytes.
- Game and prior FFR translation rights remain with their respective owners.
