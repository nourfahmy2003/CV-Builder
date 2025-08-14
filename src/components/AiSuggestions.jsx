import { useState, useRef } from 'react';
import Groq from 'groq-sdk';
import '../styles/ai-suggestions.css';
import BeforeAfterSlider from './BeforeAfterSlider';

function AiSuggestions({ resumeData, onSuggestionReceived }) {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sectionErrors, setSectionErrors] = useState({
    summary: null,
    experiences: null,
    projects: null,
    skills: null,
  });
  const abortControllerRef = useRef(null);

  const extractProjects = (data) => {
    if (!data?.projects?.project?.length) return '';
    let content = 'PROJECTS:\n';
    data.projects.project.forEach((proj, i) => {
      content += `${i + 1}. [projId=${proj.id}] ${proj.projname}\n`;
      (proj.description || []).forEach(
        (d) => d?.trim() && (content += `   • ${d}\n`)
      );
    });
    return content.trim();
  };

  const extractExperiences = (data) => {
    if (!data?.experiences?.jobs?.length) return '';
    let content = 'EXPERIENCE:\n';
    data.experiences.jobs.forEach((job, i) => {
      content += `${i + 1}. [jobId=${job.id}] ${job.title} at ${job.company}\n`;
      (job.description || []).forEach(
        (d) => d?.trim() && (content += `   • ${d}\n`)
      );
    });
    return content.trim();
  };

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
      .replace(/["\\]/g, '')
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

  const fetchWithRetry = async (fn, retries = 1) => {
    let lastErr;
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  };

  async function generateImprovedContent() {
    setIsLoading(true);
    setSuggestions(null);
    setError(null);
    setSectionErrors({ summary: null, experiences: null, projects: null, skills: null });

    abortControllerRef.current = new AbortController();

    const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const combined = {
      summary: [],
      projects: [],
      experiences: [],
      skills: { add: [], replace: [] },
    };
    const errors = {};

    const skillsContent = extractSkillsSummary(resumeData);
    const expContent = extractExperiences(resumeData);
    const projContent = extractProjects(resumeData);

    const controller = abortControllerRef.current;

    const request = async (systemPrompt, userPrompt) => {
      const res = await groq.chat.completions.create(
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.1,
          top_p: 1,
          max_tokens: 800,
          stream: false,
          response_format: { type: 'json_object' },
        },
        { signal: controller.signal }
      );
      return res?.choices?.[0]?.message?.content ?? '';
    };

    const handleSection = async (section, content) => {
      if (!content) return;
      const prompts = {
        skills: `You are an expert resume assistant. Return ONLY JSON: {"summary":[{"old":"","improved":"","action":"replace"|"add"}],"skills":{"add":[""],"replace":[{"old":"","improved":""}]}}`,
        experiences: `You are an expert resume assistant. Return ONLY JSON: {"experiences":[{"id":"","title":"","items":[{"old":"","improved":"","action":"replace"|"add"}]}]}`,
        projects: `You are an expert resume assistant. Return ONLY JSON: {"projects":[{"id":"","title":"","items":[{"old":"","improved":"","action":"replace"|"add"}]}]}`,
      };
      const system = prompts[section];
      const user = `Analyze the following content and provide suggestions.\n\n${content}`.trim();
      let text;
      try {
        text = await fetchWithRetry(() => request(system, user));
      } catch (e) {
        errors[section] = e.message || 'Request failed.';
        return;
      }
      const parsed = safeParseJson(text);
      if (!parsed) return;
      const cleaned = cleanParsed(parsed);
      combined.summary.push(...cleaned.summary);
      combined.projects.push(...cleaned.projects);
      combined.experiences.push(...cleaned.experiences);
      combined.skills.add.push(...cleaned.skills.add);
      combined.skills.replace.push(...cleaned.skills.replace);
    };

    try {
      await Promise.all([
        handleSection('skills', skillsContent),
        handleSection('experiences', expContent),
        handleSection('projects', projContent),
      ]);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to generate improvements.');
      }
      setIsLoading(false);
      return;
    }

    setSectionErrors(errors);

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
          const next = {
            ...curr,
            [category]: curr[category].filter((item) => item.key !== key),
          };
          return next;
        });
        requestAnimationFrame(() => {
          const nextHandle = document.querySelector('.suggestion-card .ba-handle');
          if (nextHandle) nextHandle.focus();
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

        {error && <div className="error">{error}</div>}

        {suggestions && !isLoading && (
          <div className="suggestion-content">
            {sectionErrors.summary && (
              <div className="error">Summary: {sectionErrors.summary}</div>
            )}
            {suggestions.summary.map((item) => (
              <div
                key={item.key}
                className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}
              >
                <button
                  className="dismiss-btn"
                  onClick={() => triggerRemove('summary', item.key)}
                >
                  ×
                </button>
                {item.context && <h5 className="s-card-title">{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="actions">
                  <button
                    className="replace-btn"
                    onClick={() => handleAction('replace', item)}
                  >
                    Replace
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => handleAction('add', item)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            {sectionErrors.experiences && (
              <div className="error">Experiences: {sectionErrors.experiences}</div>
            )}
            {suggestions.experiences.map((item) => (
              <div
                key={item.key}
                className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}
              >
                <button
                  className="dismiss-btn"
                  onClick={() => triggerRemove('experiences', item.key)}
                >
                  ×
                </button>
                {item.context && <h5 className="s-card-title">{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="actions">
                  <button
                    className="replace-btn"
                    onClick={() => handleAction('replace', item)}
                  >
                    Replace
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => handleAction('add', item)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            {sectionErrors.projects && (
              <div className="error">Projects: {sectionErrors.projects}</div>
            )}
            {suggestions.projects.map((item) => (
              <div
                key={item.key}
                className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}
              >
                <button
                  className="dismiss-btn"
                  onClick={() => triggerRemove('projects', item.key)}
                >
                  ×
                </button>
                {item.context && <h5 className="s-card-title">{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="actions">
                  <button
                    className="replace-btn"
                    onClick={() => handleAction('replace', item)}
                  >
                    Replace
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => handleAction('add', item)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            {sectionErrors.skills && (
              <div className="error">Skills: {sectionErrors.skills}</div>
            )}
            {suggestions.skills.length > 0 && (
              <div className="skill-suggestions">
                {suggestions.skills.map((item) => (
                  <div
                    key={item.key}
                    className={`skill-chip ${item.removing ? 'fade-out' : ''}`}
                  >
                    <button
                      className="dismiss-btn"
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
                    <div className="actions">
                      {item.old && (
                        <button
                          className="replace-btn"
                          onClick={() => handleAction('replace', item)}
                        >
                          Replace
                        </button>
                      )}
                      <button
                        className="add-btn"
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
    </>
  );
}

export default AiSuggestions;

