import aiClientService from './services/aiClientService.js';
import path from 'path';

const testParse = async () => {
  const filePath = 'uploads/resume-1780770089400-183526129.pdf';
  const result = await aiClientService.parseResume(filePath);
  console.log(JSON.stringify(result, null, 2));
};

testParse();
