//logs.js
const util = require("../../utils/util.js");

Page({
  data: {
    logs: [],
    lasetTapDiffTime: 0,
    tel:"1576647153"
  },
  onLoad: function () {},

  mytouchstart: function (e) {
    console.log(e.timeStamp + "- touch start");
  },
  mytouchend: function (e) {
    console.log(e.timeStamp + "- touch end");
  },
  mytap: function (e) {
    console.log(e.timeStamp + "- tap");
  },
  // 判断事件是单击还是双击
  mytapdb(e) {
    console.log(e);
    let curTime = e.timeStamp;
    let lastTime = this.data.lasetTapDiffTime;
    if (lastTime > 0) {
      console.log(222);

      // 小于300 双击
      if (curTime - lastTime < 300) {
        console.log(e.timeStamp, "-双击");
      } else {
        console.log(e.timeStamp, "-单击");
      }
    } else {
      console.log(e.timeStamp, "-first击");
    }
    this.setData({ lasetTapDiffTime: curTime });
  },
  // 长按事件
  mylongtap: function (e) {
    console.log(e.timeStamp + "- long tap");
  },
  Tel: function (e) {
  	var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("拨号成功！")
      },
      fail: function () {
        console.log("拨号失败！")
      }
    })
  },

  // ===================

  


});
