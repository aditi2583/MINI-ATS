const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, role, search, minExperience, maxExperience } = req.query;
    const where = {};

    if (status) where.status = status;
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { candidateName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { role: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (minExperience || maxExperience) {
      where.yearsOfExperience = {};
      if (minExperience) where.yearsOfExperience[Op.gte] = parseInt(minExperience);
      if (maxExperience) where.yearsOfExperience[Op.lte] = parseInt(maxExperience);
    }

    const applications = await Application.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.findAll();
    
    const statusCounts = {
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    };
    
    const roleBreakdown = {};
    let totalExperience = 0;
    let experienceCount = 0;

    applications.forEach(app => {
      statusCounts[app.status]++;
      
      if (roleBreakdown[app.role]) {
        roleBreakdown[app.role]++;
      } else {
        roleBreakdown[app.role] = 1;
      }
      
      if (app.yearsOfExperience !== null) {
        totalExperience += app.yearsOfExperience;
        experienceCount++;
      }
    });

    const avgExperience = experienceCount > 0 ? (totalExperience / experienceCount).toFixed(1) : 0;

    const monthlyTrends = {};
    applications.forEach(app => {
      const month = new Date(app.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (monthlyTrends[month]) {
        monthlyTrends[month]++;
      } else {
        monthlyTrends[month] = 1;
      }
    });

    res.json({
      totalApplications: applications.length,
      statusCounts,
      roleBreakdown,
      avgExperience: parseFloat(avgExperience),
      monthlyTrends,
      conversionRate: applications.length > 0 
        ? ((statusCounts.offer / applications.length) * 100).toFixed(1)
        : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const applicationData = req.body;
    
    if (req.file) {
      applicationData.resumeLink = `/uploads/resumes/${req.file.filename}`;
      applicationData.resumeFileName = req.file.originalname;
    }

    if (applicationData.skills && typeof applicationData.skills === 'string') {
      applicationData.skills = applicationData.skills.split(',').map(s => s.trim());
    }

    const application = await Application.create(applicationData);
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const updateData = req.body;
    
    if (req.file) {
      updateData.resumeLink = `/uploads/resumes/${req.file.filename}`;
      updateData.resumeFileName = req.file.originalname;
    }

    if (updateData.skills && typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map(s => s.trim());
    }

    await application.update(updateData);
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByPk(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await application.update({ status });
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await application.destroy();
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;