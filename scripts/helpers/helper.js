/* global hexo */

'use strict'

const url = require('url');

hexo.extend.helper.register('isInHomePaging', function (pagePath, route) {
  if (pagePath.length > 5 && route === '/') {
    return pagePath.slice(0, 5) === 'page/';
  } else {
    return false;
  }
});

/* code block language display */
hexo.extend.filter.register('after_post_render', function (data) {
  while (/<figure class="highlight ([a-zA-Z\+\-\/\#]+)">.*?<\/figure>/.test(data.content)) {
      data.content = data.content.replace(/<figure class="highlight ([a-zA-Z\+\-\/\#]+)">.*?<\/figure>/, function () {
          var language = RegExp.$1 || 'code'
          var lastMatch = RegExp.lastMatch
          if (language=='plain'){
              language='code';
          }
          lastMatch = lastMatch.replace(/<figure class="highlight /, '<figure class="iseeu highlight ')
          return '<div class="highlight-container" data-rel="'
              + language.replace(language[0],language[0].toUpperCase()) + '">' + lastMatch + '</div>'
      })
  }
  return data;
})

hexo.extend.helper.register('createNewArchivePosts', function (posts) {
  const postList = [], postYearList = [];
  posts.forEach(post => postYearList.push(post.date.year()));
  Array.from(new Set(postYearList)).forEach(year => {
    postList.push({
      year: year,
      postList: []
    })
  });
  postList.sort((a, b) => b.year - a.year)
  postList.forEach(item => {
    posts.forEach(post => item.year === post.date.year() && item.postList.push(post))
  });
  postList.forEach(item => item.postList.sort((a, b) => b.date.unix() - a.date.unix()));
  return postList;
});

hexo.extend.helper.register('getAuthorLabel', function (postCount, isAuto, labelList) {

  let level = Math.floor(Math.log2(postCount));
  level = level < 2 ? 1 : level - 1;

  if (isAuto === false && Array.isArray(labelList) && labelList.length > 0) {
    return level > labelList.length ? labelList[labelList.length - 1] : labelList[level - 1];
  } else {
    return `Lv${level}`;
  }

});

hexo.extend.helper.register('getPostUrl', function (rootUrl, path) {
  if (rootUrl) {
    let { href } = url.parse(rootUrl);
    if (href.substr(href.length - 1, 1) !== '/') {
      href = href + '/';
    }
    return href + path;
  } else {
    return path;
  }
});

hexo.extend.helper.register('__js', function (path) {
  const _js = hexo.extend.helper.get('js').bind(hexo);
  const cdnPathHandle = (path_2) => {
    if (this.theme.cdn.use == "unpkg") {
      return this.theme.cdn.enable
        ? `<script src="https://unpkg.com/hexo-theme-redefine@${this.theme.version}/source/${path_2}"></script>`
        // ${this.theme.version}
        : _js(path_2);
    } else if (this.theme.cdn.use == "jsdelivr") {
      return this.theme.cdn.enable
        ? `<script src="https://cdn.jsdelivr.net/npm/hexo-theme-redefine@${this.theme.version}/source/${path_2}"></script>`
        // ${this.theme.version}
        : _js(path_2);
    } else if (this.theme.cdn.use == "aliyun") {
      return this.theme.cdn.enable
        ? `<script src="//evan.beee.top/projects/hexo-theme-redefine/v${this.theme.version}/source/${path_2}"></script>`
        // ${this.theme.version}
        : _js(path_2);
    } else {
      return this.theme.cdn.enable
      ? `<script src="https://unpkg.com/hexo-theme-redefine@${this.theme.version}/source/${path_2}"></script>`
      // ${this.theme.version}
      : _js(path_2);
    }
  }

  let t = ``;

  if (Array.isArray(path)) {
    for (const p of path) {
      t += cdnPathHandle(p);
    }
  } else {
    t = cdnPathHandle(path);
  }

  return t;
});

hexo.extend.helper.register('__css', function (path) {
  const _css = hexo.extend.helper.get('css').bind(hexo);
  
  if (this.theme.cdn.enable) {
    if (this.theme.cdn.use == "unpkg") {
      return `<link rel="stylesheet" href="https://unpkg.com/hexo-theme-redefine@${this.theme.version}/source/${path}">`;
    } else if (this.theme.cdn.use == "jsdelivr") {
      return `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hexo-theme-redefine@${this.theme.version}/source/${path}">`;
    } else if (this.theme.cdn.use == "aliyun") {
      return `<link rel="stylesheet" href="//evan.beee.top/projects/hexo-theme-redefine/v${this.theme.version}/source/${path}">`;
    } else {
      return `<link rel="stylesheet" href="https://unpkg.com/hexo-theme-redefine@${this.theme.version}/source/${path}">`;
    }
  } else {
    return _css(path);
  }

});
