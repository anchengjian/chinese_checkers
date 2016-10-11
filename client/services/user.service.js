import xhr from 'SERVICE/xhr';

export function getUserName(formBody) {
  let path = '/api/1.0/username/';
  let config = {
    method: 'GET',
    body: formBody
  };

  return xhr(path, config);
}
