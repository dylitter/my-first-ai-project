// api/chat.js - Vercel Serverless Function
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({
      error: 'DEEPSEEK_API_KEY 未配置，请在 Vercel 项目 Settings → Environment Variables 中添加',
    });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: message }],
        stream: true,
      }),
    });

    // const data = await response.json();
    // 流失输出
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let reply = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // 解析二进制数据为文本
      const chunk = decoder.decode(value, { stream: true })
      // 按行分割（sse格式要求）
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.substring(5)
          if (data === '[DONE]') {
            break
          }
          try {
            const json = JSON.parse(data)
            const content = json.choices[0].delta.content
            if (content) {
              reply += content
              updateUI(reply)
            }
          } catch (error) {
            console.error('解析JSON失败:', error)
          }
        }
      }
    }

    if (!response.ok) {
      const apiError =
        data?.error?.message || data?.message || `DeepSeek API 返回 ${response.status}`;
      return res.status(response.status).json({ error: apiError });
    }

    if (!reply) {
      return res.status(502).json({ error: 'DeepSeek 返回了空内容' });
    }

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ui更新
function updateUI(content) {
  const aiReply = document.getElementById('aiReply')
  aiReply.textContent = content
  aiReply.scrollTop = aiReply.scrollHeight
}
