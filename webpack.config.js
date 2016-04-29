/**
 * Created by DaVer on 16/4/4.
 */
// webpack.config.js
var path = require("path");
module.exports = {
	entry: './build/index.js', //演示单入口文件
	output: {
		path: path.join(__dirname, 'out'),  //打包输出的路径
		filename: 'bundle.js',			  //打包后的名字
		publicPath: "./out/"				//html引用路径，在这里是本地地址。
	}
};