//$.device
$.addCookie = function (name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + '; path=/; expires=' + oDate;
};

$.getCookie = function (name) {
    var arr = document.cookie.split('; ');

    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        //arr2[0]  name
        if (name == arr2[0]) {
            return arr2[1];
        }
    }
    return '';
};
$.removeCookie = function (name) {
    $.addCookie(name, '1', -1);
};

$.trim = function (str) {
    str = str || "";
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

//数组比较器
$.compareArrObject = function (propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName],
            value2 = object2[propertyName];
        if (value2 < value1) {
            return 1;
        } else if (value2 > value1) {
            return -1;
        } else {
            return 0;
        }
    }
};

//stamp2time和time2stamp   2个时间转换的毫秒数会被忽略。
$.stamp2time = function (b) {
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year = a.getFullYear();
    var month = parseInt(a.getMonth()) + 1;
    month = (month < 10) ? "0" + month : month;
    var date = a.getDate();
    date = (date < 10) ? "0" + date : date;
    var hours = a.getHours();
    hours = (hours < 10) ? "0" + hours : hours;
    var minutes = a.getMinutes();
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    var seconds = a.getSeconds();
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
};
//传入时间戳，输出日期部分
$.stamp2date = function (b) {
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year = a.getFullYear();
    var month = parseInt(a.getMonth()) + 1;
    month = (month < 10) ? "0" + month : month;
    var date = a.getDate();
    date = (date < 10) ? "0" + date : date;
    return year + "-" + month + "-" + date;
};
//a :   2012-12-13   2012-12-12 12:12:33  自动补位
$.time2stamp = function (a) {
    var new_str = a.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    if (arr.length != 6) {
        for (var i = 0, l = 6 - arr.length; i < l; i++) {
            arr.push(0);
        }
    }

    return new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5])).getTime();
};

$.getArray = function (str) {
    return ($.isArray(str)) ? str : [];
};
$.getFunction = function (fn) {
    return ($.isFunction(fn)) ? fn : function () { };
};
$.getNumber = function (str) {
    str = parseInt(str);
    str = str || 0;
    return str;
};
$.getBoolean = function (str) {
    var rs = false;
    if (typeof str != "undefined") {
        str = str.toString().toLowerCase();
        rs = (str == "true" || str == "t" || parseInt(str) > 0);
    }
    return rs;
};
$.convert = function (convertFunction, json, fields) {
    if ($.type(json) != "undefined" && json != null && $.type(fields) != "undefined") {
        if ($.type(fields) === "string") fields = fields.split(",");
        fields = fields.distinct();
        $.each(fields, function (index, item) {
            json[item] = convertFunction(json[item]);
        });
    }
    return json;
};
$.convertNumber = function (json, fields) {
    return $.convert($.getNumber, json, fields);
};
$.convertBoolean = function (json, fields) {
    return $.convert($.getBoolean, json, fields);
};
$.convertStamp = function (json, fields) {
    return $.convert($.time2stamp, json, fields);
};


/* 验证
 *  $.checkInputs({
 *      inputs:[
 *          {
 *              id:"test",                              //要检查的input的id
 *              name:"用户名",                           //要检查的input的名字（信息提示用）
 *              rules:"must,username,min:6,max:16",     //验证规则，见 rules 对象
 *              error:"用户名格式错误"                     //（非必须）自定义错误提示
 *          },
 *          ...
 *      ],
 *      success:function(){
 *          //验证通过回调
 *          console.log("ok")
 *      },
 *      error:function(msg,ids){
 *          //返回验证错误的文字
 *          console.log(msg)
 *      }
 *  })
 *
 *
 */
