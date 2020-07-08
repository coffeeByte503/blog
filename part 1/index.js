const current = {
    LANGUAGE: Symbol("language"),
    TUTORIAL: Symbol("tutorial")
}
const TUTORIALS_SERVER = "./";

let courseName = "canvas course";

let course = null;

let defaultLanguage = navigator.language.split("-")[0].toLowerCase() == "es" ? "es" : "en";

async function main() {

    course = new Course("lesson-1x2", $("#tutorial"), defaultLanguage);

    //languages
    const languageSelector = createLanguageSelector(defaultLanguage);

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

    $("#sideMenu-overlay").onclick = () => {
        $("#sideMenu").classList.remove("active")
        $("#sideMenu-overlay").classList.remove("active")
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

        $("#loader").style.display = "flex";
        $("#loader").classList.add("active");


        this.parent.innerHTML = await getHTMLDocument(url, this._events);
        formatCode();

        $("#loader").classList.remove("active");
        setInterval(() => {
            $("#loader").style.display = "none";
        }, 500)
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