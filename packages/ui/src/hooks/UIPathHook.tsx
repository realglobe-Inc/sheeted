import { UIPathBuilder, UIPathFuncs } from '@sheeted/core/build/web/Paths'

class UIPathsContainer {
  private uiPaths?: UIPathFuncs

  getInstance(): UIPathFuncs {
    if (this.uiPaths) {
      return this.uiPaths
    } else {
      const uiPaths = UIPathBuilder()
      this.uiPaths = uiPaths
      return uiPaths
    }
  }
}

const container = new UIPathsContainer()

export const useUIPaths = (): UIPathFuncs => {
  return container.getInstance()
}
