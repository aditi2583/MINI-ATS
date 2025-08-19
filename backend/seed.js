const { sequelize } = require('./config/database');
const User = require('./models/User');
const Application = require('./models/Application');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      role: 'recruiter'
    });
    console.log('Demo user created');

    // Create sample applications
    const applications = [
      {
        candidateName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 234 567 8901',
        role: 'Software Engineer',
        yearsOfExperience: 5,
        status: 'applied',
        location: 'New York, NY',
        salary: 120000,
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        notes: 'Strong background in full-stack development'
      },
      {
        candidateName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 234 567 8902',
        role: 'Product Manager',
        yearsOfExperience: 7,
        status: 'interview',
        location: 'San Francisco, CA',
        salary: 150000,
        skills: ['Agile', 'Scrum', 'JIRA', 'Product Strategy'],
        notes: 'Experience with B2B SaaS products',
        interviewDate: new Date('2024-02-15')
      },
      {
        candidateName: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 234 567 8903',
        role: 'Data Scientist',
        yearsOfExperience: 4,
        status: 'offer',
        location: 'Seattle, WA',
        salary: 135000,
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
        notes: 'PhD in Computer Science, strong ML background'
      },
      {
        candidateName: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '+1 234 567 8904',
        role: 'UX Designer',
        yearsOfExperience: 6,
        status: 'rejected',
        location: 'Austin, TX',
        salary: 110000,
        skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
        notes: 'Portfolio shows strong visual design skills'
      },
      {
        candidateName: 'Robert Wilson',
        email: 'robert.w@email.com',
        role: 'DevOps Engineer',
        yearsOfExperience: 8,
        status: 'interview',
        location: 'Denver, CO',
        salary: 140000,
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        notes: 'AWS certified, experience with large-scale deployments'
      },
      {
        candidateName: 'Lisa Anderson',
        email: 'lisa.a@email.com',
        role: 'Software Engineer',
        yearsOfExperience: 3,
        status: 'applied',
        location: 'Boston, MA',
        salary: 105000,
        skills: ['Java', 'Spring Boot', 'React', 'MongoDB'],
        notes: 'Recent bootcamp graduate with strong projects'
      },
      {
        candidateName: 'David Martinez',
        email: 'david.m@email.com',
        phone: '+1 234 567 8907',
        role: 'Software Engineer',
        yearsOfExperience: 10,
        status: 'offer',
        location: 'Los Angeles, CA',
        salary: 160000,
        skills: ['Python', 'Django', 'Vue.js', 'PostgreSQL'],
        notes: 'Senior engineer with team lead experience'
      },
      {
        candidateName: 'Jennifer Taylor',
        email: 'jennifer.t@email.com',
        role: 'Product Manager',
        yearsOfExperience: 5,
        status: 'applied',
        location: 'Chicago, IL',
        salary: 130000,
        skills: ['Product Management', 'Analytics', 'A/B Testing'],
        notes: 'Background in data-driven product development'
      },
      {
        candidateName: 'James Brown',
        email: 'james.b@email.com',
        role: 'Data Scientist',
        yearsOfExperience: 2,
        status: 'interview',
        location: 'Miami, FL',
        salary: 95000,
        skills: ['R', 'Python', 'Statistics', 'Data Visualization'],
        notes: 'Masters in Statistics, strong analytical skills'
      },
      {
        candidateName: 'Patricia Garcia',
        email: 'patricia.g@email.com',
        phone: '+1 234 567 8910',
        role: 'UX Designer',
        yearsOfExperience: 4,
        status: 'applied',
        location: 'Portland, OR',
        salary: 100000,
        skills: ['Adobe XD', 'Wireframing', 'User Testing', 'CSS'],
        notes: 'Experience in mobile app design'
      }
    ];

    for (const app of applications) {
      await Application.create(app);
    }
    console.log(`${applications.length} sample applications created`);

    console.log('\nSeed completed successfully!');
    console.log('\nDemo credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();