(function () {
    var temp_fn = {
        rules: {
            username: {
                rule: /^[a-zA-Z][a-zA-Z0-9]*$/,
                error: "格式错误"
            },
            nickname: {
                rule: /^.+$/,
                error: "格式错误"
            },
            password: {
                rule: /^[a-zA-Z0-9]*$/,
                error: "不能有特殊字符"
            },
            mobile: {
                rule: /^[1]\d*$/,
                error: "格式错误"
            },
            email: {
                rule: /^[a-zA-Z0-9][a-zA-Z0-9-_\.]*@[a-zA-Z0-9_-]*\.[a-zA-Z0-9]*$/,
                error: "格式错误"
            },
            number: {
                rule: /^[0-9]*$/,
                error: "格式错误"
            },
            loginusername: {
                rule: /(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/,
                error: "只能为手机号码或者电子邮箱地址"
            }
        },
        check: function (datas) {
            var inputs = $.getArray(datas.inputs),
                success = $.getFunction(datas.success),
                error = $.getFunction(datas.error),
                pass = true,
                error_messages = [],
                ids = [];

            for (var i = 0, l = inputs.length; i < l; i++) {
                var this_input = inputs[i],
                    this_id = this_input.id,
                    this_rules = this_input.rules.split(","),
                    this_error_msg = this_input.error;

                var this_error = [],
                    this_state = true;
                this._checkOne(this_id, this_rules, function (text) {
                    //未通过。。。
                    pass = false;
                    this_state = false;
                    this_error.push(text);
                });

                this_input.state = this_state;
                this_input.message = this_error.join(",");
                if (!this_state) {
                    if (this_error_msg) {
                        error_messages.push(this_error_msg);
                    } else {
                        error_messages.push(this_input.name + ":" + this_input.message);
                    }
                    ids.push(this_id);
                }
            }

            if (pass) {
                success();
            } else {
                var msg = error_messages.join(";");
                error(msg, ids);
            }

        },
        //检查流程
        _checkOne: function (id, rules, error) {
            var obj = $("#" + id);
            if (obj.length == 0) { console.log("id:" + id + "元素没有找到"); return; }

            var this_val = $.trim(obj.val());
            if (this_val) {
                //输入有值需要验证
                for (var i = 0, l = rules.length; i < l; i++) {
                    var rule = rules[i],
                        setRules = this.rules[rule];

                    if (setRules) {
                        var reg = setRules.rule,
                            check = reg.test(this_val);

                        if (!check) {
                            error(setRules.error);
                        }

                    } else if (rule.indexOf("max") > -1) {
                        var length = rule.split(":")[1];
                        if (this_val.length > length) {
                            error("不能超过" + length + "字符");
                        }

                    } else if (rule.indexOf("min") > -1) {
                        var length1 = rule.split(":")[1];
                        if (this_val.length < length1) {
                            error("不能少于" + length1 + "字符");
                        }
                    }
                }
            } else {
                rules = rules.join(",");
                if (rules.indexOf("must") > -1) {
                    //没有输入但是是必填项目 报错
                    error("不能为空");
                }
            }
        }
    };
    $.checkInputs = function (data) {
        temp_fn.check(data);
    }
})();

//数量选择器的用法
//$(".choose").quantity({
//    defaultNum:0
//});

//数量选择器
$.fn.quantity=function(settings){

    return this.each(function(){
        var body=$(this),
            minNum = settings.minNum || 1,
            maxNum = settings.maxNum || 1.7976931348623157e+308,
            defaultNum = settings.defaultNum || 0,
            subCallback = settings.subCallback || null,
            addCallback = settings.addCallback || null,
            inputSuccess = settings.inputSuccess || null;

        var quantity={
            //初始化
            init:function(){
                this.createDom();
            },
            //创建dom
            createDom:function(){
                var domstr='<div style="position: relative; overflow: hidden; height: 22px; width: 80px;">'+
                    '<a href="javascript:;" class="qtypre" style="float: left;border: 1px solid #cacbcb; border-right: 0; height: 18px; line-height: 18px; padding: 1px 0; width: 16px; text-align: center; color: #666; margin: 0; background: #fff; font-size: 14px; font-weight: bolder;">-</a>'+
                    '<input autocomplete="off" type="text" class="qtyinput" style="position: absolute; left: 17px; top: 0; border: 1px solid #cacbcb; width: 42px; height: 18px; line-height: 18px; text-align: center; padding: 1px; margin: 0; font-size: 12px; font-family: verdana; color: #333; -webkit-appearance: none;" value="'+defaultNum+'">'+
                    '<a href="javascript:;" class="qtynext" style="float: right; border: 1px solid #cacbcb; border-left: 0; color: #666; height: 18px; line-height: 18px; padding: 1px 0; width: 16px; text-align: center; margin: 0; background: #fff; font-size: 14px; font-weight: bolder;">+</a></div>';

                body.append($(domstr));
                this.bindEvent();
            },
            //事件绑定
            bindEvent:function(){
                //减法操作
                body.on("click",".qtypre",function(){
                    var num=parseInt($(this).next().val());

                    num --;

                    if(num < minNum){
                        return;
                    }

                    $(this).next().val(num);
                    subCallback && subCallback(num);
                });
                //加法操作
                body.on("click",".qtynext",function(){
                    var num=parseInt($(this).prev().val());

                    num++;

                    if(num > maxNum){
                        return;
                    }

                    $(this).prev().val(num);
                    addCallback && addCallback(num);
                });

                body.on("blur",".qtyinput",function(){
                    var num=parseInt($(this).val());

                    num>maxNum?$(this).val(maxNum):null;
                    num<minNum?$(this).val(minNum):null;

                    inputSuccess && inputSuccess(num);
                });
            }
        };
        quantity.init();

    });
};

//获取地区插件的用法
//$(".add").getCity({
//    getData:function(data){
//        console.log(data);
//    },
//    getID:function(id){
//        console.log(id);
//        _this.areaId=id;
//    }
//});


//获取地区插件
$.fn.getCity = function (settings) {

    return this.each(function () {
        var body = $(this),
            subApi=settings.subsetAPI || "",
            currentApi=settings.currentInfoAPI || "",
            currentData=settings.current || {},
            maxLev=settings.maxLev || 5;

        var getCity = {
            //数据对象数组
            dataArr: [],
            //当前地区id
            codeArr: [],
            //当前位置数据
            currentData:[],
            //初始化
            init:function(){
                var result=this.validate();

                if(result){
                    if(currentData == null || $.isEmptyObject(currentData)){
                        this.getDataByParentID("");
                    }else{
                        this.getCurrentDataByID();
                    }
                }

                this.bindEvent();
            },
            //验证参数的完整性
            validate:function(){
                if(!subApi){
                    throw new Error( "请传入获取下一级地址的api地址!" );
                    return;
                }
                if(!currentApi){
                    throw new Error( "请传入获取当前地址的api地址!" );
                    return;
                }
                return true;
            },
            //事件绑定
            bindEvent: function () {
                var _this = this;

                body.on("change", "select", function () {
                    var index = $(this).index(),
                        obj = $(this)[0].options[$(this)[0].selectedIndex];

                    $(this).nextAll().remove();
                    $(this).attr("dataid", $(obj).attr("dataid"));
                    $(this).attr("datacode", $(obj).attr("datacode"));

                    _this.dataArr=[];
                    body.find("select").each(function(){
                        _this.dataArr.push($(this).val());
                    });

                    if ($(obj).attr("dataid") != "") {
                        _this.optionID = $(obj).attr("dataid");
                        _this.optionCode = $(obj).attr("datacode");

                        _this.getDataByParentID($(obj).attr("dataid"));

                    } else {
                        _this.optionID = $(this).prev().attr("dataid");
                        _this.optionCode = $(this).prev().attr("datacode");
                    }

                    settings.getData && settings.getData(_this.dataArr.join(""));
                    settings.getID && settings.getID(_this.optionID,_this.optionCode);

                });
            },
            //根据上一级id获取下一级数据
            getDataByParentID:function(id,i,callback){
                var _this=this,
                    len = body.find("select").length;

                if (len > maxLev - 1) {
                    return;
                }
                $.ajax({
                    url:subApi,
                    data:{
                        id:id
                    },
                    success:function(rs){
                        var arr=_this.currentData[i+1],
                            id= arr?arr.ID: _this.optionID;
                        _this.createDom(rs,id);
                        callback && callback();
                    }
                });
            },
            //根据currentid  获取当前地址数据
            getCurrentDataByID:function(){
                var _this=this,
                    i= 0;

                $.ajax({
                    url:currentApi,
                    data:currentData,
                    success:function(rs){
                        var json={
                            AreaType: 0,
                            ID: "",
                            Name: "",
                            ParentID: ""
                        };

                        _this.currentData=rs;
                        _this.currentData.unshift(json);
                        _this.recursion(i);
                    }
                });
            },
            //递归算法
            recursion:function(i){
                var _this=this;

                this.getDataByParentID(_this.currentData[i].ID,i,function(){
                    i++;
                    if(i<_this.currentData.length-1){
                        _this.recursion(i);
                    }
                });
            },
            //创建dom元素
            createDom: function (data, id) {
                var oSelect = $("<select style='margin-right: 10px'><option dataid=''>全部</option></select>");

                if (data.length > 0) {
                    for (var i = 0, j = data.length; i < j; i++) {
                        var oPtion = $("<option datacode='"+data[i].AreaType+"'  dataid='" + data[i].ID + "'>" + data[i].Name + "</option>");
                        oSelect.append(oPtion);
                        if (id) {
                            if (id == data[i].ID) {
                                oSelect.val(data[i].Name);
                                oSelect.attr("dataid", data[i].ID);
                                oSelect.attr("dataid", data[i].AreaType);
                            }
                        }
                    }
                    body.append(oSelect);
                }
            }
        };
        getCity.init();
    });
};




//显示大图
//$.showPicture(src)   @param src：str
$.showPicture = function (src) {
    var close_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAlgAAAJYAJvGvrMAAAGOSURBVDjLhZRLL0NREMd/9Whq50PYSjyKaNDK7crGd2DRxqKNjQ0rK4kVYUlESNj5ClZESUgXXn0oTRCtRNoSLT0WvT3mtKpzNmcyv7l35n9nrgNpTtxM4qOLTuCNOIccEOGTP8xBD5s8U0aJU+aFbdw4avF2pkgZqDxpgjhNfI58Q1yhKLAgU6bJ/YsrFO/MVPFe7kSgZGAl0VOawUo5GwK4IMSN9pKEiYjoLi7w8CTwIcAijkKRYgLo41THM4zDkna/CdtFWiR4YML2AqLMVTgWr4zhtyEvln0b48oomYzRZFynVPFrI56Drxr5kng1PiwEsE9L3Yi00abvreKuLWs8IaVbrbYfN+J5OBHuncY9jOqUmCCisCxkndUa3ZLU7UtZ12GEZ+2e0S+USeAHujnS8Sx+cLIlXnlGgEvxXQICV+zRAdDPvViYotFkUQzfIx50lYWm4/1B+HfvnMw3SflgEZe5/kHSDfFHQiZe+QkMsFMzWQrFK/sMUz8RALjwscK5vbB5oqxhVZSp2g819GPsdjchhgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0wNC0yNlQxMzo1ODoyNCswODowMHmGUoEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDQtMjZUMTM6NTg6MjQrMDg6MDAI2+o9AAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjguOC03IFExNiB4ODZfNjQgMjAxNC0wMi0yOCBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ1mkX38AAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuNCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIA5Jg+MAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADgzM8JkksYAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAODMzUZXCmwAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4NDkxOTA0QrnX9AAAABN0RVh0VGh1bWI6OlNpemUAMTcuOUtCQvJgtYsAAABidEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL2Z0cC8xNTIwL2Vhc3lpY29uLmNuL2Vhc3lpY29uLmNuL2Nkbi1pbWcuZWFzeWljb24uY24vcG5nLzExNTQ0LzExNTQ0MjAucG5nmJ8K+AAAAABJRU5ErkJggg==";

    var show = {
        div: null,
        zz: null,
        close: null,


        init: function (src) {
            this.srcs = src;

            this.createZZ();
            this.createDiv();
            this.eventBind();
            var size = this.showDiv();
            this.loadImg(size);
        },
        createZZ: function () {
            var div = $("<div></div>");
            div.css({
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                background: "#000",
                opacity: "0.5",
                "z-index": 999
            });
            this.zz = div;
        },
        createDiv: function () {
            var div = $("<div>loading...</div>");
            div.css({
                position: "fixed",
                width: "80%",
                height: "80%",
                left: "9%",
                top: "9%",
                border: "10px solid #fff",
                background: "#ccc",
                "text-align": "center",
                "border-radius": "10px",
                "z-index": 999
            });

            var close = $("<img src='" + close_img + "'/>");
            close.css({
                position: "absolute",
                right: "-14px",
                top: "-14px",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                "z-index": "10000"
            });

            div.append(close);
            this.div = div;
            this.close = close;
            $("body").append(div)

        },
        eventBind: function () {
            var _this = this;
            this.close.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.destroy();
            });

            this.zz.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.destroy();
            });

            this.div.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

        },
        showDiv: function () {
            var body = $("body");
            body.append(this.zz);
            body.append(this.div);

            var width = parseInt(this.div.width()),
                height = parseInt(this.div.height());

            this.div.css({
                "line-height": height + "px"
            });

            return {
                width: width,
                height: height
            }

        },
        loadImg: function (body_size) {
            var img = new Image(),
                _this = this;

            img.onload = function () {
                _this.getImgSize(this, body_size);
            };

            img.src = src;

        },
        getImgSize: function (img, body_size) {
            var objwidth = body_size.width,
                objheight = body_size.height,
                imgwidth = img.width,
                imgheight = img.height;

            if (imgwidth > 0 && imgheight > 0) {
                if (imgwidth / imgheight >= objwidth / objheight) {
                    if (imgwidth > objwidth) {
                        newimgwidth = objwidth;
                        newimgheight = imgheight * objwidth / imgwidth;
                    } else {
                        newimgwidth = imgwidth;
                        newimgheight = imgheight;
                    }
                } else {
                    if (imgheight > objheight) {
                        newimgheight = objheight;
                        newimgwidth = imgwidth * objheight / imgheight;
                    } else {
                        newimgwidth = imgwidth;
                        newimgheight = imgheight;
                    }
                }
            }

            this.div.css({
                width: newimgwidth + "px",
                height: newimgheight + "px",
                "line-height": newimgheight + "px",
                left: "50%",
                top: "50%",
                "margin-top": -newimgheight / 2 - 10 + "px",
                "margin-left": -newimgwidth / 2 - 10 + "px"
            });

            $(img).css({
                position: "absolute",
                left: 0,
                top: 0,
                width: newimgwidth + "px",
                height: newimgheight + "px"
            });

            this.div.append(img);

        },
        destroy: function () {
            this.zz.unbind("click");
            this.close.unbind("click");
            this.div.unbind("click");

            this.zz.remove();
            this.div.remove();

            this.zz = null;
            this.div = null;
            this.close = null;
        }

    };

    show.init(src);


};



