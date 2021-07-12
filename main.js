const { selection } = require("scenegraph")

let panel;

function traverseChildren(root, pattern, replacement, board, same){
    if (root.isContainer){
        if (board && root.constructor.name == "Artboard"){
            let after = root.name.replaceAll(pattern, replacement)
            if (after != root.name){
                root.name = after
            }
        }
        if (root.constructor.name != "SymbolInstance"){
            root.children.forEach((children,i)=>{
                traverseChildren(children, pattern, replacement);
            })
        }
    } else {
        // console.log(root)
		if (root.constructor.name == "Text"){
            // console.log("text!")
            if (same == false)
            {
                console.log('same=false')
                let after = root.text.replaceAll(pattern, replacement)
                // console.log(success)
                if ( after != root.text ) {
                    root.text = after
                    console.log('changed!')
                }
                
                console.log(after+' vs '+root.text)
            } else {
                console.log('same=true')
                if (root.text == pattern){
                    root.text = replacement
                }
            }
        }		// 对图层的操作
    }
}

function create() {
    const HTML =
        `<style>
            .box-row { align-items: center; }
            .break {
                flex-wrap: wrap;
            }
            label.row > span {
                color: #8E8E8E;
                width: 20px;
                text-align: right;
                font-size: 9px;
            }
            label.row input {
                flex: 1 1 auto;
            }
            .show {
                display: block;
            }
            .hide {
                display: none;
            }
        </style>
        <form method="dialog" id="main">
            <div class="row break">
                <label class="row">
                    <span>查找</span>
                    <input type="text" uxp-quiet="true" id="pattern" value="abc" placeholder="查找" />
                </label>
                <label class="row">
                    <span>替换</span>
                    <input type="text" uxp-quiet="true" id="replacement" value="xyz" placeholder="替换" />
                </label>
                
            </div>
            <label class="box-row">
                    <input type="checkbox" checked="true" id="board"/>
                    <span>包括画板名称</span>
            </label>
            <label class="box-row">
                    <input type="checkbox" id="same"/>
                    <span>完全匹配</span>
            </label>
            <footer><button id="ok" type="submit" uxp-variant="cta">Apply</button></footer>
        </form>
        <p id="warning">请选中需要查找替换的范围（画板、 组、 文字图层等等均可）。对组件无效。</p>
        `
    function increaseRectangleSize() {
        const { editDocument } = require("application");
        const pattern = document.querySelector("#pattern").value;
        const replacement = document.querySelector("#replacement").value;
        const board = document.querySelector("#board").ischecked;
        const same = document.querySelector("#same").ischecked;

        editDocument({ editLabel: "find and replace" }, function (selection) {
            let select = selection.items;
            select.forEach((obj)=>{traverseChildren(obj, pattern, replacement, board, same);});

        })
    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("form").addEventListener("submit", increaseRectangleSize);

    return panel;
}

function show(event) {
    if (!panel) event.node.appendChild(create());
}

function update() {
    let form = document.querySelector("form");
    let warning = document.querySelector("#warning");
    if (!selection || !(selection.items[0])) {
        form.className = "hide";
        warning.className = "show";
    } else {
        form.className = "show";
        warning.className = "hide";
    }
}


module.exports = {
    panels: {
        replaceText: {
            show,
            update
        }
    }
};
