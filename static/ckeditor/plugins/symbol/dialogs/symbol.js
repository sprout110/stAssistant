﻿/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add("symbol", function (f) {
    function n(a, b, c) {
        if (null != a) {
            for (var i = CKEDITOR.tools.getNextId() + "_symbol_table_label", h = [""], d = 0, f = 0, j = !1, g, k, m = a.split(","), p = 0; p < m.length; p++){
                g = 0; a = -1; k = !1; var e = m[p].split("-");
                switch (e.length) {
                    case 0:
                        break;
                    case 1:
                        "*" == e[0].charAt(e[0].length - 1) ? (a = g = parseInt(e[0].substring(0, e[0].length - 1), 16), k = !0) : a = g = parseInt(e[0], 16);
                        break;
                    default:
                        ("*" == e[0].charAt(e[0].length - 1) ? (g = parseInt(e[0].substring(0, e[0].length - 1), 16), k = !0) : g = parseInt(e[0], 16), "*" == e[1].charAt(e[1].length -
                            1)) ? (a = parseInt(e[1].substring(0, e[1].length - 1), 16), k = !0) : a = parseInt(e[1], 16)
                }d += a - g + 1;
                if (a >= g) {
                    j || (h.push('<table role="listbox" aria-labelledby="' + i + '" style="width: 100%; height: 100%; border-collapse: separate;" align="center" cellspacing="2" cellpadding="2" border="0">'), j = !0); for (; g <= a;){
                        0 == f && h.push("<tr>");
                        for (var e = !0, q = f; q < c; q++ , g++)if (g <= a) {
                            var n = t(g),
                                o = r && r[g] || n,
                                s = "cke_symbol_label_" + g + "_" + CKEDITOR.tools.getNextNumber();
                            h.push('<td class="cke_dark_background" style="cursor: default" role="presentation"><a href="javascript: void(0);" role="option" aria-posinset="' +
                                (g + 1) + '"',
                                ' aria-setsize="' + d + '"', ' aria-labelledby="' + s + '"', ' style="cursor: inherit; display: block; height: 1.25em; margin-top: 0.25em; text-align: center;" title="',
                                CKEDITOR.tools.htmlEncode(o),
                                '" onkeydown="CKEDITOR.tools.callFunction( ' + u + ', event, this )" onclick="CKEDITOR.tools.callFunction(' + v + ', this); return false;" tabindex="-1"><span style="margin: 0 auto;cursor: inherit"' + (k ? ">" + l : ">") + n + '</span><span class="cke_voice_label" id="' + s + '">' + o + "</span></a>");
                            h.push("</td>")
                } else {
                            f = q;
                            e = !1;
                            break
                }

                if (e)
                        f = 0, h.push("</tr>");
                else break
                    }
                }
            }
            if (0 != f) {
                for (g = f; g < c; g++)h.push("<td>&nbsp;</td>"); h.push("</tr>")
            } j ? (h[0] = 255 < d ? '<div style="width:100%;height:300px;overflow:auto;">' : "<div>", h.push("</table></div>"), c = h.join(""), b.getElement().setHtml(c)) : b.getElement().setHtml("<div>No valid range(s) defined...</div>")
        } else b.getElement().setHtml("<div>No range defined...</div>")
    }

    function t2(a) {
        a = a.toString(16).toUpperCase();
        r = 1 > a.length ?
            eval('"\\u0000"') :
            2 > a.length ?
                eval('"\\u000' + a + '"') :
                3 > a.length ?
                    eval('"\\u00' + a + '"') :
                    4 > a.length ?
                        eval('"\\u0' + a + '"') :
                        eval('"\\u' + a + '"')
        return r;
    }

    function t(codePoint) {
        var TEN_BITS = parseInt('1111111111', 2);

        if (codePoint <= 0xFFFF) {
            return t2(codePoint);
        }
        codePoint -= 0x10000;
        // Shift right to get to most significant 10 bits
        var leadingSurrogate = 0xD800 | (codePoint >> 10);
        // Mask to get least significant 10 bits
        var trailingSurrogate = 0xDC00 | (codePoint & TEN_BITS);
        return t2(leadingSurrogate) + t2(trailingSurrogate);
    }

    function w(a, b) {
        return a[0] == b[0] ? 0 : a[0] > b[0] ? 1 : -1
    } var l = "&nbsp;", d, r = f.lang.symbol, k = null, o = function (a) {
        var b, a = a.data ? a.data.getTarget() : new CKEDITOR.dom.element(a); if ("a" == a.getName() && (b = a.getChild(0).getHtml())) a.removeClass("cke_light_background"), b.length > l.length && 0 == b.indexOf(l) && (b = b.substring(l.length)), d.hide(), a = f.document.createElement("span"), a.setHtml(b), f.insertText(a.getText())
    }, v = CKEDITOR.tools.addFunction(o),
m,j=function(a,b){var c,b=b||a.data.getTarget();"span"==b.getName()&&(b=b.getParent());if("a"==b.getName()&&(c=b.getChild(0).getHtml())){m&&i(null,m);var f=d.getContentElement("info","unicodePreview").getElement();d.getContentElement("info","charPreview").getElement().setHtml(c);var h=0,h="&nbsp;"==c?160:c.length>l.length&&0==c.indexOf(l)?c.charCodeAt(l.length):c.charCodeAt(0);f.setHtml("Unicode (hex): "+h+" ("+h.toString(16).toUpperCase()+")");b.getParent().addClass("cke_light_background");m=b}},
i=function(a,b){b=b||a.data.getTarget();"span"==b.getName()&&(b=b.getParent());"a"==b.getName()&&(d.getContentElement("info","unicodePreview").getElement().setHtml("&nbsp;"),d.getContentElement("info","charPreview").getElement().setHtml("&nbsp;"),b.getParent().removeClass("cke_light_background"),m=void 0)},u=CKEDITOR.tools.addFunction(function(a){var a=new CKEDITOR.dom.event(a),b=a.getTarget(),c;c=a.getKeystroke();var d="rtl"==f.lang.dir;switch(c){case 38:if(c=b.getParent().getParent().getPrevious())c=
c.getChild([b.getParent().getIndex(),0]),c.focus(),i(null,b),j(null,c);a.preventDefault();break;case 40:if(c=b.getParent().getParent().getNext())if((c=c.getChild([b.getParent().getIndex(),0]))&&1==c.type)c.focus(),i(null,b),j(null,c);a.preventDefault();break;case 32:o({data:a});a.preventDefault();break;case d?37:39:case 9:if(c=b.getParent().getNext())c=c.getChild(0),1==c.type?(c.focus(),i(null,b),j(null,c),a.preventDefault(!0)):i(null,b);else if(c=b.getParent().getParent().getNext())(c=c.getChild([0,
0]))&&1==c.type?(c.focus(),i(null,b),j(null,c),a.preventDefault(!0)):i(null,b);break;case d?39:37:case CKEDITOR.SHIFT+9:(c=b.getParent().getPrevious())?(c=c.getChild(0),c.focus(),i(null,b),j(null,c),a.preventDefault(!0)):(c=b.getParent().getParent().getPrevious())?(c=c.getLast().getChild(0),c.focus(),i(null,b),j(null,c),a.preventDefault(!0)):i(null,b)}}),x=[CKEDITOR.dialog.cancelButton],y=f.lang.common.generalTab,z=f.lang.common.generalTab;f.config.sortSymbolRangesAlphabetically?k||(k=CKEDITOR.config.symbolRanges.slice(),
    k.sort(w)) :
    k = CKEDITOR.config.symbolRanges;
    return {
        title: "插入符號", buttons: x, charColumns: 16,
        onLoad: function () {
            var a = this.getContentElement("info", "symbolRange").getInputElement().$; if (a.childNodes.length > 0) { var b = "Basic Latin"; if (f.config.defaultSymbolRange) b = f.config.defaultSymbolRange; for (var c = 0, d = 0; d < a.childNodes.length; d++)if (a.childNodes[d].text == b) { c = d; break } a.selectedIndex = c; b = this.getContentElement("info", "charContainer"); n(a.childNodes[c].value, b, this.definition.charColumns) }
        }, contents: [{
            id: "info",
            label: y,
            title: z,
            padding: 0, align: "top",
            onHide: function () {
                d && d.destroy()
            }, elements: [{
                type: "vbox",
                align: "top",
                width: "100%",
                children: [{
                    type: "select",
                    id: "symbolRange",
                    width: "100%",
                    items: k,
                    size: 1,
                    onChange: function (a) {
                        var b = d.getContentElement("info", "charContainer");
                        n(a.sender.getValue(), b, d.definition.charColumns)
                    }
                }, {
                    type: "html", id: "charContainer", html: "", onMouseover: j, onMouseout: i, focus: function () { var a = this.getElement().getElementsByTag("a").getItem(0); setTimeout(function () { a.focus(); j(null, a) }, 0) },
                    onShow: function () {
                        var a = this.getElement().getElementsByTag("a").getItem(0); a != null && setTimeout(function () { a.focus(); j(null, a) }, 0)
                    }, onLoad: function (a) { d = a.sender }
                }, {
                    type: "hbox", align: "top", widths: ["100%"], children: [{ type: "html", html: "<div></div>" }, { type: "html", id: "unicodePreview", className: "cke_dark_background", style: "border:1px solid #eeeeee;font-size:14px;height:20px;width:192px;padding-top:25px;font-family:'Microsoft Sans Serif',Arial,'Arial Unicode',Helvetica,Verdana;text-align:center;", html: "<div>&nbsp;</div>" },
{type:"html",id:"charPreview",className:"cke_dark_background",style:"border:1px solid #eeeeee;font-size:28px;height:40px;width:70px;padding-top:9px;font-family:'Microsoft Sans Serif',Arial,'Arial Unicode',Helvetica,Verdana;text-align:center;",html:"<div>&nbsp;</div>"}]}]}]}]}});