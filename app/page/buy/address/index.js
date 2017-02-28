// page/buy/address/index.js
import { getPrevPage, alert, reverseGeocoder } from '../../../assets/libs/utils'

Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
            name: res.name
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    const that = this
    const params = e.detail.value
    const location = this.data.location
    if (!location) {
      return alert('请选取购买地址')
    }

    this.setData({
      loading: true
    })
    reverseGeocoder({
      location,
      success: function (address) {
        getPrevPage().setData({
          buyAddress: Object.assign(address, params)
        })
        wx.navigateBack()
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        that.setData({
          loading: false
        })
      }
    })

  }
})