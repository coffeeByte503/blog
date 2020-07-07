function createElement(type, attrs) {
    const element = document.createElement(type);

    if (!attrs) return element;

    for (let [attr, value] of Object.entries(attrs)) {
        element.setAttribute(attr, value);
    }

    return element;
}

function $(selectors) {
    return document.querySelector(selectors);
}