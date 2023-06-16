# github action
原来travis-ci.org已经不能用了，难怪我的blog挺久没更新了，github有自己的CI，设置了一下，用checkout-commit的办法，也能代替travis-ci。
不过在设置peaceiris/actions-gh-pages@v3参数的时候，没有注意到`keep_files: true`这个属性，gh-pages分支的东西都被干掉了，这样文章时间就有点问题，先这样吧。要想解决好，还是得像ink、hugo那样写在md文件里，或jekyll写在文件名里，这有点点麻烦，有个自动生成的写作工具就好了。目前vnote、小书匠、Typora都没有这个功能，当然，主要是我懒。