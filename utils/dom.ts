/**
 * 计算文本是否溢出
 *
 * 当使用 `normal=false` 参数时， 使用高精度的计算方式，但是性能会有所下降
 *
 * @param el 待判断的元素
 * @param normal 使用的计算方法
 */
export function isTextOverflow(el: HTMLElement | SVGElement, normal = true) {
  if (normal)
    return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight

  const range = document.createRange()
  range.setStart(el, 0)
  range.setEnd(el, el.childNodes.length)
  // 所有子节点的宽度总和
  const rangeWidth = range.getBoundingClientRect().width
  const getStyle = (el: HTMLElement | SVGElement, key: string) => {
    if (!el || !key)
      return ''
    return getComputedStyle(el)?.[key as any]
  }
  // 还需要加上容器元素的左右padding
  const padding = (Number.parseInt(getStyle(el, 'paddingLeft'), 10) || 0) + (Number.parseInt(getStyle(el, 'paddingRight'), 10) || 0)
  // 内容实际宽度
  const scrollWidth = rangeWidth + padding
  // 内容当前宽度
  const clientWidth = el.getBoundingClientRect().width
  return clientWidth < scrollWidth
}

/**
 * 从 html 文本片段中提取第一个图片，通常用于作为封面图
 * @param html html 文本片段
 */
export function getFirstImage(html?: string) {
  if (!html)
    return
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const firstImg = doc.querySelector('img')
  if (!firstImg)
    return

  const res = firstImg.src
  return res
}
// export function getFirstImage(html: string) {
//   // 首先尝试匹配src属性
//   const srcRegex = /<img[^>]+src="([^">]+)"/;
//   let match = html.match(srcRegex);
//   if (match && match[1]) {
//     return match[1];
//   }

//   // 如果没有找到src，尝试匹配srcset属性
//   const srcsetRegex = /<img[^>]+srcset="([^">]+)"/;
//   match = html.match(srcsetRegex);
//   if (match && match[1]) {
//     // srcset可能包含多个URL，通常配有尺寸描述符，这里简化处理，只取第一个URL
//     const srcsetEntries = match[1].split(",");
//     const firstSrcsetEntry = srcsetEntries[0].trim().split(" ")[0];
//     if (firstSrcsetEntry) {
//       return firstSrcsetEntry;
//     }
//   }

//   // 作为最后的手段，使用DOM解析器
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, 'text/html');
//   const firstImg = doc.querySelector('img');
//   if (firstImg) {
//     // 优先返回src属性，如果不存在，则尝试返回srcset中的第一个URL
//     const src = firstImg.getAttribute('src');
//     if (src) {
//       return src;
//     }
//     const srcset = firstImg.getAttribute('srcset');
//     if (srcset) {
//       const srcsetEntries = srcset.split(",");
//       const firstSrcsetEntry = srcsetEntries[0].trim().split(" ")[0];
//       return firstSrcsetEntry;
//     }
//   }
// }
