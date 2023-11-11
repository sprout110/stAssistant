CKEDITOR.dialog.add('chtform', function (editor) {

    var config = editor.config,
        lang = editor.lang.chtform,
        columns = 4;

    var dialog;

    var formClick = CKEDITOR.tools.addFunction(function (evt, element) {
        var formId = element.getAttribute("formId");
        editor.fire('chtform', JSON.stringify(form[formId].Json));
        dialog.hide();
        evt.preventDefault();
    });

    var keyDown = CKEDITOR.tools.addFunction(function (evt, element) {
        evt = new CKEDITOR.dom.event(evt);
        element = new CKEDITOR.dom.element(element);

        var relative, nodeToMove;
        var keystroke = evt.getKeystroke(),
            rtl = editor.lang.dir === 'rtl';

        switch (keystroke) {
            // UP
            case 38:
                if ((relative = element.getParent().getParent().getPrevious())) {
                    nodeToMove = relative.getChild([element.getParent().getIndex(), 0]);
                    nodeToMove.focus();
                }
                evt.preventDefault();
                break;

            // DOWN
            case 40:
                // relative is TR
                if ((relative = element.getParent().getParent().getNext())) {
                    nodeToMove = relative.getChild([element.getParent().getIndex(), 0]);
                    if (nodeToMove)
                        nodeToMove.focus();
                }
                evt.preventDefault();
                break;

            // ENTER
            case 13:
            // SPACE
            case 32:
                // console.log('enter');
                onClick({ data: evt });
                evt.preventDefault();
                break;

            // RIGHT
            case rtl ? 37 : 39:
                if ((relative = element.getParent().getNext())) {
                    nodeToMove = relative.getChild(0);
                    nodeToMove.focus();
                    evt.preventDefault(true);
                }
                else if ((relative = element.getParent().getParent().getNext())) {
                    nodeToMove = relative.getChild([0, 0]);
                    if (nodeToMove)
                        nodeToMove.focus();
                    evt.preventDefault(true);
                }
                break;

            // LEFT
            case rtl ? 39 : 37:
                if ((relative = element.getParent().getPrevious())) {
                    nodeToMove = relative.getChild(0);
                    nodeToMove.focus();
                    evt.preventDefault(true);
                }
                else if ((relative = element.getParent().getParent().getPrevious())) {
                    nodeToMove = relative.getLast().getChild(0);
                    nodeToMove.focus();
                    evt.preventDefault(true);
                }
                break;

            default:
                // console.log(keystroke);
                evt.preventDefault(true);
                return;
        }
    });

    var form = {};

    var mouseEnter = CKEDITOR.tools.addFunction(function (evt, element) {
        var formModalHeader = document.getElementById('formModalHeader');
        var formModalBody = document.getElementById('formModalBody');
        var formId = element.getAttribute("formId");

        formModalHeader.innerHTML = "標題：" + form[formId].FormName;
        formModalBody.innerHTML = form[formId].Html;

        var el = document.getElementById('formModal');
        el.style.display = "block";
        var el2 = document.getElementById('formDrop');
        el2.style.display = "block";

        evt.preventDefault();
    });

    var formTitle = [
        '<div id="formTitle">',
        '<div style="text-align:center;">表單送出測試</div>',
        '</div>'
    ];

    var formBody = [
        '<div>',
        '<table class="thumb_table" ', CKEDITOR.env.ie && CKEDITOR.env.quirks ? ' style="position:absolute;"' : '', '>',
        '<tbody id="forms', editor.config.serialId, '">',
        '</tbody>',
        '</table>',
        '</div>'
    ];

    var resultProcess = function (result) {
        var x = []; 
        var b = []; 

        if (result.length === 0) {
            $("#forms" + editor.config.serialId).html('<tr><td>sorry, 目前無表單可使用!</td></tr>');
            return;
        }

        var adaptiveCard = new AdaptiveCards.AdaptiveCard();

        adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
            "fontFamily": "新細明體",
            "spacing": {
                "none": 0,
                "small": 3,
                "default": 8,
                "medium": 20,
                "large": 30,
                "extraLarge": 40,
                "padding": 10
            },
            "wrap": true,
            "imageSizes": {
                "small": 40,
                "medium": 68,
                "large": 130
            },
            "imageSet": {
                "imageSize": "Medium",
                "maxImageHeight": 200
            },
            "containerStyles": {
                "default": {
                    "foregroundColors": {
                        "default": {
                            "default": "#000000",
                            "subtle": "#99FFFFFF"
                        },
                        "dark": {
                            "default": "#FF999999",
                            "subtle": "#99999999"
                        },
                        "light": {
                            "default": "#FFFFFFFF",
                            "subtle": "#99FFFFFF"
                        },
                        "accent": {
                            "default": "#FF2E89FC",
                            "subtle": "#CC2E89FC"
                        },
                        "good": {
                            "default": "#CC00FF00",
                            "subtle": "#9900FF00"
                        },
                        "warning": {
                            "default": "#CCFF9800",
                            "subtle": "#99FF9800"
                        },
                        "attention": {
                            "default": "#CCFF0000",
                            "subtle": "#99FF0000"
                        }
                    },
                    "backgroundColor": "#00000000"
                }
            }
        });

        $.each(result, function (j, c) {
            var card = JSON.parse(c.Json);
            adaptiveCard.parse(card);
            var renderedCard = adaptiveCard.render();
            var div = document.createElement('div');
            div.appendChild(renderedCard);

            form[c.FormId] = {
                FormId: c.FormId,
                FormName: c.FormName,
                Json: c.Json,
                Html: div.innerHTML
            };

            //console.log(j);
            //console.log(c);

            if (j % columns === 0) {
                b.push('<tr class="IconClass">');
            }

            b.push('<td class="thumb_td cke_dark_background cke_centered">', '<a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);">');
            b.push('<div class="text_thumb" formId="' + c.FormId + '" onmouseenter="CKEDITOR.tools.callFunction(', mouseEnter, ', event, this);return false;" onclick="CKEDITOR.tools.callFunction(', formClick, ', event, this);return false;">' + c.FormName + '</div></a></td>');
            b.push('</a></td>');
            
            if (j % columns === columns - 1) {
                b.push('</tr>');
            }
        });

        var last = columns - (result.length % columns);
        if (last > 0) {
            for (j = 0; j < last; j++)
                b.push('<td class="thumb_td cke_dark_background cke_centered"><span></span></td>');
            b.push('</tr>');
        }

        $("#forms" + editor.config.serialId).html(b.join(''));

        //setTimeout(function () {
        //    var firstSmile = $("#forms" + editor.config.serialId + " a").first();
        //    firstSmile.focus();
        //}, 0);
    }

    var formBottom = [
        '<div>',
        '</div>'
    ];

    var formModal = [
        '<div id="formModal" class="formModal">',
        '<div class="formModalDialog">',
        '<div class="formModalContent">',
        '<div class="formModalHeader">',
            '<span id="formModalHeader">標題：</span>',
        '</div>',
        '<div id="formModalBody" class="formModalBody">',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ]; 


    var formDrop = [
        '<div id="formDrop" class="formDrop"></div>'
    ];

    return {
        title: editor.lang.chtform.title,
        minWidth: 600,
        minHeight: 480,
        maxWidth: 600,
        maxHeight: 480,
        contents: [{
            id: 'info',
            label: '',
            title: '',
            expane: true,
            padding: 0,
            elements: [
                {
                    id: 'formModal',
                    type: 'html',
                    align: 'left',
                    html: formModal.join('')
                },
                {
                    id: 'formDrop',
                    type: 'html',
                    align: 'left',
                    html: formDrop.join('')
                },
                {
                    id: 'formTitle',
                    type: 'html',
                    align: 'left',
                    html: formTitle.join(''),
                },
                {
                    id: 'formBody',
                    type: 'html',
                    align: "left",
                    html: formBody.join(''),
                    onLoad: function (event) {
                        dialog = event.sender;
                    }
                },
                {
                    id: 'formBottom',
                    type: 'html',
                    align: 'left',
                    html: formBottom.join('')
                }
            ]
        }],
        buttons: [CKEDITOR.dialog.cancelButton],
        onShow: function () {
            let id = "#forms" + editor.config.serialId;
            if ($(id).html() === '') {
                $.ajax({
                    url: editor.config.chtFormUrl,
                    method: "post",
                    contentType: 'application/json',
                    data: JSON.stringify({
                    }),
                    success: function (result) {
                        resultProcess(result);
                    },
                    error: function (error) {
                        // 當讀圖片網址錯誤時, 讀 web 內建的圖片

                        //'<tr>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb" onmouseenter="CKEDITOR.tools.callFunction(', mouseEnter, ', event, this);return false;" onclick="CKEDITOR.tools.callFunction(', formClick, ', event, this);return false;">iPhone預訂</div></a></td>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb" onmouseenter="CKEDITOR.tools.callFunction(', mouseEnter, ', event, this);return false;" onclick="CKEDITOR.tools.callFunction(', formClick, ', event, this);return false;">MOD快閃</div></a></td>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb">x1</div></a></td>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb">x1</div></a></td>',
                        //    '</tr>',
                        //    '<tr>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb">x1</div></a></td>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb">x1</div></a></td>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb">x1</div></a></td>',
                        //    '<td class="thumb_td cke_dark_background cke_centered"><a class="text_link" href="" onkeydown="CKEDITOR.tools.callFunction(', keyDown, ', event, this);"><div class="text_thumb">x1</div></a></td>',
                        //    '</tr>',
                    }
                });
            } else {
                setTimeout(function () {
                    var firstForm = $("#forms" + editor.config.serialId + " a").first();
                    firstForm.focus();
                }, 10);
            }
        }
    }
});