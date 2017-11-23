export function addClass (el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
};

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
};

export function getData (el, attr, val) {
  let prefix = 'data-';
  let name = prefix + attr;
  if (val) {
    el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
};

let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let transformStyle = {
    webkit: 'webkitTransform',
    O: 'OTransform',
    Moz: 'MozTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  for (let key in transformStyle) {
    if (elementStyle[transformStyle[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle (style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
