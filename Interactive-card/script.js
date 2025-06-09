class DraggableLayout {
  constructor() {
    this.isDragging = false
    this.currentElement = null
    this.offset = { x: 0, y: 0 }
    this.productMain = document.getElementById("productMain")
    this.detailBlocks = document.querySelectorAll(".detail-block")

    this.init()
  }

  init() {
    this.detailBlocks.forEach((block) => {
      this.addDragListeners(block)
    })

    // 初始化连接线
    this.updateAllLines()

    // 窗口大小改变时更新连接线
    window.addEventListener("resize", () => {
      this.updateAllLines()
    })
  }

  addDragListeners(element) {
    // 鼠标事件
    element.addEventListener("mousedown", (e) => this.startDrag(e, element))
    document.addEventListener("mousemove", (e) => this.drag(e))
    document.addEventListener("mouseup", () => this.endDrag())

    // 触摸事件（移动端支持）
    element.addEventListener("touchstart", (e) => this.startDrag(e.touches[0], element))
    document.addEventListener("touchmove", (e) => {
      e.preventDefault()
      this.drag(e.touches[0])
    })
    document.addEventListener("touchend", () => this.endDrag())
  }

  startDrag(e, element) {
    this.isDragging = true
    this.currentElement = element
    element.classList.add("dragging")

    const rect = element.getBoundingClientRect()
    this.offset.x = e.clientX - rect.left
    this.offset.y = e.clientY - rect.top

    // 防止文本选择
    document.body.style.userSelect = "none"
  }

  drag(e) {
    if (!this.isDragging || !this.currentElement) return

    const x = e.clientX - this.offset.x
    const y = e.clientY - this.offset.y

    // 边界检测
    const containerRect = document.querySelector(".container").getBoundingClientRect()
    const elementRect = this.currentElement.getBoundingClientRect()

    const maxX = containerRect.width - elementRect.width
    const maxY = containerRect.height - elementRect.height

    const constrainedX = Math.max(0, Math.min(x, maxX))
    const constrainedY = Math.max(0, Math.min(y, maxY))

    this.currentElement.style.left = constrainedX + "px"
    this.currentElement.style.top = constrainedY + "px"
    this.currentElement.style.right = "auto"
    this.currentElement.style.bottom = "auto"

    // 更新对应的连接线
    this.updateLine(this.currentElement)
  }

  endDrag() {
    if (this.currentElement) {
      this.currentElement.classList.remove("dragging")
    }

    this.isDragging = false
    this.currentElement = null
    document.body.style.userSelect = ""
  }

  updateLine(detailBlock) {
    const lineId = detailBlock.getAttribute("data-line")
    const line = document.getElementById(lineId)

    const productRect = this.productMain.getBoundingClientRect()
    const detailRect = detailBlock.getBoundingClientRect()
    const containerRect = document.querySelector(".container").getBoundingClientRect()

    // 计算相对于容器的坐标
    const productCenterX = productRect.left + productRect.width / 2 - containerRect.left
    const productCenterY = productRect.top + productRect.height / 2 - containerRect.top

    const detailCenterX = detailRect.left + detailRect.width / 2 - containerRect.left
    const detailCenterY = detailRect.top + detailRect.height / 2 - containerRect.top

    // 计算连接点（在矩形边缘而不是中心）
    const productConnection = this.getConnectionPoint(
      productCenterX,
      productCenterY,
      productRect.width / 2,
      productRect.height / 2,
      detailCenterX,
      detailCenterY,
    )

    const detailConnection = this.getConnectionPoint(
      detailCenterX,
      detailCenterY,
      detailRect.width / 2,
      detailRect.height / 2,
      productCenterX,
      productCenterY,
    )

    line.setAttribute("x1", productConnection.x)
    line.setAttribute("y1", productConnection.y)
    line.setAttribute("x2", detailConnection.x)
    line.setAttribute("y2", detailConnection.y)
  }

  getConnectionPoint(centerX, centerY, halfWidth, halfHeight, targetX, targetY) {
    const dx = targetX - centerX
    const dy = targetY - centerY

    // 计算射线与矩形边界的交点
    const absRatioX = Math.abs(dx / halfWidth)
    const absRatioY = Math.abs(dy / halfHeight)

    if (absRatioX > absRatioY) {
      // 与左右边相交
      const x = centerX + (dx > 0 ? halfWidth : -halfWidth)
      const y = centerY + dy * (halfWidth / Math.abs(dx))
      return { x, y }
    } else {
      // 与上下边相交
      const x = centerX + dx * (halfHeight / Math.abs(dy))
      const y = centerY + (dy > 0 ? halfHeight : -halfHeight)
      return { x, y }
    }
  }

  updateAllLines() {
    this.detailBlocks.forEach((block) => {
      this.updateLine(block)
    })
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  new DraggableLayout()
})

// 添加一些交互提示
document.addEventListener("DOMContentLoaded", () => {
  const detailBlocks = document.querySelectorAll(".detail-block")

  detailBlocks.forEach((block, index) => {
    block.addEventListener("click", () => {
      // 点击时的反馈效果
      block.style.transform = "scale(0.95)"
      setTimeout(() => {
        block.style.transform = ""
      }, 150)
    })

    // 添加双击重置位置功能
    block.addEventListener("dblclick", () => {
      resetBlockPosition(block, index)
    })
  })
})

function resetBlockPosition(block, index) {
  const positions = [
    { top: "80px", left: "80px", right: "auto", bottom: "auto" },
    { top: "80px", right: "80px", left: "auto", bottom: "auto" },
    { bottom: "80px", left: "80px", right: "auto", top: "auto" },
    { bottom: "80px", right: "80px", left: "auto", top: "auto" },
  ]

  const pos = positions[index]
  Object.assign(block.style, pos)

  // 更新连接线
  setTimeout(() => {
    const layout = new DraggableLayout()
    layout.updateLine(block)
  }, 100)
}
