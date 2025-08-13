import React, { useState, useRef } from 'react';
import Groq from 'groq-sdk';
import '../styles/ai-suggestions.css';

function AiSuggestions({ resumeData, onSuggestionReceived }) {
  const [suggestion, setSuggestion] = useState(null);
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
    setSuggestion(null);
    setError(null);

    // Abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Build resume text
      const resumeContent = extractResumeContent(resumeData);
      if (!resumeContent) {
        setError("No project or experience data found to analyze.");
        setIsLoading(false);
        return;
      }

      // Groq client
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      // STRONGER SYSTEM PROMPT
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

      const userPrompt = `
Analyze my resume content and produce JSON in the schema above.

RESUME CONTENT:
${resumeContent}
`.trim();

      let res;
      try {
        res = await groq.chat.completions.create(
          {
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.1,
            top_p: 1,
            max_tokens: 1800,
            stream: false,
            // JSON mode
            response_format: { type: "json_object" },
          },
          { signal: abortControllerRef.current?.signal }
        );
      } catch (apiErr) {
        // If Groq returns json_validate_failed, show the raw generation to help fix prompt
        const fail = apiErr?.error?.failed_generation;
        if (fail) {
          setError(
            "Model returned malformed JSON. Showing raw output so you can inspect:\n\n" +
            fail
          );
        } else {
          setError(apiErr.message || "Request failed.");
        }
        setIsLoading(false);
        return;
      }

      const text = res?.choices?.[0]?.message?.content ?? "";

      // --- Robust parse with a tiny repair fallback ---
      const parsed = safeParseJson(text);
      if (!parsed) {
        setError("Model did not return valid JSON. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuggestion(parsed);
      onSuggestionReceived?.(parsed);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to generate improvements.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  /** Try strict JSON.parse; if it fails, trim to the outermost braces and parse again. */
  function safeParseJson(s) {
    try {
      return JSON.parse(s);
    } catch {
      // Remove any leading/trailing noise (e.g., stray backticks or extra braces)
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

        {suggestion && !isLoading && (
          <div className="suggestion-content">
            {suggestion.experiences?.map(exp => (
              <div key={exp.id}>
                <h4>{exp.title}</h4>
                {exp.items.map((item, index) => (
                  <div key={index} className="suggestion-item">
                    <p><strong>Old:</strong> {item.old}</p>
                    <p><strong>Improved:</strong> {item.improved}</p>
                    <div className="row gap-s">
                      <button className="btn" onClick={() => onSuggestionReceived({ type: 'replace', section: 'experiences', id: exp.id, old: item.old, new: item.improved })}>Replace</button>
                      <button className="btn" onClick={() => onSuggestionReceived({ type: 'add', section: 'experiences', id: exp.id, new: item.improved })}>Add</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {suggestion.projects?.map(proj => (
              <div key={proj.id}>
                <h4>{proj.title}</h4>
                {proj.items.map((item, index) => (
                  <div key={index} className="suggestion-item">
                    <p><strong>Old:</strong> {item.old}</p>
                    <p><strong>Improved:</strong> {item.improved}</p>
                    <div className="row gap-s">
                      <button className="btn" onClick={() => onSuggestionReceived({ type: 'replace', section: 'projects', id: proj.id, old: item.old, new: item.improved })}>Replace</button>
                      <button className="btn" onClick={() => onSuggestionReceived({ type: 'add', section: 'projects', id: proj.id, new: item.improved })}>Add</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {suggestion.skills?.add?.length > 0 && (
              <div>
                <h4>Skills to Add</h4>
                <ul>
                  {suggestion.skills.add.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {suggestion.skills?.replace?.length > 0 && (
              <div>
                <h4>Skills to Replace</h4>
                <ul>
                  {suggestion.skills.replace.map((skill, index) => (
                    <li key={index}><strong>Old:</strong> {skill.old}, <strong>New:</strong> {skill.improved}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && !suggestion && (
          <p className="hint">
            Click "Generate Improvements" to get AI-powered suggestions for your projects,
            experience descriptions, and recommended skills to add to your resume.
          </p>
        )}
      </div>
    </>
  );
}

export default AiSuggestions;
