/*yl-input  maxlength 属性检测*/

class DomCheck {
  constructor() {
    this.inputErrorCount = 0;
    this.ellipsisErrorCount = 0;
    this.timeInterval = '';
  }

  checkDocument() {
    let app = document.getElementById('app');
    this.inputErrorCount = 0;
    this.ellipsisErrorCount = 0;
    this.findNodes(app);
    // this.showError();
  }

  findNodes(dom) {
    if (dom.children) {
      let flag = this.identifyGoing(dom);
      if (flag) {
        for (let i = 0; i < dom.children.length; i++) {
          if (this.identifyDomType(dom.children[i])) {
            if (this.identifyAttr(dom.children[i])) {
              this.markItem(dom.children[i], 'input');
            }
          }

          if (this.identifyEllipsisDom(dom.children[i])) {
            if (this.identifyTitle(dom.children[i])) {
              this.markItem(dom.children[i], 'ellipsis');
            }
          }
          this.findNodes(dom.children[i]);
        }
      }
    }
  }

  // 找有ellipsis 样式的节点
  identifyEllipsisDom(dom) {
    let clazz = this.getAttr(dom, 'class');
    let childs = dom.children;
    let childrenHasTooltip = false;
    if (!(this.getCss(dom, 'textOverflow') === 'ellipsis')) {
      return false;
    }
    if (dom.nodeName === 'TH' || dom.nodeName === 'TD') {
      return false;
    }
    if (!clazz) {
      return false;
    }
    if ((clazz && (clazz.includes('yl-tooltip') || clazz.includes('cell')))) {
      return false;
    }
    for(let i=0;i<childs.length;i++){
      let _class = this.getAttr(childs[i], 'class');
      if (_class && _class.includes('yl-tooltip')) {
        childrenHasTooltip = true;
      }
    }
    if (childrenHasTooltip) {
      return  false
    }

    return true;
  }
  // 查询3级节点是否有title属性
  identifyTitle(dom) {
    const parentDom = dom.parentNode;
    const grandpaDom = dom.parentNode.parentNode;
    if (this.getAttr(dom, 'title') || this.getAttr(parentDom, 'title') || this.getAttr(grandpaDom, 'title')) {
      return false;
    }
    return true;
  }
  // 返回节点样式
  getCss(dom, key) {
    return getComputedStyle(dom, null)[key]
  }

  // 取元素属性
  getAttr(dom, target) {
    return dom ? dom.getAttribute(target) : '';
  }

  // 是否向下查询
  identifyGoing(dom) {
    let clazz = this.getAttr(dom, 'class');
    // yl-select 不查询 // 日期选择不查
    if (clazz) {
      if (clazz.includes('yl-select') || clazz.includes('yl-select-dropdown') || clazz.includes('yl-date-editor')) {
        return false;
      }
    }
    // 看不到的元素，不显示
    /*if (this.getCss(dom,'display') === 'none') {
      return false;
    }*/


    return true;
  }

  // 查询对应节点
  identifyDomType(dom) {
    if (dom.localName === 'input' && this.getAttr(dom, 'class') && this.getAttr(dom, 'class').includes('yl-input__inner')) {
      return true;
    }
  }

  // 是否错误节点
  identifyAttr(dom) {
    if (this.getAttr(dom, 'type') === 'number') {
      if (this.getAttr(dom, 'min') && this.getAttr(dom, 'max')) {
        return false;
      }
    }
    if (this.getAttr(dom, 'disabled')) {
      return false;
    }

    if (this.getAttr(dom, 'maxlength') || this.getAttr(dom, 'min') && this.getAttr(dom, 'max')) {
      return false;
    }

    return true;
  }

  // 标记错误节点
  markItem(dom, key) {
    let text = key === 'input' ? '无maxlength/max属性' : '无title属性';
    console.log(`%c问题节点(${text})：`,'color:#E14A9F', dom);
    dom.style.background = 'pink';
    this[`${key}ErrorCount`]++;
  }

  showError() {
    clearInterval(this.timeInterval);
    this.timeInterval = setTimeout(() => {
      if (this.inputErrorCount) {
        console.log('%c存在' + this.inputErrorCount + '处yl-input缺失maxlength,已粉色标记', 'color:#E14A9F');
      }
      if (this.ellipsisErrorCount) {
        console.log('%c存在' + this.ellipsisErrorCount + '处ellipsis节点未添加title属性,已粉色标记', 'color:#E14A9F');
      }
    }, 500);
  }
}

/* 浏览器检测*/
class urlCheck {
  constructor() {
    this.oldUrl = '';
  }

  checkChange() {
    if (!this.oldUrl) {
      this.oldUrl = window.location.href;
      this.doCheck();
    } else {
      if (this.oldUrl !== window.location.href) {
        this.oldUrl = window.location.href;
        this.doCheck();
      }
    }
  }

  doCheck() {
    this.checkLength();
  }

  //长度检测
  checkLength() {
    let location = window.location;
    if (location.href && location.href.length > 4000) {
      console.log('%c' + 'url长度超长建议优化,url如下：', 'color:#E14A9F');
      console.log(location.href && location.href);
    }
  }
}

const checkUrl = new urlCheck();

/*绑定事件*/

const check = new DomCheck();

let mutationTime = null;
// 监听页面元素变化
const mutationCallback = () => {
  clearTimeout(mutationTime);
  mutationTime = setTimeout(() => {
    check.checkDocument();
    checkUrl.checkChange();
  }, 1500)

};

const config = {childList: true, subtree: true};
const observer = new MutationObserver(mutationCallback);


function handleCheck() {
  setTimeout(() => {
    const targetNode = document.getElementById('app');
    observer.observe(targetNode, config);
    check.checkDocument();
    checkUrl.checkChange();

  }, 2000);
}

module.exports = {
  domCheck: handleCheck
};
