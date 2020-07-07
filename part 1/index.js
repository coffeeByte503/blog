const current = {
    LANGUAGE: Symbol("language"),
    TUTORIAL: Symbol("tutorial")
}
const TUTORIALS_SERVER = "./";

let courseName = "tutorials";

let course = null;

async function main() {

    course = new Course("tutorial-1x1", $("#tutorial"), "en");

    //languages
    const languageSelector = createLanguageSelector(
        /* navigator.languages[1] || */
        "en",
    );

    languageSelector.on("change", (newLang) => {
        course.changeLanguage(newLang)
        course.render();
    });

    languageSelector.render(
        $("#selectLanguage")
    );

    $("#open-sideMenu").addEventListener("click", () => {
        $("#sideMenu").classList.add("active");
        $("#sideMenu-overlay").classList.add("active");
    })

    let lastX = 0;
    let firstX = 0;
    let width = 0;
    window.ontouchstart = (e) => {
        lastX = e.touches[0].clientX;
        firstX = lastX;
    }
    window.ontouchmove = (e) => {
        const currentX = e.touches[0].clientX;

        const valueX = currentX - lastX;
        width += valueX;
        $("#sideMenu").style.left = width + "px";

        let bgOpacity = 1 - ((100 / $("#sideMenu").offsetWidth) * Math.abs($("#sideMenu").offsetLeft) / 100);
        if (bgOpacity > 0.5) bgOpacity = 0.5;
        $("#sideMenu-overlay").style.background = `rgba(0,0,0,${bgOpacity})`;

        if ($("#sideMenu").offsetLeft + $("#sideMenu").offsetWidth < 0) {
            $("#sideMenu").style.left = -$("#sideMenu").offsetWidth + "px";
            width = -$("#sideMenu").offsetWidth;

        } else if ($("#sideMenu").offsetLeft > 0) {
            $("#sideMenu").style.left = 0;
            width = 0;
        }

        lastX = currentX
    }
    window.ontouchend = () => {
        if (firstX > lastX + 50) {
            $("#sideMenu").classList.remove("active")
            $("#sideMenu-overlay").classList.remove("active")
            width = 0;
            $("#sideMenu").style.left = $("#sideMenu").offsetWidth + "px";
            $("#sideMenu-overlay").style.background = `rgba(0,0,0,${0.7})`;
        }
    }
    $("#sideMenu-overlay").onclick = () => {
        $("#sideMenu").classList.remove("active")
        $("#sideMenu-overlay").classList.remove("active")
        width = 0;
        $("#sideMenu").style.left = $("#sideMenu").offsetWidth + "px";
        $("#sideMenu-overlay").style.background = `rgba(0,0,0,${0.7})`;
    }

    const navs = [...document.querySelectorAll(".tutorial-list")];

    navs.forEach(nav => {
        const tutorials = [...nav.querySelectorAll("li")];
        tutorials.forEach(tutorial => {
            tutorial.addEventListener("click", e => {
                course.changeTutorial(tutorial.dataset.id);
                course.render();
                window.scroll(0, 0)
            })
        })
    })



}
window.addEventListener("load", main);

function formatCode() {
    const codeTags = [...document.querySelectorAll(".code")]
    codeTags.forEach(tag => {
        code = tag.textContent.trim();
        if (code.match(/([<].*?[>])/g)) return;
        code = code.replace(/(['""].*?['""])/g, "<span class='string'>$1</span>");
        code = code.replace(/([.].*?[(])/g, "<span class='method'>$1</span>");

        code = code.replace(/([(])/g, "<span class='white'>(</span>");
        code = code.replace(/[.]/g, "<span class='white'>.</span>");
        code = code.replace(/[)]/g, "<span class='white'>)</span>");
        code = code.replace(/[;]/g, "<span class='white'>;</span>");

        code = code.replace(/(const | let|var|function)/gi, "<span class=\"word-reserved\">$1</span>")





        tag.innerHTML = code;
    })
}

function createLanguageSelector(defaultLanguage) {
    const lang = new Select({
        options: [
            new Option("lang", "en", `<img class="flag" src="img/en.png">English`),
            new Option("lang", "es", `<img class="flag" src="img/es.png">Español`)
        ],
        default: defaultLanguage
    });

    return lang;
}

class Course {
    constructor(currentTutorialId, parent, lang) {
        this.tutorials = {};
        this.currentTutorialId = currentTutorialId;

        this._events = new EventEmitter();

        this.parent = parent;

        this.lang = lang

        this.tutorialName = currentTutorialId;
    }

    exist(tutorialId) {
        return !!this.tutorials[tutorialId];
    }

    changeLanguage(newLang) {
        this.lang = newLang;
    }

    changeTutorial(tutorialName) {
        this.tutorialName = tutorialName;
    }

    async render() {
        const url = courseName + "/" + this.lang + "/" + this.tutorialName + ".html";
        //console.log(url)
        this.parent.innerHTML = await getHTMLDocument(url, this._events);
        formatCode();
    }

    static load() {}
}

function getHTMLDocument(id, events) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = e => {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                resolve(xhr.responseText);
            } else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 400) {

            }
        }
        xhr.onprogress = e => events.emit("progress", e);
        let url = TUTORIALS_SERVER + id;
        xhr.open('GET', url, true);
        xhr.send(null);
    })
}