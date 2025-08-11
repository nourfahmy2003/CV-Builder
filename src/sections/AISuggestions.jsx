import { useState } from 'react';

function AISuggestions({ data }) {
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSuggestions = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setError('Set VITE_OPENAI_API_KEY to enable suggestions.');
      return;
    }
    setLoading(true);
    setError('');
    setSuggestions('');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that reviews resumes and suggests improvements.',
            },
            {
              role: 'user',
              content: `Here is a resume in JSON format: ${JSON.stringify(
                data
              )}. Provide concise suggestions to improve it.`,
            },
          ],
        }),
      });
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      const message = result.choices?.[0]?.message?.content?.trim();
      setSuggestions(message || 'No suggestions found.');
    } catch (err) {
      setError('Unable to generate suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suggestions">
      <h2>AI Suggestions</h2>
      <button type="button" onClick={generateSuggestions} disabled={loading}>
        {loading ? 'Generating...' : 'Get AI Suggestions'}
      </button>
      {error && <p className="error">{error}</p>}
      {suggestions && (
        <div className="suggestions-output">
          <p>{suggestions}</p>
        </div>
      )}
    </div>
  );
}

export default AISuggestions;
