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