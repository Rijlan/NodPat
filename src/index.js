const appRef = document.querySelector('#app');
const newRef = document.querySelector("#new");
const openRef = document.querySelector("#open");
const saveRef = document.querySelector("#save");
const saveAsRef = document.querySelector("#saveas");
const textArea = document.querySelector('#field');

const fileRef = document.querySelector("#file");
const dropdownRef = document.querySelector(".dropdown");

const editRef = document.querySelector("#edit");
const dropdownEdit = document.querySelector(".dropdown-edit");

const undoBtn = document.querySelector("#undo");
const pasteBtn = document.querySelector("#paste");
const selectallBtn = document.querySelector("#selectall");

const fileName = document.querySelector(".header-title");

let fileHandle;
let contentFile = '';
let isAvailable = false;
let firstWord = '';

let mementos = [];

const saveMemento = (val) => {
    mementos.push(val);
}

newRef.addEventListener("click", async () => {
    fileHandle = '';
    contentFile = '';
    textArea.value = '';
    isAvailable = false;

    fileName.innerText = 'Untitled';
});


textArea.addEventListener("keyup", async (e) => {
    if (!firstWord) {
        firstWord = e.target.value;
    }
    let name = fileName.innerText.split("");
    if (isAvailable && contentFile !== e.target.value) {
        if (name[0] !== '*') {
            name.unshift("*");
            fileName.innerText = name.join("");
        }
    } else if (isAvailable && contentFile === e.target.value && name[0] === "*") {
        name.shift();
        fileName.innerText = name.join("");
    } else if (!isAvailable && e.target.value !== "") {
        if (name[0] !== '*') {
            name.unshift("*");
            fileName.innerText = name.join("");
        }
    } else {
        if (name[0] === "*") {
            name.shift();
            fileName.innerText = name.join("");
        }
    }
});

openRef.addEventListener("click", async () => {
    try {
        const opt = {
            types: [
                {
                    description: "text",
                    accept: {
                        "text/plain": [".txt", ".html", ".js", ".css"]
                    }
                }
            ],
            excludeAcceptAllOption: true,
            multiple: false
        };
    
        [fileHandle] = await window.showOpenFilePicker(opt);
    
        const file = await fileHandle.getFile();
        const contents = await file.text();
    
        fileName.innerText = file.name;
    
        isAvailable = true;
        contentFile = contents;

        saveMemento(contents);

        firstWord = contents;
        
        textArea.value = contents;
    } catch (error) {
        console.log(error.message);
    }
});

saveRef.addEventListener("click", async () => {
    try {
        const opt = {
            types: [
                {
                    description: "text",
                    accept: {
                        "text/plain": [".txt", ".html", ".js", ".css"]
                    }
                }
            ],
        };
    
        let writableStream;
    
        if (isAvailable) {
            writableStream = await fileHandle.createWritable();
    
            let name = fileName.innerText.split("");
           if (name[0] === "*") {
                name.shift();
                fileName.innerText = name.join("");
           }
        } else {
            const file = await window.showSaveFilePicker(opt);
    
            fileHandle = file;
    
            fileName.innerText = file.name;
    
            isAvailable = true;
    
            writableStream = await file.createWritable();
        }
    
        contentFile = textArea.value;

        saveMemento(contents);
    
        await writableStream.write(textArea.value);
    
        writableStream.close();

    } catch (error) {
        console.log(error.message);
    }
    
});

saveAsRef.addEventListener("click", async () => {
    try {
        const opt = {
            types: [
                {
                    description: "text",
                    accept: {
                        "text/plain": [".txt", ".html", ".js", ".css"]
                    }
                }
            ],
        };
    
        const file = await window.showSaveFilePicker(opt);
    
        fileHandle = file;
    
        fileName.innerText = file.name;
    
        isAvailable = true;
    
        let writableStream = await file.createWritable();
        
        contentFile = textArea.value;

        saveMemento(contents);
    
        await writableStream.write(textArea.value);
    
        writableStream.close();
    
    } catch (error) {
        console.log(error.message);
    }
});

const dropDown = (btnRef, dropRef) => {
    btnRef.classList.toggle('active');
    dropRef.classList.toggle('show');
}

fileRef.addEventListener("click", () => dropDown(fileRef, dropdownRef));
editRef.addEventListener("click", () => dropDown(editRef, dropdownEdit));

window.onclick = (e) => {
    if (!e.target.matches('#file') && fileRef.classList.contains('active') && dropdownRef.classList.contains('show')) {
        dropDown(fileRef, dropdownRef);
    } else if (!e.target.matches('#edit') && editRef.classList.contains('active') && dropdownEdit.classList.contains('show')) {
        dropDown(editRef, dropdownEdit);
    }
}

const undo = () => {
    const lastMemento = mementos.pop();

    textArea.value = lastMemento;

    textArea.focus();
}

textArea.addEventListener("keydown", (e) => {
    if (e.keyCode === 32 || e.keyCode === 13) {
        saveMemento(e.target.value);
    }
});

undoBtn.addEventListener("click", () => {
    if (mementos.length === 0) {
        textArea.value = textArea.value === "" ? firstWord : "";
    } else {
        undo();
    }

    let name = fileName.innerText.split("");

    if (contentFile === textArea.value && name[0] === "*") {
        name.shift();
        fileName.innerText = name.join("");
    }
});

pasteBtn.addEventListener("click", async () => {
    try {
        if (textArea.value) {
            saveMemento(textArea.value);
        }

        const text = await navigator.clipboard.readText();

        if (!textArea.value) {
            firstWord = text;
        }

        textArea.value += text;

        let name = fileName.innerText.split("");

        if (name[0] !== '*') {
            name.unshift("*");
            fileName.innerText = name.join("");
        }
        
    } catch (error) {
        console.log(error.message);  
    }
});

selectallBtn.addEventListener("click", () => textArea.select())