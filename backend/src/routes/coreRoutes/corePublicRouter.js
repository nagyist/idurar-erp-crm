const express = require('express');
const router = express.Router();

const path = require('path');
const { isPathInside } = require('../../utils/is-path-inside');

router.route('/:subPath/:directory/:file').get(function (req, res) {
  try {
    const { subPath, directory, file } = req.params;

    // Define the trusted root directory
    const rootDir = path.join(__dirname, '../../public');

    const relativePath = path.join(subPath, directory, file);
    const absolutePath = path.join(rootDir, relativePath);

    // Check if the resulting path stays inside rootDir
    if (!isPathInside(absolutePath, rootDir)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filepath',
      });
    }

    return res.sendFile(absolutePath, (error) => {
      if (error) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'we could not find : ' + file,
        });
      }
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
});

module.exports = router;
