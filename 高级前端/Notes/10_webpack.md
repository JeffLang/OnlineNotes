## 前言

### 一、什么是webpack

webpack是一个打包工具，他的宗旨是一切静态资源皆可打包。有人就会问为什么要webpack？webpack是现代前端技术的基石，常规的开发方式，比如jquery,html,css静态网页开发已经落后了。现在是MVVM的时代，数据驱动界面。webpack它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其打包为合适的格式以供浏览器使用。

### 二、webpack核心概念

**1、Entry（入口）：**指示webpack应该使用哪个模块，用来作为构建其内部依赖图的开始，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

**2、Output（出口）：**告诉 webpack 在哪里输出它所创建的结果文件，以及如何命名这些文件，默认值为./dist。

**3、Loader（模块转换器）：**将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

**4、Plugins（插件）：**在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

**5、Module(模块)：**开发者将程序分解成离散功能块，并称之为模块，在webpack里一个模块对应着一个文件，webpack会从配置的 Entry 开始递归找出所有依赖的模块。

## 01、webpack 中的 loader 的作用是什么

`webpack `是基于node的，只能处理 `JS `和 `JSON `文件，loader 的作用是用来处理其他类型的文件（less\vue....等） 可以将 less 转成 css 文件，将 `jsx `处理成 `JS `文件，将其他版本的ES处理成浏览器能识别的ES版本

