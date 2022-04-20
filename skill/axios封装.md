# axios 封装

```typescript
// intercepor.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';

const SUCCESS_STATUS = 200;
axios.defaults.adapter = require('axios/lib/adapters/http');

// export const CancelToken = CancelToken
const service: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Version': '0.0', // 默认请求V0接口
  },
  timeout: 0,
  withCredentials: false,
  transformResponse: [config => JSON.parse(config.replace(/(?<=:\s?)(\d{16,})/g,'"$1"'))]
});
// 请求拦截
service.interceptors.request.use((config: AxiosRequestConfig) => {
  return config;
});

// 返回拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === SUCCESS_STATUS) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response);
  },
  (error) => {
    console.error(error, 'error');
    return Promise.reject(error);
  },
);

export default service;

// request.ts
import service from './intercepor';
import { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
interface IPlainObject {
  [key: string]: any;
}
interface IResponseObject<T> {
  Code: number;
  Data: T;
  Message?: string;
}

const SUCESS_CODE = 0;
function appearErrorMessage<T>(requestMethod: Promise<T>): Promise<T> | void {
  requestMethod.catch((error): void => {
    switch (true) {
      // 没权限
      case Number(error?.errno) === 401:
        //
        break;
      default:
        console?.warn(error || 'XXXXXXXXXXXXXXX');
        break;
    }
  });
    // return requestMethod;
}

function handleRequest<T>(requestMethod: Promise<IResponseObject<T>>): Promise<T> {
  const handlePromise = new Promise<T>((resolve, reject) => {
    requestMethod.then((res) => {
      if (res?.Code === SUCESS_CODE) {
        resolve(res.Data);
      } else {
        reject(res);
        res.Message && message.error(res.Message);
      }
    }, reject);
  });
  appearErrorMessage(handlePromise);
  return handlePromise;
}

export function get<T>(url: string, params: IPlainObject = {}, option: AxiosRequestConfig = {}) {
  return handleRequest<T>(
    service.get<IResponseObject<T>>(url, {
      params,
      ...option,
    }) as any,
  );
}

export function post<T>(url: string, data: IPlainObject = {}, option: AxiosRequestConfig = {}) {
  return handleRequest<T>(service.post<T>(url, data, option) as any);
}
```


