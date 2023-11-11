CKEDITOR.dialog.add("replyDialog", function (t) {
    return {
        title: "客戶回覆訊息",
        minWidth: 400, minHeight: 200,
        contents: [{
            id: "tab-basic",
            label: "客戶回覆訊息",
            elements: [{
                id: "title",
                type: "text",
                label: "請輸入：客戶按了以後，回覆的內容",
                validate: function () {
                    var t = this.getElement().getDocument().getById("chtreplydiv");
                    if (!this.getValue())
                        return t && t.setHtml('<div id="chtreplydiv" style="color: red; font: bold 16px important;">請輸入顯示名稱</div>'), !1;
                    t && t.setHtml('<div id="chtreplydiv"></div>')
                },
                setup: function (t) { this.setValue(t.getText()) }
            }, {
                id: "content",
                type: "html",
                html: '',
                //label: "客戶回覆訊息（若與顯示名稱一致，則可不填）",
                setup: function (t) {
                    //var e = t.getAttribute("href");
                    //if (e) {
                    //    var i = e.split(":");
                    //    2 === i.length && this.setValue(i[1])
                    //}
                    }
                
            }, {
                id: "warning",
                type: "html",
                html: '<div id="chtreplydiv"></div>'
            }]
        }],
        buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
        onShow: function () {
            var e = t.getSelection(), i = e.getStartElement(); i && (i = i.getAscendant("a", !0)), i && "a" === i.getName() ? this.insertMode = !1 : ((i = t.document.createElement("a")).setHtml(e.getSelectedText()), this.insertMode = !0), this.initialReply = i, this.setupContent(i)
        },
        onOk: function () {
            var e = this, i = e.initialReply; i.setAttribute("href", "reply:"), i.setText(e.getValueOf("tab-basic", "title")), e.commitContent(i), e.insertMode && t.insertElement(i)
        },
        onCancel: function () { 
            var t = this.getElement().getDocument().getById("chtreplydiv"); t && t.setHtml('<div id="chtreplydiv"></div>') }
    }
});