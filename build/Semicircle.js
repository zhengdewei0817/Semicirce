'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * 需要将存放的容器设定固定宽高
 * 代码结构
 * 初始化init方法
 * 设置旋转角度setAngle(val) val单位角度
 * 判断是否为IE8及其以下浏览器 即是否支持SVG isSVG方法
 * 如果支持SVG则继续使用svg 如果不支持 则使用vml
 * 关于动态创建vml参考http://codex.wiki/post/195107-113
 * 代码逻辑
 * init-->判断是否支持svg-->创建svg元素或者创建html空间命名
 * -->创建背景-->创建动态元素-->
 * svg的html结构
 * svg
 *    <path>
 *    <path>
 *    <g>
 *        <line>
 *    <g>
 *        <line>
 *            .........
 */

//const TC = require('../lib/TC');

var ZDWSEMICIRCLE_CONFIG = {
    svgname: 'http://www.w3.org/2000/svg', //SVG命名空间
    R: 65, //圆环半径
    width: 200, //svg宽度
    height: 200, //svg高度
    strokeWidth: 21, //圆环宽度
    bgColor: 'rgb(200,200,200)', //创建背景颜色
    color: '#fb6669', //前置元素颜色
    pointColor: 'rgb(200,200,200)', //默认点的颜色
    pointNum: 20, //默认点数量
    pointLong: 5, //默认点的长度
    pointWidth: 2, //默认点的宽度
    speed: 16, //播放速度，单位毫秒
    isShowNum: false //是否显示文字信息
};

