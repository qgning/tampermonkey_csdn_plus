import { GM_addStyle, GM_setClipboard } from '$'

async function main() {
  //去除登录框
  // GM_addStyle(".passport-login-container{display:none!important;}");

  // 设置文字为可选
  function style_selectable(selector: string): string {
    return selector + " {\
    -webkit-touch-callout: auto;\
    -webkit-user-select: auto;\
    -khtml-user-select: auto;\
    -moz-user-select: auto;\
    -ms-user-select: auto;\
    user-select: auto;\
    !important;\
  }"
  }
  GM_addStyle(
    style_selectable('#content_views')
    + style_selectable('#content_views pre')
    + style_selectable('#content_views pre code')
  )

  // 删除页面的ID，使其不关联相关事件
  //document.getElementById('content_views')?.setAttribute('id','')
  //document.getElementById('article_content')?.setAttribute('id','')

  // 使用cloneNode复制一遍.blog-content-box去除js赋值的处理程序
  let contentEl = document.querySelector('main .blog-content-box')
  contentEl?.parentNode?.replaceChild(contentEl.cloneNode(true), contentEl)
  document.querySelectorAll('.pre-numbering')?.forEach(e => e.removeAttribute('style')) // 显示由于clone blog-content-box导致的代码行号动画未执行而不显示

  // 展开折叠的代码
  document.querySelectorAll('.set-code-hide').forEach(e => e.classList.remove('set-code-hide')) //移除折叠样式
  document.querySelectorAll('.hide-preCode-box').forEach(e => e.remove())   //移除下拉箭头

  // 遍历登陆复制按钮并修改属性
  let copy_buttons = document.getElementsByClassName('hljs-button')
  for (let i = 0; i < copy_buttons.length; i++) {
    copy_buttons[i].setAttribute('data-title', 'Copy code')
    copy_buttons[i].removeAttribute('onclick')

    let timerid: number | undefined = undefined // TODO

    copy_buttons[i].addEventListener('click', (event: Event) => {
      let button = copy_buttons[i];

      clearTimeout(timerid)
      event.stopPropagation()   // 阻止事件冒泡
      GM_setClipboard((button.parentNode as HTMLElement).innerText, 'text')  //TODO 去掉断言
      button.setAttribute('data-title', 'Copied!')
      timerid = setTimeout(() => {
        button.setAttribute('data-title', 'Copy code')
      }, 1000)
    })
  }

  // 展开需要关注博主阅读全文的内容
  document.getElementById('article_content')?.removeAttribute("style")
  document.getElementsByClassName('hide-article-box')[0]?.remove()
}

main().catch((err) => {
  console.error(err)
})
