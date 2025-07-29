import { RequestService } from '../RequestService';

describe('RequestService.send', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    window.ipcRenderer = {
      invoke: jest.fn(),
    } as unknown as Electron.IpcRenderer;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should send GET request and handle JSON response', async () => {
    const mockResponseData = { message: 'hello' };

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      headers: {
        get: (headerName: string) => (headerName === 'content-type' ? 'application/json' : null),
      },
      json: jest.fn().mockResolvedValue(mockResponseData),
      text: jest.fn(),
    });

    (window.ipcRenderer.invoke as jest.Mock).mockResolvedValue(true);

    const response = await RequestService.send({
      method: 'GET',
      url: 'https://api.example.com/data',
      headers: { Accept: 'application/json' },
      params: { q: 'test' },
    });

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data?q=test', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: undefined,
    });

    expect(window.ipcRenderer.invoke).toHaveBeenCalledWith('save-request-to-history', {
      method: 'GET',
      url: 'https://api.example.com/data',
      headers: { Accept: 'application/json' },
      params: { q: 'test' },
      body: undefined,
      status: 200,
      ok: true,
      response_data: JSON.stringify(mockResponseData),
    });

    expect(response).toEqual({
      status: 200,
      ok: true,
      data: mockResponseData,
    });
  });

  it('should send POST request and handle text response', async () => {
    const mockTextResponse = 'Success!';

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 201,
      ok: true,
      headers: {
        get: (headerName: string) => (headerName === 'content-type' ? 'text/plain' : null),
      },
      json: jest.fn(),
      text: jest.fn().mockResolvedValue(mockTextResponse),
    });

    (window.ipcRenderer.invoke as jest.Mock).mockResolvedValue(true);

    const response = await RequestService.send({
      method: 'POST',
      url: 'https://api.example.com/submit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Tester' }),
    });

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Tester' }),
    });

    expect(window.ipcRenderer.invoke).toHaveBeenCalledWith('save-request-to-history', {
      method: 'POST',
      url: 'https://api.example.com/submit',
      headers: { 'Content-Type': 'application/json' },
      params: {},
      body: JSON.stringify({ name: 'Tester' }),
      status: 201,
      ok: true,
      response_data: mockTextResponse,
    });

    expect(response).toEqual({
      status: 201,
      ok: true,
      data: mockTextResponse,
    });
  });

  it('should handle fetch failure gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (window.ipcRenderer.invoke as jest.Mock).mockResolvedValue(true);

    await expect(
      RequestService.send({
        method: 'GET',
        url: 'https://api.example.com/fail',
        headers: {},
        params: {},
      })
    ).rejects.toThrow('Network error');

    consoleErrorSpy.mockRestore();
  });
});
