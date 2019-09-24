title: "caddy+git实现的自动更新blog"
date: 2017-12-05 19:30:00 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: 痴迷于自动化，IT男的概念里，自动=高级（其实是懒~环境早就搭好验证完，blog都更了好几篇，这篇算是补课了）

---

之前说到caddy的配置，以及ink的使用等；解决了blog有没有的问题。但是如果每次写点东西都要自己跑ink生成页面，手工上传，登录更新等，对我来说还是太麻烦，我的热情会消逝的~

网上看到一些办法，比如[这个](https://sqh.me/tech/host-hugo-blog-using-caddy/)，虽然别人用Hugo，我用ink，原理是一样的嘛。

github都是public项目，对blog还是private的比较好，用了国内的[coding.net](https://coding.net)，填一下信息，就有5个私有项目可用，对我来说足够耍了。关键是它也提供[webhook](https://coding.net/help/doc/git/webhook.html)，可以将更新消息推送到我的caddy服务器，再有服务器去pull回来。

在caddy的站点配置里加上git的一段：

    git {
        repo git仓库地址
        key 仓库的公钥
        interval 86400
        then_long ./ink publish
        hook /webhook
        hook_type generic
    }
coding上[公钥](https://coding.net/help/doc/git/ssh.html)可以按照仓库建立，仓库地址是SSH形式的，形如```git@git.coding.net:thomascatlee/sample.git```这样。还需要给仓库设置webhook，URL写caddy站点地址/webhook（配置里写的是/webhook，亦可以随意，对得上即可），只推仓库push 事件。

这样每次更新到git上后，git服务器会自动推送；caddy收到后自动去pull并执行ink的更新。

这样解决了手工上传更新的问题，而且所有的blog内容都在git上有一份，我也可以在任意环境下写点东西，不用再有ink的运行环境。

嗯，这样我就有个大胆的想法~

