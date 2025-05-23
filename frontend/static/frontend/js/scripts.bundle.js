this.Element && function(t) {
    t.matches = t.matches || t.matchesSelector || t.webkitMatchesSelector || t.msMatchesSelector || function(t) {
        for (var e = (this.parentNode || this.document).querySelectorAll(t), a = -1; e[++a] && e[a] != this; )
            ;
        return !!e[a]
    }
}(Element.prototype),
this.Element && function(t) {
    t.closest = t.closest || function(t) {
        for (var e = this; e.matches && !e.matches(t); )
            e = e.parentNode;
        return e.matches ? e : null
    }
}(Element.prototype),
this.Element && function(t) {
    t.matches = t.matches || t.matchesSelector || t.webkitMatchesSelector || t.msMatchesSelector || function(t) {
        for (var e = (this.parentNode || this.document).querySelectorAll(t), a = -1; e[++a] && e[a] != this; )
            ;
        return !!e[a]
    }
}(Element.prototype),
function() {
    for (var t = 0, e = ["webkit", "moz"], a = 0; a < e.length && !window.requestAnimationFrame; ++a)
        window.requestAnimationFrame = window[e[a] + "RequestAnimationFrame"],
        window.cancelAnimationFrame = window[e[a] + "CancelAnimationFrame"] || window[e[a] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(e) {
        var a = (new Date).getTime()
          , n = Math.max(0, 16 - (a - t))
          , o = window.setTimeout(function() {
            e(a + n)
        }, n);
        return t = a + n,
        o
    }
    ),
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    }
    )
}(),
[Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function(t) {
    t.hasOwnProperty("prepend") || Object.defineProperty(t, "prepend", {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: function() {
            var t = Array.prototype.slice.call(arguments)
              , e = document.createDocumentFragment();
            t.forEach(function(t) {
                var a = t instanceof Node;
                e.appendChild(a ? t : document.createTextNode(String(t)))
            }),
            this.insertBefore(e, this.firstChild)
        }
    })
}),
window.mUtilElementDataStore = {},
window.mUtilElementDataStoreID = 0,
window.mUtilDelegatedEventHandlers = {};
var mUtil = function() {
    var t = []
      , e = {
        sm: 544,
        md: 768,
        lg: 1024,
        xl: 1200
    }
      , a = function() {
        var e = !1;
        window.addEventListener("resize", function() {
            clearTimeout(e),
            e = setTimeout(function() {
                !function() {
                    for (var e = 0; e < t.length; e++)
                        t[e].call()
                }()
            }, 250)
        })
    };
    return {
        init: function(t) {
            t && t.breakpoints && (e = t.breakpoints),
            a()
        },
        addResizeHandler: function(e) {
            t.push(e)
        },
        removeResizeHandler: function(e) {
            for (var a = 0; a < t.length; a++)
                e === t[a] && delete t[a]
        },
        runResizeHandlers: function() {
            _runResizeHandlers()
        },
        resize: function() {
            if ("function" == typeof Event)
                window.dispatchEvent(new Event("resize"));
            else {
                var t = window.document.createEvent("UIEvents");
                t.initUIEvent("resize", !0, !1, window, 0),
                window.dispatchEvent(t)
            }
        },
        getURLParam: function(t) {
            var e, a, n = window.location.search.substring(1).split("&");
            for (e = 0; e < n.length; e++)
                if ((a = n[e].split("="))[0] == t)
                    return unescape(a[1]);
            return null
        },
        isMobileDevice: function() {
            return this.getViewPort().width < this.getBreakpoint("lg")
        },
        isDesktopDevice: function() {
            return !mUtil.isMobileDevice()
        },
        getViewPort: function() {
            var t = window
              , e = "inner";
            return "innerWidth"in window || (e = "client",
            t = document.documentElement || document.body),
            {
                width: t[e + "Width"],
                height: t[e + "Height"]
            }
        },
        isInResponsiveRange: function(t) {
            var e = this.getViewPort().width;
            return "general" == t || ("desktop" == t && e >= this.getBreakpoint("lg") + 1 || ("tablet" == t && e >= this.getBreakpoint("md") + 1 && e < this.getBreakpoint("lg") || ("mobile" == t && e <= this.getBreakpoint("md") || ("desktop-and-tablet" == t && e >= this.getBreakpoint("md") + 1 || ("tablet-and-mobile" == t && e <= this.getBreakpoint("lg") || "minimal-desktop-and-below" == t && e <= this.getBreakpoint("xl"))))))
        },
        getUniqueID: function(t) {
            return t + Math.floor(Math.random() * (new Date).getTime())
        },
        getBreakpoint: function(t) {
            return e[t]
        },
        isset: function(t, e) {
            var a;
            if (-1 !== (e = e || "").indexOf("["))
                throw new Error("Unsupported object path notation.");
            e = e.split(".");
            do {
                if (void 0 === t)
                    return !1;
                if (a = e.shift(),
                !t.hasOwnProperty(a))
                    return !1;
                t = t[a]
            } while (e.length);return !0
        },
        getHighestZindex: function(t) {
            for (var e, a, n = mUtil.get(t); n && n !== document; ) {
                if (("absolute" === (e = mUtil.css(n, "position")) || "relative" === e || "fixed" === e) && (a = parseInt(mUtil.css(n, "z-index")),
                !isNaN(a) && 0 !== a))
                    return a;
                n = n.parentNode
            }
            return null
        },
        hasFixedPositionedParent: function(t) {
            for (; t && t !== document; ) {
                if (position = mUtil.css(t, "position"),
                "fixed" === position)
                    return !0;
                t = t.parentNode
            }
            return !1
        },
        sleep: function(t) {
            for (var e = (new Date).getTime(), a = 0; a < 1e7 && !((new Date).getTime() - e > t); a++)
                ;
        },
        getRandomInt: function(t, e) {
            return Math.floor(Math.random() * (e - t + 1)) + t
        },
        isAngularVersion: function() {
            return void 0 !== window.Zone
        },
        deepExtend: function(t) {
            t = t || {};
            for (var e = 1; e < arguments.length; e++) {
                var a = arguments[e];
                if (a)
                    for (var n in a)
                        a.hasOwnProperty(n) && ("object" == typeof a[n] ? t[n] = mUtil.deepExtend(t[n], a[n]) : t[n] = a[n])
            }
            return t
        },
        extend: function(t) {
            t = t || {};
            for (var e = 1; e < arguments.length; e++)
                if (arguments[e])
                    for (var a in arguments[e])
                        arguments[e].hasOwnProperty(a) && (t[a] = arguments[e][a]);
            return t
        },
        get: function(t) {
            var e;
            return t === document ? document : t && 1 === t.nodeType ? t : (e = document.getElementById(t)) ? e : (e = document.getElementsByTagName(t)) ? e[0] : (e = document.getElementsByClassName(t)) ? e[0] : null
        },
        getByClass: function(t) {
            var e;
            return (e = document.getElementsByClassName(t)) ? e[0] : null
        },
        hasClasses: function(t, e) {
            if (t) {
                for (var a = e.split(" "), n = 0; n < a.length; n++)
                    if (0 == mUtil.hasClass(t, mUtil.trim(a[n])))
                        return !1;
                return !0
            }
        },
        hasClass: function(t, e) {
            if (t)
                return t.classList ? t.classList.contains(e) : new RegExp("\\b" + e + "\\b").test(t.className)
        },
        addClass: function(t, e) {
            if (t && void 0 !== e) {
                var a = e.split(" ");
                if (t.classList)
                    for (var n = 0; n < a.length; n++)
                        a[n] && a[n].length > 0 && t.classList.add(mUtil.trim(a[n]));
                else if (!mUtil.hasClass(t, e))
                    for (n = 0; n < a.length; n++)
                        t.className += " " + mUtil.trim(a[n])
            }
        },
        removeClass: function(t, e) {
            if (t && void 0 !== e) {
                var a = e.split(" ");
                if (t.classList)
                    for (var n = 0; n < a.length; n++)
                        t.classList.remove(mUtil.trim(a[n]));
                else if (mUtil.hasClass(t, e))
                    for (n = 0; n < a.length; n++)
                        t.className = t.className.replace(new RegExp("\\b" + mUtil.trim(a[n]) + "\\b","g"), "")
            }
        },
        triggerCustomEvent: function(t, e, a) {
            if (window.CustomEvent)
                var n = new CustomEvent(e,{
                    detail: a
                });
            else
                (n = document.createEvent("CustomEvent")).initCustomEvent(e, !0, !0, a);
            t.dispatchEvent(n)
        },
        trim: function(t) {
            return t.trim()
        },
        eventTriggered: function(t) {
            return !!t.currentTarget.dataset.triggered || (t.currentTarget.dataset.triggered = !0,
            !1)
        },
        remove: function(t) {
            t && t.parentNode && t.parentNode.removeChild(t)
        },
        find: function(t, e) {
            if (t = mUtil.get(t))
                return t.querySelector(e)
        },
        findAll: function(t, e) {
            if (t = mUtil.get(t))
                return t.querySelectorAll(e)
        },
        insertAfter: function(t, e) {
            return e.parentNode.insertBefore(t, e.nextSibling)
        },
        parents: function(t, e) {
            function a(t, e) {
                for (var a = 0, n = t.length; a < n; a++)
                    if (t[a] == e)
                        return !0;
                return !1
            }
            return function(t, e) {
                for (var n = document.querySelectorAll(e), o = t.parentNode; o && !a(n, o); )
                    o = o.parentNode;
                return o
            }(t, e)
        },
        children: function(t, e, a) {
            if (t && t.childNodes) {
                for (var n = [], o = 0, i = t.childNodes.length; o < i; ++o)
                    1 == t.childNodes[o].nodeType && mUtil.matches(t.childNodes[o], e, a) && n.push(t.childNodes[o]);
                return n
            }
        },
        child: function(t, e, a) {
            var n = mUtil.children(t, e, a);
            return n ? n[0] : null
        },
        matches: function(t, e, a) {
            var n = Element.prototype
              , o = n.matches || n.webkitMatchesSelector || n.mozMatchesSelector || n.msMatchesSelector || function(t) {
                return -1 !== [].indexOf.call(document.querySelectorAll(t), this)
            }
            ;
            return !(!t || !t.tagName) && o.call(t, e)
        },
        data: function(t) {
            if (!t) {
                console.error("Invalid input to data function: t is undefined or null");
                return null; // Return early if t is invalid
            }
        
            t = mUtil.get(t);
            if (!t) {
                console.error("mUtil.get returned undefined for input:", t);
                return null; // Return early if mUtil.get fails
            }
        
            return {
                set: function(e, a) {
                    if (typeof t.customDataTag === "undefined") {
                        mUtilElementDataStoreID++;
                        t.customDataTag = mUtilElementDataStoreID;
                    }
                    if (typeof mUtilElementDataStore[t.customDataTag] === "undefined") {
                        mUtilElementDataStore[t.customDataTag] = {};
                    }
                    mUtilElementDataStore[t.customDataTag][e] = a;
                },
                get: function(e) {
                    return this.has(e) ? mUtilElementDataStore[t.customDataTag][e] : null;
                },
                has: function(e) {
                    return (
                        t.customDataTag &&
                        mUtilElementDataStore[t.customDataTag] &&
                        mUtilElementDataStore[t.customDataTag][e]
                    );
                },
                remove: function(e) {
                    if (this.has(e)) {
                        delete mUtilElementDataStore[t.customDataTag][e];
                    }
                }
            };
        },
        outerWidth: function(t, e) {
            if (!0 === e) {
                var a = parseFloat(t.offsetWidth);
                return a += parseFloat(mUtil.css(t, "margin-left")) + parseFloat(mUtil.css(t, "margin-right")),
                parseFloat(a)
            }
            return a = parseFloat(t.offsetWidth)
        },
        offset: function(t) {
            var e, a;
            if (t = mUtil.get(t))
                return t.getClientRects().length ? (e = t.getBoundingClientRect(),
                a = t.ownerDocument.defaultView,
                {
                    top: e.top + a.pageYOffset,
                    left: e.left + a.pageXOffset
                }) : {
                    top: 0,
                    left: 0
                }
        },
        height: function(t) {
            return mUtil.css(t, "height")
        },
        visible: function(t) {
            return !(0 === t.offsetWidth && 0 === t.offsetHeight)
        },
        attr: function(t, e, a) {
            if (null != (t = mUtil.get(t)))
                return void 0 === a ? t.getAttribute(e) : void t.setAttribute(e, a)
        },
        hasAttr: function(t, e) {
            if (null != (t = mUtil.get(t)))
                return !!t.getAttribute(e)
        },
        removeAttr: function(t, e) {
            null != (t = mUtil.get(t)) && t.removeAttribute(e)
        },
        animate: function(t, e, a, n, o, i) {
            var l = {};
            if (l.linear = function(t, e, a, n) {
                return a * t / n + e
            }
            ,
            o = l.linear,
            "number" == typeof t && "number" == typeof e && "number" == typeof a && "function" == typeof n) {
                "function" != typeof i && (i = function() {}
                );
                var r = window.requestAnimationFrame || function(t) {
                    window.setTimeout(t, 20)
                }
                  , s = e - t;
                n(t);
                var d = window.performance && window.performance.now ? window.performance.now() : +new Date;
                r(function l(c) {
                    var m = (c || +new Date) - d;
                    m >= 0 && n(o(m, t, s, a)),
                    m >= 0 && m >= a ? (n(e),
                    i()) : r(l)
                })
            }
        },
        actualCss: function(t, e, a) {
            var n;
            if (t instanceof HTMLElement != !1)
                return t.getAttribute("m-hidden-" + e) && !1 !== a ? parseFloat(t.getAttribute("m-hidden-" + e)) : (t.style.cssText = "position: absolute; visibility: hidden; display: block;",
                "width" == e ? n = t.offsetWidth : "height" == e && (n = t.offsetHeight),
                t.style.cssText = "",
                t.setAttribute("m-hidden-" + e, n),
                parseFloat(n))
        },
        actualHeight: function(t, e) {
            return mUtil.actualCss(t, "height", e)
        },
        actualWidth: function(t, e) {
            return mUtil.actualCss(t, "width", e)
        },
        getScroll: function(t, e) {
            return e = "scroll" + e,
            t == window || t == document ? self["scrollTop" == e ? "pageYOffset" : "pageXOffset"] || browserSupportsBoxModel && document.documentElement[e] || document.body[e] : t[e]
        },
        css: function(t, e, a) {
            if (t = mUtil.get(t))
                if (void 0 !== a)
                    t.style[e] = a;
                else {
                    var n = (t.ownerDocument || document).defaultView;
                    if (n && n.getComputedStyle)
                        return e = e.replace(/([A-Z])/g, "-$1").toLowerCase(),
                        n.getComputedStyle(t, null).getPropertyValue(e);
                    if (t.currentStyle)
                        return e = e.replace(/\-(\w)/g, function(t, e) {
                            return e.toUpperCase()
                        }),
                        a = t.currentStyle[e],
                        /^\d+(em|pt|%|ex)?$/i.test(a) ? function(e) {
                            var a = t.style.left
                              , n = t.runtimeStyle.left;
                            return t.runtimeStyle.left = t.currentStyle.left,
                            t.style.left = e || 0,
                            e = t.style.pixelLeft + "px",
                            t.style.left = a,
                            t.runtimeStyle.left = n,
                            e
                        }(a) : a
                }
        },
        slide: function(t, e, a, n, o) {
            if (!(!t || "up" == e && !1 === mUtil.visible(t) || "down" == e && !0 === mUtil.visible(t))) {
                a = a || 600;
                var i = mUtil.actualHeight(t)
                  , l = !1
                  , r = !1;
                mUtil.css(t, "padding-top") && !0 !== mUtil.data(t).has("slide-padding-top") && mUtil.data(t).set("slide-padding-top", mUtil.css(t, "padding-top")),
                mUtil.css(t, "padding-bottom") && !0 !== mUtil.data(t).has("slide-padding-bottom") && mUtil.data(t).set("slide-padding-bottom", mUtil.css(t, "padding-bottom")),
                mUtil.data(t).has("slide-padding-top") && (l = parseInt(mUtil.data(t).get("slide-padding-top"))),
                mUtil.data(t).has("slide-padding-bottom") && (r = parseInt(mUtil.data(t).get("slide-padding-bottom"))),
                "up" == e ? (t.style.cssText = "display: block; overflow: hidden;",
                l && mUtil.animate(0, l, a, function(e) {
                    t.style.paddingTop = l - e + "px"
                }, "linear"),
                r && mUtil.animate(0, r, a, function(e) {
                    t.style.paddingBottom = r - e + "px"
                }, "linear"),
                mUtil.animate(0, i, a, function(e) {
                    t.style.height = i - e + "px"
                }, "linear", function() {
                    n(),
                    t.style.height = "",
                    t.style.display = "none"
                })) : "down" == e && (t.style.cssText = "display: block; overflow: hidden;",
                l && mUtil.animate(0, l, a, function(e) {
                    t.style.paddingTop = e + "px"
                }, "linear", function() {
                    t.style.paddingTop = ""
                }),
                r && mUtil.animate(0, r, a, function(e) {
                    t.style.paddingBottom = e + "px"
                }, "linear", function() {
                    t.style.paddingBottom = ""
                }),
                mUtil.animate(0, i, a, function(e) {
                    t.style.height = e + "px"
                }, "linear", function() {
                    n(),
                    t.style.height = "",
                    t.style.display = "",
                    t.style.overflow = ""
                }))
            }
        },
        slideUp: function(t, e, a) {
            mUtil.slide(t, "up", e, a)
        },
        slideDown: function(t, e, a) {
            mUtil.slide(t, "down", e, a)
        },
        show: function(t, e) {
            t.style.display = e || "block"
        },
        hide: function(t) {
            t.style.display = "none"
        },
        addEvent: function(t, e, a, n) {
            void 0 !== (t = mUtil.get(t)) && t.addEventListener(e, a)
        },
        removeEvent: function(t, e, a) {
            (t = mUtil.get(t)).removeEventListener(e, a)
        },
        on: function(t, e, a, n) {
            if (e) {
                var o = mUtil.getUniqueID("event");
                return mUtilDelegatedEventHandlers[o] = function(a) {
                    for (var o = t.querySelectorAll(e), i = a.target; i && i !== t; ) {
                        for (var l = 0, r = o.length; l < r; l++)
                            i === o[l] && n.call(i, a);
                        i = i.parentNode
                    }
                }
                ,
                mUtil.addEvent(t, a, mUtilDelegatedEventHandlers[o]),
                o
            }
        },
        off: function(t, e, a) {
            t && mUtilDelegatedEventHandlers[a] && (mUtil.removeEvent(t, e, mUtilDelegatedEventHandlers[a]),
            delete mUtilDelegatedEventHandlers[a])
        },
        one: function(t, e, a) {
            (t = mUtil.get(t)).addEventListener(e, function(t) {
                return t.target.removeEventListener(t.type, arguments.callee),
                a(t)
            })
        },
        hash: function(t) {
            var e, a = 0;
            if (0 === t.length)
                return a;
            for (e = 0; e < t.length; e++)
                a = (a << 5) - a + t.charCodeAt(e),
                a |= 0;
            return a
        },
        animateClass: function(t, e, a) {
            mUtil.addClass(t, "animated " + e),
            mUtil.one(t, "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                mUtil.removeClass(t, "animated " + e)
            }),
            a && mUtil.one(t.animationEnd, a)
        },
        animateDelay: function(t, e) {
            for (var a = ["webkit-", "moz-", "ms-", "o-", ""], n = 0; n < a.length; n++)
                mUtil.css(t, a[n] + "animation-delay", e)
        },
        animateDuration: function(t, e) {
            for (var a = ["webkit-", "moz-", "ms-", "o-", ""], n = 0; n < a.length; n++)
                mUtil.css(t, a[n] + "animation-duration", e)
        },
        scrollTo: function(t, e, a) {
            a = a || 500;
            var n, o, i = (t = mUtil.get(t)) ? mUtil.offset(t).top : 0, l = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            i > l ? (n = i,
            o = l) : (n = l,
            o = i),
            e && (o += e),
            mUtil.animate(n, o, a, function(t) {
                document.documentElement.scrollTop = t,
                document.body.parentNode.scrollTop = t,
                document.body.scrollTop = t
            })
        },
        scrollTop: function(t, e) {
            mUtil.scrollTo(null, t, e)
        },
        isArray: function(t) {
            return t && Array.isArray(t)
        },
        ready: function(t) {
            (document.attachEvent ? "complete" === document.readyState : "loading" !== document.readyState) ? t() : document.addEventListener("DOMContentLoaded", t)
        },
        isEmpty: function(t) {
            for (var e in t)
                if (t.hasOwnProperty(e))
                    return !1;
            return !0
        },
        numberString: function(t) {
            for (var e = (t += "").split("."), a = e[0], n = e.length > 1 ? "." + e[1] : "", o = /(\d+)(\d{3})/; o.test(a); )
                a = a.replace(o, "$1,$2");
            return a + n
        },
        detectIE: function() {
            var t = window.navigator.userAgent
              , e = t.indexOf("MSIE ");
            if (e > 0)
                return parseInt(t.substring(e + 5, t.indexOf(".", e)), 10);
            if (t.indexOf("Trident/") > 0) {
                var a = t.indexOf("rv:");
                return parseInt(t.substring(a + 3, t.indexOf(".", a)), 10)
            }
            var n = t.indexOf("Edge/");
            return n > 0 && parseInt(t.substring(n + 5, t.indexOf(".", n)), 10)
        },
        isRTL: function() {
            return "rtl" == mUtil.attr(mUtil.get("html"), "direction")
        },
        scrollerInit: function(t, e) {
            function a() {
                var a, n;
                n = e.height instanceof Function ? parseInt(e.height.call()) : parseInt(e.height),
                e.disableForMobile && mUtil.isInResponsiveRange("tablet-and-mobile") ? (a = mUtil.data(t).get("ps")) ? (e.resetHeightOnDestroy ? mUtil.css(t, "height", "auto") : (mUtil.css(t, "overflow", "auto"),
                n > 0 && mUtil.css(t, "height", n + "px")),
                a.destroy(),
                a = mUtil.data(t).remove("ps")) : n > 0 && (mUtil.css(t, "overflow", "auto"),
                mUtil.css(t, "height", n + "px")) : (n > 0 && mUtil.css(t, "height", n + "px"),
                mUtil.css(t, "overflow", "hidden"),
                (a = mUtil.data(t).get("ps")) ? a.update() : (mUtil.addClass(t, "m-scroller"),
                a = new PerfectScrollbar(t,{
                    wheelSpeed: .5,
                    swipeEasing: !0,
                    wheelPropagation: true,
                    minScrollbarLength: 40,
                    suppressScrollX: !mUtil.isRTL()
                }),
                mUtil.data(t).set("ps", a)))
            }
            a(),
            e.handleWindowResize && mUtil.addResizeHandler(function() {
                a()
            })
        },
        scrollerUpdate: function(t) {
            var e;
            (e = mUtil.data(t).get("ps")) && e.update()
        },
        scrollersUpdate: function(t) {
            for (var e = mUtil.findAll(t, ".ps"), a = 0, n = e.length; a < n; a++)
                mUtil.scrollerUpdate(e[a])
        },
        scrollerTop: function(t) {
            mUtil.data(t).get("ps") && (t.scrollTop = 0)
        },
        scrollerDestroy: function(t) {
            var e;
            (e = mUtil.data(t).get("ps")) && (e.destroy(),
            e = mUtil.data(t).remove("ps"))
        }
    }
}();
mUtil.ready(function() {
    mUtil.init()
});
var mApp = function() {
    var t = {
        brand: "#5d78ff",
        metal: "#c4c5d6",
        light: "#ffffff",
        accent: "#00c5dc",
        primary: "#5867dd",
        success: "#34bfa3",
        info: "#36a3f7",
        warning: "#ffb822",
        danger: "#f4516c",
        focus: "#8BC34A"
    }
      , e = function(t) {
        var e = t.data("skin") ? "m-tooltip--skin-" + t.data("skin") : ""
          , a = "auto" == t.data("width") ? "m-tooltop--auto-width" : ""
          , n = t.data("trigger") ? t.data("trigger") : "hover";
        t.data("placement") && t.data("placement");
        t.tooltip({
            trigger: n,
            template: '<div class="m-tooltip ' + e + " " + a + ' tooltip" role="tooltip">                <div class="arrow"></div>                <div class="tooltip-inner"></div>            </div>'
        })
    }
      , a = function() {
        $('[data-toggle="m-tooltip"]').each(function() {
            e($(this))
        })
    }
      , n = function(t) {
        var e = t.data("skin") ? "m-popover--skin-" + t.data("skin") : ""
          , a = t.data("trigger") ? t.data("trigger") : "hover";
        t.popover({
            trigger: a,
            template: '            <div class="m-popover ' + e + ' popover" role="tooltip">                <div class="arrow"></div>                <h3 class="popover-header"></h3>                <div class="popover-body"></div>            </div>'
        })
    }
      , o = function() {
        $('[data-toggle="m-popover"]').each(function() {
            n($(this))
        })
    }
      , i = function(t, e) {
        t = $(t),
        new mPortlet(t[0],e)
    }
      , l = function() {
        $('[m-portlet="true"]').each(function() {
            var t = $(this);
            !0 !== t.data("portlet-initialized") && (i(t, {}),
            t.data("portlet-initialized", !0))
        })
    }
      , r = function() {
        $("[data-tab-target]").each(function() {
            1 != $(this).data("tabs-initialized") && ($(this).click(function(t) {
                t.preventDefault();
                var e = $(this)
                  , a = e.closest('[data-tabs="true"]')
                  , n = $(a.data("tabs-contents"))
                  , o = $(e.data("tab-target"));
                a.find(".m-tabs__item.m-tabs__item--active").removeClass("m-tabs__item--active"),
                e.addClass("m-tabs__item--active"),
                n.find(".m-tabs-content__item.m-tabs-content__item--active").removeClass("m-tabs-content__item--active"),
                o.addClass("m-tabs-content__item--active")
            }),
            $(this).data("tabs-initialized", !0))
        })
    };
    return {
        init: function(e) {
            e && e.colors && (t = e.colors),
            mApp.initComponents()
        },
        initComponents: function() {
            jQuery.event.special.touchstart = {
                setup: function(t, e, a) {
                    "function" == typeof this && (e.includes("noPreventDefault") ? this.addEventListener("touchstart", a, {
                        passive: !1
                    }) : this.addEventListener("touchstart", a, {
                        passive: !0
                    }))
                }
            },
            jQuery.event.special.touchmove = {
                setup: function(t, e, a) {
                    "function" == typeof this && (e.includes("noPreventDefault") ? this.addEventListener("touchmove", a, {
                        passive: !1
                    }) : this.addEventListener("touchmove", a, {
                        passive: !0
                    }))
                }
            },
            jQuery.event.special.wheel = {
                setup: function(t, e, a) {
                    "function" == typeof this && (e.includes("noPreventDefault") ? this.addEventListener("wheel", a, {
                        passive: !1
                    }) : this.addEventListener("wheel", a, {
                        passive: !0
                    }))
                }
            },
            $('[data-scrollable="true"]').each(function() {
                var t = $(this);
                mUtil.scrollerInit(this, {
                    disableForMobile: !0,
                    handleWindowResize: !0,
                    height: function() {
                        return mUtil.isInResponsiveRange("tablet-and-mobile") && t.data("mobile-height") ? t.data("mobile-height") : t.data("height")
                    }
                })
            }),
            a(),
            o(),
            $("body").on("click", "[data-close=alert]", function() {
                $(this).closest(".alert").hide()
            }),
            l(),
            $(".custom-file-input").on("change", function() {
                var t = $(this).val();
                $(this).next(".custom-file-label").addClass("selected").html(t)
            }),
            r()
        },
        initCustomTabs: function() {
            r()
        },
        initTooltips: function() {
            a()
        },
        initTooltip: function(t) {
            e(t)
        },
        initPopovers: function() {
            o()
        },
        initPopover: function(t) {
            n(t)
        },
        initPortlet: function(t, e) {
            i(t, e)
        },
        initPortlets: function() {
            l()
        },
        block: function(t, e) {
            var a, n, o, i = $(t);
            if ("spinner" == (e = $.extend(!0, {
                opacity: .03,
                overlayColor: "#000000",
                state: "brand",
                type: "loader",
                size: "lg",
                centerX: !0,
                centerY: !0,
                message: "",
                shadow: !0,
                width: "auto"
            }, e)).type ? o = '<div class="m-spinner ' + (a = e.skin ? "m-spinner--skin-" + e.skin : "") + " " + (n = e.state ? "m-spinner--" + e.state : "") + '"></div' : (a = e.skin ? "m-loader--skin-" + e.skin : "",
            n = e.state ? "m-loader--" + e.state : "",
            size = e.size ? "m-loader--" + e.size : "",
            o = '<div class="m-loader ' + a + " " + n + " " + size + '"></div'),
            e.message && e.message.length > 0) {
                var l = "m-blockui " + (!1 === e.shadow ? "m-blockui-no-shadow" : "");
                html = '<div class="' + l + '"><span>' + e.message + "</span><span>" + o + "</span></div>";
                i = document.createElement("div");
                mUtil.get("body").prepend(i),
                mUtil.addClass(i, l),
                i.innerHTML = "<span>" + e.message + "</span><span>" + o + "</span>",
                e.width = mUtil.actualWidth(i) + 10,
                mUtil.remove(i),
                "body" == t && (html = '<div class="' + l + '" style="margin-left:-' + e.width / 2 + 'px;"><span>' + e.message + "</span><span>" + o + "</span></div>")
            } else
                html = o;
            var r = {
                message: html,
                centerY: e.centerY,
                centerX: e.centerX,
                css: {
                    top: "30%",
                    left: "50%",
                    border: "0",
                    padding: "0",
                    backgroundColor: "none",
                    width: e.width
                },
                overlayCSS: {
                    backgroundColor: e.overlayColor,
                    opacity: e.opacity,
                    cursor: "wait",
                    zIndex: "10"
                },
                onUnblock: function() {
                    i && i[0] && (mUtil.css(i[0], "position", ""),
                    mUtil.css(i[0], "zoom", ""))
                }
            };
            "body" == t ? (r.css.top = "50%",
            $.blockUI(r)) : (i = $(t)).block(r)
        },
        unblock: function(t) {
            t && "body" != t ? $(t).unblock() : $.unblockUI()
        },
        blockPage: function(t) {
            return mApp.block("body", t)
        },
        unblockPage: function() {
            return mApp.unblock("body")
        },
        progress: function(t, e) {
            var a = "m-loader m-loader--" + (e && e.skin ? e.skin : "light") + " m-loader--" + (e && e.alignment ? e.alignment : "right") + " m-loader--" + (e && e.size ? "m-spinner--" + e.size : "");
            mApp.unprogress(t),
            $(t).addClass(a),
            $(t).data("progress-classes", a)
        },
        unprogress: function(t) {
            $(t).removeClass($(t).data("progress-classes"))
        },
        getColor: function (e) {
            return t[e]
        }
    }
}();
$(document).ready(function() {
    mApp.init({})
}),
function(t) {
    var e = mUtil
      , a = mApp;
    if (void 0 === e)
        throw new Error("Util class is required and must be included before mDatatable");
    t.fn.mDatatable = function(n) {
        if (0 !== t(this).length) {
            var o = this;
            o.debug = !1,
            o.API = {
                record: null,
                value: null,
                params: null
            };
            var i = {
                isInit: !1,
                offset: 110,
                stateId: "meta",
                ajaxParams: {},
                init: function(e) {
                    var a = !1;
                    return null === e.data.source && (i.extractTable(),
                    a = !0),
                    i.setupBaseDOM.call(),
                    i.setupDOM(o.table),
                    i.spinnerCallback(!0),
                    i.setDataSourceQuery(i.getOption("data.source.read.params.query")),
                    t(o).on("m-datatable--on-layout-updated", i.afterRender),
                    o.debug && i.stateRemove(i.stateId),
                    t.each(i.getOption("extensions"), function(e, a) {
                        "function" == typeof t.fn.mDatatable[e] && new t.fn.mDatatable[e](o,a)
                    }),
                    "remote" !== e.data.type && "local" !== e.data.type || ((!1 === e.data.saveState || !1 === e.data.saveState.cookie && !1 === e.data.saveState.webstorage) && i.stateRemove(i.stateId),
                    "local" === e.data.type && "object" == typeof e.data.source && (o.dataSet = o.originalDataSet = i.dataMapCallback(e.data.source)),
                    i.dataRender()),
                    a || (i.setHeadTitle(),
                    i.getOption("layout.footer") && i.setHeadTitle(o.tableFoot)),
                    void 0 !== e.layout.header && !1 === e.layout.header && t(o.table).find("thead").remove(),
                    void 0 !== e.layout.footer && !1 === e.layout.footer && t(o.table).find("tfoot").remove(),
                    null !== e.data.type && "local" !== e.data.type || (i.setupCellField.call(),
                    i.setupTemplateCell.call(),
                    i.setupSubDatatable.call(),
                    i.setupSystemColumn.call(),
                    i.redraw()),
                    t(window).resize(i.fullRender),
                    t(o).height(""),
                    t(i.getOption("search.input")).on("keyup", function(e) {
                        i.getOption("search.onEnter") && 13 !== e.which || i.search(t(this).val())
                    }),
                    o
                },
                extractTable: function() {
                    var a = []
                      , i = t(o).find("tr:first-child th").get().map(function(e, o) {
                        var i = t(e).data("field");
                        void 0 === i && (i = t(e).text().trim());
                        var l = {
                            field: i,
                            title: i
                        };
                        for (var r in n.columns)
                            n.columns[r].field === i && (l = t.extend(!0, {}, n.columns[r], l));
                        return a.push(l),
                        i
                    });
                    n.columns = a;
                    var l = []
                      , r = [];
                    t(o).find("tr").each(function() {
                        t(this).find("td").length && l.push(t(this).prop("attributes"));
                        var a = {};
                        t(this).find("td").each(function(t, e) {
                            a[i[t]] = e.innerHTML.trim()
                        }),
                        e.isEmpty(a) || r.push(a)
                    }),
                    n.data.attr.rowProps = l,
                    n.data.source = r
                },
                layoutUpdate: function() {
                    i.setupSubDatatable.call(),
                    i.setupSystemColumn.call(),
                    i.setupHover.call(),
                    void 0 === n.detail && 1 === i.getDepth() && i.lockTable.call(),
                    i.columnHide.call(),
                    i.resetScroll(),
                    i.isInit || (t(o).trigger("m-datatable--on-init", {
                        table: t(o.wrap).attr("id"),
                        options: n
                    }),
                    i.isInit = !0),
                    t(o).trigger("m-datatable--on-layout-updated", {
                        table: t(o.wrap).attr("id")
                    })
                },
                lockTable: function() {
                    var e = {
                        lockEnabled: !1,
                        init: function() {
                            e.lockEnabled = i.lockEnabledColumns(),
                            0 === e.lockEnabled.left.length && 0 === e.lockEnabled.right.length || e.enable()
                        },
                        enable: function() {
                            t(o.table).find("thead,tbody,tfoot").each(function() {
                                var a = this;
                                0 === t(this).find(".m-datatable__lock").length && t(this).ready(function() {
                                    !function(a) {
                                        if (t(a).find(".m-datatable__lock").length > 0)
                                            i.log("Locked container already exist in: ", a);
                                        else if (0 !== t(a).find(".m-datatable__row").length) {
                                            var n = t("<div/>").addClass("m-datatable__lock m-datatable__lock--left")
                                              , l = t("<div/>").addClass("m-datatable__lock m-datatable__lock--scroll")
                                              , r = t("<div/>").addClass("m-datatable__lock m-datatable__lock--right");
                                            t(a).find(".m-datatable__row").each(function() {
                                                var e = t("<tr/>").addClass("m-datatable__row").appendTo(n)
                                                  , a = t("<tr/>").addClass("m-datatable__row").appendTo(l)
                                                  , o = t("<tr/>").addClass("m-datatable__row").appendTo(r);
                                                t(this).find(".m-datatable__cell").each(function() {
                                                    var n = t(this).data("locked");
                                                    void 0 !== n ? (void 0 === n.left && !0 !== n || t(this).appendTo(e),
                                                    void 0 !== n.right && t(this).appendTo(o)) : t(this).appendTo(a)
                                                }),
                                                t(this).remove()
                                            }),
                                            e.lockEnabled.left.length > 0 && (t(o.wrap).addClass("m-datatable--lock"),
                                            t(n).appendTo(a)),
                                            (e.lockEnabled.left.length > 0 || e.lockEnabled.right.length > 0) && t(l).appendTo(a),
                                            e.lockEnabled.right.length > 0 && (t(o.wrap).addClass("m-datatable--lock"),
                                            t(r).appendTo(a))
                                        } else
                                            i.log("No row exist in: ", a)
                                    }(a)
                                })
                            })
                        }
                    };
                    return e.init(),
                    e
                },
                fullRender: function() {
                    i.isLocked() && (t(o.tableHead).empty(),
                    i.setHeadTitle(),
                    i.getOption("layout.footer") && (t(o.tableFoot).empty(),
                    i.setHeadTitle(o.tableFoot)),
                    i.spinnerCallback(!0),
                    t(o.wrap).removeClass("m-datatable--loaded"),
                    i.insertData())
                },
                lockEnabledColumns: function() {
                    var a = t(window).width()
                      , o = n.columns
                      , i = {
                        left: [],
                        right: []
                    };
                    return t.each(o, function(t, n) {
                        void 0 !== n.locked && (void 0 !== n.locked.left && e.getBreakpoint(n.locked.left) <= a && i.left.push(n.locked.left),
                        void 0 !== n.locked.right && e.getBreakpoint(n.locked.right) <= a && i.right.push(n.locked.right))
                    }),
                    i
                },
                afterRender: function(e, a) {
                    a.table == t(o.wrap).attr("id") && t(o).ready(function() {
                        i.isLocked() || (i.redraw(),
                        i.getOption("rows.autoHide") && (i.autoHide(),
                        t(o.table).find(".m-datatable__row").css("height", ""))),
                        i.rowEvenOdd.call(),
                        i.isLocked() && i.redraw(),
                        t(o.tableBody).css("visibility", ""),
                        t(o.wrap).addClass("m-datatable--loaded"),
                        i.scrollbar.call(),
                        i.spinnerCallback(!1),
                        i.sorting.call()
                    })
                },
                hoverTimer: 0,
                isScrolling: !1,
                setupHover: function() {
                    t(window).scroll(function(t) {
                        clearTimeout(i.hoverTimer),
                        i.isScrolling = !0
                    }),
                    t(o.tableBody).find(".m-datatable__cell").off("mouseenter", "mouseleave").on("mouseenter", function() {
                        if (i.hoverTimer = setTimeout(function() {
                            i.isScrolling = !1
                        }, 200),
                        !i.isScrolling) {
                            var e = t(this).closest(".m-datatable__row").addClass("m-datatable__row--hover")
                              , a = t(e).index() + 1;
                            t(e).closest(".m-datatable__lock").parent().find(".m-datatable__row:nth-child(" + a + ")").addClass("m-datatable__row--hover")
                        }
                    }).on("mouseleave", function() {
                        var e = t(this).closest(".m-datatable__row").removeClass("m-datatable__row--hover")
                          , a = t(e).index() + 1;
                        t(e).closest(".m-datatable__lock").parent().find(".m-datatable__row:nth-child(" + a + ")").removeClass("m-datatable__row--hover")
                    })
                },
                adjustLockContainer: function() {
                    if (!i.isLocked())
                        return 0;
                    var e = t(o.tableHead).width()
                      , a = t(o.tableHead).find(".m-datatable__lock--left").width()
                      , n = t(o.tableHead).find(".m-datatable__lock--right").width();
                    void 0 === a && (a = 0),
                    void 0 === n && (n = 0);
                    var l = Math.floor(e - a - n);
                    return t(o.table).find(".m-datatable__lock--scroll").css("width", l),
                    l
                },
                dragResize: function() {
                    var e, a, n = !1, i = void 0;
                    t(o.tableHead).find(".m-datatable__cell").mousedown(function(o) {
                        i = t(this),
                        n = !0,
                        e = o.pageX,
                        a = t(this).width(),
                        t(i).addClass("m-datatable__cell--resizing")
                    }).mousemove(function(l) {
                        if (n) {
                            var r = t(i).index()
                              , s = t(o.tableBody)
                              , d = t(i).closest(".m-datatable__lock");
                            if (d) {
                                var c = t(d).index();
                                s = t(o.tableBody).find(".m-datatable__lock").eq(c)
                            }
                            t(s).find(".m-datatable__row").each(function(n, o) {
                                t(o).find(".m-datatable__cell").eq(r).width(a + (l.pageX - e)).children().width(a + (l.pageX - e))
                            }),
                            t(i).children().css("width", a + (l.pageX - e))
                        }
                    }).mouseup(function() {
                        t(i).removeClass("m-datatable__cell--resizing"),
                        n = !1
                    }),
                    t(document).mouseup(function() {
                        t(i).removeClass("m-datatable__cell--resizing"),
                        n = !1
                    })
                },
                initHeight: function() {
                    if (n.layout.height && n.layout.scroll) {
                        var e = t(o.tableHead).find(".m-datatable__row").height()
                          , a = t(o.tableFoot).find(".m-datatable__row").height()
                          , i = n.layout.height;
                        e > 0 && (i -= e),
                        a > 0 && (i -= a),
                        t(o.tableBody).css("max-height", i),
                        t(o.tableBody).find(".m-datatable__lock--scroll").css("height", i)
                    }
                },
                setupBaseDOM: function() {
                    o.initialDatatable = t(o).clone(),
                    "TABLE" === t(o).prop("tagName") ? (o.table = t(o).removeClass("m-datatable").addClass("m-datatable__table"),
                    0 === t(o.table).parents(".m-datatable").length && (o.table.wrap(t("<div/>").addClass("m-datatable").addClass("m-datatable--" + n.layout.theme)),
                    o.wrap = t(o.table).parent())) : (o.wrap = t(o).addClass("m-datatable").addClass("m-datatable--" + n.layout.theme),
                    o.table = t("<table/>").addClass("m-datatable__table").appendTo(o)),
                    void 0 !== n.layout.class && t(o.wrap).addClass(n.layout.class),
                    t(o.table).removeClass("m-datatable--destroyed").css("display", "block"),
                    void 0 === t(o).attr("id") && (i.setOption("data.saveState", !1),
                    t(o.table).attr("id", e.getUniqueID("m-datatable--"))),
                    i.getOption("layout.minHeight") && t(o.table).css("min-height", i.getOption("layout.minHeight")),
                    i.getOption("layout.height") && t(o.table).css("max-height", i.getOption("layout.height")),
                    null === n.data.type && t(o.table).css("width", "").css("display", ""),
                    o.tableHead = t(o.table).find("thead"),
                    0 === t(o.tableHead).length && (o.tableHead = t("<thead/>").prependTo(o.table)),
                    o.tableBody = t(o.table).find("tbody"),
                    0 === t(o.tableBody).length && (o.tableBody = t("<tbody/>").appendTo(o.table)),
                    void 0 !== n.layout.footer && n.layout.footer && (o.tableFoot = t(o.table).find("tfoot"),
                    0 === t(o.tableFoot).length && (o.tableFoot = t("<tfoot/>").appendTo(o.table)))
                },
                setupCellField: function(e) {
                    void 0 === e && (e = t(o.table).children());
                    var a = n.columns;
                    t.each(e, function(e, n) {
                        t(n).find(".m-datatable__row").each(function(e, n) {
                            t(n).find(".m-datatable__cell").each(function(e, n) {
                                void 0 !== a[e] && t(n).data(a[e])
                            })
                        })
                    })
                },
                setupTemplateCell: function(e) {
                    void 0 === e && (e = o.tableBody);
                    var a = n.columns;
                    t(e).find(".m-datatable__row").each(function(e, n) {
                        var l = t(n).data("obj") || {}
                          , r = i.getOption("rows.callback");
                        "function" == typeof r && r(t(n), l, e);
                        var s = i.getOption("rows.beforeTemplate");
                        "function" == typeof s && s(t(n), l, e),
                        void 0 === l && (l = {},
                        t(n).find(".m-datatable__cell").each(function(e, n) {
                            var o = t.grep(a, function(e, a) {
                                return t(n).data("field") === e.field
                            })[0];
                            void 0 !== o && (l[o.field] = t(n).text())
                        })),
                        t(n).find(".m-datatable__cell").each(function(n, r) {
                            var s = t.grep(a, function(e, a) {
                                return t(r).data("field") === e.field
                            })[0];
                            if (void 0 !== s && void 0 !== s.template) {
                                var d = "";
                                "string" == typeof s.template && (d = i.dataPlaceholder(s.template, l)),
                                "function" == typeof s.template && (d = s.template(l, e, o));
                                var c = document.createElement("span");
                                c.innerHTML = d,
                                t(r).html(c),
                                void 0 !== s.overflow && (t(c).css("overflow", s.overflow),
                                t(c).css("position", "relative"))
                            }
                        });
                        var d = i.getOption("rows.afterTemplate");
                        "function" == typeof d && d(t(n), l, e)
                    })
                },
                setupSystemColumn: function() {
                    if (o.dataSet = o.dataSet || [],
                    0 !== o.dataSet.length) {
                        var e = n.columns;
                        t(o.tableBody).find(".m-datatable__row").each(function(a, n) {
                            t(n).find(".m-datatable__cell").each(function(a, n) {
                                var o = t.grep(e, function(e, a) {
                                    return t(n).data("field") === e.field
                                })[0];
                                if (void 0 !== o) {
                                    var l = t(n).text();
                                    if (void 0 !== o.selector && !1 !== o.selector) {
                                        if (t(n).find('.m-checkbox [type="checkbox"]').length > 0)
                                            return;
                                        t(n).addClass("m-datatable__cell--check");
                                        var r = t("<label/>").addClass("m-checkbox m-checkbox--single").append(t("<input/>").attr("type", "checkbox").attr("value", l).on("click", function() {
                                            t(this).is(":checked") ? i.setActive(this) : i.setInactive(this)
                                        })).append("&nbsp;<span></span>");
                                        void 0 !== o.selector.class && t(r).addClass(o.selector.class),
                                        t(n).children().html(r)
                                    }
                                    if (void 0 !== o.subtable && o.subtable) {
                                        if (t(n).find(".m-datatable__toggle-subtable").length > 0)
                                            return;
                                        t(n).children().html(t("<a/>").addClass("m-datatable__toggle-subtable").attr("href", "#").attr("data-value", l).append(t("<i/>").addClass(i.getOption("layout.icons.rowDetail.collapse"))))
                                    }
                                }
                            })
                        });
                        var a = function(a) {
                            var n = t.grep(e, function(t, e) {
                                return void 0 !== t.selector && !1 !== t.selector
                            })[0];
                            if (void 0 !== n && void 0 !== n.selector && !1 !== n.selector) {
                                var o = t(a).find('[data-field="' + n.field + '"]');
                                if (t(o).find('.m-checkbox [type="checkbox"]').length > 0)
                                    return;
                                t(o).addClass("m-datatable__cell--check");
                                var l = t("<label/>").addClass("m-checkbox m-checkbox--single m-checkbox--all").append(t("<input/>").attr("type", "checkbox").on("click", function() {
                                    t(this).is(":checked") ? i.setActiveAll(!0) : i.setActiveAll(!1)
                                })).append("&nbsp;<span></span>");
                                void 0 !== n.selector.class && t(l).addClass(n.selector.class),
                                t(o).children().html(l)
                            }
                        };
                        n.layout.header && a(t(o.tableHead).find(".m-datatable__row").first()),
                        n.layout.footer && a(t(o.tableFoot).find(".m-datatable__row").first())
                    }
                },
                adjustCellsWidth: function() {
                    var e = t(o.tableHead).width()
                      , a = t(o.tableHead).find(".m-datatable__row:first-child").find(".m-datatable__cell:visible").length;
                    if (a > 0) {
                        e -= 20 * a;
                        var n = Math.floor(e / a);
                        n <= i.offset && (n = i.offset),
                        t(o.table).find(".m-datatable__row").find(".m-datatable__cell:visible").each(function(e, a) {
                            var o = n
                              , i = t(a).data("width");
                            void 0 !== i && (o = i),
                            t(a).children().css("width", parseInt(o))
                        })
                    }
                    return o
                },
                adjustCellsHeight: function() {
                    t.each(t(o.table).children(), function(e, a) {
                        for (var n = t(a).find(".m-datatable__row").first().parent().find(".m-datatable__row").length, o = 1; o <= n; o++) {
                            var i = t(a).find(".m-datatable__row:nth-child(" + o + ")");
                            if (t(i).length > 0) {
                                var l = Math.max.apply(null, t(i).map(function() {
                                    return t(this).height()
                                }).get());
                                t(i).css("height", Math.ceil(parseInt(l)))
                            }
                        }
                    })
                },
                setupDOM: function(e) {
                    t(e).find("> thead").addClass("m-datatable__head"),
                    t(e).find("> tbody").addClass("m-datatable__body"),
                    t(e).find("> tfoot").addClass("m-datatable__foot"),
                    t(e).find("tr").addClass("m-datatable__row"),
                    t(e).find("tr > th, tr > td").addClass("m-datatable__cell"),
                    t(e).find("tr > th, tr > td").each(function(e, a) {
                        0 === t(a).find("span").length && t(a).wrapInner(t("<span/>").css("width", i.offset))
                    })
                },
                scrollbar: function() {
                    var a = {
                        scrollable: null,
                        tableLocked: null,
                        mcsOptions: {
                            scrollInertia: 0,
                            autoDraggerLength: !0,
                            autoHideScrollbar: !0,
                            autoExpandScrollbar: !1,
                            alwaysShowScrollbar: 0,
                            mouseWheel: {
                                scrollAmount: 120,
                                preventDefault: !1
                            },
                            advanced: {
                                updateOnContentResize: !0,
                                autoExpandHorizontalScroll: !0
                            },
                            theme: "minimal-dark"
                        },
                        init: function() {
                            var l = e.getViewPort().width;
                            if (n.layout.scroll) {
                                t(o.wrap).addClass("m-datatable--scroll");
                                var r = t(o.tableBody).find(".m-datatable__lock--scroll");
                                t(r).find(".m-datatable__row").length > 0 && t(r).length > 0 ? (a.scrollHead = t(o.tableHead).find("> .m-datatable__lock--scroll > .m-datatable__row"),
                                a.scrollFoot = t(o.tableFoot).find("> .m-datatable__lock--scroll > .m-datatable__row"),
                                a.tableLocked = t(o.tableBody).find(".m-datatable__lock:not(.m-datatable__lock--scroll)"),
                                i.getOption("layout.customScrollbar") && 10 != e.detectIE() && l > e.getBreakpoint("lg") ? a.initCustomScrollbar(r[0]) : a.initDefaultScrollbar(r)) : t(o.tableBody).find(".m-datatable__row").length > 0 && (a.scrollHead = t(o.tableHead).find("> .m-datatable__row"),
                                a.scrollFoot = t(o.tableFoot).find("> .m-datatable__row"),
                                i.getOption("layout.customScrollbar") && 10 != e.detectIE() && l > e.getBreakpoint("lg") ? a.initCustomScrollbar(o.tableBody) : a.initDefaultScrollbar(o.tableBody))
                            } else
                                t(o.table).css("overflow-x", "auto")
                        },
                        initDefaultScrollbar: function(e) {
                            t(e).css("overflow", "auto").off().on("scroll", a.onScrolling)
                        },
                        onScrolling: function(e) {
                            var n = t(this).scrollLeft()
                              , o = t(this).scrollTop();
                            t(a.scrollHead).css("left", -n),
                            t(a.scrollFoot).css("left", -n),
                            t(a.tableLocked).each(function(e, a) {
                                t(a).css("top", -o)
                            })
                        },
                        initCustomScrollbar: function(e) {
                            a.scrollable = e,
                            i.initScrollbar(e),
                            t(e).off().on("scroll", a.onScrolling)
                        }
                    };
                    return a.init(),
                    a
                },
                initScrollbar: function(a, n) {
                    if (t(o.tableBody).css("overflow", ""),
                    e.hasClass(a, "ps"))
                        t(a).data("ps").update();
                    else {
                        var i = new PerfectScrollbar(a);
                        t(a).data("ps", i)
                    }
                },
                setHeadTitle: function(a) {
                    void 0 === a && (a = o.tableHead),
                    a = t(a)[0];
                    var l = n.columns
                      , r = a.getElementsByTagName("tr")[0]
                      , s = a.getElementsByTagName("td");
                    void 0 === r && (r = document.createElement("tr"),
                    a.appendChild(r)),
                    t.each(l, function(a, n) {
                        var i = s[a];
                        if (void 0 === i && (i = document.createElement("th"),
                        r.appendChild(i)),
                        void 0 !== n.title && (i.innerHTML = n.title,
                        i.setAttribute("data-field", n.field),
                        e.addClass(i, n.class),
                        t(i).data(n)),
                        void 0 !== n.attr && t.each(n.attr, function(t, e) {
                            i.setAttribute(t, e)
                        }),
                        void 0 !== n.textAlign) {
                            var l = void 0 !== o.textAlign[n.textAlign] ? o.textAlign[n.textAlign] : "";
                            e.addClass(i, l)
                        }
                    }),
                    i.setupDOM(a)
                },
                dataRender: function(e) {
                    t(o.table).siblings(".m-datatable__pager").removeClass("m-datatable--paging-loaded");
                    var a = function() {
                        o.dataSet = o.dataSet || [],
                        i.localDataUpdate();
                        var e = i.getDataSourceParam("pagination");
                        0 === e.perpage && (e.perpage = n.data.pageSize || 10),
                        e.total = o.dataSet.length;
                        var a = Math.max(e.perpage * (e.page - 1), 0)
                          , l = Math.min(a + e.perpage, e.total);
                        return o.dataSet = t(o.dataSet).slice(a, l),
                        e
                    }
                      , l = function(e) {
                        var l = function(e, a) {
                            t(e.pager).hasClass("m-datatable--paging-loaded") || (t(e.pager).remove(),
                            e.init(a)),
                            t(e.pager).off().on("m-datatable--on-goto-page", function(n) {
                                t(e.pager).remove(),
                                e.init(a)
                            });
                            var n = Math.max(a.perpage * (a.page - 1), 0)
                              , l = Math.min(n + a.perpage, a.total);
                            i.localDataUpdate(),
                            o.dataSet = t(o.dataSet).slice(n, l),
                            i.insertData()
                        };
                        if (t(o.wrap).removeClass("m-datatable--error"),
                        n.pagination)
                            if (n.data.serverPaging && "local" !== n.data.type) {
                                var r = i.getObject("meta", e || null);
                                null !== r ? i.paging(r) : i.paging(a(), l)
                            } else
                                i.paging(a(), l);
                        else
                            i.localDataUpdate();
                        i.insertData()
                    };
                    "local" === n.data.type || !1 === n.data.serverSorting && "sort" === e || !1 === n.data.serverFiltering && "search" === e ? l() : i.getData().done(l)
                },
                insertData: function() {
                    o.dataSet = o.dataSet || [];
                    var a = i.getDataSourceParam()
                      , l = a.pagination
                      , r = (Math.max(l.page, 1) - 1) * l.perpage
                      , s = Math.min(l.page, l.pages) * l.perpage
                      , d = {};
                    void 0 !== n.data.attr.rowProps && n.data.attr.rowProps.length && (d = n.data.attr.rowProps.slice(r, s));
                    var c = document.createElement("tbody");
                    c.style.visibility = "hidden";
                    var m = n.columns.length;
                    if (t.each(o.dataSet, function(l, r) {
                        var s = document.createElement("tr");
                        s.setAttribute("data-row", l),
                        t(s).data("obj", r),
                        void 0 !== d[l] && t.each(d[l], function() {
                            s.setAttribute(this.name, this.value)
                        });
                        for (var u = 0; u < m; u += 1) {
                            var p = n.columns[u]
                              , f = [];
                            if (i.getObject("sort.field", a) === p.field && f.push("m-datatable__cell--sorted"),
                            void 0 !== p.textAlign) {
                                var g = void 0 !== o.textAlign[p.textAlign] ? o.textAlign[p.textAlign] : "";
                                f.push(g)
                            }
                            void 0 !== p.class && f.push(p.class);
                            var h = document.createElement("td");
                            e.addClass(h, f.join(" ")),
                            h.setAttribute("data-field", p.field),
                            h.innerHTML = i.getObject(p.field, r),
                            s.appendChild(h)
                        }
                        c.appendChild(s)
                    }),
                    0 === o.dataSet.length) {
                        var u = document.createElement("span");
                        e.addClass(u, "m-datatable--error"),
                        u.innerHTML = i.getOption("translate.records.noRecords"),
                        c.appendChild(u),
                        t(o.wrap).addClass("m-datatable--error m-datatable--loaded"),
                        i.spinnerCallback(!1)
                    }
                    t(o.tableBody).replaceWith(c),
                    o.tableBody = c,
                    i.setupDOM(o.table),
                    i.setupCellField([o.tableBody]),
                    i.setupTemplateCell(o.tableBody),
                    i.layoutUpdate()
                },
                updateTableComponents: function() {
                    o.tableHead = t(o.table).children("thead"),
                    o.tableBody = t(o.table).children("tbody"),
                    o.tableFoot = t(o.table).children("tfoot")
                },
                getData: function() {
                    i.spinnerCallback(!0);
                    var e = {
                        dataType: "json",
                        method: "GET",
                        data: {},
                        timeout: i.getOption("data.source.read.timeout") || 3e4
                    };
                    if ("local" === n.data.type && (e.url = n.data.source),
                    "remote" === n.data.type) {
                        e.url = i.getOption("data.source.read.url"),
                        "string" != typeof e.url && (e.url = i.getOption("data.source.read")),
                        "string" != typeof e.url && (e.url = i.getOption("data.source")),
                        e.headers = i.getOption("data.source.read.headers"),
                        e.method = i.getOption("data.source.read.method") || "POST";
                        var a = i.getDataSourceParam();
                        i.getOption("data.serverPaging") || delete a.pagination,
                        i.getOption("data.serverSorting") || delete a.sort,
                        e.data = t.extend({}, e.data, a, i.getOption("data.source.read.params"))
                    }
                    return t.ajax(e).done(function(e, a, n) {
                        o.lastResponse = e,
                        o.dataSet = o.originalDataSet = i.dataMapCallback(e),
                        i.setAutoColumns(),
                        t(o).trigger("m-datatable--on-ajax-done", [o.dataSet])
                    }).fail(function(e, a, n) {
                        t(o).trigger("m-datatable--on-ajax-fail", [e]),
                        t(o.tableBody).html(t("<span/>").addClass("m-datatable--error").html(i.getOption("translate.records.noRecords"))),
                        t(o.wrap).addClass("m-datatable--error m-datatable--loaded"),
                        i.spinnerCallback(!1)
                    }).always(function() {})
                },
                paging: function(a, n) {
                    var l = {
                        meta: null,
                        pager: null,
                        paginateEvent: null,
                        pagerLayout: {
                            pagination: null,
                            info: null
                        },
                        callback: null,
                        init: function(e) {
                            l.meta = e,
                            l.meta.page = parseInt(l.meta.page),
                            l.meta.pages = parseInt(l.meta.pages),
                            l.meta.perpage = parseInt(l.meta.perpage),
                            l.meta.total = parseInt(l.meta.total),
                            l.meta.pages = Math.max(Math.ceil(l.meta.total / l.meta.perpage), 1),
                            l.meta.page > l.meta.pages && (l.meta.page = l.meta.pages),
                            l.paginateEvent = i.getTablePrefix(),
                            l.pager = t(o.table).siblings(".m-datatable__pager"),
                            t(l.pager).hasClass("m-datatable--paging-loaded") || (t(l.pager).remove(),
                            0 !== l.meta.pages && (i.setDataSourceParam("pagination", {
                                page: l.meta.page,
                                pages: l.meta.pages,
                                perpage: l.meta.perpage,
                                total: l.meta.total
                            }),
                            l.callback = l.serverCallback,
                            "function" == typeof n && (l.callback = n),
                            l.addPaginateEvent(),
                            l.populate(),
                            l.meta.page = Math.max(l.meta.page || 1, l.meta.page),
                            t(o).trigger(l.paginateEvent, l.meta),
                            l.pagingBreakpoint.call(),
                            t(window).resize(l.pagingBreakpoint)))
                        },
                        serverCallback: function(t, e) {
                            i.dataRender()
                        },
                        populate: function() {
                            var e = i.getOption("layout.icons.pagination")
                              , a = i.getOption("translate.toolbar.pagination.items.default");
                            l.pager = t("<div/>").addClass("m-datatable__pager m-datatable--paging-loaded clearfix");
                            var n = t("<ul/>").addClass("m-datatable__pager-nav");
                            l.pagerLayout.pagination = n,
                            t("<li/>").append(t("<a/>").attr("title", a.first).addClass("m-datatable__pager-link m-datatable__pager-link--first").append(t("<i/>").addClass(e.first)).on("click", l.gotoMorePage).attr("data-page", 1)).appendTo(n),
                            t("<li/>").append(t("<a/>").attr("title", a.prev).addClass("m-datatable__pager-link m-datatable__pager-link--prev").append(t("<i/>").addClass(e.prev)).on("click", l.gotoMorePage)).appendTo(n),
                            t("<li/>").append(t("<a/>").attr("title", a.more).addClass("m-datatable__pager-link m-datatable__pager-link--more-prev").html(t("<i/>").addClass(e.more)).on("click", l.gotoMorePage)).appendTo(n),
                            t("<li/>").append(t("<input/>").attr("type", "text").addClass("m-pager-input form-control").attr("title", a.input).on("keyup", function() {
                                t(this).attr("data-page", Math.abs(t(this).val()))
                            }).on("keypress", function(t) {
                                13 === t.which && l.gotoMorePage(t)
                            })).appendTo(n);
                            var r = i.getOption("toolbar.items.pagination.pages.desktop.pagesNumber")
                              , s = Math.ceil(l.meta.page / r) * r
                              , d = s - r;
                            s > l.meta.pages && (s = l.meta.pages);
                            for (var c = d; c < s; c++) {
                                var m = c + 1;
                                t("<li/>").append(t("<a/>").addClass("m-datatable__pager-link m-datatable__pager-link-number").text(m).attr("data-page", m).attr("title", m).on("click", l.gotoPage)).appendTo(n)
                            }
                            t("<li/>").append(t("<a/>").attr("title", a.more).addClass("m-datatable__pager-link m-datatable__pager-link--more-next").html(t("<i/>").addClass(e.more)).on("click", l.gotoMorePage)).appendTo(n),
                            t("<li/>").append(t("<a/>").attr("title", a.next).addClass("m-datatable__pager-link m-datatable__pager-link--next").append(t("<i/>").addClass(e.next)).on("click", l.gotoMorePage)).appendTo(n),
                            t("<li/>").append(t("<a/>").attr("title", a.last).addClass("m-datatable__pager-link m-datatable__pager-link--last").append(t("<i/>").addClass(e.last)).on("click", l.gotoMorePage).attr("data-page", l.meta.pages)).appendTo(n),
                            i.getOption("toolbar.items.info") && (l.pagerLayout.info = t("<div/>").addClass("m-datatable__pager-info").append(t("<span/>").addClass("m-datatable__pager-detail"))),
                            t.each(i.getOption("toolbar.layout"), function(e, a) {
                                t(l.pagerLayout[a]).appendTo(l.pager)
                            });
                            var u = t("<select/>").addClass("selectpicker m-datatable__pager-size").attr("title", i.getOption("translate.toolbar.pagination.items.default.select")).attr("data-width", "70px").val(l.meta.perpage).on("change", l.updatePerpage).prependTo(l.pagerLayout.info)
                              , p = i.getOption("toolbar.items.pagination.pageSizeSelect");
                            0 == p.length && (p = [10, 20, 30, 50, 100]),
                            t.each(p, function(e, a) {
                                var n = a;
                                -1 === a && (n = "All"),
                                t("<option/>").attr("value", a).html(n).appendTo(u)
                            }),
                            t(o).ready(function() {
                                t(".selectpicker").selectpicker().siblings(".dropdown-toggle").attr("title", i.getOption("translate.toolbar.pagination.items.default.select"))
                            }),
                            l.paste()
                        },
                        paste: function() {
                            t.each(t.unique(i.getOption("toolbar.placement")), function(e, a) {
                                "bottom" === a && t(l.pager).clone(!0).insertAfter(o.table),
                                "top" === a && t(l.pager).clone(!0).addClass("m-datatable__pager--top").insertBefore(o.table)
                            })
                        },
                        gotoMorePage: function(e) {
                            if (e.preventDefault(),
                            "disabled" === t(this).attr("disabled"))
                                return !1;
                            var a = t(this).attr("data-page");
                            return void 0 === a && (a = t(e.target).attr("data-page")),
                            l.openPage(parseInt(a)),
                            !1
                        },
                        gotoPage: function(e) {
                            e.preventDefault(),
                            t(this).hasClass("m-datatable__pager-link--active") || l.openPage(parseInt(t(this).data("page")))
                        },
                        openPage: function(e) {
                            l.meta.page = parseInt(e),
                            t(o).trigger(l.paginateEvent, l.meta),
                            l.callback(l, l.meta),
                            t(l.pager).trigger("m-datatable--on-goto-page", l.meta)
                        },
                        updatePerpage: function(e) {
                            e.preventDefault(),
                            l.pager = t(o.table).siblings(".m-datatable__pager").removeClass("m-datatable--paging-loaded"),
                            e.originalEvent && (l.meta.perpage = parseInt(t(this).val())),
                            t(l.pager).find("select.m-datatable__pager-size").val(l.meta.perpage).attr("data-selected", l.meta.perpage),
                            i.setDataSourceParam("pagination", {
                                page: l.meta.page,
                                pages: l.meta.pages,
                                perpage: l.meta.perpage,
                                total: l.meta.total
                            }),
                            t(l.pager).trigger("m-datatable--on-update-perpage", l.meta),
                            t(o).trigger(l.paginateEvent, l.meta),
                            l.callback(l, l.meta),
                            l.updateInfo.call()
                        },
                        addPaginateEvent: function(e) {
                            t(o).off(l.paginateEvent).on(l.paginateEvent, function(e, a) {
                                i.spinnerCallback(!0),
                                l.pager = t(o.table).siblings(".m-datatable__pager");
                                var n = t(l.pager).find(".m-datatable__pager-nav");
                                t(n).find(".m-datatable__pager-link--active").removeClass("m-datatable__pager-link--active"),
                                t(n).find('.m-datatable__pager-link-number[data-page="' + a.page + '"]').addClass("m-datatable__pager-link--active"),
                                t(n).find(".m-datatable__pager-link--prev").attr("data-page", Math.max(a.page - 1, 1)),
                                t(n).find(".m-datatable__pager-link--next").attr("data-page", Math.min(a.page + 1, a.pages)),
                                t(l.pager).each(function() {
                                    t(this).find('.m-pager-input[type="text"]').prop("value", a.page)
                                }),
                                t(l.pager).find(".m-datatable__pager-nav").show(),
                                a.pages <= 1 && t(l.pager).find(".m-datatable__pager-nav").hide(),
                                i.setDataSourceParam("pagination", {
                                    page: l.meta.page,
                                    pages: l.meta.pages,
                                    perpage: l.meta.perpage,
                                    total: l.meta.total
                                }),
                                t(l.pager).find("select.m-datatable__pager-size").val(a.perpage).attr("data-selected", a.perpage),
                                t(o.table).find('.m-checkbox > [type="checkbox"]').prop("checked", !1),
                                t(o.table).find(".m-datatable__row--active").removeClass("m-datatable__row--active"),
                                l.updateInfo.call(),
                                l.pagingBreakpoint.call()
                            })
                        },
                        updateInfo: function() {
                            var e = Math.max(l.meta.perpage * (l.meta.page - 1) + 1, 1)
                              , a = Math.min(e + l.meta.perpage - 1, l.meta.total);
                            t(l.pager).find(".m-datatable__pager-info").find(".m-datatable__pager-detail").html(i.dataPlaceholder(i.getOption("translate.toolbar.pagination.items.info"), {
                                start: e,
                                end: -1 === l.meta.perpage ? l.meta.total : a,
                                pageSize: -1 === l.meta.perpage || l.meta.perpage >= l.meta.total ? l.meta.total : l.meta.perpage,
                                total: l.meta.total
                            }))
                        },
                        pagingBreakpoint: function() {
                            var a = t(o.table).siblings(".m-datatable__pager").find(".m-datatable__pager-nav");
                            if (0 !== t(a).length) {
                                var n = i.getCurrentPage()
                                  , r = t(a).find(".m-pager-input").closest("li");
                                t(a).find("li").show(),
                                t.each(i.getOption("toolbar.items.pagination.pages"), function(o, s) {
                                    if (e.isInResponsiveRange(o)) {
                                        switch (o) {
                                        case "desktop":
                                        case "tablet":
                                            Math.ceil(n / s.pagesNumber),
                                            s.pagesNumber,
                                            s.pagesNumber;
                                            t(r).hide(),
                                            l.meta = i.getDataSourceParam("pagination"),
                                            l.paginationUpdate();
                                            break;
                                        case "mobile":
                                            t(r).show(),
                                            t(a).find(".m-datatable__pager-link--more-prev").closest("li").hide(),
                                            t(a).find(".m-datatable__pager-link--more-next").closest("li").hide(),
                                            t(a).find(".m-datatable__pager-link-number").closest("li").hide()
                                        }
                                        return !1
                                    }
                                })
                            }
                        },
                        paginationUpdate: function() {
                            var e = t(o.table).siblings(".m-datatable__pager").find(".m-datatable__pager-nav")
                              , a = t(e).find(".m-datatable__pager-link--more-prev")
                              , n = t(e).find(".m-datatable__pager-link--more-next")
                              , r = t(e).find(".m-datatable__pager-link--first")
                              , s = t(e).find(".m-datatable__pager-link--prev")
                              , d = t(e).find(".m-datatable__pager-link--next")
                              , c = t(e).find(".m-datatable__pager-link--last")
                              , m = t(e).find(".m-datatable__pager-link-number")
                              , u = Math.max(t(m).first().data("page") - 1, 1);
                            t(a).each(function(e, a) {
                                t(a).attr("data-page", u)
                            }),
                            1 === u ? t(a).parent().hide() : t(a).parent().show();
                            var p = Math.min(t(m).last().data("page") + 1, l.meta.pages);
                            t(n).each(function(e, a) {
                                t(n).attr("data-page", p).show()
                            }),
                            p === l.meta.pages && p === t(m).last().data("page") ? t(n).parent().hide() : t(n).parent().show(),
                            1 === l.meta.page ? (t(r).attr("disabled", !0).addClass("m-datatable__pager-link--disabled"),
                            t(s).attr("disabled", !0).addClass("m-datatable__pager-link--disabled")) : (t(r).removeAttr("disabled").removeClass("m-datatable__pager-link--disabled"),
                            t(s).removeAttr("disabled").removeClass("m-datatable__pager-link--disabled")),
                            l.meta.page === l.meta.pages ? (t(d).attr("disabled", !0).addClass("m-datatable__pager-link--disabled"),
                            t(c).attr("disabled", !0).addClass("m-datatable__pager-link--disabled")) : (t(d).removeAttr("disabled").removeClass("m-datatable__pager-link--disabled"),
                            t(c).removeAttr("disabled").removeClass("m-datatable__pager-link--disabled"));
                            var f = i.getOption("toolbar.items.pagination.navigation");
                            f.first || t(r).remove(),
                            f.prev || t(s).remove(),
                            f.next || t(d).remove(),
                            f.last || t(c).remove()
                        }
                    };
                    return l.init(a),
                    l
                },
                columnHide: function() {
                    var a = e.getViewPort().width;
                    t.each(n.columns, function(n, i) {
                        if (void 0 !== i.responsive) {
                            var l = i.field
                              , r = t.grep(t(o.table).find(".m-datatable__cell"), function(e, a) {
                                return l === t(e).data("field")
                            });
                            e.getBreakpoint(i.responsive.hidden) >= a ? t(r).hide() : t(r).show(),
                            e.getBreakpoint(i.responsive.visible) <= a ? t(r).show() : t(r).hide()
                        }
                    })
                },
                setupSubDatatable: function() {
                    var e = i.getOption("detail.content");
                    if ("function" == typeof e && !(t(o.table).find(".m-datatable__subtable").length > 0)) {
                        t(o.wrap).addClass("m-datatable--subtable"),
                        n.columns[0].subtable = !0;
                        var a = function(a) {
                            a.preventDefault();
                            var l = t(this).closest(".m-datatable__row")
                              , r = t(l).next(".m-datatable__row-subtable");
                            0 === t(r).length && (r = t("<tr/>").addClass("m-datatable__row-subtable m-datatable__row-loading").hide().append(t("<td/>").addClass("m-datatable__subtable").attr("colspan", i.getTotalColumns())),
                            t(l).after(r),
                            t(l).hasClass("m-datatable__row--even") && t(r).addClass("m-datatable__row-subtable--even")),
                            t(r).toggle();
                            var s = t(r).find(".m-datatable__subtable")
                              , d = t(this).closest("[data-field]:first-child").find(".m-datatable__toggle-subtable").data("value")
                              , c = t(this).find("i").removeAttr("class");
                            t(l).hasClass("m-datatable__row--subtable-expanded") ? (t(c).addClass(i.getOption("layout.icons.rowDetail.collapse")),
                            t(l).removeClass("m-datatable__row--subtable-expanded"),
                            t(o).trigger("m-datatable--on-collapse-subtable", [l])) : (t(c).addClass(i.getOption("layout.icons.rowDetail.expand")),
                            t(l).addClass("m-datatable__row--subtable-expanded"),
                            t(o).trigger("m-datatable--on-expand-subtable", [l])),
                            0 === t(s).find(".m-datatable").length && (t.map(o.dataSet, function(t, e) {
                                return d === t[n.columns[0].field] && (a.data = t,
                                !0)
                            }),
                            a.detailCell = s,
                            a.parentRow = l,
                            a.subTable = s,
                            e(a),
                            t(s).children(".m-datatable").on("m-datatable--on-init", function(e) {
                                t(r).removeClass("m-datatable__row-loading")
                            }),
                            "local" === i.getOption("data.type") && t(r).removeClass("m-datatable__row-loading"))
                        }
                          , l = n.columns;
                        t(o.tableBody).find(".m-datatable__row").each(function(e, n) {
                            t(n).find(".m-datatable__cell").each(function(e, n) {
                                var o = t.grep(l, function(e, a) {
                                    return t(n).data("field") === e.field
                                })[0];
                                if (void 0 !== o) {
                                    var r = t(n).text();
                                    if (void 0 !== o.subtable && o.subtable) {
                                        if (t(n).find(".m-datatable__toggle-subtable").length > 0)
                                            return;
                                        t(n).html(t("<a/>").addClass("m-datatable__toggle-subtable").attr("href", "#").attr("data-value", r).attr("title", i.getOption("detail.title")).on("click", a).append(t("<i/>").css("width", t(n).data("width")).addClass(i.getOption("layout.icons.rowDetail.collapse"))))
                                    }
                                }
                            })
                        })
                    }
                },
                dataMapCallback: function(t) {
                    var e = t;
                    return "function" == typeof i.getOption("data.source.read.map") ? i.getOption("data.source.read.map")(t) : (void 0 !== t && void 0 !== t.data && (e = t.data),
                    e)
                },
                isSpinning: !1,
                spinnerCallback: function(t) {
                    if (t) {
                        if (!i.isSpinning) {
                            var e = i.getOption("layout.spinner");
                            void 0 !== e.message && !0 === e.message && (e.message = i.getOption("translate.records.processing")),
                            i.isSpinning = !0,
                            void 0 !== a && a.block(o, e)
                        }
                    } else
                        i.isSpinning = !1,
                        void 0 !== a && a.unblock(o)
                },
                sortCallback: function(e, a, n) {
                    var o = n.type || "string"
                      , i = n.format || ""
                      , l = n.field;
                    return t(e).sort(function(t, e) {
                        var n = t[l]
                          , r = e[l];
                        switch (o) {
                        case "date":
                            if ("undefined" == typeof moment)
                                throw new Error("Moment.js is required.");
                            var s = moment(n, i).diff(moment(r, i));
                            return "asc" === a ? s > 0 ? 1 : s < 0 ? -1 : 0 : s < 0 ? 1 : s > 0 ? -1 : 0;
                        case "number":
                            return isNaN(parseFloat(n)) && null != n && (n = Number(n.replace(/[^0-9\.-]+/g, ""))),
                            isNaN(parseFloat(r)) && null != r && (r = Number(r.replace(/[^0-9\.-]+/g, ""))),
                            n = parseFloat(n),
                            r = parseFloat(r),
                            "asc" === a ? n > r ? 1 : n < r ? -1 : 0 : n < r ? 1 : n > r ? -1 : 0;
                        case "string":
                        default:
                            return "asc" === a ? n > r ? 1 : n < r ? -1 : 0 : n < r ? 1 : n > r ? -1 : 0
                        }
                    })
                },
                log: function(t, e) {
                    void 0 === e && (e = ""),
                    o.debug && console.log(t, e)
                },
                autoHide: function() {
                    t(o.table).find(".m-datatable__cell").show(),
                    t(o.tableBody).each(function() {
                        for (; t(this)[0].offsetWidth < t(this)[0].scrollWidth; )
                            t(o.table).find(".m-datatable__row").each(function(e) {
                                var a = t(this).find(".m-datatable__cell").not(":hidden").last();
                                t(a).hide()
                            }),
                            i.adjustCellsWidth.call()
                    });
                    var e = function(e) {
                        e.preventDefault();
                        var a = t(this).closest(".m-datatable__row")
                          , o = t(a).next();
                        if (t(o).hasClass("m-datatable__row-detail"))
                            t(this).find("i").removeClass(i.getOption("layout.icons.rowDetail.expand")).addClass(i.getOption("layout.icons.rowDetail.collapse")),
                            t(o).remove();
                        else {
                            t(this).find("i").removeClass(i.getOption("layout.icons.rowDetail.collapse")).addClass(i.getOption("layout.icons.rowDetail.expand"));
                            var l = t(a).find(".m-datatable__cell:hidden").clone().show();
                            o = t("<tr/>").addClass("m-datatable__row-detail").insertAfter(a);
                            var r = t("<td/>").addClass("m-datatable__detail").attr("colspan", i.getTotalColumns()).appendTo(o)
                              , s = t("<table/>");
                            t(l).each(function() {
                                var e = t(this).data("field")
                                  , a = t.grep(n.columns, function(t, a) {
                                    return e === t.field
                                })[0];
                                t(s).append(t('<tr class="m-datatable__row"></tr>').append(t('<td class="m-datatable__cell"></td>').append(t("<span/>").css("width", i.offset).append(a.title))).append(this))
                            }),
                            t(r).append(s)
                        }
                    };
                    t(o.tableBody).find(".m-datatable__row").each(function() {
                        t(this).prepend(t("<td/>").addClass("m-datatable__cell m-datatable__toggle--detail").append(t("<a/>").addClass("m-datatable__toggle-detail").attr("href", "").on("click", e).append(t("<i/>").css("width", "21px").addClass(i.getOption("layout.icons.rowDetail.collapse"))))),
                        0 === t(o.tableHead).find(".m-datatable__toggle-detail").length ? (t(o.tableHead).find(".m-datatable__row").first().prepend('<th class="m-datatable__cell m-datatable__toggle-detail"><span style="width: 21px"></span></th>'),
                        t(o.tableFoot).find(".m-datatable__row").first().prepend('<th class="m-datatable__cell m-datatable__toggle-detail"><span style="width: 21px"></span></th>')) : t(o.tableHead).find(".m-datatable__toggle-detail").find("span").css("width", "21px")
                    })
                },
                hoverColumn: function() {
                    t(o.tableBody).on("mouseenter", ".m-datatable__cell", function() {
                        var e = t(i.cell(this).nodes()).index();
                        t(i.cells().nodes()).removeClass("m-datatable__cell--hover"),
                        t(i.column(e).nodes()).addClass("m-datatable__cell--hover")
                    })
                },
                setAutoColumns: function() {
                    i.getOption("data.autoColumns") && (t.each(o.dataSet[0], function(e, a) {
                        0 === t.grep(n.columns, function(t, a) {
                            return e === t.field
                        }).length && n.columns.push({
                            field: e,
                            title: e
                        })
                    }),
                    t(o.tableHead).find(".m-datatable__row").remove(),
                    i.setHeadTitle(),
                    i.getOption("layout.footer") && (t(o.tableFoot).find(".m-datatable__row").remove(),
                    i.setHeadTitle(o.tableFoot)))
                },
                isLocked: function() {
                    return e.hasClass(o.wrap[0], "m-datatable--lock") || !1
                },
                getExtraSpace: function(e) {
                    return parseInt(t(e).css("paddingRight")) + parseInt(t(e).css("paddingLeft")) + (parseInt(t(e).css("marginRight")) + parseInt(t(e).css("marginLeft"))) + Math.ceil(t(e).css("border-right-width").replace("px", ""))
                },
                dataPlaceholder: function(e, a) {
                    var n = e;
                    return t.each(a, function(t, e) {
                        n = n.replace("{{" + t + "}}", e)
                    }),
                    n
                },
                getTableId: function(e) {
                    void 0 === e && (e = "");
                    var a = t(o).attr("id");
                    return void 0 === a && (a = t(o).attr("class").split(" ")[0]),
                    a + e
                },
                getTablePrefix: function(t) {
                    return void 0 !== t && (t = "-" + t),
                    i.getTableId() + "-" + i.getDepth() + t
                },
                getDepth: function() {
                    var e = 0
                      , a = o.table;
                    do {
                        a = t(a).parents(".m-datatable__table"),
                        e++
                    } while (t(a).length > 0);return e
                },
                stateKeep: function(t, e) {
                    t = i.getTablePrefix(t),
                    !1 !== i.getOption("data.saveState") && (i.getOption("data.saveState.webstorage") && localStorage && localStorage.setItem(t, JSON.stringify(e)),
                    i.getOption("data.saveState.cookie") && Cookies.set(t, JSON.stringify(e)))
                },
                stateGet: function(t, e) {
                    if (t = i.getTablePrefix(t),
                    !1 !== i.getOption("data.saveState")) {
                        var a = null;
                        return null != (a = i.getOption("data.saveState.webstorage") && localStorage ? localStorage.getItem(t) : Cookies.get(t)) ? JSON.parse(a) : void 0
                    }
                },
                stateUpdate: function(e, a) {
                    var n = i.stateGet(e);
                    null == n && (n = {}),
                    i.stateKeep(e, t.extend({}, n, a))
                },
                stateRemove: function(t) {
                    t = i.getTablePrefix(t),
                    localStorage && localStorage.removeItem(t),
                    Cookies.remove(t)
                },
                getTotalColumns: function(e) {
                    return void 0 === e && (e = o.tableBody),
                    t(e).find(".m-datatable__row").first().find(".m-datatable__cell").length
                },
                getOneRow: function(e, a, n) {
                    void 0 === n && (n = !0);
                    var o = t(e).find(".m-datatable__row:not(.m-datatable__row-detail):nth-child(" + a + ")");
                    return n && (o = o.find(".m-datatable__cell")),
                    o
                },
                hasOverflowY: function(e) {
                    var a = t(e).find(".m-datatable__row")
                      , n = 0;
                    return a.length > 0 && (t(a).each(function(e, a) {
                        n += Math.floor(t(a).innerHeight())
                    }),
                    n > t(e).innerHeight())
                },
                sortColumn: function(e, a, n) {
                    void 0 === a && (a = "asc"),
                    void 0 === n && (n = !1);
                    var i = t(e).index()
                      , l = t(o.tableBody).find(".m-datatable__row")
                      , r = t(e).closest(".m-datatable__lock").index();
                    -1 !== r && (l = t(o.tableBody).find(".m-datatable__lock:nth-child(" + (r + 1) + ")").find(".m-datatable__row"));
                    var s = t(l).parent();
                    t(l).sort(function(e, o) {
                        var l = t(e).find("td:nth-child(" + i + ")").text()
                          , r = t(o).find("td:nth-child(" + i + ")").text();
                        return n && (l = parseInt(l),
                        r = parseInt(r)),
                        "asc" === a ? l > r ? 1 : l < r ? -1 : 0 : l < r ? 1 : l > r ? -1 : 0
                    }).appendTo(s)
                },
                sorting: function() {
                    var e = {
                        init: function() {
                            n.sortable && (t(o.tableHead).find(".m-datatable__cell:not(.m-datatable__cell--check)").addClass("m-datatable__cell--sort").off("click").on("click", e.sortClick),
                            e.setIcon())
                        },
                        setIcon: function() {
                            var e = i.getDataSourceParam("sort");
                            if (!t.isEmptyObject(e)) {
                                var a = t(o.tableHead).find('.m-datatable__cell[data-field="' + e.field + '"]').attr("data-sort", e.sort)
                                  , n = t(a).find("span")
                                  , l = t(n).find("i")
                                  , r = i.getOption("layout.icons.sort");
                                t(l).length > 0 ? t(l).removeAttr("class").addClass(r[e.sort]) : t(n).append(t("<i/>").addClass(r[e.sort]))
                            }
                        },
                        sortClick: function(a) {
                            var l = i.getDataSourceParam("sort")
                              , r = t(this).data("field")
                              , s = i.getColumnByField(r);
                            if ((void 0 === s.sortable || !1 !== s.sortable) && (t(o.tableHead).find(".m-datatable__cell > span > i").remove(),
                            n.sortable)) {
                                i.spinnerCallback(!0);
                                var d = "desc";
                                i.getObject("field", l) === r && (d = i.getObject("sort", l)),
                                l = {
                                    field: r,
                                    sort: d = void 0 === d || "desc" === d ? "asc" : "desc"
                                },
                                i.setDataSourceParam("sort", l),
                                e.setIcon(),
                                setTimeout(function() {
                                    i.dataRender("sort"),
                                    t(o).trigger("m-datatable--on-sort", l)
                                }, 300)
                            }
                        }
                    };
                    e.init()
                },
                localDataUpdate: function() {
                    var e = i.getDataSourceParam();
                    void 0 === o.originalDataSet && (o.originalDataSet = o.dataSet);
                    var a = i.getObject("sort.field", e)
                      , n = i.getObject("sort.sort", e)
                      , l = i.getColumnByField(a);
                    if (void 0 !== l && !0 !== i.getOption("data.serverSorting") ? "function" == typeof l.sortCallback ? o.dataSet = l.sortCallback(o.originalDataSet, n, l) : o.dataSet = i.sortCallback(o.originalDataSet, n, l) : o.dataSet = o.originalDataSet,
                    "object" == typeof e.query && !i.getOption("data.serverFiltering")) {
                        e.query = e.query || {};
                        var r = function(t) {
                            for (var e in t)
                                if (t.hasOwnProperty(e))
                                    if ("string" == typeof t[e]) {
                                        if (t[e].toLowerCase() == s || -1 !== t[e].toLowerCase().indexOf(s))
                                            return !0
                                    } else if ("number" == typeof t[e]) {
                                        if (t[e] === s)
                                            return !0
                                    } else if ("object" == typeof t[e])
                                        return r(t[e]);
                            return !1
                        }
                          , s = t(i.getOption("search.input")).val();
                        void 0 !== s && "" !== s && (s = s.toLowerCase(),
                        o.dataSet = t.grep(o.dataSet, r),
                        delete e.query[i.getGeneralSearchKey()]),
                        t.each(e.query, function(t, a) {
                            "" === a && delete e.query[t]
                        }),
                        o.dataSet = i.filterArray(o.dataSet, e.query),
                        o.dataSet = o.dataSet.filter(function() {
                            return !0
                        })
                    }
                    return o.dataSet
                },
                filterArray: function(e, a, n) {
                    if ("object" != typeof e)
                        return [];
                    if (void 0 === n && (n = "AND"),
                    "object" != typeof a)
                        return e;
                    if (n = n.toUpperCase(),
                    -1 === t.inArray(n, ["AND", "OR", "NOT"]))
                        return [];
                    var o = Object.keys(a).length
                      , i = [];
                    return t.each(e, function(e, l) {
                        var r = l
                          , s = 0;
                        t.each(a, function(t, e) {
                            if (e = e instanceof Array ? e : [e],
                            r.hasOwnProperty(t)) {
                                var a = r[t].toString().toLowerCase();
                                e.forEach(function(t, e) {
                                    t.toString().toLowerCase() != a && -1 === a.indexOf(t.toString().toLowerCase()) || s++
                                })
                            }
                        }),
                        ("AND" == n && s == o || "OR" == n && s > 0 || "NOT" == n && 0 == s) && (i[e] = l)
                    }),
                    e = i
                },
                resetScroll: function() {
                    void 0 === n.detail && 1 === i.getDepth() && (t(o.table).find(".m-datatable__row").css("left", 0),
                    t(o.table).find(".m-datatable__lock").css("top", 0),
                    t(o.tableBody).scrollTop(0))
                },
                getColumnByField: function(e) {
                    var a;
                    if (void 0 !== e)
                        return t.each(n.columns, function(t, n) {
                            if (e === n.field)
                                return a = n,
                                !1
                        }),
                        a
                },
                getDefaultSortColumn: function() {
                    var e;
                    return t.each(n.columns, function(a, n) {
                        if (void 0 !== n.sortable && -1 !== t.inArray(n.sortable, ["asc", "desc"]))
                            return e = {
                                sort: n.sortable,
                                field: n.field
                            },
                            !1
                    }),
                    e
                },
                getHiddenDimensions: function(e, a) {
                    var n = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    }
                      , o = {
                        width: 0,
                        height: 0,
                        innerWidth: 0,
                        innerHeight: 0,
                        outerWidth: 0,
                        outerHeight: 0
                    }
                      , i = t(e).parents().addBack().not(":visible");
                    a = "boolean" == typeof a && a;
                    var l = [];
                    return i.each(function() {
                        var t = {};
                        for (var e in n)
                            t[e] = this.style[e],
                            this.style[e] = n[e];
                        l.push(t)
                    }),
                    o.width = t(e).width(),
                    o.outerWidth = t(e).outerWidth(a),
                    o.innerWidth = t(e).innerWidth(),
                    o.height = t(e).height(),
                    o.innerHeight = t(e).innerHeight(),
                    o.outerHeight = t(e).outerHeight(a),
                    i.each(function(t) {
                        var e = l[t];
                        for (var a in n)
                            this.style[a] = e[a]
                    }),
                    o
                },
                getGeneralSearchKey: function() {
                    var e = t(i.getOption("search.input"));
                    return t(e).prop("name") || t(e).prop("id")
                },
                getObject: function(t, e) {
                    return t.split(".").reduce(function(t, e) {
                        return null !== t && void 0 !== t[e] ? t[e] : null
                    }, e)
                },
                extendObj: function(t, e, a) {
                    var n = e.split(".")
                      , o = 0;
                    return function t(e) {
                        var i = n[o++];
                        void 0 !== e[i] && null !== e[i] ? "object" != typeof e[i] && "function" != typeof e[i] && (e[i] = {}) : e[i] = {},
                        o === n.length ? e[i] = a : t(e[i])
                    }(t),
                    t
                },
                rowEvenOdd: function() {
                    t(o.tableBody).find(".m-datatable__row").removeClass("m-datatable__row--even"),
                    t(o.wrap).hasClass("m-datatable--subtable") ? t(o.tableBody).find(".m-datatable__row:not(.m-datatable__row-detail):even").addClass("m-datatable__row--even") : t(o.tableBody).find(".m-datatable__row:nth-child(even)").addClass("m-datatable__row--even")
                },
                timer: 0,
                redraw: function() {
                    return i.adjustCellsWidth.call(),
                    i.isLocked() && (i.scrollbar(),
                    i.resetScroll(),
                    i.adjustCellsHeight.call()),
                    i.adjustLockContainer.call(),
                    i.initHeight.call(),
                    o
                },
                load: function() {
                    return i.reload(),
                    o
                },
                reload: function() {
                    return function(t, e) {
                        clearTimeout(i.timer),
                        i.timer = setTimeout(t, e)
                    }(function() {
                        n.data.serverFiltering || i.localDataUpdate(),
                        i.dataRender(),
                        t(o).trigger("m-datatable--on-reloaded")
                    }, i.getOption("search.delay")),
                    o
                },
                getRecord: function(e) {
                    return void 0 === o.tableBody && (o.tableBody = t(o.table).children("tbody")),
                    t(o.tableBody).find(".m-datatable__cell:first-child").each(function(a, n) {
                        if (e == t(n).text()) {
                            var l = t(n).closest(".m-datatable__row").index() + 1;
                            return o.API.record = o.API.value = i.getOneRow(o.tableBody, l),
                            o
                        }
                    }),
                    o
                },
                getColumn: function(e) {
                    return i.setSelectedRecords(),
                    o.API.value = t(o.API.record).find('[data-field="' + e + '"]'),
                    o
                },
                destroy: function() {
                    t(o).parent().find(".m-datatable__pager").remove();
                    var e = t(o.initialDatatable).addClass("m-datatable--destroyed").show();
                    return t(o).replaceWith(e),
                    t(o = e).trigger("m-datatable--on-destroy"),
                    i.isInit = !1,
                    e = null
                },
                sort: function(e, a) {
                    a = void 0 === a ? "asc" : a,
                    i.spinnerCallback(!0);
                    var n = {
                        field: e,
                        sort: a
                    };
                    return i.setDataSourceParam("sort", n),
                    setTimeout(function() {
                        i.dataRender("sort"),
                        t(o).trigger("m-datatable--on-sort", n),
                        t(o.tableHead).find(".m-datatable__cell > span > i").remove()
                    }, 300),
                    o
                },
                getValue: function() {
                    return t(o.API.value).text()
                },
                setActive: function(e) {
                    "string" == typeof e && (e = t(o.tableBody).find('.m-checkbox--single > [type="checkbox"][value="' + e + '"]')),
                    t(e).prop("checked", !0);
                    var a = t(e).closest(".m-datatable__row").addClass("m-datatable__row--active")
                      , n = t(a).index() + 1;
                    t(a).closest(".m-datatable__lock").parent().find(".m-datatable__row:nth-child(" + n + ")").addClass("m-datatable__row--active");
                    var i = [];
                    t(a).each(function(e, a) {
                        var n = t(a).find('.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').val();
                        void 0 !== n && i.push(n)
                    }),
                    t(o).trigger("m-datatable--on-check", [i])
                },
                setInactive: function(e) {
                    "string" == typeof e && (e = t(o.tableBody).find('.m-checkbox--single > [type="checkbox"][value="' + e + '"]')),
                    t(e).prop("checked", !1);
                    var a = t(e).closest(".m-datatable__row").removeClass("m-datatable__row--active")
                      , n = t(a).index() + 1;
                    t(a).closest(".m-datatable__lock").parent().find(".m-datatable__row:nth-child(" + n + ")").removeClass("m-datatable__row--active");
                    var i = [];
                    t(a).each(function(e, a) {
                        var n = t(a).find('.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').val();
                        void 0 !== n && i.push(n)
                    }),
                    t(o).trigger("m-datatable--on-uncheck", [i])
                },
                setActiveAll: function(e) {
                    var a = t(o.table).find("> tbody, > thead").find("> tr:not(.m-datatable__row-subtable)").find('.m-datatable__cell--check [type="checkbox"]');
                    e ? i.setActive(a) : i.setInactive(a)
                },
                setSelectedRecords: function() {
                    return o.API.record = t(o.tableBody).find(".m-datatable__row--active"),
                    o
                },
                getSelectedRecords: function() {
                    return i.setSelectedRecords(),
                    o.API.record = o.rows(".m-datatable__row--active").nodes(),
                    o.API.record
                },
                getOption: function(t) {
                    return i.getObject(t, n)
                },
                setOption: function(t, e) {
                    n = i.extendObj(n, t, e)
                },
                search: function(e, a) {
                    void 0 !== a && (a = t.makeArray(a)),
                    o = function() {
                        var o = i.getDataSourceQuery();
                        if (void 0 === a && void 0 !== e) {
                            var l = i.getGeneralSearchKey();
                            o[l] = e
                        }
                        "object" == typeof a && (t.each(a, function(t, a) {
                            o[a] = e
                        }),
                        t.each(o, function(e, a) {
                            ("" === a || t.isEmptyObject(a)) && delete o[e]
                        })),
                        i.setDataSourceQuery(o),
                        n.data.serverFiltering || i.localDataUpdate(),
                        i.dataRender("search")
                    }
                    ,
                    l = i.getOption("search.delay"),
                    clearTimeout(i.timer),
                    i.timer = setTimeout(o, l);
                    var o, l
                },
                setDataSourceParam: function(e, a) {
                    o.API.params = t.extend({}, {
                        pagination: {
                            page: 1,
                            perpage: i.getOption("data.pageSize")
                        },
                        sort: i.getDefaultSortColumn(),
                        query: {}
                    }, o.API.params, i.stateGet(i.stateId)),
                    o.API.params = i.extendObj(o.API.params, e, a),
                    i.stateKeep(i.stateId, o.API.params)
                },
                getDataSourceParam: function(e) {
                    return o.API.params = t.extend({}, {
                        pagination: {
                            page: 1,
                            perpage: i.getOption("data.pageSize")
                        },
                        sort: i.getDefaultSortColumn(),
                        query: {}
                    }, o.API.params, i.stateGet(i.stateId)),
                    "string" == typeof e ? i.getObject(e, o.API.params) : o.API.params
                },
                getDataSourceQuery: function() {
                    return i.getDataSourceParam("query") || {}
                },
                setDataSourceQuery: function(t) {
                    i.setDataSourceParam("query", t)
                },
                getCurrentPage: function() {
                    return t(o.table).siblings(".m-datatable__pager").last().find(".m-datatable__pager-nav").find(".m-datatable__pager-link.m-datatable__pager-link--active").data("page") || 1
                },
                getPageSize: function() {
                    return t(o.table).siblings(".m-datatable__pager").last().find("select.m-datatable__pager-size").val() || 10
                },
                getTotalRows: function() {
                    return o.API.params.pagination.total
                },
                getDataSet: function() {
                    return o.originalDataSet
                },
                hideColumn: function(e) {
                    t.map(n.columns, function(t) {
                        return e === t.field && (t.responsive = {
                            hidden: "xl"
                        }),
                        t
                    });
                    var a = t.grep(t(o.table).find(".m-datatable__cell"), function(a, n) {
                        return e === t(a).data("field")
                    });
                    t(a).hide()
                },
                showColumn: function(e) {
                    t.map(n.columns, function(t) {
                        return e === t.field && delete t.responsive,
                        t
                    });
                    var a = t.grep(t(o.table).find(".m-datatable__cell"), function(a, n) {
                        return e === t(a).data("field")
                    });
                    t(a).show()
                },
                nodeTr: [],
                nodeTd: [],
                nodeCols: [],
                recentNode: [],
                table: function() {
                    return o.table
                },
                row: function(e) {
                    return i.rows(e),
                    i.nodeTr = i.recentNode = t(i.nodeTr).first(),
                    o
                },
                rows: function(e) {
                    return i.nodeTr = i.recentNode = t(o.tableBody).find(e).filter(".m-datatable__row"),
                    o
                },
                column: function(e) {
                    return i.nodeCols = i.recentNode = t(o.tableBody).find(".m-datatable__cell:nth-child(" + (e + 1) + ")"),
                    o
                },
                columns: function(e) {
                    var a = o.table;
                    i.nodeTr === i.recentNode && (a = i.nodeTr);
                    var n = t(a).find('.m-datatable__cell[data-field="' + e + '"]');
                    return n.length > 0 ? i.nodeCols = i.recentNode = n : i.nodeCols = i.recentNode = t(a).find(e).filter(".m-datatable__cell"),
                    o
                },
                cell: function(e) {
                    return i.cells(e),
                    i.nodeTd = i.recentNode = t(i.nodeTd).first(),
                    o
                },
                cells: function(e) {
                    var a = t(o.tableBody).find(".m-datatable__cell");
                    return void 0 !== e && (a = t(a).filter(e)),
                    i.nodeTd = i.recentNode = a,
                    o
                },
                remove: function() {
                    return t(i.nodeTr.length) && i.nodeTr === i.recentNode && t(i.nodeTr).remove(),
                    i.layoutUpdate(),
                    o
                },
                visible: function(e) {
                    if (t(i.recentNode.length)) {
                        var a = i.lockEnabledColumns();
                        if (i.recentNode === i.nodeCols) {
                            var o = i.recentNode.index();
                            if (i.isLocked()) {
                                var l = t(i.recentNode).closest(".m-datatable__lock--scroll").length;
                                l ? o += a.left.length + 1 : t(i.recentNode).closest(".m-datatable__lock--right").length && (o += a.left.length + l + 1)
                            }
                        }
                        e ? (i.recentNode === i.nodeCols && delete n.columns[o].responsive,
                        t(i.recentNode).show()) : (i.recentNode === i.nodeCols && i.setOption("columns." + o + ".responsive", {
                            hidden: "xl"
                        }),
                        t(i.recentNode).hide()),
                        i.redraw()
                    }
                },
                nodes: function() {
                    return i.recentNode
                },
                dataset: function() {
                    return o
                }
            };
            if (t.each(i, function(t, e) {
                o[t] = e
            }),
            void 0 !== n)
                if ("string" == typeof n) {
                    var l = n;
                    void 0 !== (o = t(this).data("mDatatable")) && (n = o.options,
                    i[l].apply(this, Array.prototype.slice.call(arguments, 1)))
                } else
                    o.data("mDatatable") || t(this).hasClass("m-datatable--loaded") || (o.dataSet = null,
                    o.textAlign = {
                        left: "m-datatable__cell--left",
                        center: "m-datatable__cell--center",
                        right: "m-datatable__cell--right"
                    },
                    n = t.extend(!0, {}, t.fn.mDatatable.defaults, n),
                    o.options = n,
                    i.init.apply(this, [n]),
                    t(o.wrap).data("mDatatable", o));
            else
                void 0 === (o = t(this).data("mDatatable")) && t.error("mDatatable not initialized"),
                n = o.options;
            return o
        }
        console.log("No mDatatable element exist.")
    }
    ,
    t.fn.mDatatable.defaults = {
        data: {
            type: "local",
            source: null,
            pageSize: 10,
            saveState: {
                cookie: !1,
                webstorage: !0
            },
            serverPaging: !1,
            serverFiltering: !1,
            serverSorting: !1,
            autoColumns: !1,
            attr: {
                rowProps: []
            }
        },
        layout: {
            theme: "default",
            class: "m-datatable--brand",
            scroll: !1,
            height: null,
            minHeight: 300,
            footer: !1,
            header: !0,
            customScrollbar: !0,
            spinner: {
                overlayColor: "#000000",
                opacity: 0,
                type: "loader",
                state: "brand",
                message: !0
            },
            icons: {
                sort: {
                    asc: "la la-arrow-up",
                    desc: "la la-arrow-down"
                },
                pagination: {
                    next: "la la-angle-right",
                    prev: "la la-angle-left",
                    first: "la la-angle-double-left",
                    last: "la la-angle-double-right",
                    more: "la la-ellipsis-h"
                },
                rowDetail: {
                    expand: "fa fa-caret-down",
                    collapse: "fa fa-caret-right"
                }
            }
        },
        sortable: !0,
        resizable: !1,
        filterable: !1,
        pagination: !0,
        editable: !1,
        columns: [],
        search: {
            onEnter: !1,
            input: null,
            delay: 400
        },
        rows: {
            callback: function() {},
            beforeTemplate: function() {},
            afterTemplate: function() {},
            autoHide: !1
        },
        toolbar: {
            layout: ["pagination", "info"],
            placement: ["bottom"],
            items: {
                pagination: {
                    type: "default",
                    pages: {
                        desktop: {
                            layout: "default",
                            pagesNumber: 6
                        },
                        tablet: {
                            layout: "default",
                            pagesNumber: 3
                        },
                        mobile: {
                            layout: "compact"
                        }
                    },
                    navigation: {
                        prev: !0,
                        next: !0,
                        first: !0,
                        last: !0
                    },
                    pageSizeSelect: []
                },
                info: !0
            }
        },
        translate: {
            records: {
                processing: "Please wait...",
                noRecords: "No records found"
            },
            toolbar: {
                pagination: {
                    items: {
                        default: {
                            first: "First",
                            prev: "Previous",
                            next: "Next",
                            last: "Last",
                            more: "More pages",
                            input: "Page number",
                            select: "Select page size"
                        },
                        info: "Displaying {{start}} - {{end}} of {{total}} records"
                    }
                }
            }
        },
        extensions: {}
    }
}(jQuery);
var defaults = {
    layout: {
        icons: {
            pagination: {
                next: "la la-angle-right",
                prev: "la la-angle-left",
                first: "la la-angle-double-left",
                last: "la la-angle-double-right",
                more: "la la-ellipsis-h"
            },
            rowDetail: {
                expand: "fa fa-caret-down",
                collapse: "fa fa-caret-right"
            }
        }
    }
};
mUtil.isRTL() && (defaults = {
    layout: {
        icons: {
            pagination: {
                next: "la la-angle-left",
                prev: "la la-angle-right",
                last: "la la-angle-double-left",
                first: "la la-angle-double-right"
            },
            rowDetail: {
                collapse: "fa fa-caret-down",
                expand: "fa fa-caret-right"
            }
        }
    }
}),
$.extend(!0, $.fn.mDatatable.defaults, defaults);
var mDropdown = function(t, e) {
    var a = this
      , n = mUtil.get(t)
      , o = mUtil.get("body");
    if (n) {
        var i = {
            toggle: "click",
            hoverTimeout: 300,
            skin: "light",
            height: "auto",
            maxHeight: !1,
            minHeight: !1,
            persistent: !1,
            mobileOverlay: !0
        }
          , l = {
            construct: function(t) {
                return mUtil.data(n).has("dropdown") ? a = mUtil.data(n).get("dropdown") : (l.init(t),
                l.setup(),
                mUtil.data(n).set("dropdown", a)),
                a
            },
            init: function(t) {
                a.options = mUtil.deepExtend({}, i, t),
                a.events = [],
                a.eventHandlers = {},
                a.open = !1,
                a.layout = {},
                a.layout.close = mUtil.find(n, ".m-dropdown__close"),
                a.layout.toggle = mUtil.find(n, ".m-dropdown__toggle"),
                a.layout.arrow = mUtil.find(n, ".m-dropdown__arrow"),
                a.layout.wrapper = mUtil.find(n, ".m-dropdown__wrapper"),
                a.layout.defaultDropPos = mUtil.hasClass(n, "m-dropdown--up") ? "up" : "down",
                a.layout.currentDropPos = a.layout.defaultDropPos,
                "hover" == mUtil.attr(n, "m-dropdown-toggle") && (a.options.toggle = "hover")
            },
            setup: function() {
                a.options.placement && mUtil.addClass(n, "m-dropdown--" + a.options.placement),
                a.options.align && mUtil.addClass(n, "m-dropdown--align-" + a.options.align),
                a.options.width && mUtil.css(a.layout.wrapper, "width", a.options.width + "px"),
                "1" == mUtil.attr(n, "m-dropdown-persistent") && (a.options.persistent = !0),
                "hover" == a.options.toggle && mUtil.addEvent(n, "mouseout", l.hideMouseout),
                l.setZindex()
            },
            toggle: function() {
                return a.open ? l.hide() : l.show()
            },
            setContent: function(t) {
                t = mUtil.find(n, ".m-dropdown__content").innerHTML = t;
                return a
            },
            show: function() {
                if ("hover" == a.options.toggle && mUtil.hasAttr(n, "hover"))
                    return l.clearHovered(),
                    a;
                if (a.open)
                    return a;
                if (a.layout.arrow && l.adjustArrowPos(),
                l.eventTrigger("beforeShow"),
                l.hideOpened(),
                mUtil.addClass(n, "m-dropdown--open"),
                mUtil.isMobileDevice() && a.options.mobileOverlay) {
                    var t = mUtil.css(n, "z-index") - 1
                      , e = mUtil.insertAfter(document.createElement("DIV"), n);
                    mUtil.addClass(e, "m-dropdown__dropoff"),
                    mUtil.css(e, "z-index", t),
                    mUtil.data(e).set("dropdown", n),
                    mUtil.data(n).set("dropoff", e),
                    mUtil.addEvent(e, "click", function(t) {
                        l.hide(),
                        mUtil.remove(this),
                        t.preventDefault()
                    })
                }
                return n.focus(),
                n.setAttribute("aria-expanded", "true"),
                a.open = !0,
                mUtil.scrollersUpdate(n),
                l.eventTrigger("afterShow"),
                a
            },
            clearHovered: function() {
                var t = mUtil.attr(n, "timeout");
                mUtil.removeAttr(n, "hover"),
                mUtil.removeAttr(n, "timeout"),
                clearTimeout(t)
            },
            hideHovered: function(t) {
                if (!0 === t) {
                    if (!1 === l.eventTrigger("beforeHide"))
                        return;
                    l.clearHovered(),
                    mUtil.removeClass(n, "m-dropdown--open"),
                    a.open = !1,
                    l.eventTrigger("afterHide")
                } else {
                    if (!0 === mUtil.hasAttr(n, "hover"))
                        return;
                    if (!1 === l.eventTrigger("beforeHide"))
                        return;
                    var e = setTimeout(function() {
                        mUtil.attr(n, "hover") && (l.clearHovered(),
                        mUtil.removeClass(n, "m-dropdown--open"),
                        a.open = !1,
                        l.eventTrigger("afterHide"))
                    }, a.options.hoverTimeout);
                    mUtil.attr(n, "hover", "1"),
                    mUtil.attr(n, "timeout", e)
                }
            },
            hideClicked: function() {
                !1 !== l.eventTrigger("beforeHide") && (mUtil.removeClass(n, "m-dropdown--open"),
                mUtil.data(n).remove("dropoff"),
                a.open = !1,
                l.eventTrigger("afterHide"))
            },
            hide: function(t) {
                return !1 === a.open ? a : (mUtil.isDesktopDevice() && "hover" == a.options.toggle ? l.hideHovered(t) : l.hideClicked(),
                "down" == a.layout.defaultDropPos && "up" == a.layout.currentDropPos && (mUtil.removeClass(n, "m-dropdown--up"),
                a.layout.arrow.prependTo(a.layout.wrapper),
                a.layout.currentDropPos = "down"),
                a)
            },
            hideMouseout: function() {
                mUtil.isDesktopDevice() && l.hide()
            },
            hideOpened: function() {
                for (var t = mUtil.findAll(o, ".m-dropdown.m-dropdown--open"), e = 0, a = t.length; e < a; e++) {
                    var n = t[e];
                    mUtil.data(n).get("dropdown").hide(!0)
                }
            },
            adjustArrowPos: function() {
                var t = mUtil.outerWidth(n)
                  , e = mUtil.hasClass(a.layout.arrow, "m-dropdown__arrow--right") ? "right" : "left"
                  , o = 0;
                a.layout.arrow && (mUtil.isInResponsiveRange("mobile") && mUtil.hasClass(n, "m-dropdown--mobile-full-width") ? (o = mUtil.offset(n).left + t / 2 - Math.abs(parseInt(mUtil.css(a.layout.arrow, "width")) / 2) - parseInt(mUtil.css(a.layout.wrapper, "left")),
                mUtil.css(a.layout.arrow, "right", "auto"),
                mUtil.css(a.layout.arrow, "left", o + "px"),
                mUtil.css(a.layout.arrow, "margin-left", "auto"),
                mUtil.css(a.layout.arrow, "margin-right", "auto")) : mUtil.hasClass(a.layout.arrow, "m-dropdown__arrow--adjust") && (o = t / 2 - Math.abs(parseInt(mUtil.css(a.layout.arrow, "width")) / 2),
                mUtil.hasClass(n, "m-dropdown--align-push") && (o += 20),
                "right" == e ? mUtil.isRTL() ? (mUtil.css(a.layout.arrow, "right", "auto"),
                mUtil.css(a.layout.arrow, "left", o + "px")) : (mUtil.css(a.layout.arrow, "left", "auto"),
                mUtil.css(a.layout.arrow, "right", o + "px")) : mUtil.isRTL() ? (mUtil.css(a.layout.arrow, "left", "auto"),
                mUtil.css(a.layout.arrow, "right", o + "px")) : (mUtil.css(a.layout.arrow, "right", "auto"),
                mUtil.css(a.layout.arrow, "left", o + "px"))))
            },
            setZindex: function() {
                var t = 101
                  , e = mUtil.getHighestZindex(n);
                e >= t && (t = e + 1),
                mUtil.css(a.layout.wrapper, "z-index", t)
            },
            isPersistent: function() {
                return a.options.persistent
            },
            isShown: function() {
                return a.open
            },
            eventTrigger: function(t, e) {
                for (var n = 0; n < a.events.length; n++) {
                    var o = a.events[n];
                    o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0,
                    o.handler.call(this, a, e)) : o.handler.call(this, a, e))
                }
            },
            addEvent: function(t, e, n) {
                a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                })
            }
        };
        return a.setDefaults = function(t) {
            i = t
        }
        ,
        a.show = function() {
            return l.show()
        }
        ,
        a.hide = function() {
            return l.hide()
        }
        ,
        a.toggle = function() {
            return l.toggle()
        }
        ,
        a.isPersistent = function() {
            return l.isPersistent()
        }
        ,
        a.isShown = function() {
            return l.isShown()
        }
        ,
        a.setContent = function(t) {
            return l.setContent(t)
        }
        ,
        a.on = function(t, e) {
            return l.addEvent(t, e)
        }
        ,
        a.one = function(t, e) {
            return l.addEvent(t, e, !0)
        }
        ,
        l.construct.apply(a, [e]),
        !0,
        a
    }
};
mUtil.on(document, '[m-dropdown-toggle="click"] .m-dropdown__toggle', "click", function(t) {
    var e = this.closest(".m-dropdown");
    e && ((mUtil.data(e).has("dropdown") ? mUtil.data(e).get("dropdown") : new mDropdown(e)).toggle(),
    t.preventDefault())
}),
mUtil.on(document, '[m-dropdown-toggle="hover"] .m-dropdown__toggle', "click", function(t) {
    if (mUtil.isDesktopDevice())
        "#" == mUtil.attr(this, "href") && t.preventDefault();
    else if (mUtil.isMobileDevice()) {
        var e = this.closest(".m-dropdown");
        e && ((mUtil.data(e).has("dropdown") ? mUtil.data(e).get("dropdown") : new mDropdown(e)).toggle(),
        t.preventDefault())
    }
}),
mUtil.on(document, '[m-dropdown-toggle="hover"]', "mouseover", function(t) {
    if (mUtil.isDesktopDevice()) {
        this && ((mUtil.data(this).has("dropdown") ? mUtil.data(this).get("dropdown") : new mDropdown(this)).show(),
        t.preventDefault())
    }
}),
document.addEventListener("click", function(t) {
    var e, a = mUtil.get("body"), n = t.target;
    if (e = a.querySelectorAll(".m-dropdown.m-dropdown--open"))
        for (var o = 0, i = e.length; o < i; o++) {
            var l = e[o];
            if (!1 === mUtil.data(l).has("dropdown"))
                return;
            var r = mUtil.data(l).get("dropdown")
              , s = mUtil.find(l, ".m-dropdown__toggle");
            mUtil.hasClass(l, "m-dropdown--disable-close") && (t.preventDefault(),
            t.stopPropagation()),
            s && n !== s && !1 === s.contains(n) && !1 === n.contains(s) ? !1 === r.isPersistent() && r.hide() : !1 === l.contains(n) && r.hide()
        }
});
var mHeader = function(t, e) {
    var a = this
      , n = mUtil.get(t)
      , o = mUtil.get("body");
    if (void 0 !== n) {
        var i = {
            classic: !1,
            offset: {
                mobile: 150,
                desktop: 200
            },
            minimize: {
                mobile: !1,
                desktop: !1
            }
        }
          , l = {
            construct: function(t) {
                return mUtil.data(n).has("header") ? a = mUtil.data(n).get("header") : (l.init(t),
                l.build(),
                mUtil.data(n).set("header", a)),
                a
            },
            init: function(t) {
                a.events = [],
                a.options = mUtil.deepExtend({}, i, t)
            },
            build: function() {
                var t = 0;
                !1 === a.options.minimize.mobile && !1 === a.options.minimize.desktop || window.addEventListener("scroll", function() {
                    var e, n, i, l = 0;
                    mUtil.isInResponsiveRange("desktop") ? (l = a.options.offset.desktop,
                    e = a.options.minimize.desktop.on,
                    n = a.options.minimize.desktop.off) : mUtil.isInResponsiveRange("tablet-and-mobile") && (l = a.options.offset.mobile,
                    e = a.options.minimize.mobile.on,
                    n = a.options.minimize.mobile.off),
                    i = window.pageYOffset,
                    mUtil.isInResponsiveRange("tablet-and-mobile") && a.options.classic && a.options.classic.mobile || mUtil.isInResponsiveRange("desktop") && a.options.classic && a.options.classic.desktop ? i > l ? (mUtil.addClass(o, e),
                    mUtil.removeClass(o, n)) : (mUtil.addClass(o, n),
                    mUtil.removeClass(o, e)) : (i > l && t < i ? (mUtil.addClass(o, e),
                    mUtil.removeClass(o, n)) : (mUtil.addClass(o, n),
                    mUtil.removeClass(o, e)),
                    t = i)
                })
            },
            eventTrigger: function(t, e) {
                for (var n = 0; n < a.events.length; n++) {
                    var o = a.events[n];
                    o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0,
                    o.handler.call(this, a, e)) : o.handler.call(this, a, e))
                }
            },
            addEvent: function(t, e, n) {
                a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                })
            }
        };
        return a.setDefaults = function(t) {
            i = t
        }
        ,
        a.on = function(t, e) {
            return l.addEvent(t, e)
        }
        ,
        l.construct.apply(a, [e]),
        !0,
        a
    }
}
  , mMenu = function(t, e) {
    var a = this
      , n = !1
      , o = mUtil.get(t)
      , i = mUtil.get("body");
    if (o) {
        var l = {
            accordion: {
                slideSpeed: 200,
                autoScroll: !1,
                autoScrollSpeed: 1200,
                expandAll: !0
            },
            dropdown: {
                timeout: 500
            }
        }
          , r = {
            construct: function(t) {
                return mUtil.data(o).has("menu") ? a = mUtil.data(o).get("menu") : (r.init(t),
                r.reset(),
                r.build(),
                mUtil.data(o).set("menu", a)),
                a
            },
            init: function(t) {
                a.events = [],
                a.eventHandlers = {},
                a.options = mUtil.deepExtend({}, l, t),
                a.pauseDropdownHoverTime = 0,
                a.uid = mUtil.getUniqueID()
            },
            update: function(t) {
                a.options = mUtil.deepExtend({}, l, t),
                a.pauseDropdownHoverTime = 0,
                r.reset(),
                a.eventHandlers = {},
                r.build(),
                mUtil.data(o).set("menu", a)
            },
            reload: function() {
                r.reset(),
                r.build()
            },
            build: function() {
                a.eventHandlers.event_1 = mUtil.on(o, ".m-menu__toggle", "click", r.handleSubmenuAccordion),
                ("dropdown" === r.getSubmenuMode() || r.isConditionalSubmenuDropdown()) && (a.eventHandlers.event_2 = mUtil.on(o, '[m-menu-submenu-toggle="hover"]', "mouseover", r.handleSubmenuDrodownHoverEnter),
                a.eventHandlers.event_3 = mUtil.on(o, '[m-menu-submenu-toggle="hover"]', "mouseout", r.handleSubmenuDrodownHoverExit),
                a.eventHandlers.event_4 = mUtil.on(o, '[m-menu-submenu-toggle="click"] > .m-menu__toggle, [m-menu-submenu-toggle="click"] > .m-menu__link .m-menu__toggle', "click", r.handleSubmenuDropdownClick),
                a.eventHandlers.event_5 = mUtil.on(o, '[m-menu-submenu-toggle="tab"] > .m-menu__toggle, [m-menu-submenu-toggle="tab"] > .m-menu__link .m-menu__toggle', "click", r.handleSubmenuDropdownTabClick)),
                a.eventHandlers.event_6 = mUtil.on(o, ".m-menu__item:not(.m-menu__item--submenu) > .m-menu__link:not(.m-menu__toggle):not(.m-menu__link--toggle-skip)", "click", r.handleLinkClick),
                a.options.scroll && a.options.scroll.height && r.scrollerInit()
            },
            reset: function() {
                mUtil.off(o, "click", a.eventHandlers.event_1),
                mUtil.off(o, "mouseover", a.eventHandlers.event_2),
                mUtil.off(o, "mouseout", a.eventHandlers.event_3),
                mUtil.off(o, "click", a.eventHandlers.event_4),
                mUtil.off(o, "click", a.eventHandlers.event_5),
                mUtil.off(o, "click", a.eventHandlers.event_6)
            },
            scrollerInit: function() {
                a.options.scroll && a.options.scroll.height && (mUtil.scrollerDestroy(o),
                mUtil.scrollerInit(o, {
                    disableForMobile: !0,
                    resetHeightOnDestroy: !0,
                    handleWindowResize: !0,
                    height: a.options.scroll.height
                }))
            },
            scrollerUpdate: function() {
                a.options.scroll && a.options.scroll.height ? mUtil.scrollerUpdate(o) : mUtil.scrollerDestroy(o)
            },
            scrollerTop: function() {
                a.options.scroll && a.options.scroll.height && mUtil.scrollerTop(o)
            },
            getSubmenuMode: function(t) {
                return mUtil.isInResponsiveRange("desktop") ? t && mUtil.hasAttr(t, "m-menu-submenu-toggle") ? mUtil.attr(t, "m-menu-submenu-toggle") : mUtil.isset(a.options.submenu, "desktop.state.body") ? mUtil.hasClass(i, a.options.submenu.desktop.state.body) ? a.options.submenu.desktop.state.mode : a.options.submenu.desktop.default : mUtil.isset(a.options.submenu, "desktop") ? a.options.submenu.desktop : void 0 : mUtil.isInResponsiveRange("tablet") && mUtil.isset(a.options.submenu, "tablet") ? a.options.submenu.tablet : !(!mUtil.isInResponsiveRange("mobile") || !mUtil.isset(a.options.submenu, "mobile")) && a.options.submenu.mobile
            },
            isConditionalSubmenuDropdown: function() {
                return !(!mUtil.isInResponsiveRange("desktop") || !mUtil.isset(a.options.submenu, "desktop.state.body"))
            },
            handleLinkClick: function(t) {
                !1 === r.eventTrigger("linkClick", this) && t.preventDefault(),
                ("dropdown" === r.getSubmenuMode(this) || r.isConditionalSubmenuDropdown()) && r.handleSubmenuDropdownClose(t, this)
            },
            handleSubmenuDrodownHoverEnter: function(t) {
                if ("accordion" !== r.getSubmenuMode(this) && !1 !== a.resumeDropdownHover()) {
                    "1" == this.getAttribute("data-hover") && (this.removeAttribute("data-hover"),
                    clearTimeout(this.getAttribute("data-timeout")),
                    this.removeAttribute("data-timeout")),
                    r.showSubmenuDropdown(this)
                }
            },
            handleSubmenuDrodownHoverExit: function(t) {
                if (!1 !== a.resumeDropdownHover() && "accordion" !== r.getSubmenuMode(this)) {
                    var e = this
                      , n = a.options.dropdown.timeout
                      , o = setTimeout(function() {
                        "1" == e.getAttribute("data-hover") && r.hideSubmenuDropdown(e, !0)
                    }, n);
                    e.setAttribute("data-hover", "1"),
                    e.setAttribute("data-timeout", o)
                }
            },
            handleSubmenuDropdownClick: function(t) {
                if ("accordion" !== r.getSubmenuMode(this)) {
                    var e = this.closest(".m-menu__item");
                    "accordion" != e.getAttribute("m-menu-submenu-mode") && (!1 === mUtil.hasClass(e, "m-menu__item--hover") ? (mUtil.addClass(e, "m-menu__item--open-dropdown"),
                    r.showSubmenuDropdown(e)) : (mUtil.removeClass(e, "m-menu__item--open-dropdown"),
                    r.hideSubmenuDropdown(e, !0)),
                    t.preventDefault())
                }
            },
            handleSubmenuDropdownTabClick: function(t) {
                if ("accordion" !== r.getSubmenuMode(this)) {
                    var e = this.closest(".m-menu__item");
                    "accordion" != e.getAttribute("m-menu-submenu-mode") && (0 == mUtil.hasClass(e, "m-menu__item--hover") && (mUtil.addClass(e, "m-menu__item--open-dropdown"),
                    r.showSubmenuDropdown(e)),
                    t.preventDefault())
                }
            },
            handleSubmenuDropdownClose: function(t, e) {
                if ("accordion" !== r.getSubmenuMode(e)) {
                    var a = o.querySelectorAll(".m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)");
                    if (a.length > 0 && !1 === mUtil.hasClass(e, "m-menu__toggle") && 0 === e.querySelectorAll(".m-menu__toggle").length)
                        for (var n = 0, i = a.length; n < i; n++)
                            r.hideSubmenuDropdown(a[0], !0)
                }
            },
            handleSubmenuAccordion: function(t, e) {
                var n, o = e || this;
                if ("dropdown" === r.getSubmenuMode(e) && (n = o.closest(".m-menu__item")) && "accordion" != n.getAttribute("m-menu-submenu-mode"))
                    t.preventDefault();
                else {
                    var i = o.closest(".m-menu__item")
                      , l = mUtil.child(i, ".m-menu__submenu, .m-menu__inner");
                    if (!mUtil.hasClass(o.closest(".m-menu__item"), "m-menu__item--open-always") && i && l) {
                        t.preventDefault();
                        var s = a.options.accordion.slideSpeed;
                        if (!1 === mUtil.hasClass(i, "m-menu__item--open")) {
                            if (!1 === a.options.accordion.expandAll) {
                                var d = o.closest(".m-menu__nav, .m-menu__subnav")
                                  , c = mUtil.children(d, ".m-menu__item.m-menu__item--open.m-menu__item--submenu:not(.m-menu__item--expanded):not(.m-menu__item--open-always)");
                                if (d && c)
                                    for (var m = 0, u = c.length; m < u; m++) {
                                        var p = c[0]
                                          , f = mUtil.child(p, ".m-menu__submenu");
                                        f && mUtil.slideUp(f, s, function() {
                                            r.scrollerUpdate(),
                                            mUtil.removeClass(p, "m-menu__item--open")
                                        })
                                    }
                            }
                            mUtil.slideDown(l, s, function() {
                                r.scrollToItem(o),
                                r.scrollerUpdate(),
                                r.eventTrigger("submenuToggle", l)
                            }),
                            mUtil.addClass(i, "m-menu__item--open")
                        } else
                            mUtil.slideUp(l, s, function() {
                                r.scrollToItem(o),
                                r.eventTrigger("submenuToggle", l)
                            }),
                            mUtil.removeClass(i, "m-menu__item--open")
                    }
                }
            },
            scrollToItem: function(t) {
                mUtil.isInResponsiveRange("desktop") && a.options.accordion.autoScroll && "1" !== o.getAttribute("m-menu-scrollable") && mUtil.scrollTo(t, a.options.accordion.autoScrollSpeed)
            },
            hideSubmenuDropdown: function(t, e) {
                e && (mUtil.removeClass(t, "m-menu__item--hover"),
                mUtil.removeClass(t, "m-menu__item--active-tab")),
                t.removeAttribute("data-hover"),
                t.getAttribute("m-menu-dropdown-toggle-class") && mUtil.removeClass(i, t.getAttribute("m-menu-dropdown-toggle-class"));
                var a = t.getAttribute("data-timeout");
                t.removeAttribute("data-timeout"),
                clearTimeout(a)
            },
            showSubmenuDropdown: function(t) {
                var e = o.querySelectorAll(".m-menu__item--submenu.m-menu__item--hover, .m-menu__item--submenu.m-menu__item--active-tab");
                if (e)
                    for (var a = 0, n = e.length; a < n; a++) {
                        var l = e[a];
                        t !== l && !1 === l.contains(t) && !1 === t.contains(l) && r.hideSubmenuDropdown(l, !0)
                    }
                r.adjustSubmenuDropdownArrowPos(t),
                mUtil.addClass(t, "m-menu__item--hover"),
                t.getAttribute("m-menu-dropdown-toggle-class") && mUtil.addClass(i, t.getAttribute("m-menu-dropdown-toggle-class"))
            },
            createSubmenuDropdownClickDropoff: function(t) {
                var e, a = (e = mUtil.child(t, ".m-menu__submenu") ? mUtil.css(e, "z-index") : 0) - 1, n = document.createElement('<div class="m-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + a + '"></div>');
                i.appendChild(n),
                mUtil.addEvent(n, "click", function(e) {
                    e.stopPropagation(),
                    e.preventDefault(),
                    mUtil.remove(this),
                    r.hideSubmenuDropdown(t, !0)
                })
            },
            adjustSubmenuDropdownArrowPos: function(t) {
                var e = mUtil.child(t, ".m-menu__submenu")
                  , a = mUtil.child(e, ".m-menu__arrow.m-menu__arrow--adjust");
                mUtil.child(e, ".m-menu__subnav");
                if (a) {
                    var n = 0;
                    mUtil.child(t, ".m-menu__link");
                    mUtil.hasClass(e, "m-menu__submenu--classic") || mUtil.hasClass(e, "m-menu__submenu--fixed") ? (mUtil.hasClass(e, "m-menu__submenu--right") ? (n = mUtil.outerWidth(t) / 2,
                    mUtil.hasClass(e, "m-menu__submenu--pull") && (mUtil.isRTL() ? n += Math.abs(parseFloat(mUtil.css(e, "margin-left"))) : n += Math.abs(parseFloat(mUtil.css(e, "margin-right")))),
                    n = parseInt(mUtil.css(e, "width")) - n) : mUtil.hasClass(e, "m-menu__submenu--left") && (n = mUtil.outerWidth(t) / 2,
                    mUtil.hasClass(e, "m-menu__submenu--pull") && (mUtil.isRTL() ? n += Math.abs(parseFloat(mUtil.css(e, "margin-right"))) : n += Math.abs(parseFloat(mUtil.css(e, "margin-left"))))),
                    mUtil.isRTL() ? mUtil.css(a, "right", n + "px") : mUtil.css(a, "left", n + "px")) : (mUtil.hasClass(e, "m-menu__submenu--center") || mUtil.hasClass(e, "m-menu__submenu--full")) && (n = mUtil.offset(t).left - (mUtil.getViewPort().width - parseInt(mUtil.css(e, "width"))) / 2,
                    n += mUtil.outerWidth(t) / 2,
                    mUtil.css(a, "left", n + "px"),
                    mUtil.isRTL() && mUtil.css(a, "right", "auto"))
                }
            },
            pauseDropdownHover: function(t) {
                var e = new Date;
                a.pauseDropdownHoverTime = e.getTime() + t
            },
            resumeDropdownHover: function() {
                return (new Date).getTime() > a.pauseDropdownHoverTime
            },
            resetActiveItem: function(t) {
                for (var e, n, i = 0, l = (e = o.querySelectorAll(".m-menu__item--active")).length; i < l; i++) {
                    var r = e[0];
                    mUtil.removeClass(r, "m-menu__item--active"),
                    mUtil.hide(mUtil.child(r, ".m-menu__submenu"));
                    for (var s = 0, d = (n = mUtil.parents(r, ".m-menu__item--submenu")).length; s < d; s++) {
                        var c = n[i];
                        mUtil.removeClass(c, "m-menu__item--open"),
                        mUtil.hide(mUtil.child(c, ".m-menu__submenu"))
                    }
                }
                if (!1 === a.options.accordion.expandAll && (e = o.querySelectorAll(".m-menu__item--open")))
                    for (i = 0,
                    l = e.length; i < l; i++)
                        mUtil.removeClass(n[0], "m-menu__item--open")
            },
            setActiveItem: function(t) {
                r.resetActiveItem(),
                mUtil.addClass(t, "m-menu__item--active");
                for (var e = mUtil.parents(t, ".m-menu__item--submenu"), a = 0, n = e.length; a < n; a++)
                    mUtil.addClass(e[a], "m-menu__item--open")
            },
            getBreadcrumbs: function(t) {
                var e, a = [], n = mUtil.child(t, ".m-menu__link");
                a.push({
                    text: e = mUtil.child(n, ".m-menu__link-text") ? e.innerHTML : "",
                    title: n.getAttribute("title"),
                    href: n.getAttribute("href")
                });
                for (var o = mUtil.parents(t, ".m-menu__item--submenu"), i = 0, l = o.length; i < l; i++) {
                    var r = mUtil.child(o[i], ".m-menu__link");
                    a.push({
                        text: e = mUtil.child(r, ".m-menu__link-text") ? e.innerHTML : "",
                        title: r.getAttribute("title"),
                        href: r.getAttribute("href")
                    })
                }
                return a.reverse()
            },
            getPageTitle: function(t) {
                var e;
                return mUtil.child(t, ".m-menu__link-text") ? e.innerHTML : ""
            },
            eventTrigger: function(t, e) {
                for (var n = 0; n < a.events.length; n++) {
                    var o = a.events[n];
                    o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0,
                    o.handler.call(this, a, e)) : o.handler.call(this, a, e))
                }
            },
            addEvent: function(t, e, n) {
                a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                })
            },
            removeEvent: function(t) {
                a.events[t] && delete a.events[t]
            }
        };
        return a.setDefaults = function(t) {
            l = t
        }
        ,
        a.scrollerUpdate = function() {
            return r.scrollerUpdate()
        }
        ,
        a.scrollerTop = function() {
            return r.scrollerTop()
        }
        ,
        a.setActiveItem = function(t) {
            return r.setActiveItem(t)
        }
        ,
        a.reload = function() {
            return r.reload()
        }
        ,
        a.update = function(t) {
            return r.update(t)
        }
        ,
        a.getBreadcrumbs = function(t) {
            return r.getBreadcrumbs(t)
        }
        ,
        a.getPageTitle = function(t) {
            return r.getPageTitle(t)
        }
        ,
        a.getSubmenuMode = function(t) {
            return r.getSubmenuMode(t)
        }
        ,
        a.hideDropdown = function(t) {
            r.hideSubmenuDropdown(t, !0)
        }
        ,
        a.pauseDropdownHover = function(t) {
            r.pauseDropdownHover(t)
        }
        ,
        a.resumeDropdownHover = function() {
            return r.resumeDropdownHover()
        }
        ,
        a.on = function(t, e) {
            return r.addEvent(t, e)
        }
        ,
        a.off = function(t) {
            return r.removeEvent(t)
        }
        ,
        a.one = function(t, e) {
            return r.addEvent(t, e, !0)
        }
        ,
        r.construct.apply(a, [e]),
        mUtil.addResizeHandler(function() {
            n && a.reload()
        }),
        n = !0,
        a
    }
};
document.addEventListener("click", function(t) {
    var e;
    if (e = mUtil.get("body").querySelectorAll('.m-menu__nav .m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]'))
        for (var a = 0, n = e.length; a < n; a++) {
            var o = e[a].closest(".m-menu__nav").parentNode;
            if (o) {
                var i, l = mUtil.data(o).get("menu");
                if (!l)
                    break;
                if (!l || "dropdown" !== l.getSubmenuMode())
                    break;
                if (t.target !== o && !1 === o.contains(t.target))
                    if (i = o.querySelectorAll('.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]'))
                        for (var r = 0, s = i.length; r < s; r++)
                            l.hideDropdown(i[r])
            }
        }
});
var mOffcanvas = function(t, e) {
    var a = this
      , n = mUtil.get(t)
      , o = mUtil.get("body");
    if (n) {
        var i = {}
          , l = {
            construct: function(t) {
                return mUtil.data(n).has("offcanvas") ? a = mUtil.data(n).get("offcanvas") : (l.init(t),
                l.build(),
                mUtil.data(n).set("offcanvas", a)),
                a
            },
            init: function(t) {
                a.events = [],
                a.options = mUtil.deepExtend({}, i, t),
                a.overlay,
                a.classBase = a.options.baseClass,
                a.classShown = a.classBase + "--on",
                a.classOverlay = a.classBase + "-overlay",
                a.state = mUtil.hasClass(n, a.classShown) ? "shown" : "hidden"
            },
            build: function() {
                if (a.options.toggleBy)
                    if ("string" == typeof a.options.toggleBy)
                        mUtil.addEvent(a.options.toggleBy, "click", l.toggle);
                    else if (a.options.toggleBy && a.options.toggleBy[0] && a.options.toggleBy[0].target)
                        for (var t in a.options.toggleBy)
                            mUtil.addEvent(a.options.toggleBy[t].target, "click", l.toggle);
                    else
                        a.options.toggleBy && a.options.toggleBy.target && mUtil.addEvent(a.options.toggleBy.target, "click", l.toggle);
                var e = mUtil.get(a.options.closeBy);
                e && mUtil.addEvent(e, "click", l.hide)
            },
            toggle: function() {
                l.eventTrigger("toggle"),
                "shown" == a.state ? l.hide(this) : l.show(this)
            },
            show: function(t) {
                "shown" != a.state && (l.eventTrigger("beforeShow"),
                l.togglerClass(t, "show"),
                mUtil.addClass(o, a.classShown),
                mUtil.addClass(n, a.classShown),
                a.state = "shown",
                a.options.overlay && (a.overlay = mUtil.insertAfter(document.createElement("DIV"), n),
                mUtil.addClass(a.overlay, a.classOverlay),
                mUtil.addEvent(a.overlay, "click", function(e) {
                    e.stopPropagation(),
                    e.preventDefault(),
                    l.hide(t)
                })),
                l.eventTrigger("afterShow"))
            },
            hide: function(t) {
                "hidden" != a.state && (l.eventTrigger("beforeHide"),
                l.togglerClass(t, "hide"),
                mUtil.removeClass(o, a.classShown),
                mUtil.removeClass(n, a.classShown),
                a.state = "hidden",
                a.options.overlay && a.overlay && mUtil.remove(a.overlay),
                l.eventTrigger("afterHide"))
            },
            togglerClass: function(t, e) {
                var n, o = mUtil.attr(t, "id");
                if (a.options.toggleBy && a.options.toggleBy[0] && a.options.toggleBy[0].target)
                    for (var i in a.options.toggleBy)
                        a.options.toggleBy[i].target === o && (n = a.options.toggleBy[i]);
                else
                    a.options.toggleBy && a.options.toggleBy.target && (n = a.options.toggleBy);
                if (n) {
                    var l = mUtil.get(n.target);
                    "show" === e && mUtil.addClass(l, n.state),
                    "hide" === e && mUtil.removeClass(l, n.state)
                }
            },
            eventTrigger: function(t, e) {
                for (var n = 0; n < a.events.length; n++) {
                    var o = a.events[n];
                    o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0,
                    o.handler.call(this, a, e)) : o.handler.call(this, a, e))
                }
            },
            addEvent: function(t, e, n) {
                a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                })
            }
        };
        return a.setDefaults = function(t) {
            i = t
        }
        ,
        a.hide = function() {
            return l.hide()
        }
        ,
        a.show = function() {
            return l.show()
        }
        ,
        a.on = function(t, e) {
            return l.addEvent(t, e)
        }
        ,
        a.one = function(t, e) {
            return l.addEvent(t, e, !0)
        }
        ,
        l.construct.apply(a, [e]),
        !0,
        a
    }
}
  , mPortlet = function(t, e) {
    var a = this
      , n = mUtil.get(t)
      , o = mUtil.get("body");
    if (n) {
        var l = {
            bodyToggleSpeed: 400,
            tooltips: !0,
            tools: {
                toggle: {
                    collapse: "Collapse",
                    expand: "Expand"
                },
                reload: "Reload",
                remove: "Remove",
                fullscreen: {
                    on: "Fullscreen",
                    off: "Exit Fullscreen"
                }
            },
            sticky: {
                offset: 300,
                zIndex: 98
            }
        }
          , r = {
            construct: function(t) {
                return mUtil.data(n).has("portlet") ? a = mUtil.data(n).get("portlet") : (r.init(t),
                r.build(),
                mUtil.data(n).set("portlet", a)),
                a
            },
            init: function(t) {
                a.element = n,
                a.events = [],
                a.options = mUtil.deepExtend({}, l, t),
                a.head = mUtil.child(n, ".m-portlet__head"),
                a.foot = mUtil.child(n, ".m-portlet__foot"),
                mUtil.child(n, ".m-portlet__body") ? a.body = mUtil.child(n, ".m-portlet__body") : 0 !== mUtil.child(n, ".m-form").length && (a.body = mUtil.child(n, ".m-form"))
            },
            build: function() {
                var t = mUtil.find(a.head, "[m-portlet-tool=remove]");
                t && mUtil.addEvent(t, "click", function(t) {
                    t.preventDefault(),
                    r.remove()
                });
                var e = mUtil.find(a.head, "[m-portlet-tool=reload]");
                e && mUtil.addEvent(e, "click", function(t) {
                    t.preventDefault(),
                    r.reload()
                });
                var n = mUtil.find(a.head, "[m-portlet-tool=toggle]");
                n && mUtil.addEvent(n, "click", function(t) {
                    t.preventDefault(),
                    r.toggle()
                });
                var o = mUtil.find(a.head, "[m-portlet-tool=fullscreen]");
                o && mUtil.addEvent(o, "click", function(t) {
                    t.preventDefault(),
                    r.fullscreen()
                }),
                r.setupTooltips()
            },
            onScrollSticky: function() {
                window.pageYOffset > a.options.sticky.offset ? !1 === mUtil.hasClass(o, "m-portlet--sticky") && (r.eventTrigger("stickyOn"),
                mUtil.addClass(o, "m-portlet--sticky"),
                mUtil.addClass(n, "m-portlet--sticky"),
                r.updateSticky()) : mUtil.hasClass(o, "m-portlet--sticky") && (r.eventTrigger("stickyOff"),
                mUtil.removeClass(o, "m-portlet--sticky"),
                mUtil.removeClass(n, "m-portlet--sticky"),
                r.resetSticky())
            },
            initSticky: function() {
                a.head && window.addEventListener("scroll", r.onScrollSticky)
            },
            updateSticky: function() {
                var t, e, n;
                a.head && (mUtil.hasClass(o, "m-portlet--sticky") && (t = a.options.sticky.position.top instanceof Function ? parseInt(a.options.sticky.position.top.call()) : parseInt(a.options.sticky.position.top),
                e = a.options.sticky.position.left instanceof Function ? parseInt(a.options.sticky.position.left.call()) : parseInt(a.options.sticky.position.left),
                n = a.options.sticky.position.right instanceof Function ? parseInt(a.options.sticky.position.right.call()) : parseInt(a.options.sticky.position.right),
                mUtil.css(a.head, "z-index", a.options.sticky.zIndex),
                mUtil.css(a.head, "top", t + "px"),
                mUtil.isRTL() ? (mUtil.css(a.head, "left", n + "px"),
                mUtil.css(a.head, "right", e + "px")) : (mUtil.css(a.head, "left", e + "px"),
                mUtil.css(a.head, "right", n + "px"))))
            },
            resetSticky: function() {
                a.head && !1 === mUtil.hasClass(o, "m-portlet--sticky") && (mUtil.css(a.head, "z-index", ""),
                mUtil.css(a.head, "top", ""),
                mUtil.css(a.head, "left", ""),
                mUtil.css(a.head, "right", ""))
            },
            destroySticky: function() {
                a.head && (r.resetSticky(),
                window.removeEventListener("scroll", r.onScrollSticky))
            },
            remove: function() {
                !1 !== r.eventTrigger("beforeRemove") && (mUtil.hasClass(o, "m-portlet--fullscreen") && mUtil.hasClass(n, "m-portlet--fullscreen") && r.fullscreen("off"),
                r.removeTooltips(),
                mUtil.remove(n),
                r.eventTrigger("afterRemove"))
            },
            setContent: function(t) {
                t && (a.body.innerHTML = t)
            },
            getBody: function() {
                return a.body
            },
            getSelf: function() {
                return n
            },
            setupTooltips: function() {
                if (a.options.tooltips) {
                    var t = mUtil.hasClass(n, "m-portlet--collapse") || mUtil.hasClass(n, "m-portlet--collapsed")
                      , e = mUtil.hasClass(o, "m-portlet--fullscreen") && mUtil.hasClass(n, "m-portlet--fullscreen")
                      , i = mUtil.find(a.head, "[m-portlet-tool=remove]");
                    if (i) {
                        var l = e ? "bottom" : "top"
                          , r = new Tooltip(i,{
                            title: a.options.tools.remove,
                            placement: l,
                            offset: e ? "0,10px,0,0" : "0,5px",
                            trigger: "hover",
                            template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + l + '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>'
                        });
                        mUtil.data(i).set("tooltip", r)
                    }
                    var s = mUtil.find(a.head, "[m-portlet-tool=reload]");
                    if (s) {
                        l = e ? "bottom" : "top",
                        r = new Tooltip(s,{
                            title: a.options.tools.reload,
                            placement: l,
                            offset: e ? "0,10px,0,0" : "0,5px",
                            trigger: "hover",
                            template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + l + '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>'
                        });
                        mUtil.data(s).set("tooltip", r)
                    }
                    var d = mUtil.find(a.head, "[m-portlet-tool=toggle]");
                    if (d) {
                        l = e ? "bottom" : "top",
                        r = new Tooltip(d,{
                            title: t ? a.options.tools.toggle.expand : a.options.tools.toggle.collapse,
                            placement: l,
                            offset: e ? "0,10px,0,0" : "0,5px",
                            trigger: "hover",
                            template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + l + '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>'
                        });
                        mUtil.data(d).set("tooltip", r)
                    }
                    var c = mUtil.find(a.head, "[m-portlet-tool=fullscreen]");
                    if (c) {
                        l = e ? "bottom" : "top",
                        r = new Tooltip(c,{
                            title: e ? a.options.tools.fullscreen.off : a.options.tools.fullscreen.on,
                            placement: l,
                            offset: e ? "0,10px,0,0" : "0,5px",
                            trigger: "hover",
                            template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + l + '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>'
                        });
                        mUtil.data(c).set("tooltip", r)
                    }
                }
            },
            removeTooltips: function() {
                if (a.options.tooltips) {
                    var t = mUtil.find(a.head, "[m-portlet-tool=remove]");
                    t && mUtil.data(t).has("tooltip") && mUtil.data(t).get("tooltip").dispose();
                    var e = mUtil.find(a.head, "[m-portlet-tool=reload]");
                    e && mUtil.data(e).has("tooltip") && mUtil.data(e).get("tooltip").dispose();
                    var n = mUtil.find(a.head, "[m-portlet-tool=toggle]");
                    n && mUtil.data(n).has("tooltip") && mUtil.data(n).get("tooltip").dispose();
                    var o = mUtil.find(a.head, "[m-portlet-tool=fullscreen]");
                    o && mUtil.data(o).has("tooltip") && mUtil.data(o).get("tooltip").dispose()
                }
            },
            reload: function() {
                r.eventTrigger("reload")
            },
            toggle: function() {
                mUtil.hasClass(n, "m-portlet--collapse") || mUtil.hasClass(n, "m-portlet--collapsed") ? r.expand() : r.collapse()
            },
            collapse: function() {
                if (!1 !== r.eventTrigger("beforeCollapse")) {
                    mUtil.slideUp(a.body, a.options.bodyToggleSpeed, function() {
                        r.eventTrigger("afterCollapse")
                    }),
                    mUtil.addClass(n, "m-portlet--collapse");
                    var t = mUtil.find(a.head, "[m-portlet-tool=toggle]");
                    t && mUtil.data(t).has("tooltip") && mUtil.data(t).get("tooltip").updateTitleContent(a.options.tools.toggle.expand)
                }
            },
            expand: function() {
                if (!1 !== r.eventTrigger("beforeExpand")) {
                    mUtil.slideDown(a.body, a.options.bodyToggleSpeed, function() {
                        r.eventTrigger("afterExpand")
                    }),
                    mUtil.removeClass(n, "m-portlet--collapse"),
                    mUtil.removeClass(n, "m-portlet--collapsed");
                    var t = mUtil.find(a.head, "[m-portlet-tool=toggle]");
                    t && mUtil.data(t).has("tooltip") && mUtil.data(t).get("tooltip").updateTitleContent(a.options.tools.toggle.collapse)
                }
            },
            fullscreen: function(t) {
                if ("off" === t || mUtil.hasClass(o, "m-portlet--fullscreen") && mUtil.hasClass(n, "m-portlet--fullscreen"))
                    r.eventTrigger("beforeFullscreenOff"),
                    mUtil.removeClass(o, "m-portlet--fullscreen"),
                    mUtil.removeClass(n, "m-portlet--fullscreen"),
                    r.removeTooltips(),
                    r.setupTooltips(),
                    a.foot && (mUtil.css(a.body, "margin-bottom", ""),
                    mUtil.css(a.foot, "margin-top", "")),
                    r.eventTrigger("afterFullscreenOff");
                else {
                    if (r.eventTrigger("beforeFullscreenOn"),
                    mUtil.addClass(n, "m-portlet--fullscreen"),
                    mUtil.addClass(o, "m-portlet--fullscreen"),
                    r.removeTooltips(),
                    r.setupTooltips(),
                    a.foot) {
                        var e = parseInt(mUtil.css(a.foot, "height"))
                          , i = parseInt(mUtil.css(a.foot, "height")) + parseInt(mUtil.css(a.head, "height"));
                        mUtil.css(a.body, "margin-bottom", e + "px"),
                        mUtil.css(a.foot, "margin-top", "-" + i + "px")
                    }
                    r.eventTrigger("afterFullscreenOn")
                }
            },
            eventTrigger: function(t) {
                for (i = 0; i < a.events.length; i++) {
                    var e = a.events[i];
                    e.name == t && (1 == e.one ? 0 == e.fired && (a.events[i].fired = !0,
                    e.handler.call(this, a)) : e.handler.call(this, a))
                }
            },
            addEvent: function(t, e, n) {
                return a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                }),
                a
            }
        };
        return a.setDefaults = function(t) {
            l = t
        }
        ,
        a.remove = function() {
            return r.remove(html)
        }
        ,
        a.initSticky = function() {
            return r.initSticky()
        }
        ,
        a.updateSticky = function() {
            return r.updateSticky()
        }
        ,
        a.resetSticky = function() {
            return r.resetSticky()
        }
        ,
        a.destroySticky = function() {
            return r.destroySticky()
        }
        ,
        a.reload = function() {
            return r.reload()
        }
        ,
        a.setContent = function(t) {
            return r.setContent(t)
        }
        ,
        a.toggle = function() {
            return r.toggle()
        }
        ,
        a.collapse = function() {
            return r.collapse()
        }
        ,
        a.expand = function() {
            return r.expand()
        }
        ,
        a.fullscreen = function() {
            return r.fullscreen("on")
        }
        ,
        a.unFullscreen = function() {
            return r.fullscreen("off")
        }
        ,
        a.getBody = function() {
            return r.getBody()
        }
        ,
        a.getSelf = function() {
            return r.getSelf()
        }
        ,
        a.on = function(t, e) {
            return r.addEvent(t, e)
        }
        ,
        a.one = function(t, e) {
            return r.addEvent(t, e, !0)
        }
        ,
        r.construct.apply(a, [e]),
        a
    }
}
  , mQuicksearch = function(t, e) {
    var a = this
      , n = mUtil.get(t)
      , o = mUtil.get("body");
    if (n) {
        var l = {
            mode: "default",
            minLength: 1,
            maxHeight: 300,
            requestTimeout: 200,
            inputTarget: "m_quicksearch_input",
            iconCloseTarget: "m_quicksearch_close",
            iconCancelTarget: "m_quicksearch_cancel",
            iconSearchTarget: "m_quicksearch_search",
            spinnerClass: "m-loader m-loader--skin-light m-loader--right",
            hasResultClass: "m-list-search--has-result",
            templates: {
                error: '<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">{{message}}</div></div>'
            }
        }
          , r = {
            construct: function(t) {
                return mUtil.data(n).has("quicksearch") ? a = mUtil.data(n).get("quicksearch") : (r.init(t),
                r.build(),
                mUtil.data(n).set("quicksearch", a)),
                a
            },
            init: function(t) {
                a.element = n,
                a.events = [],
                a.options = mUtil.deepExtend({}, l, t),
                a.query = "",
                a.form = mUtil.find(n, "form"),
                a.input = mUtil.get(a.options.inputTarget),
                a.iconClose = mUtil.get(a.options.iconCloseTarget),
                "default" == a.options.mode && (a.iconSearch = mUtil.get(a.options.iconSearchTarget),
                a.iconCancel = mUtil.get(a.options.iconCancelTarget)),
                a.dropdown = new mDropdown(n,{
                    mobileOverlay: !1
                }),
                a.cancelTimeout,
                a.processing = !1,
                a.requestTimeout = !1
            },
            build: function() {
                mUtil.addEvent(a.input, "keyup", r.search),
                mUtil.find(n, "form").onkeypress = function(t) {
                    13 == (t.charCode || t.keyCode || 0) && t.preventDefault()
                }
                ,
                "default" == a.options.mode ? (mUtil.addEvent(a.input, "focus", r.showDropdown),
                mUtil.addEvent(a.iconCancel, "click", r.handleCancel),
                mUtil.addEvent(a.iconSearch, "click", function() {
                    mUtil.isInResponsiveRange("tablet-and-mobile") && (mUtil.addClass(o, "m-header-search--mobile-expanded"),
                    a.input.focus())
                }),
                mUtil.addEvent(a.iconClose, "click", function() {
                    mUtil.isInResponsiveRange("tablet-and-mobile") && (mUtil.removeClass(o, "m-header-search--mobile-expanded"),
                    r.closeDropdown())
                })) : "dropdown" == a.options.mode && (a.dropdown.on("afterShow", function() {
                    a.input.focus()
                }),
                mUtil.addEvent(a.iconClose, "click", r.closeDropdown))
            },
            showProgress: function() {
                return a.processing = !0,
                mUtil.addClass(a.form, a.options.spinnerClass),
                r.handleCancelIconVisibility("off"),
                a
            },
            hideProgress: function() {
                return a.processing = !1,
                mUtil.removeClass(a.form, a.options.spinnerClass),
                r.handleCancelIconVisibility("on"),
                mUtil.addClass(n, a.options.hasResultClass),
                a
            },
            search: function(t) {
                if (a.query = a.input.value,
                0 === a.query.length && (r.handleCancelIconVisibility("on"),
                mUtil.removeClass(n, a.options.hasResultClass),
                mUtil.removeClass(a.form, a.options.spinnerClass)),
                !(a.query.length < a.options.minLength || 1 == a.processing))
                    return a.requestTimeout && clearTimeout(a.requestTimeout),
                    a.requestTimeout = !1,
                    a.requestTimeout = setTimeout(function() {
                        r.eventTrigger("search")
                    }, a.options.requestTimeout),
                    a
            },
            handleCancelIconVisibility: function(t) {
                "on" == t ? 0 === a.input.value.length ? (a.iconCancel && mUtil.css(a.iconCancel, "visibility", "hidden"),
                a.iconClose && mUtil.css(a.iconClose, "visibility", "visible")) : (clearTimeout(a.cancelTimeout),
                a.cancelTimeout = setTimeout(function() {
                    a.iconCancel && mUtil.css(a.iconCancel, "visibility", "visible"),
                    a.iconClose && mUtil.css(a.iconClose, "visibility", "visible")
                }, 500)) : (a.iconCancel && mUtil.css(a.iconCancel, "visibility", "hidden"),
                a.iconClose && mUtil.css(a.iconClose, "visibility", "hidden"))
            },
            handleCancel: function(t) {
                a.input.value = "",
                mUtil.css(a.iconCancel, "visibility", "hidden"),
                mUtil.removeClass(n, a.options.hasResultClass),
                r.closeDropdown()
            },
            closeDropdown: function() {
                a.dropdown.hide()
            },
            showDropdown: function(t) {
                0 == a.dropdown.isShown() && a.input.value.length > a.options.minLength && 0 == a.processing && (console.log("show!!!"),
                a.dropdown.show(),
                t && (t.preventDefault(),
                t.stopPropagation()))
            },
            eventTrigger: function(t) {
                for (i = 0; i < a.events.length; i++) {
                    var e = a.events[i];
                    e.name == t && (1 == e.one ? 0 == e.fired && (a.events[i].fired = !0,
                    e.handler.call(this, a)) : e.handler.call(this, a))
                }
            },
            addEvent: function(t, e, n) {
                return a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                }),
                a
            }
        };
        return a.setDefaults = function(t) {
            l = t
        }
        ,
        a.search = function() {
            return r.handleSearch()
        }
        ,
        a.showResult = function(t) {
            return a.dropdown.setContent(t),
            r.showDropdown(),
            a
        }
        ,
        a.showError = function(t) {
            var e = a.options.templates.error.replace("{{message}}", t);
            return a.dropdown.setContent(e),
            r.showDropdown(),
            a
        }
        ,
        a.showProgress = function() {
            return r.showProgress()
        }
        ,
        a.hideProgress = function() {
            return r.hideProgress()
        }
        ,
        a.search = function() {
            return r.search()
        }
        ,
        a.on = function(t, e) {
            return r.addEvent(t, e)
        }
        ,
        a.one = function(t, e) {
            return r.addEvent(t, e, !0)
        }
        ,
        r.construct.apply(a, [e]),
        a
    }
}
  , mScrollTop = function(t, e) {
    var a = this
      , n = mUtil.get(t)
      , o = mUtil.get("body");
    if (n) {
        var i = {
            offset: 300,
            speed: 600
        }
          , l = {
            construct: function(t) {
                return mUtil.data(n).has("scrolltop") ? a = mUtil.data(n).get("scrolltop") : (l.init(t),
                l.build(),
                mUtil.data(n).set("scrolltop", a)),
                a
            },
            init: function(t) {
                a.events = [],
                a.options = mUtil.deepExtend({}, i, t)
            },
            build: function() {
                navigator.userAgent.match(/iPhone|iPad|iPod/i) ? (window.addEventListener("touchend", function() {
                    l.handle()
                }),
                window.addEventListener("touchcancel", function() {
                    l.handle()
                }),
                window.addEventListener("touchleave", function() {
                    l.handle()
                })) : window.addEventListener("scroll", function() {
                    l.handle()
                }),
                mUtil.addEvent(n, "click", l.scroll)
            },
            handle: function() {
                window.pageYOffset > a.options.offset ? mUtil.addClass(o, "m-scroll-top--shown") : mUtil.removeClass(o, "m-scroll-top--shown")
            },
            scroll: function(t) {
                t.preventDefault(),
                mUtil.scrollTop(0, a.options.speed)
            },
            eventTrigger: function(t, e) {
                for (var n = 0; n < a.events.length; n++) {
                    var o = a.events[n];
                    o.name == t && (1 == o.one ? 0 == o.fired && (a.events[n].fired = !0,
                    o.handler.call(this, a, e)) : o.handler.call(this, a, e))
                }
            },
            addEvent: function(t, e, n) {
                a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                })
            }
        };
        return a.setDefaults = function(t) {
            i = t
        }
        ,
        a.on = function(t, e) {
            return l.addEvent(t, e)
        }
        ,
        a.one = function(t, e) {
            return l.addEvent(t, e, !0)
        }
        ,
        l.construct.apply(a, [e]),
        !0,
        a
    }
}
  , mToggle = function(t, e) {
    var a = this
      , n = mUtil.get(t);
    mUtil.get("body");
    if (n) {
        var o = {
            togglerState: "",
            targetState: ""
        }
          , l = {
            construct: function(t) {
                return mUtil.data(n).has("toggle") ? a = mUtil.data(n).get("toggle") : (l.init(t),
                l.build(),
                mUtil.data(n).set("toggle", a)),
                a
            },
            init: function(t) {
                a.element = n,
                a.events = [],
                a.options = mUtil.deepExtend({}, o, t),
                a.target = mUtil.get(a.options.target),
                a.targetState = a.options.targetState,
                a.togglerState = a.options.togglerState,
                a.state = mUtil.hasClasses(a.target, a.targetState) ? "on" : "off"
            },
            build: function() {
                mUtil.addEvent(n, "mouseup", l.toggle)
            },
            toggle: function() {
                return l.eventTrigger("beforeToggle"),
                "off" == a.state ? l.toggleOn() : l.toggleOff(),
                a
            },
            toggleOn: function() {
                return l.eventTrigger("beforeOn"),
                mUtil.addClass(a.target, a.targetState),
                a.togglerState && mUtil.addClass(n, a.togglerState),
                a.state = "on",
                l.eventTrigger("afterOn"),
                l.eventTrigger("toggle"),
                a
            },
            toggleOff: function() {
                return l.eventTrigger("beforeOff"),
                mUtil.removeClass(a.target, a.targetState),
                a.togglerState && mUtil.removeClass(n, a.togglerState),
                a.state = "off",
                l.eventTrigger("afterOff"),
                l.eventTrigger("toggle"),
                a
            },
            eventTrigger: function(t) {
                for (i = 0; i < a.events.length; i++) {
                    var e = a.events[i];
                    e.name == t && (1 == e.one ? 0 == e.fired && (a.events[i].fired = !0,
                    e.handler.call(this, a)) : e.handler.call(this, a))
                }
            },
            addEvent: function(t, e, n) {
                return a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                }),
                a
            }
        };
        return a.setDefaults = function(t) {
            o = t
        }
        ,
        a.getState = function() {
            return a.state
        }
        ,
        a.toggle = function() {
            return l.toggle()
        }
        ,
        a.toggleOn = function() {
            return l.toggleOn()
        }
        ,
        a.toggle = function() {
            return l.toggleOff()
        }
        ,
        a.on = function(t, e) {
            return l.addEvent(t, e)
        }
        ,
        a.one = function(t, e) {
            return l.addEvent(t, e, !0)
        }
        ,
        l.construct.apply(a, [e]),
        a
    }
}
  , mWizard = function(t, e) {
    var a = this
      , n = mUtil.get(t);
    mUtil.get("body");
    if (n) {
        var o = {
            startStep: 1,
            manualStepForward: !1
        }
          , l = {
            construct: function(t) {
                return mUtil.data(n).has("wizard") ? a = mUtil.data(n).get("wizard") : (l.init(t),
                l.build(),
                mUtil.data(n).set("wizard", a)),
                a
            },
            init: function(t) {
                a.element = n,
                a.events = [],
                a.options = mUtil.deepExtend({}, o, t),
                a.steps = mUtil.findAll(n, ".m-wizard__step"),
                a.progress = mUtil.find(n, ".m-wizard__progress .progress-bar"),
                a.btnSubmit = mUtil.find(n, '[data-wizard-action="submit"]'),
                a.btnNext = mUtil.find(n, '[data-wizard-action="next"]'),
                a.btnPrev = mUtil.find(n, '[data-wizard-action="prev"]'),
                a.btnLast = mUtil.find(n, '[data-wizard-action="last"]'),
                a.btnFirst = mUtil.find(n, '[data-wizard-action="first"]'),
                a.events = [],
                a.currentStep = 1,
                a.stopped = !1,
                a.totalSteps = a.steps.length,
                a.options.startStep > 1 && l.goTo(a.options.startStep),
                l.updateUI()
            },
            build: function() {
                mUtil.addEvent(a.btnNext, "click", function(t) {
                    t.preventDefault(),
                    l.goNext()
                }),
                mUtil.addEvent(a.btnPrev, "click", function(t) {
                    t.preventDefault(),
                    l.goPrev()
                }),
                mUtil.addEvent(a.btnFirst, "click", function(t) {
                    t.preventDefault(),
                    l.goFirst()
                }),
                mUtil.addEvent(a.btnLast, "click", function(t) {
                    t.preventDefault(),
                    l.goLast()
                }),
                mUtil.on(n, ".m-wizard__step a.m-wizard__step-number", "click", function() {
                    for (var t, e = this.closest(".m-wizard__step"), n = mUtil.parents(this, ".m-wizard__steps"), o = mUtil.findAll(n, ".m-wizard__step"), i = 0, r = o.length; i < r; i++)
                        if (e === o[i]) {
                            t = i + 1;
                            break
                        }
                    t && (!1 === a.options.manualStepForward ? t < a.currentStep && l.goTo(t) : l.goTo(t))
                })
            },
            goTo: function(t) {
                if (!(t === a.currentStep || t > a.totalSteps || t < 0)) {
                    var e;
                    if (e = (t = t ? parseInt(t) : l.getNextStep()) > a.currentStep ? l.eventTrigger("beforeNext") : l.eventTrigger("beforePrev"),
                    !0 !== a.stopped)
                        return !1 !== e && (l.eventTrigger("beforeChange"),
                        a.currentStep = t,
                        l.updateUI(),
                        l.eventTrigger("change")),
                        t > a.startStep ? l.eventTrigger("afterNext") : l.eventTrigger("afterPrev"),
                        a;
                    a.stopped = !1
                }
            },
            setStepClass: function() {
                l.isLastStep() ? mUtil.addClass(n, "m-wizard--step-last") : mUtil.removeClass(n, "m-wizard--step-last"),
                l.isFirstStep() ? mUtil.addClass(n, "m-wizard--step-first") : mUtil.removeClass(n, "m-wizard--step-first"),
                l.isBetweenStep() ? mUtil.addClass(n, "m-wizard--step-between") : mUtil.removeClass(n, "m-wizard--step-between")
            },
            updateUI: function(t) {
                l.updateProgress(),
                l.handleTarget(),
                l.setStepClass();
                for (var e = 0, n = a.steps.length; e < n; e++)
                    mUtil.removeClass(a.steps[e], "m-wizard__step--current m-wizard__step--done");
                for (e = 1; e < a.currentStep; e++)
                    mUtil.addClass(a.steps[e - 1], "m-wizard__step--done");
                mUtil.addClass(a.steps[a.currentStep - 1], "m-wizard__step--current")
            },
            stop: function() {
                a.stopped = !0
            },
            start: function() {
                a.stopped = !1
            },
            isLastStep: function() {
                return a.currentStep === a.totalSteps
            },
            isFirstStep: function() {
                return 1 === a.currentStep
            },
            isBetweenStep: function() {
                return !1 === l.isLastStep() && !1 === l.isFirstStep()
            },
            goNext: function() {
                return l.goTo(l.getNextStep())
            },
            goPrev: function() {
                return l.goTo(l.getPrevStep())
            },
            goLast: function() {
                return l.goTo(a.totalSteps)
            },
            goFirst: function() {
                return l.goTo(1)
            },
            updateProgress: function() {
                if (a.progress)
                    if (mUtil.hasClass(n, "m-wizard--1")) {
                        var t = (a.currentStep - 1) / a.totalSteps * 100
                          , e = mUtil.find(n, ".m-wizard__step-number")
                          , o = parseInt(mUtil.css(e, "width"));
                        mUtil.css(a.progress, "width", "calc(" + t + "% + " + o / 2 + "px)")
                    } else if (mUtil.hasClass(n, "m-wizard--2")) {
                        a.currentStep;
                        var i = (a.currentStep - 1) * (1 / (a.totalSteps - 1) * 100);
                        mUtil.isInResponsiveRange("minimal-desktop-and-below") ? mUtil.css(a.progress, "height", i + "%") : mUtil.css(a.progress, "width", i + "%")
                    } else {
                        t = a.currentStep / a.totalSteps * 100;
                        mUtil.css(a.progress, "width", t + "%")
                    }
            },
            handleTarget: function() {
                var t = a.steps[a.currentStep - 1]
                  , e = mUtil.get(mUtil.attr(t, "m-wizard-target"))
                  , o = mUtil.find(n, ".m-wizard__form-step--current");
                mUtil.removeClass(o, "m-wizard__form-step--current"),
                mUtil.addClass(e, "m-wizard__form-step--current")
            },
            getNextStep: function() {
                return a.totalSteps >= a.currentStep + 1 ? a.currentStep + 1 : a.totalSteps
            },
            getPrevStep: function() {
                return a.currentStep - 1 >= 1 ? a.currentStep - 1 : 1
            },
            eventTrigger: function(t) {
                for (i = 0; i < a.events.length; i++) {
                    var e = a.events[i];
                    e.name == t && (1 == e.one ? 0 == e.fired && (a.events[i].fired = !0,
                    e.handler.call(this, a)) : e.handler.call(this, a))
                }
            },
            addEvent: function(t, e, n) {
                return a.events.push({
                    name: t,
                    handler: e,
                    one: n,
                    fired: !1
                }),
                a
            }
        };
        return a.setDefaults = function(t) {
            o = t
        }
        ,
        a.goNext = function() {
            return l.goNext()
        }
        ,
        a.goPrev = function() {
            return l.goPrev()
        }
        ,
        a.goLast = function() {
            return l.goLast()
        }
        ,
        a.stop = function() {
            return l.stop()
        }
        ,
        a.start = function() {
            return l.start()
        }
        ,
        a.goFirst = function() {
            return l.goFirst()
        }
        ,
        a.goTo = function(t) {
            return l.goTo(t)
        }
        ,
        a.getStep = function() {
            return a.currentStep
        }
        ,
        a.isLastStep = function() {
            return l.isLastStep()
        }
        ,
        a.isFirstStep = function() {
            return l.isFirstStep()
        }
        ,
        a.on = function(t, e) {
            return l.addEvent(t, e)
        }
        ,
        a.one = function(t, e) {
            return l.addEvent(t, e, !0)
        }
        ,
        l.construct.apply(a, [e]),
        a
    }
};
!function(t) {
    t.fn.mDatatable = t.fn.mDatatable || {},
    t.fn.mDatatable.checkbox = function(e, a) {
        var n = {
            selectedAllRows: !1,
            selectedRows: [],
            unselectedRows: [],
            init: function() {
                n.selectorEnabled() && (e.setDataSourceParam(a.vars.selectedAllRows, !1),
                e.stateRemove("checkbox"),
                a.vars.requestIds && e.setDataSourceParam(a.vars.requestIds, !0),
                t(e).on("m-datatable--on-reloaded", function() {
                    e.stateRemove("checkbox"),
                    e.setDataSourceParam(a.vars.selectedAllRows, !1),
                    n.selectedAllRows = !1,
                    n.selectedRows = [],
                    n.unselectedRows = []
                }),
                n.selectedAllRows = e.getDataSourceParam(a.vars.selectedAllRows),
                t(e).on("m-datatable--on-layout-updated", function(a, o) {
                    o.table == t(e.wrap).attr("id") && e.ready(function() {
                        n.initVars(),
                        n.initEvent(),
                        n.initSelect()
                    })
                }),
                t(e).on("m-datatable--on-check", function(a, o) {
                    o.forEach(function(t) {
                        n.selectedRows.push(t),
                        n.unselectedRows = n.remove(n.unselectedRows, t)
                    });
                    var i = {};
                    i.selectedRows = t.unique(n.selectedRows),
                    i.unselectedRows = t.unique(n.unselectedRows),
                    e.stateKeep("checkbox", i)
                }),
                t(e).on("m-datatable--on-uncheck", function(a, o) {
                    o.forEach(function(t) {
                        n.unselectedRows.push(t),
                        n.selectedRows = n.remove(n.selectedRows, t)
                    });
                    var i = {};
                    i.selectedRows = t.unique(n.selectedRows),
                    i.unselectedRows = t.unique(n.unselectedRows),
                    e.stateKeep("checkbox", i)
                }))
            },
            initEvent: function() {
                t(e.tableHead).find('.m-checkbox--all > [type="checkbox"]').click(function(o) {
                    if (n.selectedRows = n.unselectedRows = [],
                    e.stateRemove("checkbox"),
                    t(this).is(":checked") ? n.selectedAllRows = !0 : n.selectedAllRows = !1,
                    !a.vars.requestIds) {
                        t(this).is(":checked") && (n.selectedRows = t.makeArray(t(e.tableBody).find('.m-checkbox--single > [type="checkbox"]').map(function(e, a) {
                            return t(a).val()
                        })));
                        var i = {};
                        i.selectedRows = t.unique(n.selectedRows),
                        e.stateKeep("checkbox", i)
                    }
                    e.setDataSourceParam(a.vars.selectedAllRows, n.selectedAllRows),
                    t(e).trigger("m-datatable--on-click-checkbox", [t(this)])
                }),
                t(e.tableBody).find('.m-checkbox--single > [type="checkbox"]').click(function(o) {
                    var i = t(this).val();
                    t(this).is(":checked") ? (n.selectedRows.push(i),
                    n.unselectedRows = n.remove(n.unselectedRows, i)) : (n.unselectedRows.push(i),
                    n.selectedRows = n.remove(n.selectedRows, i)),
                    !a.vars.requestIds && n.selectedRows.length < 1 && t(e.tableHead).find('.m-checkbox--all > [type="checkbox"]').prop("checked", !1);
                    var l = {};
                    l.selectedRows = t.unique(n.selectedRows),
                    l.unselectedRows = t.unique(n.unselectedRows),
                    e.stateKeep("checkbox", l),
                    t(e).trigger("m-datatable--on-click-checkbox", [t(this)])
                })
            },
            initSelect: function() {
                n.selectedAllRows && a.vars.requestIds ? (e.hasClass("m-datatable--error") || t(e.tableHead).find('.m-checkbox--all > [type="checkbox"]').prop("checked", !0),
                e.setActiveAll(!0),
                n.unselectedRows.forEach(function(t) {
                    e.setInactive(t)
                })) : (n.selectedRows.forEach(function(t) {
                    e.setActive(t)
                }),
                !e.hasClass("m-datatable--error") && t(e.tableBody).find('.m-checkbox--single > [type="checkbox"]').not(":checked").length < 1 && t(e.tableHead).find('.m-checkbox--all > [type="checkbox"]').prop("checked", !0))
            },
            selectorEnabled: function() {
                return t.grep(e.options.columns, function(t, e) {
                    return t.selector || !1
                })[0]
            },
            initVars: function() {
                var t = e.stateGet("checkbox");
                void 0 !== t && (n.selectedRows = t.selectedRows || [],
                n.unselectedRows = t.unselectedRows || [])
            },
            getSelectedId: function(t) {
                if (n.initVars(),
                n.selectedAllRows && a.vars.requestIds) {
                    void 0 === t && (t = a.vars.rowIds);
                    var o = e.getObject(t, e.lastResponse) || [];
                    return o.length > 0 && n.unselectedRows.forEach(function(t) {
                        o = n.remove(o, parseInt(t))
                    }),
                    o
                }
                return n.selectedRows
            },
            remove: function(t, e) {
                return t.filter(function(t) {
                    return t !== e
                })
            }
        };
        return e.checkbox = function() {
            return n
        }
        ,
        "object" == typeof a && (a = t.extend(!0, {}, t.fn.mDatatable.checkbox.default, a),
        n.init.apply(this, [a])),
        e
    }
    ,
    t.fn.mDatatable.checkbox.default = {
        vars: {
            selectedAllRows: "selectedAllRows",
            requestIds: "requestIds",
            rowIds: "meta.rowIds"
        }
    }
}(jQuery);
var mLayout = function() {
    var horMenu;
    var asideMenu;
    var asideMenuOffcanvas;
    var horMenuOffcanvas;

    //== Header
    var initStickyHeader = function() {
        var tmp;
        var headerEl = mUtil.get('m_header');
        var options = {
            offset: {},
            minimize:{}       
        };

        if (mUtil.attr(headerEl, 'm-minimize-mobile') == 'hide') {
            options.minimize.mobile = {};
            options.minimize.mobile.on = 'm-header--hide';
            options.minimize.mobile.off = 'm-header--show';
        } else {
            options.minimize.mobile = false;
        }

        if (mUtil.attr(headerEl, 'm-minimize') == 'hide') {
            options.minimize.desktop = {};
            options.minimize.desktop.on = 'm-header--hide';
            options.minimize.desktop.off = 'm-header--show';
        } else {
            options.minimize.desktop = false;
        }

        if (tmp = mUtil.attr(headerEl, 'm-minimize-offset')) {
            options.offset.desktop = tmp;
        }

        if (tmp = mUtil.attr(headerEl, 'm-minimize-mobile-offset')) {
            options.offset.mobile = tmp;
        }        

        header = new mHeader('m_header', options);
    }

    //== Hor menu
    var initHorMenu = function() { 
        // init aside left offcanvas
        horMenuOffcanvas = new mOffcanvas('m_header_menu', {
            overlay: true,
            baseClass: 'm-aside-header-menu-mobile',
            closeBy: 'm_aside_header_menu_mobile_close_btn',
            toggleBy: {
                target: 'm_aside_header_menu_mobile_toggle',
                state: 'm-brand__toggler--active'
            }            
        });
        
        horMenu = new mMenu('m_header_menu', {
            submenu: {
                desktop: 'dropdown',
                tablet: 'accordion',
                mobile: 'accordion'
            },
            accordion: {   
                slideSpeed: 200,  // accordion toggle slide speed in milliseconds
                expandAll: false   // allow having multiple expanded accordions in the menu
            }
        });
    }

    // handle vertical menu
    var initLeftAsideMenu = function() {
        //== Init aside menu
        var menu = mUtil.get('m_ver_menu');
        var menuDesktopMode = (mUtil.attr(menu, 'm-menu-dropdown') === '1' ? 'dropdown' : 'accordion');

        asideMenu = new mMenu('m_ver_menu', {
            // submenu setup
            submenu: {
                desktop: {
                    // by default the menu mode set to accordion in desktop mode
                    default: menuDesktopMode,
                    // whenever body has this class switch the menu mode to dropdown
                    state: {
                        body: 'm-aside-left--minimize',  
                        mode: 'dropdown'
                    }
                },
                tablet: 'accordion', // menu set to accordion in tablet mode
                mobile: 'accordion'  // menu set to accordion in mobile mode
            },

            //accordion setup
            accordion: {
                autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
                expandAll: false   // allow having multiple expanded accordions in the menu
            }            
        });
    }

    // handle vertical menu
    var initLeftAside = function() {
        // init aside left offcanvas
        var asideLeft = mUtil.get('m_aside_left');
        var asideOffcanvasClass = mUtil.hasClass(asideLeft, 'm-aside-left--offcanvas-default') ? 'm-aside-left--offcanvas-default' : 'm-aside-left';

        asideMenuOffcanvas = new mOffcanvas('m_aside_left', {
            baseClass: asideOffcanvasClass,
            overlay: true,
            closeBy: 'm_aside_left_close_btn',
            toggleBy: {
                target: 'm_aside_left_offcanvas_toggle',
                state: 'm-brand__toggler--active'                
            }            
        });    

        //== Handle full height dropdowns
        var query = mUtil.findAll(asideLeft, '.m-menu__item--submenu-fullheight .m-menu__submenu > .m-menu__wrapper');
        if(typeof query != 'undefined' && query.length){
            for (var i = 0, j = query.length; i < j; i++) {
                var item = query[i];
              
                mUtil.scrollerInit(item, {
                    disableForMobile: true, 
                    resetHeightOnDestroy: true, 
                    handleWindowResize: true,
                    height: function() {  
                        return mUtil.getViewPort().height; 
                    } 
                });
    
                //== Update scroller on submenu toggle
                asideMenu.on('submenuToggle', function(menu, submenu) {
                    if (submenu && item && item.contains(submenu)) {
                        mUtil.scrollerUpdate(item);
                    }
                });
            } 
        }
    }

    //== Topbar
    var initTopbar = function() {
        $('#m_aside_header_topbar_mobile_toggle').click(function() {
            $('body').toggleClass('m-topbar--on');
        });
    }

    //== Quicksearch
    var initQuicksearch = function() {
        if ($('#m_quicksearch').length === 0 ) {
            return;
        }

        quicksearch = new mQuicksearch('m_quicksearch', {
            mode: mUtil.attr( 'm_quicksearch', 'm-quicksearch-mode' ), // quick search type
            minLength: 1
        });    

        //<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">Something went wrong</div></div>

        quicksearch.on('search', function(the) {
            the.showProgress();  
                      
            $.ajax({
                url: 'inc/api/quick_search.php',
                data: {query: the.query},
                dataType: 'html',
                success: function(res) {
                    the.hideProgress();
                    the.showResult(res);                     
                },
                error: function(res) {
                    the.hideProgress();
                    the.showError('Connection error. Pleae try again later.');      
                }
            });
        });  
    }

    //== Scrolltop
    var initScrollTop = function() {
        var scrollTop = new mScrollTop('m_scroll_top', {
            offset: 300,
            speed: 600
        });
    }


    return {
        init: function() {  
            this.initHeader();
            this.initAside();
        },

        initHeader: function() {
            initStickyHeader();
            initHorMenu();
            initTopbar();
            initQuicksearch();
            initScrollTop();
        },

        initAside: function() {            
            initLeftAsideMenu(); 
            initLeftAside();    
        },

        getAsideMenu: function() {
            return asideMenu;
        },

        closeMobileAsideMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                asideMenuOffcanvas.hide();
            }
        },

        closeMobileHorMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                horMenuOffcanvas.hide();
            }
        }
    };
}();

