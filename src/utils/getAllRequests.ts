export async function getAllRequests() {
  try {
    const result = await window.ipcRenderer.invoke('get-all-requests');
    console.log('Renderer received:', result);
    return result;
  } catch (error) {
    console.error('Failed to get requests:', error);
    return [];
  }
}