//loading
//$.loadShow();
//$.loadHide();
(function () {
    var zz = null,
        zz_main = null,
        load_gif = "../../image/load.gif";

    var show = function (obj) {

        obj = obj || $("body");

        zz = $("<div class='zoom'></div>");
        var css = {
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            "background-color": "rgba(0,0,0,0.2)",
            "z-index": 99998
        };

        var css2 = {
            position: "absolute",
            left: "50%",
            top: "50%",
            "margin-left": "-100px",
            "margin-top": "-30px",
            width: "200px",
            height: "60px",
            "line-height": "60px",
            background: "#fff",
            opacity: 1,
            "z-index": 99999,
            color: "#333",
            "text-align": "center",
            "box-shadow": "0px 0px 5px rgba(0,0,0,.8)"
        };

        zz.css(css);

        zz_main = $("<div>正在读取数据......</div>");
        //var img = $("<img src='"+load_gif+"'>");
        //img.css({
        //    width:"100px",
        //    height:"100px",
        //    position:"absolute",
        //    top:"50%",
        //    left:"50%",
        //    "margin-left":"-50px",
        //    "margin-top":"-50px"
        //});
        zz_main.css(css2);
        //zz_main.append(img);
        zz.append(zz_main);
        if (obj.find(".zoom").length < 1) {
            obj.append(zz);
        }

        //zz.animate({
        //    "opacity":".4"
        //},1000)
    };
    var hide = function (obj) {
        obj = obj || $("body");
        if (obj.find(".zoom").length > 0) {
            obj.find(".zoom").remove();
            //zz.remove();
            //zz_main.remove();
            //zz = null;
            //zz_main = null;
        }
    };

    $.loadShow = show;
    $.loadHide = hide;
})();


//滚动加载....
//var a = new $.scrollLoad({
//    mainDiv: $("#scroll_comment"),
//    buttonLength: 500,
//    ajaxFn: function (){
//        a.destroy();            //加载完成调用
//        a.ajaxSuccess();        //加载成功调用
//        a.ajaxError();      //加载失败调用
//        a.setActive(false);  //是否激活滚动加载
//    }
//})
(function () {
    var TAIHE = {};
    TAIHE.addEvent = function (target, type, func) {
        if (target.addEventListener) {
            target.addEventListener(type, func, false);
        } else if (target.attachEvent) {
            target.attachEvent("on" + type, func);
        } else {
            target["on" + type] = func;
        }
    };
    TAIHE.removeEvent = function (target, type, func) {
        if (target.removeEventListener) {
            target.removeEventListener(type, func, false);
        } else if (target.detachEvent) {
            target.detachEvent("on" + type, func);
        } else {
            delete target["on" + type];
        }
    };



    var scroll_load = function (data) {
        this.ajaxFn = data.ajaxFn || function () { };
        this.buttonLength = data.buttonLength || 100;
        this.scrollObj = (data.scrollObj) ? data.scrollObj.get(0) : null;

        //是否加载中
        this.isLoading = false;
        //是否活动（多个加载在一个页面时使用）
        this.active = true;

        this.scrollFn = null;

        this.init();
    };
    scroll_load.prototype = {
        init: function () {
            this.addEvent();
        },
        //添加事件
        addEvent: function () {
            var _this = this,
                obj = this.scrollObj || window;

            TAIHE.addEvent(obj, "scroll", this.scrollFn = function () {
                _this.checkLoad();
            });
        },
        //检查是否触发加载事件
        checkLoad: function () {
            var scroll_top, scroll_height, win_height, scroll_button;


            if (this.scrollObj) {
                scroll_top = parseInt(this.scrollObj.scrollTop);
                scroll_height = parseInt(this.scrollObj.scrollHeight);
                win_height = parseInt(this.scrollObj.style.height);
                scroll_button = scroll_height - scroll_top - win_height;
            } else {
                scroll_top = parseInt($(document).scrollTop());
                scroll_height = parseInt($("body").prop("scrollHeight"));
                win_height = parseInt($(window).height());
                scroll_button = scroll_height - scroll_top - win_height;
            }


            if (scroll_button < this.buttonLength && !this.isLoading && this.active) {
                this.ajaxFn();
            }
        },
        //销毁
        destroy: function () {
            TAIHE.removeEvent(window, "scroll", this.scrollFn);
        }
    };


    TAIHE.scrollLoad = function (data) {
        var _this = this;

        this.buttonLength = data.buttonLength || 200;
        this.mainDiv = data.mainDiv;
        this.showLoading = data.showLoading || true;
        this.ajaxFn = data.ajaxFn;
        this.scrollObj = data.scrollObj;

        this.loadObj = null;

        this.scrollFn = new scroll_load({
            ajaxFn: function () {
                _this.ajaxStart.call(_this);
            },
            buttonLength: _this.buttonLength,
            scrollObj: _this.scrollObj
        });

    };
    TAIHE.scrollLoad.prototype = {
        ajaxStart: function () {
            var _this = this;
            _this.scrollFn.isLoading = true;

            if (_this.showLoading) {
                _this.showLoad();
            }

            _this.ajaxFn();

        },
        //显示loading
        showLoad: function () {
            var div = $("<div>加载中，请稍后！</div>");
            div.css({
                width: "100%",
                height: "30px",
                "line-height": "30px",
                "text-align": "center",
                color: "#000"
            });
            this.mainDiv.append(div);

            this.loadObj = div;
        },
        //隐藏loading
        hideLoad: function () {
            if (this.loadObj && this.loadObj.find("a").length != 0) {
                this.loadObj.find("a").unbind("click").unbind("hover");
            }

            if (this.loadObj && this.loadObj.length != 0) {
                this.loadObj.remove();
            }

            this.loadObj = null;
        },
        //加载失败显示loading
        reShowLoad: function () {
            var _this = this,
                div = $("<div>加载失败，<a>点击重试</a></div>");


            div.css({
                width: "100%",
                height: "30px",
                "line-height": "30px",
                "text-align": "center",
                color: "#000"
            });
            div.find("a").click(function () {
                _this.hideLoad();
                _this.ajaxStart();
            }).hover(function () {
                $(this).css({ color: "#999" });
            }, function () {
                $(this).css({ color: "#000" });
            });

            this.mainDiv.append(div);
            this.loadObj = div;
        },
        //ajax调用成功回调
        ajaxSuccess: function () {
            this.hideLoad();
            this.scrollFn.isLoading = false;
        },
        //ajax调用失败回调
        ajaxError: function () {
            this.hideLoad();
            this.reShowLoad();
        },
        //ajax 加载完数据
        destroy: function () {
            this.hideLoad();
            this.scrollFn.destroy();
            this.scrollFn = null;

            this.mainDiv = null;
            this.showLoading = null;
            this.ajaxFn = null;
        },
        //设置是否触发滚动加载
        setActive: function (state) {
            if (this.scrollFn) {
                this.scrollFn.active = state;
            }
        }
    };

    $.scrollLoad = TAIHE.scrollLoad;
})();
//-----------------------------------------------------------------------
// 该项目特有(商家管理后台)
//-----------------------------------------------------------------------
$.scrollLoadInterval = function (opt) {
    var main_div = opt.mainDiv,
        button_length = opt.buttonLength,
        get_data_api_name = opt.getDataApiName,
        bind_data_fn = opt.bindDataFn,
        scroll_id = 0,
        scroll_key = opt.scrollForKey,
        search_data = opt.searchData,
        run_in = opt.runIn,
        scroll_obj = opt.scrollObj,
        obj;

    var param = {
        mainDiv: main_div,
        scrollObj: scroll_obj,
        buttonLength: button_length,
        ajaxFn: function () {
            top.AJAX[get_data_api_name]({
                success: function (rs) {
                    if (!rs || rs.length == 0) {
                        obj.destroy();
                        bind_data_fn([]);
                    } else {
                        var rs_length = rs.length,
                            last_data = rs[rs_length - 1];

                        scroll_id = last_data[scroll_key];

                        obj.ajaxSuccess();
                        bind_data_fn.call(run_in, rs);
                    }
                },
                error: function (msg) {
                    obj.ajaxError();
                },
                data: search_data,
                scrollKey: scroll_key,
                scrollId: scroll_id
            })
        }
    };



    obj = new $.scrollLoad(param);

    obj.ajaxStart();
    //    param.ajaxFn();
};



