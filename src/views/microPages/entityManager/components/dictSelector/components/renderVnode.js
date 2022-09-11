export default {
  name: 'RenderVnode',
  props: {
    vnode: [Array, Object, String, Number, Boolean],
  },
  render() {
    return this.vnode
  }
}