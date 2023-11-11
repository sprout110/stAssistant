

CKEDITOR.editorConfig = function (config) {
    config.uiColor = 'lightgrey';

    config.skin = 'moono-lisa-edited';

    config.toolbar = 'Release';

    config.toolbar_Release = [
        { name: 'clipboard', groups: ['undo'], items: ['Undo', 'Redo'] },
        { name: 'basicstyles', groups: ['basicstyles'], items: ['Bold', 'Italic', 'Underline'] },
        { name: 'styles', groups: ['styles'], items: ['Font', 'FontSize', 'TextColor'] },
        { name: 'paragraph', groups: ['list'], items: ['NumberedList', 'BulletedList'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'insert', items: ['HorizontalRule', 'Symbol'] },
        { name: 'document', groups: ['mode'], items: [ 'Sourcedialog'] }
    ];
     
    config.toolbar_Debug = [
        { name: 'clipboard', groups: ['undo'], items: ['Undo', 'Redo'] },
        { name: 'basicstyles', groups: ['basicstyles'], items: ['Bold', 'Italic', 'Underline'] },
        { name: 'styles', groups:['styles'], items: ['Font', 'FontSize', 'TextColor'] },
        { name: 'paragraph', groups: ['list'], items: ['NumberedList', 'BulletedList'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'insert', items: ['HorizontalRule', 'Symbol'] },
        { name: 'document', groups: ['mode'], items: ['SimpleImageBrowser', 'ChtForm', 'Sourcedialog'] }
    ];

    config.toolbar_Full = [
        { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker'], items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
        { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
        { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
        { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
        '/',
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
        { name: 'others', items: ['-'] },
        { name: 'about', items: ['About'] }
    ]; 

    config.toolbar_AgentRelease = [
        { name: 'clipboard', groups: ['undo'], items: ['Undo', 'Redo'] },
        { name: 'basicstyles', groups: ['basicstyles'], items: ['Bold', 'Italic', 'Underline'] },
        { name: 'styles', items: ['TextColor', 'Font', 'FontSize'] },
        { name: 'paragraph', groups: ['list'], items: ['NumberedList', 'BulletedList'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'insert', items: ['HorizontalRule', 'Symbol'] },
        { name: 'cht', items: ['ChtReply'] },
        { name: 'document', groups: ['mode'], items: [ 'Sourcedialog'] }
    ];

    config.toolbar_AgentEomtRelease = [
        { name: 'clipboard', groups: ['undo'], items: ['Undo', 'Redo'] },
        { name: 'basicstyles', groups: ['basicstyles'], items: ['Bold', 'Italic', 'Underline'] },
        { name: 'styles', groups: ['styles'], items: ['Font', 'FontSize', 'TextColor'] },
        { name: 'paragraph', groups: ['list'], items: ['NumberedList', 'BulletedList'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'insert', items: ['HorizontalRule', 'Symbol'] },
        { name: 'cht', items: ['ChtReply'] },
        { name: 'document', groups: ['mode'], items: [ 'Sourcedialog'] }
    ];

    config.toolbar_AgentDebug = [
        { name: 'clipboard', groups: ['undo'], items: ['Undo', 'Redo'] },
        { name: 'basicstyles', groups: ['basicstyles'], items: ['Bold', 'Italic', 'Underline'] },
        { name: 'styles', groups: ['styles'], items: ['Font', 'FontSize', 'TextColor'] },
        { name: 'paragraph', groups: ['list'], items: ['NumberedList', 'BulletedList'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'insert', items: ['HorizontalRule', 'Symbol'] },
        { name: 'cht', items: ['ChtReply'] },
        { name: 'document', groups: ['mode'], items: [ 'Sourcedialog'] }
    ];

    config.toolbarCanCollapse = false;

    config.toolbarLocation = 'top';

    config.toolbarStartupExpanded = true; 

    config.removeButtons = 'Cut,Copy,Paste,Anchor';

    config.image_previewText = ' ';

    config.removeDialogTabs = 'link:advanced';

    config.height = 450;

    config.resize_enabled = false;

    config.allowedContent = false;

    config.extraAllowedContent = 'p br strong em u hr; i[id](*); ol[id](*); ul[id](*); li[id](*); a[!href,intentid,data-toggle,data-target,data-dismiss,id,replyintentid,queryid](*){*}; span[id](*){color,background-color,font-size}; img[alt,src,replyintentid](ac-image){*}; div[id,onfocus](*){*}';

    config.protectedSource.push(/<i[^>]*><\/i>/g);

    config.font_names =
        'Comic Sans MS/Comic Sans MS, cursive;' +
        'Times New Roman/Times New Roman, Times, serif;' +
        '標楷體/DFKai-SB, serif;' +
        '微軟正黑體/Microsoft JhengHei, serif;';

    config.fontSize_sizes = '1.6em;2.0em;';

    config.contentsCss = [];

    config.extraPlugins = 'sourcedialog,symbol,horizontalrule,font,colorbutton,floatpanel,panel,image,filetools,popup,filebrowser,imagebrowser,simpleimagebrowser,chtform';

    config.imageBrowser_bookIcon = "";

    config.imageBrowser_unbookIcon = "";

    config.chtFormUrl = "";

    //config.enterMode = CKEDITOR.ENTER_BR;

    //config.shiftEnterMode = CKEDITOR.ENTER_BR;

    config.undoStackSize = 50;

    config.forcePasteAsPlainText = true;

    config.keystrokes = [
        [CKEDITOR.CTRL + 90 /*Z*/, 'undo'],
        [CKEDITOR.CTRL + 89 /*Y*/, 'redo'],
        [CKEDITOR.CTRL + 75 /*K*/, 'link'],
        [CKEDITOR.CTRL + 66 /*B*/, 'bold'],
        [CKEDITOR.CTRL + 73 /*I*/, 'italic'],
        [CKEDITOR.CTRL + 78 /*N*/, 'numberedlist'],
        [CKEDITOR.CTRL + 85 /*U*/, 'bulletedlist'],
        [CKEDITOR.CTRL + 82 /*R*/, 'reply'],
        [CKEDITOR.CTRL + 83 /*S*/, 'simpleimagebrowser']
    ];

    config.blockedKeystrokes = [
        CKEDITOR.CTRL + 66 /*B*/,
        CKEDITOR.CTRL + 73 /*I*/,
        CKEDITOR.CTRL + 78 /*N*/,
        CKEDITOR.CTRL + 83 /*S*/
    ];

    config.startupFocus = true;
    config.startupMode = 'wysiwyg'; 
    config.contentsLangDirection = 'ltr';

    config.dialog_backgroundCoverColor = 'lightgray';
    config.dialog_backgroundCoverColor = 'white';
    config.dialog_backgroundCoverOpacity = 0.5;

    config.dialog_magnetDistance = 20;
};
