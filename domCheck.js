/*yl-input  maxlength 属性检测*/

class DomCheck {
  constructor() {
    this.inputErrorCount = 0;
    this.ellipsisErrorCount = 0;
    this.errorList = [];
    this.timeInterval = '';
  }

  // 启动
  checkDocument() {
    let app = document.getElementById('app');
    this.inputErrorCount = 0;
    this.ellipsisErrorCount = 0;
    this.findNodes(app);
    // this.showError();
  }

  // 节点递归
  findNodes(dom) {
    if (dom.children) {
      let flag = DomCheck.identifyGoing(dom);
      if (flag) {
        for (let i = 0; i < dom.children.length; i++) {
          if (DomCheck.identifyDomType(dom.children[i])) {
            if (DomCheck.identifyAttr(dom.children[i])) {
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
    let clazz = DomCheck.getAttr(dom, 'class');
    let childs = dom.children;
    let childrenHasTooltip = false;
    if (!(DomCheck.getCss(dom, 'textOverflow') === 'ellipsis')) {
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
    for (let i = 0; i < childs.length; i++) {
      let _class = DomCheck.getAttr(childs[i], 'class');
      if (_class && _class.includes('yl-tooltip')) {
        childrenHasTooltip = true;
      }
    }
    return !childrenHasTooltip;


  }

  // 查询3级节点是否有title属性
  identifyTitle(dom) {
    const parentNode = dom.parentNode; // 父节点
    const grandpaNode = dom.parentNode.parentNode; // 祖节点
    const childNodes = dom.childNodes; // 子节点
    if (DomCheck.getAttr(dom, 'title') || DomCheck.getAttr(parentNode, 'title') || DomCheck.getAttr(grandpaNode, 'title')) {
      return false;
    }
    let childTitle = false;
    for (let i = 0; i < childNodes.length; i++) {
      if (DomCheck.getAttr(childNodes[i], 'title')) {
        return false;
      }
    }
    return true;
  }

  // 返回节点样式
  static getCss(dom, key) {
    return getComputedStyle(dom, null)[key];
  }

  // 取元素属性
  static getAttr(dom, target) {
    try {
      return dom ? dom.getAttribute(target) : '';
    } catch (e) {
    }
    return '';
  }

  // 是否向下查询
  static identifyGoing(dom) {
    let clazz = DomCheck.getAttr(dom, 'class');
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
  static identifyDomType(dom) {
    if (dom.localName === 'input' && DomCheck.getAttr(dom, 'class') && DomCheck.getAttr(dom, 'class').includes('yl-input__inner')) {
      return true;
    }
  }

  // 是否错误节点
  static identifyAttr(dom) {
    if (DomCheck.getAttr(dom, 'type') === 'number') {
      if (DomCheck.getAttr(dom, 'min') && DomCheck.getAttr(dom, 'max')) {
        return false;
      }
    }
    if (DomCheck.getAttr(dom, 'disabled')) {
      return false;
    }

    if (DomCheck.getAttr(dom, 'maxlength') || DomCheck.getAttr(dom, 'min') && DomCheck.getAttr(dom, 'max')) {
      return false;
    }

    return true;
  }

  // 标记错误节点
  markItem(dom, key) {
    const domString = dom.outerHTML.replace(/\s*/g, '').replace('style="background:pink;"', '').replace('background:pink;', '');
    if (!this.errorList.find(x => x === domString)) {
      const text = key === 'input' ? '无maxlength/max属性' : '无title属性';
      console.log('%c路由：', 'color:#E14A9F', `${window.location.pathname}\n`);
      console.log(`%c节点：`, 'color:#E14A9F', text, dom);
      this[`${key}ErrorCount`]++;
      this.errorList.push(domString);
    }
    dom.style.background = 'pink';
  }

  // 显示错误提示
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

/* 路由长度检测*/
class urlCheck {
  constructor() {
    this.oldUrl = '';
  }

  checkChange() {
    if (!this.oldUrl) {
      this.oldUrl = window.location.href;
      urlCheck.doCheck();
    } else {
      if (this.oldUrl !== window.location.href) {
        this.oldUrl = window.location.href;
        urlCheck.doCheck();
      }
    }
  }

  static doCheck() {
    urlCheck.checkLength();
  }

  //长度检测
  static checkLength() {
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
const mutationCallback = (mutationsList, observer) => {
  mutationTime = setTimeout(() => {
    check.checkDocument();
    checkUrl.checkChange();
  }, 1500);

};

const config = {childList: true, subtree: true};
const observer = new MutationObserver(mutationCallback);


function handleCheck() {
  setTimeout(() => {
    const targetNode = document.getElementById('app');
    observer.observe(targetNode, config);
    check.checkDocument();
    checkUrl.checkChange();

  }, 1000);
}

module.exports = {
  domCheck: handleCheck
};
