const { describe, test, expect, beforeEach } = require('@jest/globals');
const { Malette } = require('../index.js');

describe('Malette SDK', () => {
  let malette;
  const mockApiKey = 'test-api-key';
  const mockWorkflowCode = 'test-workflow';
  const mockParams = { param1: 'value1' };
  
  beforeEach(() => {
    global.fetch = jest.fn();
    malette = new Malette({ apiKey: mockApiKey });
  });

  describe('constructor', () => {
    test('应该使用默认endpoint初始化', () => {
      const client = new Malette({ apiKey: mockApiKey });
      expect(client.apiKey).toBe(mockApiKey);
      expect(client.endpoint).toBe('https://api.malette.art');
    });

    test('应该使用自定义endpoint初始化', () => {
      const customEndpoint = 'https://custom.endpoint';
      const client = new Malette({ apiKey: mockApiKey, endpoint: customEndpoint });
      expect(client.endpoint).toBe(customEndpoint);
    });
  });

  describe('run', () => {
    test('成功运行工作流', async () => {
      const mockResponse = { taskId: '123' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await malette.run(mockWorkflowCode, mockParams);
      
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.malette.art/open/api/v1/workflow/${mockWorkflowCode}`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockApiKey}`,
          },
          body: JSON.stringify({ params: mockParams }),
        })
      );
    });

    test('没有apiKey时应该抛出错误', async () => {
      const invalidMalette = new Malette({});
      await expect(invalidMalette.run(mockWorkflowCode, mockParams))
        .rejects
        .toThrow('apiKey is required');
    });

    test('超时应该抛出Timeout错误', async () => {
      global.fetch.mockImplementationOnce(() => new Promise((resolve) => {
        setTimeout(resolve, 2000);
      }));

      await expect(malette.run(mockWorkflowCode, mockParams, { timeout: 1 }))
        .rejects
        .toThrow('Timeout');
    });
  });

  describe('getResults', () => {
    test('成功获取结果', async () => {
      const mockTaskId = '123';
      const mockResponse = { status: 'completed', result: 'success' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await malette.getResults(mockWorkflowCode, mockTaskId);
      
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.malette.art/open/api/v1/workflow/${mockWorkflowCode}/results`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockApiKey}`,
          },
          body: JSON.stringify({ taskId: mockTaskId }),
        })
      );
    });
  });

  describe('runSync', () => {
    test('成功同步运行工作流', async () => {
      const mockResponse = { result: 'success' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await malette.runSync(mockWorkflowCode, mockParams);
      
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.malette.art/open/api/v1/workflow/${mockWorkflowCode}/sync`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockApiKey}`,
          },
          body: JSON.stringify({ params: mockParams }),
        })
      );
    });

    test('超时应该抛出Timeout错误', async () => {
      global.fetch.mockImplementationOnce(() => new Promise((resolve) => {
        setTimeout(resolve, 2000);
      }));

      await expect(malette.runSync(mockWorkflowCode, mockParams, { timeout: 1 }))
        .rejects
        .toThrow('Timeout');
    });
  });
});