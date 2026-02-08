# Lacuna 分析文档

## 1. Lacuna 简介

**Lacuna** 是 JavaScript 死代码消除工具。

### 主要特点

- **用途**：识别并消除 JavaScript 应用中的死代码（未使用的函数）
- **方法**：结合多种静态和动态分析技术创建调用图，识别不可达函数

### 工作原理

- 创建概率调用图，每条边有权重（0-1）表示函数调用的可能性
- 使用阈值过滤低权重边来消除不太可能被调用的函数


### 优化级别

Lacuna 提供 4 个优化级别：

- **Level 0**: 仅分析，不进行优化
- **Level 1**: 用懒加载机制替换函数体
- **Level 2**: 移除函数体
- **Level 3**: 用 null 替换函数定义
- 支持多种分析器生成调用图：static、dynamic、nativecalls、acg、jelly、npm_cg(tajs、wala不太行，不支持ES6语法)

## 2. 项目中的 Lacuna 集成

### 集成实现

项目通过 `scripts/optimizer.ts` (第 154-245 行) 封装了 Lacuna 的调用流程：

1. **创建临时目录**：将输入代码保存为 `input.js`
2. **生成 HTML 入口文件**：创建 `index.html` 引用 JS 文件
3. **创建 package.json**：确保分析器兼容性
4. **调用 Lacuna**：通过 `lacuna_runner.js` 执行分析和优化
5. **读取结果**：从临时目录获取优化后的代码
6. **清理环境**：删除临时文件

### 默认配置

```javascript
{
  analyzer: { jelly: 0.5 },  // 使用 Jelly 分析器，阈值 0.5
  optimizationLevel: 2        // 优化级别 2（移除函数体）
}
```

### CLI 参数

项目支持通过命令行参数自定义 Lacuna 配置：

- `--lacunaAnalyzer`: 指定分析器和阈值
  - 示例：`"static:0.6,acg:0.5"`
  - 可以组合多个分析器
- `--lacunaLevel`: 指定优化级别 (0-3)

### Lacuna Runner

`vendor/Lacuna/lacuna_runner.js` 负责：

- 验证运行选项（目录、入口文件、分析器、优化级别）
- 规范化脚本以供 Lacuna 处理
- 运行 lacunizer 创建和分析调用图
- 输出日志和调用图可视化（DOT 格式）

## 3. 测试结果

### 基准测试数据

测试结果保存在 `sizes.json` 文件中，展示了 Lacuna 在不同库上的优化效果：

| 库 | 原始大小 | Lacuna 优化后 | 减少比例 |
|---------|----------|--------|-----------|
| lodash (rolldown) | 489,090B | 594B | **99.9%** |
| lodash-es (rolldown) | 110,346B | 81,454B | 26.2% |
| rambda (rollup) | 2,473B | 467B | 81.1% |
| test-simple (rolldown) | - | 119B | - |

### 结果分析

- **lodash (rolldown)**: Lacuna 实现了惊人的 99.9% 代码减少，从 489KB 降至仅 594 字节
- **lodash-es (rolldown)**: 减少了 26.2%，从 110KB 降至 81KB
- **rambda (rollup)**: 减少了 81.1%，从 2.5KB 降至 467 字节

这些结果表明 Lacuna 在消除未使用代码方面非常有效，特别是对于像 lodash 这样的大型工具库。

## 4. 关键文件位置

### Lacuna 相关文件

- **主入口**：`vendor/Lacuna/lacuna_runner.js`
- **核心逻辑**：`vendor/Lacuna/lacunizer.js`
- **调用图**：`vendor/Lacuna/call_graph.js`
- **文档**：`vendor/Lacuna/README.md`

### 项目集成代码

- **优化器封装**：`scripts/optimizer.ts` (第 154-245 行)
- **CLI 接口**：`scripts/cli.ts`
- **打包器**：`scripts/bundle.ts`

### 测试相关

- **测试用例源文件**：`src/` 目录（包含 16 个测试文件）
  - `test-simple.js`
  - `rambda.js`
  - `lodash-es.js`
  - 等等
- **快照目录**：`snapshots/`
- **测试结果**：`sizes.json`

## 5. 使用示例

### 基本使用

```bash
# 使用默认配置（jelly:0.5, level 2）
npm run optimize

# 指定分析器和阈值
npm run optimize -- --lacunaAnalyzer "static:0.6,acg:0.5"

# 指定优化级别
npm run optimize -- --lacunaLevel 3

# 组合使用
npm run optimize -- --lacunaAnalyzer "jelly:0.7" --lacunaLevel 2
```

### 分析器选择建议

- **static**: 静态分析，速度快但可能不够精确
- **jelly**: 平衡精度和性能，推荐用于大多数场景
- **acg**: 更精确的调用图分析
- **dynamic**: 动态分析，需要运行时信息

### 优化级别选择建议

- **Level 0**: 仅用于分析和调试，不修改代码
- **Level 1**: 保守优化，保留函数结构
- **Level 2**: 推荐级别，移除函数体但保留定义
- **Level 3**: 激进优化，完全移除函数定义

## 6. 总结

Lacuna 是一个强大的 JavaScript 死代码消除工具，通过概率调用图分析能够有效识别和移除未使用的代码。在本项目中，Lacuna 被集成为优化流程的一部分，可以通过命令行参数灵活配置。测试结果显示，Lacuna 在某些场景下能够实现高达 99.9% 的代码减少，显著降低最终打包文件的大小。