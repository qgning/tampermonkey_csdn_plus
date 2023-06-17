import {GM_addStyle, GM_setClipboard } from '$'

//去除登录框
// GM_addStyle(".passport-login-container{display:none!important;}");

// 设置代码区域为可选
GM_addStyle("\
  #content_views pre {\
    -webkit-touch-callout: auto;\
    -webkit-user-select: auto;\
    -khtml-user-select: auto;\
    -moz-user-select: auto;\
    -ms-user-select: auto;\
    user-select: auto;\
    !important;\
  }\
  #content_views pre code {\
    -webkit-touch-callout: auto;\
    -webkit-user-select: auto;\
    -khtml-user-select: auto;\
    -moz-user-select: auto;\
    -ms-user-select: auto;\
    user-select: auto;\
    !important;\
}\
");

// 删除页面的ID，使其不关联相关事件
//document.getElementById('content_views')?.setAttribute('id','')
//document.getElementById('article_content')?.setAttribute('id','')

// 使用cloneNode复制一遍.blog-content-box去除js赋值的处理程序
let contentEl = document.querySelector('main .blog-content-box')
contentEl.parentNode.replaceChild(contentEl.cloneNode(true), contentEl)

// 展开折叠的代码
document.querySelectorAll('.set-code-hide').forEach(el => el.classList.remove('set-code-hide')) //移除折叠样式
document.querySelectorAll('.hide-preCode-box').forEach(el => el.remove())   //移除下拉箭头

// 遍历登陆复制按钮并修改属性
let copy_buttons = document.getElementsByClassName('hljs-button');
for (let i = 0; i < copy_buttons.length; i++) {
  copy_buttons[i].setAttribute('data-title', 'Copy code');
  copy_buttons[i].removeAttribute('onclick','');

  let timerid;

  copy_buttons[i].addEventListener('click', function (event) {
    let button = this;

    clearTimeout(timerid);
    event.stopPropagation();  // 阻止事件冒泡
    GM_setClipboard(this.parentNode.innerText);
    button.setAttribute('data-title', 'Copied!');
    timerid = setTimeout(function () {
      button.setAttribute('data-title', 'Copy code');
    }, 1000);
  });
}