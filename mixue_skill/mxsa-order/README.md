# 蜜雪冰城点餐 Skill

蜜雪冰城AI智能点餐技能包，支持在智能体 IDE 中通过对话完成门店搜索、商品选购、下单支付全流程。

## 兼容平台

- Qoder
- WorkBuddy
- OpenClaw
- 其他支持 Agent Skills 标准的智能体 IDE

## 安装

将 `mxsa-order` 文件夹导入智能体 IDE 的 skills 目录即可。

## 依赖

需要配置 `mxsa-order` MCP Server：

```json
{
  "mxsa-order": {
    "type": "streamable-http",
    "url": "https://third-activity-qa.mxbc.net/mxsamcp/mcp",
    "headers": {
      "Authorization": "Bearer <your-token>"
    }
  }
}
```

Token 获取：访问 https://mxsa-h5-qa.mxbc.net/open/#/login 登录获取。

## 目录结构

```
mxsa-order/
├── SKILL.md              # 核心技能指令
├── README.md             # 本文件
├── LICENSE               # MIT 许可证
└── references/           # 引用资源
    └── enums.json        # 杯型/属性/规格枚举数据
```

## 支持的功能

| 功能 | 说明 |
|------|------|
| 搜索门店 | 按位置/关键词搜索蜜雪冰城门店 |
| 搜索商品 | 按门店查询可售商品 |
| 商品详情 | 查看杯型、属性、规格等配置 |
| 算价 | 根据选择计算优惠后价格 |
| 创建订单 | 下单并获取支付信息 |
| 查询订单 | 查看订单状态和详情 |

## 许可证

MIT
