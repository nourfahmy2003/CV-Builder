import { useState, useRef } from 'react';
import Groq from 'groq-sdk';
import '../styles/ai-suggestions.css';
import BeforeAfterSlider from './BeforeAfterSlider';

function AiSuggestions({ resumeData, onSuggestionReceived }) {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Process resume data to extract projects and experiences
  const extractResumeContent = (data) => {
    let content = "";

    // Projects
    content += "\n\nPROJECTS:\n";
    data.projects.project.forEach((proj, i) => {
      content += `${i + 1}. [projId=${proj.id}] ${proj.projname}\n`;
      (proj.description || []).forEach(d => d?.trim() && (content += `   • ${d}\n`));
    });

    // Experience
    content += "\n\nEXPERIENCE:\n";
    data.experiences.jobs.forEach((job, i) => {
      content += `${i + 1}. [jobId=${job.id}] ${job.title} at ${job.company}\n`;
      (job.description || []).forEach(d => d?.trim() && (content += `   • ${d}\n`));
    });

    // Extract existing skills
    if (data?.skills?.skill?.length) {
      content += "\n\nCURRENT SKILLS:\n";
      data.skills.skill.forEach(skill => {
        if (skill.skll?.trim()) content += `• ${skill.skll}\n`;
      });
    }

    return content;
  };

  async function generateImprovedContent() {
    setIsLoading(true);
    setSuggestions(null);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const resumeContent = extractResumeContent(resumeData);
      if (!resumeContent) {
        setError("No project or experience data found to analyze.");
        setIsLoading(false);
        return;
      }

      const batches = buildBatches(resumeContent, 4000);

      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const systemPrompt = `
You are an expert resume assistant.
Return ONLY a valid JSON object (no prose, no markdown, no code fences).

Use EXACTLY this schema:
{
  "projects": [
    {
      "id": "projId (from [projId=...] in my text)",
      "title": "Project title exactly as given",
      "items": [
        {
          "old": "verbatim bullet from my content or empty if new",
          "improved": "one-line improved bullet",
          "action": "replace" | "add"
        }
      ]
    }
  ],
  "experiences": [
    {
      "id": "jobId (from [jobId=...] in my text)",
      "title": "Job title at Company exactly as given",
      "items": [
        {
          "old": "verbatim bullet from my content or empty if new",
          "improved": "one-line improved bullet",
          "action": "replace" | "add"
        }
      ]
    }
  ],
  "skills": {
    "add": ["Skill A", "Skill B"],
    "replace": [
      { "old": "weak or duplicate skill", "improved": "stronger alternative" }
    ]
  }
}

Hard rules:
- Each "replace" MUST copy the original bullet EXACTLY in "old"; otherwise use action "add" and set "old" to "".
- Keep each bullet on ONE line and prefer metrics.
- No trailing commas, no smart quotes, no comments.
- If nothing to improve, return empty arrays.
`.trim();

      const combined = { projects: [], experiences: [], skills: { add: [], replace: [] } };

      for (const batch of batches) {
        const userPrompt = `
Analyze my resume content and produce JSON in the schema above.

RESUME CONTENT:
${batch}
`.trim();

        let text;
        try {
          const res = await groq.chat.completions.create(
            {
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.1,
              top_p: 1,
              max_tokens: 800,
              stream: false,
              response_format: { type: "json_object" },
            },
            { signal: abortControllerRef.current?.signal }
          );
          text = res?.choices?.[0]?.message?.content ?? "";
        } catch (apiErr) {
          const fail = apiErr?.error?.failed_generation;
          if (fail) {
            text = fail;
          } else {
            setError(apiErr.message || "Request failed.");
            setIsLoading(false);
            return;
          }
        }

        const parsed = safeParseJson(text);
        if (!parsed) continue;
        const cleaned = cleanParsed(parsed);
        combined.projects.push(...cleaned.projects);
        combined.experiences.push(...cleaned.experiences);
        combined.skills.add.push(...cleaned.skills.add);
        combined.skills.replace.push(...cleaned.skills.replace);
      }

      if (
        combined.projects.length === 0 &&
        combined.experiences.length === 0 &&
        combined.skills.add.length === 0 &&
        combined.skills.replace.length === 0
      ) {
        setError("No valid suggestions returned.");
        setIsLoading(false);
        return;
      }

      const expItems = combined.experiences.flatMap(exp =>
        exp.items.map((item, index) => ({
          key: `exp-${exp.id}-${index}`,
          section: 'experiences',
          parentId: exp.id,
          context: exp.title,
          old: item.old,
          improved: item.improved,
          removing: false,
        }))
      );
      const projItems = combined.projects.flatMap(proj =>
        proj.items.map((item, index) => ({
          key: `proj-${proj.id}-${index}`,
          section: 'projects',
          parentId: proj.id,
          context: proj.title,
          old: item.old,
          improved: item.improved,
          removing: false,
        }))
      );
      const skillItems = [
        ...combined.skills.add.map((skill, index) => ({
          key: `skill-add-${index}`,
          section: 'skills',
          old: '',
          improved: skill,
          removing: false,
        })),
        ...combined.skills.replace.map((skill, index) => ({
          key: `skill-replace-${index}`,
          section: 'skills',
          old: skill.old,
          improved: skill.improved,
          removing: false,
        })),
      ];

      setSuggestions({
        experiences: expItems,
        projects: projItems,
        skills: skillItems,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to generate improvements.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function buildBatches(text, maxChars) {
    const lines = text.split('\n');
    const batches = [];
    let current = '';
    for (const line of lines) {
      if ((current + '\n' + line).length > maxChars && current) {
        batches.push(current.trim());
        current = line;
      } else {
        current += (current ? '\n' : '') + line;
      }
    }
    if (current.trim()) batches.push(current.trim());
    return batches;
  }

  function sanitizeBullet(str) {
    return (str || '').replace(/[\n\r]+/g, ' ').replace(/["\\]/g, '').replace(/\s+/g, ' ').trim();
  }

  function cleanParsed(raw) {
    const result = { projects: [], experiences: [], skills: { add: [], replace: [] } };
    const validActions = ['replace', 'add'];

    if (Array.isArray(raw?.projects)) {
      raw.projects.forEach(p => {
        const keys = Object.keys(p || {});
        if (!['id', 'title', 'items'].every(k => keys.includes(k)) || keys.length !== 3) return;
        const items = Array.isArray(p.items)
          ? p.items.reduce((acc, it) => {
              const k = Object.keys(it || {});
              if (!['old', 'improved', 'action'].every(x => k.includes(x)) || k.length !== 3) return acc;
              if (!validActions.includes(it.action)) return acc;
              const action = it.action === 'replace' && it.old?.trim() ? 'replace' : 'add';
              acc.push({ old: action === 'replace' ? it.old : '', improved: sanitizeBullet(it.improved), action });
              return acc;
            }, [])
          : [];
        if (items.length) result.projects.push({ id: p.id, title: p.title, items });
      });
    }

    if (Array.isArray(raw?.experiences)) {
      raw.experiences.forEach(p => {
        const keys = Object.keys(p || {});
        if (!['id', 'title', 'items'].every(k => keys.includes(k)) || keys.length !== 3) return;
        const items = Array.isArray(p.items)
          ? p.items.reduce((acc, it) => {
              const k = Object.keys(it || {});
              if (!['old', 'improved', 'action'].every(x => k.includes(x)) || k.length !== 3) return acc;
              if (!validActions.includes(it.action)) return acc;
              const action = it.action === 'replace' && it.old?.trim() ? 'replace' : 'add';
              acc.push({ old: action === 'replace' ? it.old : '', improved: sanitizeBullet(it.improved), action });
              return acc;
            }, [])
          : [];
        if (items.length) result.experiences.push({ id: p.id, title: p.title, items });
      });
    }

    const skills = raw?.skills || {};
    if (Array.isArray(skills.add)) {
      skills.add.forEach(s => {
        if (typeof s === 'string' && s.trim()) result.skills.add.push(sanitizeBullet(s));
      });
    }
    if (Array.isArray(skills.replace)) {
      skills.replace.forEach(s => {
        const k = Object.keys(s || {});
        if (!['old', 'improved'].every(x => k.includes(x)) || k.length !== 2) return;
        result.skills.replace.push({ old: s.old, improved: sanitizeBullet(s.improved) });
      });
    }

    return result;
  }

  /** Try strict JSON.parse; if it fails, trim to the outermost braces and parse again. */
  function safeParseJson(s) {
    try {
      return JSON.parse(s);
    } catch {
      const start = s.indexOf("{");
      const end = s.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        const trimmed = s.slice(start, end + 1);
        try {
          return JSON.parse(trimmed);
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  const triggerRemove = (category, key) => {
    setSuggestions(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        [category]: prev[category].map(item =>
          item.key === key ? { ...item, removing: true } : item
        ),
      };
      setTimeout(() => {
        setSuggestions(curr => {
          if (!curr) return curr;
          return {
            ...curr,
            [category]: curr[category].filter(item => item.key !== key),
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

        {error && <div className="error">{error}</div>}

        {suggestions && !isLoading && (
          <div className="suggestion-content">
            {suggestions.experiences.map(item => (
              <div key={item.key} className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}>
                <button className="remove-btn" onClick={() => triggerRemove('experiences', item.key)}>×</button>
                {item.context && <h5>{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="row gap-s">
                  <button className="btn" onClick={() => handleAction('replace', item)}>Replace</button>
                  <button className="btn" onClick={() => handleAction('add', item)}>Add</button>
                </div>
              </div>
            ))}
            {suggestions.projects.map(item => (
              <div key={item.key} className={`suggestion-card ${item.removing ? 'fade-out' : ''}`}>
                <button className="remove-btn" onClick={() => triggerRemove('projects', item.key)}>×</button>
                {item.context && <h5>{item.context}</h5>}
                <BeforeAfterSlider before={item.old} after={item.improved} />
                <div className="row gap-s">
                  <button className="btn" onClick={() => handleAction('replace', item)}>Replace</button>
                  <button className="btn" onClick={() => handleAction('add', item)}>Add</button>
                </div>
              </div>
            ))}
            {suggestions.skills.length > 0 && (
              <div className="skill-suggestions">
                {suggestions.skills.map(item => (
                  <div key={item.key} className={`skill-chip ${item.removing ? 'fade-out' : ''}`}>
                    <button className="remove-btn" onClick={() => triggerRemove('skills', item.key)}>×</button>
                    {item.old ? (
                      <span><strong>{item.old}</strong> → {item.improved}</span>
                    ) : (
                      <span>{item.improved}</span>
                    )}
                    <div className="row gap-s">
                      {item.old && (
                        <button className="btn" onClick={() => handleAction('replace', item)}>Replace</button>
                      )}
                      <button className="btn" onClick={() => handleAction('add', item)}>Add</button>
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
            experience descriptions, and recommended skills to add to your resume.
          </p>
        )}
      </div>
    </>
  );
}

export default AiSuggestions;
