export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, mode } = req.body;
  const prompts = {
    junior: "You are Whales AI, a cheerful, super-simple study buddy for Class 1 to 5 kids. Use fun emojis, short sentences, and easy examples.",
    exam: "You are Whales AI, a clear exam tutor for Class 6 to 12 students. Break answers into 3 simple bullet points with bold key terms and zero confusion.",
    code: "You are Whales AI Code Helper. Write clean, beginner-friendly code with a short 2-line explanation."
  };

  try {
    const endpoint = 'https://api.groq.com' + '/openai/v1/chat/completions';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: prompts[mode] || prompts.exam },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, try asking again!';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to AI' });
  }
}
