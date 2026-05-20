// Placeholder OCR service architecture.
// Future versions can connect screenshot capture + OCR provider here.

export async function extractTextFromImage(_imagePath) {
  // TODO: plug in OCR engine (local or cloud) in future.
  // Keep return shape stable for easy integration.
  return {
    ok: false,
    text: '',
    message: 'OCR is not implemented yet.'
  };
}
