// 依赖安装：npm install express multer cors
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 简易照片记录文件
const DATA_FILE = 'photos.json';

// 读取照片列表
function getPhotos() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

// 保存照片列表
function savePhotos(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

// 获取全部照片
app.get('/api/photos', (req, res) => {
  res.json(getPhotos());
});

// 照片上传接口
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({error: 'No file uploaded'});
  const url = '/uploads/' + req.file.filename;
  const newPhoto = {
    url,
    title: req.file.originalname
  };
  const photos = getPhotos();
  photos.push(newPhoto);
  savePhotos(photos);
  res.json(newPhoto);
});

// 启动服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}`);
});