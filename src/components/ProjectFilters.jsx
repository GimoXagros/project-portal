import { Search, X } from 'lucide-react'
import { filterTypes, typeLabels } from '../utils/projectMeta'

export default function ProjectFilters({ query, setQuery, type, setType, platform, setPlatform, platforms, resultCount }) {
  const reset = () => { setQuery(''); setType('all'); setPlatform('all') }
  const active = query || type !== 'all' || platform !== 'all'
  return <div className="filters" aria-label="프로젝트 필터">
    <div className="search-field"><Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor="project-search">프로젝트 검색</label><input id="project-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름, 원제, 플랫폼, 태그 검색" /></div>
    <div className="filter-tabs" aria-label="종류 필터">
      {filterTypes.map((value) => <button type="button" className={type === value ? 'active' : ''} onClick={() => setType(value)} key={value}>{typeLabels[value]}</button>)}
    </div>
    <div className="filter-bottom">
      <label>플랫폼 <select value={platform} onChange={(event) => setPlatform(event.target.value)}><option value="all">모든 플랫폼</option>{platforms.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
      <div><span className="result-count">{resultCount}개 표시</span>{active && <button className="reset-button" type="button" onClick={reset}><X size={15} /> 필터 초기화</button>}</div>
    </div>
  </div>
}
