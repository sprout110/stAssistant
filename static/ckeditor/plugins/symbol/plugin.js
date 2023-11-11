/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license

 If you find an error please let me know (helmoe {AT} gmail {DOTCOM}
*/
CKEDITOR.plugins.add("symbol", {
    availableLangs: { en: 1 },
    lang: "en",
    requires: "dialog",
    icons: "symbol",
    init: function (a) {
        var c = this; CKEDITOR.dialog.add("symbol", this.path + "dialogs/symbol.js?t=4");

        a.addCommand("symbol", {
            exec: function () {
                    if (a.config.removeSymbolRanges && 0 < a.config.removeSymbolRanges.length)
                        for (var d = a.config.removeSymbolRanges.length - 1; 0 <= d; d--) {
                            var e = a.config.removeSymbolRanges[d]; e < a.config.symbolRanges.length && a.config.symbolRanges.splice(e, 1)
                        }
                    var b = a.langCode, b = c.availableLangs[b] ? b : c.availableLangs[b.replace(/-.*/, "")] ?
                        b.replace(/-.*/, "") : "en";
                    CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + b + ".js"), function () {
                        CKEDITOR.tools.extend(a.lang.symbol, c.langEntries[b]); a.openDialog("symbol")
                    })
                }, modes: { wysiwyg: 1 }, canUndo: !1
        });

        a.ui.addButton && a.ui.addButton("Symbol", {
            label: "插入符號", command: "symbol", toolbar: "insert"
        })
    }
});

CKEDITOR.config.symbolRanges = [
    ["特殊符號", "0020-002F,003A-0040,007B-007E,2713-2713,3010-3011,203B,ff0c,3001,3002,ff0e,2027,ff1b,ff1a,ff1f,ff01,2026,2025,00b7,ff5c,2013,2014,2574,ff08,ff09,ff5b,ff5d,3014,3015,3010,3011,300a,300b,3008,3009,300c,300d,300e,300f,2018,2019,201c,201d,301d,301e,2035,2032,ff03,ff06,ff0a,203b,00a7,3003,25cf,25b3,25b2,25ce,2606,2605,25c7,25c6,25a1,25a0,25bd,25bc,32a3,02cd,fe49,fe4a,fe4d,fe4e,fe4b,fe4c,2640,2642,2295,2299,2191,2193,2190,2192,2196,2197,2198,2199,2225,2223,ff0e,ff3c,2215,2105,ffe3,ff3f,ff0b,ff0d,00d7,00f7,00b1,221a,ff1c,ff1e,ff1d,2266,2267,2260,221e,2252,2261,ff5e,2229,222a,ff04,ffe5,ffe1,ff05,20ac,2103,2109"],
    ["表情符號", "1F601-1F64F"],
    ["可愛符號", "231A-231B,261D,2638-2653,267F,26BD-26FF"],
    ["雜錦符號", "2702-27B0"]
];