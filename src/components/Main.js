require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';

//获取图片相关数据
var imgDatas = require('../data/imgData.json');
//将图片名转化成图片URL路径信息
imgDatas = (function genImgURL(imgDataArr){
  for(var i = 0,j = imgDataArr.length;i<j;i++){
    var singleImg = imgDataArr[i];

    singleImg.imgURL = require('../images/'+singleImg.fileName);

    imgDataArr[i] = singleImg;
  }

  return imgDataArr;

})(imgDatas);

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
          <section className="img-sec">
          </section>
          <nav className="controller-nav">
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
