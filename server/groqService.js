import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// AI suggestion endpoint
app.post('/api/suggest', async (req, res) => {
  try {
    const { resumeData, field, context } = req.body;
    
    // Create a prompt based on the data and context
    let prompt = `I need suggestions for my resume. `;
    
    if (field === 'bullet-point') {
      prompt += `Help me write a bullet point for my job experience as a ${resumeData.title || 'professional'} at ${resumeData.company || 'my company'}. `;
      
      if (context) {
        prompt += `Here's what I've written so far: ${context}. `;
      }
      
      prompt += `Please suggest a strong, achievement-focused bullet point that highlights my skills and impact.`;
    } else if (field === 'summary') {
      prompt += `Help me write a professional summary section for my resume. `;
      prompt += `I am a ${resumeData.title || 'professional'} with experience in ${context || 'my field'}. `;
      prompt += `Please write a concise, impactful 2-3 sentence summary that highlights my experience and skills.`;
    }
    
    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Call Groq API with streaming
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional resume writing assistant. Provide concise, impactful suggestions that highlight accomplishments and use strong action verbs. Focus on quantifiable achievements when possible.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_completion_tokens: 200,
      top_p: 1,
      stream: true,
    });

    // Stream response to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('Error with Groq API:', error);
    res.status(500).json({ error: 'Failed to get AI suggestions' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;