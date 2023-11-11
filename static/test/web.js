function gtag() {
  dataLayer.push(arguments);
}
function ga(e) {
  console.log(e);
}

!(function (p) {
  var g = {
    init: function (e) {
      var t = p.extend(
          {
            items: 1,
            itemsOnPage: 1,
            pages: 0,
            displayedPages: 5,
            edges: 2,
            currentPage: 0,
            useAnchors: !0,
            hrefTextPrefix: "#page-",
            hrefTextSuffix: "",
            prevText: "Prev",
            nextText: "Next",
            ellipseText: "&hellip;",
            ellipsePageSet: !0,
            cssStyle: "light-theme",
            listStyle: "",
            labelMap: [],
            selectOnClick: !0,
            nextAtFront: !1,
            invertPageOrder: !1,
            useStartEdge: !0,
            useEndEdge: !0,
            onPageClick: function (e, t) {},
            onInit: function () {},
          },
          e || {}
        ),
        a = this;
      return (
        (t.pages =
          t.pages ||
          (Math.ceil(t.items / t.itemsOnPage)
            ? Math.ceil(t.items / t.itemsOnPage)
            : 1)),
        t.currentPage
          ? (t.currentPage = t.currentPage - 1)
          : (t.currentPage = t.invertPageOrder ? t.pages - 1 : 0),
        (t.halfDisplayed = t.displayedPages / 2),
        this.each(function () {
          a.addClass(t.cssStyle + " simple-pagination").data("pagination", t),
            g._draw.call(a);
        }),
        t.onInit(),
        this
      );
    },
    selectPage: function (e) {
      return g._selectPage.call(this, e - 1), this;
    },
    prevPage: function () {
      var e = this.data("pagination");
      return (
        e.invertPageOrder
          ? e.currentPage < e.pages - 1 &&
            g._selectPage.call(this, e.currentPage + 1)
          : 0 < e.currentPage && g._selectPage.call(this, e.currentPage - 1),
        this
      );
    },
    nextPage: function () {
      var e = this.data("pagination");
      return (
        e.invertPageOrder
          ? 0 < e.currentPage && g._selectPage.call(this, e.currentPage - 1)
          : e.currentPage < e.pages - 1 &&
            g._selectPage.call(this, e.currentPage + 1),
        this
      );
    },
    getPagesCount: function () {
      return this.data("pagination").pages;
    },
    setPagesCount: function (e) {
      this.data("pagination").pages = e;
    },
    getCurrentPage: function () {
      return this.data("pagination").currentPage + 1;
    },
    destroy: function () {
      return this.empty(), this;
    },
    drawPage: function (e) {
      var t = this.data("pagination");
      return (
        (t.currentPage = e - 1),
        this.data("pagination", t),
        g._draw.call(this),
        this
      );
    },
    redraw: function () {
      return g._draw.call(this), this;
    },
    disable: function () {
      var e = this.data("pagination");
      return (
        (e.disabled = !0), this.data("pagination", e), g._draw.call(this), this
      );
    },
    enable: function () {
      var e = this.data("pagination");
      return (
        (e.disabled = !1), this.data("pagination", e), g._draw.call(this), this
      );
    },
    updateItems: function (e) {
      var t = this.data("pagination");
      (t.items = e),
        (t.pages = g._getPages(t)),
        this.data("pagination", t),
        g._draw.call(this);
    },
    updateItemsOnPage: function (e) {
      var t = this.data("pagination");
      return (
        (t.itemsOnPage = e),
        (t.pages = g._getPages(t)),
        this.data("pagination", t),
        g._selectPage.call(this, 0),
        this
      );
    },
    getItemsOnPage: function () {
      return this.data("pagination").itemsOnPage;
    },
    _draw: function () {
      var e = this.data("pagination"),
        t = g._getInterval(e);
      g.destroy.call(this);
      var a =
        "UL" ===
        ("function" == typeof this.prop
          ? this.prop("tagName")
          : this.attr("tagName"))
          ? this
          : p(
              "<ul" +
                (e.listStyle ? ' class="' + e.listStyle + '"' : "") +
                "></ul>"
            ).appendTo(this);
      if (
        (e.prevText &&
          g._appendItem.call(
            this,
            e.invertPageOrder ? e.currentPage + 1 : e.currentPage - 1,
            { text: e.prevText, classes: "prev" }
          ),
        e.nextText &&
          e.nextAtFront &&
          g._appendItem.call(
            this,
            e.invertPageOrder ? e.currentPage - 1 : e.currentPage + 1,
            { text: e.nextText, classes: "next" }
          ),
        e.invertPageOrder)
      ) {
        if (t.end < e.pages && 0 < e.edges) {
          if (e.useStartEdge) {
            var s = Math.max(e.pages - e.edges, t.end);
            for (i = e.pages - 1; s <= i; i--) g._appendItem.call(this, i);
          }
          e.pages - e.edges > t.end && e.pages - e.edges - t.end != 1
            ? a.append(
                '<li class="disabled"><span class="ellipse">' +
                  e.ellipseText +
                  "</span></li>"
              )
            : e.pages - e.edges - t.end == 1 && g._appendItem.call(this, t.end);
        }
      } else if (0 < t.start && 0 < e.edges) {
        if (e.useStartEdge)
          for (var n = Math.min(e.edges, t.start), i = 0; i < n; i++)
            g._appendItem.call(this, i);
        e.edges < t.start && t.start - e.edges != 1
          ? a.append(
              '<li class="disabled"><span class="ellipse">' +
                e.ellipseText +
                "</span></li>"
            )
          : t.start - e.edges == 1 && g._appendItem.call(this, e.edges);
      }
      if (e.invertPageOrder)
        for (i = t.end - 1; i >= t.start; i--) g._appendItem.call(this, i);
      else for (i = t.start; i < t.end; i++) g._appendItem.call(this, i);
      if (e.invertPageOrder) {
        if (
          0 < t.start &&
          0 < e.edges &&
          (e.edges < t.start && t.start - e.edges != 1
            ? a.append(
                '<li class="disabled"><span class="ellipse">' +
                  e.ellipseText +
                  "</span></li>"
              )
            : t.start - e.edges == 1 && g._appendItem.call(this, e.edges),
          e.useEndEdge)
        )
          for (i = (n = Math.min(e.edges, t.start)) - 1; 0 <= i; i--)
            g._appendItem.call(this, i);
      } else if (
        t.end < e.pages &&
        0 < e.edges &&
        (e.pages - e.edges > t.end && e.pages - e.edges - t.end != 1
          ? a.append(
              '<li class="disabled"><span class="ellipse">' +
                e.ellipseText +
                "</span></li>"
            )
          : e.pages - e.edges - t.end == 1 && g._appendItem.call(this, t.end),
        e.useEndEdge)
      )
        for (i = s = Math.max(e.pages - e.edges, t.end); i < e.pages; i++)
          g._appendItem.call(this, i);
      e.nextText &&
        !e.nextAtFront &&
        g._appendItem.call(
          this,
          e.invertPageOrder ? e.currentPage - 1 : e.currentPage + 1,
          { text: e.nextText, classes: "next" }
        ),
        e.ellipsePageSet && !e.disabled && g._ellipseClick.call(this, a);
    },
    _getPages: function (e) {
      return Math.ceil(e.items / e.itemsOnPage) || 1;
    },
    _getInterval: function (e) {
      return {
        start: Math.ceil(
          e.currentPage > e.halfDisplayed
            ? Math.max(
                Math.min(
                  e.currentPage - e.halfDisplayed,
                  e.pages - e.displayedPages
                ),
                0
              )
            : 0
        ),
        end: Math.ceil(
          e.currentPage > e.halfDisplayed
            ? Math.min(e.currentPage + e.halfDisplayed, e.pages)
            : Math.min(e.displayedPages, e.pages)
        ),
      };
    },
    _appendItem: function (t, e) {
      var a,
        s = this,
        n = s.data("pagination"),
        i = p("<li></li>"),
        l = s.find("ul"),
        r = {
          text: (t = t < 0 ? 0 : t < n.pages ? t : n.pages - 1) + 1,
          classes: "",
        };
      n.labelMap.length && n.labelMap[t] && (r.text = n.labelMap[t]),
        (r = p.extend(r, e || {})),
        t == n.currentPage || n.disabled
          ? (n.disabled || "prev" === r.classes || "next" === r.classes
              ? i.addClass("disabled")
              : i.addClass("active"),
            (a = p('<span class="current">' + r.text + "</span>")))
          : (a = n.useAnchors
              ? p(
                  '<a href="' +
                    n.hrefTextPrefix +
                    (t + 1) +
                    n.hrefTextSuffix +
                    '" class="page-link">' +
                    r.text +
                    "</a>"
                )
              : p("<span >" + r.text + "</span>")).click(function (e) {
              return g._selectPage.call(s, t, e);
            }),
        r.classes && a.addClass(r.classes),
        i.append(a),
        (l.length ? l : s).append(i);
    },
    _selectPage: function (e, t) {
      var a = this.data("pagination");
      return (
        (a.currentPage = e),
        a.selectOnClick && g._draw.call(this),
        a.onPageClick(e + 1, t)
      );
    },
    _ellipseClick: function (e) {
      var s = this,
        n = this.data("pagination"),
        i = e.find(".ellipse");
      i.addClass("clickable").parent().removeClass("disabled"),
        i.click(function (e) {
          var t, a;
          return (
            n.disable ||
              ((t = p(this)),
              (a = (parseInt(t.parent().prev().text(), 10) || 0) + 1),
              t
                .html(
                  '<input type="number" min="1" max="' +
                    n.pages +
                    '" step="1" value="' +
                    a +
                    '">'
                )
                .find("input")
                .focus()
                .click(function (e) {
                  e.stopPropagation();
                })
                .keyup(function (e) {
                  var t = p(this).val();
                  13 === e.which && "" !== t
                    ? 0 < t && t <= n.pages && g._selectPage.call(s, t - 1)
                    : 27 === e.which && i.empty().html(n.ellipseText);
                })
                .bind("blur", function (e) {
                  var t = p(this).val();
                  return (
                    "" !== t && g._selectPage.call(s, t - 1),
                    i.empty().html(n.ellipseText),
                    !1
                  );
                })),
            !1
          );
        });
    },
  };
  p.fn.pagination = function (e) {
    return g[e] && "_" != e.charAt(0)
      ? g[e].apply(this, Array.prototype.slice.call(arguments, 1))
      : "object" != typeof e && e
      ? void p.error("Method " + e + " does not exist on jQuery.pagination")
      : g.init.apply(this, arguments);
  };
})(jQuery);

