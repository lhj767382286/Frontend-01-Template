function match(selector, element) {
    const idReg = /(#\w+)+/g;
    const classReg = /(\.\w+)/g;
    const parenthesesReg = /\[(.+?)\]/g;
    const idArr = selector.match(idReg);
    const classArr = selector.match(classReg);
    const parenthesesArr = selector.match(parenthesesReg);
    const elementArr = selector
        .split(" ")
        .filter(
            (s) =>
                s.charAt(0) !== "#" &&
                s.charAt(0) !== "." &&
                s.charAt(0) !== "["
        );

    let isMatched = 0;
    if (idArr && idArr[0].charAt(0) === "#") {
        if (element.attributes["id"].value === idArr[0].substring(1)) {
            isMatched++;
        }
    }
    if (classArr && classArr[0].charAt(0) === ".") {
        let class_name = element.attributes["class"].value;
        if (class_name && class_name === classArr[0].substring(1)) {
            isMatched++;
        }
    }
    if (parenthesesArr) {
        const split_parentheses = parenthesesArr[0]
            .substring(1, parenthesesArr[0].length - 1)
            .split("=");
        if (
            element.attributes[split_parentheses[0]].value ===
            split_parentheses[1]
        ) {
            isMatched++;
        }
    }
    if (elementArr[0] === element.tagName.toLowerCase()) {
        isMatched++;
    }

    return !!isMatched;
}
