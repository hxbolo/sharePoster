//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    isshareIcon:false,
    isShow: false, // 分享海报显示隐藏
    bgImage:'', // canvas背景图
   
    unit:'', //尺寸比例
    width: '293px',
    height: '458px',

    sharePoster: {
      headImg:'https://img1.haoshiqi.net/miniapp/zlj_pic_f562a62fbe.png', // 头像图片
      commodityImg: 'https://img1.haoshiqi.net/miniapp/12@2x_d011d2f963.png',// 商品图
      zlImg:'', // 助力价标签
      qrCode:'https://img1.haoshiqi.net/miniapp/ew_5bc028809f.jpeg', // 二维码
      sale_price: 0.01, // 售卖价 
      market_price:  '$10.1', // 市场价
      title: '味巴哥精致原味猪肉脯猪肉脯小吃零食休闲食品解馋熟原味猪肉脯原味食1000g', // 标题
    }, // 分享海报

  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
   // =========海报====

   getCtx() {
    return new Promise( (resolve, reject) => {
      const query = wx.createSelectorQuery().in(this);
      
      query.select('#myCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          console.log(res);
          
          const canvas = res[0].node
          this.canvas = canvas
          
          const ctx = canvas.getContext('2d')
          this.ctx = ctx

          // 设置canvas大小
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          resolve(canvas);
        })
    });
  },

   // 获取网络图片
  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: src,
        success: (res) => {
          resolve(res.path);
        },
        fail: (err) => {
          wx.hideLoading();
          reject(err);
        }
      })
    })
  },
  // 获取屏幕比例
  getSystemInfo(){
  // 先是算出不同屏幕适配比例
    let that = this
    wx.getSystemInfo({
      success :res =>{
        console.log(res,'=========');
        let unit = res.windowWidth/375
        that.setData({
          unit,
          width:parseInt(293 * unit ) + 'px',
          height: parseInt(458 * unit)+'px'
          })
      },
    })
  },

  async fxDetailImage() {
    // wx.showLoading({
    //   title: '海报生成中...',
    // });
    const {sharePoster} = this.data
  
    const [bgImage,headImg,zlImg,commodityImg,qrCode, canvas] = await Promise.all([
      this.getImageInfo('https://img1.haoshiqi.net/miniapp/bg_47a03a4c5a.png').catch(e => e),
      this.getImageInfo(sharePoster.headImg).catch(e => e),
      this.getImageInfo('https://img1.haoshiqi.net/miniapp/zlj_pic_f562a62fbe.png').catch(e => e),
      this.getImageInfo(sharePoster.commodityImg).catch(e => e),
      this.getImageInfo(sharePoster.qrCode).catch(e => e),
      this.getCtx().catch(e => e),
    ]);
    
    this.setData({
      'sharePoster.bgImage': bgImage,
      'sharePoster.headImg': headImg,
      'sharePoster.zlImg': zlImg,
      'sharePoster.commodityImg': commodityImg,
      'sharePoster.qrCode': qrCode,
    })
    

    this.createSharePoster(canvas);
  },

  // 加载本地图片
  onLoadImage(canvas, src) {
    return new Promise((resolve, reject) => {
      let img = canvas.createImage();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        wx.hideLoading();
        reject('');
      }
      img.src = src;
    });
  },

  // 绘制海报
  async createSharePoster (canvas) {
    const ctx = canvas.getContext('2d');
    const [bgImg,headImg,zlImg,commodityImg,qrCode] = await Promise.all([
      this.onLoadImage(canvas, this.data.sharePoster.bgImage).catch(e => e),
      this.onLoadImage(canvas, this.data.sharePoster.headImg).catch(e => e),
      this.onLoadImage(canvas, this.data.sharePoster.zlImg).catch(e => e),
      this.onLoadImage(canvas, this.data.sharePoster.commodityImg).catch(e => e),
      this.onLoadImage(canvas, this.data.sharePoster.qrCode).catch(e => e),
    ]);
    
    let unit = this.data.unit
    
    ctx.drawImage( bgImg, 0, 0,  293*unit, 458*unit,)
    // 内容
    this.drawContent(ctx,zlImg,commodityImg)
    // 绘制头像 + 文字
    this.drawHeaderContent(ctx,headImg)
    // 底部
    this.drawFooter(ctx,qrCode)
    
  },

   // 头像
   drawHeaderContent(ctx, headImg){
    let unit = this.data.unit
    
    // 文案
    ctx.beginPath();
    ctx.textAlign = 'left';
    let size = 13*unit
    ctx.font = `normal bold ${size}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('老铁帮我点一下， 就差你啦！',100 * unit, 40 * unit);
  
    // 头像边框
    ctx.beginPath()
    ctx.arc(80 * unit, 30 * unit, 15 * unit, 0, 2 * Math.PI)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke()
    
    // 头像图标
    ctx.save();
    ctx.beginPath()
    ctx.arc(80 * unit, 30 * unit, 15 * unit, 0 * unit, 2 * Math.PI)
    ctx.strokeStyle = '#FFFFFF';
    ctx.clip(); //裁剪上面的圆形
    ctx.drawImage(headImg, 65 * unit, 15 * unit, 30 * unit,30 * unit ); // 在刚刚裁剪的园上画图
    ctx.restore();

  },

   // 内容
   drawContent(ctx,zlImg,commodityImg){
    let unit = this.data.unit
    // 三角形
    ctx.beginPath()
    ctx.fillStyle = '#FFFFFF';
    ctx.moveTo(70 * unit, 60 * unit)
    ctx.lineTo(80 * unit, 50 * unit)
    ctx.lineTo(90 * unit, 60 * unit)
    ctx.fill()

    // 内容背景图
    ctx.beginPath()
    ctx.fillStyle = '#FFFFFF';
    this.roundRect(ctx, 10 * unit, 60 * unit, 272 * unit, 290 * unit, 5 * unit)
   
    // 横线
    ctx.beginPath()
    ctx.strokeStyle = '#CECECE';
    ctx.moveTo(10 * unit, (280-0.5) * unit)
    ctx.lineTo(282 * unit,(280-0.5) * unit)
    ctx.stroke()

    // 商品图片
    ctx.beginPath()
    ctx.fill()
    ctx.drawImage(commodityImg, 48 * unit, 70 * unit,  200 * unit, 200 * unit ); // 在刚刚裁剪的园上画图

    // 助力价
    ctx.beginPath()
    ctx.fill()
    ctx.drawImage(zlImg, 25 * unit, 285 * unit, 40 * unit, 18 * unit ); // 在刚刚裁剪的园上画图

    // ￥
    ctx.beginPath()
    let size_15 = 15*unit
    ctx.font = `normal bold ${size_15}px sans-serif`; 
    ctx.fillStyle = '#FB0438';
    ctx.fillText('￥',  70 * unit, 300 * unit)

    // 0.01
    ctx.beginPath()
    let price =String(this.data.sharePoster.sale_price) 
    console.log('price',price,this.data.sharePoster);
    
    ctx.font = 'normal bold 15px sans-serif';
    ctx.fillStyle = '#FB0438';
    ctx.fillText(price, 85 * unit, 301 * unit)

    // 原价
    ctx.beginPath()
    let size_12 = 12*unit
    ctx.font = `normal bold ${size_12}px sans-serif`; 
    ctx.fillStyle = '#999999';
    ctx.fillText('原价', 125 * unit, 300 * unit)

    // ￥19.9
    ctx.beginPath()
    let marketprice =String(this.data.sharePoster.market_price)
    let size12a = 12*unit
    ctx.font = `normal bold ${size12a}px sans-serif`; 
    ctx.fillStyle = '#999999';
    ctx.fillText(marketprice, 150 * unit, 301 * unit)
  

    // 价格横线
    ctx.beginPath()
    ctx.strokeStyle = '#999';
    ctx.moveTo(150 * unit, (297-0.5) * unit)
    ctx.lineTo(185 * unit, (297-0.5) * unit)
    ctx.stroke()

    // title
    ctx.beginPath()
    let size12 = 12*unit
    ctx.font = `normal bold ${size12}px sans-serif`;
    ctx.fillStyle = '#333';
    let title = this.data.sharePoster.title
    this.canvasTextAutoLine(title, ctx, 25 * unit, 320 * unit, 14 * unit, 250 * unit ,2 * unit)
  },

  // 底部二维码
  drawFooter(ctx, qrCode){
    let unit = this.data.unit
    
    // 长按或扫描助力
    ctx.save();
    ctx.beginPath()
    ctx.font = 'normal bold 10px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('-长按或扫描助力-', 100 * unit, 445 * unit)
    
    // 二维码
    ctx.beginPath()
    ctx.arc(140 * unit, 395 * unit, 35 * unit, 0 * unit, 2 * Math.PI)
    // ctx.fillStyle = '#FFFFFF';
    // ctx.fill()
    ctx.clip(); //裁剪上面的圆形
    ctx.drawImage(qrCode, 103 * unit, 360 * unit,  75 * unit, 75 * unit ); // 在刚刚裁剪的园上画图
    
    ctx.restore()//恢复之前保存的绘图上下文
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
    ctx.fillStyle = '#FFFFFF';
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

  formSubmit(){
    console.log(123)
    
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
      that.setData({
        isShow: true
      });
      that.fxDetailImage()
    }, 1000)
  },

  // 点击黑色透明背景隐藏页面
  closeShare(){
    this.setData({
      isShow: false
    });
  },

  saveImage(){
    this.canvasToTempFilePath()
  },

   // 生成图片
  canvasToTempFilePath() {

    wx.canvasToTempFilePath({
      canvas: this.canvas,
      success: (res) => {
        console.log('res=====',res);
        this.saveImageToPhotos(res.tempFilePath);
       
      },
      fail: (res) => {
        wx.showToast({
          title: '海报生成失败',
        })
      }
    })
  },

  saveImageToPhotos (tempFilePath) {
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


})
