import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Download, ExternalLink, FileCheck2, LoaderCircle, ShieldCheck, Upload } from 'lucide-react'
import { assetUrl } from '../utils/projectMeta'
import { formatByteSize, sha256Hex } from '../utils/fileIntegrity'

const initialState = { kind: 'idle', message: '검증할 원본 ROM을 선택하세요.' }

export default function BrowserPatcher({ project }) {
  const config = project?.prerelease?.webPatcher
  const sourceBuffer = useRef(null)
  const outputUrl = useRef('')
  const operationId = useRef(0)
  const fileInput = useRef(null)
  const [selectedVersion, setSelectedVersion] = useState(config?.defaultVersion || config?.versions?.[0]?.version || '')
  const [state, setState] = useState(initialState)
  const [sourceInfo, setSourceInfo] = useState(null)
  const [result, setResult] = useState(null)
  const selected = config?.versions?.find((item) => item.version === selectedVersion)

  useEffect(() => () => {
    operationId.current++
    if (outputUrl.current) URL.revokeObjectURL(outputUrl.current)
  }, [])

  if (!config || !selected) return null

  const resetOutput = () => {
    if (outputUrl.current) URL.revokeObjectURL(outputUrl.current)
    outputUrl.current = ''
    setResult(null)
  }

  const changeVersion = (event) => {
    const version = event.target.value
    ++operationId.current
    sourceBuffer.current = null
    setSourceInfo(null)
    resetOutput()
    if (fileInput.current) fileInput.current.value = ''
    setSelectedVersion(version)
    setState({ kind: 'idle', message: `${version}용으로 검증할 원본 ROM을 선택하세요.` })
  }

  const selectSource = async (event) => {
    const operation = ++operationId.current
    const file = event.target.files?.[0]
    sourceBuffer.current = null
    setSourceInfo(null)
    resetOutput()
    if (!file) return setState(initialState)

    setState({ kind: 'working', message: '원본 ROM의 크기와 SHA-256을 확인하고 있습니다.' })
    try {
      if (file.size !== selected.source.size) throw new Error(`파일 크기가 다릅니다. 필요한 크기: ${formatByteSize(selected.source.size)}`)
      const buffer = await file.arrayBuffer()
      const digest = await sha256Hex(buffer)
      if (operation !== operationId.current) return
      if (digest !== selected.source.sha256) throw new Error('SHA-256이 지원 원본과 일치하지 않습니다. 다른 수정본에는 적용할 수 없습니다.')
      sourceBuffer.current = buffer
      setSourceInfo({ name: file.name, size: file.size, sha256: digest })
      setState({ kind: 'ready', message: '지원 원본 확인 완료. 이제 브라우저에서 패치를 적용할 수 있습니다.' })
    } catch (error) {
      if (operation !== operationId.current) return
      setState({ kind: 'error', message: error.message || '원본 ROM 검증에 실패했습니다.' })
    }
  }

  const applyPatch = async () => {
    if (!sourceBuffer.current || state.kind === 'working') return
    const operation = ++operationId.current
    const inputBuffer = sourceBuffer.current
    resetOutput()
    setState({ kind: 'working', message: 'BPS 패치를 확인하고 브라우저 메모리에서 적용하고 있습니다.' })
    try {
      const response = await fetch(assetUrl(selected.patch.path), { cache: 'no-cache' })
      if (!response.ok) throw new Error(`패치 파일을 불러오지 못했습니다. HTTP ${response.status}`)
      const patchBuffer = await response.arrayBuffer()
      if (patchBuffer.byteLength !== selected.patch.size) throw new Error('내장 패치 파일의 크기가 등록 정보와 다릅니다.')
      if (await sha256Hex(patchBuffer) !== selected.patch.sha256) throw new Error('내장 패치 파일의 SHA-256 검증에 실패했습니다.')

      const engine = window.NarikiriRomPatcher
      if (engine?.version !== config.engineVersion) throw new Error('RomPatcher.js 엔진을 불러오지 못했거나 버전이 다릅니다.')
      const output = engine.applyBps(inputBuffer, patchBuffer)
      if (output.byteLength !== selected.output.size) throw new Error('패치 결과의 크기가 예상과 다릅니다.')
      const outputSha256 = await sha256Hex(output)
      if (operation !== operationId.current) return
      if (outputSha256 !== selected.output.sha256) throw new Error('패치 결과의 SHA-256 검증에 실패했습니다. 결과 파일은 제공하지 않습니다.')

      outputUrl.current = URL.createObjectURL(new Blob([output], { type: 'application/octet-stream' }))
      setResult({ url: outputUrl.current, sha256: outputSha256 })
      setState({ kind: 'done', message: '패치와 결과 검증이 완료되었습니다. 아래 버튼으로 저장하세요.' })
    } catch (error) {
      if (operation !== operationId.current) return
      setState({ kind: 'error', message: error.message || '패치 적용에 실패했습니다.' })
    }
  }

  return <section className="detail-section browser-patcher" aria-labelledby="browser-patcher-title">
    <div className="detail-section-title"><span>LOCAL WEB PATCHER</span><h2 id="browser-patcher-title">브라우저에서 바로 패치</h2></div>
    <div className="patcher-privacy"><ShieldCheck size={22} /><p><strong>ROM은 업로드되지 않습니다.</strong> 선택한 파일의 검증과 BPS 적용은 이 브라우저 안에서만 처리됩니다.</p></div>
    <div className="patcher-version">
      <label htmlFor="patch-version"><span>패치 버전</span><select id="patch-version" value={selectedVersion} onChange={changeVersion}>{config.versions.map((item) => <option key={item.version} value={item.version}>{item.version}{item.version === config.defaultVersion ? ' (최신)' : ''}</option>)}</select></label>
      <div><strong>{selected.title}</strong><p>{selected.summary}</p><a href={selected.releaseUrl} target="_blank" rel="noreferrer">{selected.version} 릴리스 정보 <ExternalLink size={14} /></a></div>
    </div>
    <div className="patcher-grid">
      <div className="patcher-step">
        <span className="patcher-step-number">01</span>
        <div><h3>지원 원본 선택</h3><p>{selected.source.label} · {formatByteSize(selected.source.size)}</p></div>
        <label className="button ghost patcher-file"><Upload size={17} /> ROM 선택<input ref={fileInput} type="file" accept=".gba,.bin,application/octet-stream" onChange={selectSource} /></label>
      </div>
      <div className="patcher-step">
        <span className="patcher-step-number">02</span>
        <div><h3>{config.format} 적용</h3><p>{config.engine} {config.engineVersion} · 패치도 적용 전에 검증</p></div>
        <button className="button primary" type="button" onClick={applyPatch} disabled={!sourceInfo || state.kind === 'working'}>{state.kind === 'working' ? <LoaderCircle className="patcher-spinner" size={17} /> : <FileCheck2 size={17} />} 패치 적용</button>
      </div>
      <div className="patcher-step">
        <span className="patcher-step-number">03</span>
        <div><h3>결과 검증·저장</h3><p>{selected.output.filename} · {formatByteSize(selected.output.size)}</p></div>
        {result ? <a className="button preview" href={result.url} download={selected.output.filename}><Download size={17} /> 결과 저장</a> : <span className="patcher-pending">검증 후 활성화</span>}
      </div>
    </div>
    <div className={`patcher-status ${state.kind}`} role="status" aria-live="polite">{state.kind === 'done' && <CheckCircle2 size={18} />}<span>{state.message}</span></div>
    {sourceInfo && <dl className="patcher-file-info"><div><dt>선택 파일</dt><dd>{sourceInfo.name}</dd></div><div><dt>원본 SHA-256</dt><dd><code>{sourceInfo.sha256}</code></dd></div></dl>}
    {result && <dl className="patcher-file-info result"><div><dt>결과 SHA-256</dt><dd><code>{result.sha256}</code></dd></div></dl>}
    <p className="patcher-legal">합법적으로 확보한 최초 FFR 원본만 사용하세요. 선택한 패치를 다른 수정본에 중복 적용하지 마세요. <a href="https://github.com/marcrobledo/RomPatcher.js" target="_blank" rel="noreferrer">RomPatcher.js</a> v3.2.1 기반(MIT).</p>
  </section>
}