$(document).ready(function() {
    if (mUtil.isAngularVersion() === false) {
        mLayout.init();
    }
});
// var asideLeftToggle = function(){
//     var toggle_state = Cookies.get("sidebar_toggle_state");
//     if (($(this).width() > 1199) && ($(this).width() <= 1400)) {
//         if(!(typeof toggle_state != "undefined" && toggle_state == 'on')) {
//             $('body').addClass('m-brand--minimize').addClass('m-aside-left--minimize');
//         }
//         $('#m_aside_left_minimize_toggle').addClass('m-brand__toggler--hide');
//     }
//     else if($(this).width() > 1400) {
//         if(!(typeof toggle_state != "undefined" && toggle_state == 'on')) {
//             $('body').removeClass('m-brand--minimize').removeClass('m-aside-left--minimize');
//         }
//         $('#m_aside_left_minimize_toggle').removeClass('m-brand__toggler--hide');
//     }
// }


// $(document).ready(function() {
//     var toggle_state = Cookies.get("sidebar_toggle_state");
//     if(typeof toggle_state != "undefined" && toggle_state == 'on') {
//         /*$('body').addClass('m-brand--minimize m-aside-left--minimize');*/
//         $('#m_aside_left_minimize_toggle').addClass('m-brand__toggler--active');
//     }
//     !1 === mUtil.isAngularVersion() && mLayout.init();
//     asideLeftToggle();
// });
// $(window).on('resize', function(){
//     asideLeftToggle();
// });

