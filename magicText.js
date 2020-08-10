/*文本长度增长插件*/

var TextMagic = function (open) {
  this.open = open;
  this.event = '';
  // 开启监听
  this.startWatch = () => {
    document.oncontextmenu = function (e) {
      if (open) {
        e.preventDefault();
      }
    };

    document.onmousedown = (e) => {
      if (!this.open) {
        return;
      }
      var e = e || window.event;
      if (e.button == "2") {
        console.log('e:', e);

        this.event = e;
        this.handleText(e.target);
      }
    };
  },
    this.handleText = (target) => {
      if (target) {
        if (target.children && target.children.length) {
          // 父节点文本
          if (target.childNodes && target.childNodes.length) {
            for (var i = 0; i < target.childNodes.length; i++) {
              var item = target.childNodes[i];
              if (item.nodeName === '#text') {
                var newText = this.event.altKey ? this.getLongText(item.nodeValue) : (item.nodeValue + item.nodeValue);
                item.nodeValue = newText;
              }
            }
          }
          // 子节点
          for (var i = 0; i < target.children.length; i++) {
            this.handleText(target.children[i]);
          }

        } else {
          // 子节点文本
          var innerText = target.innerText;
          var innerHTML = target.innerHTML;
          if (innerText) {
            var newText = this.event.altKey ? this.getLongText(innerText) : (innerText + innerText);
            target.innerHTML = newText;
          }
        }
      }
    };
    this.getLongText = (text) => {
    var newText = text;
    if (text) {
      do {
        newText = newText + newText;
      } while (newText.length < 200);
    }
    return newText;
  }
};


function magicText(open = false) {
  var handlText = new TextMagic(open);
  handlText.startWatch(open);
}

module.exports = {
  magicText: magicText
};
