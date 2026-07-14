// api/search.js - Vercel Serverless Function

const items = [
  {
    id: 1,
    title: 'AI 前端工程师学习路线',
    desc: '整理 AI 工具、前端工程化、Node 全栈和架构能力的学习路径。',
  },
  {
    id: 2,
    title: 'DeepSeek 聊天接口',
    desc: '通过 Vercel Serverless Function 请求 DeepSeek API。',
  },
  {
    id: 3,
    title: '支付宝小程序页面',
    desc: '包含 axml、acss、js、json 的小程序页面示例。',
  },
  {
    id: 4,
    title: '搜索页面示例',
    desc: '输入关键词后请求接口，并把返回 list 渲染到页面。',
  },
];

/**
 * Searches local demo items by keyword.
 *
 * @param {string} keyword - Search keyword from the request.
 * @returns {{ list: Array<{ id: number, title: string, desc: string }> }}
 */
function searchItems(keyword) {
  const normalizedKeyword = String(keyword || '').trim().toLowerCase();

  if (!normalizedKeyword) {
    return { list: items };
  }

  return {
    list: items.filter((item) => {
      const searchableText = `${item.title} ${item.desc}`.toLowerCase();
      return searchableText.includes(normalizedKeyword);
    }),
  };
}

/**
 * Returns a filtered search list for the keyword query parameter.
 *
 * @param {{ method: string, query?: { keyword?: string } }} req - Incoming Vercel request.
 * @param {{ status: (statusCode: number) => { json: (body: object) => void } }} res - Outgoing Vercel response.
 * @returns {void}
 */
function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json(searchItems(req.query && req.query.keyword));
}

module.exports = handler;
module.exports.searchItems = searchItems;