//获取图片在容器内显示的实际大小
$.getNewImageSize = function (imgwidth, imgheight, objwidth, objheight) {
    var newimgwidth, newimgheight;

    if (imgwidth > 0 && imgheight > 0) {
        if (imgwidth / imgheight >= objwidth / objheight) {
            if (imgwidth > objwidth) {
                newimgwidth = objwidth;
                newimgheight = imgheight * objwidth / imgwidth;
            } else {
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        } else {
            if (imgheight > objheight) {
                newimgheight = objheight;
                newimgwidth = imgwidth * objheight / imgheight;
            } else {
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        }
    }

    return {
        width: newimgwidth,
        height: newimgheight
    }
};



//上传文件
(function () {
    var upload_file = function (opt) {
        this.inputId = opt.id;
        this.formId = opt.formId;
        this.showImageWrapId = opt.showImageWrapId;
        this.types = opt.types;
        this.serverSrc = opt.serverSrc;
        this.maxNumber = opt.maxNumber;
        this.imgs = opt.imgs;

        this.className = null;
        this.upLoadNumber = 0;

        this.init();
    };
    upload_file.prototype = {
        init: function () {
            this.addEvent();
            this.showStartImage();
        },
        //获取自身类名,必须实例化为 window.XXX
        getClassName: function () {
            for (var a in window) {
                if (window[a] === this) {
                    this.className = a;
                    break;
                }
            }
        },
        //事件绑定
        addEvent: function () {
            var _this = this;
            $("#" + this.inputId).change(function (e) {
                _this.inputChange(this, e);
            });
        },
        //检查文件类型
        checkFileType: function () {
            var value = $("#" + this.inputId).val(),
                type = value.substr(value.lastIndexOf(".") + 1).toLocaleLowerCase(),
                types = "," + this.types + ",";

            return (types.indexOf("," + type + ",") > -1);
        },
        //获取文件后
        inputChange: function () {
            if ($("#" + this.inputId).val() == "") {
                return;
            }

            var pass = this.checkFileType();

            if (!pass) {
                alert("文件格式不对");
                this.reCreateInput();
                return;
            }

            if (this.upLoadNumber >= this.maxNumber) {
                alert("只能上传" + this.maxNumber + "张图片!");
                this.reCreateInput();
                return;
            }

            this.createIframe();
        },
        //创建iframe
        createIframe: function () {
            var iframe = $("<iframe name='__bens_iframe_name__' id='__bens_iframe__' width='0' height='0' frameborder='0' ></iframe>"),
                form = $("#" + this.formId),
                t = new Date().getTime();

            this.getClassName();

            form.attr({
                target: "__bens_iframe_name__",
                action: this.serverSrc + "?class=" + this.className + "&t=" + t,
                enctype: "multipart/form-data",
                method: "post"
            });
            $("body").append(iframe);

            //            $("#"+this.inputId).wrap(form);
            //            $(form).append("<input type='text' value='123' name='test1'>");

            $.loadShow();
            form.submit();
        },
        //提交成功回调
        oldSuccess: function (rs) {
            $.loadHide();
            if (rs.State != 1) {
                //失败
                alert(rs.Message);
                this.reCreateInput();
                return;
            }

            var src = rs.Data;

            //            src = "http://localhost:8023"+src;

            src = top.AJAX.pictureUrl + src;


            this.reCreateInput();
            this.upLoadNumber++;
            $("#__bens_iframe__").remove();
            this.showImg(src);

        },
        //重新生成input
        reCreateInput: function () {
            var _this = this,
                input = $("#" + this.inputId),
                clone = input.clone();

            clone.insertBefore(input);
            input.unbind("change");
            input.remove();

            clone.change(function (e) {
                _this.inputChange(this, e);
            });
        },
        //显示图片
        showImg: function (src, callback) {
            var img = new Image(),
                _this = this;

            callback = $.getFunction(callback);


            var div = $("<div></div>");
            div.css({
                width: "128px",
                height: "150px",
                float: "left",
                margin: "0 15px"
            }).addClass("__upload_temp__");
            var div1 = $("<div></div>"),
                div2 = $("<div>删 除</div>"),
                div3 = $("<div></div>");

            div1.css({
                width: "100%",
                height: "128px"
            });
            div2.css({
                width: "100%",
                height: "22px",
                "text-align": "center",
                "line-height": "22px",
                background: "#ccc",
                cursor: "pointer"
            });
            div3.css({
                width: 0,
                height: "2px",
                background: "#f00"
            }).addClass("__upload_temp_pro__");


            div.append(div1).append(div3).append(div2);



            div2.click(function () {
                var temp_div = $(this).parent();

                _this.delOne();


                temp_div.remove();

            });

            $("#" + _this.showImageWrapId).append(div).css({ height: "160px" });
            callback();
            img.onload = function () {
                var width = img.width,
                    height = img.height,
                    new_size = $.getNewImageSize(width, height, 128, 128);

                var imgs = $("<img src='" + src + "' width = '" + new_size.width + "' height = '" + new_size.height + "' />");


                var temp_top = (128 - new_size.height) / 2,
                    temp_left = (128 - new_size.width) / 2;
                imgs.css({
                    margin: temp_top + "px " + temp_left + "px"
                });
                div1.append(imgs);

            };
            img.src = src;
        },
        //初始显示图片
        showStartImage: function () {
            var data = this.imgs,
                _this = this;

            var go = function () {
                if (data.length != 0) {
                    var this_src = data.shift();
                    _this.upLoadNumber++;
                    _this.showImg(this_src, go);
                }
            };

            go();
        },
        //删除图片
        delOne: function () {
            this.upLoadNumber--;
        }
    };

    $.uploadFile = upload_file;

})();



//JSON
if (!this.JSON) {
    this.JSON = {};
}
(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
            this.getUTCFullYear() + '-' +
            f(this.getUTCMonth() + 1) + '-' +
            f(this.getUTCDate()) + 'T' +
            f(this.getUTCHours()) + ':' +
            f(this.getUTCMinutes()) + ':' +
            f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
        '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' :
        '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is 'object', we might be dealing with an object or an array or
            // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                        partial.join(',\n' + gap) + '\n' +
                        mind + ']' :
                        '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                    mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({ '': j }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

// 将JSON 数据对象反序列化到表单中
(function ($) {
    $.deserialize = function (str, options) {
        var pairs = str.split(/&amp;|&/i),
            h = {},
            options = options || {};
        for (var i = 0; i < pairs.length; i++) {
            var kv = pairs[i].split('=');
            kv[0] = decodeURIComponent(kv[0]);
            if (!options.except || options.except.indexOf(kv[0]) == -1) {
                if ((/^\w+\[\w+\]$/).test(kv[0])) {
                    var matches = kv[0].match(/^(\w+)\[(\w+)\]$/);
                    if (typeof h[matches[1]] === 'undefined') {
                        h[matches[1]] = {};
                    }
                    h[matches[1]][matches[2]] = decodeURIComponent(kv[1]);
                } else {
                    h[kv[0]] = decodeURIComponent(kv[1]);
                }
            }
        }
        return h;
    };

    $.fn.deserialize = function (options) {
        return $.deserialize($(this).serialize(), options);
    };
})(jQuery);

// 将表单数据序列化成 JSON 对象
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


//设置URL中的参数并返回URL
$.getUrlData = function (url, json) {
    var urlString = url.split("?")[0] + "?",
        search = url.split("?")[1],
        searchs = [],
        dataName = [],
        dataValue = [],
        dataString = [],
        afterUrl = "";

    searchs = search.split("&");

    for (var i = 0, j = searchs.length; i < j; i++) {
        var data = searchs[i].split("=");
        dataName.push(data[0]);
        dataValue.push(data[1]);
    }

    for (var i = 0, j = dataName.length; i < j; i++) {
        for (var name in json) {
            if (name == dataName[i]) {
                dataValue[i] = json[name];
            }
        }
    }
    for (var i = 0, j = dataName.length; i < j; i++) {
        var str = dataName[i] + "=" + dataValue[i];
        dataString.push(str);
    }
    afterUrl = urlString + dataString.join("&");
    return afterUrl;
};


//获取地址栏参数
$.getUrlParam = function (param) {
    var find_val = "";

    var search = window.location.search;
    search = search.substr(1);
    var searchs = search.split("&");

    for (var i = 0, l = searchs.length; i < l; i++) {
        var this_val = searchs[i],
            this_keys = this_val.split("="),
            this_key = this_keys[0];

        if (this_key == param) {
            find_val = this_keys[1];
            break;
        }
    }
    return find_val;

};



//弹出居中层
(function () {
    var wrap = null,
        zz = null,
        close = null;

    $.openDiv = function (opt) {
        var div_width = parseInt(opt.width),
            div_height = parseInt(opt.height),
            title_text = opt.title,
            div = $(opt.div),
            main = $("<div></div>"),

            title = $("<div>" + title_text + "</div>");
        var close_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAFk0lEQVRIx8WVa4jdRxnGf/O/X851L9lLkt2k2d3ETdLSEiwhVuvWoFKJaCwNhEJbQou0tNRuVKJiL5jUWxW0ULSUUEiKpRUFhYoxLVRYKcZ2m22wbiLuRjebvZ7dc/ac/21m/HAOSSW0+EV85+O88zzzzjzv88L/OMSHbf6cDv5K3C8QOzQMgC4LBBqWQZ/XMDGMP3WIuf+e4H4cnuVrPMLTQ77p3BOYzki5kOvzPbfNMIQDkKZZUo/jpWq9MV1L4tOJSp+/3bhh8mX1Z54l+WCCR8mjITCF2FcOct/qbWsbasvnLMs0MUzjSp5SijTLiNOMpWo1m1upTKxG0bFUy98IqP+YtSu55lXwAhp8E+O+nlL5e4Pre/vai3nDbAHLFmiaZWRSAhrHsigEgRF6bneWyttkImsp+p09eNkY8VWCr5Dnb1RFJ97+7lLpqYHenvbQD7ByIcJzkVGEUprmAqUk2A5GGKC0wjctQt/163GyK06TC+epnrudPGMkTYJPEJLHHGr3c88M9vZsCv2A8q4b2fH41+k78EUaM5eoTV1EaY2WCrtYYPiBQ9z0xBG8ni5m3jyDq8C17aAeRVtCaZx2hLX0RyIMgGMHv4wn7HvWFYvbQt9DBD4DDx6iuHOYsL+Pjxx+mK5b9wBglwpsu/9urjt4B15nB5u+8Dmy7i6qazUKgU97Pn+9Lax7j37+SwBYoxR49MRP+ou2P9JeLJhaa6SSrcdoRrBxPcOjDyMsm9KObWw6sB/L9wGoLy6xsLiImyYEOqCcz5mLlerI4V/9on+UwpS5GxeB+FhnsXBXZ6mUU1qTRRHVyQsUhgbwu9YB4BQLrLtlN2033oDpeQBEKyuc/s73mf796xR8H4TAsSzqcWTW4vhPwKQBGtADvmt3moZASolSmsW3z3L22NPMvPYGWspmuUGAYdst8FVOPXaM8eMnaQt8DMMgyVJs08KxrU5gAMAQCASiZFmWKYRAKoXSCoVm/szbvPujZ2hcunxNh5596RXGj5+k0w8IPBetNUoqDCEQhmECJYHgSvdorUHTBNcaJSV+bzeb9+/D7Wy/hmBw7wi79n2WMPDQqiXfK0JuYaKbBBpdSdNMSiXRmiZ4Tzc7Rx9iy8E7MV33GoLSpn72PPlN1o98HAyBUgqBaF5OKQlU3l/B+Xocz6dSYgiB4fvsPPwQGz5zG8JqNnujssIfnniK9379W7RUAOT6NnL9Iw/gbliPzDIcyyJNU6I4mQfOA1ga0DCxutaYbiRJd+A4ZK5N287tCMtqfmhlhVOPHeWt515gcPswgeuyYe8nEaZJeesgcRCSZRmubdOIE+qNZFrDBGjMMWJeveXAymtT57ZYmLtL+Zwh04QkiigPb0VpzalvH2X8+RN0hiFGvc7Cu+fI9XZTuG4zF069zpkXXqRoGPiey+zislyO6idGb/7UK/v/Nd50069SJEUO5W3vl1t6ureXcyF1mWH2bWQ5iZn9yzgdvo/vuU0hKEnQ04XsWMfM5CTG/BKbe7qo1Nb4x9zcW7U0vtPBmvwulaYX3YzDLLUlX1lLSZre6rteEDoO9UuzpJfnyHsujm3TFFpTJ9HKKo2L/6SgBd3tbdSiiIvzCwtrSfKNGepvhFhXzW6MhE+TR6MvxGm2FsXJR23L9Au5EN/zEKKpEqU1WmuEIfAch2IuR+B7VGo1Ls4vLFWj6EkNJ4s46Q+p/uc8GCNhD16m4Wws08m1ejQYx2mHaZqGa9uErk/oe4Seh2c7CGHQiGMuLy6ns8uVd9aS5IiGFwU0fsDqB4/MB/G5iY1MMDNoCuNex7BGcp7X5zp2m2kYDgIyKZMkSZdqUTydqOx3mVbHj7D374/zKj+l8eEz+f3xM9p5j7Qf9I6Wt5Rbx5ZbOp/Yij11H4v83+Lf7X5w5qpkSpcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTMtMDQtMDNUMTc6MTg6MDIrMDg6MDDjrwpDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEyLTA4LTA1VDIyOjUwOjI1KzA4OjAwc0Az8QAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtNyBRMTYgeDg2XzY0IDIwMTQtMDItMjggaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmdZpF9/AAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAAzMij0+PQAAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMzLQWzh5AAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADEzNDQxNzgyMjXFjXX8AAAAE3RFWHRUaHVtYjo6U2l6ZQAxLjc0S0JCSSPL9gAAAGJ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvZnRwLzE1MjAvZWFzeWljb24uY24vZWFzeWljb24uY24vY2RuLWltZy5lYXN5aWNvbi5jbi9wbmcvMTA3OTEvMTA3OTEyMi5wbmdGbcMeAAAAAElFTkSuQmCC";

        close = $("<div></div>");
        wrap = $("<div></div>");
        zz = $("<div></div>");

        wrap.css({
            width: div_width + "px",
            height: div_height + "px",
            position: "fixed",
            left: "50%",
            top: "50%",
            "margin-top": -(div_height + 60) / 2 + "px",
            "margin-left": -(div_width + 30) / 2 + "px",
            background: "#fff",
            padding: "30px 0 30px 30px",
            "z-index": 100
        });

        main.css({
            "overflow-y": "auto",
            "overflow-x": "hidden",
            width: div_width + "px",
            height: div_height + "px"
        });

        close.css({
            width: "24px",
            height: "24px",
            background: "url('" + close_img + "')",
            position: "absolute",
            top: "2px",
            right: "2px",
            cursor: "pointer"
        });

        title.css({
            width: (div_width) + "px",
            height: "30px",
            "line-height": "30px",
            position: "absolute",
            left: 0,
            top: 0,
            "padding-right": "30px",
            "border-bottom": "1px solid #999",
            "text-indent": "1em",
            "overflow": "hidden",
            "white-space": "nowrap",
            "-o-text-overflow": "ellipsis",
            "text-overflow": "ellipsis",
            "-moz-bindings": "url('ellipsis.xml#ellipsis')"
        });


        zz.css({
            width: "100%",
            height: "100%",
            background: "#000",
            opacity: 0,
            position: "fixed",
            left: 0,
            top: 0,
            "z-index": 99
        });

        main.append(div).append(title).append(close);
        wrap.append(main);

        $("body").append(zz).append(wrap);
        zz.animate({
            opacity: 0.3
        }, 800);


        close.click(function () {
            $.closeDiv();
        });
        zz.click(function () {
            $.closeDiv();
        });

    };
    $.closeDiv = function () {
        if (close) {
            close.unbind("click");
            zz.unbind("click");
            zz.remove();
            wrap.remove();
        }
        close = null;
        wrap = null;
        zz = null;
    }
})();

////弹出框
//$.dialog({
//    //弹出框标题
//    title:"",
//    //弹出框类型   @param  ajax(根据ajax路径完成ajax请求)  html(对弹出框填充html内容)
//    dialogtype:"ajax",
//    //ajax地址
//    ajaxurl:"",
//    //ajax类型
//    ajaxtype:"",
//    //ajax参数集合
//    ajaxparam:{},
//    //html内容
//    content:"",
//    //dialog宽度
//    width:"",
//    //dialog高度
//    height:"",
//    //ajax成功回调
//    ajaxcallback:function(){},
//    //打开窗口前的回调函数
//    beforecallback:function(){},
//    //关闭窗口后的回调函数
//    closecallback:function(){}
//    //确定按钮回调事件
//    surecallback:function(){}
//});

$.extend({
    //$.message({
    //    type:"warning",
    //    skin:1,
    //    str:"错误信息提示",
    //    callback:function(){}
    //});
    //
    //信息提示框
    // type  可选择为成功（success）、错误(error)、信息(info)、警告(warning) skin 等于0 时没有warning类型
    // skin  可选择为0（不带关闭按钮的提示框）  1(带关闭按钮的提示框)
    message: function (settings) {
        var type = settings.type || "success",
            skin = settings.skin || 0,
            str = settings.str || "信息提示",
            callback = settings.callback || null;

        var message = {
            zoom: null,
            main: null,
            //初始化
            init: function () {
                if (skin == 0) {
                    this.createDomType0()
                } else {
                    this.createDomType1();
                }
            },
            //创建外层遮罩层
            createZoom: function () {
                this.zoom = $("<div></div>");
                var topcss = {
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: "100%",
                    height: "100%",
                    "z-index": 99998,
                    "background-color": "rgba(0, 0, 0, 0.2)"
                };
                this.zoom.css(topcss);
                $("body").append(this.zoom);
            },
            //创建skin0
            createDomType0: function () {

                this.createZoom();

                var color = [],
                    positon = "" || "0px 0px";
                this.main = $("<div></div>");

                switch (type) {
                    case "success":
                        color = ["#acbe99", "#e7ffce"];
                        positon = "-310px -12px";
                        break;
                    case "error":
                        color = ["#e9dca8", "#fffbce"];
                        positon = "-280px -12px";
                        break;
                    case "info":
                        color = ["#9fbed6", "#d3f2ff"];
                        positon = "-247px -12px";
                        break;
                }
                var css = {
                        position: "fixed",
                        left: "50%",
                        top: "50%",
                        width: "288px",
                        height: "30px",
                        "margin-top": "-15px",
                        "margin-left": "-145px",
                        "line-height": "30px",
                        "text-align": "center",
                        "border-radius": "5px",
                        border: "1px solid " + color[0],
                        "background-color": color[1],
                        "z-index": "99999",
                        "overflow": "hidden",
                        "opacity": 0
                    },
                    iCss = {
                        "float": "left",
                        "width": "24px",
                        "height": "24px",
                        "margin": "3px 10px",
                        "background-image": "url(../../data-images/messageimg.png)",
                        "background-position": positon
                    },
                    spanCss = {
                        "float": "left",
                        "width": "240px",
                        "height": "30px",
                        "line-height": "30px",
                        "text-align": "left",
                        "overflow": "hidden"
                    };

                this.main.css(css);

                var oI = $("<i></i>"),
                    oSpan = $("<span>" + str + "</span>");
                oI.css(iCss);
                oSpan.css(spanCss);
                this.main.append(oI).append(oSpan);

                this.zoom.append(this.main);
                var _this = this;


                this.main.animate({
                    "top": "220px",
                    "opacity": 1
                }, 500, function () {
                    setTimeout(function () {
                        _this.main.animate({
                            "top": "280px",
                            "opacity": 0
                        }, 500, function () {
                            _this.zoom.remove();
                            callback && callback();
                        });
                    }, 1000)
                })


            },
            //创建skin1
            createDomType1: function () {
                this.createZoom();

                var positon = "" || "0px 0px";
                this.main = $("<div></div>");

                switch (type) {
                    case "success":
                        positon = "0px 0px";
                        break;
                    case "error":
                        positon = "-58px 0px";
                        break;
                    case "info":
                        positon = "-116px 0px";
                        break;
                    case "warning":
                        positon = "-178px 0px";
                }
                var css = {
                        position: "fixed",
                        left: "50%",
                        top: "50%",
                        width: "548px",
                        height: "108px",
                        "margin-top": "-54px",
                        "margin-left": "-295px",
                        "line-height": "30px",
                        "text-align": "center",
                        "border-radius": "5px",
                        "background-color": "#fff",
                        "z-index": "99999",
                        "overflow": "hidden",
                        "opacity": 1,
                        "box-shadow": "0 0 10px rgba(0,0,0,.4)"
                    },
                    iCss = {
                        "float": "left",
                        "width": "48px",
                        "height": "48px",
                        "margin": "30px 20px",
                        "background-image": "url(../../data-images/messageimg.png)",
                        "background-position": positon
                    },
                    spanCss = {
                        "float": "left",
                        "width": "440px",
                        "height": "60px",
                        "margin": "24px 0",
                        "line-height": "60px",
                        "text-align": "left",
                        "overflow": "hidden"
                    },
                    aCss = {
                        position: "absolute",
                        width: "10px",
                        height: "10px",
                        right: "10px",
                        top: "10px",
                        "background": "url(../../data-images/messageimg.png) no-repeat right top"
                    };

                this.main.css(css);
                var oI = $("<i></i>"),
                    oSpan = $("<span>" + str + "</span>"),
                    oA = $("<a href='javascript:;'></a>");
                oI.css(iCss);
                oSpan.css(spanCss);
                oA.css(aCss);
                this.main.append(oI).append(oSpan).append(oA);

                this.zoom.append(this.main);

                var _this = this;
                oA.on("click", function () {
                    _this.zoom.remove();
                    callback && callback();
                });
            }

        };
        message.init();
    },
    dialog: function (settings) {

        var title = settings.title || "标题",
            type = settings.dialogtype || "html",
            url = settings.ajaxurl || "",
            ajaxtype = settings.ajaxtype || "get",
            ajaxparam = settings.ajaxparam || {},
            content = settings.content || "",
            width = settings.width || 600,
            height = settings.height || 400,
            ajaxFn = settings.ajaxcallback || null,
            beforeFn = settings.beforecallback || null,
            sureFn = settings.surecallback || null,
            closeFn = settings.closecallback || null;

        var dialogObj = {
            zoom: null,
            main: null,
            cont: null,
            oTitle: null,
            oBottom: null,
            init: function () {
                beforeFn && beforeFn();
                this.createDom();
            },
            createDom: function () {
                var body = $("body");

                this.oTitle = $("<div><h3 style=' float:left; margin: 0; padding-left: 20px;'>" + title + "</h3><i class='iconfont icon-close01' style='float: right; width: 39px; height: 39px; text-align: center; font-size: 24px; cursor: pointer;'></i></div>");
                this.oBottom = $("<div><a href='javascript:;' class='dia-sure' style='background-color: #00aaff;'>确定</a><a href='javascript:;' class='dia-cancel' style='background-color: #c94a4a;'>取消</a></div>");

                this.zoom = $("<div></div>");
                this.main = $("<div></div>");
                this.cont = $("<div></div>");

                var zoomCss = {
                        position: "absolute",
                        left: "0px",
                        top: "0px",
                        width: "100%",
                        height: "100%",
                        "z-index": 98,
                        "background-color": "#000",
                        "opacity": .4,
                        "alpha": "filter(opacity=40)"
                    },
                    mainCss = {
                        position: "fixed",
                        left: "50%",
                        top: "50%",
                        width: width,
                        height: height,
                        "margin-left": -width / 2,
                        "margin-top": -height / 2,
                        "z-index": 99,
                        "background-color": "#fff",
                        "border-radius": "5px"
                    },
                    titleCss = {
                        "width": "100%",
                        "height": "39px",
                        "line-height": "39px",
                        "border-top-left-radius": "5px",
                        "border-top-right-radius": "5px",
                        "background-color": "#f1f1f1",
                        "border-bottom": "1px solid #ccc",
                        "overflow": "hidden"
                    },
                    bottomCss = {
                        "width": "100%",
                        "height": "39px",
                        "position": "absolute",
                        "left": 0,
                        "bottom": 0,
                        "text-align": "center",
                        "border-top": "1px solid #ccc"
                    },
                    aCss = {
                        "height": "30px",
                        "line-height": "30px",
                        "display": "inline-block",
                        "margin": "5px 0",
                        "padding": "0 15px",
                        "margin-right": "20px",
                        "color": "#fff",
                        "border-radius": "5px"
                    },
                    contentCss = {
                        width: width - 20,
                        height: height - 100,
                        padding: "10px",
                        overflow: "hidden",
                        position: "relative",
                        "overflow-y":"scroll"
                    };


                this.oTitle.css(titleCss);
                this.cont.css(contentCss);
                this.oBottom.css(bottomCss);
                this.oBottom.find("a").css(aCss);
                this.zoom.css(zoomCss);
                this.main.css(mainCss);

                this.main.append(this.oTitle);
                this.main.append(this.cont);
                this.main.append(this.oBottom);
                body.append(this.main).append(this.zoom);


                if (type == "html") {
                    this.fillHTML();
                } else {
                    this.loadAJAX();
                }
                this.bindEvent();
            },
            fillHTML: function () {
                this.cont.html(content);
            },
            loadAJAX: function () {
                var _this = this;

                $.loadShow();
                $.ajax({
                    url: url,
                    type: ajaxtype,
                    data: ajaxparam,
                    success: function (rs) {
                        $.loadHide();
                        ajaxFn && ajaxFn(rs, _this.cont,_this);
                    }
                });
            },
            closeMain: function () {
                this.main.remove();
                this.zoom.remove();
            },
            bindEvent: function () {
                var _this = this;

                this.oTitle.on("click", "i", function () {
                    _this.closeMain();
                    closeFn && closeFn();
                });

                this.oBottom.on("click", ".dia-sure", function () {
                    // _this.main.remove();
                    //_this.zoom.remove();
                    sureFn && sureFn(_this);
                });

                this.oBottom.on("click", ".dia-cancel", function () {
                    _this.closeMain();
                    closeFn && closeFn();
                });
            }
        };
        dialogObj.init();
    }
});


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Array.prototype.distinct = function () {
    var sameObj = function (a, b) {
        var tag = true;
        if (!a || !b) return false;
        for (var x in a) {
            if (!b[x])
                return false;
            if (typeof (a[x]) === 'object') {
                tag = sameObj(a[x], b[x]);
            } else {
                if (a[x] !== b[x])
                    return false;
            }
        }
        return tag;
    }
    var newArr = [], obj = {};
    for (var i = 0, len = this.length; i < len; i++) {
        if (!sameObj(obj[typeof (this[i]) + this[i]], this[i])) {
            newArr.push(this[i]);
            obj[typeof (this[i]) + this[i]] = this[i];
        }
    }
    return newArr;
};



$.fn.province_city_county = function (xml_src, v_province, v_city, v_county, v_id) {
    var _self = this;
    //插入3个空的下拉框
    _self.html("<select id='province' name='province'></select>&nbsp;&nbsp;&nbsp;" +
        "<select id='city' name='city'></select>&nbsp;&nbsp;&nbsp;" +
        "<select id='county' name='county' ></select>");
    //分别获取3个下拉框
    var sel1 = _self.find("select").eq(0);
    var sel2 = _self.find("select").eq(1);
    var sel3 = _self.find("select").eq(2);

    //定义3个默认值
    _self.data("province", ["请选择", "0"]);
    _self.data("city", ["请选择", "0"]);
    _self.data("county", ["请选择", "0"]);
    //默认省级下拉
    if (_self.data("province")) {
        sel1.append("<option value='" + _self.data("province")[1] + "'>" + _self.data("province")[0] + "</option>");
    }
    //默认城市下拉
    if (_self.data("city")) {
        sel2.append("<option value='" + _self.data("city")[1] + "'>" + _self.data("city")[0] + "</option>");
    }
    //默认县区下拉
    if (_self.data("county")) {
        sel3.append("<option value='" + _self.data("county")[1] + "'>" + _self.data("county")[0] + "</option>");
    }
    $.get(xml_src, function (data) {
        //只传入最后一个id  反推前面的id
        if (v_id) {
            v_county = v_id;
            v_city = $(data).find("#" + v_id).parent().attr("id");
            v_province = $(data).find("#" + v_id).parent().parent().attr("id");
        }



        var arrList = [];
        $(data).find('province').each(function () {
            var $province = $(this);
            sel1.append("<option value='" + $province.attr('id') + "'>" + $province.attr('name') + "</option>");
        });
        if (typeof v_province != 'undefined' && v_province != 0) {
            sel1.val(v_province);
            $("#TopRegionId").val(v_province);//给TopRegionId赋值
            sel1.change();
        }
    });

    //省级联动控制
    var index1 = "";
    var provinceValue = "";
    var cityValue = "";
    sel1.change(function () {
        //清空其它2个下拉框
        sel2[0].options.length = 0;
        sel3[0].options.length = 0;
        index1 = this.selectedIndex;
        if (index1 == 0) { //当选择的为 "请选择" 时
            if (_self.data("city")) {
                sel2.append("<option value='" + _self.data("city")[1] + "'>" + _self.data("city")[0] + "</option>");
            }
            if (_self.data("county")) {
                sel3.append("<option value='" + _self.data("county")[1] + "'>" + _self.data("county")[0] + "</option>");
            }
        } else {
            provinceValue = $('#province').val();
            $("#TopRegionId").val(provinceValue);//给TopRegionId赋值
            $.get(xml_src, function (data) {
                $(data).find("province[id='" + provinceValue + "'] > city").each(function () {
                    var $city = $(this);
                    sel2.append("<option value='" + $city.attr('id') + "'>" + $city.attr('name') + "</option>");
                });
                cityValue = $("#city").val();
                $("#RegionId").val(cityValue);//给RegionId赋值
                $(data).find("city[id='" + cityValue + "'] > county").each(function () {
                    var $county = $(this);
                    sel3.append("<option value='" + $county.attr('id') + "'>" + $county.attr('name') + "</option>");
                });

                if (typeof v_city != 'undefined' && v_city != 0) {
                    sel2.val(v_city);
                    $("#RegionId").val(v_city);//给RegionId赋值
                    if ($(sel2).find("option:selected").val() == undefined) {
                        $(sel2).find('option:first').prop('selected', 'selected');
                    }
                    sel2.change();
                }

                if (typeof v_county != 'undefined' && v_county != 0) {
                    sel3.val(v_county);
                    $("#RegionId").val(v_county);//给RegionId赋值
                }
            });
        }
    }).change();

    //城市联动控制
    sel2.change(function () {
        //sel3[0].options.length = 0;
        var cityValue2 = sel2.val();//$('#cityValue2').val();
        if (cityValue2 > 0) {
            sel3[0].options.length = 0;
        }
        $.get(xml_src, function (data) {
            var iscounty = false;
            $(data).find("city[id='" + cityValue2 + "'] > county").each(function () {
                var $county = $(this);
                sel3.append("<option value='" + $county.attr('id') + "'>" + $county.attr('name') + "</option>");
                iscounty = true;
            });
            if (typeof v_county != 'undefined' && v_county != 0) {
                sel3.val(v_county);
                if ($(sel3).find("option:selected").val() == undefined) {
                    $(sel3).find('option:first').prop('selected', 'selected');
                }
            }
            if (iscounty) {
                $("#RegionId").val($(sel3).val());//给RegionId赋值
            }
            else {
                $("#RegionId").val(sel2.val());//给RegionId赋值
            }
        });
    }).change();

    //区联动控制
    sel3.change(function () {
        countyValue = $('#county').val();
        $("#RegionId").val(countyValue);//给RegionId赋值
    })

    return _self;
};

//loading
//$.loadShow();
//$.loadHide();
(function(){
    var zz = null,
        zz_main = null,
        load_gif = "../../image/load.gif";

    var show = function(obj){

        obj=obj || $("body");

        zz = $("<div class='gzoom'></div>");
        var css = {
            position:"absolute",
            left:0,
            top:0,
            width:"100%",
            height:"100%",
            "background-color":"rgba(0,0,0,0.2)",
            "z-index":99998
        };

        var css2={
            position:"absolute",
            left:"50%",
            top:"50%",
            "margin-left":"-100px",
            "margin-top":"-30px",
            width:"200px",
            height:"60px",
            "line-height":"60px",
            background:"#fff",
            opacity:1,
            "z-index":99999,
            color:"#333",
            "text-align":"center",
            "box-shadow":"0px 0px 5px rgba(0,0,0,.8)"
        };

        zz.css(css);

        zz_main = $("<div>正在读取数据......</div>");
        //var img = $("<img src='"+load_gif+"'>");
        //img.css({
        //    width:"100px",
        //    height:"100px",
        //    position:"absolute",
        //    top:"50%",
        //    left:"50%",
        //    "margin-left":"-50px",
        //    "margin-top":"-50px"
        //});
        zz_main.css(css2);
        //zz_main.append(img);
        zz.append(zz_main);
        if(obj.find(".zoom").length<1){
            obj.append(zz);
        }

        //zz.animate({
        //    "opacity":".4"
        //},1000)
    };
    var hide = function(obj){
        obj=obj || $("body");
        if(obj.find(".gzoom").length>0){
            obj.find(".gzoom").remove();
            //zz.remove();
            //zz_main.remove();
            //zz = null;
            //zz_main = null;
        }
    };

    $.loadShow = show;
    $.loadHide = hide;
})();


//$("#configAttr").configAttrTable({
//    data:[
//        { name:{key:"1",keyvalue:"sd1"}, values: [{key:"101",keyvalue:"1001",isSelected:true},{key:"102",keyvalue:"1002",isSelected:true},{key:"103",keyvalue:"1003",isSelected:false}]},
//        { name:{key:"2",keyvalue:"sd2"}, values: [{key:"201",keyvalue:"2001",isSelected:true},{key:"202",keyvalue:"2002",isSelected:false},{key:"203",keyvalue:"2003",isSelected:false}] },
//        { name:{key:"3",keyvalue:"sd3"}, values: [{key:"301",keyvalue:"3001",isSelected:false},{key:"302",keyvalue:"3002",isSelected:false},{key:"303",keyvalue:"3003",isSelected:false}] }
//    ],
//    priceData:[
//        {resultkey:[101,201],reusltvalues:[1,2,3]},
//        {resultkey:[102,201],reusltvalues:[4,null,5]}
//    ]
//});

//创建商品属性表格
$.fn.configAttrTable = function (settings) {
    return this.each(function () {
        var body = $(this),
            data = settings.data || [],
            resultPrice=settings.priceData || [];

        var config = {
            dataList: [],
            columncount: 0,
            rowcount: 0,
            init: function () {
                this.createDom();
                this.bindEvent();
            },
            createDom: function () {
                for (var i = 0, j = data.length; i < j; i++) {
                    var oDiv = $("<div class='configchose' dataname='" + data[i].name.keyvalue + "'></div>"),
                        oList = $("<div class='configlistbox'></div>"),
                        idName = data[i].name;

                    oDiv.append($("<h3 dataid='" + data[i].name.key + "'>" + data[i].name.keyvalue + "</h3>")).append(oList);

                    for (var n = 0, m = data[i].values.length; n < m; n++) {
                        var oSingle=$("<div class='configsingle'></div>"),
                            oCheck=$("<input type='checkbox' name='" + data[i].name.key + "' parentid='" + data[i].name.key + "' id='" + data[i].values[n].key + "'>"),
                            oLabel=$("<label for='" + data[i].values[n].key + "'>" + data[i].values[n].keyvalue + "</label>");

                        if(data[i].values[n].isSelected){
                            oCheck[0].checked="true";
                        }else{
                            oCheck[0].checked="";
                        }
                        oSingle.append(oCheck).append(oLabel);
                        oList.append(oSingle);
                    }
                    oDiv.insertBefore(body.find("table"));
                }
                this.creatDataList();
            },
            creatDataList:function(){
                var _this=this;

                _this.dataList = [];
                body.find(".configchose").each(function () {
                    var json = { name: "", values: [] };
                    json.name = $(this).attr("dataname");

                    $(this).find("input[type='checkbox']").each(function () {
                        if ($(this)[0].checked) {
                            var chelJson = { parentid: $(this).attr("parentid"), key: $(this).attr("id"), keyvalue: $(this).next().text() };
                            json.values.push(chelJson)
                        }
                    });
                    if ($(this).find("input:checked").length > 0) {
                        _this.dataList.push(json);
                    }
                });
                if (_this.dataList.length > 0) {
                    _this.GetBody(body.find("table"));
                } else {
                    body.find("table thead tr").html("");
                    body.find("table tbody").html("");
                }

            },
            bindEvent: function () {
                var _this = this;
                body.on("click", "input[type='checkbox']", function () {
                    _this.creatDataList();
                });
            },
            GetColumnCount: function () {
                return this.dataList.length;
            },
            GetRowCount: function () {
                var len = this.GetColumnCount(),
                    res = 1;
                for (var i = 0; i < len; i++) {
                    var vl = this.dataList[i].values.length;
                    res = vl * res;

                }
                return res;
            },
            GetColumnValue: function (rowindex, columnIndex) {
                var value = this.dataList[columnIndex].values,
                    nexColumn = this.GetColumnIndexCount(columnIndex),
                    ic = 0,
                    name = "";
                if (nexColumn == 0) {
                    ic = parseInt(rowindex % value.length);
                    name = value[ic].keyvalue;

                    return { name: name, key: value[ic].key, parentid: value[ic].parentid };
                } else {
                    ic = parseInt(rowindex / nexColumn);
                    name = value[ic % value.length].keyvalue;

                    return { name: name, key: value[ic% value.length].key, parentid: value[ic% value.length].parentid };
                }

            },
            GetColumnIndexCount: function (columnIndex) {
                var len = this.GetColumnCount(),
                    res = 1,
                    j = -1;
                for (var i = columnIndex + 1; i < len; i++) {
                    var vl = this.dataList[i].values.length;
                    res = vl * res;
                    j = j + 1;
                }
                if (j == -1) {
                    return 0;
                }
                return res;
            },
            GetBody: function (obj) {
                this.columncount = this.GetColumnCount();
                this.rowcount = this.GetRowCount();
                obj.find("thead tr").html("");
                obj.find("tbody").html("");
                for (var n = 0, m = this.dataList.length; n < m; n++) {
                    obj.find("thead tr").append($("<th>" + this.dataList[n].name + "</th>"));
                }
                obj.find("thead tr").append($("<th class='price'>价格</th><th>商家编码</th><th>库存</th>"));
                for (var i = 0; i < this.rowcount; i++) {
                    var keyArr=[],
                        oTr = $("<tr></tr>"),
                        oCom = $("<td class='price'><input type='text' name='Skus[" + i + "].Price'></td><td><input type='text' name='Skus[" + i + "].OutId'></td><td><input type='text' name='Skus[" + i + "].Num'></td>");

                    for (var j = 0; j < this.columncount; j++) {
                        var property = this.GetColumnValue(i, j),
                            oTd = $("<td>" + property.name + "<input type='hidden' name='Skus[" + i + "].SelectPropertyValues[" + j + "].ValueIDs' value='" + property.key + "'></td>"),
                            oInput = $("<input type='hidden' value='" + property.parentid + "' name='Skus[" + i + "].SelectPropertyValues[" + j + "].PropertyID'>"),
                            rowCount = this.GetColumnIndexCount(j);

                        keyArr.push(property.key);
                        oCom.eq(0).attr("resultArr",keyArr);

                        if (i % rowCount == 0) {
                            oTd.attr({
                                "rowspan": rowCount
                            });
                            oTr.append(oTd);
                        } else if (rowCount == 0) {
                            oTr.append(oTd);
                        }

                        oTr.append(oInput);
                    }
                    oTr.append(oCom);
                    obj.append(oTr);
                }
                if(resultPrice.length>0){
                    if(resultPrice[0].resultkey.length == this.dataList.length){
                        this.fillRsultData();
                    }
                }
            },
            fillRsultData:function(){
                for(var i= 0,j=resultPrice.length;i<j;i++){
                    var strValue=resultPrice[i].reusltvalues,
                        strArr=resultPrice[i].resultkey,
                        str=strArr.join(",");

                    body.find("tbody .price").each(function(){
                        var dataArr=$(this).attr("resultarr");

                        if(str == dataArr){
                            $(this).find("input").val(strValue[0] || "");
                            $(this).next().find("input").val(strValue[1] || "");
                            $(this).next().next().find("input").val(strValue[2] || "");
                        }
                    });
                }
            }
        };
        config.init();
    });
};
