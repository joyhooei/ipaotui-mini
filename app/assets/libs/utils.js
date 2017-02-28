'use strict';
import timeago from './timeago.min'
import QQMapWX from './qqmap-wx-jssdk.min'
import { host } from '../../config'

const qqmap = new QQMapWX({
    key: 'FPOBZ-UT2K2-ZFYUC-CX67E-IOOYS-7XFQ6'
});

function resolveAdInfo(adInfo) {
    const {city, district, adcode} = adInfo
    return {
        city, district,
        district_id: adcode,
        city_id: adcode.replace(/\d{2}$/, '00')
    }
}

// 解析地址
export function reverseGeocoder(options) {
    const {
        location, success, complete
    } = options
    qqmap.reverseGeocoder({
        location,
        success: function (res) {
            var address = resolveAdInfo(res.result.ad_info)
            success && success(address)
        },
        fail: function (err) {
            console.log(err)
        },
        complete
    })
}

// 根据坐标获取地址信息
export function getAddressFromLocation(options) {
    const {location, success} = options
    getPois({
        location,
        success(pois) {
            var poi = pois[0]
            if (poi) {
                var address = Object.assign({
                    address_name: poi.title,
                }, ObjeresolveAdInfo(poi.ad_info))

                success && success()
            }
        }
    })
}

// 获取兴趣点
export function getPois(options) {
    const {
        location, success, complete
    } = options
    qqmap.reverseGeocoder({
        location,
        get_poi: 1,
        poi_options: "policy=2",
        success: function (res) {
            success && success(res.result.pois)
        },
        fail: function (err) {
            console.log(err)
        },
        complete
    })
}

export function getPrevPage() {
    const pages = getCurrentPages()
    return pages[pages.length - 2]
}
export function getAddress(index) {
    const addressList = wx.getStorageSync('addressList') || []
    return addressList[index]
}

export function removeAddress(index) {
    const addressList = wx.getStorageSync('addressList') || []
    addressList.splice(index, 1) // delete 
    wx.setStorageSync('addressList', addressList)
}

export function fetch(options) {
    wx.request({
        url: `https://${host}/${options.url}`,
        data: Object.assign(options.data, {
            'app_v': 'ipaotui_mini'
        }),
        method: options.method || 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
            const data = res.data
            if (data.State == 'Success') {
                options.success && options.success(data.data)
            } else {
                wx.showModal({
                    content: data.info,
                    showCancel: false
                });
            }
            options.complete && options.complete()
        }
    })
}

// 提示框
export function alert(content) {
    wx.showModal({
        title: '提示',
        content: content,
        showCancel: false
    })
}

// 加载提示
export function showLoading() {
    wx.showToast({
        icon: 'loading',
        duration: 10000,
        title: '加载中...',
        mask: true,
    })
}

// 时间格式化
export function datetimeFormat(unix_timestamp) {
    return new timeago().format(new Date(unix_timestamp * 1000), 'zh_CN');
}