var Semicircle = function () {
    function Semicircle(el) {
        _classCallCheck(this, Semicircle);

        this.el = $(el);
        this.curAng = 0; //当前角度 在init中需要判断当前浏览器 确定初始值
        this.dis = 1; //此参数在svg中使用
        this.Mycontainer = {}; //盛放元素的容器
        this.bgElement = {}; //设置背景元素
        this.beforeElement = {}; //创建前置元素
        this.isSVGBool = true; //是否支持svg
        this.pointsArr = []; //盛放点的数组
        this.isSVGBool = false;
        this.setIntervalid; //定时器
        this.lastAng = 0; //最终角度
        this.PNumArr = []; //显示文字的存放数组
    }

    _createClass(Semicircle, [{
        key: 'setConfig',
        value: function setConfig(config) {
            this.config = $.extend({}, ZDWSEMICIRCLE_CONFIG, config);
            return this;
        }
    }, {
        key: 'init',
        value: function init() {
            if (this.isSVG()) {
                //如果支持svg
                this.isSVGBool = true;
            }
            this.createPNum();
            this.createElementByZDW(this.isSVGBool);
            this.addBG(this.isSVGBool);
            this.addbeforeElem(this.isSVGBool);
            return this;
        }

        //创建svg元素

    }, {
        key: 'createElementByZDW',
        value: function createElementByZDW(_isSVG) {
            if (_isSVG) {
                this.Mycontainer = this.createTag('svg');
                this.el.append(this.Mycontainer);
                this.Mycontainer.setAttribute('width', this.config.width);
                this.Mycontainer.setAttribute('height', this.config.height);
                return this;
            }
            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
            var sty = document.createElement('style');
            sty.type = 'text/css';
            sty.styleSheet.cssText = 'v\\:arc{behavior: url(#default#VML);}v\\:line{behavior: url(#default#VML);';
            var hd = document.getElementsByTagName('head')[0];
            hd.appendChild(sty);
            //this.Mycontainer = document.createElement('<v:shape><v:shape>');
            //this.el.append(this.Mycontainer);
            this.Mycontainer = document.createElement('div');
            $(this.Mycontainer).css({
                'position': 'relative',
                'left': this.config.strokeWidth / 2 + this.config.pointLong + 5,
                'top': this.config.strokeWidth / 2 + this.config.pointLong + 5,
                'width': this.config.width,
                'height': this.config.height
            });
            this.el.append(this.Mycontainer);
            return this;
        }

        /**
         * 创建前置元素
         * @param _isSVG
         * @returns {Semicircle}
         */

    }, {
        key: 'addbeforeElem',
        value: function addbeforeElem(_isSVG) {
            if (_isSVG) {
                this.beforeElement = this.createTag('path');
                this.Mycontainer.appendChild(this.beforeElement);
                this.beforeElement.setAttribute('stroke', this.config.color);
                this.beforeElement.setAttribute('stroke-width', this.config.strokeWidth);
                this.beforeElement.setAttribute('fill', 'none');
                this.beforeElement.setAttribute('transform', 'matrix(0,1,1,0,' + (this.config.strokeWidth / 2 + this.config.pointLong + 5) + ',' + (this.config.strokeWidth / 2 + this.config.pointLong + 5) + ')');
                return this;
            }
            this.beforeElement = document.createElement('<v:arc><v:arc>');
            this.Mycontainer.appendChild(this.beforeElement);
            this.beforeElement.startangle = -90;
            this.beforeElement.strokeWeight = this.config.strokeWidth + 'px';
            this.beforeElement.strokeColor = this.config.color;
            this.beforeElement.endangle = -90;
            this.beforeElement.fillcolor = 'none';
            $(this.beforeElement).css({
                'z-index': 2,
                'left': 0,
                'width': this.config.R * 2 + 'px',
                'position': 'absolute',
                'top': '0',
                'height': this.config.R * 2 + 'px'
            });
        }

        /**
         * 创建P标签
         */

    }, {
        key: 'createPNum',
        value: function createPNum() {
            var p = document.createElement('p');
            $(p).css({
                position: 'relative',
                top: '100px',
                left: '-8px'
            });
            this.el.append(p);
            this.PNumArr.push($(p));
        }
        /**
         * 添加背景
         * @param _isSVG
         * @returns {Semicircle}
         */

    }, {
        key: 'addBG',
        value: function addBG(_isSVG) {
            if (_isSVG) {
                this.bgElement = this.createTag('path');
                this.Mycontainer.appendChild(this.bgElement);
                this.bgElement.setAttribute('stroke', this.config.bgColor);
                this.bgElement.setAttribute('stroke-width', this.config.strokeWidth);
                this.bgElement.setAttribute('fill', 'none');
                this.bgElement.setAttribute('transform', 'matrix(0,1,1,0,' + (this.config.strokeWidth / 2 + this.config.pointLong + 5) + ',' + (this.config.strokeWidth / 2 + this.config.pointLong + 5) + ')');
                this.setAngle(180, this.bgElement, true);
                //-----创建周边的点--------
                for (var i = 0; i < this.config.pointNum; i++) {
                    var testg = this.createTag('g');
                    var testline = this.createLine(this.config.pointLong, this.config.pointWidth, this.config.pointColor);
                    testg.appendChild(testline);
                    this.Mycontainer.appendChild(testg);
                    this.pointsArr.push(testg);
                }
                this.setPointInit(_isSVG);
                return this;
            }
            this.bgElement = document.createElement('<v:arc><v:arc>');
            this.Mycontainer.appendChild(this.bgElement);
            this.bgElement.startangle = -90;
            this.bgElement.strokeWeight = this.config.strokeWidth + 'px';
            this.bgElement.strokeColor = this.config.bgColor;
            this.bgElement.endangle = 90;
            this.bgElement.fillcolor = 'none';
            $(this.bgElement).css({
                'z-index': 1,
                'left': 0,
                'width': this.config.R * 2 + 'px',
                'position': 'absolute',
                'top': '0',
                'height': this.config.R * 2 + 'px'
            });
            for (var _i = 0; _i < this.config.pointNum; _i++) {
                var _testg = document.createElement('<v:line><v:line>');
                _testg.strokeWeight = this.config.pointWidth + 'px';
                // this.getNewPos(testg,0);
                this.Mycontainer.appendChild(_testg);
                $(_testg).css({ 'left': 0 });
                this.pointsArr.push(_testg);
                _testg.strokeColor = this.config.bgColor;
            }
            this.setPointInit(_isSVG);
            return this;
        }

        /**
         * 创建标签
         * @param _name
         * @returns {Element}
         */

    }, {
        key: 'createTag',
        value: function createTag(_name) {
            return document.createElementNS(ZDWSEMICIRCLE_CONFIG.svgname, _name);
        }

        /**
         * 创建横线标签
         * @param _long
         * @param _strokewidth
         * @param _color
         * @returns {*|Element}
         */

    }, {
        key: 'createLine',
        value: function createLine(_long, _strokewidth, _color) {
            var _line = this.createTag('line');
            _line.setAttribute('x1', 0);
            _line.setAttribute('y1', -_long / 2);
            _line.setAttribute('x2', 0);
            _line.setAttribute('y2', _long / 2);
            _line.setAttribute('stroke-width', _strokewidth);
            _line.setAttribute('stroke', _color);
            return _line;
        }

        /**
         * 设置角度以及颜色
         * @param _ang
         * @param _ele
         * @param _isBG
         * @returns {Semicircle}
         */

    }, {
        key: 'setAngle',
        value: function setAngle(_ang) {
            var _ele = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

            if (this.isSVG()) {
                //如果支持svg
                var _pos = Math.floor(_ang / 180 * this.config.pointNum);
                _ang = -1 * _ang + 270;
                if (_ele === 1) {
                    _ele = this.beforeElement;
                }
                if (_ang < 90) {
                    this.dis = 1;
                } else {
                    this.dis = 0;
                }
                var x = this.config.R + Math.cos(_ang * Math.PI / 180) * this.config.R;
                var y = this.config.R + Math.sin(_ang * Math.PI / 180) * this.config.R;
                var stra = 'A' + this.config.R + ',' + this.config.R + ',' + '0' + ',' + this.dis + ',0,' + x + ',' + y;
                _ele.setAttribute('d', 'M' + this.config.R + ',' + 0 + ' ' + stra);
                $(this.pointsArr[this.config.pointNum - _pos]).find('line').attr('stroke', this.config.color);
                return this;
            }
            var pos = Math.ceil(_ang / 180 * this.config.pointNum);
            _ang = _ang - 90;
            if (_ele === 1) {
                _ele = this.beforeElement;
            }
            _ele.endangle = _ang;
            if (pos) {
                this.pointsArr[this.config.pointNum - pos].strokeColor = this.config.color;
            }
            return this;
        }

        /**
         * 是否支持SVG
         * @returns {boolean}
         */

    }, {
        key: 'isSVG',
        value: function isSVG() {
            var SVG_NS = 'http://www.w3.org/2000/svg';
            return !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect;
        }

        /**
         * 设置环绕点的坐标
         */

    }, {
        key: 'setPointInit',
        value: function setPointInit(_isSVG) {
            if (_isSVG) {
                for (var i = 0; i < this.pointsArr.length; i++) {
                    var pos = -Math.floor(i / (this.pointsArr.length - 1) * 180);
                    var _x = this.config.R + this.config.pointLong + this.config.strokeWidth / 2 + Math.cos(pos * Math.PI / 180) * (this.config.R + this.config.pointLong + this.config.strokeWidth / 2);
                    var _y = this.config.R + this.config.pointLong + this.config.strokeWidth / 2 + Math.sin(pos * Math.PI / 180) * (this.config.R + this.config.pointLong + this.config.strokeWidth / 2);
                    this.setAngleAndPos(this.pointsArr[i], pos + 90, _x + 5, _y + 5);
                }
                return this;
            }
            for (var _i2 = 0; _i2 < this.pointsArr.length; _i2++) {
                var _pos2 = -Math.floor(_i2 / (this.pointsArr.length - 1) * 180);
                this.getNewPos(this.pointsArr[_i2], _pos2);
            }
            return this;
        }

        /**
         * 设置ele的坐标以及角度
         * @param _ele
         * @param _ang
         * @param _x
         * @param _y
         */

    }, {
        key: 'setAngleAndPos',
        value: function setAngleAndPos(_ele, _ang, _x, _y) {
            _ang = _ang * Math.PI / 180;
            var str = 'matrix(' + Math.cos(_ang) + ',' + Math.sin(_ang) + ',' + -1 * Math.sin(_ang) + ',' + Math.cos(_ang) + ',' + _x + ',' + _y + ')';
            _ele.setAttribute('transform', str);
        }
    }, {
        key: 'getNewPos',
        value: function getNewPos(_ele, _jiao) {
            var _x1 = this.config.R + Math.cos(_jiao * Math.PI / 180) * (this.config.R - this.config.pointLong / 2 + this.config.strokeWidth / 2 + 5);
            var _y1 = this.config.R + Math.sin(_jiao * Math.PI / 180) * (this.config.R - this.config.pointLong / 2 + this.config.strokeWidth / 2 + 5);
            var _x2 = this.config.R + Math.cos(_jiao * Math.PI / 180) * (this.config.R + this.config.pointLong / 2 + this.config.strokeWidth / 2 + 5);
            var _y2 = this.config.R + Math.sin(_jiao * Math.PI / 180) * (this.config.R + this.config.pointLong / 2 + this.config.strokeWidth / 2 + 5);
            _ele.from = _x1 + ',' + _y1;
            _ele.to = _x2 + ',' + _y2;
        }

        /**
         * 执行动画 播放到具体角度
         * 传入参数为百分比
         */

    }, {
        key: 'gotoAndPlay',
        value: function gotoAndPlay(lastAngle) {
            var that = this;
            var bili = parseFloat(lastAngle);
            this.lastAng = lastAngle;
            lastAngle = lastAngle / 100 * 180;
            if (lastAngle >= 180) {
                lastAngle = 180;
            }
            this.setIntervalid = setInterval(function () {
                if (that.curAng >= lastAngle) {
                    clearInterval(that.setIntervalid);
                } else {
                    that.curAng += 2;
                }
                that.setAngle(that.curAng);
                //console.log(that.curAng,lastAngle,bili);
                if (bili < 100) {
                    var shownumTest = Math.floor(that.curAng / lastAngle * bili);
                    if (isNaN(shownumTest)) {
                        shownumTest = 0;
                    }
                    that.PNumArr[0].html(shownumTest + '%');
                } else {
                    that.PNumArr[0].html(Math.ceil(that.curAng / 180 * bili) + '%');
                }
            }, that.config.speed);
            return this;
        }

        /**
         * 重新播放动画
         */

    }, {
        key: 'rePlay',
        value: function rePlay() {
            if (this.isSVG()) {
                if (this.setIntervalid) {
                    clearInterval(this.setIntervalid);
                    this.setIntervalid = null;
                }
                this.curAng = 0;
                for (var i = 0; i < this.pointsArr.length; i++) {
                    $(this.pointsArr[i]).find('line').attr('stroke', this.config.pointColor);
                }
                this.gotoAndPlay(this.lastAng);
            }
            return this;
        }
    }]);

    return Semicircle;
}();

exports.default = Semicircle;