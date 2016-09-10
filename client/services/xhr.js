import { serverHost, xhrConfig } from 'CONFIG/app.config';
import notify from 'UTIL/notify';

export default function xhr(path, options) {

  let config = Object.assign({}, xhrConfig, options);
  let input = serverHost + path;

  return window.fetch(input, config)
    .then((resp) => {
      // if (resp.headers.get('content-type').indexOf('json') >= 0)
      try {
        return resp.json();
      } catch (err) {}
      return resp.text();
    })
    .catch((err) => {
      notify.pop('不小心走丢了', '请检查网络状态先');
      console.error(err);
    });
}
