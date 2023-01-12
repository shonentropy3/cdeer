### 1、Foundry环境配置

https://learnblockchain.cn/article/4524

https://learnblockchain.cn/article/4360

https://learnblockchain.cn/article/3502

### 2、安装依赖
```bash
forge install foundry-rs/forge-std --no-commit
forge install https://github.com/Uniswap/permit2 --no-commit
```
### 3、forge教程 

https://book.getfoundry.sh/forge/tests

### 4、基本测试命令
```bash
# 运行所有测试
forge test
# 启用优化器--Temporary Solve Stack too deep
forge test --via-ir
# 显示详细信息
forge test -vvvvv
# 指定函数测试
forge test --match-test testCannotApplyYourself
#
forge test --via-ir -vvvvv --match-test testProlongStage
```
### 5、覆盖率
```bash
# 查看测试覆盖率
forge coverage
# 将覆盖率写入到lcov.info文件，搭配Coverage Gutters插件使用
forge coverage --report lcov
```
VS Code 插件 **Coverage Gutters**

**使用方法**：Open the command palette in VS Code (CMD+SHIFT+P or CTRL+SHIFT+P by default) and type “Display Coverage”, you should see the option “Coverage Gutters: Display Coverage“, select it.

