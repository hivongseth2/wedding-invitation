// Quản lý tương tác giữa các cửa sổ
class InteractionManager {
    constructor(socket, clientId, tabId) {
      this.socket = socket
      this.clientId = clientId
      this.tabId = tabId
      this.interactionState = {
        isActive: false,
        intensity: 0,
        lastBroadcast: 0,
      }
      this.peerInteractions = {}
  
      // Thiết lập socket listeners
      this.setupSocketListeners()
    }
  
    setupSocketListeners() {
      // Nhận tương tác từ các peer khác
      this.socket.on("peer-interaction", (data) => {
        const id = `${data.clientId}-${data.tabId}`
  
        // Không xử lý tương tác từ chính mình
        if (data.clientId === this.clientId && data.tabId === this.tabId) return
  
        // Cập nhật trạng thái tương tác của peer
        this.peerInteractions[id] = {
          intensity: data.intensity,
          timestamp: Date.now(),
        }
      })
    }
  
    // Cập nhật trạng thái tương tác cục bộ
    updateLocalInteraction(isActive) {
      this.interactionState.isActive = isActive
  
      // Cập nhật cường độ tương tác với hiệu ứng mượt mà
      if (isActive) {
        this.interactionState.intensity = Math.min(1.0, this.interactionState.intensity + 0.05)
      } else {
        this.interactionState.intensity = Math.max(0.0, this.interactionState.intensity - 0.03)
      }
  
      // Broadcast tương tác nếu có thay đổi đáng kể
      this.broadcastInteractionIfNeeded()
  
      return this.interactionState.intensity
    }
  
    // Broadcast trạng thái tương tác đến các peer khác
    broadcastInteractionIfNeeded() {
      const now = Date.now()
  
      // Chỉ broadcast mỗi 100ms để tránh quá tải
      if (now - this.interactionState.lastBroadcast > 100) {
        this.socket.emit("interaction", {
          clientId: this.clientId,
          tabId: this.tabId,
          intensity: this.interactionState.intensity,
        })
  
        this.interactionState.lastBroadcast = now
      }
    }
  
    // Lấy cường độ tương tác tổng hợp từ tất cả các peer
    getAggregateInteractionIntensity() {
      // Bắt đầu với cường độ tương tác cục bộ
      let maxIntensity = this.interactionState.intensity
  
      // Kiểm tra tương tác từ các peer khác
      const now = Date.now()
      Object.entries(this.peerInteractions).forEach(([id, interaction]) => {
        // Chỉ xem xét các tương tác trong 2 giây gần đây
        if (now - interaction.timestamp < 2000) {
          // Lấy cường độ cao nhất từ tất cả các nguồn
          maxIntensity = Math.max(maxIntensity, interaction.intensity)
        } else {
          // Xóa các tương tác cũ
          delete this.peerInteractions[id]
        }
      })
  
      return maxIntensity
    }
  
    // Xóa tất cả listeners khi hủy
    cleanup() {
      this.socket.off("peer-interaction")
    }
  }
  
  export default InteractionManager
  