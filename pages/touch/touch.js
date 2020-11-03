//logs.js
const util = require("../../utils/util.js");

Page({
   /**
   * 页面的初始数据
   */
  data: {
    model: {
      bgIMG: '../../tab/index_index_active.png',
     
      // =====================
      bgImg:'../../tab/bg.png',
      headerImg :'../../tab/timg.jpeg',
      centerImg :'../../tab/timg.jpeg',
      zlImg :'../../tab/zlj_pic.png'
    },

    windowWidth: 0,
    windowHeight: 0,
    totalHeight: 0,
    canvasScale: 1.0,// 画布放大的倍数,因为如果保存的是一倍的分享图片的话，分享图会有点虚。所以保存的时候，canvasScale设置为2.0，wxss 里面的left: 500%;打开注释。就可保存两倍的分享图

    isShow:true

   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    let that = this
   // 获取到屏幕的宽高等信息
   wx:wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })

   
  //  this.createSharePoster()
  },
  onShow(){
    this.begainDrawShareImage()
    // wx.getImageInfo({
    //   src: 'http://imgmars.yohobuy.com/mars/2018/05/26/d939c526b9d84e0a16544de381af7d09.jpg',})
  },

   // =========海报====

  formSubmit(){
    let that  =this
    this.setData({
      isShow: false
    });
    wx.showToast({
      title: '加载...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.begainDrawShareImage()
      that.setData({
        isShow: true
      });
    }, 1000)
  },
  closeShare(){
    this.setData({
      isShow: false
    });
  },
   
  
    /**
   * 绘制分享海报
   */
  begainDrawShareImage() {
    var that = this
    // 适配屏幕
    let scale = this.data.windowWidth / 375.0
    this.setData({ totalHeight: 667* scale})
    
    // 获取Canvas
    let ctx = wx.createCanvasContext('myCanvas')

    console.log('ctx++++++++++=',ctx);
    

    // 放大 因为不放大的话，生成的分享图会模糊。暂时先注释
    // ctx.scale(this.data.canvasScale, this.data.canvasScale)

    // 绘制主背景白色
    ctx.setFillStyle('#F61F1F')
    // 填充一个矩形
    // ctx.fillRect(0, 0, 293, 458)
    // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
    // ctx.draw()

    // 背景图片，因为它在最底层，然后才能绘制其他内容
    let src1 = this.data.model.bgImg 

    // wx.getImageInfo({
    //   src: src1,
    //   success: function (res) {
    //     console.log('res______',res);
        
    //     // ctx.drawImage(res.path, 20 * scale, 184*scale, mallImageWidth, mallImageHeight)
    //     // ctx.draw(true)
    //     ctx.drawImage(src1, 0, 0,  293, 458)
    //     ctx.draw(true)
    //   }
    // })

    // 绘制图像到画布
    ctx.drawImage(src1, 0, 0,  293, 458, 0,0 )
    // ctx.draw(true)

    // 底部
    that.drawFooter(ctx)
    // 内容
    that.drawContent(ctx)
    // 绘制头像 + 文字
    that.drawHeaderContent(ctx)

    // 生成海报时需要时临时文件或者是本地文件，如果是网络图片，需要通过wx.getImageInfo() api获取图片的临时路径
    wx.getImageInfo({
      src: src1,
      success: function(res) {

        ctx.draw(true)

      }
      
    })
  },
  // 头像
  drawHeaderContent(ctx, ){
    
    // 绘制文字
    ctx.beginPath()
    let text = '老铁帮我点一下， 就差你啦！'
    ctx.setFontSize(13)
    ctx.setFillStyle('#fff');
    ctx.fillText(text, 100, 40)
  
    // 头像边框
    ctx.beginPath()
    ctx.arc(80, 30, 15, 0, 2 * Math.PI)
    ctx.setStrokeStyle('#fff')
    ctx.lineWidth = 2;
    ctx.stroke()
    
    // 头像图标
    ctx.beginPath()
    ctx.arc(80, 30, 15, 0, 2 * Math.PI)
    ctx.setStrokeStyle('#fff')
    ctx.clip(); //裁剪上面的圆形
    const headerImg  = this.data.model.headerImg
    ctx.drawImage(headerImg, 65, 15, 30,30 ); // 在刚刚裁剪的园上画图

  },
   // 内容
  drawContent(ctx){
    // 三角形
    ctx.beginPath()
    ctx.moveTo(70, 60)
    ctx.lineTo(80, 50)
    ctx.lineTo(90, 60)
    ctx.fill()

    // 内容背景图
    ctx.beginPath()
    ctx.setFillStyle('#fff');
    // ctx.fillRect(10, 60, 272, 290)
    this.roundRect(ctx, 10, 60, 272, 290, 5)
    // ctx.fill()
   
    // 横线
    ctx.beginPath()
    ctx.setStrokeStyle('#CECECE');
    ctx.moveTo(10, 280-0.5)
    ctx.lineTo(282,280-0.5)
    ctx.stroke()

    // 商品图片
    ctx.beginPath()
    ctx.setFillStyle('red');
    ctx.fillRect(48, 70, 200, 200)
    ctx.fill()
    const centerImg  = this.data.model.centerImg
    ctx.drawImage(centerImg, 48, 70,  200, 200 ); // 在刚刚裁剪的园上画图

    // 助力价
    ctx.beginPath()
    ctx.fill()
    const zlImg  = this.data.model.zlImg
    ctx.drawImage(zlImg, 25, 285, 40, 18 ); // 在刚刚裁剪的园上画图

    // ￥
    ctx.beginPath()
    let text = '￥'
    ctx.setFontSize(15)
    ctx.setFillStyle('#FB0438');
    ctx.fillText(text,  70, 300)

    // 0.01
    ctx.beginPath()
    let price = '0.01'
    ctx.setFontSize(20)
    ctx.setFillStyle('#FB0438');
    ctx.fillText(price, 85, 302)

    // 原价
    ctx.beginPath()
    ctx.setFontSize(12)
    ctx.setFillStyle('#999999');
    ctx.fillText('原价', 125, 300)

    // ￥19.9
    ctx.beginPath()
    let marketprice = '￥19.9'
    ctx.setFontSize(12)
    ctx.setFillStyle('#999999');
    ctx.fillText(marketprice, 150, 301)

    // 价格横线
    ctx.beginPath()
    ctx.setStrokeStyle('#999999');
    ctx.moveTo(150, 297-0.5)
    ctx.lineTo(185, 297-0.5)
    ctx.stroke()

    // title
    ctx.beginPath()
    ctx.setFontSize(12)
    ctx.setFillStyle('#333');
    let title = '味巴哥精致原味猪肉脯猪肉脯小吃零食休闲食品解馋熟原味猪肉脯原味食1000g'
    this.canvasTextAutoLine(title, ctx, 25, 320, 14, 250 ,2)
  },

  // 底部二维码
  drawFooter(ctx){
    // 二维码
    ctx.beginPath()
    ctx.arc(140, 395, 35, 0, 2 * Math.PI)
    ctx.setFillStyle('#cdc')
    ctx.fill()

    // 长按或扫描助力
    ctx.beginPath()
    ctx.setFontSize(10)
    ctx.setFillStyle('#ffffff');
    ctx.fillText('-长按或扫描助力-', 100, 445)


  },

  // 保存图片
  saveImage(){
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.windowWidth * this.data.canvasScale,
      height: this.data.totalHeight * this.data.canvasScale,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('res+++++++++++++');
        
        that.saveImageToPhotos(res.tempFilePath);
      },
      fail: function (res) {
        wx.showToast({
          title: '图片生成失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  saveImageToPhotos: function (tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(result) {
        wx.showToast({
          title: '保存成功，从相册中分享到朋友圈吧',
          icon: 'none',
          duration: 4000
        })
      },
      fail: function (res) {
          wx.showToast({
            title: '图片保存失败',
            icon: 'none',
            duration: 2000
          })
      }
    })
  },


  

  /*
  *  绘制多行文本，自动换行，超出添加...
  *
  str:要绘制的字符串
  canvas:canvas对象
  initX:绘制字符串起始x坐标
  initY:绘制字符串起始y坐标
  lineHeight:字行高，自己定义个值即可
  maxWidth: 文本最大宽度
  row: 最大行数
  */
 canvasTextAutoLine: function(str, ctx, initX, initY, lineHeight, maxWidth, row = 1) {
  var lineWidth = 0;
  var lastSubStrIndex = 0;
  var currentRow = 1;
  for (let i = 0; i < str.length; i++) {
    lineWidth += ctx.measureText(str[i]).width;
    if (lineWidth > maxWidth) {
      currentRow++;
      let newStr = str.substring(lastSubStrIndex, i)
      if (currentRow > row && str.length > i) {
        newStr = str.substring(lastSubStrIndex, i - 2) + '...'
      }
      ctx.fillText(newStr, initX, initY);
      initY += lineHeight;
      lineWidth = 0;
      lastSubStrIndex = i;

      if (currentRow > row) {
        break;
      }
    }
    if (i == str.length - 1) {
      ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
    }
  }
},
  //画圆角矩形
  /**
  * 
  * @param {CanvasContext} ctx canvas上下文
  * @param {number} x 圆角矩形选区的左上角 x坐标
  * @param {number} y 圆角矩形选区的左上角 y坐标
  * @param {number} w 圆角矩形选区的宽度
  * @param {number} h 圆角矩形选区的高度
  * @param {number} r 圆角的半径
  */
 roundRect(ctx, x, y, w, h, r) {
  // 开始绘制
  ctx.beginPath()
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // 这里是使用 fill 还是 stroke都可以，二选一即可
  ctx.setFillStyle('#fff')
  // ctx.setStrokeStyle('transparent')
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
 
  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
 
  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
 
  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
 
  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)
 
  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()
  // ctx.stroke()
  ctx.closePath()
  // 剪切   // ??? 加了裁剪就不展示其他
  // ctx.clip()
},
 

