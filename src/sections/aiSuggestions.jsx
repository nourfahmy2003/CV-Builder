import { useState } from 'react';

function AISuggestions({ data }) {
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that gives constructive resume feedback.',
            },
            {
              role: 'user',
              content: `Provide suggestions to improve this resume: ${JSON.stringify(data)}`,
            },
          ],
        }),
      });
      const result = await response.json();
      const text = result?.choices?.[0]?.message?.content;
      setSuggestions(text || 'No suggestions received.');
    } catch (err) {
      setSuggestions('Unable to fetch suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-suggestions">
      <button type="button" onClick={fetchSuggestions} disabled={loading}>
        {loading ? 'Loading...' : 'AI Suggestions'}
      </button>
      {suggestions && <pre className="suggestion-output">{suggestions}</pre>}
    </div>
  );
}

export default AISuggestions;
