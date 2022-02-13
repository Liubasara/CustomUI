/** https://unpkg.com/browse/element-ui@2.15.7/src/utils/popup/popup-manager.js */
const DEFAULT_ZINDEX = 2800
let hasInitZIndex = false
let zIndex

/** @type {{ nextZIndex: Function, setZIndex: Function, zIndex: number }} */
export const ZIndexManager = {
  setZIndex(
    /** @type {number} */
    val
  ) {
    ZIndexManager.zIndex = val
  },
  nextZIndex() {
    return ZIndexManager.zIndex++
  }
}

Object.defineProperty(ZIndexManager, 'zIndex', {
  configurable: true,
  get() {
    if (!hasInitZIndex) {
      zIndex = zIndex || DEFAULT_ZINDEX
      hasInitZIndex = true
    }
    return zIndex
  },
  set(value) {
    zIndex = value
  }
})
