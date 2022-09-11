export const require = {
  computed: {
    isShow() {
      const ctx = this;
      if (ctx.item.require) {
        let require = Object.keys(ctx.item.require).map(e=> {
          if (ctx.obj.model[e] === ctx.item.require[e]) {
            return true
          }
        })
        if (require.every(i=>i)) {
          return true
        }
      } else {
        return true
      }
    }
  },
}