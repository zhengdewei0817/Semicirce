/**
 * Created by DaVer on 16/4/29.
 */
//半圆环
//const Semicircle = require('./Semicircle.js');
import Semicircle from './Semicircle.js';

let ring2 = new Semicircle($('#ring')).setConfig({
	width: 300,//圆环的宽度
	height: 200,//圆环的高度
	bgColor: 'rgb(200,200,200)',//圆环的背景颜色
	color: 'rgb(200,0,0)',//圆环的颜色
	strokeWidth: 10
}).init().gotoAndPlay(150);