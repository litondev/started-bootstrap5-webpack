module.exports = function(htmlWebpackPlugin, options) {
    const innerHTML = options.fn(this);
    
    return require('../partials/layout.hbs')({
        title: htmlWebpackPlugin.options.title,
        innerHTML
    })
}