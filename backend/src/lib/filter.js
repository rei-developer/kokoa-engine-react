const stripTags = (input, allowed) => {
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, ($0, $1) => { return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '' })
}

module.exports.disable = text => {
  text = text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ``)
  return text
}

module.exports.topic = text => {
  text = stripTags(text, `<video><p><pre><q><br><a><b><h1><h2><h3><h4><h5><h6><hr><span><strong><em><u><s><sub><sup><address><ol><ul><li><blockquote><img><iframe><embed><object><param><table><tbody><tr><td><code><audio><source>`)
  text = text.replace(/(http(s)?:\/\/)?(www.)?youtube.com\/watch\?v=([a-zA-Z0-9\-_]+)/gi, `<p><iframe src='//www.youtube.com/embed/$4' width='560' height='314' allowfullscreen='allowfullscreen'></iframe></p>`)
  text = text.replace(/(http(s)?:\/\/)?(www.)?youtu.be\/([a-zA-Z0-9\-_]+)/gi, `<p><iframe src='//www.youtube.com/embed/$4' width='560' height='314' allowfullscreen='allowfullscreen'></iframe></p>`)
  text = text.replace(/((http(s)?:\/\/)?(www.)?twitter(\.[^(\n|\t|\s,)]+)+)+/gi, `<p><a href='$&' target='_blank'>$&</a></p><p><blockquote class='twitter-tweet' data-lang='ko'><a href='$&'></a></blockquote><script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script></p>`)
  text = text.replace(/((http(s)?:\/\/)?(www.)?instagram(\.[^(\n|\t|\s,)]+)+)+/gi, `<p><a href='$&' target='_blank'>$&</a></p><p><blockquote class='instagram-media' data-instgrm-permalink='$&' data-instgrm-version='12' style=' max-width:540px; min-width:326px; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);'></blockquote><script async defer src='//platform.instagram.com/en_US/embeds.js'></script></p>`)
  text = text.replace(/(http(s)?:\/\/)?(www.)?gfycat.com\/(ko\/)?([a-zA-Z0-9\-_]+)/gi, `<div style='position:relative; padding-bottom:150.00%'><iframe src='https://gfycat.com/ifr/$5' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>`);
  text = text.replace(/\[\[\s*(\d+)\]\]/gi, `<a href='/reader/$1' target='_blank' class='hitomiReader'><i class='heart icon'></i>$1</a>`)
  text = text.replace(/^\s+|\s+$/g, ``)
  return text
}

module.exports.post = text => {
  text = text.replace(/^\s+|\s+$/g, ``)
  text = text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ``)
  text = text.replace(/\n/g, ` <br>`)
  text = stripTags(text, `<p><pre><q><br><a><b><h1><h2><h3><h4><h5><h6><hr><span><strong><em><u><s><sub><sup><address><ol><ul><li><blockquote><img><iframe><embed><object><param><table><tbody><tr><td><code><audio><source>`)
  text = text.replace(/((http(s)?:\/\/)?(www.)?twitter(\.[^(\n|\t|\s,)]+)+)+/gi, `<p><a href='$&' target='_blank'>$&</a></p><p><blockquote class='twitter-tweet' data-lang='ko'><a href='$&'></a></blockquote><script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script></p>`)
  text = text.replace(/\[\[\s*(\d+)\]\]/gi, `<a href='//hiyobi.me/reader/$1.html' target='_blank' class='hitomiReader'><i class='heart icon'></i>$1</a>`)
  return text
}