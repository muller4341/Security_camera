const uploadScreenshot = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  res.status(200).json({ message: 'Screenshot uploaded successfully.' });
};

export default { uploadScreenshot };