CKEDITOR.plugins.add('chtreply', {
    init: function (a) {
            CKEDITOR.dialog.add('replyDialog', this.path + 'dialogs/replyDialog.js?t=1'),
            a.addCommand("reply", new CKEDITOR.dialogCommand("replyDialog")),
            a.ui.addButton('ChtReply', { label: '客戶回覆訊息', command: 'reply', icon: this.path + "images/chtreply.png?t=2", toolbar: 'cht,10' })
    }
});