// 自定义范围随机数
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const objectToFormdata = (obj: any, form?: FormData, namespace?: string): FormData => {
  const fd = form || new FormData()
  let formKey
  for (const property in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(property)) {
      const key = Array.isArray(obj)
        ? `[${property}]`
        : `.${property}`
      if (namespace) {
        formKey = namespace + key
      } else {
        formKey = property
      }

      if (obj[property] instanceof Date) {
        fd.append(formKey, obj[property].toISOString())
      } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        objectToFormdata(obj[property], fd, formKey)
      } else if (obj[property] !== undefined) {
        fd.append(formKey, obj[property])
      }
    }
  }

  return fd
}

// 获取某日期前n天的日期 
export const getForwardDate = (date: string, days: any, seperator = '-'): string => {
  const oDate = new Date(date).valueOf();
  const nDate = oDate - days * 24 * 3600 * 1000
  const afDate = new Date(nDate)
  const y = afDate.getFullYear().toString().padStart(2, '0')
  const m = (afDate.getMonth() + 1).toString().padStart(2, '0')
  const d = afDate.getDate().toString().padStart(2, '0')
  return `${y}${seperator}${m}${seperator}${d}`
}

// 获取当前日期
export const getNowDate = (seperator = '-'): string => {
  const oDate = new Date()
  function zero(n: number) {
    return n > 9 ? n : `0${n}`
  }
  const year = oDate.getFullYear()
  const month = zero(oDate.getMonth() + 1)
  const date = zero(oDate.getDate())
  return `${year}${seperator}${month}${seperator}${date}`
}

// 获取当月1号
export const getMonthFirstDay = (seperator = '-'): string => {
  const oDate = new Date()
  function zero(n: number) {
    return n > 9 ? n : `0${n}`
  }
  const year = oDate.getFullYear()
  const month = zero(oDate.getMonth() + 1)
  return `${year}${seperator}${month}${seperator}01`
}

// 数字每千位加逗号
export const commafy = (num: [string, number]): string => {
  return num && num.toString()
    .replace(/\d+/, function (s) {
      return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    })
}

// 全局除法
/**
 * mole: 分子
 * deno：分母
 * point：保留小数点，默认保留两位
 */
export const percent = (mole: number, deno: any, point = 2): string => {
  if (!parseInt(deno)) {
    return `0.00%`
  }
  return `${((mole / deno) * 100).toFixed(point)}%`
}

export const division = (mole: number, deno: any, point = 2): string => {
  if (!parseInt(deno)) {
    return '0.00'
  }
  return `${(mole / deno).toFixed(point)}`
}

// 格式化url加参数
export const formatUrl = (url: string, params: string): string => {
  if (url.includes('?')) {
    url += `&${params}`
  } else {
    url += `?${params}`
  }
  return url
}

// 取两位小数
export const toFixed2 = (num: string | number): any => {
  const numStr = +num
  return num ? numStr.toFixed(2) : num
}

/**
 * 是否为数字（仅正数），包括正整数、正小数、0
 * @param value
 * @returns
 */
export const isNumber = (value: string | number): boolean => {
  const z_reg = /^(([0-9])|([1-9]([0-9]+)))(.[0-9]+)?$/;
  return z_reg.test(`${value}`)
}