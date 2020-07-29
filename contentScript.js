// Updated by editBoxWatch whenever editor focus is lost,
// so that editBoxInsert always knows where to insert and refocus to.
let wpTextboxCursor = [0,0]

// Insert text in the main edit box at the last known focus position
// and refocuses the editbox with the focus position
function editBoxInsert(str) {
    const editor = document.querySelector("#wpTextbox1")
    const [startPos, endPos] = wpTextboxCursor
    editor.value = editor.value.substring(0, startPos) + str + editor.value.substring(endPos, editor.value.length)

    const newStartPos = startPos + str.length
    editor.setSelectionRange(newStartPos, newStartPos)
    editor.focus()
}

// editBoxWatch watches the main edit window for the cursor position
function editBoxWatch() {
    const editor = document.querySelector("#wpTextbox1")
    editor.addEventListener("blur", () => {
        console.log("Old wpTextboxCursor", wpTextboxCursor)
        wpTextboxCursor = [editor.selectionStart, editor.selectionEnd]
        console.log("New wpTextboxCursor", wpTextboxCursor)
    })
}

{/* <aside>This appears on individual pages, such as <a href="/wiki/engineRequestModel">engineRequestModel</a></aside> */}
function createDetailsNewListItem(details) {
    const div = document.createElement("div")
    div.innerHTML = `
        <h3><code>New items</code> <button id="mwg-li-insert">Insert</button></h3>
        <aside>This appears on <a href="/wiki/Template:Client_collision_shape_functions?action=edit">listing pages</a>.</aside>
        <hr>
        <label for="mwg-li-items"><strong>Function or event names</strong>, delimited by non-alphabetic characters</label>
        <textarea id="mwg-li-items"></textarea>
    `

    const btnInsert = div.querySelector("#mwg-li-insert")
    btnInsert.addEventListener("click", () => {
        // Convert text area to list of function/event names
        const textareaItems = div.querySelector("#mwg-li-items")
        let items = [...(textareaItems.value.matchAll("([A-Za-z]+)"))].map(it => it[0])

        // Now we have wikified function names
        items = items.map(s => `*[[${s}]]`).join("\n")

        const str = "{{New items|3.0158|1.5.7|\n" + items + "\n|REVISION_NUMBER_FROM_BUILDINFO.MTASA.COM}}"
        editBoxInsert(str)
    })



    return div;
}

function createDetails(parent) {
    const detailsWrapper = document.createElement("div")
    detailsWrapper.style.display = "flex"
    // detailsWrapper.style.flex = "1 0"
    parent.prepend(detailsWrapper);

    const details = document.createElement("details")
    detailsWrapper.append(details);
    details.innerHTML = `<summary>wikigen</summary>`
    details.style.paddingRight = "1em"

    details.append(createDetailsNewListItem(details));

    const editform = document.querySelector("#editform")

    details.addEventListener("toggle", e => {
        if (details.open) {
            detailsWrapper.appendChild(editform)
        } else {
            parent.insertBefore(editform, detailsWrapper.nextSibling)
        }
    });

    // Open by default (later we can save the open/close state)
    details.open = true;

    return detailsWrapper;
}

function handleEditPage() {
    const contentWrapper = document.querySelector("#mw-content-text")
    const details = createDetails(contentWrapper)
    editBoxWatch()
}

function main() {
    console.log("wikigen loading...")
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("action") === "edit") {
        handleEditPage()
    }
    console.log("wikigen loaded!")
}

addEventListener("load", main)
