export interface APIError {
  error: string;
}

export const apiErrorGuard = (err: any): err is APIError => typeof err.error === 'string';

export const fetchData = <T = string>(url: string, opts: RequestInit = {}): Promise<T | APIError> => fetch(url, {
  ...opts,
  credentials: 'same-origin',
  headers: {
    ...opts.headers,
    'Content-Type': 'application/json; charset=utf-8'
  },
})
  .then(res => {
    const contentType = res.headers.get('Content-Type');
    if (contentType === null || contentType.includes('text')) {
      return res.text();
    }
    return res.json();
  });
