require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
import ReactDOM from 'react-dom';

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

// /////封装函数
///////////获取区间内的一个随机值
function getRangeRandom(low,high){
   return Math.ceil(Math.random()*(high - low) + low);
}

//获取0-30度之间的一个任意正负值
function get30DegRandom(){
  return((Math.random() > 0.5? '':'-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component{
  constructor(){
    super();

    this.handleClick = this.handleClick.bind(this);

  }

   /////点击事件
   handleClick(e){

    //如果居中就翻转，否则就居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    var styleObj = {};
    //如果props属性指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //如果图片的选择角度有值且不为0，添加选择角度
    if(this.props.arrange.rotate){
      (['-moz-','-ms-','-webkit-','']).forEach(function(value){
           styleObj[value + 'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));

    }

    //调整中心图片的z-index
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ' ';

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img_title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }

}

class AppComponent extends React.Component {

  constructor(){
    super();

    this.state = {
        imgsArrangeArr :[
          // {
          //   pos :{
          //     left : '0',
          //     top : '0'
          //   },
          //    rotate:0 ,//图片的旋转角度
          //    isInverse : false, //图片正反面，false正面
          //    isCenter : false  //图片是否居中，默认不居中
          // }
        ]
    };

    this.Constant = {
      centerPos:{
          left:0,
          right:0
      },
      hPosRange:{//水平方向的取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{//垂直方向的取值范围
        x:[0,0],
        topY:[0,0]
      }
    }
 }
// //////反转图片
inverse(index){
  return ()=>{
    let imgsArrangeArr = this.state.imgsArrangeArr;

    imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

    this.setState({
      imgsArrangeArr:imgsArrangeArr
    })
  }
}


  //重新布局所有图片
  //centerindex指定居中的图片
  rearrange(centerIndex){
      let imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          hPosRangeY = hPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          vPosRangeX = vPosRange.x,

          //上部的图片取一个或者不取
          imgsArrangeTopArr = [],
          topImgNum = Math.ceil(Math.random() *2),

          topImgSpliceIndex = 0,
          imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

          //居中centerIndex图片
          //居中的图片不需要旋转
          imgsArrangeCenterArr[0] = {
            pos : centerPos,
            rotate : 0,
            isCenter: true
          }

          //取出上侧图片的状态信息
          topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
          imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

          //布局位于上侧的图片
          imgsArrangeTopArr.forEach(function(value,index){
              imgsArrangeTopArr[index] = {
                pos : {
                  top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                  left : getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate : get30DegRandom(),
                isCenter : false
              }
          });

          //布局左右两侧的图片
          for(let i = 0,j = imgsArrangeArr.length,k = j / 2;i<j; i++){
            let hPosRangeLORX = null;

            //前半部分布局在左边，右半部分布局在右边

            if(i < k){
                hPosRangeLORX = hPosRangeLeftSecX;
            }else{
              hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos : {
                top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
              },
              rotate : get30DegRandom(),
              isCenter : false
            }
          }

          if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
          }

          imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

          this.setState({
            imgsArrangeArr : imgsArrangeArr
          });


  }
  //居中对应的index图片,利用rearrange函数，居中
  center(index){
      return function(){
          this.rearrange(index);
      }.bind(this);
  }

  //组件加载后，为每张图片计算位置范围
  componentDidMount(){
    //舞台大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);


    //拿到一个imgFigure的大小

    let ImgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = ImgFigureDOM.scrollWidth,
        imgH = ImgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);


    //计算中心图片的位置
    this.Constant.centerPos = {
      left : halfStageW - halfImgW,
      top : halfStageH - halfImgH
    }

    //左右侧图片位置范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //上侧图片位置范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH *3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }


  render() {

    let controllerUnits = [],
        ImgFigures = [];


        imgDatas.forEach((value,index) => {

          if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index] = {
            pos:{
              left :0,
              top : 0
            },
            rotate:0,
            isInverse : false,
            inCenter : false

          };
        }
          ImgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} key={index} inverse = {this.inverse(index)} center={this.center(index)}/>);
        });

    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
          {ImgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
