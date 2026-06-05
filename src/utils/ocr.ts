import { createWorker } from 'tesseract.js'

// OCR 识别菜单图片
export async function recognizeMenu(imageFile: File): Promise<Array<{ name: string; price: number }>> {
  const worker = await createWorker('chi_sim+eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        // 进度可通过回调暴露
      }
    },
  })

  try {
    const imageUrl = URL.createObjectURL(imageFile)
    const { data } = await worker.recognize(imageUrl)
    URL.revokeObjectURL(imageUrl)

    const text = data.text
    return parseMenuText(text)
  } finally {
    await worker.terminate()
  }
}

// 解析菜单文本，提取菜名和价格
function parseMenuText(text: string): Array<{ name: string; price: number }> {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const items: Array<{ name: string; price: number }> = []

  // 匹配 "菜名 ... 价格" 模式
  // 常见格式：菜名 ¥25、菜名 25元、菜名 25
  const pricePatterns = [
    /(.+?)[\s]*[¥￥]\s*(\d+(?:\.\d{1,2})?)\s*$/,
    /(.+?)[\s]*(\d+(?:\.\d{1,2})?)\s*元?\s*$/,
  ]

  for (const line of lines) {
    // 跳过太短的行、纯数字行、日期等
    if (line.length < 3 || /^\d+$/.test(line) || /^\d{4}[./-]/.test(line)) {
      continue
    }

    for (const pattern of pricePatterns) {
      const match = line.match(pattern)
      if (match) {
        const name = match[1].replace(/[^一-龥a-zA-Z0-9\s（）()【】\-·]/g, '').trim()
        const price = parseFloat(match[2])
        if (name.length >= 1 && price > 0 && price < 10000) {
          items.push({ name, price })
        }
        break
      }
    }
  }

  // 如果没匹配到价格行，尝试将每行作为菜名
  if (items.length === 0) {
    for (const line of lines) {
      if (line.length >= 2 && !/^\d+$/.test(line)) {
        const cleanName = line.replace(/[^一-龥a-zA-Z\s（）()【】\-·]/g, '').trim()
        if (cleanName.length >= 2) {
          items.push({ name: cleanName, price: 0 })
        }
      }
    }
  }

  return items
}
