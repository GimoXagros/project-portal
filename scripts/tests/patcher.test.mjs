import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createContext, runInContext } from 'node:vm'

const vendor = new URL('../../public/vendor/rom-patcher-js/v3.2.1/', import.meta.url)

function loadEngine() {
  const context = createContext({
    console,
    document: { documentElement: { dataset: {} } },
    File: class File {},
    FileList: class FileList {},
    HTMLElement: class HTMLElement {},
  })
  context.window = context
  for (const file of ['modules/HashCalculator.js', 'modules/BinFile.js', 'modules/RomPatcher.format.bps.js', 'adapter.js']) {
    runInContext(readFileSync(new URL(file, vendor), 'utf8'), context, { filename: file })
  }
  return context
}

test('pinned RomPatcher.js BPS module applies and validates a synthetic patch', () => {
  const context = loadEngine()
  const result = runInContext(`(() => {
    const source = new BinFile(new Uint8Array([1, 2, 3, 4, 5]).buffer)
    const target = new BinFile(new Uint8Array([1, 2, 9, 4, 5, 6]).buffer)
    const patch = BPS.buildFromRoms(source, target, false).export('fixture')
    return Array.from(window.NarikiriRomPatcher.applyBps(source._u8array.buffer, patch._u8array.buffer))
  })()`, context)
  assert.deepEqual([...result], [1, 2, 9, 4, 5, 6])
  assert.equal(context.NarikiriRomPatcher.engine, 'RomPatcher.js')
  assert.equal(context.NarikiriRomPatcher.version, 'v3.2.1')
})

test('pinned engine rejects a BPS patch for the wrong source', () => {
  const context = loadEngine()
  assert.throws(() => runInContext(`(() => {
    const expected = new BinFile(new Uint8Array([1, 2, 3]).buffer)
    const target = new BinFile(new Uint8Array([1, 8, 3]).buffer)
    const patch = BPS.buildFromRoms(expected, target, false).export('fixture')
    const wrong = new Uint8Array([9, 9, 9]).buffer
    return window.NarikiriRomPatcher.applyBps(wrong, patch._u8array.buffer)
  })()`, context), /CRC32/)
})

test('published v0.9b BETA3 BPS parses with the registered source and target sizes', () => {
  const context = loadEngine()
  context.publishedPatch = Uint8Array.from(readFileSync(new URL('../../public/patches/gba-narikiri2-kor/v0.9b/NARIKIRI2_AN9J_K_DALMOORI_v0.9b_FROM_BETA3.bps', import.meta.url)))
  const info = runInContext(`(() => {
    const patch = BPS.fromFile(new BinFile(publishedPatch))
    return { sourceSize: patch.sourceSize, targetSize: patch.targetSize }
  })()`, context)
  assert.deepEqual({ ...info }, { sourceSize: 9961472, targetSize: 13107200 })
})

test('published v0.9a BPS parses with the registered source and target sizes', () => {
  const context = loadEngine()
  context.publishedPatch = Uint8Array.from(readFileSync(new URL('../../public/patches/gba-narikiri2-kor/v0.9a/NARIKIRI2_AN9J_K_DALMOORI_v0.9a_FROM_FFR.bps', import.meta.url)))
  const info = runInContext(`(() => {
    const patch = BPS.fromFile(new BinFile(publishedPatch))
    return { sourceSize: patch.sourceSize, targetSize: patch.targetSize }
  })()`, context)
  assert.deepEqual({ ...info }, { sourceSize: 12582912, targetSize: 13041664 })
})

test('published v0.9 BPS parses with the registered source and target sizes', () => {
  const context = loadEngine()
  context.publishedPatch = Uint8Array.from(readFileSync(new URL('../../public/patches/gba-narikiri2-kor/v0.9/NARIKIRI2_AN9J_K_DALMOORI_v0.9_FROM_FFR.bps', import.meta.url)))
  const info = runInContext(`(() => {
    const patch = BPS.fromFile(new BinFile(publishedPatch))
    return { sourceSize: patch.sourceSize, targetSize: patch.targetSize }
  })()`, context)
  assert.deepEqual({ ...info }, { sourceSize: 12582912, targetSize: 12713984 })
})

test('vendored engine retains the upstream MIT license and exact source files', () => {
  const license = readFileSync(new URL('LICENSE', vendor), 'utf8')
  assert.match(license, /MIT License/)
  assert.match(license, /Marc Robledo/)
  for (const file of ['modules/HashCalculator.js', 'modules/BinFile.js', 'modules/RomPatcher.format.bps.js']) {
    assert.ok(readFileSync(new URL(file, vendor)).byteLength > 1000)
  }
})

test('v0.9c public BPS is byte-identical to v0.9b and keeps the same ROM sizes', () => {
  const root = new URL('../../public/patches/gba-narikiri2-kor/', import.meta.url)
  const current = readFileSync(new URL('v0.9c/NARIKIRI2_AN9J_K_DALMOORI_v0.9c_FROM_BETA3.bps', root))
  const previous = readFileSync(new URL('v0.9b/NARIKIRI2_AN9J_K_DALMOORI_v0.9b_FROM_BETA3.bps', root))
  assert.deepEqual(current, previous)
  const context = loadEngine()
  context.publishedPatch = Uint8Array.from(current)
  const info = runInContext(`(() => {
    const patch = BPS.fromFile(new BinFile(publishedPatch))
    return { sourceSize: patch.sourceSize, targetSize: patch.targetSize }
  })()`, context)
  assert.deepEqual({ ...info }, { sourceSize: 9961472, targetSize: 13107200 })
})

test('all registered public patches parse with their declared ROM sizes', () => {
  const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  for (const project of projects.filter(item => item.type === 'korean-patch')) {
    for (const version of project.webPatcher.versions) {
      const context = loadEngine()
      context.publishedPatch = Uint8Array.from(readFileSync(new URL('../../public/' + version.patch.path, import.meta.url)))
      const info = runInContext(`(() => { const patch = BPS.fromFile(new BinFile(publishedPatch)); return { sourceSize: patch.sourceSize, targetSize: patch.targetSize } })()`, context)
      assert.deepEqual({ ...info }, { sourceSize: version.source.size, targetSize: version.output.size })
    }
  }
})
