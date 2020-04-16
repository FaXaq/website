export function setCanvasToParentDimension (canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  context.canvas.width = canvas.parentElement.offsetWidth
  context.canvas.width = canvas.parentElement.offsetHeight
}
