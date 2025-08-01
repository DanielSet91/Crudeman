import { ipcMain } from 'electron';
import { RequestHistoryDatabase } from '../database/db';

const db = new RequestHistoryDatabase();

export function registerRequestHandlers() {
  ipcMain.handle('save-request-to-history', async (_event, request) => {
    db.saveRequest(request);
    return { success: true };
  });

  ipcMain.handle('get-all-requests', () => db.getAllRequests());

  ipcMain.handle('delete-request', (_event, id) => {
    db.deleteRequest(id);
    return { success: true };
  });

  ipcMain.handle('update-request', (_event, { id, updates }) => {
    return db.editRequest(id, updates);
  });
}
