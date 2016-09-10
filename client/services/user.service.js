import xhr from 'SERVICE/xhr';

export function userLogin(formBody) {
  let path = '/api/1.0/login/';
  let config = {
    method: 'POST',
    body: formBody
  };

  return xhr(path, config);
}
