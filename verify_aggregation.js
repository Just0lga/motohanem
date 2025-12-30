const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function verify() {
  try {
    // 1. Get Models
    console.log('--- 获取所有 Model ---');
    const modelsRes = await axios.get(`${BASE_URL}/models`);
    const models = modelsRes.data.docs;
    
    if (models.length > 0) {
      const firstModel = models[0];
      console.log('First Model:', {
        id: firstModel._id,
        model: firstModel.model,
        commentCount: firstModel.commentCount,
        favoriteCount: firstModel.favoriteCount,
        averageRating: firstModel.averageRating
      });

      // 2. Get Comments for the first model
      console.log('\n--- Model 的评论 ---');
      const commentsRes = await axios.get(`${BASE_URL}/comments/model/${firstModel._id}`);
      console.log('Response Structure:', Object.keys(commentsRes.data));
      console.log('Average Rating:', commentsRes.data.averageRating);
      console.log('Comments Count:', commentsRes.data.comments.length);
    } else {
      console.log('No models found.');
    }

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

verify();
