/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable guard-for-in */
/* eslint-disable eqeqeq */
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
    this.dom = document.querySelector(dom);
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
    for (const k in obj2) {
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
      if (inputs[k].type == 'checkbox' || inputs[k].type == 'radio') {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', 'checked');
        } else {
          inputs[k].removeAttribute('checked');
        }
      } else if (inputs[k].type == 'text') {
        inputs[k].setAttribute('value', inputs[k].value);
      }
    }

    for (const k2 in textareas) {
      if (textareas[k2].type == 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (const k3 in selects) {
      if (selects[k3].type == 'select-one') {
        const child = selects[k3].children;
        for (const i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) {
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
    const iframe = document.createElement('iframe');

    const f = document.body.appendChild(iframe);
    iframe.id = 'myIframe';
    iframe.style = 'position:absolute;width:0;height:0;top:-10px;left:-10px;';

    const w = f.contentWindow || f.contentDocument;
    const doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    this.toPrint(w, () => {
      document.body.removeChild(iframe);
    });
    doc.close();
  },

  toPrint(w, cb) {
    const _this = this;
    w.onload = () => {
      try {
        setTimeout(() => {
          w.focus();
          typeof _this.options.onStart === 'function' && _this.options.onStart();
          if (!w.document.execCommand('print', false, null)) {
            w.print();
          }
          typeof _this.options.onEnd === 'function' && _this.options.onEnd();
          w.close();
          cb && cb();
        });
      } catch (err) {
        console.log('err', err);
      }
    };
  },
};
window.Print = Print;
