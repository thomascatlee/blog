(function () {
    var myPlugin = function (hook, vm) {
    	
    	
	    hook.afterEach(function(html, next) {
	        // ������ html ����á�
	        // beforeEach �� afterEach ֧�ִ����첽�߼�
	        // ...
	        // �첽������ɺ���� next(html) ���ؽ��
	        html = html + "<div id='gitalk-container' style='width: 80%;padding-left: 80px;'></div>";
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
	        next(html);
	    });

    };

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat(myPlugin, $docsify.plugins || []);
})();