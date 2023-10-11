(function () {
    var myPlugin = function (hook, vm) {

        // Invoked on each page load after new HTML has been appended to the DOM
        hook.doneEach(function () {

            const marked = document.querySelector("article");

            if ((vm.frontmatter.title !== undefined) && (marked !== null)) {
                titleline = "<h1><span>" + vm.frontmatter.title + "</span></h1>"
                nameline = ""
                timeline = "<hr />"
                
                if (vm.config.author !== undefined) {
                    nameline = "<span>" + vm.config.author + "</span>"
                }
                if (vm.frontmatter.date !== undefined) {
                    timeline = "<span>" + vm.frontmatter.date.toLocaleString() + "</span><hr />"
                }
                marked.innerHTML = titleline + "<p align='right'>" + nameline + " " + timeline + "</p>" + marked.innerHTML
            }
        });
    };

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat(myPlugin, $docsify.plugins || []);
})();