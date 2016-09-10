import xhr from 'SERVICE/xhr';

export function userLogin(formBody) {
  let path = '/login/';
  let config = {
    method: 'POST',
    body: formBody
  };

  return xhr(path, config);
}
