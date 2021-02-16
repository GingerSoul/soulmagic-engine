// @flow

export function getAttributeMap(element: Element): {[string]: mixed}
{
  let attrMap = {}
  for (let {name, value} of element.attributes) {
    if (!isNaN(value)) {
      value = parseFloat(value)
    } else if (value === 'false' || value === 'true') {
      value = value === 'true';
    }

    attrMap[name] = value;
  }

  return attrMap;
}
