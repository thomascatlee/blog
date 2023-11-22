---
title: gitalk的小问题
date: 2023-11-20 17:23:47 +0800
author: wildcat
tags: []
---

一直没怎么关注评论问题，才发现现在所有文章的评论都堆在一起；用的一直是docsify的官方gitalk插件，之前好像好使的呢？
带着疑问看了一下，似乎因为我用的简易用法；index.html只加载一次，那么gitalk的初始化内容就一直是不变的喽，这样id也是初始化时候的，除非刷新浏览器，不然不会变。点击左侧目录跳转时，虽然location.href有改变，但是gitalk一直是最开始New的那一个，所以gitalk.render传递给github的issue参数是一样的，评论自然就堆在一起喽。
自己写个js，把gitalk的定义挪出来，保证每次更新页面重新New，应该就正常了吧。

```
(function () {
    var myPlugin = function (hook, vm) {

	    hook.doneEach(function() {
	    	// Add gitalk container if not exists
        var previousGitalk = document.getElementById('gitalk-container')
        if (!previousGitalk) {
            var gitalkContainer = document.createElement('div')
            gitalkContainer.id = 'gitalk-container'
            gitalkContainer.style.maxWidth = '80%'
            gitalkContainer.style.margin = '0px auto 20px'
            document.getElementById("main").parentNode.insertBefore(gitalkContainer, undefined)
        } else {
 	
		        for (var n = previousGitalk; n.hasChildNodes(); )
		            n.removeChild(n.firstChild);
        }
                
        var config = window.$docsify.gitalk;
        var gitalk = new Gitalk({
		        clientID: config.clientID,
		        clientSecret: config.clientSecret,
		        repo: config.repo,
		        owner: config.owner,
		        admin: config.admin,
		        distractionFreeMode: false,
		        id: md5(location.href.split('#')[1]),
		    });
  			gitalk.render('gitalk-container');
	    });

    };

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat(myPlugin, $docsify.plugins || []);
})();

```
