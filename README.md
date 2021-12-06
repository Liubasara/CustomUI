# 简易 UI 自定义库

> 参考文章：
> 
> - [Monorepo-多包单仓库的开发模式](https://juejin.cn/post/6844904206076248072)
> - [Lerna + yarn 实现 monorepo 管理](https://juejin.cn/post/6844904112534847501)

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