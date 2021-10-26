
import ElementPlus from 'element-plus'
import type { App } from 'vue'

// 按需引入
export function setupElement(app: App<Element>): void {
  app.use(ElementPlus, { size: 'small', zIndex: 3000 })
}

export function setupGlobal(app: App<Element>): void {
  // 导入svg图标
  // const req = require.context('@/assets/icons', true, /\.svg$/)
  // req.keys().map(req)

  // 将global-com文件夹下的组件注册为全局组件
  const requireElement = require.context('@/components/global-com', true, /.vue$/)
  requireElement.keys().forEach(fileName => {
    const template = requireElement(fileName)
    app.component(
      fileName.split('/')[1].split('.')[0],
      template.default || template
    )
  })
}
