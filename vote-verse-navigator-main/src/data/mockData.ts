
// Mock election data for university voting system with real student data
export const mockPositionsData = [
  { id: 1, title: 'University President', description: 'Overall leader representing all students', maxVotes: 1 },
  { id: 2, title: 'College Governor', description: 'Representative for the College of Informatics and Virtual Education', maxVotes: 1 },
  { id: 3, title: 'Block Representative', description: 'Representative for student accommodation and dormitory issues', maxVotes: 1 },
];

export const mockCandidatesData = [
  { 
    id: 1, 
    firstName: 'Rebeca', 
    lastName: 'Samanda', 
    name: 'Rebeca Samanda',
    position: 'University President',
    platform: 'Innovation and Digital Transformation for student services', 
    manifesto: 'I envision a university where technology serves every student. My platform focuses on digitizing student services, creating innovation hubs, and ensuring every student has access to modern learning tools. Together, we will build a smart campus that prepares us for the digital future.',
    votes: 6, 
    voteCount: 6,
    imageUrl: '/lovable-uploads/5fb8295e-03ba-4dce-b017-bd5a98dd44fe.png', 
    regNumber: 'T21-03-04721',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    program: 'BSc. Software Engineering',
    college: 'CIVE'
  },
  { 
    id: 2, 
    firstName: 'Gehazi', 
    lastName: 'Gwambaye', 
    name: 'Gehazi Gwambaye',
    position: 'University President', 
    platform: 'Academic Excellence and Research Development Initiative', 
    manifesto: 'Academic excellence is the foundation of our university. I will work to establish research centers, improve library facilities, create mentorship programs, and foster partnerships with industry leaders to enhance our academic experience.',
    votes: 4, 
    voteCount: 4,
    imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', 
    regNumber: 'T21-03-03128',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    program: 'BSc. Software Engineering',
    college: 'CIVE'
  },
  { 
    id: 3, 
    firstName: 'Anderson', 
    lastName: 'Mollel', 
    name: 'Anderson Mollel',
    position: 'College Governor', 
    platform: 'Technology Infrastructure and Innovation Hub', 
    manifesto: 'CIVE should lead in technological innovation. I will establish coding bootcamps, hackathon events, industry partnerships, and modern computer labs to ensure our college remains at the forefront of technology.',
    votes: 5, 
    voteCount: 5,
    imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', 
    regNumber: 'T21-03-13092',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    program: 'BSc. Software Engineering',
    college: 'CIVE'
  },
  { 
    id: 4, 
    firstName: 'Grace', 
    lastName: 'John', 
    name: 'Grace John',
    position: 'College Governor', 
    platform: 'CIVE Student Academic Support and Career Development', 
    manifesto: 'Success is not just about grades, but career readiness. I will create career counseling services, job placement programs, skill development workshops, and alumni networking events for CIVE students.',
    votes: 5, 
    voteCount: 5,
    imageUrl: '/lovable-uploads/5fb8295e-03ba-4dce-b017-bd5a98dd44fe.png', 
    regNumber: 'T21-01-5432',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    program: 'BSc. Software Engineering',
    college: 'CIVE'
  },
  { 
    id: 5, 
    firstName: 'Mengwa', 
    lastName: 'Katambi', 
    name: 'Mengwa Katambi',
    position: 'Block Representative', 
    platform: 'Better Dorm Facilities and Student Accommodation', 
    manifesto: 'A comfortable living environment is essential for academic success. I will work to improve dormitory conditions, ensure reliable utilities, create study spaces, and advocate for affordable accommodation options.',
    votes: 6, 
    voteCount: 6,
    imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', 
    regNumber: 'T21-03-04972',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    program: 'BSc. Software Engineering',
    college: 'CIVE'
  },
  { 
    id: 6, 
    firstName: 'Mary', 
    lastName: 'Joseph', 
    name: 'Mary Joseph',
    position: 'Block Representative', 
    platform: 'Health Services and Student Support Systems', 
    manifesto: 'Student health and wellbeing are my priorities. I will enhance medical services, establish counseling centers, create wellness programs, and ensure every student has access to quality healthcare and support.',
    votes: 4, 
    voteCount: 4,
    imageUrl: '/lovable-uploads/5fb8295e-03ba-4dce-b017-bd5a98dd44fe.png', 
    regNumber: 'T21-02-9876',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    program: 'Bachelor of Education',
    college: 'COED'
  },
];

