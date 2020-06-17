# 重学前端

## Range

* `range.setStartBefore`
* `range.setEndBefore`
* `range.setStartAfter`
* `range.setEndAfter`
* `range.selectNode`
* `range.selectNdoeContents`
* `range.extractContents`
* `range.insertNode`

```js
var range = new Range()
range.setStart(element, 9)
range.setEnd(element, 4)
var range = document.getSelection().getRangeAt(0)
```