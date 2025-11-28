export function setCanvasToParentDimension (canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  if (context) {
    context.canvas.width = canvas.offsetWidth;
    context.canvas.height = canvas.offsetHeight;
  }
}
