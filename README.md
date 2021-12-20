# 简易 UI 自定义库

> 参考文章：
> 
> - [Monorepo-多包单仓库的开发模式](https://juejin.cn/post/6844904206076248072)
> - [Lerna + yarn 实现 monorepo 管理](https://juejin.cn/post/6844904112534847501)

## TODO LIST

- build-utils 打包 custom-ui 以及发布流程跑通
- watch 模式
- build-utils 分组打包各组件
- basic 组件批量打包、业务组件单独打包区分
- 引入 stroybook 预览组件生成文档
- custom-ui 组件模板生成
  - js 模板
  - ts 模板

## 环境依赖

```txt
lerna notice cli v4.0.0
lerna info versioning independent

 Environment info:

  System:
    OS: macOS 10.15.7
    CPU: (12) x64 Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
  Binaries:
    Node: 14.15.0 - /var/folders/5d/815wbg8x7fqdszcwpnnfv1xr0000gn/T/yarn--1638672100483-0.05005264529990461/node
    Yarn: 1.22.17 - /var/folders/5d/815wbg8x7fqdszcwpnnfv1xr0000gn/T/yarn--1638672100483-0.05005264529990461/yarn
    npm: 6.14.8 - /usr/local/bin/npm
  Utilities:
    Git: 2.24.3 - /usr/bin/git
  npmPackages:
    lerna: 4.0.0 => 4.0.0 

✨  Done in 0.79s.
```

## 命令相关

查看当前 worktree:

yarn workspaces info --json

发布相关:

注册:

npm adduser

登录:

npm login --registry https://registry.npmjs.org
