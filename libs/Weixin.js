import AV from './av-weapp-min';

/* global getApp, wx */

let app;

function isString(val) {
  return typeof val === 'string';
}

export function setApp(theApp) {
  app = theApp;
}

export function checkSession() {
  // 先验证本应用 session，没有的话要求登录
  let sessionId = getSessionId();
  if (!sessionId) {
    return Promise.reject(new Error('No Session'));
  }

  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        resolve(sessionId);
      },
      fail() {
        reject('Weixin Session expired');
      },
    });
  });
}

export function login(formId) {
  return new Promise((resolve, reject) => {
    wx.login({
      success(result) {
        resolve(result);
      },
      fail(error) {
        reject(error);
      },
    });
  })
    .then(result => {
      if (!result || !result.code) {
        throw new Error('用户登录失败。' + result.errMsg);
      }
      return getUserInfo(result.code);
    })
    .then(({code, userInfo}) => {
      app.globalData.userInfo = userInfo;
      wx.setStorageSync('userInfo', userInfo);

      return request({
        url: BASE_URL + '/client/login',
        method: 'POST',
        data: {
          code: code,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          sex: userInfo.gender,
          formId,
        },
      });
    })
    .then(response => {
      const {code, sessionId} = response;
      if (code !== 0) {
        throw new Error('登录失败');
      }
      app.globalData.sessionId = sessionId;
      wx.setStorageSync('sessionId', sessionId);
      return response;
    });
}

export function getSessionId() {
  return app.globalData.sessionId || wx.getStorageSync('sessionId');
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success({userInfo}) {
        resolve(userInfo);
      },
      fail(error) {
        reject(error);
      },
    });
  });
}

export function request(obj) {
  obj.url = /^(https?:)?\/\//.test(obj.url) ? obj.url : `${BASE_URL}${obj.url}`;
  return new Promise((resolve, reject) => {
    obj.success = result => {
      if (result.statusCode === 200) {
        return resolve(result.data);
      }
      if (typeof result.data === 'string') {
        result.data = result.data.replace(/^[\ufeff]+/g, '');
        result.data = JSON.parse(result.data);
      }
      reject(result);
    };
    obj.failed = (err) => {
      let data = err.data || err;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      reject(data);
    };
    wx.request(obj);
  });
}

export function pay(obj) {
  obj.timeStamp = obj.timeStamp.toString();
  return new Promise((resolve, reject) => {
    obj.success = response => {
      resolve(response);
    };
    obj.fail = response => {
      reject(response.errMsg.slice(20));
    };
    wx.requestPayment(obj);
  });
}

export function alert(msg, confirmText = '确定') {
  return new Promise(resolve => {
    wx.showModal({
      content: msg,
      showCancel: false,
      confirmText,
      success(res) {
        resolve(res);
      },
    });
  });
}

export function confirm(title = '', content, confirmText = '确定', cancelText = '取消') {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      showCancel: !!cancelText,
      confirmText,
      cancelText,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

export function upload(obj) {
  obj.url = /^(https?:)?\/\//.test(obj.url) ? obj.url : `${BASE_URL}${obj.url}`;
  obj.name = 'file';
  return new Promise((resolve, reject) => {
    obj.success = response => {
      if (response.statusCode === 200) {
        if (typeof response.data === 'string') {
          response.data = JSON.parse(response.data);
        }
        return resolve(response.data);
      }
      reject(response.data);
    };
    obj.fail = err => {
      reject(err);
    };
    wx.uploadFile(obj);
  });
}

export function uploadToLeanCloud(filename, url) {
  const file = new AV.File(filename, {
    blob: {
      uri: url,
    },
  });
  return file.save();
}

export function download(obj) {
  if (isString(obj)) {
    obj = {
      url: obj,
    };
  }
  return new Promise((resolve, reject) => {
    obj.success = response => resolve(response);
    obj.fail = error => reject(error);
    wx.downloadFile(obj);
  });
}

export function chooseImage(obj) {
  return new Promise((resolve, reject) => {
    obj.success = resolve;
    obj.fail = reject;
    wx.chooseImage(obj);
  });
}

export function saveImageToPhotosAlbum(obj) {
  if (isString(obj)) {
    obj = {
      filePath: obj,
    };
  }
  return new Promise((resolve, reject) => {
    obj.success = response => {
      resolve(response);
    };
    obj.fail = err => {
      reject(err);
    };
    wx.saveImageToPhotosAlbum(obj);
  });
}

export function getAuthSetting(key) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success({authSetting}) {
        return authSetting[key] ? resolve(authSetting[key])
          : reject(`"${key}" is not allowed.`);
      },
      fail(error) {
        reject(error);
      },
    });
  });
}

export function getShareInfo(ticket) {
  return new Promise((resolve, reject) => {
    wx.getShareInfo({
      shareTicket: ticket,
      success(errMsg, encryptedData, iv) {
        resolve({
          errMsg,
          encryptedData,
          iv,
        });
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

export function openSetting() {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

export function getClipboardData() {
  return new Promise((resolve, reject) => {
    wx.getClipboardData({
      success({data}) {
        resolve(data);
      },
      fail(res) {
        reject(res);
      },
    });
  });
}

export function mix(from, to) {
  for (const [key, value] of Object.entries(from)) {
    if (!(key in to)) {
      to[key] = value;
    }
  }
  return to;
}
