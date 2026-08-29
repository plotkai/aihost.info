import React, { useState } from 'react';
import { 
  PlusCircle, ArrowLeft, Check, Copy, Download, Send, Sparkles, Key, Wrench, FileCode, AlertCircle 
} from 'lucide-react';
import { CategoryType, RegionType, TransportType, HostingType, EnvVarDefinition, ToolDefinition } from '../types/mcp';
import { categories, regions, transports, hostings } from '../data/registry';

interface SubmitFormProps {
  onBack: () => void;
}

export const SubmitForm: React.FC<SubmitFormProps> = ({ onBack }) => {
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<CategoryType>('Developer Tools');
  const [region, setRegion] = useState<RegionType>('Global');
  const [company, setCompany] = useState('');
  const [author, setAuthor] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [homepageUrl, setHomepageUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [license, setLicense] = useState('MIT');
  const [selectedTransports, setSelectedTransports] = useState<TransportType[]>(['stdio']);
  const [hosting, setHosting] = useState<HostingType>('local');
  const [command, setCommand] = useState('npx');
  const [argsText, setArgsText] = useState('-y, @modelcontextprotocol/server-name');
  const [tagsText, setTagsText] = useState('tools, ai, mcp');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Dynamic Lists
  const [envVars, setEnvVars] = useState<EnvVarDefinition[]>([]);
  const [tools, setTools] = useState<ToolDefinition[]>([
    { name: '', description: '' },
  ]);

  // Submission / worker status
  const [workerUrl, setWorkerUrl] = useState('/api/submit-mcp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; prUrl?: string } | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Auto-slugify name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Add Env Var
  const addEnvVar = () => {
    setEnvVars([...envVars, { name: '', required: false, description: '', placeholder: '' }]);
  };

  const updateEnvVar = (index: number, field: keyof EnvVarDefinition, val: any) => {
    const updated = [...envVars];
    updated[index] = { ...updated[index], [field]: val };
    setEnvVars(updated);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  // Add Tool
  const addTool = () => {
    setTools([...tools, { name: '', description: '' }]);
  };

  const updateTool = (index: number, field: keyof ToolDefinition, val: string) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: val };
    setTools(updated);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  // Toggle Transport
  const toggleTransport = (t: TransportType) => {
    if (selectedTransports.includes(t)) {
      if (selectedTransports.length > 1) {
        setSelectedTransports(selectedTransports.filter((item) => item !== t));
      }
    } else {
      setSelectedTransports([...selectedTransports, t]);
    }
  };

  // Build generated JSON
  const parsedArgs = argsText.split(',').map((s) => s.trim()).filter(Boolean);
  const parsedTags = tagsText.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const filteredTools = tools.filter((t) => t.name.trim() !== '');
  const filteredEnv = envVars.filter((e) => e.name.trim() !== '');

  const generatedServerJson = {
    id: slug || 'my-mcp-server',
    name: name || 'My MCP Server',
    slug: slug || 'my-mcp-server',
    shortDescription: shortDescription || 'A brief summary of what this MCP server does.',
    longDescription: longDescription || shortDescription || '',
    category,
    demography: {
      region,
      country: region === 'Global' ? 'Global' : 'International',
      origin: company || author || 'Community',
    },
    company: company || author || 'Community',
    author: author || 'Community',
    repositoryUrl: repositoryUrl || 'https://github.com/org/repo',
    homepageUrl: homepageUrl || repositoryUrl || '',
    license,
    transport: selectedTransports,
    verified: false,
    stars: 0,
    tags: parsedTags.length > 0 ? parsedTags : ['mcp', 'tools'],
    hosting,
    envVars: filteredEnv,
    tools: filteredTools,
    installConfigs: {
      claude: {
        command,
        args: parsedArgs,
      },
      cursor: {
        command,
        args: parsedArgs,
      },
      antigravity: {
        command,
        args: parsedArgs,
      },
    },
    quickstart: {
      prerequisites: ['Node.js 18+'],
      installSteps: [
        {
          title: 'Configure Assistant Settings',
          description: `Add ${name || 'MCP Server'} to your MCP configuration file.`,
        },
      ],
    },
    aihostBridgeSupported: hosting === 'cloud' || selectedTransports.includes('sse'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(generatedServerJson, null, 2);

  // Copy JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Download JSON file
  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug || 'mcp-server'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Submit to Cloudflare Worker
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !repositoryUrl) {
      alert('Please fill out the server name, slug, and repository URL.');
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const payload = {
        ...generatedServerJson,
        command,
        args: parsedArgs,
        submitterEmail,
        notes,
      };

      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as any;

      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          message: data.message || 'Server successfully submitted!',
          prUrl: data.prUrl,
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Could not submit automatically. You can download the JSON and submit a PR manually.',
        });
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: `Worker unavailable: ${err.message}. Please copy or download the generated JSON and open a GitHub PR.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Back */}
      <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registry</span>
        </button>
        <span>/</span>
        <span className="text-slate-200 font-medium">Submit MCP Server</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">List Your MCP Server</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Add your open-source or hosted Model Context Protocol server to the global index. We generate modular JSON per server for clean git tracking and automated GitHub PRs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              1. Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Server Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supabase MCP Server"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Slug (Filename ID) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. supabase-mcp"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-brand-400 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Company / Creator Name</label>
                <input
                  type="text"
                  placeholder="e.g. Supabase or your username"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">GitHub / GitLab Repo URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/repo"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Short Description * (1-2 sentences)</label>
              <input
                type="text"
                required
                placeholder="What does this MCP server do?"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Section 2: Categorization & Region */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              2. Categorization & Demography
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Primary Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Demography / Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as RegionType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  {regions.map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transports & Hosting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Transport Protocols</label>
                <div className="flex gap-2">
                  {(['stdio', 'sse', 'websocket'] as TransportType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTransport(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                        selectedTransports.includes(t)
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/50'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Hosting Mode</label>
                <div className="flex gap-2">
                  {(['local', 'cloud', 'hybrid'] as HostingType[]).map((h) => (
                    <button
                      type="button"
                      key={h}
                      onClick={() => setHosting(h)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        hosting === h
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="database, postgres, serverless, sql"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Section 3: Execution & Environment Variables */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              3. Execution Command & Environment Variables
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs text-slate-300 font-medium">Command</label>
                <input
                  type="text"
                  placeholder="npx, docker, python"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-slate-300 font-medium">CLI Arguments (comma-separated)</label>
                <input
                  type="text"
                  placeholder="-y, @org/mcp-server"
                  value={argsText}
                  onChange={(e) => setArgsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Env Vars Dynamic List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Required / Optional Environment Variables:
                </span>
                <button
                  type="button"
                  onClick={addEnvVar}
                  className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Env Var</span>
                </button>
              </div>

              {envVars.map((v, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. API_KEY"
                      value={v.name}
                      onChange={(e) => updateEnvVar(i, 'name', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-brand-300"
                    />
                    <label className="flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap cursor-pointer">
                      <input
                        type="checkbox"
                        checked={v.required}
                        onChange={(e) => updateEnvVar(i, 'required', e.target.checked)}
                        className="rounded border-slate-700 bg-slate-800 text-brand-500"
                      />
                      <span>Required</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeEnvVar(i)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Description / instructions"
                    value={v.description}
                    onChange={(e) => updateEnvVar(i, 'description', e.target.value)}
                    className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Tools Provided */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                4. Tools Provided
              </h2>
              <button
                type="button"
                onClick={addTool}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Tool</span>
              </button>
            </div>

            {tools.map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tool name (e.g. query_db)"
                    value={t.name}
                    onChange={(e) => updateTool(i, 'name', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-indigo-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeTool(i)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Tool description"
                  value={t.description}
                  onChange={(e) => updateTool(i, 'description', e.target.value)}
                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded text-xs text-slate-300"
                />
              </div>
            ))}
          </div>

          {/* Section 5: Submitter details & Submit buttons */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Submitter Email (optional, for PR credit & notifications)</label>
              <input
                type="email"
                placeholder="your.email@domain.com"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Submission Status Message */}
            {submitResult && (
              <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
                submitResult.success
                  ? 'bg-brand-500/10 border border-brand-500/30 text-brand-300'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              }`}>
                <div className="font-semibold flex items-center gap-1.5">
                  {submitResult.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{submitResult.message}</span>
                </div>
                {submitResult.prUrl && (
                  <div>
                    <a
                      href={submitResult.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-mono text-brand-200 hover:text-white"
                    >
                      View GitHub Pull Request →
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>
        </form>

        {/* Real-Time Generated JSON Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-brand-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Generated JSON ({slug ? `${slug}.json` : 'server.json'})
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-brand-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Every MCP listed on <strong className="text-slate-300">aihost.info</strong> lives in its own standalone JSON file under <code className="text-brand-300">src/data/servers/</code> for modularity and effortless GitHub community pull requests.
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 max-h-[560px] overflow-y-auto leading-relaxed">
              <code>{jsonString}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
