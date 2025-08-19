const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  candidateName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  resumeLink: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resumeFileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('applied', 'interview', 'offer', 'rejected'),
    defaultValue: 'applied',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  appliedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  interviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  skills: {
    type: DataTypes.TEXT,
    defaultValue: '',
    get() {
      const value = this.getDataValue('skills');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value || []));
    }
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Application;