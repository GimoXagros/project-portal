/* Project Portal adapter for the unmodified RomPatcher.js v3.2.1 BPS module. */
(function () {
  'use strict'

  window.NarikiriRomPatcher = Object.freeze({
    engine: 'RomPatcher.js',
    version: 'v3.2.1',
    applyBps(sourceBuffer, patchBuffer) {
      if (!(sourceBuffer instanceof ArrayBuffer) || !(patchBuffer instanceof ArrayBuffer)) {
        throw new TypeError('원본과 패치는 ArrayBuffer여야 합니다.')
      }

      const source = new BinFile(sourceBuffer.slice(0))
      const patchFile = new BinFile(patchBuffer.slice(0))
      const patch = BPS.fromFile(patchFile)

      if (!patch.validateSource(source)) throw new Error('BPS 원본 CRC32 검증에 실패했습니다.')
      const output = patch.apply(source, true)
      return output._u8array.slice()
    },
  })
  document.documentElement.dataset.romPatcher = 'v3.2.1'
})()