// var mQuickSidebar = function() {
//     var t = $("#m_quick_sidebar")
//       , e = $("#m_quick_sidebar_tabs")
//       , a = t.find(".m-quick-sidebar__content")
//       , n = function() {
//         var a, n, o, i;
//         a = mUtil.find(mUtil.get("m_quick_sidebar_tabs_messenger"), ".m-messenger__messages"),
//         n = $("#m_quick_sidebar_tabs_messenger .m-messenger__form"),
//         mUtil.scrollerInit(a, {
//             disableForMobile: !0,
//             resetHeightOnDestroy: !1,
//             handleWindowResize: !0,
//             height: function() {
//                 return t.outerHeight(!0) - e.outerHeight(!0) - n.outerHeight(!0) - 120
//             }
//         }),
//         (o = mUtil.find(mUtil.get("m_quick_sidebar_tabs_settings"), ".m-list-settings")) && mUtil.scrollerInit(o, {
//             disableForMobile: !0,
//             resetHeightOnDestroy: !1,
//             handleWindowResize: !0,
//             height: function() {
//                 return mUtil.getViewPort().height - e.outerHeight(!0) - 60
//             }
//         }),
//         (i = mUtil.find(mUtil.get("m_quick_sidebar_tabs_logs"), ".m-list-timeline")) && mUtil.scrollerInit(i, {
//             disableForMobile: !0,
//             resetHeightOnDestroy: !1,
//             handleWindowResize: !0,
//             height: function() {
//                 return mUtil.getViewPort().height - e.outerHeight(!0) - 60
//             }
//         })
//     };
//     return {
//         init: function() {
//             0 !== t.length && new mOffcanvas("m_quick_sidebar",{
//                 overlay: !0,
//                 baseClass: "m-quick-sidebar",
//                 closeBy: "m_quick_sidebar_close",
//                 toggleBy: "m_quick_sidebar_toggle"
//             }).one("afterShow", function() {
//                 mApp.block(t),
//                 setTimeout(function() {
//                     mApp.unblock(t),
//                     a.removeClass("m--hide"),
//                     n()
//                 }, 1e3)
//             })
//         }
//     }
// }();
// $(document).ready(function() {
//     mQuickSidebar.init()
// });
