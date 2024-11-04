const { Malette } = require('./index.js');

async function loopFetchResult(taskId) {
  const malette = new Malette({
    apiKey: '',
  });

  const result = await malette.getResults('TXT2IMG', taskId);
  console.log('获取结果:', result);
  if (result?.data?.stage === 'FINISHED') {
    return result.data;
  }
  await new Promise(resolve => setTimeout(resolve, 3000));
  return loopFetchResult(taskId);
}

async function testMalette() {
  try {
    const malette = new Malette({
      apiKey: '',
    });

    // 测试配置
    const tests = [
      {
        name: '基础图片生成',
        workflowCode: 'TXT2IMG',
        params: {
          "text6": "一只可爱的小狗",
          "batch_size5": "1",
          "width5": "1024",
          "height5": "1024",
          "ckpt_name4": "ArcadeXL_v0.2.safetensors"
        }
      }
      // 添加更多测试场景...
    ];

    // 运行所有测试
    for (const test of tests) {
      console.log(`\n开始测试: ${test.name}`);
      
      console.log('测试异步调用...');
      const asyncResult = await malette.run(
        test.workflowCode, 
        test.params,
        { timeout: 120 }  // 可以设置更长的超时时间
      );
      console.log('异步调用任务结果:', asyncResult);

      if (asyncResult?.data?.publicId) {
        const result = await loopFetchResult(asyncResult.data.publicId);
        console.log('异步调用结果:', result);
      } else {
        console.log('异步调用任务结果没有 publicId');
      }
      

      // console.log('测试同步调用...');
      // const syncResult = await malette.runSync(
      //   test.workflowCode, 
      //   test.params,
      //   { timeout: 300 }
      // );
      // console.log('同步调用结果:', syncResult);
    }

  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

testMalette(); 