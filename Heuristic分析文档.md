
# JavaScriptHeuristicOptimizer 分析文档

## 1. JavaScriptHeuristicOptimizer 简介

**JavaScriptHeuristicOptimizer** 是一个基于遗传算法的 JavaScript 代码优化工具。

### 主要特点

- **用途**：通过遗传算法优化 JavaScript 代码，移除冗余节点
- **方法**：使用遗传算法（GA）对 AST 节点进行变异和交叉，寻找更小的等价代码

### 工作原理

- 解析 JavaScript 代码为 AST（抽象语法树）
- 使用遗传算法对 AST 节点进行变异（删除、修改）
- 通过测试验证变异后的代码是否保持功能正确性
- 保留更小且功能正确的代码版本
- 经过多代进化，找到最优解

### 遗传算法参数

JavaScriptHeuristicOptimizer 提供多个可配置参数：

- **individuals**: 种群个体数量（默认：20）
- **generations**: 进化代数（默认：10）
- **trials**: 试验次数（默认：10）
- **crossoverProbability**: 交叉概率（默认：70%）
- **mutationProbability**: 变异概率（默认：30%）
- **elitism**: 是否使用精英主义（默认：true）
- **elitismPercentual**: 精英保留比例（默认：10%）

## 2. 项目中的 Heuristic 集成

### 集成实现

项目通过 `scripts/heuristic.ts` 封装了 JavaScriptHeuristicOptimizer 的调用流程：

1. **创建临时目录**：将输入代码保存为 `index.js`
2. **生成 package.json**：创建库的元数据
3. **创建测试文件**：生成 `test.js` 验证代码功能
4. **生成配置文件**：创建优化器配置 JSON
5. **调用优化器**：执行遗传算法优化
6. **监控最佳解**：实时保存找到的最优代码
7. **读取结果**：获取优化后的代码
8. **清理环境**：删除临时文件

### 示例配置

```javascript
{
  individuals: 15,           // 种群大小
  generations: 10,           // 进化代数
  trials: 10,                // 试验次数
  crossoverProbability: 70,  // 交叉概率
  mutationProbability: 30,   // 变异概率
  elitism: true,             // 使用精英主义
  elitismPercentual: 10      // 保留 10% 精英
}
```


### 超时和内存限制

- **执行超时**：20 分钟
- **内存限制**：4096MB（`--max-old-space-size=4096`）/8192MB（大文件时）
- **客户端内存**：2048MB

## 3. 测试结果

1.用vendor/JavaScriptHeuristicOptmizer自身检测变异个体
|JS库|init size|init+Gzip size|heuristic size|heuristic+terser size|heuristic+terser+Gzip size|原因|正确性|配置(individuals,generations,memory)|
|--|--|--|--|--|--|--|--|--|
|antd|1550610|310864|❌|❌|❌|heuristic: esprima不支持ES2020可选链（?.），解析失败|❌ 流程失败|15，10，8192|
|glob|276805|61021|❌|❌|❌|heuristic: esprima解析错误，无法处理|❌ 流程失败|30，15，4096|
|js-yaml|107394|25794|111498 (+3.8%)|37752 (-64.9%)|12499 (-51.5%)|heuristic反而变大(+3.8%)；terser成功优化|❌ 字和布尔值被解析成字符串|30，15，4096|
|lodash-es|103180|22540|101458 (-1.7%)|17318 (-83.2%)|6253 (-72.2%)|heuristic成功减少1.67%；terser大幅优化|✅ 优化成功|30，15，4096|
|material-ui|698562|134829|❌|❌|❌|测试执行超时(>300s)，不适合heuristic优化|❌ 测试超时|10，5，8192|
|novnc|622673|141663|❌|❌|❌|heuristic: esprima解析错误 "Unexpected token"|❌ 流程失败|10，5，8192|
|react-icons|1357280|423681|1485087 (+9.4%)|9237 (-99.3%)|3593 (-99.2%)|heuristic变大但terser成功大幅优化|✅ 优化成功|10，5，8192|
|remeda|6665|1939|6109 (-8.3%)|1961 (-70.6%)|876 (-54.8%)|heuristic成功减小8.3%；terser继续优化|✅ 优化成功|30，15，4096|
|rxjs|25487|4952|24485 (-3.9%)|8974 (-64.8%)|2627 (-46.9%)|heuristic减小3.9%但破坏功能（输出为空）|❌ 功能错误|30，15，4096|
|sentry|309673|84791|❌|❌|❌|heuristic: esprima不支持ES2018对象扩展运算符(...)|❌ 流程失败|30，15，4096|
|vuetify|304846|74360|❌|❌|❌|heuristic: esprima不支持ES2018对象扩展运算符 line 5774|❌ 流程失败|30，15，4096|


2.用vendor/JavaScriptHeuristicOptmizer自身检测变异个体(结果可能不太对)
|JS库|init size|init+Gzip size|heuristic size|heuristic+terser size|heuristic+terser+Gzip size|原因|正确性|配置(individuals,generations,memory)|
|--|--|--|--|--|--|--|--|--|
|remeda|6665|1939|5148 (-22.8%)|1700 (-74.5%)|785 (-59.5%)|heuristic减小22.8%且验证通过；heuristic+terser组合也通过|✅ heuristic成功 ✅ heuristic+terser成功|30，15，4096|
|lodash-es|103180|22540|101786 (-1.4%)|17910 (-82.6%)|6452 (-71.4%)|heuristic减小1.4%；terser大幅优化82.6%|✅ heuristic成功 ❌ terser破坏功能 (memoize is not defined)|30，15，4096|
|react-icons|1357280|423681|1484723 (+9.4%)|9507 (-99.3%)|3724 (-99.1%)|heuristic变大9.4%且破坏功能；heuristic+terser组合大幅优化99.3%|❌ heuristic单独失败 (Cannot set properties of undefined) ✅ heuristic+terser组合成功|10，5，8192|
|antd|1550610|310864|❌|❌|❌|esprima不支持ES2020可选链（?.），第17313行解析失败|❌ 流程失败|10，5，8192|
|glob|276805|61021|❌|❌|❌|打包输出为ES模块（import/export），esprima仅支持script模式，第1行解析失败|❌ 流程失败|30，15，4096|
|js-yaml|107394|25794|111409 (+3.7%)|❌|❌|heuristic变大3.7%但验证通过；heuristic+terser优化时内存耗尽崩溃（4048MB不足）|✅ heuristic成功 ❌ heuristic+terser内存耗尽|30，15，4048|
|material-ui|698562|134829|731647 (+4.7%)|❌|❌|heuristic变大4.7%且破坏功能（输出为空）；heuristic+terser测试中断|❌ heuristic功能错误（输出为空） ❌ heuristic+terser测试中断|10，5，8192|
|novnc|622673|141663|❌|❌|❌|esprima解析错误，第381行 "Unexpected token ."，可能是可选链语法|❌ 流程失败|10，5，8192|
|rxjs|25487|4952|20297 (-20.4%)|8528 (-66.5%)|2514 (-49.2%)|heuristic减小20.4%但破坏功能；heuristic+terser减小66.5%但仍破坏功能|❌ heuristic失败 (SafeSubscriber is not a constructor) ❌ heuristic+terser失败 (t.add is not a function)|30，15，4096|
|sentry|309673|84791|❌|❌|❌|heuristic: esprima不支持ES2018对象扩展运算符(...)|❌ 流程失败|30，15，4096|
|vuetify|304846|74360|❌|❌|❌|heuristic: esprima不支持ES2018对象扩展运算符 line 5774|❌ 流程失败|30，15，4096|





