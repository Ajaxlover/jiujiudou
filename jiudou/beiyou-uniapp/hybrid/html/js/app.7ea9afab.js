(function(t) {
	function e(e) {
		for (var i, r, a = e[0], c = e[1], u = e[2], l = 0, p = []; l < a.length; l++) r = a[l], Object.prototype
			.hasOwnProperty.call(s, r) && s[r] && p.push(s[r][0]), s[r] = 0;
		for (i in c) Object.prototype.hasOwnProperty.call(c, i) && (t[i] = c[i]);
		h && h(e);
		while (p.length) p.shift()();
		return o.push.apply(o, u || []), n()
	}

	function n() {
		for (var t, e = 0; e < o.length; e++) {
			for (var n = o[e], i = !0, a = 1; a < n.length; a++) {
				var c = n[a];
				0 !== s[c] && (i = !1)
			}
			i && (o.splice(e--, 1), t = r(r.s = n[0]))
		}
		return t
	}
	var i = {},
		s = {
			app: 0
		},
		o = [];

	function r(e) {
		if (i[e]) return i[e].exports;
		var n = i[e] = {
			i: e,
			l: !1,
			exports: {}
		};
		return t[e].call(n.exports, n, n.exports, r), n.l = !0, n.exports
	}
	r.m = t, r.c = i, r.d = function(t, e, n) {
		r.o(t, e) || Object.defineProperty(t, e, {
			enumerable: !0,
			get: n
		})
	}, r.r = function(t) {
		"undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(t, "__esModule", {
			value: !0
		})
	}, r.t = function(t, e) {
		if (1 & e && (t = r(t)), 8 & e) return t;
		if (4 & e && "object" === typeof t && t && t.__esModule) return t;
		var n = Object.create(null);
		if (r.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: t
			}), 2 & e && "string" != typeof t)
			for (var i in t) r.d(n, i, function(e) {
				return t[e]
			}.bind(null, i));
		return n
	}, r.n = function(t) {
		var e = t && t.__esModule ? function() {
			return t["default"]
		} : function() {
			return t
		};
		return r.d(e, "a", e), e
	}, r.o = function(t, e) {
		return Object.prototype.hasOwnProperty.call(t, e)
	}, r.p = "";
	var a = window["webpackJsonp"] = window["webpackJsonp"] || [],
		c = a.push.bind(a);
	a.push = e, a = a.slice();
	for (var u = 0; u < a.length; u++) e(a[u]);
	var h = c;
	o.push([0, "chunk-vendors"]), n()
})({
	0: function(t, e, n) {
		t.exports = n("56d7")
	},
	1: function(t, e) {},
	"14c30": function(t, e, n) {
		"use strict";
		var i = n("f305"),
			s = n.n(i);
		s.a
	},
	"199c": function(t, e, n) {
		"use strict";
		(function(t) {
			n("4160"), n("b0c0"), n("4d63"), n("ac1f"), n("25f0"), n("466d"), n("841c"), n("159b");
			var i = n("1e1d"),
				s = n("c247"),
				o = n("a211"),
				r = "./static/2018_Book_AgileProcessesInSoftwareEngine.epub";
			t.ePub = o["a"], e["a"] = {
				components: {
					TitleBar: i["a"],
					MenuBar: s["a"]
				},
				name: "home",
				data: function() {
					return {
						ifTitleAndMenuShow: !0,
						fontSizeList: [{
							fontSize: 12
						}, {
							fontSize: 14
						}, {
							fontSize: 16
						}, {
							fontSize: 18
						}, {
							fontSize: 20
						}, {
							fontSize: 22
						}, {
							fontSize: 24
						}],
						defaultFontSize: 16,
						themeList: [{
							name: "default",
							style: {
								body: {
									color: "#000",
									background: "#fff"
								}
							}
						}, {
							name: "eye",
							style: {
								body: {
									color: "#000",
									background: "#ceeaba"
								}
							}
						}, {
							name: "night",
							style: {
								body: {
									color: "#fff",
									background: "#000"
								}
							}
						}, {
							name: "gold",
							style: {
								body: {
									color: "#000",
									background: "rgb(241, 236, 226)"
								}
							}
						}],
						defaultTheme: 0,
						bookAvailable: !1,
						navigation: {},
						isbook: !0
					}
				},
				methods: {
					getUrlParam: function(t) {
						var e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
							n = window.location.search.substr(1).match(e);
						return null != n ? unescape(n[2]) : null
					},
					vueTouch: function(t) {
						"nextPage" == t && this.nextPage()
					},
					jumpTo: function(t) {
						this.rendition.display(t), this.hideTitleAndMenu()
					},
					hideTitleAndMenu: function() {
						this.ifTitleAndMenuShow = !1, this.$refs.menuBar.hideSetting(), this.$refs
							.menuBar.hideContent()
					},
					onProgressChange: function(t) {
						var e = t / 100,
							n = e > 0 ? this.locations.cfiFromPercentage(e) : 0;
						this.rendition.display(n)
					},
					setTheme: function(t) {
						this.themes.select(this.themeList[t].name), this.defaultTheme = t
					},
					registerTheme: function() {
						var t = this;
						this.themeList.forEach((function(e) {
							t.themes.register(e.name, e.style)
						}))
					},
					setFontSize: function(t) {
						this.defaultFontSize = t, this.themes && this.themes.fontSize(t + "px")
					},
					toggleTitleAndMenu: function() {
						this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow, this
							.ifTitleAndMenuShow || this.$refs.menuBar.hideSetting()
					},
					prevPage: function() {
						this.rendition && this.rendition.prev()
					},
					nextPage: function() {
						this.rendition && this.rendition.next()
					},
					showEpub: function() {
						var t = this;
						this.book = new o["a"](r), 
						this.rendition = this.book.renderTo("read", {
								width: window.innerWidth,
								height: window.innerHeight,
								method: "default"
							}), 
						this.rendition.display(), 
						this.themes = this.rendition.themes, 
						this.setFontSize(this.defaultFontSize), 
						this.registerTheme(), 
						this.setTheme(this.defaultTheme), 
						this.book.ready.then((function() {
							return t.navigation = t.book.navigation, t.book.locations.generate()
						})).then((function() {
							t.locations = t.book.locations, 
							t.bookAvailable = !0
						}))
					}
				},
				mounted: function() {
					this.getUrlParam("url") && (r = decodeURIComponent(this.getUrlParam("url"))),
						this.showEpub()
				}
			}, document.addEventListener("DOMContentLoaded", (function() {
				var t = document.querySelector("html"),
					e = window.innerWidth / 10;
				e = e > 50 ? 50 : e, t.style.fontSize = e + "px"
			}))
		}).call(this, n("c8ba"))
	},
	"1e1d": function(t, e, n) {
		"use strict";
		var i = function() {
				var t = this,
					e = t.$createElement,
					n = t._self._c || e;
				return n("transition", {
					attrs: {
						name: "slide-down"
					}
				}, [n("div", {
					directives: [{
						name: "show",
						rawName: "v-show",
						value: t.ifTitleAndMenuShow,
						expression: "ifTitleAndMenuShow"
					}]
				}, [n("div", {
					directives: [{
						name: "show",
						rawName: "v-show",
						value: t.isShow,
						expression: "isShow"
					}],
					staticClass: "title-wrapper",
					style: {
						paddingTop: t.paddingTop
					}
				}, [n("div", {
					staticClass: "left",
					attrs: {
						id: "gobackAction"
					}
				}, [n("span", {
					staticClass: "icon-back icon"
				}), n("div", {
					staticClass: "name-css"
				}, [t._v(t._s(t.name))])])])])])
			},
			s = [],
			o = (n("b0c0"), n("4d63"), n("ac1f"), n("25f0"), n("466d"), n("841c"), {
				props: {
					ifTitleAndMenuShow: {
						type: Boolean,
						default: !1
					}
				},
				data: function() {
					return {
						paddingTop: "0",
						isShow: !0,
						name: ""
					}
				},
				beforeMount: function() {
					var t = this;
					if (t.getUrlParam("plat")) {
						t.name = decodeURI(t.getUrlParam("tname"));
						var e = t.getUrlParam("plat");
						"android" == e && (t.paddingTop = t.getUrlParam("h") + "px")
					} else t.isShow = !1
				},
				methods: {
					getUrlParam: function(t) {
						var e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
							n = window.location.search.substr(1).match(e);
						return null != n ? n[2] : null
					}
				}
			}),
			r = o,
			a = (n("3f0a"), n("2877")),
			c = Object(a["a"])(r, i, s, !1, null, "de753d3a", null);
		e["a"] = c.exports
	},
	2: function(t, e) {},
	"3d0e": function(t, e, n) {},
	"3f0a": function(t, e, n) {
		"use strict";
		var i = n("92b9"),
			s = n.n(i);
		s.a
	},
	"4fda": function(t, e, n) {},
	"56d7": function(t, e, n) {
		"use strict";
		n.r(e);
		n("e260"), n("e6cf"), n("cca6"), n("a79d");
		var i = n("2b0e"),
			s = function() {
				var t = this,
					e = t.$createElement,
					n = t._self._c || e;
				return n("div", {
					attrs: {
						id: "app"
					}
				}, [n("div", {
					staticClass: "ebook"
				}, [n("title-bar", {
					attrs: {
						ifTitleAndMenuShow: t.ifTitleAndMenuShow
					}
				}), n("div", {
					staticClass: "read-wrapper"
				}, [n("div", {
					attrs: {
						id: "read"
					}
				}), n("div", {
					directives: [{
						name: "swiperight",
						rawName: "v-swiperight",
						value: t.prevPage,
						expression: "prevPage"
					}, {
						name: "swipeleft",
						rawName: "v-swipeleft",
						value: t.nextPage,
						expression: "nextPage"
					}, {
						name: "press",
						rawName: "v-press",
						value: t.toggleTitleAndMenu,
						expression: "toggleTitleAndMenu"
					}],
					staticClass: "mask"
				}, [n("div", {
					staticClass: "left",
					on: {
						click: t.prevPage
					}
				}), n("div", {
					staticClass: "center",
					on: {
						click: t.toggleTitleAndMenu
					}
				}), n("div", {
					staticClass: "right",
					on: {
						click: t.nextPage
					}
				})])]), n("menu-bar", {
					ref: "menuBar",
					attrs: {
						ifTitleAndMenuShow: t.ifTitleAndMenuShow,
						fontSizeList: t.fontSizeList,
						defaultFontSize: t.defaultFontSize,
						themeList: t.themeList,
						defaultTheme: t.defaultTheme,
						bookAvailable: t.bookAvailable,
						navigation: t.navigation
					},
					on: {
						setFontSize: t.setFontSize,
						setTheme: t.setTheme,
						onProgressChange: t.onProgressChange,
						jumpTo: t.jumpTo
					}
				})], 1)])
			},
			o = [],
			r = n("199c"),
			a = r["a"],
			c = (n("f2c3"), n("2877")),
			u = Object(c["a"])(a, s, o, !1, null, "f746bc1c", null),
			h = u.exports,
			l = n("2f62");
		i["a"].use(l["a"]);
		var p = new l["a"].Store({
			state: {},
			mutations: {},
			actions: {},
			modules: {}
		});
		n("3d0e"), n("c860"), n("9e43");

		function f(t, e, n) {
			this.el = t, this.type = e, this.binding = n;
			var i = new Hammer(this.el);
			i.on(this.type, this.binding.value)
		}
		var d = i["a"].directive("tap", {
				bind: function(t, e) {
					new f(t, "tap", e)
				}
			}),
			v = i["a"].directive("swipeleft", {
				bind: function(t, e) {
					new f(t, "swipeleft", e)
				}
			}),
			m = i["a"].directive("swiperight", {
				bind: function(t, e) {
					new f(t, "swiperight", e)
				}
			}),
			g = i["a"].directive("press", {
				bind: function(t, e) {
					new f(t, "press", e)
				}
			});
		i["a"].use(d, v, m, g), i["a"].config.productionTip = !1, new i["a"]({
			store: p,
			render: function(t) {
				return t(h)
			}
		}).$mount("#app")
	},
	"92b9": function(t, e, n) {},
	9429: function(t, e, n) {},
	"9e43": function(t, e, n) {
		var i;
		n("99af"), n("4de4"), n("4160"), n("c975"), n("a15b"), n("fb6a"), n("4e82"), n("a434"), n("0d03"), n(
			"b64b"), n("ac1f"), n("5319"), n("1276"), n("498a"), n("159b");
		var s = n("7037");
		/*! Hammer.JS - v2.0.8 - 2016-04-23
		 * http://hammerjs.github.io/
		 *
		 * Copyright (c) 2016 Jorik Tangelder;
		 * Licensed under the MIT license */
		! function(o, r, a, c) {
			"use strict";

			function u(t, e, n) {
				return setTimeout(d(t, n), e)
			}

			function h(t, e, n) {
				return !!Array.isArray(t) && (l(t, n[e], n), !0)
			}

			function l(t, e, n) {
				var i;
				if (t)
					if (t.forEach) t.forEach(e, n);
					else if (t.length !== c)
					for (i = 0; i < t.length;) e.call(n, t[i], i, t), i++;
				else
					for (i in t) t.hasOwnProperty(i) && e.call(n, t[i], i, t)
			}

			function p(t, e, n) {
				var i = "DEPRECATED METHOD: " + e + "\n" + n + " AT \n";
				return function() {
					var e = new Error("get-stack-trace"),
						n = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "")
						.replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
						s = o.console && (o.console.warn || o.console.log);
					return s && s.call(o.console, i, n), t.apply(this, arguments)
				}
			}

			function f(t, e, n) {
				var i, s = e.prototype;
				i = t.prototype = Object.create(s), i.constructor = t, i._super = s, n && mt(i, n)
			}

			function d(t, e) {
				return function() {
					return t.apply(e, arguments)
				}
			}

			function v(t, e) {
				return s(t) == yt ? t.apply(e && e[0] || c, e) : t
			}

			function m(t, e) {
				return t === c ? e : t
			}

			function g(t, e, n) {
				l(b(e), (function(e) {
					t.addEventListener(e, n, !1)
				}))
			}

			function T(t, e, n) {
				l(b(e), (function(e) {
					t.removeEventListener(e, n, !1)
				}))
			}

			function y(t, e) {
				for (; t;) {
					if (t == e) return !0;
					t = t.parentNode
				}
				return !1
			}

			function w(t, e) {
				return t.indexOf(e) > -1
			}

			function b(t) {
				return t.trim().split(/\s+/g)
			}

			function S(t, e, n) {
				if (t.indexOf && !n) return t.indexOf(e);
				for (var i = 0; i < t.length;) {
					if (n && t[i][n] == e || !n && t[i] === e) return i;
					i++
				}
				return -1
			}

			function C(t) {
				return Array.prototype.slice.call(t, 0)
			}

			function E(t, e, n) {
				for (var i = [], s = [], o = 0; o < t.length;) {
					var r = e ? t[o][e] : t[o];
					S(s, r) < 0 && i.push(t[o]), s[o] = r, o++
				}
				return n && (i = e ? i.sort((function(t, n) {
					return t[e] > n[e]
				})) : i.sort()), i
			}

			function A(t, e) {
				for (var n, i, s = e[0].toUpperCase() + e.slice(1), o = 0; o < gt.length;) {
					if (n = gt[o], i = n ? n + s : e, i in t) return i;
					o++
				}
				return c
			}

			function P() {
				return At++
			}

			function x(t) {
				var e = t.ownerDocument || t;
				return e.defaultView || e.parentWindow || o
			}

			function _(t, e) {
				var n = this;
				this.manager = t, this.callback = e, this.element = t.element, this.target = t.options
					.inputTarget, this.domHandler = function(e) {
						v(t.options.enable, [t]) && n.handler(e)
					}, this.init()
			}

			function z(t) {
				var e = t.options.inputClass;
				return new(e || (_t ? W : zt ? H : xt ? V : U))(t, k)
			}

			function k(t, e, n) {
				var i = n.pointers.length,
					s = n.changedPointers.length,
					o = e & Nt && i - s === 0,
					r = e & (jt | Rt) && i - s === 0;
				n.isFirst = !!o, n.isFinal = !!r, o && (t.session = {}), n.eventType = e, M(t, n), t.emit(
					"hammer.input", n), t.recognize(n), t.session.prevInput = n
			}

			function M(t, e) {
				var n = t.session,
					i = e.pointers,
					s = i.length;
				n.firstInput || (n.firstInput = D(e)), s > 1 && !n.firstMultiple ? n.firstMultiple = D(e) :
					1 === s && (n.firstMultiple = !1);
				var o = n.firstInput,
					r = n.firstMultiple,
					a = r ? r.center : o.center,
					c = e.center = N(i);
				e.timeStamp = St(), e.deltaTime = e.timeStamp - o.timeStamp, e.angle = L(a, c), e.distance = R(
					a, c), I(n, e), e.offsetDirection = j(e.deltaX, e.deltaY);
				var u = F(e.deltaTime, e.deltaX, e.deltaY);
				e.overallVelocityX = u.x, e.overallVelocityY = u.y, e.overallVelocity = bt(u.x) > bt(u.y) ? u
					.x : u.y, e.scale = r ? Y(r.pointers, i) : 1, e.rotation = r ? X(r.pointers, i) : 0, e
					.maxPointers = n.prevInput ? e.pointers.length > n.prevInput.maxPointers ? e.pointers
					.length : n.prevInput.maxPointers : e.pointers.length, O(n, e);
				var h = t.element;
				y(e.srcEvent.target, h) && (h = e.srcEvent.target), e.target = h
			}

			function I(t, e) {
				var n = e.center,
					i = t.offsetDelta || {},
					s = t.prevDelta || {},
					o = t.prevInput || {};
				e.eventType !== Nt && o.eventType !== jt || (s = t.prevDelta = {
					x: o.deltaX || 0,
					y: o.deltaY || 0
				}, i = t.offsetDelta = {
					x: n.x,
					y: n.y
				}), e.deltaX = s.x + (n.x - i.x), e.deltaY = s.y + (n.y - i.y)
			}

			function O(t, e) {
				var n, i, s, o, r = t.lastInterval || e,
					a = e.timeStamp - r.timeStamp;
				if (e.eventType != Rt && (a > Dt || r.velocity === c)) {
					var u = e.deltaX - r.deltaX,
						h = e.deltaY - r.deltaY,
						l = F(a, u, h);
					i = l.x, s = l.y, n = bt(l.x) > bt(l.y) ? l.x : l.y, o = j(u, h), t.lastInterval = e
				} else n = r.velocity, i = r.velocityX, s = r.velocityY, o = r.direction;
				e.velocity = n, e.velocityX = i, e.velocityY = s, e.direction = o
			}

			function D(t) {
				for (var e = [], n = 0; n < t.pointers.length;) e[n] = {
					clientX: wt(t.pointers[n].clientX),
					clientY: wt(t.pointers[n].clientY)
				}, n++;
				return {
					timeStamp: St(),
					pointers: e,
					center: N(e),
					deltaX: t.deltaX,
					deltaY: t.deltaY
				}
			}

			function N(t) {
				var e = t.length;
				if (1 === e) return {
					x: wt(t[0].clientX),
					y: wt(t[0].clientY)
				};
				for (var n = 0, i = 0, s = 0; e > s;) n += t[s].clientX, i += t[s].clientY, s++;
				return {
					x: wt(n / e),
					y: wt(i / e)
				}
			}

			function F(t, e, n) {
				return {
					x: e / t || 0,
					y: n / t || 0
				}
			}

			function j(t, e) {
				return t === e ? Lt : bt(t) >= bt(e) ? 0 > t ? Xt : Yt : 0 > e ? Ut : Wt
			}

			function R(t, e, n) {
				n || (n = Bt);
				var i = e[n[0]] - t[n[0]],
					s = e[n[1]] - t[n[1]];
				return Math.sqrt(i * i + s * s)
			}

			function L(t, e, n) {
				n || (n = Bt);
				var i = e[n[0]] - t[n[0]],
					s = e[n[1]] - t[n[1]];
				return 180 * Math.atan2(s, i) / Math.PI
			}

			function X(t, e) {
				return L(e[1], e[0], Vt) + L(t[1], t[0], Vt)
			}

			function Y(t, e) {
				return R(e[0], e[1], Vt) / R(t[0], t[1], Vt)
			}

			function U() {
				this.evEl = Zt, this.evWin = Jt, this.pressed = !1, _.apply(this, arguments)
			}

			function W() {
				this.evEl = te, this.evWin = ee, _.apply(this, arguments), this.store = this.manager.session
					.pointerEvents = []
			}

			function q() {
				this.evTarget = ie, this.evWin = se, this.started = !1, _.apply(this, arguments)
			}

			function $(t, e) {
				var n = C(t.touches),
					i = C(t.changedTouches);
				return e & (jt | Rt) && (n = E(n.concat(i), "identifier", !0)), [n, i]
			}

			function H() {
				this.evTarget = re, this.targetIds = {}, _.apply(this, arguments)
			}

			function B(t, e) {
				var n = C(t.touches),
					i = this.targetIds;
				if (e & (Nt | Ft) && 1 === n.length) return i[n[0].identifier] = !0, [n, n];
				var s, o, r = C(t.changedTouches),
					a = [],
					c = this.target;
				if (o = n.filter((function(t) {
						return y(t.target, c)
					})), e === Nt)
					for (s = 0; s < o.length;) i[o[s].identifier] = !0, s++;
				for (s = 0; s < r.length;) i[r[s].identifier] && a.push(r[s]), e & (jt | Rt) && delete i[r[s]
					.identifier], s++;
				return a.length ? [E(o.concat(a), "identifier", !0), a] : void 0
			}

			function V() {
				_.apply(this, arguments);
				var t = d(this.handler, this);
				this.touch = new H(this.manager, t), this.mouse = new U(this.manager, t), this.primaryTouch =
					null, this.lastTouches = []
			}

			function G(t, e) {
				t & Nt ? (this.primaryTouch = e.changedPointers[0].identifier, Z.call(this, e)) : t & (jt |
					Rt) && Z.call(this, e)
			}

			function Z(t) {
				var e = t.changedPointers[0];
				if (e.identifier === this.primaryTouch) {
					var n = {
						x: e.clientX,
						y: e.clientY
					};
					this.lastTouches.push(n);
					var i = this.lastTouches,
						s = function() {
							var t = i.indexOf(n);
							t > -1 && i.splice(t, 1)
						};
					setTimeout(s, ae)
				}
			}

			function J(t) {
				for (var e = t.srcEvent.clientX, n = t.srcEvent.clientY, i = 0; i < this.lastTouches
					.length; i++) {
					var s = this.lastTouches[i],
						o = Math.abs(e - s.x),
						r = Math.abs(n - s.y);
					if (ce >= o && ce >= r) return !0
				}
				return !1
			}

			function K(t, e) {
				this.manager = t, this.set(e)
			}

			function Q(t) {
				if (w(t, de)) return de;
				var e = w(t, ve),
					n = w(t, me);
				return e && n ? de : e || n ? e ? ve : me : w(t, fe) ? fe : pe
			}

			function tt() {
				if (!he) return !1;
				var t = {},
					e = o.CSS && o.CSS.supports;
				return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach((function(n) {
					t[n] = !e || o.CSS.supports("touch-action", n)
				})), t
			}

			function et(t) {
				this.options = mt({}, this.defaults, t || {}), this.id = P(), this.manager = null, this.options
					.enable = m(this.options.enable, !0), this.state = Te, this.simultaneous = {}, this
					.requireFail = []
			}

			function nt(t) {
				return t & Ce ? "cancel" : t & be ? "end" : t & we ? "move" : t & ye ? "start" : ""
			}

			function it(t) {
				return t == Wt ? "down" : t == Ut ? "up" : t == Xt ? "left" : t == Yt ? "right" : ""
			}

			function st(t, e) {
				var n = e.manager;
				return n ? n.get(t) : t
			}

			function ot() {
				et.apply(this, arguments)
			}

			function rt() {
				ot.apply(this, arguments), this.pX = null, this.pY = null
			}

			function at() {
				ot.apply(this, arguments)
			}

			function ct() {
				et.apply(this, arguments), this._timer = null, this._input = null
			}

			function ut() {
				ot.apply(this, arguments)
			}

			function ht() {
				ot.apply(this, arguments)
			}

			function lt() {
				et.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input =
					null, this.count = 0
			}

			function pt(t, e) {
				return e = e || {}, e.recognizers = m(e.recognizers, pt.defaults.preset), new ft(t, e)
			}

			function ft(t, e) {
				this.options = mt({}, pt.defaults, e || {}), this.options.inputTarget = this.options
					.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this
					.oldCssProps = {}, this.element = t, this.input = z(this), this.touchAction = new K(this,
						this.options.touchAction), dt(this, !0), l(this.options.recognizers, (function(t) {
						var e = this.add(new t[0](t[1]));
						t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
					}), this)
			}

			function dt(t, e) {
				var n, i = t.element;
				i.style && (l(t.options.cssProps, (function(s, o) {
					n = A(i.style, o), e ? (t.oldCssProps[n] = i.style[n], i.style[n] = s) : i
						.style[n] = t.oldCssProps[n] || ""
				})), e || (t.oldCssProps = {}))
			}

			function vt(t, e) {
				var n = r.createEvent("Event");
				n.initEvent(t, !0, !0), n.gesture = e, e.target.dispatchEvent(n)
			}
			var mt, gt = ["", "webkit", "Moz", "MS", "ms", "o"],
				Tt = r.createElement("div"),
				yt = "function",
				wt = Math.round,
				bt = Math.abs,
				St = Date.now;
			mt = "function" != typeof Object.assign ? function(t) {
				if (t === c || null === t) throw new TypeError(
				"Cannot convert undefined or null to object");
				for (var e = Object(t), n = 1; n < arguments.length; n++) {
					var i = arguments[n];
					if (i !== c && null !== i)
						for (var s in i) i.hasOwnProperty(s) && (e[s] = i[s])
				}
				return e
			} : Object.assign;
			var Ct = p((function(t, e, n) {
					for (var i = Object.keys(e), s = 0; s < i.length;)(!n || n && t[i[s]] === c) && (t[
						i[s]] = e[i[s]]), s++;
					return t
				}), "extend", "Use `assign`."),
				Et = p((function(t, e) {
					return Ct(t, e, !0)
				}), "merge", "Use `assign`."),
				At = 1,
				Pt = /mobile|tablet|ip(ad|hone|od)|android/i,
				xt = "ontouchstart" in o,
				_t = A(o, "PointerEvent") !== c,
				zt = xt && Pt.test(navigator.userAgent),
				kt = "touch",
				Mt = "pen",
				It = "mouse",
				Ot = "kinect",
				Dt = 25,
				Nt = 1,
				Ft = 2,
				jt = 4,
				Rt = 8,
				Lt = 1,
				Xt = 2,
				Yt = 4,
				Ut = 8,
				Wt = 16,
				qt = Xt | Yt,
				$t = Ut | Wt,
				Ht = qt | $t,
				Bt = ["x", "y"],
				Vt = ["clientX", "clientY"];
			_.prototype = {
				handler: function() {},
				init: function() {
					this.evEl && g(this.element, this.evEl, this.domHandler), this.evTarget && g(this
						.target, this.evTarget, this.domHandler), this.evWin && g(x(this.element),
						this.evWin, this.domHandler)
				},
				destroy: function() {
					this.evEl && T(this.element, this.evEl, this.domHandler), this.evTarget && T(this
						.target, this.evTarget, this.domHandler), this.evWin && T(x(this.element),
						this.evWin, this.domHandler)
				}
			};
			var Gt = {
					mousedown: Nt,
					mousemove: Ft,
					mouseup: jt
				},
				Zt = "mousedown",
				Jt = "mousemove mouseup";
			f(U, _, {
				handler: function(t) {
					var e = Gt[t.type];
					e & Nt && 0 === t.button && (this.pressed = !0), e & Ft && 1 !== t.which && (e =
						jt), this.pressed && (e & jt && (this.pressed = !1), this.callback(this
						.manager, e, {
							pointers: [t],
							changedPointers: [t],
							pointerType: It,
							srcEvent: t
						}))
				}
			});
			var Kt = {
					pointerdown: Nt,
					pointermove: Ft,
					pointerup: jt,
					pointercancel: Rt,
					pointerout: Rt
				},
				Qt = {
					2: kt,
					3: Mt,
					4: It,
					5: Ot
				},
				te = "pointerdown",
				ee = "pointermove pointerup pointercancel";
			o.MSPointerEvent && !o.PointerEvent && (te = "MSPointerDown", ee =
				"MSPointerMove MSPointerUp MSPointerCancel"), f(W, _, {
				handler: function(t) {
					var e = this.store,
						n = !1,
						i = t.type.toLowerCase().replace("ms", ""),
						s = Kt[i],
						o = Qt[t.pointerType] || t.pointerType,
						r = o == kt,
						a = S(e, t.pointerId, "pointerId");
					s & Nt && (0 === t.button || r) ? 0 > a && (e.push(t), a = e.length - 1) : s & (
						jt | Rt) && (n = !0), 0 > a || (e[a] = t, this.callback(this.manager,
					s, {
						pointers: e,
						changedPointers: [t],
						pointerType: o,
						srcEvent: t
					}), n && e.splice(a, 1))
				}
			});
			var ne = {
					touchstart: Nt,
					touchmove: Ft,
					touchend: jt,
					touchcancel: Rt
				},
				ie = "touchstart",
				se = "touchstart touchmove touchend touchcancel";
			f(q, _, {
				handler: function(t) {
					var e = ne[t.type];
					if (e === Nt && (this.started = !0), this.started) {
						var n = $.call(this, t, e);
						e & (jt | Rt) && n[0].length - n[1].length === 0 && (this.started = !1),
							this.callback(this.manager, e, {
								pointers: n[0],
								changedPointers: n[1],
								pointerType: kt,
								srcEvent: t
							})
					}
				}
			});
			var oe = {
					touchstart: Nt,
					touchmove: Ft,
					touchend: jt,
					touchcancel: Rt
				},
				re = "touchstart touchmove touchend touchcancel";
			f(H, _, {
				handler: function(t) {
					var e = oe[t.type],
						n = B.call(this, t, e);
					n && this.callback(this.manager, e, {
						pointers: n[0],
						changedPointers: n[1],
						pointerType: kt,
						srcEvent: t
					})
				}
			});
			var ae = 2500,
				ce = 25;
			f(V, _, {
				handler: function(t, e, n) {
					var i = n.pointerType == kt,
						s = n.pointerType == It;
					if (!(s && n.sourceCapabilities && n.sourceCapabilities.firesTouchEvents)) {
						if (i) G.call(this, e, n);
						else if (s && J.call(this, n)) return;
						this.callback(t, e, n)
					}
				},
				destroy: function() {
					this.touch.destroy(), this.mouse.destroy()
				}
			});
			var ue = A(Tt.style, "touchAction"),
				he = ue !== c,
				le = "compute",
				pe = "auto",
				fe = "manipulation",
				de = "none",
				ve = "pan-x",
				me = "pan-y",
				ge = tt();
			K.prototype = {
				set: function(t) {
					t == le && (t = this.compute()), he && this.manager.element.style && ge[t] && (this
						.manager.element.style[ue] = t), this.actions = t.toLowerCase().trim()
				},
				update: function() {
					this.set(this.manager.options.touchAction)
				},
				compute: function() {
					var t = [];
					return l(this.manager.recognizers, (function(e) {
						v(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
					})), Q(t.join(" "))
				},
				preventDefaults: function(t) {
					var e = t.srcEvent,
						n = t.offsetDirection;
					if (!this.manager.session.prevented) {
						var i = this.actions,
							s = w(i, de) && !ge[de],
							o = w(i, me) && !ge[me],
							r = w(i, ve) && !ge[ve];
						if (s) {
							var a = 1 === t.pointers.length,
								c = t.distance < 2,
								u = t.deltaTime < 250;
							if (a && c && u) return
						}
						return r && o ? void 0 : s || o && n & qt || r && n & $t ? this.preventSrc(e) :
							void 0
					}
					e.preventDefault()
				},
				preventSrc: function(t) {
					this.manager.session.prevented = !0, t.preventDefault()
				}
			};
			var Te = 1,
				ye = 2,
				we = 4,
				be = 8,
				Se = be,
				Ce = 16,
				Ee = 32;
			et.prototype = {
				defaults: {},
				set: function(t) {
					return mt(this.options, t), this.manager && this.manager.touchAction.update(), this
				},
				recognizeWith: function(t) {
					if (h(t, "recognizeWith", this)) return this;
					var e = this.simultaneous;
					return t = st(t, this), e[t.id] || (e[t.id] = t, t.recognizeWith(this)), this
				},
				dropRecognizeWith: function(t) {
					return h(t, "dropRecognizeWith", this) ? this : (t = st(t, this), delete this
						.simultaneous[t.id], this)
				},
				requireFailure: function(t) {
					if (h(t, "requireFailure", this)) return this;
					var e = this.requireFail;
					return t = st(t, this), -1 === S(e, t) && (e.push(t), t.requireFailure(this)), this
				},
				dropRequireFailure: function(t) {
					if (h(t, "dropRequireFailure", this)) return this;
					t = st(t, this);
					var e = S(this.requireFail, t);
					return e > -1 && this.requireFail.splice(e, 1), this
				},
				hasRequireFailures: function() {
					return this.requireFail.length > 0
				},
				canRecognizeWith: function(t) {
					return !!this.simultaneous[t.id]
				},
				emit: function(t) {
					function e(e) {
						n.manager.emit(e, t)
					}
					var n = this,
						i = this.state;
					be > i && e(n.options.event + nt(i)), e(n.options.event), t.additionalEvent && e(t
						.additionalEvent), i >= be && e(n.options.event + nt(i))
				},
				tryEmit: function(t) {
					return this.canEmit() ? this.emit(t) : void(this.state = Ee)
				},
				canEmit: function() {
					for (var t = 0; t < this.requireFail.length;) {
						if (!(this.requireFail[t].state & (Ee | Te))) return !1;
						t++
					}
					return !0
				},
				recognize: function(t) {
					var e = mt({}, t);
					return v(this.options.enable, [this, e]) ? (this.state & (Se | Ce | Ee) && (this
						.state = Te), this.state = this.process(e), void(this.state & (ye | we |
						be | Ce) && this.tryEmit(e))) : (this.reset(), void(this.state = Ee))
				},
				process: function(t) {},
				getTouchAction: function() {},
				reset: function() {}
			}, f(ot, et, {
				defaults: {
					pointers: 1
				},
				attrTest: function(t) {
					var e = this.options.pointers;
					return 0 === e || t.pointers.length === e
				},
				process: function(t) {
					var e = this.state,
						n = t.eventType,
						i = e & (ye | we),
						s = this.attrTest(t);
					return i && (n & Rt || !s) ? e | Ce : i || s ? n & jt ? e | be : e & ye ? e |
						we : ye : Ee
				}
			}), f(rt, ot, {
				defaults: {
					event: "pan",
					threshold: 10,
					pointers: 1,
					direction: Ht
				},
				getTouchAction: function() {
					var t = this.options.direction,
						e = [];
					return t & qt && e.push(me), t & $t && e.push(ve), e
				},
				directionTest: function(t) {
					var e = this.options,
						n = !0,
						i = t.distance,
						s = t.direction,
						o = t.deltaX,
						r = t.deltaY;
					return s & e.direction || (e.direction & qt ? (s = 0 === o ? Lt : 0 > o ? Xt :
							Yt, n = o != this.pX, i = Math.abs(t.deltaX)) : (s = 0 === r ? Lt :
							0 > r ? Ut : Wt, n = r != this.pY, i = Math.abs(t.deltaY))), t
						.direction = s, n && i > e.threshold && s & e.direction
				},
				attrTest: function(t) {
					return ot.prototype.attrTest.call(this, t) && (this.state & ye || !(this.state &
						ye) && this.directionTest(t))
				},
				emit: function(t) {
					this.pX = t.deltaX, this.pY = t.deltaY;
					var e = it(t.direction);
					e && (t.additionalEvent = this.options.event + e), this._super.emit.call(this,
						t)
				}
			}), f(at, ot, {
				defaults: {
					event: "pinch",
					threshold: 0,
					pointers: 2
				},
				getTouchAction: function() {
					return [de]
				},
				attrTest: function(t) {
					return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this
						.options.threshold || this.state & ye)
				},
				emit: function(t) {
					if (1 !== t.scale) {
						var e = t.scale < 1 ? "in" : "out";
						t.additionalEvent = this.options.event + e
					}
					this._super.emit.call(this, t)
				}
			}), f(ct, et, {
				defaults: {
					event: "press",
					pointers: 1,
					time: 251,
					threshold: 9
				},
				getTouchAction: function() {
					return [pe]
				},
				process: function(t) {
					var e = this.options,
						n = t.pointers.length === e.pointers,
						i = t.distance < e.threshold,
						s = t.deltaTime > e.time;
					if (this._input = t, !i || !n || t.eventType & (jt | Rt) && !s) this.reset();
					else if (t.eventType & Nt) this.reset(), this._timer = u((function() {
						this.state = Se, this.tryEmit()
					}), e.time, this);
					else if (t.eventType & jt) return Se;
					return Ee
				},
				reset: function() {
					clearTimeout(this._timer)
				},
				emit: function(t) {
					this.state === Se && (t && t.eventType & jt ? this.manager.emit(this.options
						.event + "up", t) : (this._input.timeStamp = St(), this.manager
						.emit(this.options.event, this._input)))
				}
			}), f(ut, ot, {
				defaults: {
					event: "rotate",
					threshold: 0,
					pointers: 2
				},
				getTouchAction: function() {
					return [de]
				},
				attrTest: function(t) {
					return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this
						.options.threshold || this.state & ye)
				}
			}), f(ht, ot, {
				defaults: {
					event: "swipe",
					threshold: 10,
					velocity: .3,
					direction: qt | $t,
					pointers: 1
				},
				getTouchAction: function() {
					return rt.prototype.getTouchAction.call(this)
				},
				attrTest: function(t) {
					var e, n = this.options.direction;
					return n & (qt | $t) ? e = t.overallVelocity : n & qt ? e = t.overallVelocityX :
						n & $t && (e = t.overallVelocityY), this._super.attrTest.call(this, t) &&
						n & t.offsetDirection && t.distance > this.options.threshold && t
						.maxPointers == this.options.pointers && bt(e) > this.options.velocity && t
						.eventType & jt
				},
				emit: function(t) {
					var e = it(t.offsetDirection);
					e && this.manager.emit(this.options.event + e, t), this.manager.emit(this
						.options.event, t)
				}
			}), f(lt, et, {
				defaults: {
					event: "tap",
					pointers: 1,
					taps: 1,
					interval: 300,
					time: 250,
					threshold: 9,
					posThreshold: 10
				},
				getTouchAction: function() {
					return [fe]
				},
				process: function(t) {
					var e = this.options,
						n = t.pointers.length === e.pointers,
						i = t.distance < e.threshold,
						s = t.deltaTime < e.time;
					if (this.reset(), t.eventType & Nt && 0 === this.count) return this
					.failTimeout();
					if (i && s && n) {
						if (t.eventType != jt) return this.failTimeout();
						var o = !this.pTime || t.timeStamp - this.pTime < e.interval,
							r = !this.pCenter || R(this.pCenter, t.center) < e.posThreshold;
						this.pTime = t.timeStamp, this.pCenter = t.center, r && o ? this.count +=
							1 : this.count = 1, this._input = t;
						var a = this.count % e.taps;
						if (0 === a) return this.hasRequireFailures() ? (this._timer = u((
					function() {
							this.state = Se, this.tryEmit()
						}), e.interval, this), ye) : Se
					}
					return Ee
				},
				failTimeout: function() {
					return this._timer = u((function() {
						this.state = Ee
					}), this.options.interval, this), Ee
				},
				reset: function() {
					clearTimeout(this._timer)
				},
				emit: function() {
					this.state == Se && (this._input.tapCount = this.count, this.manager.emit(this
						.options.event, this._input))
				}
			}), pt.VERSION = "2.0.8", pt.defaults = {
				domEvents: !1,
				touchAction: le,
				enable: !0,
				inputTarget: null,
				inputClass: null,
				preset: [
					[ut, {
						enable: !1
					}],
					[at, {
							enable: !1
						},
						["rotate"]
					],
					[ht, {
						direction: qt
					}],
					[rt, {
							direction: qt
						},
						["swipe"]
					],
					[lt],
					[lt, {
							event: "doubletap",
							taps: 2
						},
						["tap"]
					],
					[ct]
				],
				cssProps: {
					userSelect: "none",
					touchSelect: "none",
					touchCallout: "none",
					contentZooming: "none",
					userDrag: "none",
					tapHighlightColor: "rgba(0,0,0,0)"
				}
			};
			var Ae = 1,
				Pe = 2;
			ft.prototype = {
				set: function(t) {
					return mt(this.options, t), t.touchAction && this.touchAction.update(), t
						.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this
							.input.init()), this
				},
				stop: function(t) {
					this.session.stopped = t ? Pe : Ae
				},
				recognize: function(t) {
					var e = this.session;
					if (!e.stopped) {
						this.touchAction.preventDefaults(t);
						var n, i = this.recognizers,
							s = e.curRecognizer;
						(!s || s && s.state & Se) && (s = e.curRecognizer = null);
						for (var o = 0; o < i.length;) n = i[o], e.stopped === Pe || s && n != s && !n
							.canRecognizeWith(s) ? n.reset() : n.recognize(t), !s && n.state & (ye |
								we | be) && (s = e.curRecognizer = n), o++
					}
				},
				get: function(t) {
					if (t instanceof et) return t;
					for (var e = this.recognizers, n = 0; n < e.length; n++)
						if (e[n].options.event == t) return e[n];
					return null
				},
				add: function(t) {
					if (h(t, "add", this)) return this;
					var e = this.get(t.options.event);
					return e && this.remove(e), this.recognizers.push(t), t.manager = this, this
						.touchAction.update(), t
				},
				remove: function(t) {
					if (h(t, "remove", this)) return this;
					if (t = this.get(t)) {
						var e = this.recognizers,
							n = S(e, t); - 1 !== n && (e.splice(n, 1), this.touchAction.update())
					}
					return this
				},
				on: function(t, e) {
					if (t !== c && e !== c) {
						var n = this.handlers;
						return l(b(t), (function(t) {
							n[t] = n[t] || [], n[t].push(e)
						})), this
					}
				},
				off: function(t, e) {
					if (t !== c) {
						var n = this.handlers;
						return l(b(t), (function(t) {
							e ? n[t] && n[t].splice(S(n[t], e), 1) : delete n[t]
						})), this
					}
				},
				emit: function(t, e) {
					this.options.domEvents && vt(t, e);
					var n = this.handlers[t] && this.handlers[t].slice();
					if (n && n.length) {
						e.type = t, e.preventDefault = function() {
							e.srcEvent.preventDefault()
						};
						for (var i = 0; i < n.length;) n[i](e), i++
					}
				},
				destroy: function() {
					this.element && dt(this, !1), this.handlers = {}, this.session = {}, this.input
						.destroy(), this.element = null
				}
			}, mt(pt, {
				INPUT_START: Nt,
				INPUT_MOVE: Ft,
				INPUT_END: jt,
				INPUT_CANCEL: Rt,
				STATE_POSSIBLE: Te,
				STATE_BEGAN: ye,
				STATE_CHANGED: we,
				STATE_ENDED: be,
				STATE_RECOGNIZED: Se,
				STATE_CANCELLED: Ce,
				STATE_FAILED: Ee,
				DIRECTION_NONE: Lt,
				DIRECTION_LEFT: Xt,
				DIRECTION_RIGHT: Yt,
				DIRECTION_UP: Ut,
				DIRECTION_DOWN: Wt,
				DIRECTION_HORIZONTAL: qt,
				DIRECTION_VERTICAL: $t,
				DIRECTION_ALL: Ht,
				Manager: ft,
				Input: _,
				TouchAction: K,
				TouchInput: H,
				MouseInput: U,
				PointerEventInput: W,
				TouchMouseInput: V,
				SingleTouchInput: q,
				Recognizer: et,
				AttrRecognizer: ot,
				Tap: lt,
				Pan: rt,
				Swipe: ht,
				Pinch: at,
				Rotate: ut,
				Press: ct,
				on: g,
				off: T,
				each: l,
				merge: Et,
				extend: Ct,
				assign: mt,
				inherit: f,
				bindFn: d,
				prefixed: A
			});
			var xe = "undefined" != typeof o ? o : "undefined" != typeof self ? self : {};
			xe.Hammer = pt, i = function() {
				return pt
			}.call(e, n, e, t), void 0 === i || (t.exports = i)
		}(window, document)
	},
	ac87: function(t, e, n) {
		"use strict";
		var i = n("4fda"),
			s = n.n(i);
		s.a
	},
	c247: function(t, e, n) {
		"use strict";
		var i = function() {
				var t = this,
					e = t.$createElement,
					n = t._self._c || e;
				return n("div", {
					staticClass: "menu-bar"
				}, [n("transition", {
					attrs: {
						name: "slide-up"
					}
				}, [n("div", {
					directives: [{
						name: "show",
						rawName: "v-show",
						value: t.ifTitleAndMenuShow,
						expression: "ifTitleAndMenuShow"
					}],
					staticClass: "menu-wrapper",
					class: {
						"hide-box-shadow": t.ifSettingShow || !t.ifTitleAndMenuShow
					}
				}, [n("div", {
					staticClass: "icon-wrapper"
				}, [n("span", {
					staticClass: "icon-menu icon",
					on: {
						click: function(e) {
							return t.showSetting(3)
						}
					}
				})]), n("div", {
					staticClass: "icon-wrapper"
				}, [n("span", {
					staticClass: "icon-progress icon",
					on: {
						click: function(e) {
							return t.showSetting(2)
						}
					}
				})]), n("div", {
					staticClass: "icon-wrapper"
				}, [n("span", {
					staticClass: "icon-bright icon",
					on: {
						click: function(e) {
							return t.showSetting(1)
						}
					}
				})]), n("div", {
					staticClass: "icon-wrapper"
				}, [n("span", {
					staticClass: "icon-a icon",
					on: {
						click: function(e) {
							return t.showSetting(0)
						}
					}
				}, [t._v("A")])])])]), n("transition", {
					attrs: {
						name: "slide-up"
					}
				}, [n("div", {
					directives: [{
						name: "show",
						rawName: "v-show",
						value: t.ifSettingShow,
						expression: "ifSettingShow"
					}],
					staticClass: "setting-wrapper"
				}, [0 === t.showTag ? n("div", {
					staticClass: "setting-font-size"
				}, [n("div", {
					staticClass: "preview",
					style: {
						fontSize: t.fontSizeList[0].fontSize + "px"
					}
				}, [t._v("A")]), n("div", {
					staticClass: "select"
				}, t._l(t.fontSizeList, (function(e, i) {
					return n("div", {
						key: i,
						staticClass: "select-wrapper",
						on: {
							click: function(n) {
								return t
									.setFontSize(e
										.fontSize)
							}
						}
					}, [n("div", {
						staticClass: "line"
					}), n("div", {
						staticClass: "point-wrapper"
					}, [n("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: t
								.defaultFontSize ===
								e
								.fontSize,
							expression: "defaultFontSize === item.fontSize"
						}],
						staticClass: "point"
					}, [n("div", {
						staticClass: "small-point"
					})])]), n("div", {
						staticClass: "line"
					})])
				})), 0), n("div", {
					staticClass: "preview",
					style: {
						fontSize: t.fontSizeList[t.fontSizeList.length -
							1].fontSize + "px"
					}
				}, [t._v("A")])]) : 1 === t.showTag ? n("div", {
					staticClass: "setting-theme"
				}, t._l(t.themeList, (function(e, i) {
					return n("div", {
						key: i,
						staticClass: "setting-theme-item",
						on: {
							click: function(e) {
								return t.setTheme(i)
							}
						}
					}, [n("div", {
						staticClass: "preview",
						class: {
							"no-border": "#fff" !== e
								.style.body.background
						},
						style: {
							background: e.style.body
								.background
						}
					}), n("div", {
						staticClass: "text",
						class: {
							selected: i === t
								.defaultTheme
						}
					}, [t._v(t._s(e.name))])])
				})), 0) : 2 === t.showTag ? n("div", {
					staticClass: "setting-progress"
				}, [n("div", {
					staticClass: "progress-wrapper"
				}, [n("input", {
					ref: "progress",
					staticClass: "progress",
					attrs: {
						type: "range",
						max: "100",
						min: "0",
						step: "1",
						disabled: !t.bookAvailable
					},
					domProps: {
						value: t.progress
					},
					on: {
						change: function(e) {
							return t.onProgressChange(e
								.target.value)
						},
						input: function(e) {
							return t.onProgressInput(e
								.target.value)
						}
					}
				})]), n("div", {
					staticClass: "text-wrapper"
				}, [n("span", [t._v(t._s(t.bookAvailable ? t.progress +
					"%" : "加载中..."))])])]) : t._e()])]), n("content-view", {
					directives: [{
						name: "show",
						rawName: "v-show",
						value: t.ifShowContent,
						expression: "ifShowContent"
					}],
					attrs: {
						ifShowContent: t.ifShowContent,
						navigation: t.navigation,
						bookAvailable: t.bookAvailable
					},
					on: {
						jumpTo: t.jumpTo
					}
				}), n("transition", {
					attrs: {
						name: "fade"
					}
				}, [n("div", {
					directives: [{
						name: "show",
						rawName: "v-show",
						value: t.ifShowContent,
						expression: "ifShowContent"
					}],
					staticClass: "content-mask",
					on: {
						click: t.hideContent
					}
				})])], 1)
			},
			s = [],
			o = (n("a9e3"), function() {
				var t = this,
					e = t.$createElement,
					n = t._self._c || e;
				return n("transition", {
					attrs: {
						name: "slide-right"
					}
				}, [n("div", {
					staticClass: "content"
				}, [t.bookAvailable ? n("div", {
					staticClass: "content-wrapper"
				}, t._l(t.navigation.toc, (function(e, i) {
					return n("div", {
						key: i,
						staticClass: "content-item",
						on: {
							click: function(n) {
								return t.jumpTo(e.href)
							}
						}
					}, [n("span", {
						staticClass: "text"
					}, [t._v(t._s(e.label))])])
				})), 0) : n("div", {
					staticClass: "empty"
				}, [t._v("加载中...")])])])
			}),
			r = [],
			a = {
				props: {
					ifShowContent: Boolean,
					navigation: Object,
					bookAvailable: Boolean
				},
				methods: {
					jumpTo: function(t) {
						this.$emit("jumpTo", t)
					}
				}
			},
			c = a,
			u = (n("14c30"), n("2877")),
			h = Object(u["a"])(c, o, r, !1, null, "0b5f219b", null),
			l = h.exports,
			p = {
				components: {
					ContentView: l
				},
				props: {
					ifTitleAndMenuShow: {
						type: Boolean,
						default: !1
					},
					fontSizeList: Array,
					defaultFontSize: Number,
					themeList: Array,
					defaultTheme: Number,
					bookAvailable: {
						type: Boolean,
						default: !1
					},
					navigation: Object
				},
				data: function() {
					return {
						ifSettingShow: !1,
						showTag: 0,
						progress: 0,
						ifShowContent: !1
					}
				},
				methods: {
					hideContent: function() {
						this.ifShowContent = !1
					},
					jumpTo: function(t) {
						this.$emit("jumpTo", t)
					},
					onProgressInput: function(t) {
						this.progress = t, this.$refs.progress.style.backgroundSize = "".concat(this
							.progress, "% 100%")
					},
					onProgressChange: function(t) {
						this.$emit("onProgressChange", t)
					},
					setTheme: function(t) {
						this.$emit("setTheme", t)
					},
					setFontSize: function(t) {
						this.$emit("setFontSize", t)
					},
					showSetting: function(t) {
						this.showTag = t, 3 === this.showTag ? (this.ifSettingShow = !1, this
							.ifShowContent = !0) : this.ifSettingShow = !0
					},
					hideSetting: function() {
						this.ifSettingShow = !1
					}
				}
			},
			f = p,
			d = (n("ac87"), Object(u["a"])(f, i, s, !1, null, "2b350ec4", null));
		e["a"] = d.exports
	},
	c860: function(t, e, n) {},
	f2c3: function(t, e, n) {
		"use strict";
		var i = n("9429"),
			s = n.n(i);
		s.a
	},
	f305: function(t, e, n) {}
});