// ======================================

  // 绘制除了图片之外的剩余内容
  drawOtherContent(ctx, scale) {

    console.log(123);
    

    // 绘制中间的灰色背景
    ctx.setFillStyle('rgba(246,246,246,1)')
    ctx.fillRect(14 * scale, 230 * scale, 347 * scale, 158 * scale)

    //name
    ctx.setFillStyle('white');
    ctx.setFontSize(30 * scale);
    this.canvasTextAutoLine(this.data.model.name, ctx, 80 * scale, 220 * scale, 35 * scale, 258 * scale, 1)

    // cotent
    ctx.setFillStyle('#3c3c3c');
    ctx.setFontSize(15 * scale);
    this.canvasTextAutoLine(this.data.model.content, ctx, 30 * scale, 270 * scale, 22 * scale, 305 * scale, 4)

    // address
    ctx.setFillStyle('#dadada');
    ctx.setFontSize(15 * scale);
    this.canvasTextAutoLine(this.data.model.address, ctx, 30 * scale, 370 * scale, 22 * scale, 305 * scale, 1)

    this.drawNormalText(ctx, '探索新鲜好去处', 82 * scale, 596 * scale, 14 * scale, '#3C3C3C', 'left', 'middle', scale);
    this.drawNormalText(ctx, '长按右侧小程序码', 82 * scale, 620 * scale, 12 * scale, '#9A9CAC', 'left', 'middle', scale);
    this.drawNormalText(ctx, '查看更多店铺信息和热评', 82 *scale,635*scale, 12*scale, '#9A9CAC', 'left', 'middle', scale);

    ctx.draw(true)

  },

 
  // 绘制剩余图片
  drawOtherImage(ctx, scale) {

    let that = this

    let mallImageWidth = parseInt(57 * scale)
    let mallImageHeight = parseInt(57 * scale)
    let src1 = this.data.model.mallUrl + `?imageView/2/w/${mallImageWidth}/h/${mallImageHeight}`
    wx.getImageInfo({
      src: src1,
      success: function (res) {
        ctx.drawImage(res.path, 20 * scale, 184*scale, mallImageWidth, mallImageHeight)
        ctx.draw(true)
      }
    })

    let cotentImageWidth = parseInt(166 * scale)
    let cotentImageHeight = parseInt(166 * scale)
    for (let i = 0; i < this.data.model.contentImages.length; i++){
      let imageItem = this.data.model.contentImages[i]
      let src1 = imageItem.image + `?imageView/2/w/${cotentImageWidth}/h/${cotentImageHeight}`
      wx.getImageInfo({
        src: src1,
        success: function (res) {
          ctx.drawImage(res.path, 15 * scale + i*180*scale, 400 * scale, cotentImageWidth, cotentImageHeight)
          ctx.draw(true)
        }
      })
    }

    // icon 
    // ctx.setShadow(0, 8 * scale, 20, 'rgba(0,0,0,0.1)')  
    ctx.drawImage('../../img/mars.png', 13 * scale, 590 * scale, 54*scale, 54*scale)
    // ctx.setShadow(0, 0, 0, 'white')
    ctx.draw(true)
  },

 // ======================================
  
  


});
