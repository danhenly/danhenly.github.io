var mbna = {};
var mbnaSeccode = function(e, t, a) {
    this.seccode = e;
    this.boxNum = t;
    this.pageNum = a
};
var cfg = {
    numOfBnaBox: 6,
    StartPostingHour: 9,
    StartPostingMinute: 0,
    EndPostingMinute: 30,
    RefreshMilliSecconds: 5e3,
    MarketCloseHour: 15,
    MarketCloseMinutes: 30,
    DuplicateSeccodeErrorMessage: "Stock code already exists on this page."
};
$(document).ready(function() {
    qSecdata.qSubmenu = landingSubmenu == "" ? "si" : landingSubmenu;
    qSecdata.qPage = landingPage;
    qSecdata.onPageLand();
    $(".qsmLink").click(function() {
        var e = $(this);
        var t = e.attr("id");
        var a = t.replace("qsm", "").toLowerCase();
        var i = a + "Indicator";
        var s = $("#" + i).attr("data-active");
        if (s == "false") {
            var l = $("#secCode").val();
            qSecdata.qSubmenu = a;
            qSecdata.seccode = l;
            qSecdata.changeSubMenuLink(i)
        }
    });
    $(".qSubmenuLink").click(function() {
        var e = qSecdata.qSubmenu;
        var t = $(this);
        var a = t.attr("id");
        var i = $("." + e + "ActiveLink").attr("id");
        var s = a.replace(e + "l", "").toLowerCase();
        var l = t.attr("data-active");
        if (l == "false") {
            var n = $("#secCode").val();
            $("#" + i).removeClass("boldText colorBlack " + e + "ActiveLink");
            $("#" + a).addClass("boldText colorBlack " + e + "ActiveLink");
            $("#" + i).attr("data-active", "false");
            $("#" + a).attr("data-active", "true");
            qSecdata.qPage = s;
            qSecdata.seccode = n;
            qSecdata.changeContainer()
        }
    });
    $(".siBNALvlMenu").click(function() {
        var e = "siBNALvlMenu";
        var t = $(this);
        var a = t.attr("id");
        var i = t.attr("data-level");
        var s = t.attr("data-active");
        if (s == "false") {
            var l = qSecdata.siBNALevelOld;
            var n = $("." + e + "ActiveLink").attr("id");
            var o = $("#secCode").val();
            $("#" + n).removeClass("boldText colorBlack " + e + "ActiveLink");
            $("#" + a).addClass("boldText colorBlack " + e + "ActiveLink");
            $("#" + n).attr("data-active", "false");
            $("#" + a).attr("data-active", "true");
            if (l != i) {
                qSecdata.siBNALevel = i;
                qSecdata.changeSIBnALevel()
            }
        }
    });
    $("#btnGoSI").click(function() {
        var e = $(this),
            t = $("#secCode").val().toUpperCase(),
            a = qSecdata.seccode.toUpperCase();
        if (t != a) {
            qSecdata.seccode = t;
            qSecdata.newStockCodeDataReq()
        }
    });
    $("#secCode").keypress(function(e) {
        if (e.keyCode == 13) {
            var t = $(this),
                a = t.val().toUpperCase(),
                i = qSecdata.seccode.toUpperCase();
            if (a != i) {
                qSecdata.seccode = a;
                qSecdata.newStockCodeDataReq()
            }
        }
    });
    $("#secCode").click(function() {
        var e = $(this);
        e.select()
    });
    $("#btnGoBI").click(function() {
        var e = $(this),
            t = $("#bcodeID").val().toUpperCase();
        oBCode = qSecdata.bcode.toUpperCase();
        if (t != oBCode) {
            qSecdata.bcode = t;
            qSecdata.newStockCodeDataReq()
        }
    });
    $("#bcodeID").keypress(function(e) {
        if (e.keyCode == 13) {
            var t = $(this),
                a = t.val().toUpperCase(),
                i = qSecdata.bcode.toUpperCase();
            if (a != i) {
                qSecdata.bcode = a;
                qSecdata.newStockCodeDataReq()
            }
        }
    });
    $("#bcodeID").click(function() {
        var e = $(this);
        e.select()
    });
    $("#lnkSIDbuy").click(function() {
        seccode = qSecdata.seccode;
        location.href = "/trading/default.asp?seccode=" + seccode + "&side=B"
    });
    $("#lnkSIDsell").click(function() {
        seccode = qSecdata.seccode;
        location.href = "/trading/default.asp?seccode=" + seccode + "&side=S"
    });
    $("#lnkRefresh").click(function() {
        qSecdata.displayUpdatedTime();
        qSecdata.refreshPage()
    });
    $(".tnsNav").click(function() {
        var e = $(this).attr("id").toLowerCase();
        qSecdata.tnsNavigatepage(e)
    });
    $(".lnkBoard").click(function() {
        if (!$(this).hasClass("boardLotLinkActive")) {
            var e = $(this).attr("id");
            var t = e.replace("lnk", "");
            var a = "selector" + t;
            qSecdata.isOddlot = t.toLowerCase() == "oddlot" ? true : false;
            qSecdata.switchBoardLot()
        }
    });
    $(".irPseiLink").click(function() {
        var e = $.trim($(this).attr("data-status")),
            t = "",
            a = "";
        switch (e.toLowerCase()) {
            case "adv":
                t = "ms";
                a = "tg";
                break;
            case "dec":
                t = "ms";
                a = "wl";
                break
        }
        qSecdata.qSubmenu = t;
        qSecdata.seccode = a;
        qSecdata.changeSubMenuLink(t + "Indicator", a)
    });
    $("select#predefined").change(function() {
        if (this.value == "%") {
            $("select#custom").val("W");
            qSecdata.mqPrevDisplayoption = "W";
            qSecdata.mqDisplayoption = "custom"
        } else {
            qSecdata.mqDisplayoption = "predefined";
            qSecdata.mqPrevDisplayoption = this.value
        }
        qSecdata.changeContainer()
    });
    $("select#custom").change(function() {
        if (this.value == "%") {
            $("#DataContainer").empty();
            qSecdata.mqPrevDisplayoption = ""
        } else {
            qSecdata.mqPrevDisplayoption = this.value;
            qSecdata.mqDisplayoption = "custom";
            qSecdata.changeContainer()
        }
    });
    $("#lnkEditWatchlist a").click(function(e) {
        $("select#custom").val("W");
        qSecdata.mqPrevDisplayoption = "W";
        qSecdata.mqDisplayoption = "custom";
        qSecdata.changeContainer()
    });
    $(".bna").each(function() {
        var e = $(this);
        var t = e.attr("data-mba");
        var a = e.val();
        var i = t.slice(-1);
        mbna[t] = new mbnaSeccode(a, i, "1")
    });
    $("#Page1").removeClass("PageSelectorNormal").addClass("page1Active active").empty();
    $(".btnGo").click(function() {
        poller.getMarketStatus();
        var e = $(this);
        btnDataName = e.attr("data-btn");
        boxID = e.attr("data-btn").slice(-1);
        nSeccode = $("#box" + boxID).val().toUpperCase();
        oSeccode = mbna[btnDataName].seccode.toUpperCase();
        doExists = false;
        doExists = poller.isSeccodeExisting(nSeccode);
        if (nSeccode != oSeccode) {
            if (!doExists) {
                mbna[btnDataName].seccode = nSeccode;
                $("#box" + boxID).val(nSeccode);
                poller.LoadSingleBidAsk(mbna[btnDataName])
            } else {
                $("#box" + boxID).val(oSeccode);
                alert("Stock code already exists on this page.")
            }
        }
        poller.selectInputBoxSeccode("box" + boxID)
    });
    $(".bna").keypress(function(e) {
        if (e.keyCode == 13) {
            var t = $(this);
            btnDataName = t.attr("data-mba");
            boxID = t.attr("id");
            nSeccode = $("#" + boxID).val().toUpperCase();
            oSeccode = mbna[btnDataName].seccode.toUpperCase();
            doExists = false;
            doExists = poller.isSeccodeExisting(nSeccode);
            if (nSeccode != oSeccode) {
                if (!doExists) {
                    mbna[btnDataName].seccode = nSeccode;
                    $("#" + boxID).val(nSeccode);
                    poller.LoadSingleBidAsk(mbna[btnDataName])
                } else {
                    $("#" + boxID).val(oSeccode);
                    alert("Stock code already exists on this page.")
                }
            }
            poller.selectInputBoxSeccode(boxID)
        }
    });
    $(".selector").click(function() {
        curActiveClassNum = $("#pageNum").val();
        curActiveClass = "Page" + curActiveClassNum;
        selClass = $(this).attr("id");
        selClassNum = selClass.slice(-1);
        if (curActiveClassNum != selClassNum) {
            clearTimeout(poller.timeo);
            poller.setSelectorPage(curActiveClassNum, selClassNum);
            poller.populateBox(selClassNum)
        }
    });
    $(".btnsi").click(function() {
        selID = $(this).attr("id");
        selIDNum = selID.slice(-1);
        seccode = $("#box" + selIDNum).val();
        qSecdata.goToDynamicBNA(seccode)
    });
    $(".btnbuy").click(function() {
        selID = $(this).attr("id");
        selIDNum = selID.slice(-1);
        seccode = $("#box" + selIDNum).val();
        location.href = "../../trading/default.asp?seccode=" + seccode + "&side=B"
    });
    $(".btnsell").click(function() {
        selID = $(this).attr("id");
        selIDNum = selID.slice(-1);
        seccode = $("#box" + selIDNum).val();
        location.href = "../../trading/default.asp?seccode=" + seccode + "&side=S"
    });
    $("#lnkWatchList").click(function() {
        var e = $.trim($(this).val());
        if (qSecdata.qSubmenu != "si") {
            qSecdata.goToDynamicBNA(e)
        } else {
            var t = e,
                a = qSecdata.seccode.toUpperCase();
            if (t != a) {
                qSecdata.seccode = t;
                qSecdata.newStockCodeDataReq()
            }
        }
    });
    $("#lnkRedirectToSubmenu").click(function() {
        var e = $(this).attr("data-submenu"),
            t = $(this).attr("data-subitem"),
            e = e.toLowerCase() + "Indicator",
            t = t.toLowerCase();
        qSecdata.changeSubMenuLink(e, t)
    });
    $("#ExportLink").click(function() {
        e(qSecdata.qPage)
    });

    function e(e) {
        window.open("/quotes/" + e + "ExportToExcel.asp", "ExportToExcel", "left = 100, top = 100,toolbar=no,location=0,status=no, menubar=no,scrollbars=no,resizable=no,width=1,height=1, visible=none");
        window.close()
    }
});
var qSecdata = {
    qSubmenu: "si",
    qPage: "bna",
    rTimeOut: 0,
    fmetfTimeOut: 0,
    dataLink: "",
    secname: "",
    seccode: $("#secCode").val(),
    oldseccode: "",
    bname: "",
    bcode: "",
    oldbcode: "",
    tnsPage: 1,
    tnsMaxPage: 0,
    isCNContent: false,
    cnStoryID: "",
    isOddlot: false,
    interval: 0,
    defaultInterval: 3e3,
    haltInterval: 15e3,
    openInterval: 3e3,
    mktStatReq: null,
    dataReq: null,
    saveReq: null,
    fmetfReq: null,
    watchlistReq: null,
    marketOpen: false,
    isFirstRun: true,
    backToDefaultBNA: 0,
    arrBNAEntryID: [],
    mqDisplayoption: "custom",
    mqPrevDisplayoption: "",
    siBNALevel: 5,
    siBNALevelOld: 5,
    init: function() {
        var e = this;
        $.proxy(e.populateData(), e)
    },
    populateData: function() {
        var e = this,
            t = e.qSubmenu;
        switch (t) {
            case "mq":
                e.populateDataMQ();
                break;
            case "bi":
                e.populateDataBI();
                break;
            case "ms":
                e.populateDataMS();
                break;
            case "mi":
                e.populateDataMI();
                break;
            case "si":
            default:
                e.populateDataSI();
                break
        }
    },
    populateDataMQ: function() {
        var e = this,
            t = this.qPage;
        if (t == "") {
            e.qPage = "mb";
            e.activateSubLink()
        } else {
            switch (t) {
                case "ba":
                    $("#MQ-GraySearchBar").css("display", "block");
                    var a = "";
                    var i = $("select#custom").find("option:selected").val();
                    if (e.mqDisplayoption == "custom") {
                        a = i == "W" ? "quotes/includes/mqWatchList.asp" : "main/includes/mqStockPositionCodeList.asp";
                        $("select#predefined").val("%");
                        e.processCustomDropdown(a, "qba")
                    } else if (e.mqDisplayoption == "predefined") {
                        $("select#custom").val("%");
                        a = e.getInternetExplorerVersion() > -1 ? "quotes/IEVersion/qbaIdx.asp" : "mb/qbaIdx.asp";
                        e.changeLink(a, true, "&idxCode=" + $("select#predefined").find("option:selected").val());
                        e.getDataMQ()
                    }
                    break;
                case "hll":
                    $("#MQ-GraySearchBar").css("display", "block");
                    var a = "";
                    var i = $("select#custom").find("option:selected").val();
                    if (e.mqDisplayoption == "custom") {
                        $("select#predefined").val("%");
                        a = i == "W" ? "quotes/includes/mqWatchList.asp" : "main/includes/mqStockPositionCodeList.asp";
                        e.processCustomDropdown(a, "qhll")
                    } else if (e.mqDisplayoption == "predefined") {
                        $("select#custom").val("%");
                        a = e.getInternetExplorerVersion() > -1 ? "quotes/IEVersion/qhllIdx2.asp" : "mb/qhllIdx2.asp";
                        e.changeLink(a, true, "&idxCode=" + $("select#predefined").find("option:selected").val());
                        e.getDataMQ()
                    }
                    break;
                case "mb":
                default:
                    $("#MQ-GraySearchBar").css("display", "none");
                    poller.populateBox(1);
                    break
            }
        }
    },
    populateDataSI: function() {
        var e = this,
            t = this.qPage;
        if (t == "") {
            e.qPage = "bna";
            e.activateSubLink()
        } else {
            switch (t) {
                case "tns":
                    if (e.getInternetExplorerVersion() > -1) {
                        url_n = "quotes/IEVersion/tns.asp";
                        url_o = "quotes/IEVersion/tnso.asp"
                    } else {
                        url_n = "mb/qtns.asp";
                        url_o = "mb/qtnso.asp"
                    }
                    a = e.isOddlot ? url_o : url_n;
                    e.changeLink(a, true, "&p=" + e.tnsPage);
                    e.getDataSI();
                    break;
                case "bns":
                    if (e.getInternetExplorerVersion() > -1) {
                        a = "quotes/IEVersion/bns.asp"
                    } else {
                        a = "mb/qbns.asp"
                    }
                    e.changeLink(a, true);
                    e.getDataSI();
                    break;
                case "vr":
                    if (e.getInternetExplorerVersion() > -1) {
                        a = "quotes/IEVersion/vr.asp"
                    } else {
                        a = "mb/qvr.asp"
                    }
                    e.changeLink(a, true);
                    e.getDataSI();
                    break;
                case "cn":
                    if (e.isCNContent) {
                        a = "quotes/xmlCNContent.asp?code=" + e.seccode + "&story=" + e.cnStoryID
                    } else {
                        a = "quotes/xmlCNList.asp?code=" + e.seccode
                    }
                    e.changeLink(a, false);
                    e.getDataSI();
                    break;
                case "bna":
                default:
                    if (e.getInternetExplorerVersion() > -1) {
                        var a = "quotes/IEVersion/qsi.asp"
                    } else {
                        var a = "quotes/si-bna-10Lvl.asp"
                    }
                    var i = e.siBNALevel;
                    i = e.isOddlot ? 5 : i;
                    url_p = e.isOddlot ? "&boardlot=O" : "";
                    var s = i == 10 ? 5 : 10;
                    url_p = url_p + "&list=" + s + "&list2=" + i;
                    e.getMarketStatus();
                    e.changeLink(a, true, url_p);
                    e.rTimeOut = setTimeout(function() {
                        e.getDataSI()
                    }, e.interval);
                    break
            }
        }
    },
    populateDataBI: function() {
        var e = this,
            t = this.qPage;
        if (t == "") {
            e.qPage = "br";
            e.activateSubLink()
        } else {
            switch (t) {
                case "ba":
                    if (e.getInternetExplorerVersion() > -1) {
                        lnk = "quotes/IEVersion/bsba.asp"
                    } else {
                        lnk = "mb/qbsba.asp"
                    }
                    e.changeLink(lnk, true, "&bcode=" + e.bcode);
                    e.getDataBI();
                    break;
                case "br":
                default:
                    if (e.getInternetExplorerVersion() > -1) {
                        lnk = "quotes/IEVersion/br.asp"
                    } else {
                        lnk = "mb/br.asp"
                    }
                    e.changeLink(lnk, true);
                    e.getDataBI();
                    break
            }
        }
    },
    populateDataMS: function() {
        var e = this,
            t = this.qPage;
        if (t == "") {
            e.qPage = "ma";
            e.activateSubLink()
        } else {
            switch (t) {
                case "tg":
                    if (e.getInternetExplorerVersion() > -1) {
                        lnk = "quotes/IEVersion/tg.asp"
                    } else {
                        lnk = "mb/qtg.asp"
                    }
                    e.changeLink(lnk, true, "&list=30");
                    e.getDataMS();
                    break;
                case "wl":
                    if (this.getInternetExplorerVersion() > -1) {
                        lnk = "quotes/IEVersion/wl.asp"
                    } else {
                        lnk = "mb/qwl.asp"
                    }
                    e.changeLink(lnk, true, "&list=30");
                    e.getDataMS();
                    break;
                case "ma":
                default:
                    if (e.getInternetExplorerVersion() > -1) {
                        lnk = "quotes/IEVersion/ma.asp"
                    } else {
                        lnk = "mb/qma.asp"
                    }
                    e.changeLink(lnk, true, "&list=30");
                    e.getDataMS();
                    break
            }
        }
    },
    populateDataMI: function() {
        var e = this,
            t = this.qPage;
        if (t == "") {
            e.qPage = "ir";
            e.activateSubLink()
        } else {
            switch (t) {
                case "ir":
                default:
                    if (e.getInternetExplorerVersion() > -1) {
                        lnk = "quotes/IEVersion/qmi.asp"
                    } else {
                        lnk = "mb/qmi.asp"
                    }
                    e.changeLink(lnk, true);
                    e.getDataMI();
                    break
            }
        }
    },
    getDataMQ: function() {
        var e = this,
            t = e.dataLink,
            a = e.qPage;
        e.dataReq = $.get(t, function(t) {
            switch (a) {
                case "ba":
                    e.populateDataBAHLL(t);
                    break;
                case "hll":
                    e.populateDataBAHLL(t);
                    break;
                case "mb":
                default:
                    break
            }
        }).fail(function() {
            e.abortRequests();
            e.setDefaults()
        })
    },
    getDataSI: function() {
        var e = this,
            t = e.dataLink,
            a = e.qPage;
        if (e.seccode != "") {
            e.selectInputBoxSeccode();
            e.dataReq = $.get(t, function(t) {
                e.secname = $(t).find("secname").text();
                if (e.secname != "") {
                    e.displaySecname(true);
                    e.sessionSave(false);
                    switch (a) {
                        case "tns":
                            e.populateDataTNS(t);
                            break;
                        case "bns":
                            e.populateDataBNS(t);
                            break;
                        case "vr":
                            e.populateDataVR(t);
                            break;
                        case "cn":
                            e.populateDataCN(t);
                            break;
                        case "bna":
                        default:
                            e.populateDataBNA(t);
                            break
                    }
                } else {
                    e.isInvalidSeccode()
                }
            }).fail(function() {
                e.abortRequests();
                e.setDefaults()
            })
        } else {
            e.isInvalidSeccode()
        }
    },
    getDataBI: function() {
        var e = this,
            t = e.dataLink,
            a = e.qPage;
        e.dataReq = $.get(t, function(t) {
            switch (a) {
                case "ba":
                    e.bname = $(t).find("brokername").text();
                    $("#BInfo-GraySearchBar").css("display", "block");
                    e.selectInputBoxBrokercode();
                    if (e.bname != "" && e.bcode != "") {
                        e.displayBrokername(true);
                        e.sessionSave(true);
                        e.populateDataBA(t)
                    } else {
                        e.isInvalidBrokercode()
                    }
                    break;
                case "br":
                default:
                    $(".searchBar").css("display", "none");
                    e.displayBrokername(false);
                    e.populateDataBR(t);
                    break
            }
        }).fail(function() {
            e.abortRequests();
            e.setDefaults()
        })
    },
    getDataMS: function() {
        var e = this,
            t = e.dataLink,
            a = e.qPage;
        e.dataReq = $.get(t, function(t) {
            e.displayExportLink(true);
            switch (a) {
                case "tg":
                    e.populateDataTG(t);
                    break;
                case "wl":
                    e.populateDataWL(t);
                    break;
                case "ma":
                default:
                    e.populateDataMA(t);
                    break
            }
        }).fail(function() {
            e.abortRequests();
            e.setDefaults()
        })
    },
    getDataMI: function() {
        var e = this,
            t = e.dataLink,
            a = e.qPage;
        e.dataReq = $.get(t, function(t) {
            switch (a) {
                case "ir":
                default:
                    e.populateDataIR(t);
                    break
            }
        }).fail(function() {
            e.abortRequests();
            e.setDefaults()
        })
    },
    populateDataBAHLL: function(e) {
        var t = this;
        $(".mqBaDataCon").empty();
        $("#lnkRefresh").css("display", "block");
        var a = "";
        var i = "";
        $(e).find("quotes").find("industry").find("security").each(function(e) {
            var s = $(this).find("change").text(),
                l = t.getColorCode(s);
            i = e % 2 == 0 ? "bgWhite" : "bgGray";
            a = a + "<ul class='" + i + " brList'>";
            a = a + "<li class='floatLeft buySellColumn column1'><div class='lh18 alignLeftText'><a href='#' class='colorGreen boldText noFontDecor'>BUY</a> | <a href='#' class='colorRed boldText noFontDecor'>SELL</a></div></li>";
            a = a + "<li class='floatLeft codeColumn column2'><a class='lh18' href='#' onClick=\"qSecdata.goToDynamicBNA('" + $(this).attr("code") + "')\">" + $(this).attr("code") + "</a></li>";
            a = a + "<li class='floatLeft lastColumn column3'><div class='lh18 alignRightText'>" + $(this).find("lastprice").text() + "</div></li>";
            a = a + "<li class='floatLeft diffColumn column4'><div class='lh18 alignRightText'>" + $(this).find("diff").text() + "</div></li>";
            a = a + "<li class='floatLeft changeColumn column5'><div class='lh18 alignRightText'>" + $(this).find("change").text() + "</div></li>";
            if (t.qPage == "ba") {
                a = a + "<li class='floatLeft bidVolumeColumn column6'><div class='lh18 alignRightText'>" + $(this).find("bidvolume").text() + "</div></li>";
                a = a + "<li class='floatLeft bidPriceColumn column7'><div class='lh18 alignRightText'>" + $(this).find("bidprice").text() + "</div></li>";
                a = a + "<li class='floatLeft askPriceColumn column8'><div class='lh18 alignRightText'>" + $(this).find("askprice").text() + "</div></li>";
                a = a + "<li class='floatLeft askVolumeColumn column9'><div class='lh18 alignRightText'>" + $(this).find("askvolume").text() + "</div></li>"
            } else {
                a = a + "<li class='floatLeft highColumn column6'><div class='lh18 alignRightText'>" + $(this).find("high").text() + "</div></li>";
                a = a + "<li class='floatLeft lowColumn column7'><div class='lh18 alignRightText'>" + $(this).find("low").text() + "</div></li>";
                a = a + "<li class='floatLeft volumeColumn column8'><div class='lh18 alignRightText'>" + $(this).find("vol").text() + "</div></li>";
                a = a + "<li class='floatLeft valueColumn column9'><div class='lh18 alignRightText'>" + $(this).find("val").text() + "</div></li>"
            }
            a = a + "</ul>"
        });
        $(".mqBaDataCon").append(a);
        t.displayUpdatedTime()
    },
    populateDataBNA: function(e) {
        var t = this;
        var a = $("#SILastTradeTime").val();
        var i = [],
            s = [],
            l = [],
            n = [],
            o = [],
            c = [];
        for (var r = 1; r <= 10; r++) {
            i[r] = $("#bidordnum" + r).html();
            s[r] = $("#bidvol" + r).html();
            l[r] = $("#bidprice" + r).html();
            n[r] = $("#sellprice" + r).html();
            o[r] = $("#sellvol" + r).html();
            c[r] = $("#askordnum" + r).html()
        }
        $(".details tr td").empty();
        var d = $(e).find("stockinfo"),
            f = $(e).find("security").attr("code");
        var h = d.children("last").text(),
            u = d.children("time").text(),
            p = d.children("diff").text(),
            v = d.children("change").text(),
            m = d.children("prevclose").text(),
            b = d.children("open").text(),
            g = d.children("high").text(),
            x = d.children("low").text(),
            k = d.children("volume").text(),
            L = d.children("value").text(),
            S = d.children("wikhi52").text(),
            q = d.children("wiklo52").text(),
            C = d.children("range").text(),
            y = d.children("cross").text(),
            D = d.children("blocks").text(),
            T = d.children("totaltrades").text(),
            w = d.children("lasttradedate").text(),
            I = d.children("dynamicfloor").text(),
            B = d.children("dynamicceiling").text(),
            R = d.children("status").text(),
            P = d.children("projprice").text(),
            N = d.children("inav").text(),
            A = d.children("inavlastupdate").text();
        A = A.toLowerCase();
        if (P == "0" || P == "0.00" || P == "") {
            $("#ProjectedField").css("display", "none");
            $(".iNavBtm").css("visibility", "hidden");
            if (N == "0" || N == "") {
                $("#INavTopField").css("display", "none")
            } else {
                $("#INavTopField").css("display", "block")
            }
        } else {
            $("#ProjectedField").css("display", "block");
            $("#INavTopField").css("display", "none");
            if (N == "0" || N == "") {
                $(".iNavBtm").css("visibility", "hidden")
            } else {
                $(".iNavBtm").css("visibility", "visible")
            }
        }
        var M = h + " (" + v.replace("%", "") + "%)";
        var E = t.getColorCode(v);
        $("#PrcChg, .leftValue, #ProjTop, #iNavPriceTop, #iNavPriceBtm").removeClass("colorRed colorGreen colorBlack").addClass(E);
        $("#PrcChg").html(M).css("display", "block");
        $("#SILastTradeTime").val($.trim(u));
        $("#SIDiff").html(p);
        $("#SIChg").html(v);
        $("#SIPrev").html(m);
        $("#SIOpen").html(b);
        $("#SIHigh").html(g);
        $("#SILow").html(x);
        $("#SIVolume").html(k);
        $("#SIValue").html(L);
        $("#SI52High").html(S);
        $("#SI52Low").html(q);
        $("#SIRange").html(C);
        $("#SICross").html(y);
        $("#SIBlock").html(D);
        $("#SITrades").html(T);
        $("#SILastTrade").html(w);
        $("#SIDFloor").html(I);
        $("#SIDCeil").html(B);
        $("#SIStatus").html(R);
        $("#ProjTop").html(P);
        $(".iNavPrice").html(N);
        $(".iNavAsOf").html(A);
        bid_vol = [];
        bid_price = [];
        bid_ordnum = [];
        ask_vol = [];
        ask_price = [];
        ask_ordnum = [];
        $(e).find("bid").find("vol").each(function(e) {
            bid_vol[e] = $(this).text()
        });
        $(e).find("bid").find("price").each(function(e) {
            bid_price[e] = $(this).text()
        });
        $(e).find("bid").find("orders").each(function(e) {
            bid_ordnum[e] = $(this).text()
        });
        $(e).find("ask").find("vol").each(function(e) {
            ask_vol[e] = $(this).text()
        });
        $(e).find("ask").find("price").each(function(e) {
            ask_price[e] = $(this).text()
        });
        $(e).find("ask").find("orders").each(function(e) {
            ask_ordnum[e] = $(this).text()
        });
        $.each(bid_vol, function(e) {
            bnaIndex = e + 1;
            var t = s[bnaIndex] != bid_vol[e] || l[bnaIndex] != bid_price[e] ? "bold" : "normal";
            var a = o[bnaIndex] != ask_vol[e] || n[bnaIndex] != ask_price[e] ? "bold" : "normal";
            $("#bidordnum" + bnaIndex).html(bid_ordnum[e]).css("font-weight", t);
            $("#bidvol" + bnaIndex).html(bid_vol[e]).css("font-weight", t);
            $("#bidprice" + bnaIndex).html(bid_price[e]).css("font-weight", t);
            $("#sellprice" + bnaIndex).html(ask_price[e]).css("font-weight", a);
            $("#sellvol" + bnaIndex).html(ask_vol[e]).css("font-weight", a);
            $("#askordnum" + bnaIndex).html(ask_ordnum[e]).css("font-weight", a)
        });
        tnsEntryID = [];
        $(e).find("timeNsales").each(function(e) {
            var a = e + 1;
            var i = $(this).children("time").text();
            var s = $(this).children("price").text();
            var l = $(this).children("volume").text();
            var n = t.stringReplaceCommaToEmpty(l) * t.stringReplaceCommaToEmpty(s);
            var o = $(this).children("buyer").text();
            var c = $(this).children("seller").text();
            tnsEntryID[e] = t.isOddlot ? $(this).children("entryID").text() : $(this).children("entryid").text();
            $("#time" + a).html(i);
            $("#price" + a).html(s);
            $("#vol" + a).html(l);
            $("#val" + a).html(t.addCommas(n.toFixed(0)));
            $("#buyer" + a).html(o);
            $("#seller" + a).html(c);
            var r = !t.checkIfDoesExists(tnsEntryID[e]) ? "bold" : "normal";
            $(".tnsRow" + a + " td").css("font-weight", r)
        });
        t.arrBNAEntryID = tnsEntryID;
        if (a != $.trim(u)) {
            $("#PrcChg, .leftValue").css("font-weight", "bold")
        } else {
            t.backToDefaultBNA++
        }
        if (t.backToDefaultBNA == 3) {
            $(".leftValue").css("font-weight", "normal");
            t.backToDefaultBNA = 0
        }
        if (t.isFirstRun) {
            t.isFirstRun = false;
            $(".details tr td").css("font-weight", "normal");
            $(".leftValue").css("font-weight", "normal")
        }
        t.interval = t.defaultInterval;
        if (this.marketOpen) {
            this.init()
        }
    },
    populateDataTNS: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#tnsData").empty();
        nmaxpage = $(e).find("maxpage").text();
        $("#tnsNavigationPage").css("display", nmaxpage == 0 ? "none" : "block");
        $("#lnkRefresh").css("display", "block");
        if (t.tnsMaxPage != nmaxpage) {
            $("#TNSCurPage, #TNSMaxPage").empty();
            $("#TNSCurPage").html(t.tnsPage);
            $("#TNSMaxPage").html(nmaxpage);
            t.tnsMaxPage = nmaxpage
        }
        var s = "";
        $(e).find("security").find("timeNsales").each(function(e) {
            i++;
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " tnsList'>";
            s = s + "<li class='floatLeft w5pct'><div class='lh18 alignRightText'>" + $(this).find("time").text() + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("price").text() + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("vol").text() + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("val").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("buyer").text() + "</div></li>";
            s = s + "<li class='floatLeft w16pct'><div class='lh18 alignRightText'>" + $(this).find("seller").text() + "</div></li>";
            s = s + "</ul>"
        });
        $("#tnsData").append(s);
        t.displayUpdatedTime()
    },
    populateDataBNS: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#buyersData").empty();
        $("#lnkRefresh").css("display", "block");
        var s = "";
        $(e).find("buyer").find("item").each(function(e) {
            i++;
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " buyersSellersList' id='bnsData'>";
            s = s + "<li class='floatLeft w5pct '><div class='lh18 alignLeftText'>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w20pct alignLeftText'><a class='lh18 alignLeftText' href='#' onClick=\"qSecdata.goToBActivity('" + $(this).find("buyer2").text() + "');\">" + $(this).find("buyer2").text() + "</a></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("volume").text() + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("value").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("average").text() + "</div></li>";
            s = s + "<li class='floatLeft w18pct'><div class='lh18 alignRightText'>" + $(this).find("weight").text() + "%" + "</div></li>";
            s = s + "</ul>"
        });
        $("#buyersData").append(s);
        i = 1;
        s = "";
        $("#sellersData").empty();
        $(e).find("seller").find("item").each(function(e) {
            i++;
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " buyersSellersList' id='bnsData'>";
            s = s + "<li class='floatLeft w5pct '><div class='lh18 alignLeftText'>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w20pct '><a class='lh18 alignLeftText' href='#' onclick=\"qSecdata.goToBActivity('" + $(this).find("seller2").text() + "');\">" + $(this).find("seller2").text() + "</a></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("volume").text() + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("value").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("average").text() + "</div></li>";
            s = s + "<li class='floatLeft w18pct'><div class='lh18 alignRightText'>" + $(this).find("weight").text() + "%" + "</div></li>";
            s = s + "</ul>"
        });
        $("#sellersData").append(s);
        t.displayUpdatedTime()
    },
    populateDataVR: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#vrData").empty();
        $("#lnkRefresh").css("display", "block");
        $(e).find("security").find("volumereview").each(function(e) {
            a = a + parseInt($(this).find("tvol").text())
        });
        var s = "";
        $(e).find("security").find("volumereview").each(function(e) {
            i++;
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " volumeReviewList'>";
            s = s + "<li class='floatLeft w5pct'><div class='lh18'>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + $(this).find("price").text() + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("tvol").text()) + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><div class='lh18 alignRightText'>" + t.numberWithCommas(parseFloat($(this).find("price").text()) * parseInt($(this).find("tvol").text())) + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("numtrades").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + (parseFloat($(this).find("tvol").text()) / a * 100).toFixed(2) + "%" + "</div></li>";
            s = s + "</ul>"
        });
        $("#vrData").append(s);
        t.displayUpdatedTime()
    },
    populateDataCN: function(e) {
        var t = this,
            a = 0,
            i = 1,
            s = t.isCNContent;
        $("#cnData").empty();
        if (s) {
            $("#lnkRefresh, #cnHeader").css("display", "none");
            $("#cnHeader2").css("display", "block");
            var l = "";
            $(e).find("research").find("story").each(function(e) {
                $("#cnHeader2").html($.trim($(this).children("headline").text())).css("font-weight", "bold").css("line-height", "25px");
                l = l + "<div class='companyNewsContent lh18'>";
                l = l + $.trim($(this).children("content").text());
                l = l + "</div>";
                l = l + "<div class='noMarginPadding height25px'>";
                l = l + "<a href='#' onClick=\"qSecdata.populateDataCNList()\">BACK TO PREVIOUS PAGE</a>";
                l = l + "</div>"
            });
            $("#cnData").append(l);
            $("#UpdateTime").empty()
        } else {
            $("#lnkRefresh, #cnHeader").css("display", "block");
            $("#cnHeader2").css("display", "none");
            var l = "",
                n = 0;
            $(e).find("research").find("story").each(function(e) {
                if (++n <= 10) {
                    i++;
                    bg = i % 2 == 0 ? "bgWhite" : "bgGray";
                    l = l + "<ul class='" + bg + " companyNewsList lh18'>";
                    l = l + "<li class='floatLeft w15pct'><div class='lh18 boldText'>" + $.trim($(this).children("date").text()) + "</div></li>";
                    l = l + "<li class='floatLeft w68pct'><a href='#' class='lh18 cNews' onClick=\"qSecdata.populateDataCNContent('" + $(this).attr("id") + "')\">" + $.trim($(this).children("headline").text()) + "</a></li>";
                    l = l + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $.trim($(this).children("source").text()) + "</div></li>";
                    l = l + "</ul>"
                }
            });
            $("#cnData").append(l);
            t.displayUpdatedTime()
        }
    },
    populateDataBR: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#brData").empty();
        $("#lnkRefresh").css("display", "block");
        var s = "";
        $(e).find("brokerranking").find("broker").each(function(e) {
            i++;
            var a = $(this).find("tnetval").text(),
                l = t.getColorCode(a);
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " brList'>";
            s = s + "<li class='floatLeft w5pct'><div class='lh18 '>" + (i - 1) + "</div></li>";
            s = s + "<li class='floatLeft w20pct'><a class='lh18 alignLeftText' href='#' onClick=\"qSecdata.goToBActivity('" + $(this).attr("code").replace("'", "\\'") + "');\">" + $(this).attr("code") + "</a></li>";
            s = s + "<li class='floatLeft w20pct " + l + "'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("tval").text()) + "</div></li>";
            s = s + "<li class='floatLeft w20pct " + l + "'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("tbuyval").text()) + "</div></li>";
            s = s + "<li class='floatLeft w16pct " + l + "'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("tsellval").text()) + "</div></li>";
            s = s + "<li class='floatLeft w16pct " + l + "'><div class='lh18 alignRightText'>" + t.numberWithCommas(a) + "</div></li>";
            s = s + "</ul>"
        });
        $("#brData").append(s);
        t.displayUpdatedTime()
    },
    populateDataBA: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#bi-buyersData").empty();
        $("#lnkRefresh").css("display", "block");
        var s = "";
        $(e).find("brokeractivity").find("buy").each(function(e) {
            i++;
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " buyersSellersList' id='bnsData'>";
            s = s + "<li class='floatLeft w5pct '><div class='lh18 alignLeftText'>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w15pct alignLeftText'><a class='lh18 alignLeftText' href='#' onClick=\"qSecdata.goToDynamicBNA('" + $(this).find("seccode").text() + "')\">" + $(this).find("seccode").text() + "</a></li>";
            s = s + "<li class='floatLeft w25pct'><div class='lh18 alignRightText'>" + t.formatNumber($(this).find("avgprice").text()) + "</div></li>";
            s = s + "<li class='floatLeft w25pct'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("totalvol").text()) + "</div></li>";
            s = s + "<li class='floatLeft w24pct'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("totalval").text()) + "</div></li>";
            s = s + "</ul>"
        });
        $("#bi-buyersData").append(s);
        i = 1;
        s = "";
        $("#bi-sellersData").empty();
        $(e).find("brokeractivity").find("sell").each(function(e) {
            i++;
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " buyersSellersList' id='bnsData'>";
            s = s + "<li class='floatLeft w5pct '><div class='lh18 alignLeftText'>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w15pct '><a class='lh18 alignLeftText' href='#' onClick=\"qSecdata.goToDynamicBNA('" + $(this).find("seccode").text() + "')\">" + $(this).find("seccode").text() + "</a></li>";
            s = s + "<li class='floatLeft w25pct'><div class='lh18 alignRightText'>" + t.formatNumber($(this).find("avgprice").text()) + "</div></li>";
            s = s + "<li class='floatLeft w25pct'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("totalvol").text()) + "</div></li>";
            s = s + "<li class='floatLeft w24pct'><div class='lh18 alignRightText'>" + t.numberWithCommas($(this).find("totalval").text()) + "</div></li>";
            s = s + "</ul>"
        });
        $("#bi-sellersData").append(s);
        t.displayUpdatedTime()
    },
    populateDataMA: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#maData").empty();
        $("#lnkRefresh").css("display", "block");
        var s = "";
        $(e).find("quotes").find("security").each(function(e) {
            i++;
            var a = $(this).find("chg").text().replace("%", ""),
                l = t.getColorCode(a);
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " brList'>";
            s = s + "<li class='floatLeft w3pct'><div class='lh18 '>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w12pct'><div class='lh18 alignLeftText'><a href='#' onClick=\"qSecdata.goToTrading('" + $(this).attr("code") + "','B')\" class='colorGreen boldText noFontDecor'>BUY</a> | <a href='#' onClick=\"qSecdata.goToTrading('" + $(this).attr("code") + "','S')\" class='colorRed boldText noFontDecor'>SELL</a></div></li>";
            s = s + "<li class='floatLeft w10pct'><a class='lh18' href='#' onClick=\"qSecdata.goToDynamicBNA('" + $(this).attr("code") + "')\">" + $(this).attr("code") + "</a></li>";
            s = s + "<li class='floatLeft w10pct'><div class='lh18 alignRightText'>" + $(this).find("last").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + $(this).find("diff").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + a + "%</div></li>";
            s = s + "<li class='floatLeft w10pct'><div class='lh18 alignRightText'>" + $(this).find("prev").text() + "</div></li>";
            s = s + "<li class='floatLeft w18pct'><div class='lh18 alignRightText'>" + $(this).find("tval").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("tvol").text() + "</div></li>";
            s = s + "</ul>"
        });
        $("#maData").append(s);
        t.displayUpdatedTime()
    },
    populateDataTG: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#tgData").empty();
        $("#lnkRefresh").css("display", "block");
        var s = "";
        $(e).find("quotes").find("security").each(function(e) {
            i++;
            var a = $(this).find("chg").text().replace("%", ""),
                l = t.getColorCode(a);
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " brList'>";
            s = s + "<li class='floatLeft w3pct'><div class='lh18 '>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w12pct'><div class='lh18 alignLeftText'><a href='#' onClick=\"qSecdata.goToTrading('" + $(this).attr("code") + "','B')\" class='colorGreen boldText noFontDecor'>BUY</a> | <a href='#' onClick=\"qSecdata.goToTrading('" + $(this).attr("code") + "','S')\" class='colorRed boldText noFontDecor'>SELL</a></div></li>";
            s = s + "<li class='floatLeft w10pct'><a class='lh18' href='#' onClick=\"qSecdata.goToDynamicBNA('" + $(this).attr("code") + "')\">" + $(this).attr("code") + "</a></li>";
            s = s + "<li class='floatLeft w10pct'><div class='lh18 alignRightText'>" + $(this).find("last").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + $(this).find("diff").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + a + "%</div></li>";
            s = s + "<li class='floatLeft w10pct'><div class='lh18 alignRightText'>" + $(this).find("prev").text() + "</div></li>";
            s = s + "<li class='floatLeft w18pct'><div class='lh18 alignRightText'>" + $(this).find("val").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("vol").text() + "</div></li>";
            s = s + "</ul>"
        });
        $("#tgData").append(s);
        t.displayUpdatedTime()
    },
    populateDataWL: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#wlData").empty();
        $("#lnkRefresh").css("display", "block");
        var s = "";
        $(e).find("quotes").find("security").each(function(e) {
            i++;
            var a = $(this).find("chg").text().replace("%", ""),
                l = t.getColorCode(a);
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " brList'>";
            s = s + "<li class='floatLeft w3pct'><div class='lh18 '>" + (e + 1) + "</div></li>";
            s = s + "<li class='floatLeft w12pct'><div class='lh18 alignLeftText'><a href='#' onClick=\"qSecdata.goToTrading('" + $(this).attr("code") + "','B')\" class='colorGreen boldText noFontDecor'>BUY</a> | <a href='#' onClick=\"qSecdata.goToTrading('" + $(this).attr("code") + "','S')\" class='colorRed boldText noFontDecor'>SELL</a></div></li>";
            s = s + "<li class='floatLeft w10pct'><a class='lh18' href='#' onClick=\"qSecdata.goToDynamicBNA('" + $(this).attr("code") + "')\">" + $(this).attr("code") + "</a></li>";
            s = s + "<li class='floatLeft w10pct'><div class='lh18 alignRightText'>" + $(this).find("last").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + $(this).find("diff").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + a + "%</div></li>";
            s = s + "<li class='floatLeft w10pct'><div class='lh18 alignRightText'>" + $(this).find("prev").text() + "</div></li>";
            s = s + "<li class='floatLeft w18pct'><div class='lh18 alignRightText'>" + $(this).find("val").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("vol").text() + "</div></li>";
            s = s + "</ul>"
        });
        $("#wlData").append(s);
        t.displayUpdatedTime()
    },
    populateDataIR: function(e) {
        var t = this,
            a = 0,
            i = 1;
        $("#irData").empty();
        $("#lnkRefresh").css("display", "block");
        var s = "";
        $(e).find("quotes").find("security").each(function(e) {
            i++;
            var a = $(this).find("chg").text().replace("%", ""),
                l = t.getColorCode(a);
            var n = a > 0 ? "<img border='0' src='images/ArrowUpSmaller.gif'>" : "<img border='0' src='images/ArrowDownSmaller.gif'>";
            n = a == 0 ? "" : n;
            var o = $(this).attr("code");
            $("#PseiArrow").html(n);
            if ($(this).attr("code").toUpperCase() == "PSEI") {
                $("#PseiLast").html($(this).find("last").text());
                $("#PseiDiff").html(t.appendNumberSign($(this).find("diff").text()) + $(this).find("diff").text());
                $("#PseiChg").html(t.appendNumberSign(a) + a + "%");
                $("#PseiAdv").html($(this).find("adv").text() + " <img border='0' src='images/ArrowUpSmaller.gif'>");
                $("#PseiDec").html($(this).find("dec").text() + " <img border='0' src='images/ArrowDownSmaller.gif'>");
                $("#PseiUnchg").html($(this).find("unchg").text() + "&nbsp;&nbsp;-&nbsp;");
                $("#PseiVol").html($(this).find("vol").text()).addClass(l);
                $("#PseiVal").html(t.addCommas(parseFloat(t.stringReplaceCommaToEmpty($(this).find("val").text())).toFixed())).addClass(l);
                $("#PseiTurnover").html($(this).find("abbrval").text())
            }
            bg = i % 2 == 0 ? "bgWhite" : "bgGray";
            s = s + "<ul class='" + bg + " brList'>";
            s = s + "<li class='floatLeft w15pct'><a class='lh18 boldText' href='#' onClick=\"qSecdata.goToCharts('" + o + "')\">" + t.getIndustryName($(this).find("secname").text()) + "</a></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("last").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + t.appendNumberSign($(this).find("diff").text()) + $(this).find("diff").text() + "</div></li>";
            s = s + "<li class='floatLeft w10pct " + l + "'><div class='lh18 alignRightText'>" + t.appendNumberSign(a) + a + "%</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("open").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("high").text() + "</div></li>";
            s = s + "<li class='floatLeft w15pct'><div class='lh18 alignRightText'>" + $(this).find("low").text() + "</div></li>";
            s = s + "<li class='floatLeft w5pct'><div class='lh18 alignRightText pad5'>" + n + "</div></li>";
            s = s + "</ul>"
        });
        $("#irData").append(s);
        t.displayUpdatedTime()
    },
    formatNumber: function(e) {
        return parseFloat(e).toFixed(4)
    },
    addCommas: function(e) {
        var t = new String(e);
        var a = 1;
        var i = "";
        var s = 0;
        if (t < 0) {
            s = 1;
            t = t.slice(1, t.length)
        }
        var l = t.indexOf(".");
        if (l > 0) {
            i = t.slice(l, t.length);
            for (var n = l; n >= 1; n--) {
                i = t.slice(n - 1, n) + i;
                if (a % 3 == 0 && n !== 1) i = "," + i;
                a++
            }
        } else {
            l = t.length;
            for (var n = l; n >= 1; n--) {
                i = t.slice(n - 1, n) + i;
                if (a % 3 == 0 && n !== 1) i = "," + i;
                a++
            }
        }
        if (s > 0) i = "-" + i;
        return i
    },
    numberWithCommas: function(e) {
        var t = parseInt(e).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
        return t
    },
    stringReplaceCommaToEmpty: function(e) {
        return e.replace(/\,/g, "")
    },
    appendNumberSign: function(e) {
        var t = this.stringReplaceCommaToEmpty(e);
        if (isNaN(t)) return "colorBlack";
        else {
            if (t > 0) return "+";
            else return ""
        }
    },
    checkIfDoesExists: function(e) {
        var t = $.inArray(e, this.arrBNAEntryID);
        return t < 0 ? false : true
    },
    getFMETF: function() {
        var e = this,
            t = "quotes/fmetf/getInavFMETF.asp?" + Math.random();
        this.fmetfReq = $.get(t, function(t) {
            var a = "",
                i = "";
            if (t.toLowerCase() != "disabled") {
                var s = $(t).text();
                var l = s.indexOf("as of ");
                if ($("#iNavORProjConTopLabel").html() == "") {
                    $("#iNavORProjConTopLabel").html("iNAV")
                }
                $("#iNavORProjConTopLabel").css("display", "block");
                s = s.substr(l - 15, s.length);
                l = s.indexOf("as of ");
                a = $.trim(s.substr(0, 10));
                a = a.replace("i", "");
                i = $.trim(s.substr(l + 7, s.length))
            } else {
                $("#iNavORProjConTopLabel").css("display", "none");
                if ($("#ProjTop").html() != "0") {
                    $("#iNavORProjConTopLabel").css("display", "block")
                }
                $(".iNavBtm").css("visibility", "hidden")
            }
            $("#iNavPriceTop, #iNavPriceBtm").html(a);
            $(".iNavAsOf").html(i);
            e.fmetfTimeOut = 0
        })
    },
    clearFMETFVal: function() {
        $("#iNavPriceTop, #iNavPriceBtm").empty();
        $(".iNavAsOf").empty()
    },
    tnsNavigatepage: function(e) {
        curpage = this.tnsPage;
        curmaxpage = this.tnsMaxPage;
        switch (e) {
            case "first":
                newpage = curpage != 1 ? 1 : "";
                break;
            case "prev":
                newpage = curpage > 1 ? curpage - 1 : "";
                break;
            case "next":
                newpage = curpage < curmaxpage ? curpage + 1 : "";
                break;
            case "last":
                newpage = curpage != curmaxpage ? curmaxpage : "";
                break
        }
        if (newpage != "") {
            this.tnsPage = newpage;
            this.abortRequests();
            this.init();
            $("#TNSCurPage, #TNSMaxPage").empty();
            $("#TNSCurPage").html(newpage);
            $("#TNSMaxPage").html(curmaxpage)
        }
    },
    goToBActivity: function(e) {
        this.qSubmenu = "bi";
        this.qPage = "ba";
        this.bcode = e;
        $("#bcodeID").val(e);
        this.changeSubMenuLink("biIndicator", this.qPage)
    },
    goToDynamicBNA: function(e) {
        this.qSubmenu = "si";
        this.qPage = "bna";
        this.seccode = e;
        $("#secCode").val(e);
        this.changeSubMenuLink("siIndicator", this.qPage)
    },
    goToCharts: function(e) {
        location.href = "charts.asp?ca=N&code=" + e
    },
    goToTrading: function(e, t) {
        location.href = "trading/default.asp?side=" + t + "&seccode=" + e
    },
    populateDataCNContent: function(e) {
        var t = e;
        this.isCNContent = true;
        this.cnStoryID = t;
        this.init()
    },
    populateDataCNList: function() {
        this.isCNContent = false;
        this.cnStoryID = "";
        this.init()
    },
    switchBoardLot: function() {
        var e = this.isOddlot,
            t = "";
        $(".lnkBoard").removeClass("boardLotLinkActive");
        $(".imgSelectorBoardlot").css("visibility", "hidden");
        if (e) {
            t = "Oddlot";
            $(".forNormalOnly").css("visibility", "hidden");
            $(".si-bna-menu-enabled").css("display", "none");
            $(".si-bna-menu-disabled").css("display", "block");
            if (!$("#HTMLBody").hasClass("oddLotBG")) {
                $("#HTMLBody").addClass("oddLotBG");
                $("#HTMLBody").css("background-color", "#e7e7e7")
            }
            $("#ProjectedField").css("display", "none");
            $("#iNavPriceTop").css("display", "block");
            $("#INavBotField").css("display", "none")
        } else {
            t = "Normal";
            $(".forNormalOnly").css("visibility", "visible");
            $(".si-bna-menu-enabled").css("display", "block");
            $(".si-bna-menu-disabled").css("display", "none");
            if ($("#HTMLBody").hasClass("oddLotBG")) {
                $("#HTMLBody").removeClass("oddLotBG");
                $("#HTMLBody").css("background-color", "")
            }
        }
        $("#lnk" + t).addClass("boardLotLinkActive");
        $("#selector" + t).css("visibility", "visible");
        this.abortRequests();
        this.setDefaults();
        this.adjustSIBNAContainer();
        this.init()
    },
    processCustomDropdown: function(e, t) {
        var a = this,
            i = "";
        i = a.getInternetExplorerVersion() > -1 ? "quotes/IEVersion/" + t + ".asp" : "mb/" + t + ".asp";
        a.watchlistReq = $.get(e, function(e) {
            a.changeLink(i, true, "&" + e.slice(0, -1));
            a.getDataMQ()
        })
    },
    getIndustryName: function(e) {
        var t = "&nbsp;";
        e = $.trim(e.toUpperCase());
        e = e.replace("PHI", "");
        switch (e) {
            case "ALL":
                t = "PSE ALL SHARES";
                break;
            case "FIN":
                t = "PSE FINANCIAL";
                break;
            case "HDG":
                t = "PSE HOLDINGS";
                break;
            case "IND":
                t = "PSE INDUSTRIES";
                break;
            case "M-O":
                t = "PSE MINING & OIL";
                e = "PHIPROP";
                break;
            case "PROP":
                t = "PSE PROPERTIES";
                break;
            case "SVC":
                t = "PSE SERVICES";
                break;
            default:
                t = e;
                break
        }
        return t
    },
    getColorCode: function(e) {
        var t;
        if (e != null) t = e.replace(/%/, "");
        if (isNaN(t)) return "colorBlack";
        else {
            if (t > 0) return "colorGreen";
            else if (t < 0) return "colorRed";
            else return "colorBlack"
        }
    },
    clearData: function() {
        var e = this.qPage.toLowerCase();
        $("#" + e + "Data, .details tr td, .leftValue, #buyersData, #sellersData, #bi-sellersData,#bi-buyersData").empty();
        $("#tnsNavigationPage").css("display", "none");
        $("#PrcChg").css("display", "none");
        this.clearFMETFVal();
        $("#lnkRefresh").css("display", "none");
        if (this.secname == "") {
            $(".quotesLabel").css("display", "none")
        } else {
            $(".quotesLabel").css("display", "block")
        }
        $(".brokerLabel").css("display", "none");
        $(".exportLabel").css("display", "none")
    },
    abortRequests: function() {
        clearTimeout(this.rTimeOut);
        clearTimeout(this.fmetfTimeOut);
        if (this.dataReq != null) {
            this.dataReq.abort()
        }
        if (this.mktStatReq != null) {
            this.mktStatReq.abort()
        }
        if (this.saveReq != null) {
            this.saveReq.abort()
        }
        if (this.fmetfReq != null) {
            this.fmetfReq.abort()
        }
        poller.abortRequests()
    },
    setDefaults: function() {
        this.tnsPage = 1;
        this.tnsMaxPage = 0;
        this.isCNContent = false;
        this.interval = 0;
        this.isFirstRun = true;
        this.secname = "";
        this.seccode = $("#secCode").val();
        this.bname = "";
        this.bcode = $("#bcodeID").val()
    },
    getMarketStatus: function() {
        var e = this;
        mktsPage = "quotes/mb/time.asp?" + Math.random();
        e.mktStatReq = $.get(mktsPage, function(t) {
            if (t == "C") {
                e.marketOpen = false
            } else if (t == "H") {
                e.defaultInterval = e.haltInterval;
                e.marketOpen = true
            } else {
                e.defaultInterval = e.openInterval;
                e.marketOpen = true
            }
        })
    },
    sessionSave: function(e) {
        if (e) {
            nBCode = this.bcode;
            oBCode = this.oldbcode;
            if (nBCode != oBCode) {
                bname = nBCode == "" ? "" : this.bname;
                $("#bcodeID").empty();
                $("#BrokerCode").html(nBCode.toUpperCase() + " - " + bname);
                this.saveReq = $.get("quotes/sessionupdate.asp?brcode=" + nBCode + "&brname=" + bname);
                this.oldbcode = nBCode
            }
        } else {
            nSecCode = this.seccode;
            oSecCode = this.oldseccode;
            if (oSecCode != nSecCode) {
                sname = nSecCode == "" ? "" : this.secname;
                $("#Code").empty();
                $("#Code").html(nSecCode.toUpperCase() + " - " + sname);
                this.saveReq = $.get("quotes/sessionupdate.asp?seccode=" + nSecCode + "&secname=" + sname);
                this.oldseccode = nSecCode
            }
        }
    },
    sessionSaveBNALevel: function() {
        var e = this.siBNALevel;
        var t = this.siBNALevelOld;
        this.saveReq = $.get("quotes/sessionupdate.asp?bnalevel=" + e);
        this.siBNALevelOld = e
    },
    getInternetExplorerVersion: function() {
        var e = -1;
        if ($.browser.msie) {
            e = $.browser.version
        }
        return e
    },
    isInvalidSeccode: function() {
        this.seccode = "";
        this.secname = "";
        $("#secCode").val("");
        this.sessionSave(false);
        this.clearData()
    },
    isInvalidBrokercode: function() {
        this.bcode = "";
        this.bname = "";
        $("#bcodeID").val("");
        this.displayBrokername(false);
        this.sessionSave(true);
        this.clearData()
    },
    displaySecname: function(e) {
        if (e) {
            $(".brokerLabel").css("display", "none");
            $(".exportLabel").css("display", "none");
            $(".quotesLabel").css("display", "block")
        } else {
            $(".quotesLabel").css("display", "none")
        }
    },
    displayExportLink: function(e) {
        if (e) {
            $(".brokerLabel").css("display", "none");
            $(".quotesLabel").css("display", "none");
            $(".exportLabel").css("display", "block")
        } else {
            $(".exportLabel").css("display", "none")
        }
    },
    displayBrokername: function(e) {
        if (e) {
            $(".quotesLabel").css("display", "none");
            $(".exportLabel").css("display", "none");
            $(".brokerLabel").css("display", "block")
        } else {
            $(".brokerLabel").css("display", "none")
        }
    },
    newStockCodeDataReq: function() {
        this.abortRequests();
        this.setDefaults();
        this.init()
    },
    selectInputBoxSeccode: function() {
        $("#secCode").focus();
        $("#secCode").select()
    },
    selectInputBoxBrokercode: function() {
        $("#bcodeID").focus();
        $("#bcodeID").select()
    },
    refreshPage: function() {
        this.abortRequests();
        this.setDefaults();
        $("#marketglanceContainer").html("");
        $("#marketglanceContainer").html("<img style='margin: 40px;border: 1px solid #cccccc;' src='/includes/image.asp?file=/mg/marketglance" + "&" + Math.random() + "' alt='market index' />");
        var e = this.getInternetExplorerVersion();
        if (e < 9 && e != -1) {
            $("#marketglanceContainer").html("<img style='margin: 40px 35px;border: 0px solid #cccccc;' src='/includes/image.asp?file=/mg/marketglance" + "&" + Math.random() + "' alt='market index' />")
        } else {
            $("#marketglanceContainer").html("<div id='mgContainerProper' style='margin:40px 35px'></div>");
            $("#mgContainerProper").load("/marketglance/mg_white.asp")
        }
        this.init()
    },
    changeSubMenuLink: function(e, t) {
        var a = e.replace("Indicator", "");
        this.qSubmenu = a != "" ? a : this.qSubmenu;
        var i = this.qSubmenu;
        this.qPage = !t ? "" : t;
        $(".searchBar").css("display", "none");
        $("#" + i.toUpperCase() + "-" + "GraySearchBar").css("display", "block");
        var s = $(".qsmActive").attr("id");
        $("#" + s).removeClass("qsmActive").addClass("qsmNormal");
        $("#" + e).addClass("qsmActive");
        $("#" + s).attr("data-active", "false");
        $("#" + e).attr("data-active", "true");
        $(".qSubmenu").css("display", "none");
        $("#" + i + "Submenu").css("display", "block");
        this.clearData();
        this.isOddlot = false;
        this.resetBoardLot();
        if (this.qPage == "") {
            this.init();
            this.selectInputBoxSeccode()
        } else {
            this.activateSubLink()
        }
    },
    resetBoardLot: function() {
        var e = this.isOddlot,
            t = "Normal";
        $(".lnkBoard").removeClass("boardLotLinkActive");
        $(".imgSelectorBoardlot").css("visibility", "hidden");
        $(".forNormalOnly").css("visibility", "visible");
        if ($("#HTMLBody").hasClass("oddLotBG")) {
            $("#HTMLBody").removeClass("oddLotBG");
            $("#HTMLBody").css("background-color", "")
        }
        $("#lnk" + t).addClass("boardLotLinkActive");
        $("#selector" + t).css("visibility", "visible")
    },
    activateSubLink: function() {
        var e = qSecdata.qSubmenu;
        var t = this.qPage.toUpperCase();
        var a = e + "l" + t;
        var i = $("." + e + "ActiveLink").attr("id");
        $("#" + i).removeClass("boldText colorBlack " + e + "ActiveLink");
        $("#" + a).addClass("boldText colorBlack " + e + "ActiveLink");
        $("#" + i).attr("data-active", "false");
        $("#" + a).attr("data-active", "true");
        this.changeContainer()
    },
    changeLink: function(e, t, a) {
        var i = "",
            s = "",
            a = a == "" || !a ? "" : a;
        if (t) {
            s = this.getInternetExplorerVersion() > -1 ? "" : hostfile;
            i = s + e + "?code=" + this.seccode + a
        } else {
            i = e
        }
        this.dataLink = i + "&" + Math.random()
    },
    changeSIBnALevel: function() {
        var e = this;
        this.abortRequests();
        this.setDefaults();
        this.adjustSIBNAContainer();
        this.sessionSaveBNALevel();
        this.init()
    },
    changeContainer: function() {
        this.abortRequests();
        this.setDefaults();
        var e = this.qSubmenu,
            t = this.qPage;
        $(".subContainer, #tnsNavigationPage, #lnkRefresh, #PrcChg, #UpdateTime").css("display", "none");
        $("#" + e + "-" + t + "Container").css("display", "block");
        if (this.secname == "") {
            $(".quotesLabel").css("display", "none")
        } else {
            $(".quotesLabel").css("display", "block")
        }
        if (e == "si" && (t == "bna" || t == "tns")) {
            $(".boardLotLinks").css("display", "block")
        } else {
            $(".boardLotLinks").css("display", "none");
            $("#HTMLBody").removeClass("oddLotBG");
            $("#HTMLBody").css("background-color", "")
        }
        if (e == "mq" && t == "mb") {
            $("#DataContainer, .quotesLabelAndUpdateLink").css("display", "none");
            $("#MultipleBnaContainer").css("display", "block");
            poller.setSelectorPage($("#pageNum").val(), 1)
        } else {
            $("#DataContainer, .quotesLabelAndUpdateLink").css("display", "block");
            $("#MultipleBnaContainer").css("display", "none")
        }
        this.clearData();
        this.init();
        this.selectInputBoxSeccode()
    },
    onPageLand: function() {
        var e = qSecdata.qPage.toUpperCase();
        this.abortRequests();
        this.setDefaults();
        bnaLevel = bnaLevel == "" ? 5 : bnaLevel;
        this.siBNALevel = bnaLevel;
        this.adjustSIBNAContainer();
        this.changeSubMenuLink(this.qSubmenu + "Indicator", this.qPage)
    },
    adjustSIBNAContainer: function() {
        var e = this;
        var t = parseInt(e.siBNALevelOld);
        var a = parseInt(e.siBNALevel);
        var i = parseInt($(".bna-maxRowClass").attr("data-bnarownum"));
        var s = parseInt($(".bna-lastRowClass").attr("data-bnarownum"));
        var l = e.isOddlot;
        if (l) {
            a = 5;
            t = 10
        }
        if (a > t && !l) {
            for (var n = a; n > t; n--) {
                $(".tnsRow" + n).css("display", "none");
                $(".si-bnaRow" + n).css("display", "")
            }
        } else {
            for (var n = i; n > a; n--) {
                $(".tnsRow" + n).css("display", "");
                $(".si-bnaRow" + n).css("display", "none")
            }
        }
        if (!l) {
            $(".siBnAPart").removeClass("bna-lastRowClass");
            $(".si-bnaRow" + a).addClass("bna-lastRowClass");
            var o = "siBNALvlMenu";
            var c = "siBNALvl" + a;
            var r = $("." + o + "ActiveLink").attr("id");
            $("#" + r).removeClass("boldText colorBlack " + o + "ActiveLink");
            $("#" + c).addClass("boldText colorBlack " + o + "ActiveLink");
            $("#" + r).attr("data-active", "false");
            $("#" + c).attr("data-active", "true")
        }
        e.siBNALevelOld = a
    },
    displayUpdatedTime: function() {
        var e = new Date;
        var t = e.getHours(),
            a = e.getMinutes(),
            i = e.getSeconds(),
            s = "AM";
        if (t > 12) {
            t = t - 12;
            s = "PM"
        }
        if (a < 10) {
            a = "0" + a
        }
        if (i < 10) {
            i = "0" + i
        }
        $("#UpdateTime").html("(as of " + t + ":" + a + ":" + i + ")").css("display", "block")
    }
};
var poller = {
    timeo: "",
    failed: 0,
    url: "",
    seccode: "",
    defaultInterval: 3e3,
    interval: 0,
    fmetfTimeOut: 0,
    fmetfReq: null,
    mbnaReq: null,
    mktStatReq: null,
    saveReq: null,
    blankBox: 0,
    isPosting: false,
    marketOpen: false,
    isFirstRun: true,
    init: function() {
        $.proxy(this.getSeccodes(), this);
        if (this.blankBox < cfg.numOfBnaBox) {
            $.proxy(this.getMarketStatus(), this);
            this.timeo = setTimeout($.proxy(this.getData, this), this.interval)
        }
    },
    getData: function() {
        var e = this;
        this.success = false;
        this.interval = this.defaultInterval;
        var t = 0;
        if (this.getInternetExplorerVersion() > -1) {
            url_n = "quotes/mb/xmlparse.asp?code=";
            url_dir = url_n;
            this.urlpage = url_dir + this.seccode + "&" + Math.random()
        } else {
            url_n = "quotes/mbna_5lvl.asp?code=";
            url_dir = url_n;
            this.urlpage = hostfile + url_dir + this.seccode + "&" + Math.random()
        }
        this.mbnaReq = $.get(this.urlpage, function(t) {
            e.loadXML(t)
        }).fail($.proxy(e.errorHandler, e))
    },
    loadXML: function(e) {
        var t = this;
        $(e).find("security").each(function() {
            var e = $(this).attr("code"),
                a = $(this).attr("box"),
                i = $.trim($(this).children("secname").text());
            if (i != "") {
                var s = $(this).children("stockinfo"),
                    l = t.isPosting ? "" : s.children("last").text(),
                    n = t.isPosting ? "" : s.children("diff").text(),
                    o = t.isPosting ? "" : s.children("change").text(),
                    c = t.isPosting ? "" : n + " (" + o + "%)",
                    r = s.children("inav").text(),
                    d = s.children("inavlastupdate").text();
                d = d.toLowerCase();
                if (d != "") {
                    $("#pcg" + a).css("margin-left", "0px");
                    $("#nIopvPrice" + a).html(r);
                    $("#sIopvDateTime" + a).html("iNav as of " + d)
                } else {
                    $("#nIopvPrice" + a).html("");
                    $("#sIopvDateTime" + a).html("")
                }
                t.setFontColor(o, a);
                $("#strSecName" + a).html(i);
                $("#lastprc" + a).html(l);
                $("#pcg" + a).html(c);
                $(s).find("bid").find("price").each(function(e) {
                    old = $("#bnaBox" + a + " #bidPrice" + (e + 1)).html();
                    newq = $(this).text() == 0 ? "" : $(this).text();
                    if (old != newq && old != "") {
                        $("#bnaBox" + a + " #bidPrice" + (e + 1)).html(newq).css("font-weight", "bold")
                    } else {
                        $("#bnaBox" + a + " #bidPrice" + (e + 1)).html(newq).css("font-weight", "normal")
                    }
                });
                $(s).find("bid").find("orders").each(function(e) {
                    old = $("#bnaBox" + a + " #bid" + (e + 1)).html();
                    newq = $(this).text() == 0 ? "" : $(this).text();
                    if (old != newq && old != "") {
                        $("#bnaBox" + a + " #bid" + (e + 1)).html(newq).css("font-weight", "bold")
                    } else {
                        $("#bnaBox" + a + " #bid" + (e + 1)).html(newq).css("font-weight", "normal")
                    }
                });
                $(s).find("bid").find("abbvol").each(function(e) {
                    old = $("#bnaBox" + a + " #bidVol" + (e + 1)).html();
                    newq = $(this).text() == 0 ? "" : $(this).text();
                    if (old != newq && old != "") {
                        $("#bnaBox" + a + " #bidVol" + (e + 1)).html(newq).css("font-weight", "bold")
                    } else {
                        $("#bnaBox" + a + " #bidVol" + (e + 1)).html(newq).css("font-weight", "normal")
                    }
                });
                $(s).find("ask").find("price").each(function(e) {
                    old = $("#bnaBox" + a + " #askPrice" + (e + 1)).html();
                    newq = $(this).text() == 0 ? "" : $(this).text();
                    if (old != newq && old != "") {
                        $("#bnaBox" + a + " #askPrice" + (e + 1)).html(newq).css("font-weight", "bold")
                    } else {
                        $("#bnaBox" + a + " #askPrice" + (e + 1)).html(newq).css("font-weight", "normal")
                    }
                });
                $(s).find("ask").find("orders").each(function(e) {
                    old = $("#bnaBox" + a + " #ask" + (e + 1)).html();
                    newq = $(this).text() == 0 ? "" : $(this).text();
                    if (old != newq && old != "") {
                        $("#bnaBox" + a + " #ask" + (e + 1)).html(newq).css("font-weight", "bold")
                    } else {
                        $("#bnaBox" + a + " #ask" + (e + 1)).html(newq).css("font-weight", "normal")
                    }
                });
                $(s).find("ask").find("abbvol").each(function(e) {
                    old = $("#bnaBox" + a + " #askVol" + (e + 1)).html();
                    newq = $(this).text() == 0 ? "" : $(this).text();
                    if (old != newq && old != "") {
                        $("#bnaBox" + a + " #askVol" + (e + 1)).html(newq).css("font-weight", "bold")
                    } else {
                        $("#bnaBox" + a + " #askVol" + (e + 1)).html(newq).css("font-weight", "normal")
                    }
                })
            } else {
                t.clearBoxValues(a);
                mbnaIndex = "p1b" + a;
                mbna[mbnaIndex].seccode = "bl@nk";
                $("#box" + a).val("")
            }
        });
        if (this.marketOpen == true) {
            this.interval = this.defaultInterval;
            this.init()
        }
    },
    errorHandler: function() {
        if (++this.failed < 10) {
            this.interval += 1e3;
            if (this.marketOpen == true) {
                this.init()
            }
        }
    },
    LoadSingleBidAsk: function(e) {
        var t = this;
        t.abortRequests();
        boxIndex = e.boxNum;
        if (e.seccode == "") {
            t.clearBoxValues(boxIndex);
            mbnaIndex = "p1b" + boxIndex;
            mbna[mbnaIndex].seccode = "bl@nk"
        }
        this.interval = 0;
        this.init();
        this.xmlSave()
    },
    getInternetExplorerVersion: function() {
        var e = -1;
        if ($.browser.msie) {
            e = $.browser.version
        }
        return e
    },
    getSeccodes: function() {
        var e = this;
        e.blankBox = 0;
        var t = "";
        var a = "";
        $.each(mbna, function(i) {
            if (mbna[i].seccode == "" || mbna[i].seccode == "bl@nk") {
                t = "bl@nk";
                e.blankBox++
            } else {
                t = mbna[i].seccode
            }
            a = a + "," + t
        });
        this.seccode = a.slice(1)
    },
    setFontColor: function(e, t) {
        var a = "#409726";
        var i = "#FF0000";
        var s = "#000";
        if (e > 0) {
            fColor = a
        } else if (e < 0) {
            fColor = i
        } else {
            fColor = s
        }
        $(".dynamicColor" + t).css("color", fColor)
    },
    isSeccodeExisting: function(e) {
        var t = false;
        if (e != "") {
            $.each(mbna, function(a) {
                if (mbna[a].seccode.toUpperCase() == e) {
                    t = true
                }
            })
        }
        return t
    },
    populateBox: function(e) {
        var t = this;
        t.abortRequests();
        psec = [];
        t.clearValues();
        $.get("/quotes/mb/xmlUser.asp?pageMultiple=" + e + "&" + Math.random(), function(e) {
            psec = e.split(",");
            $.each(mbna, function(e) {
                var t = psec[e.slice(-1) - 1];
                t = t == "bl@nk" ? "" : t;
                mbna[e].seccode = t
            });
            $.each(mbna, function(e) {
                var t = e.slice(-1);
                var a = mbna[e].seccode;
                $("#box" + t).val(a)
            });
            t.interval = 0;
            t.init()
        })
    },
    clearBoxValues: function(e) {
        $("#bnaBox" + e + " .secDetail").empty();
        $("#bnaBox" + e + " .bidData div").empty()
    },
    clearValues: function() {
        $(".secDetail").empty();
        $(".bidData div").empty()
    },
    clearFMETFVal: function(e) {
        $("#nIopvPrice" + e).empty();
        $("#sIopvDateTime" + e).empty()
    },
    xmlSave: function() {
        var e = this.seccode;
        var t = $("#pageNum").val();
        var a = "quotes/mb/xmlSave.asp?seccodes=" + e + "&pageMultiple=" + t + "&" + Math.random();
        self.saveReq = $.get(a)
    },
    getFMETF: function(e) {
        var t = this,
            a = "quotes/fmetf/getInavFMETF.asp?" + Math.random();
        divID = e;
        this.fmetfReq = $.get(a, function(a) {
            var i = "",
                s = "";
            if (a.toLowerCase() != "disabled ") {
                fmetf = $(a).text();
                indexofInav = fmetf.indexOf("iNAV");
                fmetf = fmetf.substr(indexofInav - 10, fmetf.length);
                indexofInav = fmetf.indexOf("iNAV");
                i = $.trim(fmetf.substr(0, indexofInav));
                s = $.trim(fmetf.substr(indexofInav, fmetf.length))
            } else {
                i = "";
                s = ""
            }
            $("#pcg" + e).css("margin-left", "0px");
            $("#nIopvPrice" + divID).html(i);
            $("#sIopvDateTime" + divID).html(s);
            t.fmetfTimeOut = 0
        })
    },
    getMarketStatus: function() {
        var e = this;
        mktsPage = "quotes/mb/time.asp?" + Math.random();
        e.mktStatReq = $.get(mktsPage, function(t) {
            var a = new Date;
            if (t == "P") {
                if (a.getHours() == cfg.StartPostingHour && (a.getMinutes() >= cfg.StartPostingMinute && a.getMinutes() < cfg.EndPostingMinute)) {
                    e.isPosting = true;
                    e.marketOpen = true
                } else {
                    e.isPosting = false;
                    e.marketOpen = true
                }
            } else if (t == "C" || t == "H") {
                e.isPosting = false;
                e.marketOpen = false
            } else {
                e.isPosting = false;
                e.marketOpen = true
            }
        })
    },
    abortRequests: function() {
        this.isFirstRun = true;
        clearTimeout(this.fmetfTimeOut);
        clearTimeout(this.timeo);
        if (this.mbnaReq != null) {
            this.mbnaReq.abort()
        }
        if (this.fmetfReq != null) {
            this.fmetfReq.abort()
        }
        if (this.mktStatReq != null) {
            this.mktStatReq.abort()
        }
        if (this.saveReq != null) {
            this.saveReq.abort()
        }
    },
    selectInputBoxSeccode: function(e) {
        $("#" + e).focus().select()
    },
    setSelectorPage: function(e, t) {
        $("#Page" + e).removeClass("page" + e + "Active active").addClass("PageSelectorNormal selector").empty();
        $("#Page" + e).html("<a id='Page" + e + "Save' href='#'>" + e + "</a>");
        $("#Page" + t).removeClass("PageSelectorNormal").addClass("page" + t + "Active active").empty();
        $("#pageNum").val(t)
    }
};