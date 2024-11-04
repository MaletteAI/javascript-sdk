const DEFAULT_ENDPOINT = 'https://api.malette.art';


/**
 * @class Malette
 * @classdesc Malette API client
 */
class Malette {

  /**
   * @param {Object} options - Malette options
   * @param {string} options.apiKey - Malette API key
   * @param {string} options.endpoint - Malette API endpoint
   */
  constructor(options = {}) {
    const { apiKey, endpoint } = options;
    this.apiKey = apiKey;
    this.endpoint = endpoint || DEFAULT_ENDPOINT;
  }

  /**
   * @param {string} workflowCode - Malette workflow code
   * @param {Object} params - Malette workflow parameters
   * @param {Object} options - Malette options
   */
  async run(workflowCode, params, options = {}) {
    const { apiKey, endpoint } = this;
    if (!apiKey) {
      throw new Error('apiKey is required');
    }
    if (!workflowCode) {
      throw new Error('workflowCode is required');
    }
    const { timeout = 60 } = options;
    const url = `${endpoint}/open/api/v1/workflow/${workflowCode}`;

    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const timeoutError = new Error('Timeout');
        timeoutError.name = 'TimeoutError';
        reject(timeoutError);
      }, timeout * 1000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ ...params }),
        });

        clearTimeout(timeoutId);

        if (!response) {
          throw new Error('No response received');
        }
        console.log(`[Malette] Response: `, response);
        const result = await response.json();
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * @param {string} workflowCode - Malette workflow code
   * @param {string} taskId - Malette task ID
   * @param {Object} options - Malette options
   */
  async getResults(workflowCode, taskId, options = {}) {
    const { apiKey, endpoint } = this;
    if (!apiKey) {
      throw new Error('apiKey is required');
    }
    if (!workflowCode) {
      throw new Error('workflowCode is required');
    }
    const url = `${endpoint}/open/api/v1/workflow/${workflowCode}/results`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ taskId }),
    });
    return await response.json();
  }

  /**
   * @param {string} workflowCode - Malette workflow code
   * @param {Object} params - Malette workflow parameters
   * @param {Object} options - Malette options
   */
  async runSync(workflowCode, params, options = {}) {
    const { apiKey, endpoint } = this;
    if (!apiKey) {
      throw new Error('apiKey is required');
    }
    if (!workflowCode) {
      throw new Error('workflowCode is required');
    }
    const { timeout = 300 } = options;
    const url = `${endpoint}/open/api/v1/workflow/${workflowCode}/sync`;

    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const timeoutError = new Error('Timeout');
        timeoutError.name = 'TimeoutError';
        reject(timeoutError);
      }, timeout * 1000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ ...params }),
        });

        clearTimeout(timeoutId);

        if (!response) {
          throw new Error('No response received');
        }
        const result = await response.json();
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

}

module.exports = {
  Malette,
};
