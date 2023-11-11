CKEDITOR.dialog.add( 'simpleimagebrowser' , function ( editor ) {

    var config = editor.config,
        lang = editor.lang.simpleimagebrowser,
        columns = config.simpleimagebrowser_columns || 4;

    var dialog;

    var onClick = function ( evt ) {
        var target = evt.data.getTarget(),
            targetName = target.getName();

        //console.log(targetName);

        if (targetName === 'a')
            target = target.getChild(0);
        else if (targetName !== 'img')
            return;

        var src = target.getAttribute('src'),
            title = target.getAttribute('title');

        if (!editor.config.imageBrowser_toDialog) {

            var img = editor.document.createElement('img', {
                attributes: {
                    src: src,
                    title: title,
                    alt: title,
                    width: target.$.width,
                    height: target.$.height
                }
            });

            editor.insertElement(img);

        } else {

            editor.fire('sendicon', 'img=' + src + '&title=' + title);

        }

        dialog.hide();

        evt.data.preventDefault();
    };

    var onKeydown = CKEDITOR.tools.addFunction( function ( evt, element ) {

        evt = new CKEDITOR.dom.event( evt );
        element = new CKEDITOR.dom.element( element );

        var relative, nodeToMove;
        var keystroke = evt.getKeystroke(),
            rtl = editor.lang.dir === 'rtl';

        switch ( keystroke ) {
            // UP
            case 38:
                if (( relative = element.getParent().getParent().getPrevious() )) {
                    nodeToMove = relative.getChild( [ element.getParent().getIndex() , 0 ] );
                    nodeToMove.focus();
                }
                evt.preventDefault();
                break;

            // DOWN
            case 40:
                // relative is TR
                if (( relative = element.getParent().getParent().getNext() )) {
                    nodeToMove = relative.getChild( [ element.getParent().getIndex() , 0 ] );
                    if ( nodeToMove )
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
                if (( relative = element.getParent().getNext() )) {
                    nodeToMove = relative.getChild(0);
                    nodeToMove.focus();
                    evt.preventDefault(true);
                }
                else if (( relative = element.getParent().getParent().getNext() )) {
                    nodeToMove = relative.getChild( [ 0 , 0 ] );
                    if ( nodeToMove )
                        nodeToMove.focus();
                    evt.preventDefault( true );
                }
                break;

            // LEFT
            case rtl ? 39 : 37:
                if (( relative = element.getParent().getPrevious() )) {
                    nodeToMove = relative.getChild(0);
                    nodeToMove.focus();
                    evt.preventDefault(true);
                }
                else if (( relative = element.getParent().getParent().getPrevious() )) {
                    nodeToMove = relative.getLast().getChild(0);
                    nodeToMove.focus();
                    evt.preventDefault( true );
                }
                break;

            default:
                // console.log(keystroke);
                evt.preventDefault(true);
                return;
        }
    });

    var selectChange = CKEDITOR.tools.addFunction( function ( element , index , length ) {

        for (i = 0; i < length; i++) {
            if (i === index) {
                $("tr[class='IconClass" + i + "']").show();
            } else {
                $("tr[class='IconClass" + i + "']").hide();
            }
        }

        setTimeout(function () {
            var firstSmile = $("#imageBrowser" + + editor.config.serialId + " a:visible").first();
            firstSmile.focus();
        }, 0);

    });

    var adjustIconClass = CKEDITOR.tools.addFunction( function ( n ) {
        $("#imageBrowser" + editor.config.serialId).hide();
        $("#imageNavigator" + editor.config.serialId).hide();
        $("#imageClass" + editor.config.serialId).show();

        x = [];
        $.ajax({
            url: editor.config.imageBrowser_classUrl,
            method: "get",
            contentType: 'application/json',
            data: JSON.stringify({
            }),
            success: function (result) {
                for (i = 0; i < result.length; i++) {
                    if (selectClass[result[i].Value] === true) {
                        x.push('<li class="list-group-item"><a href="#">', result[i].Value, '</a><span class="badge" onclick="CKEDITOR.tools.callFunction(', unbookIconClass, ', \'', result[i].Value, '\',\'', n ,'\');">-</span></li>');
                    } else {
                        x.push('<li class="list-group-item"><a href="#">', result[i].Value, '</a><span class="badge" onclick="CKEDITOR.tools.callFunction(', bookIconClass, ', \'', result[i].Value, '\',\'', n,'\');">+</span></li>');
                    }
                }
                $("#imageCandidate" + editor.config.serialId).html(x.join(''));
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    var bookIconClass = CKEDITOR.tools.addFunction(function (iconClass, n) {
        //alert()
        $.ajax({
            url: editor.config.imageBrowser_bookIcon,
            method: "post",
            contentType: 'application/json',
            data: JSON.stringify({
                iconClass: iconClass,
                agentId: n
            }),
            success: function (result) {
                console.log('booked');
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    var unbookIconClass = CKEDITOR.tools.addFunction(function (iconClass, n) {
        console.log(editor.config.imageBrowser_unbookIcon);
        $.ajax({
            url: editor.config.imageBrowser_unbookIcon,
            method: "post",
            contentType: 'application/json',
            data: JSON.stringify({
                iconClass: iconClass,
                agentId: n
            }),
            success: function (result) {
                console.log('unbooked');
            },
            error: function (error) {
                console.log('check!');
                console.log(error);
            }
        });
    });

    var goIconSelector = CKEDITOR.tools.addFunction(function (n) {
        $("#imageBrowser" + editor.config.serialId).show();
        $("#imageNavigator" + editor.config.serialId).show();
        $("#imageClass" + editor.config.serialId).hide();

        setTimeout(function () {
            var firstSmile = $("#imageBrowser" + editor.config.serialId + " a:visible").first();
            firstSmile.focus();
        }, 10);
    });

    var resultProcess = function (result, callapi) {
        var x = []; // for image navigator
        var b = []; // for icon table

        //console.log(result);

        if (result.length === 0) {
            $("#imageNavigator" + editor.config.serialId).html('sorry, 目前無圖片可使用!');
            return;
        }

        var imageClass = result
            .map(function (item) { return item.IconClass; })
            .filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });

        //console.log(imageClass);

        $.each(imageClass, function (index, item) {
            selectClass[item] = true;
        });

        //console.log(selectClass);

        var items = Object.keys(selectClass);

        for (i = 0; i < items.length; i++) {
            //if (i === 0) {
            //    x.push('<li class="active">');
            //} else {
                x.push('<li>');
            //}
            x.push('<a href="#" onclick="CKEDITOR.tools.callFunction(', selectChange, ', this.parent, ', i, ', ', items.length , '); ">' + (i + 1) + '</a></li>');
        }

        //x.push('<li><a href="#" onclick="CKEDITOR.tools.callFunction(', adjustIconClass, ',\'', callapi , '\');">+</a></li>');
        //console.log("#" + "imageNavigator" + editor.config.serialId);
        $("#imageNavigator" + editor.config.serialId).html(x.join(''));

        //console.log(selectClass);

        for (i = 0; i < items.length; i++) {

            var temp = result.filter(function (value, index, self) { return value.IconClass === items[i] });

            //console.log(temp);

            $.each(temp, function (j, c) {

                //console.log(i);
                //console.log(c);

                if (j % columns === 0) {
                    b.push('<tr class="IconClass' + i + '">');
                }

                b.push('<td class="thumb_td cke_dark_background cke_centered">', '<a class="img_link" href="" onkeydown="CKEDITOR.tools.callFunction(', onKeydown, ', event, this);">');

                if ( callapi === 'local' ) {
                    b.push('<img class="img_thumb" src="', editor.config.imagefolder , c.EmoticonPath , '" title="' + c.Keyword + '" ', (CKEDITOR.env.ie ? ' onload="this.setAttribute(\'width\', 2); this.removeAttribute(\'width\');" ' : ''), '/>');
                } else {
                    b.push('<img class="img_thumb" src="Emoticon/' + c.EmoticonId + '/png" title="' + c.Keyword + '" ', (CKEDITOR.env.ie ? ' onload="this.setAttribute(\'width\', 2); this.removeAttribute(\'width\');" ' : ''), '/>');
                }
                
                b.push('</a></td>');

                if (j % columns === columns - 1) {
                    b.push('</tr>');
                }
            });

            var last = columns - (temp.length % columns);
            if (last > 0) {
                for (j = 0; j < last; j++)
                    b.push('<td class="thumb_td cke_dark_background cke_centered"><span></span></td>');
                b.push('</tr>');
            }
        }

        $("#imageBrowser" + editor.config.serialId).html(b.join(''));

        for (i = 0; i < items.length; i++) {
            if (i.toString() === '0') {
                $("tr[class='IconClass" + i + "']").show();
            } else {
                $("tr[class='IconClass" + i + "']").hide();
            }
        }

        setTimeout(function () {
            var firstSmile = $("#imageBrowser" + editor.config.serialId + " a").first();
            firstSmile.focus();
        }, 0);
    }

    var htmlPagination = [
        '<ul id="imageNavigator', editor.config.serialId,'" class="pagination">',
        '</ul>'
    ];

    var htmlImage = [
        '<div>',
        '<table class="thumb_table" ', CKEDITOR.env.ie && CKEDITOR.env.quirks ? ' style="position:absolute;"' : '','>',
        '<tbody id="imageBrowser', editor.config.serialId,'">',
        '</tbody>',
        '</table>',
        '</div>'
    ];

    var htmlIconClass = [
        //'<div id = "imageClass" class="panel panel-default iconlist">',
        //'<div class="panel-heading">圖示庫<span style="float: right;" onclick="CKEDITOR.tools.callFunction(', goIconSelector, ',', 1,');">完成</span></div>',
        //'<div class="panel-body">',
        //'<ul id="imageCandidate" class="list-group iconclass">',
        //'</ul>',
        //'</div>',
        //'</div>'
    ];

    var selectClass = {};
    var allClass = [];

    return {
        title: editor.lang.simpleimagebrowser.title,
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
            elements: [{
                id: 'IconSelector',
                type: 'html',
                align: 'left',
                html: htmlPagination.join(''),
            }, {
                id: 'IconPage',
                type: 'html',
                align: "left",
                html: htmlImage.join(''),
                onLoad: function (event) {
                    dialog = event.sender;
                },
                onClick: onClick,
            }, {
                id: 'AllIcons',
                type: 'html',
                align: 'left',
                html: htmlIconClass.join(''),
            }]
        }],
        //buttons: [CKEDITOR.dialog.cancelButton],
        buttons: [],
        onLoad: function () {
            console.log('onLoad');
        },
        onShow: function () {
            console.log('onShow');

            $("#imageClass" + editor.config.serialId).hide();
            $("#imageBrowser" + editor.config.serialId).show();
            $("#imageNavigator" + editor.config.serialId).show();

            let id = "#imageBrowser" + editor.config.serialId;

            $('.cke_dialog_background_cover').css('z-index', '-1');

            if ($(id).html() === '') {
                var agentId = NiuPlatform ? (NiuPlatform.agentPageSetting ? (NiuPlatform.agentPageSetting.AgentId ? NiuPlatform.agentPageSetting.AgentId : '') : '') : '';
                var jqDeferred = $.ajax({
                    url: editor.config.imageBrowser_listUrl,
                    method: "post",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        agentId: agentId
                    }),
                    success: function (result) {
                        resultProcess(result, agentId);
                    },
                    error: function (error) {
                        // 當讀圖片網址錯誤時, 讀 web 內建的圖片
                        $.ajax({
                            url: editor.config.imageBrowser_listUrl,
                            method: "get",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            }),
                            success: function (result) {
                                //console.log(result);
                                result = JSON.parse(result);
                                resultProcess(result, 'local');
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    }
                })
                .then(
                function (result) {
                    return 'ok!'
                },
                function (error) {
                    return 'check!'
                });

                jqDeferred.then(
                function (result) {
                    //console.log(result);
                },
                function (error) {
                    console.log(error);
                });
            }
            else {
                setTimeout(function () {
                    var firstSmile = $("#imageBrowser" + editor.config.serialId + " a:visible").first();
                    firstSmile.focus();
                }, 10);
            }
        },
        onHide: function () {
            console.log('onHide');

            $('.cke_dialog_background_cover').css('z-index', '10000');
        }
    }
});