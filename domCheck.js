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
      let flag = this.identifyGoing(dom);
      if (flag) {
        for (let i = 0; i < dom.children.length; i++) {
          if (this.identifyInputDom(dom.children[i])) {
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
    if ((this.getCss(dom, 'textOverflow') !== 'ellipsis')) {
      return false;
    }
    if (dom.nodeName === 'TH' || dom.nodeName === 'TD') {
      return false;
    }
    if (!clazz) {
      return false;
    }
    if ((clazz && (clazz.includes('yl-tooltip') ||   // tooltip
      clazz.includes('cell') ||  // table-can
      clazz.includes('table-info_label') || clazz.includes('table-info_value') ||// table-info
      clazz.includes('table-info_label') ||
      clazz.includes('un_check')
    ))) {
      return false;
    }
    for (let i = 0; i < childs.length; i++) {
      let _class = this.getAttr(childs[i], 'class');
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
    if (this.getAttrKey(dom, 'title') || this.getAttrKey(parentNode, 'title') || this.getAttrKey(grandpaNode, 'title')) {
      
      return false;
    }
    let childTitle = false;
    for (let i = 0; i < childNodes.length; i++) {
      if (this.getAttrKey(childNodes[i], 'title')) {
        return false;
      }
    }
    return true;
  }
  
  // 返回节点样式
  getCss(dom, key) {
    return getComputedStyle(dom, null)[key];
  }
  
  // 取元素属性
  getAttr(dom, target) {
    try {
      return dom ? dom.getAttribute(target) : '';
    } catch (e) {
    }
    return '';
  }
  
  // 判断节点属性是否存在
  getAttrKey(dom, target) {
    return !!(dom && dom.attributes && dom.attributes[target]);
  }
  
  // 是否向下查询
  identifyGoing(dom) {
    const filterArr = ['yl-select', 'ignore_check', 'un_check'];
    
    let clazz = this.getAttr(dom, 'class');
    clazz = clazz ? clazz.split(' ') : '';
    if (this.includesItem(clazz, filterArr)) { // 忽略dom及其子dom
      return false;
    }
    return true;
  }
  
  // input 节点过滤
  identifyInputDom(dom) {
    const parentNode = dom.parentNode; // 父节点
    const grandpaNode = dom.parentNode.parentNode; // 爷节点
    const grandgrandpaNode = dom.parentNode.parentNode.parentNode; // 祖节点
    const domArr = [parentNode, grandpaNode, grandgrandpaNode];
    const filterArr = ['yl-select', 'yl-select-dropdown', 'yl-date-editor', 'un_check'];
    let getClass = false;
    if (dom.localName === 'input' && this.identifyClass(dom, 'yl-input__inner')) {
      domArr.map(item => {
        let clazz = this.getAttr(item, 'class');
        clazz = clazz ? clazz.split(' ') : '';
        if (this.includesItem(clazz, filterArr)) {
          getClass = true;
        }
      })
      return !getClass;
    }
  }
  
  // 查询 前一个数组，是否包含后一个数组中的其中一个值
  includesItem(arr, filterArr) {
    if (!arr) {
      return false;
    }
    return !!arr && (arr.concat(filterArr)).sort().find((x, index, arr) => x === arr[index + 1])
  }
  
  
  identifyClass(dom, clazz) {
    return this.getAttr(dom, 'class') && this.getAttr(dom, 'class').includes(clazz)
  }
  
  // 是否错误节点
  identifyAttr(dom) {
    if (this.getAttr(dom, 'type') === 'number') {
      if (this.getAttr(dom, 'min') && this.getAttr(dom, 'max')) {
        return false;
      }
    }
    if (this.getAttr(dom, 'disabled')) { // disabled
      return false;
    }
    
    if (this.getAttr(dom, 'maxlength') || this.getAttr(dom, 'min') && this.getAttr(dom, 'max')) {
      return false;
    }
    
    return true;
  }
  
  // 标记错误节点
  markItem(dom, key) {
    const text = key === 'input' ? '无maxlength/max属性' : '无title属性';
    const domString = dom.outerHTML.replace(/\s*/g, '').replace('style="background:pink;"', '').replace(`title="${text}"`, '').replace('background:pink;', '');
    if (!this.errorList.find(x => x === domString)) {
      console.log('%c路由：', 'color:#E14A9F', `${window.location.pathname}\n`);
      console.log(`%c节点：`, 'color:#E14A9F', text, dom);
      this[`${key}ErrorCount`]++;
      this.errorList.push(domString);
    }
    dom.style.background = 'pink';
    dom.title = text;
    dom.mark = text;
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
const mutationCallback = (mutationsList, observer) => {
  mutationTime = setTimeout(() => {
    check.checkDocument();
    checkUrl.checkChange();
  }, 2000);
  
};

const config = {childList: true, subtree: true};
const observer = new MutationObserver(mutationCallback);


function handleCheck() {
  setTimeout(() => {
    observer.observe(document, config);
    check.checkDocument();
    checkUrl.checkChange();
    
  }, 2000);
}

module.exports = {
  domCheck: handleCheck
};
