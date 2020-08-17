/*文件名规则检测*/

const fs = require('fs');
const path = require('path');

// 文件夹名称带 . 不检测  只检测 .js, .vue
let ingoreDir = ['node_modules', 'dist'];

let dirname = __dirname.split('\\node_modules')[0];

const camelCase = /^[a-zA-Z\d]+$/;
const lowerCamelCase = /^[a-z]+[a-zA-Z\d]+$/;
const upperCamelCase = /^[A-Z]+[a-zA-Z\d]+$/;

const link = (dir, name) => path.resolve(dir, name);

const exists = (path) => fs.existsSync(path);

const isDir = (path) => exists(path) && fs.statSync(path).isDirectory();


class CheckFolder {
  constructor() {
    this.errDir = [];
    this.errFile = [];
    this.Check = this.Check.bind(this);
    this.matchIgnore = this.matchIgnore.bind(this);
  }

  Check(dir, top) {
    let files = fs.readdirSync(dir);
    for (const name of files) {
      const leafDir = link(dir, name);
      if (isDir(leafDir)) {
        if (!this.matchIgnore(leafDir) && !name.includes('.')) {
          if (!lowerCamelCase.test(name)) {
            this.errDir.push(leafDir);
          }
          this.Check(leafDir);
        }
      } else {
        // 根目录文件不检测
        if (!top) {
          if ((name.indexOf('.js') > -1) && (name.indexOf('.json') < 0) && !this.matchIgnore(leafDir)) {
            if (!(lowerCamelCase.test(name.split('.')[0]))) {
              this.errFile.push(leafDir);
            }
          } else if (name !== 'index.vue' && (name.indexOf('.vue') > -1) && !this.matchIgnore(leafDir)) {
            //过滤 40x.vue  50x.vue
            if (name[0] !== '4' && name[0] !== '5') {
              if (!upperCamelCase.test(name.split('.')[0])) {
                this.errFile.push(leafDir);
              }
            }
          }
        }
      }
    }
  }

  show() {
    CheckFolder.getIgnore();
    this.Check(dirname, true);
    const dir = format(this.errDir);
    const file = format(this.errFile);
    /*if (ingoreDir && ingoreDir.length) {
      console.log('被忽略的文件夹：', ingoreDir);
    }*/
    if (dir.length) {
      console.log('文件夹名称格式错误：', dir);
    }
    if (dir.length) {
      console.log('文件名称格式错误：', file);
    }
  }

  static getIgnore() {
    try {
      const _link = path.resolve(dirname, '.namecheckignore');
      const _file = fs.readFileSync(_link, 'utf-8');
      ingoreDir = [...ingoreDir, ..._file.split('\r\n').filter(x => !!x)];
    } catch (e) {
      console.log(e);
    }
  }

  matchIgnore(url) {
    let isIgn = false;
    if (url) {
      ingoreDir.map(item => {
        if (url.includes(item)) {
          isIgn = true;
        }
      });
    }
    return isIgn;
  }
}

const format = arr => arr && arr.length ? arr.map(item => {
  return item.replace(dirname, '').replace(/\\/g, '*').replace(/\*/g, '/');
}) : [];

function check() {
  const check = new CheckFolder();
  check.show();
}

check();

module.exports = {
  CheckFolder: CheckFolder
};
