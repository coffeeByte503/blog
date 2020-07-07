class Option {
    constructor(name, value, label) {
        this.name = name;
        this.value = value;
        this.label = label;

        this.container = createElement("div", {
            class: "option"
        });

        this.inputRadius = createElement("input", {
            class: "radio",
            type: "radio",
            name,
            value,
        });

        this.labelNode = createElement("label");
        this.labelNode.innerHTML = label;

        this.container.appendChild(this.inputRadius);
        this.container.appendChild(this.labelNode);
    }
}
class Component {
    constructor() {
        this._events = new EventEmitter();
    }

    on(eventName, listener) {
        this._events.on(eventName, listener);
    }

    emit(eventName, ...args) {
        this._events.emit(eventName, ...args);
    }
}
class Select extends Component {
    constructor(params) {
        super();

        this.options = params.options;
        this.value = params.default || null;
        this.default = params.default;

        this.selectBox = createElement("div", {
            class: "select-box"
        });
        this.optionsSelect = createElement("div", {
            class: "options-select"
        });

        this.selected = createElement("div", {
            class: "selected",
            "data-value": "none"
        });
        this.selected.innerHTML = "select language"

        this.selected.addEventListener("click", () => {
            this.optionsSelect.classList.toggle("active");
        });

        for (let option of params.options) {
            option.container.addEventListener("click", () => {
                this.setValue(option.value)
            });
            this.optionsSelect.appendChild(option.container);
        }

        this.selectBox.appendChild(this.optionsSelect);

        this.selectBox.appendChild(this.selected)


    }

    render(parent) {
        parent.appendChild(this.selectBox);
        if (this.default) this.setValue(this.default);
    }

    setValue(value) {
        this.options.forEach(option => {
            if (option.value === value) {
                this.selected.innerHTML = option.labelNode.outerHTML;
                this.optionsSelect.classList.remove("active");
                this.selected.dataset.value = option.value;
                this.emit("change", option.value);
            }
        })
    }
}