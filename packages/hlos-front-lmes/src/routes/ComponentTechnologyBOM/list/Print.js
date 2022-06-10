/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/*
 * @打印方法，加载打印样式
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2019-10-14 11:04:37
 * @LastEditTime : 2020-02-06 18:03:21
 * @copyright: Copyright (c) 2018,Hand
 */

export default function Print(dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend(
    {
      noPrint: '.no-print',
      onStart() {},
      onEnd() {},
    },
    options
  );

  if (typeof dom === 'string') {
    this.dom = document.getElementById(dom);
  } else {
    this.dom = dom;
  }

  this.init();
}
Print.prototype = {
  init() {
    const content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  extend(obj, obj2) {
    // eslint-disable-next-line guard-for-in
    for (const k in obj2) {
      // eslint-disable-next-line no-param-reassign
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle() {
    let str = '';
    const styles = document.querySelectorAll('style,link');
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str += `<style>${
      this.options.noPrint ? this.options.noPrint : '.no-print'
    }{display:none;}</style>`;

    return str;
  },

  getHtml() {
    const inputs = document.querySelectorAll('input');
    const textareas = document.querySelectorAll('textarea');
    const selects = document.querySelectorAll('select');

    for (const k in inputs) {
      if (inputs[k].type === 'checkbox' || inputs[k].type === 'radio') {
        if (inputs[k].checked === true) {
          inputs[k].setAttribute('checked', 'checked');
        } else {
          inputs[k].removeAttribute('checked');
        }
      } else if (inputs[k].type === 'text') {
        inputs[k].setAttribute('value', inputs[k].value);
      }
    }

    for (const k2 in textareas) {
      if (textareas[k2].type === 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (const k3 in selects) {
      if (selects[k3].type === 'select-one') {
        const child = selects[k3].children;
        for (const i in child) {
          if (child[i].tagName === 'OPTION') {
            if (child[i].selected === true) {
              child[i].setAttribute('selected', 'selected');
            } else {
              child[i].removeAttribute('selected');
            }
          }
        }
      }
    }

    return this.dom.outerHTML;
  },

  writeIframe(content) {
    let w;

    let doc;

    const iframe = document.createElement('iframe');

    const f = document.body.appendChild(iframe);
    iframe.id = 'myIframe';
    iframe.style = 'position:absolute;width:0;height:0;top:-10px;left:-10px;';

    // eslint-disable-next-line prefer-const
    w = f.contentWindow || f.contentDocument;
    // eslint-disable-next-line prefer-const
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    // eslint-disable-next-line func-names
    this.toPrint(w, function () {
      document.body.removeChild(iframe);
    });
  },

  toPrint(w, cb) {
    const _this = this;
    // eslint-disable-next-line no-param-reassign
    // eslint-disable-next-line func-names
    w.onload = function () {
      try {
        // eslint-disable-next-line func-names
        setTimeout(function () {
          w.focus();
          // eslint-disable-next-line no-unused-expressions
          typeof _this.options.onStart === 'function' && _this.options.onStart();
          if (!w.document.execCommand('print', false, null)) {
            w.print();
          }
          typeof _this.options.onEnd === 'function' && _this.options.onEnd();
          w.close();
          cb && cb();
        });
      } catch (err) {
        window.console.log('err', err);
      }
    };
  },
};
