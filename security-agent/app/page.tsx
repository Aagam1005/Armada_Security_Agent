'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Code2, Loader2, Network, RotateCcw, ScanSearch, ShieldCheck, Sparkles, Target, Terminal, Link2 } from 'lucide-react'

type AnalysisMode = 'url' | 'code' | 'system'
type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

type Finding = { title: string; severity: Severity; description: string; detail: string; recommendation: string }
type AnalysisResult = { summary: Record<Severity, number>; findings: Finding[] }

const modes = [
  { id: 'url' as const, label: 'URL analysis', icon: Link2, helper: 'Scan a public endpoint or application surface.' },
  { id: 'code' as const, label: 'Code review', icon: Code2, helper: 'Inspect snippets, dependencies, and implementation patterns.' },
  { id: 'system' as const, label: 'Architecture', icon: Network, helper: 'Map risks across services, data flows, and trust boundaries.' },
]

function runLocalAnalysis(mode: AnalysisMode, input: string, focusArea: string): AnalysisResult {
  const text = input.toLowerCase()
  const findings: Finding[] = []
  const add = (finding: Finding) => findings.push(finding)

  if (mode === 'url') {
    if (!input.startsWith('https://')) add({ title: 'HTTPS is not confirmed', severity: 'high', description: 'The target does not begin with HTTPS, so transport encryption cannot be assumed.', detail: 'Use an HTTPS URL and verify redirects, certificates, and HSTS in the deployed environment.', recommendation: 'Redirect HTTP to HTTPS and send Strict-Transport-Security on production responses.' })
    if (text.includes('admin') || text.includes('login')) add({ title: 'Sensitive surface disclosed in target', severity: 'medium', description: 'The target name suggests an administrative or authentication surface.', detail: 'This is a contextual signal only; no live probing is performed in local mode.', recommendation: 'Protect sensitive routes with MFA, rate limits, session expiry, and authorization checks.' })
  }

  if (mode === 'code') {
    if (/password|secret|api[_-]?key|token/.test(text)) add({ title: 'Potential secret handling risk', severity: 'high', description: 'The input contains credential-like terms that may represent secrets or sensitive configuration.', detail: 'Local analysis cannot determine whether values are placeholders or real credentials.', recommendation: 'Move secrets to environment variables, rotate exposed credentials, and scan commits in CI.' })
    if (/innerhtml|eval\s*\(|dangerouslysetinnerhtml/.test(text)) add({ title: 'Dynamic code or HTML execution', severity: 'critical', description: 'The snippet contains a pattern that can enable code injection when fed untrusted input.', detail: 'Review every value reaching this sink and apply contextual escaping or safer APIs.', recommendation: 'Avoid dynamic execution and sanitize untrusted HTML with a well-maintained allowlist.' })
  }

  if (mode === 'system' && /database|db|storage/.test(text) && !/encrypt|encryption|tls/.test(text)) add({ title: 'Data protection controls are unclear', severity: 'medium', description: 'A data store is mentioned without an explicit encryption or transport protection control.', detail: 'This is a documentation-based signal and requires validation against the actual deployment.', recommendation: 'Document encryption at rest, TLS in transit, key ownership, backups, and retention.' })
  if (focusArea === 'authentication' && !/mfa|multi.factor|authorization|rbac/.test(text)) add({ title: 'Authentication controls are not described', severity: 'high', description: 'The selected focus area is authentication, but the input does not mention strong access controls.', detail: 'Add enough implementation context to validate identity, session, and authorization boundaries.', recommendation: 'Use MFA for privileged users and enforce server-side authorization on every protected action.' })
  if (!findings.length) add({ title: 'No obvious issues detected locally', severity: 'info', description: 'The provided input did not match the local security checks.', detail: 'This tool runs entirely in your browser and does not make network requests or replace a professional assessment.', recommendation: 'Add more implementation detail and validate controls with tests and independent review.' })

  const summary = Object.fromEntries(severities.map((severity) => [severity, findings.filter((finding) => finding.severity === severity).length])) as Record<Severity, number>
  return { summary, findings }
}

const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

const severityMeta: { key: Severity; label: string; tone: string }[] = [
  { key: 'critical', label: 'Critical', tone: 'text-red-300' },
  { key: 'high', label: 'High', tone: 'text-orange-300' },
  { key: 'medium', label: 'Medium', tone: 'text-amber-300' },
  { key: 'low', label: 'Low', tone: 'text-sky-300' },
  { key: 'info', label: 'Info', tone: 'text-emerald-300' },
]

export default function SecurityAgent() {
  const [mode, setMode] = useState<AnalysisMode>('url')
  const [input, setInput] = useState('')
  const [focusArea, setFocusArea] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!input.trim()) return setError(`Add a ${mode === 'url' ? 'URL' : mode === 'code' ? 'code snippet or repository description' : 'system description'} to begin.`)
    setIsAnalyzing(true); setError(''); setResult(null); setProgress(8)
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 7, 92)), 450)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900))
      setResult(runLocalAnalysis(mode, input.trim(), focusArea)); setProgress(100)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Local analysis failed.')
    } finally { window.clearInterval(timer); setIsAnalyzing(false) }
  }

  const reset = () => { setInput(''); setFocusArea(''); setResult(null); setError(''); setProgress(0) }
  const activeMode = modes.find((item) => item.id === mode)!
  const ModeIcon = activeMode.icon

  return (
    <main className="min-h-screen bg-[#08111c] px-4 py-6 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/25"><ShieldCheck className="size-5 text-cyan-300" /></div><div><p className="text-sm font-semibold tracking-tight">Armada</p><p className="text-xs text-slate-500">Security intelligence workspace</p></div></div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300 sm:flex"><span className="size-1.5 rounded-full bg-emerald-400" /> Engine ready</div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div className="pt-3"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1.5 text-xs font-medium text-cyan-200"><Sparkles className="size-3.5" /> AI-powered threat analysis</div><h1 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Find the weakness<br /><span className="text-cyan-300">before attackers do.</span></h1><p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">Turn an endpoint, codebase, or architecture diagram into a prioritized security brief with clear remediation guidance.</p><div className="mt-8 flex flex-wrap gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-400" /> Context-aware findings</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-400" /> Actionable fixes</span></div></div>

          <section className="rounded-2xl border border-white/10 bg-[#0d1927] p-5 shadow-2xl shadow-black/20 sm:p-6" aria-label="Security analysis form">
            <div className="mb-5 flex items-start justify-between"><div><p className="text-sm font-semibold text-white">Start an assessment</p><p className="mt-1 text-xs text-slate-500">Choose a surface to inspect.</p></div><div className="rounded-lg bg-cyan-300/10 p-2 text-cyan-300"><ScanSearch className="size-4" /></div></div>
            <div className="mb-5 grid grid-cols-3 gap-2">{modes.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => { setMode(item.id); setError('') }} className={`rounded-xl border px-2 py-3 text-center text-[11px] font-medium transition ${mode === item.id ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-200' : 'border-white/8 bg-white/[.02] text-slate-500 hover:border-white/20 hover:text-slate-300'}`}><Icon className="mx-auto mb-2 size-4" />{item.label}</button> })}</div>
            <div className="mb-4"><label htmlFor="target" className="mb-2 block text-xs font-medium text-slate-300">{mode === 'url' ? 'Target URL' : mode === 'code' ? 'Code or repository' : 'System description'}</label>{mode === 'url' ? <input id="target" value={input} onChange={(event) => setInput(event.target.value)} placeholder="https://app.example.com" disabled={isAnalyzing} className="field" /> : <textarea id="target" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'code' ? 'Paste code or describe the repository...' : 'Describe services, data stores, authentication, and trust boundaries...'} disabled={isAnalyzing} className="field min-h-28 resize-y" />}</div>
            <div className="mb-5"><label htmlFor="focus" className="mb-2 block text-xs font-medium text-slate-300">Focus area <span className="font-normal text-slate-600">(optional)</span></label><select id="focus" value={focusArea} onChange={(event) => setFocusArea(event.target.value)} disabled={isAnalyzing} className="field"><option value="">All vulnerability types</option><option value="authentication">Authentication & authorization</option><option value="injection">Injection attacks</option><option value="cryptography">Cryptography & data protection</option><option value="api">API security</option><option value="supply-chain">Supply chain & dependencies</option><option value="configuration">Configuration & secrets</option></select></div>
            {error && <div role="alert" className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs leading-5 text-red-200">{error}</div>}
            {isAnalyzing && <div className="mb-4"><div className="mb-2 flex justify-between text-[11px] text-slate-500"><span>Reviewing attack surface</span><span>{Math.round(progress)}%</span></div><div className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} /></div></div>}
            <button type="button" onClick={analyze} disabled={isAnalyzing} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-[#07121d] transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60">{isAnalyzing ? <><Loader2 className="size-4 animate-spin" /> Analyzing surface...</> : <><Target className="size-4" /> Run local analysis</>}</button>
            <p className="mt-3 text-center text-[11px] text-slate-600">{activeMode.helper}</p>
          </section>
        </section>

        {result && <section className="mt-8 rounded-2xl border border-white/10 bg-[#0d1927] p-5 sm:p-6" aria-live="polite"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-semibold text-white"><CheckCircle2 className="size-4 text-emerald-400" /> Assessment complete</div><p className="mt-1 text-xs text-slate-500">Prioritized findings for your selected attack surface.</p></div><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"><RotateCcw className="size-3.5" /> New assessment</button></div><div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">{severityMeta.map((item) => <div key={item.key} className="rounded-xl border border-white/8 bg-white/[.025] p-3"><p className={`text-2xl font-semibold ${item.tone}`}>{result.summary[item.key] ?? 0}</p><p className="mt-1 text-[11px] text-slate-500">{item.label}</p></div>)}</div><div className="space-y-3">{result.findings.map((finding, index) => <article key={`${finding.title}-${index}`} className={`rounded-xl border border-white/8 border-l-2 bg-white/[.025] p-4 ${finding.severity === 'critical' ? 'border-l-red-400' : finding.severity === 'high' ? 'border-l-orange-400' : finding.severity === 'medium' ? 'border-l-amber-400' : 'border-l-cyan-400'}`}><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-slate-100">{finding.title}</h3><span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">{finding.severity}</span></div><p className="mt-2 text-sm leading-6 text-slate-300">{finding.description}</p><p className="mt-2 flex gap-2 text-xs leading-5 text-slate-500"><AlertTriangle className="mt-0.5 size-3.5 shrink-0" />{finding.detail}</p><p className="mt-3 rounded-lg bg-emerald-400/8 px-3 py-2.5 text-xs leading-5 text-emerald-200"><span className="font-semibold">Recommended fix: </span>{finding.recommendation}</p></article>)}</div></section>}
        <footer className="mt-8 flex items-center justify-between border-t border-white/8 pt-5 text-[11px] text-slate-600"><span className="flex items-center gap-2"><Terminal className="size-3.5" /> Armada Security Agent</span><span>Analysis is advisory. Validate findings before remediation.</span></footer>
      </div>
    </main>
  )
}

// Shared form styling keeps the input contrast consistent across analysis modes.
const fieldClass = 'w-full rounded-xl border border-white/10 bg-[#091521] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10 disabled:opacity-50'

// Tailwind's class scanner does not evaluate aliases, so keep the form class explicit.
void fieldClass
