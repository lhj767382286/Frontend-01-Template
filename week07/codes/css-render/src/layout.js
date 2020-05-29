
function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    // style 预处理
    for(let prop in element.computedStyle) {

        element.style[prop] = element.computedStyle[prop].value;

        // px => number 类型
        // 其他单位处理类似
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        // 数字 => number 类型
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}


function layout(element) {
    if (!element.computedStyle) {
        return;
    }

    var elementStyle = getStyle(element);

    // 这里只实现 flex 排版
    if (elementStyle.display !== 'flex') {
        return;
    }

    // 获取 flex-items
    var items = element.children.filter(e => e.type === 'element');

    // 根据 flex-items 的 order 排序。order 默认值为 0，越小越靠前
    items.sort(function(a, b) {
        return (a.order || 0) - (b.order || 0);
    });

    var style = elementStyle;

    // 宽高默认值统一处理
    ['width', 'height'].forEach(size => {
        if(style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    // 默认值处理
    // flex-container: flex-direction
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }

    // flex-container: align-items
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }

    // flex-container: justify-content
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }

    // flex-container: flex-wrap
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }

    // flex-container: align-content
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    // 使用以下 10 个变量抽象不同方向计算
    // 3 个存属性的变量：
    //      size - 尺寸，可选值：width、height
    //      start、end - 方向，可选值：left -> right、right -> left、top -> bottom、bottom -> top
    // sign - 排版方向，可选值：+1 (left -> right, 在 base 基础上加)、-1 (right -> left)
    // base - 排版起点（开始的位置），可选值：0 (left -> right)、元素宽度的值 (right -> left)
    var mainSize, mainStart, mainEnd, mainSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    // left -> right
    if (style.flexDirection === 'row') {
        mainSize ='width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1; // 可以理解为正负号，从左往右
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    // right -> left
    if (style.flexDirection === 'row-reverse') {
        mainSize ='width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width; // container.width

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    // top -> bottom
    if (style.flexDirection === 'column') {
        mainSize ='height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    // bottom -> top
    if (style.flexDirection === 'column-reverse') {
        mainSize ='height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    // flex-wrap 影响交叉轴
    if (style.flexWrap === 'wrap-reverse') {
        // crossStart 与 crossEnd 互换
        var temp = crossStart;
        crossStart = crossEnd;
        crossEnd = temp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = +1;
    }


    var isAutoMainSize = false;
    if (!style[mainSize]) { 
        // auto sizing
        // mainSize = 子元素 mainSize 相加
        elementStyle[mainSize] = 0;
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] += itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }


    // 元素进行
    var flexLine = [];  // 表示一行
    var flexLines = [flexLine]; // 表示多行

    var mainSpace = elementStyle[mainSize]; // 剩余空间
    var crossSpace = 0; // 交叉轴尺寸

    for(var i = 0; i < items.length; i++) {
        var item = items[i];
        // 获取子元素 style
        var itemStyle = getStyle(item);

        // 没有主轴尺寸，默认为 0
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        // 子元素有 flex 属性
        if (itemStyle.flex) {
            // flex 属性意味着可伸缩，代表着这一行无论有多少元素一定能放进去
            flexLine.push(item);

        // 父元素有 nowrap  - 所有元素往第一行里塞
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (iemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {

            // 本身 item 超过 1 行宽度，将 item 缩到行宽 (container 的 with)
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }

            // 如果 container 当前 flexLine 剩余的空间放不下 item
            if (mainSpace < itemStyle[mainSize]) {
                // 把当前 flexLine 的 mainSpace、crossSpace 存起来
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                
                // 新开一个 flexLine
                flexLine = [item];
                flexLines.push(flexLine);

                // 重置 mainSpace、crossSpace
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }

            // 一行高度，取决与最高的 item
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }

            // 扣除已经排进来的元素的 mainSpace
            mainSpace -= itemStyle[mainSize];
        }
    }

    // 设置 mainSpace
    flexLine.mainSpace = mainSpace;

    // 设置 crossSpace
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        // nowrap、auto-size => 父元素的高度
        flexLine.crossSpace = (style[crossSize] !== null) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    // 对负的 mainSpace， 所有该行 flex 子项等比例缩放（未设置 flex-shrink 默认值是1，也就是默认所有的 flex 子项都会收缩）
    if (mainSpace < 0) {
        // overflow (happens only if container is single line), scale every item
        var scale = style[mainSize] / (style[mainSize] - mainSpace);

        var currentMain = mainSpace;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            // flex 元素宽度先设置为 0 
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            // flex 容器这一行内，flex 子项排布
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * item[mainSize];
            currentMain = itemStyle[mainEnd];

        }
    } else {
        // 可以容纳所有子元素
        // process each flex line
        flexLines.forEach(function (items) {

            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemStyle = getStyle(item);

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            // 填充 flexLine 剩余 mainSpace 空间
            if  (flexTotal > 0) {
                // There is flexible flex items
                var currentMain = mainBase;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemStyle = getStyle(item);


                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainSize];
                }

            } else {
                // There is *NO* flexible flex items, which means, justifyContent should work
                var currentMain, step;
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }

                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }

                if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }

                if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                    currentMain = mainBase;
                }

                if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                if (style.justifyContent === 'space-evenly') {
                    step = mainSpace / (items.length + 1) * mainSign;
                    currentMain = step + mainBase;
                }

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }

            }

        });
    }

    // 交叉轴，crossSize 未设定时默认为 count flexLines 每行最大 crossSpace 之和 
    if (!style[crossSize]) { // auto sizing
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        // 设定后，计算出最终的 crossSpace，为 crossSpace 减去每行最大 crossSpace，剩余空间，用作分配
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    } 

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    var lineSize = style[crossSize] / flexLines.length; // 行高
    var step;
    
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }

    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }

    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }

    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }

    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach((items) => {
        var lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;
        
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            var align = itemStyle.alignSelf || style.alignItems;

            if (itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                itemStyle[crossSize] : lineCrossSize)
    
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }

        }

        crossBase += crossSign * (lineCrossSize + step);

    });

    console.log(items);

}

module.exports = layout;