export const mockVotersData = [
  { id: 1, firstName: 'Rebeca', lastName: 'Samanda', name: 'Rebeca Samanda', email: 'rebeca.samanda@udom.ac.tz', studentId: 'T21-03-04721', regNumber: 'T21-03-04721', college: 'CIVE', program: 'BSc. Software Engineering', votingStatus: 'Voted', registrationDate: '2023-01-15', role: 'VOTER', imageUrl: '/lovable-uploads/5fb8295e-03ba-4dce-b017-bd5a98dd44fe.png', username: 'rebeca.samanda' },
  { id: 2, firstName: 'Gehazi', lastName: 'Gwambaye', name: 'Gehazi Gwambaye', email: 'gehazi.gwambaye@udom.ac.tz', studentId: 'T21-03-03128', regNumber: 'T21-03-03128', college: 'CIVE', program: 'BSc. Software Engineering', votingStatus: 'Voted', registrationDate: '2023-01-16', role: 'VOTER', imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', username: 'gehazi.gwambaye' },
  { id: 3, firstName: 'Godlisten', lastName: 'Nanyaro', name: 'Godlisten Nanyaro', email: 'godlisten.nanyaro@udom.ac.tz', studentId: 'T21-03-12992', regNumber: 'T21-03-12992', college: 'CIVE', program: 'BSc. Software Engineering', votingStatus: 'Not Voted', registrationDate: '2023-01-17', role: 'VOTER', imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', username: 'godlisten.nanyaro' },
  { id: 4, firstName: 'Anderson', lastName: 'Mollel', name: 'Anderson Mollel', email: 'anderson.mollel@udom.ac.tz', studentId: 'T21-03-13092', regNumber: 'T21-03-13092', college: 'CIVE', program: 'BSc. Software Engineering', votingStatus: 'Voted', registrationDate: '2023-01-18', role: 'VOTER', imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', username: 'anderson.mollel' },
  { id: 5, firstName: 'Mengwa', lastName: 'Katambi', name: 'Mengwa Katambi', email: 'mengwa.katambi@udom.ac.tz', studentId: 'T21-03-04972', regNumber: 'T21-03-04972', college: 'CIVE', program: 'BSc. Software Engineering', votingStatus: 'Voted', registrationDate: '2023-01-19', role: 'VOTER', imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', username: 'mengwa.katambi' },
  { id: 6, firstName: 'System', lastName: 'Administrator', name: 'System Administrator', email: 'admin@udom.ac.tz', studentId: 'ADM001', regNumber: 'ADM001', college: 'Administration', program: 'N/A', votingStatus: 'N/A', registrationDate: '2022-12-01', role: 'ADMIN', imageUrl: '', username: 'admin' },
  { id: 7, firstName: 'Daniel', lastName: 'Mwalimu', name: 'Daniel Mwalimu', email: 'daniel.mwalimu@udom.ac.tz', studentId: 'T21-02-7890', regNumber: 'T21-02-7890', college: 'COBA', program: 'Bachelor of Business Administration', votingStatus: 'Not Voted', registrationDate: '2023-01-20', role: 'VOTER', imageUrl: '/lovable-uploads/5fb8295e-03ba-4dce-b017-bd5a98dd44fe.png', username: 'daniel.mwalimu' },
  { id: 8, firstName: 'Grace', lastName: 'John', name: 'Grace John', email: 'grace.john@udom.ac.tz', studentId: 'T21-01-5432', regNumber: 'T21-01-5432', college: 'CIVE', program: 'BSc. Software Engineering', votingStatus: 'Voted', registrationDate: '2023-01-21', role: 'VOTER', imageUrl: '/lovable-uploads/5fb8295e-03ba-4dce-b017-bd5a98dd44fe.png', username: 'grace.john' },
  { id: 9, firstName: 'Peter', lastName: 'Michael', name: 'Peter Michael', email: 'peter.michael@udom.ac.tz', studentId: 'T20-03-1234', regNumber: 'T20-03-1234', college: 'CIVE', program: 'BSc. Computer Science', votingStatus: 'Not Voted', registrationDate: '2023-01-22', role: 'VOTER', imageUrl: '/lovable-uploads/803e3162-f435-4c74-b67f-38c08ab001b2.png', username: 'peter.michael' },
  { id: 10, firstName: 'Mary', lastName: 'Joseph', name: 'Mary Joseph', email: 'mary.joseph@udom.ac.tz', studentId: 'T21-02-9876', regNumber: 'T21-02-9876', college: 'COED', program: 'Bachelor of Education', votingStatus: 'Voted', registrationDate: '2023-01-23', role: 'VOTER', imageUrl: '/lovable-uploads/5fb8295e-03ba-4dce-b017-bd5a98dd44fe.png', username: 'mary.joseph' },
];

export const mockFeedbacks = [
  { id: 1, userId: 1, userName: 'Rebeca Samanda', feedbackText: 'The voting system interface is very intuitive and easy to use. Great job on the voice assistance feature!', createdDate: '2023-05-10' },
  { id: 2, userId: 2, userName: 'Gehazi Gwambaye', feedbackText: 'I had some difficulties accessing the voting portal initially, but the support team helped resolve it quickly.', createdDate: '2023-05-11' },
  { id: 3, userId: 3, userName: 'Godlisten Nanyaro', feedbackText: 'The voice assistance feature makes the voting process very accessible for all students.', createdDate: '2023-05-12' },
  { id: 4, userId: 4, userName: 'Anderson Mollel', feedbackText: 'I would suggest adding more information about each candidate background and their previous achievements.', createdDate: '2023-05-13' },
  { id: 5, userId: 5, userName: 'Mengwa Katambi', feedbackText: 'The system works well on mobile devices, which is very convenient for students on the go.', createdDate: '2023-05-14' },
];

// Election details
export const mockElection = {
  id: 1,
  title: "University Government Election 2025",
  description: "Annual election for university government positions including President, College Governor, and Block Representative",
  startDate: "2025-01-01T08:00:00",
  endDate: "2025-01-15T18:00:00",
  status: "active",
  totalVoters: 10,
  votedVoters: 7
};

// Vote count per position and candidate
export const mockResults = {
  positions: [
    {
      title: "University President",
      candidates: [
        { name: "Rebeca Samanda", votes: 6 },
        { name: "Gehazi Gwambaye", votes: 4 }
      ]
    },
    {
      title: "College Governor",
      candidates: [
        { name: "Anderson Mollel", votes: 5 },
        { name: "Grace John", votes: 5 }
      ]
    },
    {
      title: "Block Representative",
      candidates: [
        { name: "Mengwa Katambi", votes: 6 },
        { name: "Mary Joseph", votes: 4 }
      ]
    }
  ]
};

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
