CKEDITOR.plugins.add( 'simpleimagebrowser' , {
    requires: 'dialog',
    lang: 'en,en-au,en-ca,en-gb,zh,zh-cn',
    icons: 'simpleimagebrowser',
    hidpi: true,
    init: function ( editor ) {
        editor.config.imageBrowser_listUrl = editor.config.imageBrowser_listUrl || (this.path + 'images_list.txt');

        editor.config.imagefolder = this.path + 'images/';

        editor.config.serialId = editor.config.serialId || 0;

        var pluginName = 'simpleimagebrowser';

        // Register the dialog.
        CKEDITOR.dialog.add( pluginName , this.path + 'dialogs/simpleimagebrowser.js?t=47' );

        editor.addCommand( pluginName , new CKEDITOR.dialogCommand( pluginName , {
            allowedContent: 'img[alt,height,!src,title,width]',
            requiredContent: 'img'
        }));

        editor.ui.addButton && editor.ui.addButton( 'SimpleImageBrowser' , {
            label: editor.lang.simpleimagebrowser.toolbar,
            command: pluginName,
            toolbar: 'cht,20'
        });
    }
});
