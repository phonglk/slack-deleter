export const $ = document.querySelector.bind(document);

export const $$ = document.querySelectorAll.bind(document);

export const T = t => document.createTextNode(t);

export const E = (ele, classNames, childs = []) => {
	const e = document.createElement(ele);
	e.setAttribute('class', classNames);
  [].concat(childs).forEach(c => e.appendChild(c));
  return e;
}

export const DIV = E.bind(null, 'DIV');

export const replace = (target, child) => {
  const children = [].concat(child);
  while(target.children.length > 0) {
    target.removeChild(target.firstChild)
  }
  children.forEach(c => target.appendChild(c));
}