// Tính toán hướng chính xác giữa các cửa sổ
export const calculateWindowDirection = (sourceWindow, targetWindow) => {
  if (!sourceWindow || !targetWindow) return { x: 0, y: 0 }

  // Calculate center points of each window
  const sourceCenter = {
    x: sourceWindow.shape.x + sourceWindow.shape.w / 2,
    y: sourceWindow.shape.y + sourceWindow.shape.h / 2,
  }

  const targetCenter = {
    x: targetWindow.shape.x + targetWindow.shape.w / 2,
    y: targetWindow.shape.y + targetWindow.shape.h / 2,
  }

  // Calculate direction vector
  return {
    x: targetCenter.x - sourceCenter.x,
    y: sourceCenter.y - targetCenter.y, // Đảo ngược Y để phù hợp với hệ tọa độ màn hình
  }
}

// Tìm cửa sổ peer từ clientId và tabId
export const findPeerWindow = (windows, thisWindowId, clientId, tabId) => {
  return windows.find((w) => w.id !== thisWindowId && w.metaData?.clientId === clientId && w.metaData?.tabId === tabId)
}