(window.dataLayer = window.dataLayer || []),
  gtag("js", new Date()),
  gtag("config", "G-J2HVMN6FVP"),
  (cfg.mainInit = [
    () => {
      $("body").removeClass("noscript"),
        $("footer .year").text(new Date().getFullYear());
      const e = $(window),
        a = $("#scroll-to-top");
      let t = $("#header button.menu-btn"),
        l = !1;
      e
        .on("scroll", () => {
          var t = e.scrollTop();
          t >= 400 && !l
            ? ((l = !0), a.addClass("active"))
            : t < 400 && l && ((l = !1), a.removeClass("active"));
        })
        .on("resize", () => {
          "true" === t.attr("aria-expanded") &&
            (t.attr("aria-expanded", "false"),
            $("#menu-box, #sidebar")
              .attr("aria-hidden", "true")
              .removeClass("slide-in"));
        }),
        a.on(
          "click",
          () => ($("html,body").animate({ scrollTop: 0 }, 300), !1)
        ),
        $(".sizer [name=font-size]").on("change", (e) => {
          localStorage.setItem("page-font-size", e.currentTarget.id),
            $("#layout")
              .removeClass("size-S size-M size-L")
              .addClass(e.currentTarget.id);
        });
    },
    () => {
      let e = $("meta[name=sidebar]").attr("content") || "",
        a = $("#header ul.nav"),
        t = $(">.sizer>ul", a).clone();
      t.find("li:first").remove(),
        t.find("input").remove(),
        $("label", t).prop("tabindex", 0).prop("role", "button");
      let l = $("[class^=lang-]", a)
          .toArray()
          .map((e) => `<li>${e.outerHTML}</li>`)
          .join(""),
        r = $("[class^=pages-]", a)
          .toArray()
          .map((e) => `<li>${e.outerHTML}</li>`)
          .join(""),
        s = $("#header ul.site>li>a:not(:last)")
          .toArray()
          .map((e) => `<li>${e.outerHTML}</li>`)
          .join(""),
        n = `<dt>${"字體大小|Font Size".cej()}</dt><dd class="sizer"><ul>${t.html()}</ul></dd>`;
      (l = `<dt>${"語言切換|Language".cej()}</dt><dd><ul>${l}</ul></dd>`),
        "" !== r &&
          (r = `<dt>${"網站專區|Pages".cej()}</dt><dd><ul>${r}</ul></dd>`),
        "" !== s &&
          (s = `<dt>${"相關網站|Related".cej()}</dt><dd><ul>${s}</ul></dd>`);
      let o = $("#menu-box");
      $(".menu-head", o).html("<dl>" + n + l + r + s + "</dl>"),
        $(".sizer label", o)
          .on("keydown", (e) => {
            (32 != e.keyCode && 13 != e.keyCode) ||
              (e.preventDefault(), $(e.target).trigger("click"));
          })
          .each((e, a) => {
            let t = $(a);
            t.attr(
              "title",
              t.attr("title") +
                " (Enter" +
                "鍵選擇切換| key to select".cej() +
                ")"
            );
          });
      let d = $("#sidebar"),
        i = $("#header button.menu-btn");
      i.on("click", (a) => {
        let t = "true" === i.attr("aria-expanded");
        if ((i.attr("aria-expanded", t ? "false" : "true"), t)) {
          let e = d.is('[aria-hidden="false"]') ? d : o;
          e.removeClass("slide-in"),
            setTimeout(() => {
              e.attr("aria-hidden", "true");
            }, 333);
        } else {
          let a = "" === e ? o : d;
          a.attr("aria-hidden", "false"),
            setTimeout(() => {
              a.addClass("slide-in");
            }, 10);
        }
      }),
        $("button.main-menu", d).on("click", () => {
          d.removeClass("slide-in"),
            setTimeout(() => {
              d.attr("aria-hidden", "true");
            }, 333),
            o.attr("aria-hidden", "false"),
            setTimeout(() => {
              o.addClass("slide-in");
            }, 10);
        }),
        $("#header .pull-down").on(
          "mouseenter mouseleave focusout focusin",
          (e) => {
            let a = $("[aria-expanded]", e.currentTarget),
              t = $("+ div", a);
            $(a).attr(
              "aria-expanded",
              "none" === t.css("display") ? "false" : "true"
            );
          }
        );
    },
    () => {

      let e = $("#mega"),
        a = $("#mob-nav"),
        t = $("#sidebar"),
        l = $("meta[name=sidebar]").attr("content") || "",
        r = { type: "GET", dataType: "html", cache: !0 };

      const s = "zh" === cfg.lan;
      let n =
        $("meta[name=path]:last").attr("content") || window.location.pathname;

      n = n.replace(/\/+/g, "/");

      let o = (e) => {
          if (!/^(?:en|zh)$/.test(cfg.lan)) return;
          let a = e.data(s ? "en" : "zh");
          if ("" === a) return;
          if (null == a) {
            let e = window.location.href.substr(window.location.origin.length);
            a = s ? e.replace(/\/zh\//, "/en/") : e.replace(/\/en\//, "/zh/");
          }
          let t = s ? "English" : "中文",
            l = /^http/.test(a) ? ' target="_blank"' : "";
          $("#crumbs").append(
            `<a class="language-transfer" href="${a}"${l}>${t}</a>`
          );
        },
        d =
          "jp" === cfg.lan
            ? $.Deferred()
            : $.ajax(`${cfg.res}/data/${cfg.lan}/menu-mega.html`, r),
        i = $.ajax(`${cfg.res}/data/${cfg.lan}/menu.html`, r);
        
      $.when(d, i).done((s, d) => {
        var i;
        void 0 !== s &&
          ((i = s[0]),
          e.html(
            i
              .replace(/\$\{root\}/g, cfg.root)
              .replace(/\$\{asset\}/g, cfg.res)
              .replace(/<!--.+?-->/g, "")
              .replace(/>\s+</g, "><")
          ),
          $("a[href^=http]", e).each((e, a) => {
            $(a).addClass("external");
          }),
          $(
            "a[href$=doc], a[href$=docx], a[href$=ppt], a[href$=pptx], a[href$=pdf]",
            e
          ).each((e, a) => {
            $(a).addClass("download");
          }),
          $(">ul>li", e).hover(
            (e) => {
              document.activeElement.blur(),
                null === e.relatedTarget &&
                  window.setTimeout(() => {
                    a.find(">div").addClass("active");
                  }, 500);
              let a = $(e.currentTarget);
              a.addClass("hover"),
                e.hasOwnProperty("relatedTarget") &&
                  ("A" === e.relatedTarget?.tagName
                    ? a.find(">div").addClass("active")
                    : window.setTimeout(() => {
                        a.hasClass("hover") &&
                          a.find(">div").addClass("active");
                      }, 600));
            },
            (e) => {
              let a = $(e.currentTarget);
              a.removeClass("hover"), a.find(">div").removeClass("active");
            }
          ),
          $("#layout>.body, #header li.pull-down").on("click", () => {
            $("#mega>ul>li").removeClass("hover"),
              $("#mega>ul>li>div").removeClass("active");
          }),
          $(">ul>li", e).each((e, a) => {
            const t = $(a).find(".row:first");
            if (0 === t.length) return;
            let l = t
              .append('<div class="flot-subs"></div>')
              .find(".flot-subs");
            $("li.pop", t).each((e, a) => {
              const r = "pop" + e,
                s = $(a),
                n = s.position(),
                [o, d] = [s.width(), s.height()];
              let [i, c] = [n.left + o + 19, n.top];
              i > t.width() && ([i, c] = [n.left + 20, n.top + d - 1]),
                s
                  .attr("data-sub", r)
                  .find("ul")
                  .addClass(r)
                  .css({ left: i, top: c })
                  .appendTo(l);
            });
          }),
          $("#mega li.pop").hover(
            (e) => {
              const a = $(e.currentTarget),
                t = a.data("sub");
              a.closest(".row").find(">.flot-subs").addClass(t);
            },
            (e) => {
              const a = $(e.currentTarget),
                t = a.data("sub"),
                l = a.closest(".row").find(">.flot-subs"),
                r = l.find("." + t);
              window.setTimeout(() => {
                r.is(":hover") || l.removeClass(t);
              }, 100);
            }
          ),
          $("#mega .flot-subs>ul").hover(
            (e) => {},
            (e) => {
              const a = $(e.currentTarget);
              a.removeClass("active");
              const t = a.attr("class");
              a.closest(".flot-subs").removeClass(t);
            }
          ),
          $("#mega > ul > li > a").attr("tabindex", 0)),
          ((t) => {
            a.html(
              t
                .replace(/\$\{root\}/g, cfg.root)
                .replace(/\$\{asset\}/g, cfg.res)
                .replace(/<!--.+?-->/g, "")
                .replace(/>\s+</g, "><")
            );
            let l = $("#header ul.site li.pull-down ul").html();
            void 0 !== l &&
              $(">ul", a).append(
                `<li><a>${"TWSE 網站|TWSE Sites".cej()}</a><ul>${l}</ul></li>`
              ),
              a
                .find("li>ul")
                .parent()
                .addClass("has-sub")
                .find("a")
                .on("click", function (e) {
                  var a = $(e.currentTarget),
                    t = a.parent();
                  return (
                    (!t.hasClass("has-sub") && void 0 !== a.attr("href")) ||
                    (t.hasClass("open")
                      ? (t.removeClass("open"),
                        t.find("li").removeClass("open"),
                        !1)
                      : (t.closest("ul").find("li").removeClass("open"),
                        t.addClass("open"),
                        !1))
                  );
                }),
              e.find("a.more").each((e, t) => {
                let l = $(t).attr("href");
                "#" !== l && a.find(`a[href="${l}"]`).addClass("more");
              }),
              $("a[href^=http]", a).each((e, a) => {
                $(a).addClass("external");
              }),
              $(
                "a[href$=doc], a[href$=docx], a[href$=ppt], a[href$=pptx], a[href$=pdf]",
                a
              ).each((e, a) => {
                $(a).addClass("download");
              }),
              $("a[href]", a).on("click", () => {
                $("#header button.menu-btn").trigger("click");
              }),
              "jp" === cfg.lan &&
                $("#mob-nav > ul > li > a").attr("tabindex", 0);
          })(d[0]),
          "" === l || "popular" === l || "events" === l
            ? (() => {
                let e = [],
                  a = n.replace(/index\.html$/, ""),
                  l = /\/(?:zh|en|jp)\/$/.test(a)
                    ? $()
                    : $("#mob-nav li>a[href]")
                        .filter((e, a) => {
                          let t = $(a).attr("href");
                          return !/^http/.test(t) && t.indexOf(n) > -1;
                        })
                        .first();
                0 == l.length
                  ? t.removeClass("skeleton-loading")
                  : (l.parentsUntil("#mob-nav").each((a, t) => {
                      "li" == t.tagName.toLowerCase() &&
                        e.push($(t).addClass("open").find(">a").text());
                    }),
                    o(l)),
                  $("meta[name=crumbs]").each((a, t) => {
                    e = $(t).attr("content").split(/,/).reverse();
                  }),
                  e.push(
                    `<a href="${cfg.root}/${
                      cfg.lan
                    }/">${"首頁|Home|ﾄｯﾌﾟﾍﾟｰｼﾞ".cej()}</a>`
                  ),
                  $("#crumbs").prepend(
                    "<ul>" +
                      e
                        .reverse()
                        .map((e) => `<li>${e}</li>`)
                        .join("") +
                      "</ul>"
                  );
                let r = $("#mob-nav>ul>li.open");
                t
                  .removeClass("skeleton-loading")
                  .find("header")
                  .text(r.find(">a").text()),
                  $("ul:first", r)
                    .clone(!0)
                    .appendTo($("nav:first", t).empty());
              })()
            : "etf etn foreign warrants".indexOf(l) < 0
            ? t.removeClass("skeleton-loading")
            : (t.addClass("microsite"),
              $.ajax(`${cfg.res}/data/${cfg.lan}/menu-${l}.html`, r).done(
                (e) => {
                  t.removeClass("skeleton-loading").addClass(l);
                  let a = $("nav:first", t);
                  a.html(
                    e
                      .replace(/\$\{root\}/g, cfg.root)
                      .replace(/\$\{asset\}/g, "/res")
                      .replace(/<!--.+?-->/g, "")
                      .replace(/>\s+</g, "><")
                  );
                  let r = $(">ul", a);
                  $("header", t).html(r.data("title")),
                    a
                      .find("li>ul")
                      .parent()
                      .addClass("has-sub")
                      .find("a")
                      .on("click", function (e) {
                        let a = $(e.currentTarget),
                          t = a.parent();
                        return (
                          (!t.hasClass("has-sub") &&
                            void 0 !== a.attr("href")) ||
                          (t.hasClass("open")
                            ? (t.removeClass("open"),
                              t.find("li").removeClass("open"),
                              !1)
                            : (t.closest("ul").find("li").removeClass("open"),
                              t.addClass("open"),
                              !0))
                        );
                      }),
                    $("a[href^=http]", a).each((e, a) => {
                      $(a).addClass("external");
                    }),
                    $(
                      "a[href$=doc], a[href$=docx], a[href$=ppt], a[href$=pptx], a[href$=pdf]",
                      a
                    ).each((e, a) => {
                      $(a).addClass("download");
                    });
                  let s = $("li>a[href]", a)
                      .filter((e, a) => $(a).attr("href").indexOf(n) > -1)
                      .first(),
                    d = [];
                  s.parentsUntil("nav").each((e, a) => {
                    "li" == a.tagName.toLowerCase() &&
                      d.push($(a).addClass("open").find(">a").text());
                  }),
                    (d = d.concat(r.data("crumbs")?.split(/,/).reverse())),
                    $("meta[name=crumbs]").each((e, a) => {
                      d = $(a).attr("content").split(/,/).reverse();
                    }),
                    d.push(
                      `<a href="${cfg.root}/${
                        cfg.lan
                      }/">${"首頁|Home|ﾄｯﾌﾟﾍﾟｰｼﾞ".cej()}</a>`
                    ),
                    $("#crumbs").prepend(
                      "<ul>" +
                        d
                          .reverse()
                          .map((e) => `<li>${e}</li>`)
                          .join("") +
                        "</ul>"
                    ),
                    0 !== s.length && o(s);
                }
              ));
      }),
        "jp" === cfg.lan && d.resolve();
      /^localhost\b/.test(location.host) &&
        ($("body").addClass("dev"),
        setTimeout(() => {
          $.ajax(`${cfg.res}/menu/old/menu-${cfg.lan}.html`, r).done((e) => {
            let a, t;
            $oldMenu = $(
              e
                .replace(/\$\{root\}/g, cfg.root)
                .replace(/\$\{asset\}/g, "/res")
                .replace(/<!--.+?-->/g, "")
                .replace(/>\s+</g, "><")
            );
            const l = (e) => {
              e.find(">li").each((e, r) => {
                let s = $(r).find(">a"),
                  n = s.text(),
                  o = s.attr("href")?.replace(/^.+(\/(?:zh|en|jp)\/)/, "$1"),
                  d = $(r).find(">ul");
                d.length
                  ? (a.push(n), l(d))
                  : (a.push(n), (t[a.join(">")] = o), a.pop());
              }),
                a.pop();
            };
            (a = []), (t = {}), l($oldMenu);
            let r = { ...t };
            (a = []), (t = {}), l($("#mob-nav>ul"));
            let s = { ...t },
              o = n.replace(/^.+(\/(?:zh|en|jp)\/)/, "$1");
            for (let e in s)
              o === s[e] &&
                e in r &&
                ($("#crumbs>ul") || $("#crumbs")).append(
                  `<a href="https://www.twse.com.tw/pcversion${r[e]}" class="dev-link" target="_blank" title="僅在開發模式出現">舊站</a>`
                );
          });
          let e = document.createElement("a");
          (e.innerText = "編輯"),
            e.setAttribute("href", "#"),
            e.setAttribute("class", "dev-link"),
            e.addEventListener("click", (e) => {
              e.preventDefault();
              let a = new XMLHttpRequest();
              return a.open("GET", "/open-in-editor"), a.send(), !1;
            }),
            (
              document.querySelector("#crumbs>ul") ||
              document.querySelector("#crumbs")
            ).append(e);
        }, 500));
    },
    () => {
      $("table.links tr").on("click", (e) => {
        if ((console.log(e), "A" == e.target.tagName)) return !0;
        e.preventDefault();
        var a = $(e.currentTarget).find("a:first");
        0 != a.length &&
          (a.attr("target")
            ? window.open(a.attr("href"))
            : (location.href = a.attr("href")));
      });
    },
    () => {
      $("#kv").length &&
        $("#header .pre-version")
          .attr("href", "index.html")
          .text("zh" === cfg.lan ? "新版首頁" : "New HomePage");
    },
  ]);
