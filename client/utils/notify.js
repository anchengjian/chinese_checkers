// 浏览器桌面提醒
class Notify {
  constructor(icon = '/assets/images/logo-square.png') {
    this.icon = icon;
  }
  pop(title, content) {

    if (!title && !content || !window.hasOwnProperty('Notification')) return;
    let options = {
      'icon': this.icon,
      'body': content
    };
    let notification;

    // 判断是否有权限
    if (Notification.permission === 'granted') {
      notification = new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      // 如果没权限，则请求权限
      Notification.requestPermission((permission) => {
        // 如果接受请求
        if (permission === 'granted') notification = new Notification(title, options);
      });
    }
  }
}

export default new Notify();
