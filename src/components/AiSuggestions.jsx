import { useState, useRef } from 'react';
import Groq from 'groq-sdk';
import '../styles/ai-suggestions.css';
import BeforeAfterSlider from './BeforeAfterSlider';

function AiSuggestions({ resumeData, onSuggestionReceived }) {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressStatus, setProgressStatus] = useState(null);
  const [resultBanner, setResultBanner] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const abortControllerRef = useRef(null);


  const extractSkillsSummary = (data) => {
    let content = '';
    if (data?.summary?.trim()) {
      content += `SUMMARY:\n${data.summary.trim()}\n`;
    }
    if (data?.skills?.skill?.length) {
      content += '\nCURRENT SKILLS:\n';
      data.skills.skill.forEach((skill) => {
        if (skill.skll?.trim()) content += `• ${skill.skll}\n`;
      });
    }
    return content.trim();
  };

  const sanitizeBullet = (str) =>
    (str || '')
      .replace(/[\n\r]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const cleanParsed = (raw) => {
    const result = {
      summary: [],
      projects: [],
      experiences: [],
      skills: { add: [], replace: [] },
    };
    const validActions = ['replace', 'add'];

    if (Array.isArray(raw?.summary)) {
      raw.summary.forEach((s) => {
        const k = Object.keys(s || {});
        if (!['old', 'improved', 'action'].every((x) => k.includes(x)) || k.length !== 3)
          return;
        const action =
          validActions.includes(s.action) && s.action === 'replace' && s.old?.trim()
            ? 'replace'
            : 'add';
        result.summary.push({
          old: action === 'replace' ? s.old : '',
          improved: sanitizeBullet(s.improved),
          action,
        });
      });
    }

    if (Array.isArray(raw?.projects)) {
      raw.projects.forEach((p) => {
        const keys = Object.keys(p || {});
        if (!['id', 'title', 'items'].every((k) => keys.includes(k)) || keys.length !== 3)
          return;
        const items = Array.isArray(p.items)
          ? p.items.reduce((acc, it) => {
              const k = Object.keys(it || {});
              if (
                !['old', 'improved', 'action'].every((x) => k.includes(x)) ||
                k.length !== 3
              )
                return acc;
              if (!validActions.includes(it.action)) return acc;
              const action = it.action === 'replace' && it.old?.trim() ? 'replace' : 'add';
              acc.push({
                old: action === 'replace' ? it.old : '',
                improved: sanitizeBullet(it.improved),
                action,
              });
              return acc;
            }, [])
          : [];
        if (items.length) result.projects.push({ id: p.id, title: p.title, items });
      });
    }

    if (Array.isArray(raw?.experiences)) {
      raw.experiences.forEach((p) => {
        const keys = Object.keys(p || {});
        if (!['id', 'title', 'items'].every((k) => keys.includes(k)) || keys.length !== 3)
          return;
        const items = Array.isArray(p.items)
          ? p.items.reduce((acc, it) => {
              const k = Object.keys(it || {});
              if (
                !['old', 'improved', 'action'].every((x) => k.includes(x)) ||
                k.length !== 3
              )
                return acc;
              if (!validActions.includes(it.action)) return acc;
              const action = it.action === 'replace' && it.old?.trim() ? 'replace' : 'add';
              acc.push({
                old: action === 'replace' ? it.old : '',
                improved: sanitizeBullet(it.improved),
                action,
              });
              return acc;
            }, [])
          : [];
        if (items.length) result.experiences.push({ id: p.id, title: p.title, items });
      });
    }

    const skills = raw?.skills || {};
    if (Array.isArray(skills.add)) {
      skills.add.forEach((s) => {
        if (typeof s === 'string' && s.trim())
          result.skills.add.push(sanitizeBullet(s));
      });
    }
    if (Array.isArray(skills.replace)) {
      skills.replace.forEach((s) => {
        const k = Object.keys(s || {});
        if (!['old', 'improved'].every((x) => k.includes(x)) || k.length !== 2) return;
        result.skills.replace.push({
          old: s.old,
          improved: sanitizeBullet(s.improved),
        });
      });
    }
    return result;
  };

  const safeParseJson = (s) => {
    try {
      return JSON.parse(s);
    } catch {
      const start = s.indexOf('{');
      const end = s.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        try {
          return JSON.parse(s.slice(start, end + 1));
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  async function generateImprovedContent() {
    setIsLoading(true);
    setSuggestions(null);
    setError(null);
    setResultBanner(null);
    setProgressStatus(null);

    abortControllerRef.current = new AbortController();

    const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const controller = abortControllerRef.current;

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const logRequest = (log) => {
      setDebugLogs((prev) => [...prev.slice(-2), log]);
    };

    const callGroq = async ({ mode, section, entityId, system, user }) => {
      const requestId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const inputChars = user.length;
      const inputTokens = Math.ceil((system.length + user.length) / 4);
      try {
        const res = await groq.chat.completions.create(
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
            temperature: 0.2,
            top_p: 1,
            max_tokens: 800,
            stream: false,
            response_format: { type: 'json_object' },
          },
          { signal: controller.signal }
        );
        const raw = res?.choices?.[0]?.message?.content ?? '';
        try {
          const parsed = JSON.parse(raw);
          logRequest({
            requestId,
            timestamp,
            mode,
            section,
            entityId,
            inputChars,
            inputTokens,
            outputChars: raw.length,
            snippet: raw.slice(0, 300),
            outcome: 'parsed',
            raw,
          });
          return parsed;
        } catch (e) {
          const repaired = safeParseJson(raw);
          if (repaired) {
            logRequest({
              requestId,
              timestamp,
              mode,
              section,
              entityId,
              inputChars,
              inputTokens,
              outputChars: raw.length,
              snippet: raw.slice(0, 300),
              outcome: 'repaired',
              raw,
            });
            return repaired;
          }
          logRequest({
            requestId,
            timestamp,
            mode,
            section,
            entityId,
            inputChars,
            inputTokens,
            outputChars: raw.length,
            snippet: raw.slice(0, 300),
            error: e.message,
            outcome: 'failed',
            raw,
          });
          throw new Error('json_parse_failed');
        }
      } catch (err) {
        const code = err?.response?.error?.code;
        logRequest({
          requestId,
          timestamp,
          mode,
          section,
          entityId,
          inputChars,
          inputTokens,
          error: code ? `${code}: ${err.message}` : err.message,
          outcome: 'failed',
          raw: '',
        });
        throw err;
      }
    };

      const retryEntity = async (fn) => {
        for (let i = 0; i < 3; i++) {
          try {
            return await fn();
          } catch (e) {
            if (i < 2) await sleep([250, 750][i]);
          }
        }
        return null;
      };
      const combined = {
        summary: [],
        projects: [],
        experiences: [],
        skills: { add: [], replace: [] },
      };

      const skillsContent = extractSkillsSummary(resumeData);
      const jobs = resumeData?.experiences?.jobs || [];
      const projects = resumeData?.projects?.project || [];
      const total = jobs.length + projects.length + (skillsContent ? 1 : 0);
      let success = 0;

      const BASE_SYSTEM = 'Return ONLY a valid JSON object, no prose, no markdown, no code fences.';

      const failed = {
        experiences: jobs.length > 0,
        projects: projects.length > 0,
        skills: !!skillsContent,
      };

      try {
        const system = `${BASE_SYSTEM} {"summary":[{"old":"","improved":"","action":"replace"|"add"}],"experiences":[{"id":"","title":"","items":[{"old":"","improved":"","action":"replace"|"add"}]}],"projects":[{"id":"","title":"","items":[{"old":"","improved":"","action":"replace"|"add"}]}],"skills":{"add":[""],"replace":[{"old":"","improved":""}]}}`;

        const userParts = [];
        jobs.forEach((job) => {
          userParts.push(`JOB: ${job.title} at ${job.company}`);
          (job.description || [])
            .filter((d) => d?.trim())
            .forEach((d) => userParts.push(`• ${d}`));
        });
        projects.forEach((proj) => {
          userParts.push(`PROJECT: ${proj.projname}`);
          (proj.description || [])
            .filter((d) => d?.trim())
            .forEach((d) => userParts.push(`• ${d}`));
        });
        if (skillsContent) userParts.push(skillsContent);

        const parsed = await callGroq({
          mode: 'all-in-one',
          section: 'all',
          entityId: 'all',
          system,
          user: userParts.join('\n'),
        });
        const cleaned = cleanParsed(parsed);
        combined.summary.push(...cleaned.summary);
        combined.skills.add.push(...cleaned.skills.add);
        combined.skills.replace.push(...cleaned.skills.replace);
        if (cleaned.experiences.length) {
          combined.experiences.push(...cleaned.experiences);
          failed.experiences = false;
          success += jobs.length;
        }
        if (cleaned.projects.length) {
          combined.projects.push(...cleaned.projects);
          failed.projects = false;
          success += projects.length;
        }
        if (
          skillsContent &&
          (cleaned.summary.length ||
            cleaned.skills.add.length ||
            cleaned.skills.replace.length)
        ) {
          failed.skills = false;
          success += 1;
        }
      } catch (e) {
        // combined call failed; fall back to per-entity
      }

      let processed = success;

      if (failed.experiences) {
        for (let j = 0; j < jobs.length; j++) {
          const job = jobs[j];
          setProgressStatus({ section: 'job', current: processed + 1, total });
          const system = `${BASE_SYSTEM} {"experiences":[{"id":"${job.id}","title":"${job.title} at ${job.company}","items":[{"old":"","improved":"","action":"replace"|"add"}]}],"projects":[],"skills":{"add":[],"replace":[]}}`;
          const user = (job.description || [])
            .filter((d) => d?.trim())
            .map((d) => `• ${d}`)
            .join('\n');
          const parsed = await retryEntity(() =>
            callGroq({
              mode: 'per-job',
              section: 'experiences',
              entityId: job.id,
              system,
              user,
            })
          );
          if (parsed) {
            const cleaned = cleanParsed(parsed);
            combined.experiences.push(...cleaned.experiences);
            combined.skills.add.push(...cleaned.skills.add);
            combined.skills.replace.push(...cleaned.skills.replace);
            success++;
          }
          processed++;
          await sleep(120);
        }
      }

      if (failed.projects) {
        for (let p = 0; p < projects.length; p++) {
          const proj = projects[p];
          setProgressStatus({ section: 'project', current: processed + 1, total });
          const system = `${BASE_SYSTEM} {"projects":[{"id":"${proj.id}","title":"${proj.projname}","items":[{"old":"","improved":"","action":"replace"|"add"}]}],"experiences":[],"skills":{"add":[],"replace":[]}}`;
          const user = (proj.description || [])
            .filter((d) => d?.trim())
            .map((d) => `• ${d}`)
            .join('\n');
          const parsed = await retryEntity(() =>
            callGroq({
              mode: 'per-project',
              section: 'projects',
              entityId: proj.id,
              system,
              user,
            })
          );
          if (parsed) {
            const cleaned = cleanParsed(parsed);
            combined.projects.push(...cleaned.projects);
            combined.skills.add.push(...cleaned.skills.add);
            combined.skills.replace.push(...cleaned.skills.replace);
            success++;
          }
          processed++;
          await sleep(120);
        }
      }

      if (failed.skills && skillsContent) {
        setProgressStatus({ section: 'skills', current: processed + 1, total });
        const system = `${BASE_SYSTEM} {"summary":[{"old":"","improved":"","action":"replace"|"add"}],"skills":{"add":[""],"replace":[{"old":"","improved":""}]},"experiences":[],"projects":[]}`;
        const parsed = await retryEntity(() =>
          callGroq({
            mode: 'skills-only',
            section: 'skills',
            entityId: 'skills',
            system,
            user: skillsContent,
          })
        );
        if (parsed) {
          const cleaned = cleanParsed(parsed);
          combined.summary.push(...cleaned.summary);
          combined.skills.add.push(...cleaned.skills.add);
          combined.skills.replace.push(...cleaned.skills.replace);
          success++;
        }
        processed++;
      }

      setProgressStatus(null);
      if (failed.experiences || failed.projects || failed.skills)
        setResultBanner({ success, total });
      if (success === 0) {
        setIsLoading(false);
        setError("AI couldn't format suggestions this time. Try again.");
        return;
      }

      const seenExp = new Set();
    const expItems = [];
    combined.experiences.forEach((exp) => {
      exp.items.forEach((item, idx) => {
        const key = `${exp.id}:${item.improved}`;
        if (seenExp.has(key)) return;
        seenExp.add(key);
        expItems.push({
          key: `exp-${exp.id}-${idx}`,
          section: 'experiences',
          parentId: exp.id,
          context: exp.title,
          old: item.old,
          improved: item.improved,
          removing: false,
        });
      });
    });

    const seenProj = new Set();
    const projItems = [];
    combined.projects.forEach((proj) => {
      proj.items.forEach((item, idx) => {
        const key = `${proj.id}:${item.improved}`;
        if (seenProj.has(key)) return;
        seenProj.add(key);
        projItems.push({
          key: `proj-${proj.id}-${idx}`,
          section: 'projects',
          parentId: proj.id,
          context: proj.title,
          old: item.old,
          improved: item.improved,
          removing: false,
        });
      });
    });

    const summaryItems = combined.summary.map((item, idx) => ({
      key: `summary-${idx}`,
      section: 'summary',
      parentId: 'summary',
      context: 'Summary',
      old: item.old,
      improved: item.improved,
      removing: false,
    }));

    const skillAddSeen = new Set();
    const skillReplaceSeen = new Set();
    const skillItems = [
      ...combined.skills.add
        .filter((s) => {
          const key = `add:${s}`;
          if (skillAddSeen.has(key)) return false;
          skillAddSeen.add(key);
          return true;
        })
        .map((skill, index) => ({
          key: `skill-add-${index}`,
          section: 'skills',
          old: '',
          improved: skill,
          removing: false,
        })),
      ...combined.skills.replace
        .filter((s) => {
          const key = `rep:${s.old}:${s.improved}`;
          if (skillReplaceSeen.has(key)) return false;
          skillReplaceSeen.add(key);
          return true;
        })
        .map((skill, index) => ({
          key: `skill-replace-${index}`,
          section: 'skills',
          old: skill.old,
          improved: skill.improved,
          removing: false,
        })),
    ];

    if (
      summaryItems.length === 0 &&
      expItems.length === 0 &&
      projItems.length === 0 &&
      skillItems.length === 0
    ) {
      setError('No valid suggestions returned.');
      setIsLoading(false);
      return;
    }

    setSuggestions({
      summary: summaryItems,
      experiences: expItems,
      projects: projItems,
      skills: skillItems,
    });
    setIsLoading(false);
  }

  const triggerRemove = (category, key) => {
    setSuggestions((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        [category]: prev[category].map((item) =>
          item.key === key ? { ...item, removing: true } : item
        ),
      };
      setTimeout(() => {
        setSuggestions((curr) => {
          if (!curr) return curr;
          return {
            ...curr,
            [category]: curr[category].filter((item) => item.key !== key),
          };
        });
      }, 200);
      return updated;
    });
  };

  const handleAction = (action, item) => {
    onSuggestionReceived({
      type: action,
      section: item.section,
      id: item.parentId,
      old: item.old,
      new: item.improved,
    });
    triggerRemove(item.section, item.key);
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card-header">
        <div className="row space-between center">
          {isLoading ? (
            <button className="btn" onClick={handleCancel}>
              Cancel
            </button>
          ) : (
            <button
              className="btn primary"
              onClick={generateImprovedContent}
              disabled={isLoading}
            >
              Generate Improvements
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>Analyzing your resume and generating improvements...</span>
          </div>
        )}

        {progressStatus && (
          <div className="loading">
            <div className="spinner"></div>
            <span>
              Processing {progressStatus.section} ({progressStatus.current}/
              {progressStatus.total})...
            </span>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {resultBanner && !error && (
          <div className="retry-banner">
            Generated suggestions for {resultBanner.success} of{' '}
            {resultBanner.total} items.
          </div>
        )}

        {suggestions && !isLoading && (
          <div className="suggestion-content">
            {suggestions.summary.map((item) => (
              <div
                key={item.key}
                className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}
              >
                <button
                  className="remove-btn"
                  onClick={() => triggerRemove('summary', item.key)}
                >
                  ×
                </button>
                {item.context && <h5 className="card-title">{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="actions">
                  <button className="btn primary" onClick={() => handleAction('replace', item)}>
                    Replace
                  </button>
                  <button className="btn secondary" onClick={() => handleAction('add', item)}>
                    Add
                  </button>
                </div>
              </div>
            ))}

            {suggestions.experiences.map((item) => (
              <div
                key={item.key}
                className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}
              >
                <button
                  className="remove-btn"
                  onClick={() => triggerRemove('experiences', item.key)}
                >
                  ×
                </button>
                {item.context && <h5 className="card-title">{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="actions">
                  <button className="btn primary" onClick={() => handleAction('replace', item)}>
                    Replace
                  </button>
                  <button className="btn secondary" onClick={() => handleAction('add', item)}>
                    Add
                  </button>
                </div>
              </div>
            ))}

            {suggestions.projects.map((item) => (
              <div
                key={item.key}
                className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}
              >
                <button
                  className="remove-btn"
                  onClick={() => triggerRemove('projects', item.key)}
                >
                  ×
                </button>
                {item.context && <h5 className="card-title">{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="actions">
                  <button className="btn primary" onClick={() => handleAction('replace', item)}>
                    Replace
                  </button>
                  <button className="btn secondary" onClick={() => handleAction('add', item)}>
                    Add
                  </button>
                </div>
              </div>
            ))}

            {suggestions.skills.length > 0 && (
              <div className="skill-suggestions">
                {suggestions.skills.map((item) => (
                  <div
                    key={item.key}
                    className={`skill-chip ${item.removing ? 'fade-out' : ''}`}
                  >
                    <button
                      className="remove-btn"
                      onClick={() => triggerRemove('skills', item.key)}
                    >
                      ×
                    </button>
                    {item.old ? (
                      <span>
                        <strong>{item.old}</strong> → {item.improved}
                      </span>
                    ) : (
                      <span>{item.improved}</span>
                    )}
                    <div className="row gap-s">
                      {item.old && (
                        <button
                          className="btn"
                          onClick={() => handleAction('replace', item)}
                        >
                          Replace
                        </button>
                      )}
                      <button
                        className="btn"
                        onClick={() => handleAction('add', item)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && !suggestions && (
          <p className="hint">
            Click &quot;Generate Improvements&quot; to get AI-powered suggestions for your projects,
            experience descriptions, summary, and recommended skills to add to your resume.
          </p>
        )}
      </div>

      {import.meta.env.DEV && debugLogs.length > 0 && (
        <div className="ai-debug">
          <button
            className="btn debug-toggle"
            onClick={() => setShowDebug((s) => !s)}
          >
            AI Debug
          </button>
          {showDebug && (
            <ul>
              {debugLogs.map((log) => (
                <li key={log.requestId}>
                  <span>
                    {log.section}
                    {log.entityId ? ` (${log.entityId})` : ''}: {log.outcome}
                  </span>
                  {log.raw && (
                    <button
                      className="btn"
                      onClick={() => navigator.clipboard.writeText(log.raw)}
                    >
                      copy raw
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default AiSuggestions;

