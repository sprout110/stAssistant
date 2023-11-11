CKEDITOR.plugins.add( 'chtform' , {
    requires: 'dialog',
    lang: 'en,en-au,en-ca,en-gb,zh,zh-cn',
    icons: 'chtform',
    hidpi: true,
    init: function ( editor ) {
        editor.config.serialId = editor.config.serialId || 0;
        var pluginName = 'chtform';
        CKEDITOR.dialog.add(pluginName, this.path + 'dialogs/chtform.js?t=15' );

        editor.addCommand( pluginName , new CKEDITOR.dialogCommand( pluginName , {
        }));

        editor.ui.addButton && editor.ui.addButton( 'ChtForm' , {
            label: editor.lang.chtform.toolbar,
            command: pluginName,
            toolbar: 'cht,30'
        });
    }
});
