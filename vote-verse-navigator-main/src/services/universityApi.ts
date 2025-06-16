
/**
 * University of Dodoma API Service
 * 
 * This service simulates fetching data from the university's SR2 system.
 * In a real application, this would connect to actual university APIs.
 */

// Mock university database users with your group members' data
const universityUsers = [
  { 
    regNumber: "T21-03-04721", 
    name: "Rebeca Samanda",
    email: "rebeca.samanda@udom.ac.tz",
    voiceSampleUrl: "voices/T21-03-04721.wav",
    program: "BSc. Software Engineering",
    room: "Block 5A-S10",
    college: "CIVE",
    phone: "0672612345",
    YoS: 3
  },
  { 
    regNumber: "T21-03-03128", 
    name: "Gehazi Gwambaye",
    email: "gehazi.gwambaye@udom.ac.tz",
    voiceSampleUrl: "voices/T21-03-03128.wav",
    program: "BSc. Software Engineering",
    room: "Block 2C-S05",
    college: "CIVE",
    phone: "0712398762",
    YoS: 3
  },
  { 
    regNumber: "T21-03-12992", 
    name: "Godlisten Nanyaro",
    email: "godlisten.nanyaro@udom.ac.tz",
    voiceSampleUrl: "voices/T21-03-12992.wav",
    program: "BSc. Software Engineering",
    room: "Block 7B-S12",
    college: "CIVE",
    phone: "0782345678",
    YoS: 3
  },
  { 
    regNumber: "T21-03-13092", 
    name: "Anderson Mollel",
    email: "anderson.mollel@udom.ac.tz",
    voiceSampleUrl: "voices/T21-03-13092.wav",
    program: "BSc. Software Engineering",
    room: "Block 3D-S07",
    college: "CIVE",
    phone: "0654321098",
    YoS: 3
  },
  { 
    regNumber: "T21-03-04972", 
    name: "Mengwa Katambi",
    email: "mengwa.katambi@udom.ac.tz",
    voiceSampleUrl: "voices/T21-03-04972.wav",
    program: "BSc. Software Engineering",
    room: "Block 9A-S03",
    college: "CIVE",
    phone: "0789123456",
    YoS: 3
  },
  { 
    regNumber: "T21-02-7890", 
    name: "Daniel Mwalimu",
    email: "daniel.mwalimu@udom.ac.tz",
    voiceSampleUrl: "voices/T21-02-7890.wav",
    program: "Bachelor of Business Administration",
    room: "Block 4B-S08",
    college: "COBA",
    phone: "0768901234",
    YoS: 4
  },
  {
    regNumber: "T21-01-5432",
    name: "Grace John",
    email: "grace.john@udom.ac.tz",
    voiceSampleUrl: "voices/T21-01-5432.wav",
    program: "BSc. Software Engineering",
    room: "Block 6C-S09",
    college: "CIVE",
    phone: "0712345678",
    YoS: 3
  },
  {
    regNumber: "T20-03-1234",
    name: "Peter Michael",
    email: "peter.michael@udom.ac.tz",
    voiceSampleUrl: "voices/T20-03-1234.wav",
    program: "BSc. Computer Science",
    room: "Block 1A-S04",
    college: "CIVE",
    phone: "0787654321",
    YoS: 4
  },
  {
    regNumber: "T21-02-9876",
    name: "Mary Joseph",
    email: "mary.joseph@udom.ac.tz",
    voiceSampleUrl: "voices/T21-02-9876.wav",
    program: "Bachelor of Education",
    room: "Block 8D-S11",
    college: "COED",
    phone: "0756789012",
    YoS: 3
  },
  {
    regNumber: "ADM001",
    name: "System Administrator",
    email: "admin@udom.ac.tz",
    voiceSampleUrl: null,
    program: "Administration",
    room: "Admin Block",
    college: "Administration",
    phone: "0700000000",
    YoS: null
  }
];

/**
 * Fetch users from the university database
 * @param params Optional filter parameters
 * @returns Promise with user data
 */
export const fetchUniversityUsers = async (params?: { 
  college?: string,
  YoS?: number,
  program?: string
}) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter users based on params
  let filteredUsers = [...universityUsers];
  
  if (params) {
    if (params.college) {
      filteredUsers = filteredUsers.filter(user => user.college === params.college);
    }
    
    if (params.program) {
      filteredUsers = filteredUsers.filter(user => user.program === params.program);
    }
    
    if (params.YoS) {
      filteredUsers = filteredUsers.filter(user => user.YoS === params.YoS);
    }
  }
  
  // Return simulated database response
  return {
    status: "success",
    data: filteredUsers,
    count: filteredUsers.length
  };
};

/**
 * Fetch a single user by registration number
 * @param regNumber Student registration number
 * @returns Promise with user data
 */
export const fetchUniversityUserByRegNumber = async (regNumber: string) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = universityUsers.find(user => user.regNumber === regNumber);
  
  if (!user) {
    return {
      status: "error",
      message: "User not found",
      data: null
    };
  }
  
  return {
    status: "success",
    data: user
  };
};

/**
 * Fetch university colleges and programs
 * @returns Promise with college and program data
 */
export const fetchUniversityStructure = async () => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock university structure
  return {
    status: "success",
    data: {
      colleges: [
        "CIVE", // College of Informatics and Virtual Education
        "COED", // College of Education
        "CHAS", // College of Health and Allied Sciences
        "CNMS", // College of Natural and Mathematical Sciences
        "COBA", // College of Business and Economics
        "CHSS", // College of Humanities and Social Sciences
        "COES"  // College of Earth Sciences 
      ],
      programs: [
        "BSc. Software Engineering",
        "BSc. Information Technology",
        "BSc. Computer Science",
        "BSc. Information Systems",
        "Bachelor of Education",
        "Doctor of Medicine",
        "Bachelor of Business Administration",
        "BSc. Physics",
        "BSc. Mathematics",
        "Bachelor of Arts in Sociology"
      ],
      accommodations: [
        "Block 1A", "Block 1B", "Block 2A", "Block 2B", 
        "Block 3A", "Block 3B", "Block 4A", "Block 4B",
        "Block 5A", "Block 5B", "Block 6A", "Block 6B",
        "Block 7A", "Block 7B", "Block 8A", "Block 8B",
        "Block 9A", "Block 9B", "Block 10A", "Block 10B"
      ]
    }
  };
};
