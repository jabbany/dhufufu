Tooltip.prototype = {
    constructor: Tooltip,
    init: function (type, element, options) {
        var eventIn, eventOut
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.enabled = true
        if (this.options.trigger != 'manual') {
            eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
            eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
            this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
            this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
        }
        this.options.selector ? (this._options = $.extend({}, this.options, {
            trigger: 'manual',
            selector: ''
        })) : this.fixTitle()
    },
    getOptions: function (options) {
        options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())
        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }
        return options
    },
    enter: function (e) {
        var self = $(e.currentTarget)[this.type](this._options).data(this.type)
        if (!self.options.delay || !self.options.delay.show) return self.show()
        clearTimeout(this.timeout)
        self.hoverState = 'in'
        this.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    },
    leave: function (e) {
        var self = $(e.currentTarget)[this.type](this._options).data(this.type)
        if (this.timeout) clearTimeout(this.timeout)
        if (!self.options.delay || !self.options.delay.hide) return self.hide()
        self.hoverState = 'out'
        this.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    },
    show: function () {
        var $tip, inside, pos, actualWidth, actualHeight, placement, tp, offset = this.options.offset;
        if (this.hasContent() && this.enabled) {
            $tip = this.tip()
            this.setContent()
            if (this.options.animation) {
                $tip.addClass('fade')
            }
            placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement
            inside = /in/.test(placement)
            $tip.remove().css({
                top: 0,
                left: 0,
                display: 'block'
            }).appendTo(inside ? this.$element : document.body)
            pos = this.getPosition(inside)
            actualWidth = $tip[0].offsetWidth
            actualHeight = $tip[0].offsetHeight
            switch (inside ? placement.split(' ')[1] : placement) {
                case 'bottom':
                    tp = {
                        top: pos.top + pos.height,
                        left: pos.left + pos.width / 2 - actualWidth / 2
                    }
                    break
                case 'top':
                    tp = {
                        top: pos.top - actualHeight - offset,
                        left: pos.left + pos.width / 2 - actualWidth / 2
                    }
                    break
                case 'left':
                    tp = {
                        top: pos.top + pos.height / 2 - actualHeight / 2,
                        left: pos.left - actualWidth
                    }
                    break
                case 'right':
                    tp = {
                        top: pos.top + pos.height / 2 - actualHeight / 2,
                        left: pos.left + pos.width
                    }
                    break
            }
            $tip.css(tp).addClass(placement).addClass('in')
        }
    },
    isHTML: function (text) {
        return typeof text != 'string' || (text.charAt(0) === "<" && text.charAt(text.length - 1) === ">" && text.length >= 3) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    },
    setContent: function () {
        var $tip = this.tip(),
            title = this.getTitle()
            $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
            $tip.removeClass('fade in top bottom left right')
    },
    hide: function () {
        var that = this,
            $tip = this.tip()
            $tip.removeClass('in')

            function removeWithAnimation() {
                var timeout = setTimeout(function () {
                    $tip.off($.support.transition.end).remove()
                }, 500)
                $tip.one($.support.transition.end, function () {
                    clearTimeout(timeout)
                    $tip.remove()
                })
            }
        $.support.transition && this.$tip.hasClass('fade') ? removeWithAnimation() : $tip.remove()
    },
    fixTitle: function () {
        var $e = this.$element
        if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
        }
    },
    hasContent: function () {
        return this.getTitle()
    },
    getPosition: function (inside) {
        return $.extend({}, (inside ? {
            top: 0,
            left: 0
        } : this.$element.offset()), {
            width: this.$element[0].offsetWidth,
            height: this.$element[0].offsetHeight
        })
    },
    getTitle: function () {
        var title, $e = this.$element,
            o = this.options
            title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)
            return title
    },
    tip: function () {
        return this.$tip = this.$tip || $(this.options.template)
    },
    validate: function () {
        if (!this.$element[0].parentNode) {
            this.hide()
            this.$element = null
            this.options = null
        }
    },
    enable: function () {
        this.enabled = true
    },
    disable: function () {
        this.enabled = false
    },
    toggleEnabled: function () {
        this.enabled = !this.enabled
    },
    toggle: function () {
        this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }
}
$.fn.tooltip = function (option) {
    return this.each(function () {
        var $this = $(this),
            data = $this.data('tooltip'),
            options = typeof option == 'object' && option
        if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
        if (typeof option == 'string') data[option]()
    })
}
$.fn.tooltip.Constructor = Tooltip
$.fn.tooltip.defaults = {
    animation: true,
    placement: 'top',
    offeset: 0,
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover',
    title: '',
    delay: 0
}
}(window.jQuery);;;
(function ($) {
    $.fn.extend({
        share: function (options) {
            options = $.extend({}, $.Share.defaults, options);
            return new $.Share(this, options);
        }
    });
    $.Share = function (input, options) {
        var title = options.title ? options.title : document.title;
        var content = options.content ? options.content : document.title;
        var url = options.url ? options.url : document.URL;
        $.each(options.sharePlace, function (name, tag) {
            input.find(tag).each(function () {
                var href = eval("options.dictLink." + name + "(this, title, content, url);");
                switch (options.popupModel) {
                    case "link":
                        $(this).attr("target", options.target);
                        $(this).attr("href", href);
                        break;
                    case "window":
                        $(this).bind("click", function () {
                            window.open(href, "jcshare", "width=700, height=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                        });
                        break;
                    case "dialog":
                        $(this).bind("click", function () {
                            window.showModalDialog(href, new Object(), "dialogWidth:700px;dialogHeight:400px");
                        });
                        break;
                }
            });
        });
    };
    $.Share.defaults = {
        share: ".share",
        sharePlace: {
            kaixin: ".share_kaixin",
            sina: ".share_sina",
            renren: ".share_renren",
            email: ".share_email",
            douban: ".share_douban",
            qq: ".share_qq",
            google: ".share_google",
            twitter: ".share_twitter"
        },
        title: "",
        content: "",
        url: "",
        popupModel: "link",
        target: "_blank",
        dictLink: {
            kaixin: function (div, title, content, url) {
                return "http://www.kaixin001.com/repaste/share.php?rtitle=" + encodeURIComponent(title) + "&rurl=" + encodeURIComponent(url) + "&rcontent=" + encodeURIComponent(content);
            },
            sina: function (div, title, content, url) {
                return "http://v.t.sina.com.cn/share/share.php?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title);
            },
            douban: function (div, title, content, url) {
                return "http://www.douban.com/recommend/?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title);
            },
            renren: function (div, title, content, url) {
                return "http://share.xiaonei.com/share/buttonshare.do?link=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title);
            },
            qq: function (div, title, content, url) {
                return "http://v.t.qq.com/share/share.php?title=" + encodeURI(title) + "&url=" + encodeURIComponent(url);
            },
            twitter: function (div, title, content, url) {
                return "https://twitter.com/intent/tweet?source=webclient&text=" + encodeURI(title) + "&url=" + encodeURIComponent(url);
            }
        }
    };
})(jQuery);;
(function ($) {
    var l, a, j = 0,
        suggestList, n = 0,
        m = "",
        k = [],
        p = "",
        o = "",
        g = {
            getCarePos: function (c, b) {
                var a = $("<em>&nbsp;</em>");
                c = $(c);
                var f = c.offset(),
                    i = {};
                l || (l = $("<pre></pre>").css(this.initPreStyle(c)), l.appendTo("body"));
                l.html(b).append(a);
                i = a.position();
                return {
                    left: i.left + f.left + 2,
                    top: i.top + f.top + 21
                }
            },
            initPreStyle: function (c) {
                return {
                    position: "absolute",
                    left: -9999,
                    width: c.width() + "px",
                    padding: "8px",
                    font: '14px/20px "Helvetica Neue", Helvetica, Arial',
                    "word-wrap": "break-word",
                    border: "1px"
                }
            },
            moveSelectedItem: function (c) {
                var b = a.find("li");
                j = a.find(".on").index();
                n && (j += c, j >= n && (j -= n), j < 0 && (j === -2 && (j = -1), j += n), b.removeClass("on"), $(b[j]).addClass("on"))
            },
            getCursorPosition: function (c) {
                if (document.selection) {
                    c.focus();
                    var b = document.selection.createRange(),
                        a = b.duplicate();
                    a.moveToElementText(c);
                    a.setEndPoint("EndToEnd", b);
                    c.selectionStart = a.text.length - b.text.length;
                    c.selectionEnd = c.selectionStart + b.text.length
                }
                return c.selectionStart
            },
            setCursorPosition: function (c, a) {
                this.selectRangeText(c, a, a)
            },
            selectRangeText: function (a, b, e) {
                if (document.selection) {
                    var f = a.createTextRange();
                    f.moveEnd("character", -a.value.length);
                    f.moveEnd("character", e);
                    f.moveStart("character", b);
                    f.select()
                } else a.setSelectionRange(b, e), a.focus()
            },
            deleteRangeText: function (a, b) {
                var h = this.getCursorPosition(a),
                    f = a.scrollTop,
                    i = a.value;
                a.value = b > 0 ? i.slice(0, h - b) + i.slice(h) : i.slice(0, h) + i.slice(h - b);
                this.setCursorPosition(a, h - (b < 0 ? 0 : b));
                firefox = $.browser.mozilla && setTimeout(function () {
                    if (a.scrollTop !== f) a.scrollTop = f
                }, 10)
            },
            insertAfterCursor: function (a, b, h) {
                if (document.selection) {
                    a.focus();
                    document.selection.createRange().text = b + " ";
                } else {
                    var f = a.selectionStart;
                    g = a.value.length;
                    var i = a.scrollTop,
                        g = a.value.slice(0, f) + b + a.value.slice(f, g);
                    a.value = g.replace(/<b[^>]+>|<\/b>/g, "") + " ";
                    this.setCursorPosition(a, f + b.length + 1);
                    firefox = $.browser.mozilla && setTimeout(function () {
                        if (a.scrollTop !== i) a.scrollTop = i
                    }, 0)
                }
            }
        };
    $.fn.suggestBox = function (c) {
        var options = $.extend({
            mode: "complete",
            itemCount: 10,
            customData: null,
            cached: true,
            highlighter: ".highlighter",
            tips: "@ 可以召唤指定用户"
        }, c),
            h = !0,
            didSelectItem = function (item, highlighter) {
                var f = a.find(".on").attr("id").replace(/(<\/|<)b>/g, "") || "",
                    i = $.trim(a.find(".on").text().split("@")[1]);
                k.push(f + ":" + i);
                k = $.unique(k);
                g.deleteRangeText(item, p.length);
                g.insertAfterCursor(item, i, highlighter);
                a.hide();
            }, mentionTips = function () {
                a.html('<div class="tips">' + options.tips + "</div>")
            }, insertMetionList = function (data, word) {
                var html = '';
                if (data) {
                    if (word != undefined) {
                        var limit = 0;
                        var grepItems = $.grep(data, function (user, key) {
                            if (user.index.toLowerCase().indexOf(word.toLowerCase()) >= 0 && limit < 10) {
                                limit++;
                                return user;
                            }
                        });
                        data = grepItems;
                    }
                    if (data) {
                        $.each(data, function (key, user) {
                            html += '<li id="' + user.uid + '">' + user.nickname + '&nbsp;<span>@' + user.username + '</span></li>';
                        });
                        if (html != '') {
                            html = '<ul>' + html + '</ul>';
                        }
                    }
                }
                return html;
            }, buildMentionList = function (textarea, preChar, offset) {
                var $text = textarea.value,
                    k = $text.substring(0, offset).lastIndexOf("@"),
                    o = $text.substring(k, offset).indexOf(" "),
                    q = {};
                p = $text.substring(k + 1, offset);
                if (options.mode === "complete") {
                    preChar === "@" && (q = g.getCarePos(textarea, $text.substring(0, offset - 1)));
                    buildCompleteList(textarea, q);
                } else {
                    buildSimpleList(textarea);
                }
                if (k !== -1 && o === -1) {
                    if (options.mode === "complete" && (q = g.getCarePos(textarea, $text.substring(0, k))), p && p.length <= 10) {
                        if (options.cached) {
                            if (suggestList == undefined) {
                                $.ajax({
                                    type: "GET",
                                    url: options.dataUrl,
                                    dataType: 'json',
                                    cache: true,
                                    success: function (data) {
                                        suggestList = data;
                                        if (suggestList) {
                                            var html = insertMetionList(suggestList, p);
                                            a.html(html);
                                            a.find("li").hasClass("on");
                                            a.find("li:first").attr("class", "on");
                                            (a.find("li").hasClass("on") || a.find("li:first").attr("class", "on"), n = a.find("li").size(), options.mode === "complete" ? buildCompleteList(textarea, q) : buildSimpleList(textarea));
                                        } else {
                                            a.hide();
                                        }
                                    }
                                });
                            } else {
                                if (suggestList) {
                                    var html = insertMetionList(suggestList, p);
                                    a.html(html);
                                    a.find("li").hasClass("on");
                                    a.find("li:first").attr("class", "on");
                                    (a.find("li").hasClass("on") || a.find("li:first").attr("class", "on"), n = a.find("li").size(), options.mode === "complete" ? buildCompleteList(textarea, q) : buildSimpleList(textarea));
                                } else {
                                    a.hide();
                                }
                            }
                        }
                    } else {
                        if (options.mode === "complete") {
                            mentionTips();
                        } else {
                            data = options.customData();
                            if (data) {
                                n = data.length;
                                var html = insertMetionList(data);
                                a.html(html);
                                a.children().click(function () {
                                    didSelectItem(textarea, options.highlighter);
                                });
                            } else {
                                mentionTips();
                            }
                        }
                    }
                } else {
                    a && a.hide();
                }
            }, buildCompleteList = function (d, c) {
                $("#userMetionSimpleList").remove();
                a = $("#userMetionList");
                a.length || (a = $('<div id="{ID}" class="suggest-overlay"></div>'.replace("{ID}", "userMetionList")), a.appendTo("body"));
                a.css({
                    top: c.top + "px",
                    left: c.left + "px"
                }).show();
                a.children().click(function () {
                    didSelectItem(d, options.highlighter)
                })
                a.find('li').hover(function () {
                    $(this).parent().children(".on").removeClass().end().end().toggleClass("on");
                })
            }, buildSimpleList = function (d) {};
        this.bind("keyup", function (d) {
            var c = c || $(options.highlighter);
            offset = g.getCursorPosition(this);
            preChar = d.target.value.charAt(offset - 1);
            d.target.value || c.html("");
            d.keyCode !== 38 && d.keyCode !== 40 && d.keyCode !== 13 && d.keyCode !== 16 && d.keyCode !== 9 && buildMentionList(this, preChar, offset);
            (d.keyCode === 9 || d.keyCode === 13) && a && a.find(".on").size() && a.is(":visible") && didSelectItem(this, options.highlighter)
        });
        this.bind("keydown", function (d) {
            h = (d.ctrlKey || d.metaKey) && d.keyCode === 65 || d.shiftKey && (d.keyCode === 37 || d.keyCode === 39) ? !1 : !0;
            if (a && a.is(":visible") && a.find("ul").length) switch (d.keyCode) {
                case 32:
                    a.hide();
                    break;
                case 38:
                    d.preventDefault();
                    g.moveSelectedItem(-1);
                    break;
                case 40:
                    d.preventDefault();
                    g.moveSelectedItem(1);
                    break;
                case 9:
                case 13:
                    d.preventDefault()
            }
        });
        $("body").click(function () {
            a && a.length && a.hide()
        });
        this.bind("mention", function (a, c, b, f) {
            k.push(c + ":" + b);
            k = $.unique(k);
            g.insertAfterCursor(this, "@" + b, f)
        })
    }
})(jQuery);;
var designDefault = ["background_color", "header_background_color", "text_color", "link_color", "header_text_color", "nav_color", "nav_link_color"];
var chiiLib = {
    konami: {
        init: function () {
            $(document).konami(function () {
                window.location.href = '/FollowTheRabbit';
            });
        }
    },
    widget: {
        moefm: function (bgm_id, title) {
            var bgm_id = parseInt(bgm_id),
                title = encodeURIComponent(title);
            $.ajax({
                type: "GET",
                url: "http://moe.fm/search/direct?title=" + title + "&bgm_id=" + bgm_id + "&listen=1&api=json",
                dataType: 'jsonp',
                success: function (json) {
                    if (json.response.has_mp3) {
                        var url = json.response.url,
                            html = '<div class="SidePanelMini clearit"><a href="' + url + '" target="_blank"><img src="/img/btn/btn_moe_fm.png" valign="absmiddle" class="ll" /></a><strong><a href="' + url + '" target="_blank">去萌否电台收听</a></strong><p><small class="grey">萌否电台邀请测试中</small></p></div>'
                        $('#columnSubjectInHomeB div.shareBtn').before(html);
                    }
                },
                error: function (json) {}
            });
        }
    },
    ukagaka: {
        isDisplay: function (isDisplay, animated, timeout) {
            var $ukagaka = $("#robot"),
                $ukagaka_btn = $('#showrobot');
            if (timeout == undefined) {
                var timeout = 0;
            }
            if (isDisplay) {
                if (animated == undefined) {
                    $ukagaka.show();
                } else {
                    $ukagaka.fadeIn(500);
                }
                $ukagaka_btn.html('隐藏春菜 ▼');
            } else {
                if (animated == undefined) {
                    $ukagaka.hide();
                } else {
                    setTimeout(function () {
                        $ukagaka.fadeOut(500);
                    }, timeout);
                }
                $ukagaka_btn.html('显示春菜 ▲');
            }
        },
        isCookieDisplay: function () {
            if (!$.cookie('robot')) {
                chiiLib.ukagaka.isDisplay(false);
            } else {
                chiiLib.ukagaka.isDisplay(true);
            }
        },
        toggleDisplay: function () {
            if ($('#robot').is(':hidden')) {
                $('#showrobot').html('隐藏春菜 ▼');
                $("#robot").fadeIn(500);
                $.cookie('robot', 'show', {
                    expires: 2592000,
                    path: '/'
                });
            } else {
                $('#showrobot').html('显示春菜 ▲');
                $("#robot").fadeOut(500);
                $.cookie('robot', '', {
                    path: '/',
                    expires: -1
                });
            }
        },
        presentSpeech: function (html) {
            var $robot = $('#robot');
            if ($robot.is(':hidden')) {
                chiiLib.ukagaka.isDisplay(true, true);
            }
            $("#robot_speech").hide();
            $("#robot_speech_js").hide().html(html).slideDown();
            $("a.ukagaka_speech_dismiss").live("click", function () {
                chiiLib.ukagaka.dismissSpeech();
            });
            $("a.ukagaka_robot_dismiss").live("click", function () {
                chiiLib.ukagaka.isDisplay(false, false);
            });
        },
        dismissSpeech: function () {
            $("#robot_speech_js").hide();
            $("#robot_speech").slideDown();
        },
        initVoice: function () {
            $('#ukagaka_voice').click(function () {
                var voice_str = '<object width="1" height="1"><param name="movie" value="/img/ukagaka_voice/ukagaka_voice.swf"></param><param name="loop" value="0"></param><param name="allowscriptaccess" value="always"></param><param name="wmode" value="transparent"></param><embed src="/img/ukagaka_voice/ukagaka_voice.swf" type="application/x-shockwave-flash" allowscriptaccess="always" loop="0" wmode="transparent" width="1" height="1"></embed></object>';
                $('#ukagaka_voice').html(voice_str);
            });
        },
        presentEpComment: function (ep_id, status_name) {
            var comment_url = '/subject/ep/' + ep_id + '/new_reply';
            chiiLib.ukagaka.presentSpeech('<p>观看状态已保存为「' + status_name + '」，要不要稍微吐槽一下?</p><div class="tsukkomi clearit"><form id="EpTsukkomiFrom" name="EpTsukkomiFrom" action="' + comment_url + '" method="post"><textarea class="quick" rows="2" cols="45" name="content" style="width:96%;height:60px;" onkeydown="seditor_ctlent(event,\'EpTsukkomiFrom\');"></textarea> <span class="rr"><a href="/ep/' + ep_id + '" class="ukagaka_robot_dismiss">看看其他人的吐槽</a> | <a href="javascript:void(0);" class="ukagaka_robot_dismiss">不必了</a></span><input class="inputBtn" type="submit" name="submit" value="吐槽"></form></div>');
            $('#EpTsukkomiFrom').submit(function () {
                var $content = $(this).find('[name=content]').val();
                $.ajax({
                    type: "POST",
                    url: comment_url + '?ajax=1',
                    data: ({
                        content: $content
                    }),
                    dataType: 'json',
                    success: function (json) {
                        chiiLib.ukagaka.presentSpeech('吐槽成功，去看看 <a href="/ep/' + ep_id + '">其他人</a> 的吐槽吧。');
                        chiiLib.ukagaka.isDisplay(false, true, 3000);
                    },
                    error: function (html) {}
                });
                return false;
            });
        },
        presentTsukkomi: function () {
            $('#openTsukkomi').click(function () {
                chiiLib.ukagaka.presentSpeech('<div class="tsukkomi clearit"><form id="TsukkomiFrom" name="TsukkomiFrom" action="/update/user/say" method="post"><textarea id="say_input" class="quick" rows="2" cols="45" name="say_input" style="width:96%;height:60px;" onkeyup="checkTsukkomiInput(\'say_input\', \'Tsukkomi_status\');" onkeydown="seditor_ctlent(event,\'TsukkomiFrom\');"></textarea><div id="Tsukkomi_status" class="ll"><small class="grey">还可以输入123 字</small></div><input class="rr inputBtnSmall" value="Update" type="submit" name="submit"></form></div>');
                $("#say_input").focus();
                $('#TsukkomiFrom').submit(function () {
                    var new_say = $('#say_input').val();
                    if (new_say != '') {
                        $("#robot_speech_js").html(AJAXtip['wait'] + AJAXtip['saving']);
                        $.ajax({
                            type: "POST",
                            url: "/update/user/say?ajax=1",
                            data: ({
                                say_input: new_say
                            }),
                            dataType: 'text',
                            success: function (html) {
                                chiiLib.ukagaka.presentSpeech(AJAXtip['addSay']);
                            },
                            error: function (html) {
                                chiiLib.ukagaka.presentSpeech(AJAXtip['error']);
                            }
                        });
                    } else {
                        $("#say_input").animate({
                            marginLeft: "5px"
                        }, 50).animate({
                            marginLeft: "0",
                            marginRight: "5px"
                        }, 50).animate({
                            marginRight: "0",
                            marginLeft: "5px"
                        }, 50).animate({
                            marginLeft: "0",
                            marginRight: "5px"
                        }, 50);
                    }
                    return false;
                });
            });
        },
        initMenu: function () {
            $('#ukagaka_menu').click(function () {
                chiiLib.ukagaka.presentSpeech('有什么可以为您服务的呢？<ul><li><span>◇ <a href="javascript:void(0);" id="openTsukkomi" class="nav">我要吐槽</a></span></li><li>◆ <a href="/pm/compose.chii" class="nav">发短信</a></li><li>◇ <a href="javascript:void(0);" id="openTyokyo" class="nav">调教</a></li><li>◇ <a href="/settings/ukagaka" class="nav">设置春菜</a></li><li>◆ <a href="javascript:void(0);" class="nav ukagaka_speech_dismiss">返回</a></li></ul>');
                $('#openTyokyo').click(function () {
                    chiiLib.ukagaka.presentSpeech('调教我需要进入尚在测试阶段的 Chobits Terminal，并可能在得知我的对话内容后失去未知的乐趣，您确定要继续么？<ul class="clearit"><li>◆ <a href="javascript:void(0);" class="nav ukagaka_speech_dismiss">还是算了</a></li><li>&nbsp;</li><li>&nbsp;</li><li><span>◇ <a href="/terminal" id="openTsukkomi" class="nav">我要继续!</a></span><br /></li></ul>');
                });
                chiiLib.ukagaka.presentTsukkomi();
                return false;
            });
        },
        init: function () {
            if (typeof (SHOW_ROBOT) != "undefined") {
                if (SHOW_ROBOT == 1) {
                    chiiLib.ukagaka.isDisplay(true);
                } else {
                    chiiLib.ukagaka.isCookieDisplay();
                }
            } else {
                chiiLib.ukagaka.isCookieDisplay();
            }
            $('#showrobot').click(function () {
                chiiLib.ukagaka.toggleDisplay();
                $(this).blur();
            });
            chiiLib.ukagaka.initVoice();
            chiiLib.ukagaka.initMenu();
        }
    },
    home_guest: {
        init: function () {
            $('#home_calendar').find('a.thumbTip').tooltip({
                offset: 40
            });
            $.ajaxSetup({
                cache: true
            });
            $.getScript("/min/g=jquery_sequence", function () {
                setTimeout(function () {
                    var options = {
                        autoPlayDelay: 4000,
                        hidePreloaderDelay: 500,
                        hidePreloaderUsingCSS: false,
                        animateStartingFrameIn: true,
                        transitionThreshold: 500,
                        preloader: true,
                        pauseOnElementsOutsideContainer: false,
                        customKeyEvents: {
                            80: "pause"
                        }
                    };
                    var sliderNav = $('#sliderNav');
                    var sequence = $("#sliderSequence").sequence(options).data("sequence");
                    sequence.afterLoaded = function () {
                        sliderNav.find("li:nth-child(" + (sequence.settings.startingFrameID) + ") span").addClass("active");
                    }
                    sequence.beforeNextFrameAnimatesIn = function () {
                        sliderNav.find("li:not(:nth-child(" + (sequence.nextFrameID) + ")) span").removeClass("active");
                        sliderNav.find("li:nth-child(" + (sequence.nextFrameID) + ") span").addClass("active");
                    }
                    sliderNav.find("li").click(function () {
                        if (!sequence.active) {
                            $(this).children("span").removeClass("active").children("span").addClass("active");
                            sequence.nextFrameID = $(this).index() + 1;
                            sequence.goTo(sequence.nextFrameID);
                        }
                    });
                }, 100);
                $.ajaxSetup({
                    cache: false
                });
            });
        }
    },
    home: {
        prgBatchManager: function (form) {
            var $action = form.attr('action'),
                $subject_id = $action.split('/').pop(),
                $watched_eps = form.find('[name=watchedeps]').val(),
                $watched_vols = form.find('[name=watched_vols]').val(),
                $btnSubmit = form.find('div.btnSubmit');
            $("#robot").fadeIn(500);
            $("#robot_balloon").html(AJAXtip['wait'] + '正在为你保存收视进度...');
            $btnSubmit.html('<img src="/img/loading_s.gif" height="10" width="10" />');
            $.ajax({
                type: "POST",
                url: $action + '?ajax=1',
                data: ({
                    watchedeps: $watched_eps,
                    watched_vols: $watched_vols
                }),
                dataType: 'json',
                success: function (json) {
                    $btnSubmit.html('<input class="btn" type="submit" name="submit" value="更新" />');
                    $("#robot_balloon").html('恭喜恭喜，进度更新成功～');
                    $("#robot").animate({
                        opacity: 1
                    }, 2500).fadeOut(500);
                },
                error: function (html) {
                    $btnSubmit.html('<input class="btn" type="submit" name="submit" value="更新" />');
                    $("#robot_balloon").html(AJAXtip['error']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                }
            });
        },
        prgInitPanel: function () {
            var $infoPanel = $('#cloumnSubjectInfo'),
                $categoryTab = $('#prgCatrgoryFilter'),
                $cur_tab = $categoryTab.find('a.focus'),
                $type_id = $cur_tab.attr('subject_type');
            if ($('#prgManagerMain').hasClass('tinyModeWrapper') == true) {
                if ($type_id == 1) {
                    $infoPanel.find('div.infoWrapper_tv').hide();
                    $infoPanel.find('div.infoWrapper_book').removeClass('hidden');
                } else {
                    $infoPanel.find('div.infoWrapper_tv').show();
                    $infoPanel.find('div.infoWrapper_book').addClass('hidden');
                }
            } else {
                $infoPanel.find('div.infoWrapper_tv').show();
                $infoPanel.find('div.infoWrapper_book').addClass('hidden');
            }
        },
        epStatusClick: function (target) {
            var self = $(target);
            var ep_status = self.attr('id').split('_')[0];
            var ep_id = self.attr('id').split('_')[1];
            var ep_status_name = target.text;
            if (EpBtn == 's') {
                _btn = '';
            } else {
                _btn = '';
            }
            var params = new Object();
            if (ep_status == 'WatchedTill' || ep_status == 'Watched') {
                var epLi = $('#prg_' + ep_id).parent();
                var epUlLis = epLi.parent().children();
                var epAs = epUlLis.children();
                var subject_id = epAs.attr('subject_id');
            }
            if (ep_status == 'WatchedTill') {
                var epLiIndex = epUlLis.index(epLi);
                var ids = new Array();
                for (var i = 0; i <= epLiIndex; i++) {
                    ids[i] = epAs[i].id.split('_')[1];
                }
                params['ep_id'] = ids.toString();
                if (EpBtn == 's' && OtherEps[subject_id] != undefined) {
                    params['ep_id'] = OtherEps[subject_id] + ',' + params['ep_id'];
                }
            }
            chiiLib.ukagaka.presentSpeech(AJAXtip['wait'] + '正在为你保存收视进度...');
            $.ajax({
                type: "POST",
                url: target + '&ajax=1',
                data: params,
                success: function (html) {
                    if (ep_status == 'remove') {
                        $('a#prg_' + ep_id).removeClass().addClass('load-epinfo').addClass(_btn + 'epBtnAir');
                        $('a#epBtnCu_' + ep_id).html('').removeClass('epBtnCu');
                    } else {
                        $('a#prg_' + ep_id).removeClass().addClass('load-epinfo').addClass(_btn + 'epBtn' + ep_status);
                        if (ep_status == 'WatchedTill') {
                            epAs.slice(0, epLiIndex + 1).filter(function (index) {
                                return $(this).attr('class').indexOf('epBtnDrop') == -1;
                            }).removeClass().addClass('load-epinfo').addClass(_btn + 'epBtnWatched');
                        }
                        if (ep_status == 'Watched' || ep_status == 'WatchedTill') {
                            if (epAs.filter('.' + _btn + 'epBtnWatched,.' + _btn + 'epBtnDrop').length == epUlLis.length) {
                                if (EpBtn == 's') {
                                    var sbj_href = $('#sbj_prg_' + subject_id).attr('href');
                                    sbj_href = sbj_href.replace('/update', '/collect');
                                    $('#sbj_prg_' + subject_id).attr('href', sbj_href);
                                    $('#sbj_prg_' + subject_id).trigger('click');
                                } else {
                                    $('#modifyCollect').trigger('click');
                                    $('#collect').attr('checked', 'checked');
                                }
                            }
                        }
                    }
                    if (ep_status == 'WatchedTill') {
                        chiiLib.ukagaka.presentSpeech('恭喜恭喜，你完成 1 - ' + $('#prg_' + ep_id).html() + ' 话咯～');
                        chiiLib.ukagaka.isDisplay(false, true, 2500);
                    } else {
                        chiiLib.ukagaka.presentEpComment(ep_id, ep_status_name);
                    }
                },
                error: function (html) {
                    $("#robot_balloon").html(AJAXtip['error']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                }
            });
        },
        prg: function () {
            $('#prgSubjectList').find('a.thumbTip').tooltip({
                offset: 40
            });
            $('#home_calendar').find('a.thumbTip').tooltip({
                offset: 40
            });
            $('#prgSubjectList').find('a.textTip').tooltip({
                offset: 0
            });
            $('#cloumnSubjectInfo').find('a.textTip').tooltip({
                offset: 0
            });
            $.ajaxSetup({
                cache: true
            });
            $.getScript("/min/g=prg", function () {
                setTimeout(function () {
                    var settings = {
                        verticalDragMinHeight: 20,
                        hideFocus: true
                    };
                    var pane = $('#listWrapper')
                    pane.jScrollPane(settings);
                    paneApi = pane.data('jsp');
                }, 100);
                $.ajaxSetup({
                    cache: false
                });
            });
            var selectors = $('#prgSubjectListSelector'),
                selector_item = selectors.find('a'),
                $list = $('#prgSubjectList'),
                $item = $list.find('a.subjectItem'),
                $infoPanel = $('#cloumnSubjectInfo'),
                $categoryTab = $('#prgCatrgoryFilter'),
                $tab = $categoryTab.find('a'),
                $modeTab = $('#prgManagerMode'),
                $mode = $modeTab.find('a'),
                $batchManagerForm = $infoPanel.find('form.prgBatchManagerForm'),
                $batchManagerBtnPlus = $infoPanel.find('a.input_plus'),
                $prgManagerMain = $('#prgManagerMain'),
                $epCheckIn = $prgManagerMain.find('a.prgCheckIn');
            $batchManagerForm.submit(function () {
                chiiLib.home.prgBatchManager($(this));
                return false;
            });
            $epCheckIn.click(function () {
                var $subject_id = $(this).attr('subject_id'),
                    $ep_id = $(this).attr('ep_id'),
                    $ep_prg_info_watched = $('#Watched_' + $ep_id);
                console.log($ep_prg_info_watched);
                $ep_prg_info_watched.trigger('click');
                return false;
            });
            $batchManagerBtnPlus.click(function () {
                var $input = $(this).closest('div.prgText').find('input'),
                    $count = parseInt($input.val()),
                    $input_id = $input.attr('id'),
                    $subject_id = $input.attr($input_id),
                    $form = $(this).closest('form.prgBatchManagerForm');
                var target_count = $count + 1;
                $('input[' + $input_id + '$=' + $subject_id + ']').val(target_count);
                $form.submit();
            });
            $item.click(function () {
                var subject_id = $(this).attr('subject_id');
                $infoPanel.find('div.info_show').removeClass('info_show').addClass('info_hidden');
                $('#subjectPanel_' + subject_id).removeClass('info_hidden').addClass('info_show');
                return false;
            });
            $tab.click(function () {
                var type_id = $(this).attr('subject_type');
                $categoryTab.find('a').removeClass('focus');
                $(this).addClass('focus');
                if (type_id == 0) {
                    $list.find('li').removeClass('hidden');
                } else {
                    $list.find('li').addClass('hidden');
                    $list.find('li[subject_type$=' + type_id + ']').removeClass('hidden');
                }
                chiiLib.home.prgInitPanel();
                paneApi.reinitialise();
                return false;
            });
            selector_item.click(function () {
                var selector = $(this).attr('id'),
                    browserList = $('#prgSubjectList');
                selectors.find('a').removeClass();
                $(this).addClass('active');
                browserList.removeClass();
                if (selector == 'list_selector') {
                    $.cookie('prg_list_mode', 'list', {
                        expires: 2592000
                    });
                    browserList.addClass('list');
                } else if (selector == 'full_selector') {
                    $.cookie('prg_list_mode', 'full', {
                        expires: 2592000
                    });
                    browserList.addClass('full clearit');
                } else {
                    $.cookie('prg_list_mode', 'grid', {
                        expires: 2592000
                    });
                    browserList.addClass('grid clearit');
                }
                paneApi.reinitialise();
                return false;
            });
            $('#switchNormalManager').click(function () {
                $.cookie('prg_display_mode', 'normal', {
                    expires: 2592000
                });
                $(this).addClass('focus');
                $('#switchTinyManager').removeClass();
                $('div.cloumnSubjects').animate({
                    width: 230
                }, 300).show();
                $('#listWrapper').show(function () {
                    paneApi.reinitialise();
                });
                $infoPanel.find('div.infoWrapper').addClass('info_hidden').removeClass('tinyMode').addClass('blockMode');
                $infoPanel.find('div.infoWrapper:first').removeClass('info_hidden').addClass('info_show');
                $infoPanel.animate({
                    width: 455
                }, 100);
                $prgManagerMain.css('height', '230px');
                $prgManagerMain.removeClass('tinyModeWrapper').addClass('blockModeWrapper');
                chiiLib.home.prgInitPanel();
                return false;
            });
            $('#switchTinyManager').click(function () {
                $.cookie('prg_display_mode', 'tiny', {
                    expires: 2592000
                });
                $(this).addClass('focus');
                $('#switchNormalManager').removeClass();
                $('div.cloumnSubjects').animate({
                    width: 0
                }, 300).hide(function () {
                    $('#listWrapper').hide();
                    $infoPanel.find('div.infoWrapper').removeClass('info_hidden').removeClass('blockMode').addClass('tinyMode');
                    $infoPanel.css('width', '100%');
                    $prgManagerMain.css('height', 'auto');
                    $prgManagerMain.removeClass('blockModeWrapper').addClass('tinyModeWrapper');
                    chiiLib.home.prgInitPanel();
                });
                return false;
            });
        },
        init: function () {
            if (CHOBITS_UID > 0) {
                chiiLib.home.prg();
                window.setInterval(function () {
                    $("#robot_speech_js > a.new_notify").toggleClass('notify');
                }, 800);
                ignoreAllNotify();
            }
        }
    },
    tml_status: {
        init: function () {
            var $reply_form = $('#tml_reply_form_' + STATUS_ID);
            chiiLib.tml.commentsSubReply(STATUS_ID);
            $('#content_' + STATUS_ID).suggestBox({
                dataUrl: "/ajax/buddy_search"
            });
            $reply_form.submit(function () {
                chiiLib.tml.postComments(STATUS_ID, STATUS_URL);
                return false;
            });
        }
    },
    tml: {
        rm: function () {
            $("a.tml_del").hide();
            $(".tml_item").mouseover(function () {
                var tml_id = $(this).attr('id').split('_')[1];
                $('a.tml_del', this).show();
            }).mouseout(function () {
                $('a.tml_del', this).hide();
            });
            $('a.tml_del').click(function () {
                if (confirm('确认删除这条时间线？')) {
                    var tml_id = $(this).attr('id').split('_')[1];
                    $("#robot").fadeIn(500);
                    $("#robot_speech").hide();
                    $("#robot_speech_js").show().html('<img src="/img/loading_s.gif" height="10" width="10" /> 请稍候，正在删除时间线...');
                    $.ajax({
                        type: "GET",
                        url: this + '&ajax=1',
                        success: function (html) {
                            $('#tml_' + tml_id).fadeOut(500);
                            $("#robot_speech_js").html('你选择的时间线已经删除咯～');
                            $("#robot").animate({
                                opacity: 1
                            }, 1000).fadeOut(500);
                        },
                        error: function (html) {
                            $("#robot_speech_js").html(AJAXtip['error']);
                            $("#robot").animate({
                                opacity: 1
                            }, 1000).fadeOut(500);
                        }
                    });
                }
                return false;
            });
        },
        load: function (url, type) {
            var cur_url = '',
                $content = $('#tmlContent');
            if (url == undefined) {
                cur_url = '/ajax/timeline?ajax=1';
            } else {
                cur_url = url + '&ajax=1';
            }
            if (type != undefined) {
                cur_url = '/ajax/timeline?type=' + type + '&ajax=1';
            }
            $content.html('<div class="loading"><img src="/img/loadingAnimation.gif" /></div>');
            $.ajax({
                type: "GET",
                url: cur_url,
                success: function (html) {
                    $content.html(html);
                    chiiLib.tml.prepareAjax();
                },
                error: function (html) {
                    $("#robot_speech_js").html(AJAXtip['error']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                }
            });
        },
        tab_highlight: function (type) {
            var $list = $('#tmlTypeFilter'),
                $filter = $list.find('a');
            var $tabs = $('#timelineTabs'),
                $tab = $tabs.find('a');
            $tab.removeClass('focus');
            $filter.removeClass('on');
            switch (type) {
                default: $('#tab_all').addClass('focus');
                $('#filter_all').addClass('on');
                break;
                case 'say':
                case 'replies':
                    $('#tab_' + type).addClass('focus');
                    $('#filter_say').addClass('on');
                    break;
            }
        },
        filter: function () {
            var $list = $('#tmlTypeFilter'),
                $filter = $list.find('a');
            var $tabs = $('#timelineTabs'),
                $tab = $tabs.find('a');
            $filter.click(function () {
                var $type = $(this).attr('id').split('_')[1],
                    $link = $(this).attr('href');
                chiiLib.tml.tab_highlight($type);
                $filter.removeClass('on');
                $(this).addClass('on');
                chiiLib.tml.load($link);
                return false;
            });
            $tab.click(function () {
                var $type = $(this).attr('id').split('_')[1],
                    $link = $(this).attr('href');
                $tab.removeClass('focus');
                chiiLib.tml.tab_highlight($type);
                chiiLib.tml.load($link);
                return false;
            });
        },
        pager: function () {
            var $pager = $('#tmlPager'),
                $page = $pager.find('a.p');
            $page.click(function () {
                var $href = $(this).attr('href').split('page=')[0],
                    $type = $href.split('type=')[1];
                var $link = $(this).attr('href');
                var new_position = $('#columnTimelineInnerWrapper').offset();
                window.scrollTo(new_position.left, new_position.top);
                chiiLib.tml.load($link);
                return false;
            });
        },
        updateStatus: function () {
            var $input = $('#SayInput');
            $input.suggestBox({
                dataUrl: "/ajax/buddy_search"
            });
            $('#SayFrom').submit(function () {
                var new_say = $input.val();
                if (new_say != '') {
                    submitTip();
                    $.ajax({
                        type: "POST",
                        url: "/update/user/say?ajax=1",
                        data: ({
                            say_input: new_say
                        }),
                        dataType: 'text',
                        success: function (html) {
                            $input.val('');
                            $('#submitBtnO').html('<input class="inputBtn" value="Update" name="submit" type="submit" />');
                            chiiLib.tml.tab_highlight('say');
                            chiiLib.tml.load('', 'say');
                        },
                        error: function (html) {
                            $("#robot_speech_js").html(AJAXtip['error']);
                        }
                    });
                } else {
                    $input.animate({
                        marginLeft: "5px"
                    }, 50).animate({
                        marginLeft: "0",
                        marginRight: "5px"
                    }, 50).animate({
                        marginRight: "0",
                        marginLeft: "5px"
                    }, 50).animate({
                        marginLeft: "0",
                        marginRight: "5px"
                    }, 50);
                }
                return false;
            });
        },
        postComments: function (id, url) {
            var $form = $('#tml_reply_form_' + id),
                $action = $form.attr('action'),
                $content = $('#content_' + id).val();
            submitTip('#tml_reply_form_' + id);
            $.ajax({
                type: "POST",
                url: $action + '?ajax=1',
                data: ({
                    content: $content
                }),
                dataType: 'json',
                success: function (json) {
                    chiiLib.tml.loadComments(id, url);
                },
                error: function (html) {}
            });
        },
        commentsSubReply: function (id) {
            $reply_list = $('#tml_reply_' + id), $reply_item = $reply_list.find('li.reply_item'), $reply_to = $reply_list.find("a.cmt_reply"), $textarea = $('#content_' + id);
            $reply_to.hide();
            $reply_item.mouseover(function () {
                $('a.cmt_reply', this).show();
            }).mouseout(function () {
                $('a.cmt_reply', this).hide();
            });
            $reply_to.click(function () {
                var replyTo = $(this).html(),
                    $inputContent = $textarea.val();
                $textarea.val($inputContent + replyTo + ' ').focus();
                return false;
            });
        },
        loadComments: function (id, url) {
            var $item = $('#tml_' + id),
                $placehold = $item.find('p.date');
            $.ajax({
                type: "GET",
                url: url + '?ajax=1',
                success: function (html) {
                    if ($('#tml_reply_' + id) != undefined) {
                        $('#tml_reply_' + id).remove();
                    }
                    $placehold.after(html);
                    var $subreply = $('#tml_reply_' + id),
                        $reply_form = $('#tml_reply_form_' + id);
                    $subreply.find('a.closeReply').bind('click', function () {
                        $subreply.remove();
                    });
                    chiiLib.tml.commentsSubReply(id);
                    $('#content_' + id).suggestBox({
                        dataUrl: "/ajax/buddy_search"
                    });
                    $reply_form.submit(function () {
                        chiiLib.tml.postComments(id, url);
                        return false;
                    });
                },
                error: function (html) {
                    $("#robot_speech_js").html(AJAXtip['error']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                }
            });
        },
        replyStatus: function () {
            var $tml_list = $('#timeline'),
                $tml_item = $tml_list.find('li.tml_item'),
                $tml_reply = $tml_list.find("a.tml_reply"),
                $tml_comment = $tml_list.find("a.tml_comment");
            $tml_reply.hide();
            $tml_item.mouseover(function () {
                $('a.tml_reply', this).show();
            }).mouseout(function () {
                $('a.tml_reply', this).hide();
            });
            $tml_reply.click(function () {
                var replyTo = $(this).html(),
                    $inputContent = $('#SayInput').val();
                $('#SayInput').val($inputContent + replyTo + ' ').focus();
                return false;
            });
            $tml_comment.click(function () {
                var id = $(this).attr('id').split('_')[1],
                    url = $(this).attr('href');
                chiiLib.tml.loadComments(id, url);
                return false;
            });
        },
        prepareAjax: function () {
            chiiLib.tml.rm();
            chiiLib.tml.pager();
            chiiLib.tml.replyStatus();
        },
        init: function () {
            chiiLib.tml.prepareAjax();
            chiiLib.tml.filter();
            chiiLib.tml.updateStatus();
        }
    },
    subject: {
        init: function () {
            $('a.thumbTip').tooltip({
                offset: 65
            });
            $('a.thumbTipSmall').tooltip({
                offset: 35
            });
            if ($('#subject_summary').height() < 250) {
                $('#show_summary').hide();
            }
            $('#show_summary').click(function () {
                if ($('#subject_summary').hasClass('subject_summary') != true) {
                    $(this).html('more...');
                    $("#subject_summary").removeClass('subject_summary_all').addClass('subject_summary').hide().fadeIn(500);
                } else {
                    $(this).html('X close');
                    $("#subject_summary").removeClass('subject_summary').addClass('subject_summary_all').hide().fadeIn(500);
                }
                $(this).blur();
            });
        }
    },
    wiki: {
        init: function () {
            chiiLib.doujinHome.setTab('#latestEntryTab', '#latestEntryMainTab', 'ul');
            chiiLib.doujinHome.setTab('#emptyEntryTab', '#emptyEntryMainTab', 'ul');
        }
    },
    user_index: {
        init: function () {
            $("a.ico_del").hide();
            $(".tml_item").mouseover(function () {
                $('a.ico_del', this).show();
            }).mouseout(function () {
                $('a.ico_del', this).hide();
            });
            removeListItem('a.idx_clt_del', '#item_', '确认取消收藏该目录？', '取消收藏', '你选择的目录收藏已经解除咯～');
        }
    },
    club: {
        init: function () {
            var list = $('#followManage').find('a[href$=follow],a[href$=unfollow]');
            $(list).click(function () {
                submitPost(this.href, 'action', 'follow-unfollow');
                return false;
            });
        }
    },
    search: {
        initSearchText: function (b) {
            var value = $(b).attr('value'),
                title = $(b).attr('title');
            if (!value || value == title) {
                $(b).addClass("tipInput");
                $(b).attr('value', title);
            }
            $(b).focus(function () {
                $(b).removeClass("tipInput");
                if ($(b).attr('value') == title) {
                    $(b).attr('value', '');
                }
            });
            $(b).blur(function () {
                if (!$(b).attr('value')) {
                    $(b).addClass("tipInput");
                    $(b).attr('value', title);
                }
            })
        }
    },
    doujinHome: {
        setTab: function (list_id, wrapper_id, wrapper_find) {
            var $tab = $(list_id).find('a.switchTab'),
                $wrapper = $(wrapper_id);
            $wrapper.find(wrapper_find).hide();
            $wrapper.find(wrapper_find + ':first-child').show();
            $tab.click(function () {
                var tab_id = $(this).attr('id').split('_')[1];
                $tab.removeClass('focus');
                $(this).addClass('focus');
                $.each($wrapper.find(wrapper_find), function () {
                    var ul_id = $(this).attr('id').split('_')[1];
                    if (ul_id == tab_id) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        },
        init: function () {
            $("#hideDoujinGuide").click(function () {
                $("#doujinGuide").slideUp(600);
                $.cookie('doujin_guide', 'hide', {
                    expires: 2592000,
                    path: '/'
                });
            });
            chiiLib.doujinHome.setTab('#orginalTab', '#orginalMainTab', 'ul');
            chiiLib.doujinHome.setTab('#incomingTab', '#incomingMainTab', 'ul');
            chiiLib.doujinHome.setTab('#focusTab', '#focusMainTab', 'ul');
            chiiLib.search.initSearchText('#searchText');
        }
    },
    doujinCreate: {
        init: function () {
            $.getScript("/min/g=doujin_tag", false, true);
        }
    },
    doujinRelated: {
        init: function () {}
    },
    doujinCollect: {
        manage: function (target) {
            var self = $(target);
            var type = self.attr('id').split('_')[1],
                subject_id = self.attr('id').split('_')[2];
            var hash = self.attr('href').split('gh=')[1];
            var loadingAlert = '',
                successAlert = '';
            if ($('#robot').css('display') == 'none') {
                $("#robot").fadeIn(300);
            }
            $("#robot_speech").hide();
            if (type == 'add') {
                loadingAlert = AJAXtip['addingDoujinCollect'];
                successAlert = '收藏成功咯～';
            } else {
                loadingAlert = AJAXtip['rmDoujinCollect'];
                successAlert = '取消收藏成功咯～';
            }
            $("#robot_speech_js").hide().html(AJAXtip['wait'] + loadingAlert).slideDown();
            $.ajax({
                type: "GET",
                url: target + '&ajax=1',
                success: function (html) {
                    if (type == 'add') {
                        $("#collect_wrapper_" + subject_id).html('<a href="/subject/' + subject_id + '/erase_collect?gh=' + hash + '" class="l">取消收藏</a>');
                    } else {
                        $("#collect_wrapper_" + subject_id).html('<a id="collect_add_' + subject_id + '" href="/subject/' + subject_id + '/collect?gh=' + hash + '" class="manageDoujinCollect chiiBtn"><span>收藏</span></a> ');
                    }
                    $("#robot_speech_js").html(successAlert);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                    setTimeout(function () {
                        $("#robot_speech_js").hide(300);
                        $("#robot_speech").show(300);
                    }, 1500);
                },
                error: function (html) {
                    $("#robot_speech_js").html(AJAXtip['error']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                }
            });
        }
    },
    style_design: {
        setTheme: function (themeID) {
            hasCustomBackgroundImage = false;
            var C = themes[themeID];
            $("#club_background_tile").attr("checked", C.tiled);
            $("#current_background span").css("backgroundImage", "url('" + C.swatch + "')");
            $.each(designDefault, function () {
                $("#club_" + this).val(C[this]).css("background-color");
                $("#club_" + this + "_box").css("background-color", C[this])
            });
            $("#themes").attr("class", "theme" + themeID);
            currentImage = C.image;
            chiiLib.style_design.setBackgroundImage(C.image, C.tiled);
            if (C.image != "none") {
                $("#current_background").addClass("active");
            } else {
                $("#no_background").addClass("active");
            }
            $("#club_theme_default").val(true);
            $("#club_theme").val(themeID);
        },
        isDefaultDesign: function () {
            var D = themes[$("#club_theme").val()];
            if ($("#club_use_background_image").val() == "false" || $("#club_background_tile").attr("checked") != D.tiled || hasCustomBackgroundImage) {
                return false;
            }
            var C = true;
            $.each(designDefault, function () {
                if ($("#club_" + this).val() != D[this]) {
                    alert('no');
                    C = false;
                }
            });
            if (!C) {
                return false;
            }
            return true
        },
        validateDefaultDesign: function () {
            $("#club_theme_default").val(chiiLib.style_design.isDefaultDesign());
            return false;
        },
        updateColors: function () {
            var $menu = $('div.clubMenu'),
                $a = $('a.l');;
            var background_color = $("#club_background_color").val();
            var header_background_color = $("#club_header_background_color").val();
            var text_color = $("#club_text_color").val();
            var link_color = $("#club_link_color").val();
            var header_text_color = $("#club_header_text_color").val();
            var nav_link_color = $("#club_nav_link_color").val();
            var nav_color = $("#club_nav_color").val();
            $("body").css({
                "background-color": background_color,
                color: text_color
            });
            $("#header").css({
                "background-color": header_background_color,
                color: text_color
            });
            $a.css('color', link_color);
            $menu.find('ul li a').css('background-color', nav_color);
            $menu.find('ul li a').css('color', nav_link_color);
            $('h3.sectionTitle').css('color', header_text_color);
            $('#subHeader').find("h2").css('color', header_text_color);
            if ($("#backgrounds").css("display") != "none") {
                $("#current_tab").val("backgrounds")
            } else {
                if ($("#colors").css("display") != "none") {
                    $("#current_tab").val("colors")
                } else {
                    $("#current_tab").val("none")
                }
            }
        },
        setBackgroundImage: function (C, D) {
            if ((D === true) || (D === false)) {
                D = D
            } else {
                if ($("#club_background_tile:checked").val()) {
                    D = true
                } else {
                    D = false
                }
            }
            $("#club_use_background_image").val(C == "none" ? "false" : "true");
            $("body").css({
                "background-image": C == "none" ? "none" : "url('" + C + "')",
                "background-repeat": D ? "repeat" : "no-repeat",
                "background-attachment": D ? "scroll" : "fixed"
            });
            $("#club_background_image").val(C)
        },
        switchDesignTab: function (id) {
            var $bg = $("#modifyBgSection"),
                $header = $("#modifyHeaderSection");
            switch (id) {
                case 'modifyBG':
                    $bg.show();
                    $header.hide();
                    break;
                case 'modifyHeader':
                    $bg.hide();
                    $header.show();
                    break;
            };
        },
        init: function () {
            $("#themes a").click(function () {
                var theme_id = $(this).attr("id");
                chiiLib.style_design.setTheme(theme_id.substring(5));
                return false
            });
            $("#designForm a").click(chiiLib.style_design.updateColors);
            $("#modifyBgSection").hide();
            $("#modifyHeaderSection").hide();
            $("a.designTab").click(function () {
                var $cur = $(this).attr("id");
                chiiLib.style_design.switchDesignTab($cur);
            });
            $("#club_background_tile").click(function () {
                var E = $("#club_background_tile:checked").val();
                $("body").css({
                    "background-repeat": E ? "repeat" : "no-repeat",
                    "background-attachment": E ? "scroll" : "fixed"
                });
            });
            $("#club_background_center").click(function () {
                var E = $("#club_background_center:checked").val();
                $("body").css({
                    "background-position": E ? "50% 0" : "0 0"
                });
            });
        }
    },
    notify: {
        init: function () {
            var $nt_list = $('#comment_list'),
                $nt_item = $nt_list.find('div.tml_item'),
                $nt_link = $nt_list.find('a.nt_link'),
                $nt_del = $nt_list.find("a.nt_del"),
                $nt_del_all = $("#del_all"),
                $nt_hash = $nt_del_all.attr('href').split('gh=')[1],
                $nt_del_notify = $nt_list.find('a.nt_del_notify'),
                $nt_confirm_notify = $nt_list.find('a.nt_confirm_notify'),
                $cur_count = self.parent.$('#notify_count').html(),
                $window = self.parent;
            var updateNotifyCount = function (count) {
                updateNotifyCount(count, 1);
            }
            var getNotifyCount = function (nt_id) {
                var $item = $('.notify_' + nt_id);
                var count = 0;
                if ($item.find('a.merge_count').length) {
                    var count = $item.find('a.merge_count').find('span').text();
                } else {
                    var count = $item.length;
                }
                var total_count = parseInt(count);
                return total_count;
            }
            var updateNotifyCount = function (count, auto_remove) {
                var new_count = $cur_count - count;
                if (new_count <= 0) {
                    $window.$('#home_notify').removeClass('new_notify').removeClass('notify');
                    if (auto_remove == 1) {
                        $window.tb_remove();
                    }
                    $window.$("#robot_speech_js").html('已经没有新提醒咯');
                    $window.$("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                } else {
                    $window.$('#notify_count').html(new_count);
                }
            }
            $nt_link.click(function () {
                var nt_id = $(this).attr('class').split('_')[2];
                var count = getNotifyCount(nt_id);
                $.ajax({
                    type: "GET",
                    url: '/erase/notify/' + nt_id + '?gh=' + $nt_hash + '&ajax=1',
                    success: function (html) {
                        $('#notify_' + nt_id).fadeOut(300);
                        updateNotifyCount(count, 1);
                    },
                    error: function (html) {}
                });
            });
            $nt_del.click(function () {
                var nt_id = $(this).attr('id').split('_')[1];
                var count = getNotifyCount(nt_id);
                $.ajax({
                    type: "GET",
                    url: (this) + '&ajax=1',
                    success: function (html) {
                        $('#notify_' + nt_id).fadeOut(300);
                        updateNotifyCount(count, 1);
                    },
                    error: function (html) {}
                });
                return false;
            });
            $nt_del_all.click(function () {
                $.ajax({
                    type: "GET",
                    url: (this) + '&ajax=1',
                    success: function (html) {
                        $('#comment_list').fadeOut(300);
                        updateNotifyCount($cur_count, 1);
                    },
                    error: function (html) {}
                });
                return false;
            });
            $nt_del_notify.click(function () {
                var nt_id = $(this).attr('id').split('_')[1];
                var count = $('.notify_' + nt_id).length;
                $.ajax({
                    type: "GET",
                    url: (this) + '?ajax=1',
                    success: function (html) {
                        $('.notify_' + nt_id).fadeOut(300);
                        updateNotifyCount(count, 1);
                    },
                    error: function (html) {}
                });
                return false;
            });
            $nt_confirm_notify.click(function () {
                var nt_id = $(this).attr('id').split('_')[1];
                var count = $('.notify_' + nt_id).length;
                $.ajax({
                    type: "GET",
                    url: (this) + '?ajax=1',
                    success: function (html) {
                        $('.notify_' + nt_id).find('div.reply_content').html('已成为你的好友');
                        $('.notify_' + nt_id).find('div.frd_connect').fadeOut(300);
                        updateNotifyCount(count, 0);
                    },
                    error: function (html) {}
                });
                return false;
            });
        }
    },
    rakuen_frame: {
        init: function () {}
    },
    rakuen_topic_list: {
        init: function () {}
    },
    topic_history: {
        init: function () {
            var current;
            var pre;

            function highlight(elemId) {
                pre = elemId;
                var elem = $(elemId);
                elem.addClass("reply_highlight");
            }
            if (document.location.hash) {
                highlight(document.location.hash);
            }
            var isIE6 = $.browser.msie && parseFloat($.browser.version) < 7;
            if (isIE6) {
                $('#sliderContainer').hide();
            } else {
                $.ajaxSetup({
                    cache: true
                });
                $.getScript("/min/g=ui", function () {
                    setTimeout(function () {
                        var positions = playback.split(',');
                        var lastVal;
                        $(document).ready(function () {
                            lastVal = totHistory;
                            $("#slider").slider({
                                value: totHistory,
                                min: 1,
                                max: totHistory,
                                animate: true,
                                slide: function (event, ui) {
                                    if (lastVal > ui.value) {
                                        $(buildQ(lastVal, ui.value)).hide('fast').find('.subreply_textarea').remove();
                                        var query = '#post_' + positions[ui.value];
                                    } else if (lastVal < ui.value) {
                                        $(buildQ(lastVal, ui.value)).show('fast');
                                        var query = '#post_' + positions[ui.value - 1];
                                    }
                                    lastVal = ui.value;
                                    window.scrollTo(0, $(query).offset().top);
                                }
                            });
                        });

                        function buildQ(from, to) {
                            if (from > to) {
                                var tmp = to;
                                to = from;
                                from = tmp;
                            }
                            from++;
                            to++;
                            var query = '';
                            $(pre).removeClass('reply_highlight');
                            for (var i = from; i < to; i++) {
                                if (i != from) query += ',';
                                query += '#post_' + positions[i - 1];
                                if (from > to) {
                                    current = '#post_' + positions[i - 2];
                                    pre = '#post_' + positions[i - 1];
                                } else {
                                    current = '#post_' + positions[i - 1];
                                    pre = '#post_' + positions[i - 2];
                                }
                                $(pre).removeClass('reply_highlight');
                                $(current).addClass('reply_highlight');
                            }
                            return query;
                        }
                        $(function () {
                            var top = $('#sliderContainer').offset().top,
                                width = $('#sliderContainer').width();
                            $(window).scroll(function () {
                                $(document).scrollTop() > top ? $('#sliderContainer').addClass('sticky').css('width', width) : $('#sliderContainer').removeClass('sticky').css('width', 'auto');
                            });
                        });
                        $('a.floor-anchor').click(function () {
                            $(pre).removeClass('reply_highlight');
                            $(current).removeClass('reply_highlight');
                            var id = $(this).attr('href');
                            pre = id;
                            $(id).addClass('reply_highlight');
                        });
                    }, 100);
                    $.ajaxSetup({
                        cache: false
                    });
                });
            }
        }
    },
    event_location_choose: {
        init: function () {
            var city = $('#geo-city');
            var state = $('#geo-state');
            state.change(function () {
                city.empty();
                var stateCode = state.children('option:selected').val();
                $.ajax({
                    type: "GET",
                    url: '/ajax/geo-city/' + stateCode,
                    dataType: 'json',
                    success: function (cityList) {
                        city.empty();
                        for (var cityCode in cityList) {
                            city.append('<option value="' + cityCode + '">' + cityList[cityCode] + '</option>');
                        }
                    },
                    error: function (html) {}
                });
            });
        }
    },
    event_view: {
        init: function () {
            if ($('#eventDesc').height() < 250) {
                $('#showEventSummary').hide();
            }
            $('#showEventSummary').click(function () {
                if ($('#eventDesc').hasClass('eventSummary') != true) {
                    $(this).html('显示全部...');
                    $("#eventDesc").removeClass('eventSummaryAll').addClass('eventSummary').hide().fadeIn(500);
                } else {
                    $(this).html('X 收起');
                    $("#eventDesc").removeClass('eventSummary').addClass('eventSummaryAll').hide().fadeIn(500);
                }
                $(this).blur();
            });
        }
    },
    ajax_reply: {
        insertMainComments: function (list_id, json) {
            if (json.posts.main) {
                var posts = json.posts.main,
                    html = '',
                    $list = $(list_id);
                var bg_class = ($list.find('div.row_reply:last').hasClass('light_odd')) ? 'light_odd' : 'light_even';
                for (var i in posts) {
                    if ($('#post_' + i).length == 0) {
                        var bg_class = (bg_class == 'light_even') ? 'light_odd' : 'light_even';
                        var topic_tool = '';
                        html += '<div id="post_' + posts[i].pst_id + '" class="' + bg_class + ' row_reply clearit"><div class="re_info"><small>' + posts[i].dateline + topic_tool + '</small></div><a href="' + SITE_URL + '/user/' + posts[i].username + '" class="avatar"><img src="' + posts[i].avatar + '" class="avatar ll" align="absmiddle"></a><div class="inner"><strong><a href="' + SITE_URL + '/user/' + posts[i].username + '" class="l post_author_' + posts[i].pst_id + '">' + posts[i].nickname + '</a></strong><span class="tip_j">' + posts[i].sign + '</span><div class="reply_content"><div class="message">' + posts[i].pst_content + '</div></div></div></div>';
                    }
                }
                if (html != '') {
                    if (typeof (REPLY_PREPEND) != "undefined") {
                        $(html).hide().prependTo(list_id).fadeIn();
                    } else {
                        $(html).hide().appendTo(list_id).fadeIn();
                    }
                }
            }
        },
        insertSubComments: function (list_id, json) {
            if (json.posts.sub) {
                var posts = json.posts.sub,
                    $list = $(list_id);
                $.each(posts, function (post_id, sub_posts) {
                    if (sub_posts) {
                        var $post = $('#post_' + post_id),
                            $main_post = $post.find('div.message');
                        if (!$('#topic_reply_' + post_id).length) {
                            $main_post.after('<div id="topic_reply_' + post_id + '" class="topic_sub_reply"></div>');
                        }
                        var html = '';
                        $.each(sub_posts, function (key, val) {
                            if ($('#post_' + val.pst_id).length == 0) {
                                html += '<div id="post_' + val.pst_id + '" class="sub_reply_bg clearit"><div class="re_info"><small>' + val.dateline + '</small></div><a href="' + SITE_URL + '/user/' + val.username + '" class="avatar"><img src="' + val.avatar + '" class="avatar ll" align="absmiddle"></a><div class="inner"><strong class="userName"><a id="70110" href="' + SITE_URL + '/user/' + val.username + '" class="l">' + val.nickname + '</a></strong><div class="cmt_sub_content">' + val.pst_content + '</div></div></div>';
                            }
                        });
                        if (html != '') {
                            $(html).hide().appendTo('#topic_reply_' + post_id).fadeIn();
                        }
                    }
                });
            }
        },
        insertJsonComments: function (list_id, json) {
            chiiLib.ajax_reply.insertMainComments(list_id, json);
            chiiLib.ajax_reply.insertSubComments(list_id, json);
        },
        updateLastView: function (element) {
            var cur_timestamp = Math.round((new Date()).getTime() / 1000);
            element.val(cur_timestamp);
        },
        subReply: function (type, topic_id, post_id, sub_reply_id, sub_reply_uid, post_uid, sub_post_type) {
            var $post = $('#post_' + post_id),
                $main_post = $post.find('div.message'),
                $last_sub_reply = $post.find('div.topic_sub_reply'),
                $sub_reply = $('#post_' + sub_reply_id);
            var $mainForm = $('#ReplyForm'),
                $form_action = $mainForm.attr('action'),
                $lastview_timestamp = $mainForm.find('[name=lastview]');
            if (sub_post_type == 0) {
                var $reply_to = $post.find('a.post_author_' + post_id + ' ').html();
            } else {
                var $reply_to = $post.find('a#' + sub_reply_id).html();
                var $reply_to_content = $sub_reply.find('div.cmt_sub_content').html().replace(/<div class="quote">([^^]*?)<\/div>/, '').replace(/<\/?[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                if ($reply_to_content.length > 100) {
                    $reply_to_content = $reply_to_content.slice(0, 100) + '...';
                }
            }
            var reply_textarea = '<div class="subreply_textarea"><span class="tip_j">回复: ' + $reply_to + '</span><form id="ReplysForm" name="new_comment" method="post" action="' + $form_action + '"><input type="hidden" name="sub_reply_uid" value="' + sub_reply_uid + '" /><input type="hidden" name="topic_id" value="' + topic_id + '" /><input type="hidden" name="post_uid" value="' + post_uid + '" /><input type="hidden" name="post_id" value="' + post_id + '" /><textarea id="content_' + post_id + '" class="reply sub_reply" name="content" cols="45" rows="6" onkeydown="seditor_ctlent(event,\'ReplysForm\');" ></textarea><div id="submitBtnO"><input class="inputBtn" value="写好了" name="submit" type="submit">&nbsp;&nbsp;<a href="javascript:void(0);" onclick="subReplycancel()">取消</a></div></form></div>';
            $('div.subreply_textarea').remove();
            if (sub_post_type == '0') {
                $main_post.after(reply_textarea);
                $('#content_' + post_id).focus();
            } else {
                $last_sub_reply.after(reply_textarea);
                $('#content_' + post_id).focus();
            }
            $('#content_' + post_id).suggestBox({
                dataUrl: "/ajax/buddy_search"
            });
            $('#ReplysForm').submit(function () {
                var sub_reply_uid = $(this).find('[name=sub_reply_uid]').val(),
                    topic_id = $(this).find('[name=topic_id]').val(),
                    post_uid = $(this).find('[name=post_uid]').val(),
                    post_id = $(this).find('[name=post_id]').val(),
                    content = $(this).find('[name=content]').val(),
                    related_photo = $('#related_photo').val(),
                    $author = $('span.reply_author').html(),
                    $avatar = $('span.reply_avatar').html();
                if ($reply_to_content == undefined) {
                    var post_content = content;
                } else {
                    var post_content = '[quote][b]' + $reply_to + '[/b] 说: ' + $reply_to_content + '[/quote]\n' + content;
                }
                if (content != '') {
                    submitTip('#ReplysForm');
                    if (related_photo == undefined) {
                        related_photo = 0;
                    }
                    $.ajax({
                        type: "POST",
                        url: $form_action + '?ajax=1',
                        data: ({
                            topic_id: topic_id,
                            related: post_id,
                            sub_reply_uid: sub_reply_uid,
                            post_uid: post_uid,
                            content: post_content,
                            related_photo: related_photo,
                            lastview: $lastview_timestamp.val()
                        }),
                        dataType: 'json',
                        success: function (json) {
                            $('div.subreply_textarea').remove();
                            chiiLib.ajax_reply.insertJsonComments('#comment_list', json);
                            $lastview_timestamp.val(json.timestamp);
                        },
                        error: function (html) {}
                    });
                } else {
                    $("textarea.sub_reply").animate({
                        marginLeft: "5px"
                    }, 50).animate({
                        marginLeft: "0",
                        marginRight: "5px"
                    }, 50).animate({
                        marginRight: "0",
                        marginLeft: "5px"
                    }, 50).animate({
                        marginLeft: "0",
                        marginRight: "5px"
                    }, 50);
                }
                return false;
            });
        },
        mainReply: function () {
            $('#content').suggestBox({
                dataUrl: "/ajax/buddy_search"
            });
            $('#ReplyForm').submit(function () {
                var $form = $(this),
                    message = $('#content').val(),
                    related_photo = $('#related_photo').val(),
                    $lastview_timestamp = $form.find('[name=lastview]');
                if (message != '') {
                    submitTip();
                    if (related_photo == undefined) {
                        related_photo = 0;
                    }
                    $.ajax({
                        type: "POST",
                        url: $(this).attr('action') + "?ajax=1",
                        data: ({
                            content: message,
                            related_photo: related_photo,
                            lastview: $lastview_timestamp.val()
                        }),
                        dataType: 'json',
                        success: function (json) {
                            chiiLib.ajax_reply.insertJsonComments('#comment_list', json);
                            $lastview_timestamp.val(json.timestamp);
                            $('#content').val('');
                            if (typeof (REPLY_SUBMIT_TITLE) != "undefined") {
                                var submit_title = REPLY_SUBMIT_TITLE;
                            } else {
                                var submit_title = '写好了';
                            }
                            $('#submitBtnO').html('<input class="inputBtn" value="' + submit_title + '" name="submit" type="submit">&nbsp;&nbsp;<span class="tip">使用Ctrl+Enter或Alt+S快速提交</span>');
                        },
                        error: function (json) {
                            submitError();
                        }
                    });
                }
                return false;
            });
        }
    }
};
var AJAXtip = {
    wait: '<img src="/img/loading_s.gif" height="10" width="10" /> 请稍候...',
    saving: '正在保存...',
    eraseReplyConfirm: '确认删除这条回复?',
    eraseingReply: '正在删除回复...',
    eraseReply: '你选择的回复已经删除咯～',
    addingFrd: '正在添加好友...',
    addingDoujinCollect: '正在加入收藏...',
    rmDoujinCollect: '正在取消收藏...',
    addFrd: '恭喜恭喜，好友添加成功咯～',
    addSay: '恭喜恭喜，吐槽成功咯～<br />你可以在 <a href="/timeline?type=say">时光机</a> 里看到自己和好友们的吐槽哟。',
    error: '呜咕，提交出现了一些问题，请稍候再试...',
    no_subject: '呜咕，似乎没有这个条目，请检查URL是否正确或者换一个条目关联...'
}

    function submitTip(main) {
        var waits = ["嘟嘟噜", "咪啪", "大丈夫", "锵锵", "叮咚", "嘎哦", "呜咕"];
        var wait = waits[Math.floor(Math.random() * waits.length)];
        if (main == undefined) {
            $('#submitBtnO').html('<img src="/img/loading_s.gif" height="10" width="10" align="absmiddle" /> <span class=tip_i>' + wait + '~正在发送请求</span>');
        } else {
            $(main).find('#submitBtnO').html('<img src="/img/loading_s.gif" height="10" width="10" align="absmiddle" /> <span class=tip_i>' + wait + '~正在发送请求</span>');
        }
    }

    function submitError() {
        $('#submitBtnO').html('<span class="alarm">' + AJAXtip['error'] + '</span>');
    }

    function ignoreAllNotify()　 {
        $('#notify_ignore_all').click(function () {
            $.ajax({
                type: "GET",
                url: (this) + '&ajax=1',
                success: function (html) {
                    $("#robot_speech").show();
                    $("#robot_speech_js").hide().html('已经没有新提醒咯');
                },
                error: function (html) {}
            });
            return false;
        });
    }

    function pushNotify() {
        $.ajax({
            type: 'get',
            dataType: 'json',
            cache: false,
            url: '/json/notify',
            success: function (json) {
                var count = json.count;
                if (count > 0) {
                    $("#robot").fadeIn(300);
                    $("#robot_speech").hide();
                    $("#robot_speech_js").show().html('<span class="rr"><a id="notify_ignore_all" href="/erase/notify/all">[知道了]</a></span> <a id="home_notify" href="/notify?keepThis=false&TB_iframe=true&height=300&width=550" title="电波提醒" class="thickbox_notify new_notify">哔啵哔啵～你有 <span id="notify_count">' + count + '</span> 条新提醒!</a>');
                } else {}
            },
            complete: function () {
                tb_init('a.thickbox_notify');
                setTimeout("pushNotify()", 20000);
                ignoreAllNotify();
            },
            error: function () {
                $("#robot").fadeIn(300);
                $("#robot_balloon").html(AJAXtip['error']);
                $("#robot").animate({
                    opacity: 1
                }, 1000).fadeOut(500);
            }
        });
    }

    function collapseReplies() {
        if (typeof (COLLAPSE_REPLIES) != "undefined") {
            var $item = $('div.sub_reply_bg');
            $item.each(function () {
                $text = $(this).find('div.cmt_sub_content').text();
                if (/(\+|\-|\＋)\d+$/.test($text)) {
                    $(this).addClass('sub_reply_collapse');
                    $(this).click(function () {
                        $(this).removeClass('sub_reply_collapse');
                        $(this).unbind('click');
                    });
                }
            });
        }
    }

    function removeListItem(btn_dom, item_prefix, tip_confirm, tip_ing, tip_done) {
        $(btn_dom).click(function () {
            if (confirm(tip_confirm)) {
                var tml_id = $(this).attr('id').split('_')[1];
                $("#robot").fadeIn(500);
                $("#robot_speech").hide();
                $("#robot_speech_js").show().html('<img src="/img/loading_s.gif" height="10" width="10" /> 请稍候，' + tip_ing + '...');
                $.ajax({
                    type: "GET",
                    url: this + '?ajax=1',
                    success: function (html) {
                        $(item_prefix + '' + tml_id).fadeOut(500);
                        $("#robot_speech_js").html(tip_done);
                        $("#robot").animate({
                            opacity: 1
                        }, 1000).fadeOut(500);
                        setTimeout(function () {
                            $("#robot_speech_js").hide(300);
                            $("#robot_speech").show(300);
                        }, 1500);
                    },
                    error: function (html) {
                        $("#robot_speech_js").html(AJAXtip['error']);
                        $("#robot").animate({
                            opacity: 1
                        }, 1000).fadeOut(500);
                    }
                });
            }
            return false;
        });
    }

    function submitPost(action, key, val) {
        var form = $('<form>').attr('action', action).attr('method', 'post').append($('<input>').attr('type', 'hidden').attr('name', key).attr('value', val));
        $('body').append(form);
        form.submit();
        return false;
    }
    (function ($) {
        $.fn.konami = function (callback, code) {
            if (code == undefined) code = "38,38,40,40,37,39,37,39,66,65";
            return this.each(function () {
                var kkeys = [];
                $(this).keydown(function (e) {
                    kkeys.push(e.keyCode);
                    if (kkeys.toString().indexOf(code) >= 0) {
                        $(this).unbind('keydown', arguments.callee);
                        callback(e);
                    }
                }, true);
            });
        }
    })(jQuery);
$.getScript = function (url, callback, cache) {
    $.ajax({
        type: "GET",
        url: url,
        success: callback,
        dataType: "script",
        cache: cache
    });
};
$().ready(function () {
    $("#ModifyTopicForm").validate({
        rules: {
            title: "required",
            content: "required"
        },
        messages: {
            title: "请填写标题",
            content: "<br />请填写正文内容"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#ModifyReplyForm").validate({
        rules: {
            content: "required"
        },
        messages: {
            content: "<br />请填写回复内容"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#newTopicForm").validate({
        rules: {
            title: "required",
            content: "required"
        },
        messages: {
            title: "请填写标题",
            content: "<br />请填写正文内容"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#editTopicForm").validate({
        rules: {
            title: "required",
            content: "required"
        },
        messages: {
            title: "请填写标题",
            content: "<br />请填写正文内容"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#ReplyForm").validate({
        rules: {
            content: "required"
        },
        messages: {
            content: "<br />请填写回复内容"
        }
    });
    $("#tmlReplyForm").validate({
        rules: {
            content: "required"
        },
        messages: {
            content: "<br />请填写回复内容"
        }
    });
    $("#pmReplyForm").validate({
        rules: {
            msg_body: "required"
        },
        messages: {
            msg_body: "<br />请填写回复内容"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#resetPasswordForm").validate({
        rules: {
            password: "required",
            password2: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            password: "请输入你的密码",
            password2: {
                required: "请再次输入你的密码",
                equalTo: "密码验证失败，请确认两次输入相同"
            }
        }
    });
    $("#requestPasswordTokenForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: "请输入正确的 Email 地址"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#loginForm").validate({
        rules: {
            password: "required",
            email: {
                required: true
            }
        },
        messages: {
            password: "请输入你的密码",
            email: "(Email 或 用户名)还没有填写哦"
        }
    });
    $("#signupForm").validate({
        rules: {
            nickname: "required",
            password: "required",
            password2: {
                required: true,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            password: "请输入你的密码",
            email: "请输入一个正确的Email地址",
            nickname: "请输入你想使用的昵称",
            password2: {
                required: "请再次输入你的密码",
                equalTo: "密码验证失败，请确认两次输入相同"
            }
        }
    });
    $("#pmForm").validate({
        rules: {
            msg_receivers: "required",
            msg_title: "required",
            msg_body: "required"
        },
        messages: {
            msg_receivers: "请填写收件人",
            msg_title: "请填写短信标题",
            msg_body: "<br />请填写短信正文"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#newGrpForm").validate({
        rules: {
            name: "required",
            title: "required"
        },
        messages: {
            name: "请填写访问地址",
            title: "请填写小组名称"
        }
    });
    $("#newClubForm").validate({
        rules: {
            name: "required",
            title: "required"
        },
        messages: {
            name: "请填写访问地址",
            title: "请填写社团名称"
        }
    });
    $("#newEventMarketForm").validate({
        rules: {
            title: "required",
            address: "required"
        },
        messages: {
            title: "请填写展会名称",
            address: "请填写详细地址"
        },
        submitHandler: function (form) {
            submitTip();
            form.submit();
        }
    });
    $("#newClubForm").validate({
        rules: {
            name: "required",
            title: "required"
        },
        messages: {
            name: "请填写访问地址",
            title: "请填写社团名称"
        }
    });
    $("#newIndexForm").validate({
        rules: {
            title: "required",
            desc: "required"
        },
        messages: {
            title: "请填写目录名称",
            desc: "请填写目录介绍"
        }
    });
});
var getObj = function (objId) {
    return document.all ? document.all[objId] : document.getElementById(objId);
}
var switchDisplay = function (objId) {
    obj = getObj(objId);
    if (obj.style.display != "block") {
        obj.style.display = "block";
    } else {
        obj.style.display = "none";
    }
}

    function showDiv(objectID) {
        obj = getObj(objectID);
        if (obj.style.display == "block") {
            obj.style.display = "none";
        } else {
            obj.style.display = "block";
        }
    }

    function getbyid(id) {
        if (document.getElementById) {
            return document.getElementById(id);
        } else if (document.all) {
            return document.all[id];
        } else if (document.layers) {
            return document.layers[id];
        } else {
            return null;
        }
    }

    function PostTo(subject_id, subject_name, type) {
        if (type == 'subject') {
            document.new_comment.action = '/subject/' + subject_id + '/topic/new';
        } else {
            document.new_comment.action = '/group/' + subject_id + '/topic/new';
        }
        getbyid('subject_name').innerHTML = subject_name;
        getbyid('rakuen_new_topic').style.display = "block";
    }

    function TagSearchIn(tag_chl) {
        document.tagSearch.action = '/search/' + tag_chl + '/tag';
    }

    function checkall(form, prefix, checkall, limit) {
        var checkall = checkall ? checkall : 'chkall';
        if (limit == undefined) {
            limit = 20;
        }
        for (var i = 0; i < form.elements.length; i++) {
            var e = form.elements[i];
            if (e.name != checkall && !e.disabled && (!prefix || (prefix && e.name.match(prefix))) && i < limit) {
                e.checked = form.elements[checkall].checked;
            }
        }
    }

    function seditor_ctlent(event, form_id) {
        if (event.ctrlKey && event.keyCode == 13 || event.altKey && event.keyCode == 83) {
            getbyid(form_id).submit.click();
        }
    }

    function SetTips(value) {
        var tip = {
            cBth: "生日请按照XXXX年XX月XX日来填写，<br />例如1985年7月5日、7月5日。<br />如果不知道该角色生日可留空。",
            cHi: "身高可使用cm为单位，机体高度以官方单位为准。",
            cWe: "体重可使用kg为单位，机体高度以官方单位为准。",
            cBWH: "唔……这个……以B-W-H这样的格式添加好了。",
            cSmr: "如果介绍为多段，请确认每段开头文字为顶格，系统会自动为首行文字进行缩进。",
            RegEmail: "我们承诺不会在未经你允许的情况下公开Email地址，也不向任何外部实体和个人透露你的Email地址。<br />你的Email地址的用途限于辨别你的身份和保证在你忘记密码的时候能恢复你在 Bangumi 的身份和数据。",
            RegNick: "昵称是作为你在 Bangumi 进行各项活动时显示的名号，昵称是可任意修改的，不必为一时不知如何取名而悲伤。",
            momo: "……唔……唔……H是不行的<br /><small>(点击那个地方我就可以说话了哟～☆)</small><br />·<a href=\"#;\" class=\"nav\" onclick=\"switchRobotSpeech();\">返回</a>"
        }
        $("#robot_speech").hide();
        $("#robot_speech_js").hide().html(tip[value]).slideDown();
    }

    function sizeContent(num, objname) {
        var obj = document.getElementById(objname);
        if (parseInt(obj.rows) + num >= 1) {
            obj.rows = parseInt(obj.rows) + num;
        }
        if (num > 0) {
            obj.width = "90%";
        }
    }

    function AddMSGreceiver(nickname) {
        var obj = getObj("msg_receivers");
        obj.value += nickname + ',';
    }

    function GenInterestBox(id) {
        if (id == 'wish') {
            $("#wish").attr("checked", true);
            $('#interest_rate').hide();
        } else {
            $("#" + id).attr("checked", true);
            $('#interest_rate').show();
        }
    }

    function MoreElement(type, name, id, classname) {
        var type, orz = document.getElementById(id);
        var newInput = document.createElement("input");
        newInput.type = type;
        newInput.name = name + "[]";
        newInput.id = name + "[]";
        newInput.className = classname;
        orz.appendChild(newInput);
        var newline = document.createElement("br");
        orz.appendChild(newline);
    }
var eraseGrpTopic = function (topicID, hash) {
    if (confirm('确认删除这个主题？')) {
        location.href = '/erase/group/topic/' + topicID + '?gh=' + hash;
    }
}
var eraseSubjectTopic = function (topicID, hash) {
    if (confirm('确认删除这个主题？')) {
        location.href = '/erase/subject/topic/' + topicID + '?gh=' + hash;
    }
}
var eraseClubTopic = function (topicID, hash) {
    if (confirm('确认删除这个主题？')) {
        location.href = '/erase/club/topic/' + topicID + '?gh=' + hash;
    }
}
var eraseEntry = function (ID, hash) {
    if (confirm('确认删除这篇日志？')) {
        location.href = '/erase/entry/' + ID + '?gh=' + hash;
    }
}
var erasePM = function (pmID, hash) {
    if (confirm('确认删除这条短信？')) {
        location.href = '/pm/erase/' + pmID + '.chii?gh=' + hash;
    }
}
var disconnectFriend = function (frdId, frdNick, hash) {
    if (confirm('确认从朋友列表中去掉 ' + frdNick + '?')) {
        location.href = '/disconnect/' + frdId + '?gh=' + hash;
    }
}
var RakuenFullScreen = function () {
    if (window.top.document.getElementById("main").cols == "40%,*") {
        window.top.document.getElementById("main").cols = "0%,*";
    } else {
        window.top.document.getElementById("main").cols = "40%,*";
    }
}
$(document).ready(function () {
    chiiLib.ukagaka.init();
    collapseReplies();
    $("div.badgeUser").mouseover(function () {
        $('#badgeUserPanel').show();
    });
    $('div.badgeUser').mouseleave(function () {
        $('#badgeUserPanel').hide();
    });
    var currentSign = function (mode) {
        var _Sign = $('#current_sign').attr("value");
        if (_Sign == '' && mode == 'check') {
            return '(编辑个人签名)';
        } else {
            return $('#current_sign').attr("value");
        }
    }
    if ($('#q_update_sign')) {
        $("#q_sign_input").addClass('pointer').html(currentSign('check'));
    }
    $('#q_sign_input').click(function () {
        if ($('#q_sign_input').hasClass('sign') != true) {
            $('#q_sign_input').html('<form id="signfrom" action="/update/user/sign" method="post"><input id="sign_input" name="sign_input" type="text" class="sign_input" value="' + currentSign('input') + '" maxlength="30" /><input class="inputBtn" value="修改" type="submit"> <a href="javascript:void(0)" id="cancelSign" class="l">x</a></form>');
            $(this).removeClass('pointer').addClass('sign');
            $("#sign_input").focus();
            $('#signfrom').submit(function () {
                var new_sign = $('#sign_input').attr('value');
                $.ajax({
                    type: "POST",
                    url: "/update/user/sign?ajax=1",
                    data: ({
                        sign_input: new_sign
                    }),
                    dataType: 'text',
                    success: function (html) {
                        if (new_sign != "") {
                            $("#q_sign_input").addClass('pointer').removeClass('sign').fadeOut(300).fadeIn(100).html(new_sign);
                            $('#current_sign').val(new_sign);
                        } else {
                            $("#q_sign_input").addClass('pointer').removeClass('sign').fadeOut(300).fadeIn(100).html('(编辑个人签名)');
                            $('#current_sign').val('');
                        }
                    },
                    error: function (html) {
                        $("#robot").fadeIn(300);
                        $("#robot_balloon").html(AJAXtip['error']);
                        $("#robot").animate({
                            opacity: 1
                        }, 1000).fadeOut(500);
                    }
                });
                return false;
            });
            $('#cancelSign').mousedown(function () {
                $('#q_sign_input').addClass('pointer').html(currentSign('check'));
                $('#q_sign_input').removeClass('sign');
            });
        }
    });
    if (typeof EpBtn == 'undefined' || EpBtn != 's') {
        $('a.tb_event_club_rlt').click(function () {
            var $rlt_id = $(this).attr('id').split('_')[1],
                $action = $('#ModifyRelatedForm').attr('action_source');
            $('#ModifyRelatedForm').attr('action', $action + $rlt_id);
            $('#modify_place').focus();
            return false;
        });
        $('a.tb_idx_rlt').click(function () {
            var $rlt_id = $(this).attr('id').split('_')[1],
                $order = $(this).attr('order'),
                $content = $(this).parent().parent().find('div.text').text().trim();
            $('#ModifyRelatedForm').attr('action', '/index/related/' + $rlt_id + '/modify');
            $('#modify_order').attr('value', $order);
            $('#modify_content').attr('value', $content);
            return false;
        });
        $('a.erase_idx_rlt').click(function () {
            if (confirm('确认删除该关联条目？')) {
                var tml_id = $(this).attr('id').split('_')[1];
                $("#robot").fadeIn(500);
                $("#robot_speech").hide();
                $("#robot_speech_js").show().html('<img src="/img/loading_s.gif" height="10" width="10" /> 请稍候，正在删除关联条目...');
                $.ajax({
                    type: "GET",
                    url: this + '?ajax=1',
                    success: function (html) {
                        $('#item_' + tml_id).fadeOut(500);
                        $("#robot_speech_js").html('你选择的关联条目经删除咯～');
                        $("#robot").animate({
                            opacity: 1
                        }, 1000).fadeOut(500);
                        setTimeout(function () {
                            $("#robot_speech_js").hide(300);
                            $("#robot_speech").show(300);
                        }, 1500);
                    },
                    error: function (html) {
                        $("#robot_speech_js").html(AJAXtip['error']);
                        $("#robot").animate({
                            opacity: 1
                        }, 1000).fadeOut(500);
                    }
                });
            }
            return false;
        });
        $('a.photo_del').click(function () {
            if (confirm('确认删除这张照片?')) {
                var photo_id = $(this).attr('id').split('_')[2];
                $('#upload_' + photo_id).remove();
            }
            return false;
        });
        eraseRelatedSubject();
    }
    $('#submit_related_subject').click(function () {
        var $add_rs = $('#add_related_subject'),
            $subject_url = $add_rs.attr('value'),
            $relate_list = $('#related_subject_list'),
            $relate_value_list = $('#related_value_list');
        if ($subject_url != '') {
            if (/\/subject\/(\d+)$/.test($subject_url)) {} else if (/^(\d+)$/.test($subject_url)) {}
            var subject_id = RegExp.$1;
            $.ajax({
                type: "GET",
                url: "/json/subject/" + subject_id,
                dataType: 'json',
                success: function (json) {
                    var n = $relate_list.find('li').length;
                    if (json.subject_id != "" && !$('#related_' + json.subject_id).length && n <= 4) {
                        if (json.subject_image != '') {
                            var img = '<img src="/pic/cover/g/' + json.subject_image + '" class="avatar groupImage space ll">';
                        }
                        $relate_list.append('<li id="related_' + json.subject_id + '" class="clearit"><a id="related_del_' + json.subject_id + '" class="related_del" title="删除关联条目" href="javascript:void(0);">删除关联条目</a><a href="/subject/' + json.subject_id + '" title="' + json.subject_name + '" class="avatar ">' + img + '</a><div class="ll"><a href="/subject/' + json.subject_id + '" class="avatar">' + json.subject_name + '</a></div></li>');
                        $relate_value_list.append('<input id="related_value_' + json.subject_id + '" type="hidden" name="related_subject[]" value="' + json.subject_id + '" />');
                        $add_rs.val('');
                        eraseRelatedSubject();
                    }
                },
                error: function (html) {
                    $("#robot").fadeIn(300);
                    $("#robot_balloon").html(AJAXtip['no_subject']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                }
            });
        }
    });
    $('#connectFrd').click(function () {
        $("#robot").fadeIn(500);
        $("#robot_balloon").html(AJAXtip['wait'] + AJAXtip['addingFrd']);
        $.ajax({
            type: "GET",
            url: this + '&ajax=1',
            success: function (html) {
                $('#connectFrd').hide();
                $('#friend_flag').html('<small class="fade">/ 是我的好友</small>');
                $("#robot_balloon").html(AJAXtip['addFrd']);
                $("#robot").animate({
                    opacity: 1
                }, 1000).fadeOut(500);
            },
            error: function (html) {
                $("#robot_balloon").html(AJAXtip['error']);
                $("#robot").animate({
                    opacity: 1
                }, 1000).fadeOut(500);
            }
        });
        return false;
    });
    $('a.manageDoujinCollect').click(function (e) {
        chiiLib.doujinCollect.manage(this);
        return false;
    });
    $('#ReplyFormEp').submit(function () {
        var ep_id = $(this).attr('name').split('_')[0];
        alert(ep_id);
        return false;
    });
    $('#browserTypeSelector a').click(function () {
        var selector = $(this).attr('id'),
            $browserList = $('#browserItemList'),
            $item = $browserList.find('img.cover');
        $('#list_selector').removeClass();
        $('#full_selector').removeClass();
        $('#grid_selector').removeClass();
        $(this).addClass('active');
        $browserList.removeClass();
        if (selector == 'list_selector') {
            $.cookie('list_display_mode', 'list');
            $browserList.addClass('browserList');
            $item.each(function () {
                _src = $(this).attr('src').replace(/cover\/([a-z]+)\//g, 'cover/g/');
                $(this).attr('src', _src);
            });
        } else if (selector == 'full_selector') {
            $.cookie('list_display_mode', 'full');
            $browserList.addClass('browserFull');
            $item.each(function () {
                _src = $(this).attr('src').replace(/cover\/([a-z]+)\//g, 'cover/s/');
                $(this).attr('src', _src);
            });
        } else {
            $.cookie('list_display_mode', 'grid');
            $browserList.addClass('browserGrid clearit');
            $item.each(function () {
                _src = $(this).attr('src').replace(/cover\/([a-z]+)\//g, 'cover/m/');
                $(this).attr('src', _src);
            });
        }
    });
    $('#selectall').click(function () {
        var checked = $("#selectall").attr("checked");
        $(".selectable").each(function () {
            var subchecked = $(this).attr("checked");
            if (subchecked != checked) $(this).click();
        });
    });
    $('a.erase_post').click(function () {
        if (confirm(AJAXtip['eraseReplyConfirm'])) {
            var post_id = $(this).attr('id').split('_')[1];
            $("#robot").fadeIn(500);
            $("#robot_balloon").html(AJAXtip['wait'] + AJAXtip['eraseingReply']);
            $.ajax({
                type: "GET",
                url: (this) + '&ajax=1',
                success: function (html) {
                    $('#post_' + post_id).fadeOut(500);
                    $("#robot_balloon").html(AJAXtip['eraseReply']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                },
                error: function (html) {
                    $("#robot_balloon").html(AJAXtip['error']);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(500);
                }
            });
        }
        return false;
    });
    chiiLib.ajax_reply.mainReply();
});

function eraseRelatedSubject() {
    $('a.related_del').click(function () {
        if (confirm('确认解除关联?')) {
            var related_id = $(this).attr('id').split('_')[2];
            $('#related_' + related_id).remove();
            $('#related_value_' + related_id).remove();
        }
        return false;
    });
}
var checkTsukkomiInput = function (doing, status) {
    obj1 = getObj(doing);
    remain = 123 - obj1.value.length;
    obj2 = getObj(status);
    if (obj1.value.length <= 122) {
        obj2.innerHTML = '<small class="grey">还可以输入' + remain + ' 字</small>';
    } else {
        remain2 = obj1.value.length - 123;
        obj2.innerHTML = '<small class="na">还可以输入0 字</small>';
        obj1.value = obj1.value.substring(0, 123);
    }
}

    function switchRobotSpeech() {
        if ($('#robot_speech').is(':hidden')) {
            $("#robot_speech_js").hide();
            $("#robot_speech").slideDown();
        } else {
            $("#robot_speech").hide();
            $("#robot_speech_js").slideDown();
        }
    }

    function addTag(tag) {
        $("#tags").val($("#tags").val() + " " + tag + " ");
        checkTag();
    }

    function checkTag() {
        input_tag = "";
        cur_tags = new Array();
        tags = $.trim($("#tags").val()).split(" ");
        for (i = 0; i < tags.length; i++) {
            if ($.trim(tags[i]) != "") {
                if ($.inArray(tags[i], cur_tags) == -1) {
                    cur_tags[i] = tags[i];
                    input_tag = input_tag + " " + tags[i];
                }
            }
        }
        $("#tags").val(input_tag + " ");
    }
$(document).ready(function () {
    $("#tags").keyup(function (event) {
        if (event.keyCode == 32) {
            checkTag();
        }
    });
});
var _tipPrev = new Object();
$(document).ready(function () {
    if ($.browser.msie) {
        $('#columnHomeA,#subject_detail').mousemove(function (e) {
            if (e.target.tagName != 'A') {
                return false;
            }
            if (_tipPrev == e.target) {
                return false;
            }
            _tipPrev = e.target;
            $(e.target).cluetip({
                local: true,
                dropShadow: false,
                cursor: 'pointer',
                sticky: true,
                closePosition: 'title',
                arrows: true,
                closeText: 'X',
                mouseOutClose: true,
                positionBy: 'fixed',
                cluezIndex: 79,
                topOffset: 25,
                leftOffset: 0,
                onShow: function (ct, c) {
                    $('#cluetip-inner a.ep_status').bind('click', function (e) {
                        chiiLib.home.epStatusClick(e.target);
                        return false;
                    });
                }
            }).trigger('mouseover');
            return false;
        });
    } else {
        $('#columnHomeA a.load-epinfo,#subject_detail a.load-epinfo').cluetip({
            local: true,
            dropShadow: false,
            cursor: 'pointer',
            sticky: true,
            closePosition: 'title',
            arrows: true,
            closeText: 'X',
            mouseOutClose: true,
            positionBy: 'fixed',
            topOffset: 25,
            leftOffset: 0,
            cluezIndex: 79
        });
        $('#subject_prg_content a.ep_status').click(function () {
            chiiLib.home.epStatusClick(this);
            return false;
        });
    }
});
var nowmode = "wcode";
var head;
var infoboxVal = new Object();
var infoboxid;

function WikiTpl(value) {
    if (arguments.length == 2) {
        _infoboxid = arguments[1];
    } else {
        _infoboxid = 'subject_infobox';
    }
    infoboxid = '#' + _infoboxid;
    var tpl = {
        TVAnime: "{{Infobox animanga/TVAnime\n|中文名= \n|别名= {\n\n}\n|话数= * \n|放送开始= * \n|放送星期=\n|官方网站=\n|播放电视台=\n|其他电视台= \n|播放结束= \n|其他= \n|Copyright=\n}}",
        OVA: "{{Infobox animanga/OVA\n|中文名= \n|别名= {\n\n}\n|话数= * \n|发售日= * \n|官方网站=\n|开始= \n|结束= \n|其他= \n}}",
        Movie: "{{Infobox animanga/Movie\n|中文名= \n|别名= {\n\n}\n|上映年度= * \n|片长= \n|官方网站=\n|其他= \n|Copyright= \n}}",
        Book: "{{Infobox animanga/Book\n|中文名= \n|别名= {\n\n}\n|出版社= *\n|价格=\n|其他出版社= \n|连载杂志= \n|发售日= \n|页数=\n|ISBN= \n|其他= \n}}",
        Manga: "{{Infobox animanga/Manga\n|中文名= \n|别名= {\n\n}\n|出版社= *\n|价格=\n|其他出版社= \n|连载杂志= \n|发售日= \n|册数= \n|页数=\n|话数= \n|ISBN= \n|其他= \n}}",
        Novel: "{{Infobox animanga/Novel\n|中文名= \n|别名= {\n\n}\n|出版社= * \n|价格=\n|连载杂志= \n|发售日= \n|册数= \n|页数=\n|话数= \n|ISBN= \n|其他= \n}}",
        BookSeries: "{{Infobox animanga/BookSeries\n|中文名= \n|别名= {\n\n}\n|出版社= * \n|连载杂志= \n|开始= \n|结束= \n|册数= \n |话数= \n|其他= \n}}",
        Album: "{{Infobox Album\n|中文名=\n|别名= {\n\n}\n|版本特性= \n|发售日期= \n|价格= \n|播放时长= \n|录音= \n|碟片数量= \n}}",
        Game: "{{Infobox Game\n|中文名=\n|别名= {\n\n}\n|平台= {\n\n}\n|游戏类型=\n|游戏引擎=\n|游玩人数=\n|发行日期=\n|售价=\n|website=\n}}",
        TV: "{{Infobox real/Television\n|中文名=\n|别名= {\n\n}\n|集数=\n|放送星期=\n|开始=\n|结束=\n|类型=\n|国家/地区=\n|语言=\n|每集长=\n|频道=\n|电视网=\n|电视台=\n|视频制式=\n|音频制式=\n|首播国家=\n|首播地区=\n|台湾名称=\n|港澳名称=\n|马新名称=\n|官方网站=\n|imdb_id=\n|tv_com_id=\n}} ",
        Crt: "{{Infobox Crt\n|简体中文名=\n|别名={\n[第二中文名|]\n[英文名|]\n[日文名|]\n[纯假名|]\n[罗马字|]\n[昵称|]\n}\n|性别=\n|生日=\n|血型=\n|身高=\n|体重=\n|BWH=\n|引用来源={\n}\n}}",
        doujinBook: "{{Infobox doujin/Book\n|作者={\n\n}\n|原作=\n|CP=\n|语言=\n|页数=\n|尺寸=\n|价格=\n|发售日=\n}}",
        doujinMusic: "{{Infobox doujin/Album\n|艺术家={\n\n}\n|原作=\n|语言=\n|版本特性=\n|碟片数量=\n|播放时长=\n|价格=\n|发售日=\n}}",
        doujinGame: "{{Infobox doujin/Game\n|别名= {\n\n}\n|开发者={\n\n}\n|原作=\n|平台=\n|游戏类型=\n|游戏引擎=\n|游玩人数=\n|语言=\n|价格=\n|发售日=\n}}"
    }
    NormaltoWCODE();
    var preInfoboxVal = WCODEParse($(infoboxid).val());
    for (var i in preInfoboxVal) {
        infoboxVal[i] = preInfoboxVal[i];
    }
    var newInfobox = WCODEParse(tpl[value]);
    var finalInfobox = newInfobox;
    for (var i in newInfobox) {
        if (infoboxVal[i] != undefined) {
            if ((typeof infoboxVal[i]) == 'object') {
                if (typeof finalInfobox[i] != 'object') {
                    finalInfobox[i] = new Object();
                }
                for (var j in newInfobox[i]) {
                    finalInfobox[i][j] = newInfobox[i][j];
                }
                for (var j in infoboxVal[i]) {
                    finalInfobox[i][j] = infoboxVal[i][j];
                }
            } else {
                finalInfobox[i] = infoboxVal[i];
            }
        }
    }
    for (var i in infoboxVal) {
        if (infoboxVal[i] != undefined) {
            if ((typeof infoboxVal[i]) == 'object') {
                if (typeof finalInfobox[i] != 'object') {
                    finalInfobox[i] = new Object();
                }
                for (var j in infoboxVal[i]) {
                    finalInfobox[i][j] = infoboxVal[i][j];
                }
            } else {
                infoboxVal[i] = $.trim(infoboxVal[i]);
                if (infoboxVal[i] != '' && infoboxVal[i] != '*') {
                    finalInfobox[i] = infoboxVal[i];
                }
            }
        }
    }
    finalInfobox = WCODEDump(finalInfobox);
    $(infoboxid).val(finalInfobox);
    $(infoboxid).css('height:150px');
    if ((typeof wikiDisableNormalMode == 'undefined') || wikiDisableNormalMode == false) {
        WCODEtoNormal();
    }
    multiKeyRegDel();
    stopEnterSubmit();
}

function WCODEParse(input) {
    array = new Array();
    foo = input.split("\n");
    head = "";
    for (i = 0; i < foo.length; i++) {
        line = foo[i];
        if (line.substr(0, 1) === "{") {
            head = head + line + "\n";
        } else if (line.indexOf("=") != -1) {
            key = $.trim((line.substr(1, line.indexOf("=") - 1)));
            line = $.trim(line);
            value = null;
            if (/=\s*{$/.test(line)) {
                i++;
                line = foo[i];
                line = $.trim(line);
                value = new Object();
                var subKey = 0;
                var valArr = new Array();
                while (i < foo.length && !/^}$/.test(line) && !/^\|/.test(line)) {
                    if (/^\[(.+)\]$/.test(line)) {
                        var subVal = RegExp.$1;
                        if (/^([^|]+)[|](.*)$/i.test(subVal)) {
                            value[RegExp.$1] = RegExp.$2.replace(/\\\|/g, '|');
                        } else {
                            value[subKey] = subVal.replace(/\\\|/g, '|');
                            subKey++;
                        }
                    }
                    i++;
                    line = foo[i];
                    line = $.trim(line);
                }
                line = $.trim(line);
            } else {
                value = $.trim((line.substr(line.indexOf("=") + 1)));
            }
            array[key] = value;
        }
    }
    return array;
}

function WCODEDump(array) {
    string = "";
    string = string + head;
    for (id in array) {
        value = array[id];
        if ((id !== 0) && ($.trim(id) !== "")) {
            if ((typeof value) == 'object') {
                string += "|" + id + "={\n";
                for (var eKey in value) {
                    if (!isNaN(eKey) && $.trim(value[eKey]) == '') {
                        continue;
                    }
                    if (isNaN(eKey)) {
                        string += "[" + $.trim(eKey) + '|' + value[eKey].replace(/\|/g, '\\|') + "]\n";
                    } else {
                        string += "[" + value[eKey].replace(/\|/g, '\\|') + "]\n";
                    }
                }
                string += "}\n";
            } else if ((value.indexOf("\n") == -1) || (value.indexOf("=") == -1) || (value.indexOf("-") == -1)) {
                string = string + "|" + id + "= " + value + "\n";
            }
        }
    }
    string = string + "}}";
    return string;
}

function WCODEtoNormal() {
    if (nowmode == "wcode") {
        $(infoboxid).hide();
        $("#infobox_normal").html("");
        wcode = $(infoboxid).val();
        info = WCODEParse(wcode);
        for (id in info) {
            if ((typeof info[id]) == 'object') {
                var multiInfo = '<p><input class="inputtext id multiKey" tabindex="1024" value="' + id + '" /><input class="inputtext prop multiVal" readonly="true" onclick="addSubProp(this);" value="点此增加输入框:" /><input type="button" tabindex="-1" class="multiKeyAdd" onclick="addSubProp(this);" /><br clear="all" /></p>';
                for (var eKey in info[id]) {
                    if (isNaN(eKey)) {
                        var subkey = eKey.replace(/"/g, '&quot;');
                    } else {
                        var subkey = '';
                    }
                    multiInfo += '<input class="inputtext id multiSubKey"  tabindex="1024" value="' + subkey + '" /><input class="inputtext prop multiSubVal" value="' + info[id][eKey].replace(/"/g, '&quot;') + '" /><input type="button"  tabindex="-1" class="multiKeyDel" /><br clear="all" />';
                }
                $("#infobox_normal").append(multiInfo);
            } else {
                $("#infobox_normal").append('<input class="inputtext id" style="background:#eee;" tabindex="1024" value="' + id + '" /><input class="inputtext prop" value="' + info[id].replace(/"/g, '&quot;') + '" /><br clear="all" />');
            }
        }
        $("#infobox_normal").append('<input class="inputtext id" value="" onfocus="addoneprop();" /><input class="inputtext prop" value="" onfocus="addoneprop();" /><br clear="all" />');
        nowmode = "normal";
        $("#infobox_normal").show();
    }
}

function NormaltoWCODE() {
    if (nowmode == "normal") {
        $("#infobox_normal").hide();
        nowmode = "normal";
        info = new Array();
        ids = new Object();
        props = new Object();
        input_num = $("#infobox_normal input.id").length;
        ids = $("#infobox_normal input.id");
        props = $("#infobox_normal input.prop");
        for (i = 0; i < input_num; i++) {
            id = $(ids).get(i);
            prop = $(props).get(i);
            if ($(id).hasClass('multiKey')) {
                multiKey = $(id).val();
                info[multiKey] = new Object();
                var subKey = 0;
                i++;
                id = $(ids).get(i);
                prop = $(props).get(i);
                while (($(id).hasClass('multiSubKey') || $(prop).hasClass('multiSubVal')) && i < input_num) {
                    if (isNaN($(id).val())) {
                        info[multiKey][$(id).val()] = $(prop).val();
                    } else {
                        info[multiKey][subKey] = $(prop).val();
                        subKey++;
                    }
                    i++;
                    id = $(ids).get(i);
                    prop = $(props).get(i);
                }
                i--;
            } else if ($.trim($(id).val()) != "") {
                info[$(id).val()] = $(prop).val();
            }
        }
        wcode = WCODEDump(info);
        $(infoboxid).val(wcode);
        nowmode = "wcode";
        $(infoboxid).show();
    }
}

function addSubProp(obj) {
    $(obj).parent().after('<input class="inputtext id multiSubKey"  tabindex="1024" value="" /><input class="inputtext prop multiSubVal" value="" /><input type="button"  tabindex="-1" class="multiKeyDel" /><br clear="all" />');
    $("#infobox_normal > input.multiKeyDel").unbind('click');
    stopEnterSubmit();
    multiKeyRegDel();
}

function stopEnterSubmit() {
    var inputList = $("#infobox_normal > input");
    inputList.unbind('keydown');
    inputList.keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
}

function multiKeyRegDel() {
    var delButtons = $("#infobox_normal > input.multiKeyDel");
    delButtons.unbind('click');
    delButtons.click(function () {
        var inputList = $("#infobox_normal > *");
        var index = inputList.index(this);
        inputList.slice(index - 2, index + 2).remove();
        return;
    });
    return;
}

function addoneprop() {
    $("#infobox_normal > input").removeAttr("onfocus");
    $("#infobox_normal").append('<input class="inputtext id" value="" onfocus="addoneprop();" /><input class="inputtext prop" value="" onfocus="addoneprop();" /><br clear="all" />');
    stopEnterSubmit();
}
sfHover = function () {
    var sfEl = document.getElementById("nav_menu");
    if (sfEl) {
        var sfEls = document.getElementById("nav_menu").getElementsByTagName("LI");
        for (var i = 0; i < sfEls.length; i++) {
            sfEls[i].onmouseover = function () {
                this.className += " sfhover";
            }
            sfEls[i].onmouseout = function () {
                this.className = this.className.replace(new RegExp(" sfhover\\b"), "");
            }
        }
    }
}
if (window.attachEvent) window.attachEvent("onload", sfHover);
$(document).ready(function () {
    var ul = $("#airTimeMenu > li.airYear");
    if (ul.html() == null) {
        return;
    }
    var anchors = ul.find("a");
    var increased = 0;
    var tmoutMoveHandle;
    var tmoutOutHandle;
    var yearTestRegex = /(\d{4})$/;
    closeFuture();

    function tmoutEventMove(target) {
        return setTimeout(function () {
            var self = $(target);
            if (self.children().is('ul')) {
                return false;
            }
            $('#airMonthMenuPrev').remove();
            var prevUl = $('#airMonthMenu');
            prevUl.attr('id', 'airMonthMenuPrev');
            var ul = $("<ul>").attr('id', 'airMonthMenu');
            var baseUrl = self.find('a').attr('href');
            for (var i = 1; i < 13; i++) {
                ul.append($("<li>").append($("<a>").text(i + '月').attr('href', baseUrl + '-' + i)));
            }
            ul.css('top', self.position().top);
            ul.hide();
            self.append(ul);
            self.find('> a').addClass('focus')
            ul.fadeIn('slow');
            prevUl.parent().find('> a').removeClass('focus');
            prevUl.fadeOut('fast', function () {
                $(this).remove();
            });
        }, 5);
    }

    function tmoutEventOut() {
        return setTimeout(function () {
            $('#airMonthMenu').fadeOut('fast', function () {
                $(this).parent().find('> a').css('color', '#444');
                $(this).remove();
            }, 'fast');
        }, 10);
    }

    function closeFuture() {
        var url = anchors[0].href;
        var date = new Date();
        yearTestRegex.test(url);
        if (RegExp.$1 >= date.getFullYear()) {
            $("#futureAirTime").css('visibility', 'hidden');
        } else {
            increased = -parseInt((date.getFullYear() - RegExp.$1) / ul.length);
        }
    }
    ul.mouseout(function (event) {
        clearTimeout(tmoutMoveHandle);
        clearTimeout(tmoutOutHandle);
        tmoutOutHandle = tmoutEventOut();
        return false;
    });
    ul.mousemove(function (event) {
        clearTimeout(tmoutOutHandle);
        clearTimeout(tmoutMoveHandle);
        tmoutMoveHandle = tmoutEventMove(this);
        return false;
    });
    $("#pastAirTime").click(function (event) {
        updateYearAnchors('-');
        return false;
    });
    $("#futureAirTime").click(function (event) {
        updateYearAnchors('+');
        return false;
    });

    function updateYearAnchors(sign) {
        var url = '';
        var newYear = 0;
        var year = 0;
        sign == '+' ? increased++ : increased--;
        date = new Date();
        if (increased < 0) {
            $("#futureAirTime").css('visibility', 'visible');
        } else if (increased == 0) {
            $("#futureAirTime").css('visibility', 'hidden');
        }
        anchRoll = function (num) {
            increment = parseInt(sign + 1);
            for (var i = 0; i < ul.length; i++) {
                url = anchors[i].href;
                yearTestRegex.test(url);
                year = RegExp.$1;
                newYear = eval(parseInt(year) + increment);
                url = url.replace(/\d{4}$/, eval(newYear));
                anchors[i].href = url;
                anchors[i].innerHTML = anchors[i].innerHTML.replace(/^\d{4}/, newYear);
            }
            if (--num == 0) {
                return;
            } else {
                setTimeout('anchRoll( ' + num + ');', 40);
            }
        }
        anchRoll(ul.length);
    }
});
$(document).ready(function () {
    var list = $('#groupJoinAction').find('a[href$=bye],a[href$=join]');
    $(list).click(function () {
        submitPost(this.href, 'action', 'join-bye');
        return false;
    });
});
$(document).ready(function () {
    var grpCatList = $('#grpCatList > li');
    if (grpCatList.html() == null) {
        return false;
    }
    var tmoutMoveHandle;
    var tmoutOutHandle;

    function tmoutEventOutGc(target) {
        return setTimeout(function () {
            var subCat = $(target).find("> ul");
            grpCatList.find('> ul').each(function () {
                $(this).hide()
            });
        }, 618);
    }

    function tmoutEventMoveGc(target) {
        return setTimeout(function () {
            var parent = $(target);
            var subCat = parent.find("> ul");
            subCat = $(subCat);
            grpCatList.find('> ul').each(function () {
                $(this).hide()
            });
            subCat.show();
            subCat.css('top', parent.position().top - 10);
            subCat.css('left', parent.position().left + parent.find("> a").width() + 3);
        }, 25);
    }
    grpCatList.mouseout(function (event) {
        clearTimeout(tmoutMoveHandle);
        clearTimeout(tmoutOutHandle);
        tmoutOutHandle = tmoutEventOutGc(this);
        return false;
    });
    grpCatList.mousemove(function (event) {
        clearTimeout(tmoutOutHandle);
        clearTimeout(tmoutMoveHandle);
        tmoutMoveHandle = tmoutEventMoveGc(this);
        return false;
    });
});
var fetchInPageSubjectID = function () {
    _subject_id_list = '';
    $("#browserItemList li.item").each(function () {
        var $item_id = $(this).attr('id').split('_')[1];
        _subject_id_list = _subject_id_list + $item_id + ',';
    });
    alert(_subject_id_list);
}
var subReplycancel = function () {
    $('div.subreply_textarea').remove();
}
var subReply = function (type, topic_id, post_id, sub_reply_id, sub_reply_uid, post_uid, sub_post_type) {
    chiiLib.ajax_reply.subReply(type, topic_id, post_id, sub_reply_id, sub_reply_uid, post_uid, sub_post_type);
}