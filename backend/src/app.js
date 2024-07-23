/*
* app.js - Berkan Mertan (Pratham Team 10)
* The entry point of the SmartyPants backend. This code provides the express
* routing service, which takes any user provided data or query and routes
* it to the appropriate local modules involving the database or processing with the LLM.
*/

// Load dependencies
"use strict";
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
var cors = require('cors');

// Config .env for environment variable loading
dotenv.config();

const db = require("./database");
const gemini = require('./geminiservice');
const { error } = require("console");
const app = express();

app.use(cors()).use(express.json());

// Setup server port
const port = process.env.PORT;

// Default path
app.get('/', (req, res) => {
    res.send("Server running normally.");
});

// Demo LLM test path
app.get('/testGemini', async (req, res) => {
    res.send(await gemini.runDemo());
});

// Test insertion of data block into the database, usually just for initialization.
app.get('/populateDB', async (req, res) => {
    let blocks = [
        {
            "title": "AI Startup Intern",
            "type": "internship",
            "flags": ["ai", "data-research", "statistics"],
            "description": "This unpaid internship demands a minimum commitment of 80 hours per week. The ideal candidate will have strong proficiency in Python and TensorFlow, as well as a solid foundation in data research and statistics. Team collaboration and communication skills are essential. Interns will work closely with experienced AI researchers, contributing to cutting-edge projects in machine learning and artificial intelligence. This position offers a unique opportunity to gain hands-on experience and make significant contributions to the field.",
            "content": `
    **Responsibilities:**
    - Assist in data collection and preprocessing.
    - Develop and implement machine learning models.
    - Collaborate with team members to integrate AI solutions into existing projects.
    
    **Qualifications:**
    - Strong proficiency in Python and TensorFlow.
    - Solid foundation in data research and statistics.
    - Excellent team collaboration and communication skills.
    
    **Benefits:**
    - Gain hands-on experience in AI and machine learning.
    - Work closely with experienced AI researchers.
    - Make significant contributions to cutting-edge projects.
        `,
            "url": "https://www.internship.com/"
        },
        {
            "title": "Hack Club",
            "type": "non-profit",
            "flags": ["non-profit", "fiscal-sponsor", "foundation"],
            "description": "Hack Club is a non-profit organization dedicated to fostering a community for high school hackers. As a fiscal sponsor, Hack Club provides resources, mentorship, and a supportive network for young innovators. Participants have the opportunity to lead and engage in various coding projects, hackathons, and workshops. The organization aims to inspire creativity, collaboration, and a passion for technology among high school students, helping them to develop valuable skills and make meaningful contributions to their communities.",
            "content": `
    **Program Highlights:**
    - Participate in coding projects, hackathons, and workshops.
    - Access resources and mentorship from industry professionals.
    - Develop valuable skills and make meaningful contributions.
    
    **Who Can Join:**
    - High school students passionate about technology and innovation.
    - Individuals seeking a supportive community to enhance their coding skills.
    
    **Goals:**
    - Inspire creativity and collaboration among young innovators.
    - Foster a passion for technology and coding.
    - Help students develop skills for future tech careers.
        `,
            "url": "https://hackclub.com/"
        },
        {
            "title": "University Research Assistant",
            "type": "research",
            "flags": ["university", "research", "assistant"],
            "description": "As a University Research Assistant, students will work alongside faculty members on various research projects. Responsibilities include data collection, analysis, literature review, and contributing to research publications. This position is ideal for students interested in gaining hands-on experience in academic research, enhancing their understanding of scientific methodologies, and preparing for graduate studies. Strong analytical skills, attention to detail, and a passion for research are essential.",
            "content": `
    **Responsibilities:**
    - Assist in data collection and analysis.
    - Conduct literature reviews.
    - Contribute to research publications.
    
    **Qualifications:**
    - Strong analytical skills.
    - Attention to detail.
    - Passion for research and academic inquiry.
    
    **Benefits:**
    - Gain hands-on experience in academic research.
    - Enhance understanding of scientific methodologies.
    - Prepare for graduate studies and future research careers.
        `,
            "url": "https://www.universityresearchopportunities.com/"
        },
        {
            "title": "Community Service Volunteer",
            "type": "volunteering",
            "flags": ["community-service", "volunteering", "non-profit"],
            "description": "Join our community service program and make a positive impact in your local area. Volunteers will participate in various initiatives, including environmental clean-ups, food drives, and educational programs for underprivileged youth. This opportunity allows students to develop leadership skills, foster a sense of civic responsibility, and contribute to the betterment of their community. Commitment to regular participation and a genuine desire to help others are required.",
            "content": `
    **Activities:**
    - Participate in environmental clean-ups.
    - Assist with food drives.
    - Support educational programs for underprivileged youth.
    
    **Qualifications:**
    - Commitment to regular participation.
    - Genuine desire to help others.
    - Strong leadership and teamwork skills.
    
    **Benefits:**
    - Develop leadership skills.
    - Foster a sense of civic responsibility.
    - Contribute to the betterment of the community.
        `,
            "url": "https://www.communityservicevolunteers.org/"
        },
        {
            "title": "High School STEM Club",
            "type": "club",
            "flags": ["stem", "club", "high-school"],
            "description": "The High School STEM Club provides a platform for students passionate about science, technology, engineering, and mathematics. Members engage in hands-on projects, participate in STEM competitions, and collaborate on innovative solutions to real-world problems. The club also offers mentorship from industry professionals and opportunities for college preparation. Students will develop critical thinking, problem-solving, and teamwork skills, preparing them for future careers in STEM fields.",
            "content": `
    **Activities:**
    - Engage in hands-on STEM projects.
    - Participate in STEM competitions.
    - Collaborate on innovative solutions to real-world problems.
    
    **Qualifications:**
    - Passion for science, technology, engineering, and mathematics.
    - Willingness to participate in club activities and projects.
    
    **Benefits:**
    - Access mentorship from industry professionals.
    - Prepare for college and future STEM careers.
    - Develop critical thinking and problem-solving skills.
        `,
            "url": "https://www.highschoolstemclub.org/"
        },
        {
            "title": "Environmental Conservation Internship",
            "type": "internship",
            "flags": ["environmental", "conservation", "internship"],
            "description": "This internship offers students the chance to work with environmental conservation organizations, focusing on protecting natural habitats and promoting sustainable practices. Interns will assist in field research, data collection, public education campaigns, and conservation projects. The ideal candidate is passionate about environmental issues, has strong communication skills, and is willing to work in various outdoor settings. This role provides valuable experience for those pursuing careers in environmental science and conservation.",
            "content": `
    **Responsibilities:**
    - Assist in field research and data collection.
    - Participate in public education campaigns.
    - Contribute to conservation projects.
    
    **Qualifications:**
    - Passion for environmental issues.
    - Strong communication skills.
    - Willingness to work in various outdoor settings.
    
    **Benefits:**
    - Gain valuable experience in environmental science and conservation.
    - Contribute to the protection of natural habitats.
    - Promote sustainable practices.
        `,
            "url": "https://www.environmentalinternships.org/"
        },
        {
            "title": "Peer Tutoring Program",
            "type": "volunteering",
            "flags": ["peer-tutoring", "education", "volunteering"],
            "description": "The Peer Tutoring Program offers students the opportunity to assist their peers in academic subjects, providing personalized tutoring sessions and study support. Tutors will help fellow students improve their understanding of course material, develop effective study habits, and achieve academic success. This program fosters a collaborative learning environment, enhances the tutors' teaching skills, and contributes to a supportive school community. Commitment to regular tutoring sessions and strong subject knowledge are required.",
            "content": `
    **Responsibilities:**
    - Provide personalized tutoring sessions.
    - Assist peers in improving their understanding of course material.
    - Help develop effective study habits.
    
    **Qualifications:**
    - Strong subject knowledge in academic areas.
    - Commitment to regular tutoring sessions.
    - Excellent communication and teaching skills.
    
    **Benefits:**
    - Foster a collaborative learning environment.
    - Enhance teaching and communication skills.
    - Contribute to a supportive school community.
        `,
            "url": "https://www.peertutoringprogram.org/"
        },
        {
            "title": "College Entrepreneurship Club",
            "type": "club",
            "flags": ["entrepreneurship", "club", "college"],
            "description": "The College Entrepreneurship Club is a dynamic community for students interested in starting their own businesses or learning about entrepreneurship. Members participate in workshops, networking events, and pitch competitions, gaining insights from successful entrepreneurs and industry experts. The club provides resources and mentorship to help students develop business ideas, create startups, and navigate the challenges of entrepreneurship. This experience cultivates innovation, leadership, and business acumen.",
            "content": `
    **Activities:**
    - Participate in workshops and networking events.
    - Engage in pitch competitions.
    - Gain insights from successful entrepreneurs and industry experts.
    
    **Qualifications:**
    - Interest in entrepreneurship and business development.
    - Willingness to actively participate in club activities.
    
    **Benefits:**
    - Access resources and mentorship for business development.
    - Develop business ideas and create startups.
    - Cultivate innovation, leadership, and business acumen.
        `,
            "url": "https://www.collegeentrepreneurshipclub.org/"
        },
        {
            "title": "USACO",
            "type": "competition",
            "flags": ["computer science", "programming", "algorithm"],
            "description": "The USA Computing Olympiad (USACO) is a series of online programming contests. The USACO supports computing education in the USA and worldwide by identifying, motivating, and training high-school computing students at all levels. ",
            "content": "## Requirements\n- Knowledge of algorithms and data structures\n- Proficiency in C++, Java, or Python\n\n## Qualifications\n- High school students\n\nUSACO offers multiple contests throughout the year, and participants can advance through different levels, from Bronze to Platinum, based on their performance.",
            "url": "http://www.usaco.org/"
        },
        {
            "title": "AIME",
            "type": "competition",
            "flags": ["math", "high school", "problem-solving"],
            "description": "The American Invitational Mathematics Examination (AIME) is an intermediate examination used to challenge bright high school students.",
            "content": "## Requirements\n- Qualification through the AMC 10 or AMC 12\n\n## Qualifications\n- High school students\n\nAIME is a 15-question, 3-hour examination, with each answer an integer between 0 and 999. It tests in-depth understanding and problem-solving abilities in mathematics.\n\nThe **American Invitational Mathematics Examination** (**AIME**) is the second exam in the series of exams used to challenge bright students on the path toward choosing the team that represents the United States at the [International Mathematics Olympiad](/wiki/index.php/International_Mathematics_Olympiad \"International Mathematics Olympiad\") (IMO). While most AIME participants are high school students, some bright middle school students also qualify each year. High scoring AIME students are invited to take the prestigious [United States of America Mathematics Olympiad](/wiki/index.php/United_States_of_America_Mathematics_Olympiad \"United States of America Mathematics Olympiad\") (USAMO) for qualification from taking the AMC 12 or United States of America Junior Mathematics Olympiad (USAJMO) for qualification from taking the AMC 10. The AIME is administered by the [Mathematical Association of America](/wiki/index.php/Mathematical_Association_of_America \"Mathematical Association of America\") (MAA). [Art of Problem Solving](/wiki/index.php/Art_of_Problem_Solving \"Art of Problem Solving\") (AoPS) is a proud sponsor of the AMC!",
            "url": "https://artofproblemsolving.com/wiki/index.php/AIME_Problems_and_Solutions"
        },
        {
            "title": "F=ma",
            "type": "competition",
            "flags": ["physics", "high school", "problem-solving"],
            "description": "The F=ma contest is a physics competition that serves as a qualifier for the US Physics Team.",
            "content": "## Requirements\n- Knowledge of mechanics\n\n## Qualifications\n- High school students\n\nThe F=ma exam consists of 25 multiple-choice questions covering high school mechanics. Successful participants move on to further rounds leading to the selection of the US Physics Team.",
            "url": "https://www.aapt.org/physicsteam/2024/registration.cfm"
        },
        {
            "title": "Ubicomp Lab at UW",
            "type": "research",
            "flags": ["computer science", "ubiquitous computing", "research"],
            "description": "The Ubiquitous Computing (UbiComp) research lab, led by Prof. Shwetak Patel, focuses on many areas of ubiquitous computing including novel user interface technology, health sensing, activity recognition, low-power sensing, and energy sensing by applying expertise in sensing, signal processing, embedded systems, circuits, and human-computer interaction. The UbiComp lab consists of an interdisciplinary team of investigators that tackle challenging research problems both from building the enabling hardware and software systems to the deployment and evaluation of these technologies in real-world settings, especially around health. We collaborate very closely with UW Professors in the Paul G. Allen School of Computer Science & Engineering, Department of Electrical and Computer Engineering, and School of Medicine. In addition, we have close collaborations with Google, Microsoft Research, the Bill & Melinda Gates Foundation, Intel, Facebook, and many other companies.",
            "content": "## Requirements\n- Strong background in computer science or related fields\n- Interest in ubiquitous computing\n\n## Qualifications\n- Undergraduate or graduate students\n\nThe Ubicomp Lab offers opportunities for students to engage in cutting-edge research on topics like wearable computing, health sensing, and smart environments. Students can participate in ongoing projects and contribute to publications.\n\nPhD Students\n------------\nWe receive a lot of inquiries from prospective PhD students wanting to join the lab, but unfortunately we are not able to take every student. We are also not able to directly admit to the lab and students must apply and be admitted to the UW CSE or EE PhD program before we are able to make commitments to students. Students interested in joining the lab as a PhD student should contact Prof. Shwetak Patel.\nMasters Students\n----------------\nWe certainly welcome Masters students, but prioritize funding and RAs to PhD students. From time to time we may offer an RA to Masters students. However, we typically first ask Masters students to work on a small project in the lab for course credit to establish fit and confirm the student’s interest in the topic area.\nUndergraduates\n--------------\nUndergraduate research is an important part of the lab and we have a very active group of undergraduates working in the group.\nApplying\n--------\nUndergraduates and Masters students interested in conducting research in the Ubicomp lab must fill out an application before the start of the quarter during the academic year. We use the applications to keep track of everyone interested in doing research and to find project matches. Please note that we often get many more applications than positions we have, but we will try our best to find an opportunity for you.                                                                                                                                                                                                                                                                                                                                                                                                            [Apply Here](https://survey.alchemer.com/s3/7862349/UbiComp-Lab-Research-Application-SU-and-FA-2024) to get involved in the Summer or Fall quarter.\nUbiComp Seminar\n---------------\nThe UbiComp Seminar (CSE590U) meets every Monday from 12-1pm. Topics for seminar have included: guest speaker talks, discussions about research papers, mini-workshops, and more. If you would like to give a talk at the UbiComp Seminar, please contact jcao22@cs.washington.edu and we can help schedule a time.\nHigh school research opportunities\n----------------------------------\nThe Ubicomp Lab invites a select number of high school students from the Seattle area to conduct an intense 8-week long research project during the summer from July 1 - August 23. Prof. Shwetak Patel created this program because of his own participation in research when he was in high school and the incredible experience it provided for his career path.\nThe application is closed and we are not accepting late applications. We will send out decisions on May 15th.\nReceive updates\n---------------\nYou can also subscribe to the lab email list [here](https://mailman11.u.washington.edu/mailman/listinfo/ubicomp-public) if you are interested in receiving information on the lab and research updates. We also occasionally share opportunities for people to participate in our research studies as volunteer research subjects, which are shared to that list.",
            "url": "https://ubicomplab.cs.washington.edu/"
        },
        {
            "title": "Microsoft Internship",
            "type": "internship",
            "flags": ["computer science", "software engineering", "internship"],
            "description": "Microsoft offers internships in various technical and non-technical fields.",
            "content": "## Requirements\n- Enrolled in a Bachelor's or Master's program\n- Relevant coursework or experience\n\n## Qualifications\n- Strong technical skills\n- Ability to work in a team\n\nMicrosoft internships provide hands-on experience with real-world projects. Interns work closely with experienced professionals and have the opportunity to learn and grow in a dynamic environment.",
            "url": "https://careers.microsoft.com/students/us/en/us-internship"
        },
        {
            "title": "Advent of Code",
            "type": "competition",
            "flags": ["computer science", "programming", "algorithm"],
            "description": "Advent of Code is an annual programming competition with daily challenges during December.",
            "content": "## Requirements\n- Proficiency in any programming language\n- Problem-solving skills\n\n## Qualifications\n- Open to all\n\nAdvent of Code provides a series of daily programming puzzles that are both fun and challenging. Participants can compete for the top spots on the leaderboard or simply use the puzzles as a way to improve their coding skills.",
            "url": "https://adventofcode.com/"
        },
        {
            "title": "Google Resource Programs",
            "type": "internship",
            "flags": ["computer science", "artificial intelligence", "google", "internship", "research"],
            "description": "Google offers multidisciplinary programs throughout the world and for all types of audiences. From coding summer programs for pre-university students to residencies for degree holders looking to develop their experience, our programs are meant to inspire and grow their participants. ",
            "content": "Google-sponsored programs/gn=========================\nGoogle offers multidisciplinary programs throughout the world and for all types of audiences. From coding summer programs for pre-university students to residencies for degree holders looking to develop their experience, our programs are meant to inspire and grow their participants. To see all of our programs, visit the programs page of [our EDU site](https://www.google.com/edu/resources/programs/).\n\n[Information Technology Residency Program (ITRP)](/jobs/results/123-googleinformation-technology-residency-program-2300-traverwood-dr-ann-arbor-mi-usa-7360010/)\n----------------------------------------------------------------------------------------------------------------------------------------------------------------\n\nA 26-month role designed to jumpstart your career in technology at Google or beyond. We believe that a successful IT career has its foundation in user support, and ITRP gives you exposure to a wide range of issues by assisting Googlers with their technology all around the world. You will encounter a sophisticated user base working on all major desktop and mobile operating systems.\n\n[Computer Science Summer Institute (CSSI)](https://www.google.com/edu/resources/programs/computer-science-summer-institute/)\n----------------------------------------------------------------------------------------------------------------------------\n\nThis three-week summer program invites high school graduates to Google to be inspired by a career in technology. Participants will learn about the technology industry, gain skills, and develop personal networks.\n\n[AdCamp](https://www.google.com/edu/resources/programs/adcamp/)\n---------------------------------------------------------------\n\nThe AdCamp program offers university students a collaborative curriculum focused on Google’s advertising sales and services operations, an overview of Google’s ad products, and insight into the industry.\n\n[Engineering Residency](https://www.google.com/about/careers/students/engres.html)\n----------------------------------------------------------------------------------\n\nA program for graduating college seniors (or graduates with less than a year in the industry), the Engineering Residency offers a kick-start to your career in technology.\n\n[Google AI Residency Program](https://research.google.com/teams/brain/residency/)\n---------------------------------------------------------------------------------\n\nFor university graduates with a BS or equivalent experience in a STEM field, such as Computer Science, Mathematics, or Statistics, the Google AI Residency is a year-long program similar to a master's or PhD program in deep learning. Residents will work with scientists from the Google Research Team and gain research experience in the field.\n\n[BOLD Immersion](https://www.google.com/edu/resources/programs/bold-immersion/)\n-------------------------------------------------------------------------------\n\nBuilding Opportunities for Leadership and Development (BOLD) Immersion gives university students the opportunity to experience a culture where great minds, cutting-edge technology, and smart business intersect to make a difference.\n\n[Ignite CS (EngEDU)](https://ignitecs.withgoogle.com/)\n------------------------------------------------------\n\nigniteCS supports groups of college students who want to make a difference in their local communities through Computer Science mentoring.\n\n[Applied CS (EngEDU)](https://cswithandroid.withgoogle.com/)\n------------------------------------------------------------\n\nDesigned for university Computer Science students, the Applied CS with Android program uses the Android platform to revisit concepts from Data Structures and Algorithms, as well as Artificial Intelligence.\n\n[Google Summer of Code](https://summerofcode.withgoogle.com/)\n-------------------------------------------------------------\n\nAvailable in most countries, Google's Summer of Code offers university students the opportunity to work with mentor organization on open-source projects.\n\n[Google Veterans Summit](https://www.google.com/edu/resources/programs/google-student-veteran-summit/)\n------------------------------------------------------------------------------------------------------\n\nVeterans of the Air Force, Army, Navy, Coast Guard, or Marine Corps currently pursuing a full-time MBA have the chance to attend a week-long summit designed to help brush up their business skills and ensure a smooth transition to the civilian workplace.\n\n[Public Policy Fellowship](http://www.google.com/policyfellowship/)\n-------------------------------------------------------------------\n\nOffered in various countries, the Fellowship gives undergraduate, graduate, and law students interested in internet and technology policy the opportunity to spend the summer contributing to the public dialogue on these issues, all while exploring future academic and professional interests.\n\n[Legal Summer Institute (LSI)](https://sites.google.com/view/legalsummer/overview?authuser=1)\n---------------------------------------------------------------------------------------------\n\nIn this four-week experience (sponsored by Google and its U.S. partner law firms), 1st year law students (and part-time 2Ls) spend a week at Google partaking in legal education and career development sessions, and then go on to work with partner law firms in the U.S for three weeks. The program is open to students at ABA-approved law schools, with US work authorization. Members of historically underrepresented groups in the legal field are encouraged to apply.\n",
            "url": "https://ai.google/research/join-us/ai-residency/"
        },
        {
            "title": "Harvard Pre-Med Summer Program",
            "type": "program",
            "flags": ["pre-med", "summer program", "medicine"],
            "description": "Harvard's Pre-Med Summer Program provides an intensive introduction to the medical field.",
            "content": "## Requirements\n- Current undergraduate students\n- Interest in pursuing a career in medicine\n\n## Qualifications\n- Strong academic background\n- Commitment to the field of medicine\n\nThis program includes coursework, clinical exposure, and research opportunities. Participants gain valuable insights into the medical profession and prepare for medical school applications.",
            "url": "https://summer.harvard.edu/high-school-programs/pre-college-program/"
        },
        
        {
            "title": "Goldman Sachs Summer Analyst Program",
            "type": "internship",
            "flags": ["finance", "internship", "business"],
            "description": "The Goldman Sachs Summer Analyst Program offers hands-on experience in the finance industry.",
            "content": "## Requirements\n- Enrolled in a Bachelor's program\n- Strong analytical and quantitative skills\n\n## Qualifications\n- Interest in finance and business\n- Ability to work in a fast-paced environment\n\nThe Summer Analyst Program provides training, mentorship, and networking opportunities. Interns work on real projects and gain insights into the operations of one of the leading investment banks.",
            "url": "https://www.goldmansachs.com/careers/students/programs/americas/2025-summer-analyst-program.html"
        },
        {
            "title": "Creative Writing Summer Workshop at Stanford",
            "type": "program",
            "flags": ["literature", "creative writing", "summer program"],
            "description": "Stanford's Creative Writing Summer Workshop offers aspiring writers the opportunity to develop their craft.",
            "content": "## Requirements\n- Interest in creative writing\n\n## Qualifications\n- High school or undergraduate students\n\nThis workshop includes writing exercises, peer reviews, and feedback from experienced instructors. Participants work on various genres and develop their own writing projects.",
            "url": "https://creativewriting.stanford.edu/"
        },
        {
            "title": "American Red Cross Volunteering",
            "type": "volunteering",
            "flags": ["non-profit", "volunteering", "community service"],
            "description": "The American Red Cross offers various volunteer opportunities to support communities in need.",
            "content": "## Requirements\n- Willingness to help others\n\n## Qualifications\n- Open to all\n\nVolunteers can participate in disaster response, blood drives, health and safety training, and more. The American Red Cross provides training and support to help volunteers make a meaningful impact.",
            "url": "https://www.redcross.org/volunteer/become-a-volunteer.html"
        },
            {
                "title": "ISRO Internship Program",
                "type": "internship",
                "flags": ["space science", "engineering", "internship"],
                "description": "The Indian Space Research Organisation (ISRO) offers internships to students interested in space science and engineering. This program aims to provide hands-on experience in various aspects of space technology and research.",
                "content": "## Requirements\n- Currently enrolled in an undergraduate or postgraduate program\n- Strong academic background in science or engineering\n\n## Qualifications\n- Demonstrated interest in space science or engineering\n- Commitment to the program\n\nThe ISRO Internship Program provides students with the opportunity to work on real-world projects and gain valuable experience in the field of space technology. Interns will work alongside experienced scientists and engineers and contribute to ongoing research and development projects.",
                "url": "https://www.isro.gov.in/InternshipAndProjects.html"
            },
            {
                "title": "NASA Internship Programs",
                "type": "internship",
                "flags": ["space science", "engineering", "internship", "research"],
                "description": "NASA offers various internship programs to students from different educational backgrounds, providing opportunities to work on groundbreaking projects and contribute to NASA's mission.",
                "content": "## Requirements\n- Must be a U.S. citizen\n- Enrolled in an accredited educational institution (high school, undergraduate, or graduate level)\n- Minimum GPA of 3.0 on a 4.0 scale\n\n## Qualifications\n- Strong academic background in relevant fields such as science, technology, engineering, and mathematics (STEM)\n- Demonstrated interest in space science and engineering\n- Ability to work in a collaborative environment\n\n## Program Details\nNASA internships provide a unique opportunity for students to gain hands-on experience working with experts in the field of space science and engineering. Interns will engage in various projects, ranging from research and development to mission operations, and will have the chance to contribute to NASA's ongoing missions and initiatives.\n\n### Application Process\n1. Visit the [NASA Internships website](https://intern.nasa.gov/)\n2. Create an account and complete the application form\n3. Submit your application along with required documents (e.g., transcripts, letters of recommendation)\n4. Monitor your application status and await selection notifications\n\n### Benefits\n- Mentorship from NASA professionals\n- Access to NASA facilities and resources\n- Networking opportunities with industry experts\n- Potential for future employment with NASA\n\n### Deadlines\n- Fall Session: June 1\n- Spring Session: November 1\n- Summer Session: March 1\n\nFor more information and to apply, visit the [NASA Internship Programs](https://www.nasa.gov/learning-resources/internship-programs/) page.",
                "url": "https://www.nasa.gov/learning-resources/internship-programs/"
            },
            {
                "title": "Google Summer of Code",
                "type": "internship",
                "flags": ["computer science", "open source", "programming"],
                "description": "Google Summer of Code (GSoC) is a global program focused on bringing more student developers into open source software development.",
                "content": "## Requirements\n- Enrolled in a university\n- Interest in open source development\n\n## Qualifications\n- Strong programming skills\n- Ability to work independently\n\nGSoC offers students stipends to write code for various open source projects. Participants gain exposure to real-world software development and collaborate with experienced mentors.",
                "url": "https://summerofcode.withgoogle.com/"
            },
            {
                "title": "International Physics Olympiad (IPhO)",
                "type": "competition",
                "flags": ["physics", "international", "high school"],
                "description": "The International Physics Olympiad (IPhO) is an annual physics competition for high school students from around the world.",
                "content": "## Requirements\n- Strong understanding of physics concepts\n\n## Qualifications\n- High school students\n\nThe IPhO consists of theoretical and experimental exams that test participants' physics knowledge and problem-solving abilities. The competition aims to promote physics education and foster international collaboration.",
                "url": "https://www.ipho-new.org/"
            },
            {
                "title": "Harvard Business School Summer Venture in Management Program",
                "type": "program",
                "flags": ["business", "management", "summer program"],
                "description": "The Summer Venture in Management Program (SVMP) is a one-week management training program for rising college seniors designed to increase diversity and opportunity in business education.",
                "content": "## Requirements\n- Rising college senior\n- Interest in business and management\n\n## Qualifications\n- Strong academic background\n- Leadership experience\n\nSVMP participants attend classes taught by Harvard Business School faculty, engage in case studies, and participate in team projects, gaining insights into the MBA program and careers in management.",
                "url": "https://www.hbs.edu/svmp/"
            },
            {
                "title": "J.P. Morgan Investment Banking Analyst Program",
                "type": "internship",
                "flags": ["finance", "investment banking", "internship"],
                "description": "J.P. Morgan's Investment Banking Analyst Program provides hands-on experience in the finance industry, working on real deals and transactions.",
                "content": "## Requirements\n- Enrolled in a Bachelor's program\n- Strong analytical and quantitative skills\n\n## Qualifications\n- Interest in finance and investment banking\n- Ability to work in a fast-paced environment\n\nAnalysts work alongside experienced professionals, gaining insights into the world of investment banking, and have opportunities for mentorship and networking.",
                "url": "https://careers.jpmorgan.com/us/en/students/programs/investment-banking-summer-analyst"
            },
            {
                "title": "ACS Summer School in Nuclear and Radiochemistry",
                "type": "program",
                "flags": ["chemistry", "nuclear chemistry", "summer program"],
                "description": "The American Chemical Society's Summer School in Nuclear and Radiochemistry provides an intensive introduction to nuclear chemistry.",
                "content": "## Requirements\n- Undergraduate or graduate students\n- Interest in nuclear chemistry\n\n## Qualifications\n- Strong academic background in chemistry\n\nThe program includes lectures, laboratory work, and research projects, providing participants with a comprehensive understanding of nuclear and radiochemistry.",
                "url": "https://www.nucl-acs.org/?page_id=15"
            },
            {
                "title": "Johns Hopkins Summer Internship Program (SIP)",
                "type": "internship",
                "flags": ["pre-med", "internship", "research"],
                "description": "The Johns Hopkins Summer Internship Program (SIP) offers undergraduate students the opportunity to conduct biomedical research.",
                "content": "## Requirements\n- Enrolled in an undergraduate program\n- Interest in biomedical research\n\n## Qualifications\n- Strong academic background\n\nParticipants work in research labs at Johns Hopkins University, gaining hands-on experience in biomedical research and exposure to potential career paths in medicine and research.",
                "url": "https://www.hopkinsmedicine.org/som/pathway/sip"
            },
            {
                "title": "Iowa Writers' Workshop",
                "type": "program",
                "flags": ["literature", "creative writing", "workshop"],
                "description": "The Iowa Writers' Workshop is a prestigious creative writing program that offers workshops and seminars in fiction and poetry.",
                "content": "## Requirements\n- Interest in creative writing\n\n## Qualifications\n- Submission of writing samples\n\nParticipants engage in writing workshops, receive feedback from peers and instructors, and have the opportunity to develop their writing skills in a supportive environment.",
                "url": "https://writersworkshop.uiowa.edu/"
            },
            {
                "title": "National Bureau of Economic Research (NBER) Summer Institute",
                "type": "program",
                "flags": ["economics", "research", "summer program"],
                "description": "The NBER Summer Institute is an annual gathering of economists that includes workshops and presentations on various economic research topics.",
                "content": "## Requirements\n- Interest in economic research\n\n## Qualifications\n- Undergraduate or graduate students\n\nThe Summer Institute provides a platform for economists to present and discuss their research, network with peers, and gain insights into the latest developments in the field of economics.",
                "url": "https://www.nber.org/conferences/summer-institute"
            },
            {
                "title": "Mayo Clinic Summer Undergraduate Research Fellowship (SURF)",
                "type": "internship",
                "flags": ["medicine", "research", "internship"],
                "description": "The Mayo Clinic SURF program offers undergraduate students the opportunity to conduct biomedical research at one of the top medical centers in the world.",
                "content": "## Requirements\n- Enrolled in an undergraduate program\n- Interest in biomedical research\n\n## Qualifications\n- Strong academic background\n\nParticipants work with Mayo Clinic researchers on cutting-edge projects, gaining valuable research experience and exposure to potential career paths in medicine.",
                "url": "https://college.mayo.edu/academics/biomedical-research-training/summer-undergraduate-research-fellowship-surf/"
            },
            {
                "title": "Teach For America",
                "type": "volunteering",
                "flags": ["non-profit", "education", "community service"],
                "description": "Teach For America is a non-profit organization that recruits and trains individuals to teach in low-income communities.",
                "content": "## Requirements\n- Bachelor's degree\n- Commitment to educational equity\n\n## Qualifications\n- Strong leadership skills\n- Ability to work in challenging environments\n\nTeach For America corps members commit to teaching for at least two years in underserved schools, working to close the educational achievement gap and make a positive impact on students' lives.",
                "url": "https://www.teachforamerica.org/"
            },
            {
                "title": "Habitat for Humanity",
                "type": "volunteering",
                "flags": ["non-profit", "volunteering", "community service"],
                "description": "Habitat for Humanity is a global non-profit organization that helps build homes for people in need.",
                "content": "## Requirements\n- Willingness to help others\n\n## Qualifications\n- Open to all\n\nVolunteers can participate in building projects, fundraising, and other activities that support Habitat for Humanity's mission of providing affordable housing for families in need.",
                "url": "https://www.habitat.org/volunteer"
            },
            {
                "title": "Association for Computing Machinery (ACM)",
                "type": "club",
                "flags": ["computer science", "professional organization", "networking"],
                "description": "The Association for Computing Machinery (ACM) is the world's largest educational and scientific computing society.",
                "content": "## Requirements\n- Interest in computing\n\n## Qualifications\n- Open to all\n\nACM offers professional development, networking opportunities, and access to a vast library of resources for students and professionals in the computing field.",
                "url": "https://www.acm.org/"
            },
            {
                "title": "DAAD Scholarships",
                "type": "scholarship",
                "flags": ["international", "Germany", "graduate studies"],
                "description": "The German Academic Exchange Service (DAAD) offers scholarships for international students to study in Germany.",
                "content": "## Requirements\n- Completed a Bachelor's degree\n- Proficiency in German or English (depending on the program)\n\n## Qualifications\n- Academic excellence\n- Relevant work or research experience\n\nDAAD scholarships cover tuition fees, travel expenses, health insurance, and a monthly stipend to support students during their studies in Germany.",
                "url": "https://www.daad.de/en/study-and-research-in-germany/scholarships/"
            },
            {
                "title": "Chevening Scholarships",
                "type": "scholarship",
                "flags": ["international", "UK", "graduate studies"],
                "description": "Chevening Scholarships are awarded to outstanding emerging leaders from around the world to pursue a one-year Master's degree in the UK.",
                "content": "## Requirements\n- Undergraduate degree\n- At least two years of work experience\n- Proficiency in English\n\n## Qualifications\n- Strong academic background\n- Leadership potential\n\nChevening Scholarships cover tuition fees, travel expenses, and a monthly stipend. The program also provides opportunities for networking and professional development.",
                "url": "https://www.chevening.org/"
            },
            {
                "title": "Fulbright Foreign Student Program",
                "type": "scholarship",
                "flags": ["international", "USA", "graduate studies"],
                "description": "The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.",
                "content": "## Requirements\n- Bachelor's degree\n- Proficiency in English\n\n## Qualifications\n- Strong academic and professional background\n\nThe Fulbright Program covers tuition, airfare, a living stipend, and health insurance. It aims to increase mutual understanding between the people of the United States and other countries.",
                "url": "https://foreign.fulbrightonline.org/"
            },
            {
                "title": "UNICEF Internship Programme",
                "type": "internship",
                "flags": ["international", "non-profit", "internship"],
                "description": "The UNICEF Internship Programme offers students and recent graduates the opportunity to gain practical experience in UNICEF's work.",
                "content": "## Requirements\n- Enrolled in a graduate or undergraduate program, or recent graduate\n- Proficiency in at least one of UNICEF's working languages (English, French, or Spanish)\n\n## Qualifications\n- Strong academic performance\n- Interest in international development and children's rights\n\nInterns receive a stipend to cover living expenses and may be provided with a one-time travel allowance. The program is designed to provide exposure to the work of UNICEF and offer hands-on experience in various fields.",
                "url": "https://www.unicef.org/careers/internships"
            },
            {
                "title": "World Bank Internship Program",
                "type": "internship",
                "flags": ["international", "finance", "internship"],
                "description": "The World Bank Internship Program offers highly motivated individuals the opportunity to be exposed to the mission and work of the World Bank.",
                "content": "## Requirements\n- Enrolled in a graduate program\n- Proficiency in English\n\n## Qualifications\n- Strong academic background\n- Interest in international development\n\nInterns receive a monthly stipend and travel expenses. The program provides practical work experience in various areas such as economics, finance, education, public health, social sciences, and more.",
                "url": "https://www.worldbank.org/en/about/careers/programs-and-internships/internship"
            },
            {
                "title": "Hult Prize",
                "type": "competition",
                "flags": ["international", "social entrepreneurship", "competition"],
                "description": "The Hult Prize is a global competition that challenges young people to solve the world's most pressing issues through social entrepreneurship.",
                "content": "## Requirements\n- Current university students or recent graduates\n\n## Qualifications\n- Innovative ideas for social impact\n- Teamwork and leadership skills\n\nWinning teams receive seed funding to launch their social enterprises and access to a global network of mentors and investors. The competition focuses on various themes each year, such as energy, education, and healthcare.",
                "url": "https://www.hultprize.org/"
            },
            {
                "title": "Google Code-in",
                "type": "competition",
                "flags": ["international", "programming", "competition"],
                "description": "Google Code-in is an annual competition for pre-university students aged 13-17 to complete tasks related to open source projects.",
                "content": "## Requirements\n- Age 13-17\n\n## Qualifications\n- Interest in coding and open source\n\nParticipants work on tasks such as coding, documentation, and design, and have the opportunity to learn from mentors and win prizes. The competition aims to introduce young students to the world of open source and software development.",
                "url": "https://codein.withgoogle.com/"
            },
            {
                "title": "Ashoka Youth Venture Program",
                "type": "program",
                "flags": ["international", "social entrepreneurship", "youth program"],
                "description": "The Ashoka Youth Venture Program supports young people in launching and leading their own social ventures.",
                "content": "## Requirements\n- Age 12-20\n\n## Qualifications\n- Innovative ideas for social impact\n- Leadership potential\n\nParticipants receive mentorship, training, and networking opportunities to help them develop their social ventures and become changemakers in their communities.",
                "url": "https://www.ashoka.org/en-us/program/ashoka-youth-venture"
            },
            {
                "title": "CERN Summer Student Programme",
                "type": "program",
                "flags": ["international", "physics", "summer program"],
                "description": "The CERN Summer Student Programme offers undergraduate students the opportunity to work on advanced research projects at CERN in Geneva, Switzerland.",
                "content": "## Requirements\n- Enrolled in a Bachelor's or Master's program in physics, engineering, computer science, or related field\n\n## Qualifications\n- Strong academic background\n- Proficiency in English\n\nParticipants work with leading scientists on research projects, attend lectures, and gain hands-on experience in a cutting-edge research environment. The program includes travel allowance, stipend, and accommodation.",
                "url": "https://home.cern/summer-student-programme"
            },
            {
                "title": "UNESCO/Keizo Obuchi Research Fellowships",
                "type": "fellowship",
                "flags": ["international", "research", "fellowship"],
                "description": "The UNESCO/Keizo Obuchi Research Fellowships support young researchers from developing countries in pursuing innovative research in various fields.",
                "content": "## Requirements\n- Under 40 years of age\n- Master's degree or equivalent\n\n## Qualifications\n- Strong research proposal\n- Relevant academic and professional background\n\nFellowships cover travel expenses, living allowance, and research costs. The program aims to foster research in fields such as environment, intercultural dialogue, information and communication technologies, and peaceful conflict resolution.",
                "url": "https://en.unesco.org/fellowships/keizo-obuchi"
            },
            {
                "title": "United Nations Volunteers (UNV) Programme",
                "type": "volunteering",
                "flags": ["international", "volunteering", "community service"],
                "description": "The United Nations Volunteers (UNV) Programme mobilizes volunteers to support peace and development projects worldwide.",
                "content": "## Requirements\n- Minimum age 25\n- University degree or higher technical diploma\n- At least two years of relevant work experience\n\n## Qualifications\n- Strong commitment to volunteerism\n- Ability to work in multicultural environments\n\nUN Volunteers receive a monthly living allowance, health insurance, and travel expenses. The program provides opportunities to contribute to sustainable development and make a positive impact in communities around the world.",
                "url": "https://www.unv.org/"
            },
            {
                "title": "World Bank Scholarships Program",
                "type": "scholarship",
                "flags": ["international", "graduate studies", "scholarship"],
                "description": "The World Bank Scholarships Program offers scholarships to students from developing countries to pursue graduate studies in fields related to development.",
                "content": "## Requirements\n- Bachelor's degree\n- At least three years of development-related work experience\n\n## Qualifications\n- Strong academic background\n\nThe program provides funding for tuition, travel, and living expenses. It aims to build the skills and expertise of future leaders who will contribute to the development of their home countries.",
                "url": "https://www.worldbank.org/en/programs/scholarships"
            },
            {
                "title": "PMSSS (Prime Minister's Special Scholarship Scheme)",
                "type": "scholarship",
                "flags": ["india", "undergraduate", "scholarship"],
                "description": "The Prime Minister's Special Scholarship Scheme (PMSSS) aims to promote higher education for students from Jammu & Kashmir and Ladakh.",
                "content": "## Requirements\n- Resident of Jammu & Kashmir or Ladakh\n- Completed 12th grade\n- Family income below a specified threshold\n\n## Qualifications\n- Academic excellence in 12th grade\n\nThe scholarship covers tuition fees, maintenance allowance, and other educational expenses for undergraduate studies in recognized institutions across India.",
                "url": "https://www.aicte-india.org/bureaus/jk"
            },
            {
                "title": "INSPIRE Scholarship",
                "type": "scholarship",
                "flags": ["india", "undergraduate", "scholarship"],
                "description": "The Innovation in Science Pursuit for Inspired Research (INSPIRE) Scholarship aims to attract talented young students to pursue science courses at undergraduate and postgraduate levels.",
                "content": "## Requirements\n- Completed 12th grade with top marks in science subjects\n- Enrolled in a B.Sc., B.S., or integrated M.Sc./M.S. program in natural or basic sciences\n\n## Qualifications\n- Academic excellence in 12th grade\n\nThe scholarship provides an annual monetary award and mentorship to pursue higher education in science.",
                "url": "http://www.online-inspire.gov.in/"
            },
            {
                "title": "Vidya Lakshmi Education Loan Scheme",
                "type": "loan",
                "flags": ["india", "education loan"],
                "description": "Vidya Lakshmi is a centralized portal for students seeking education loans and scholarships.",
                "content": "## Requirements\n- Indian citizen\n- Secured admission in recognized educational institutions in India or abroad\n- Family income below a specified threshold\n\n## Qualifications\n- Academic background and creditworthiness\n\nThe portal provides access to various education loan schemes offered by banks and financial institutions, as well as information on scholarships.",
                "url": "https://www.vidyalakshmi.co.in/Students/"
            },
            {
                "title": "Indian Council for Cultural Relations (ICCR) Internship Programme",
                "type": "internship",
                "flags": ["india", "culture", "internship"],
                "description": "The ICCR Internship Programme offers internships to students interested in cultural relations and diplomacy.",
                "content": "## Requirements\n- Enrolled in a graduate or postgraduate program\n- Interest in cultural studies and diplomacy\n\n## Qualifications\n- Strong academic background\n- Good communication skills\n\nInterns gain exposure to the work of the ICCR, participate in cultural events, and work on research projects related to India's cultural relations.",
                "url": "https://www.iccr.gov.in/"
            },
            {
                "title": "KVPY (Kishore Vaigyanik Protsahan Yojana)",
                "type": "program",
                "flags": ["india", "science", "program"],
                "description": "The Kishore Vaigyanik Protsahan Yojana (KVPY) is a national fellowship program in basic sciences funded by the Department of Science and Technology, Government of India.",
                "content": "## Requirements\n- Indian citizens enrolled in XI, XII, or 1st year of undergraduate program in science\n- Outstanding academic record\n\n## Qualifications\n- Strong aptitude for scientific research\n\nThe fellowship provides a monthly stipend and contingency grant to selected students to encourage them to pursue a research career in science.",
                "url": "http://kvpy.iisc.ernet.in/main/index.htm"
            },
            {
                "title": "Summer Research Fellowship Programme (SRFP)",
                "type": "fellowship",
                "flags": ["india", "research", "fellowship"],
                "description": "The Summer Research Fellowship Programme (SRFP) is jointly conducted by the Indian Academy of Sciences, the Indian National Science Academy, and the National Academy of Sciences, India.",
                "content": "## Requirements\n- Undergraduate and postgraduate students in science and engineering\n- Interest in scientific research\n\n## Qualifications\n- Strong academic record\n\nSelected students work on research projects under the guidance of experienced scientists during the summer, receiving a stipend and travel allowance.",
                "url": "https://www.ias.ac.in/SRFp/Overview"
            },
            {
                "title": "Indian National Olympiad (INO)",
                "type": "competition",
                "flags": ["india", "science", "competition"],
                "description": "The Indian National Olympiad (INO) is a series of national-level competitions in subjects like physics, chemistry, biology, astronomy, and mathematics for high school students.",
                "content": "## Requirements\n- Enrolled in secondary or higher secondary school\n- Strong aptitude in science or mathematics\n\n## Qualifications\n- Performance in regional and national level exams\n\nTop performers in the INO are selected to represent India in the International Olympiads, receiving certificates, medals, and scholarships.",
                "url": "http://olympiads.hbcse.tifr.res.in/"
            },
            {
                "title": "Indian National Olympiad (INO)",
                "type": "competition",
                "flags": ["india", "science", "competition"],
                "description": "The Indian National Olympiad (INO) is a series of national-level competitions in subjects like physics, chemistry, biology, astronomy, and mathematics for high school students.",
                "content": "## Requirements\n- Enrolled in secondary or higher secondary school\n- Strong aptitude in science or mathematics\n\n## Qualifications\n- Performance in regional and national level exams\n\nTop performers in the INO are selected to represent India in the International Olympiads, receiving certificates, medals, and scholarships.",
                "url": "http://olympiads.hbcse.tifr.res.in/"
            },
            {
                "title": "Atal Innovation Mission (AIM) Tinkering Labs",
                "type": "program",
                "flags": ["india", "technology", "education"],
                "description": "Atal Tinkering Labs (ATL) are dedicated workspaces where students can innovate and develop skills through hands-on activities in fields like robotics, 3D printing, and the Internet of Things (IoT).",
                "content": "## Requirements\n- School students (grade 6-12)\n- Interest in science, technology, engineering, and mathematics (STEM)\n\n## Qualifications\n- Participation in school-based ATL programs\n\nATL provides access to modern tools and equipment, fostering creativity and innovation among young students from diverse backgrounds.",
                "url": "https://aim.gov.in/atl.php"
            }
    ];
    
    blocks.forEach(async (block) => {
        await db.writeData(block);
    });

    res.send("Done populating DB.");
});

// Posting a suggestion from the user.
app.post('/submitSuggestion', async (req, res) => {
    const suggestionOut = req.body;
    //console.log('Received suggestion:', suggestionOut);
    
    await db.writeData(suggestionOut);  
    res.status(200).send({ message: 'Suggestion received successfully' });
});

// The default endpoint for queries made by the user. If they choose not to enter
// tags, flags, and anything else manually, this is where the queries for LLM/Gemini processing will go
app.get('/naturalUserQuery/:query', async (req, res) => {
    if (!gemini.GEMINIPREPARED) {
        res.send("GEMINI LLM NOT PREPARED YET...");
        throw new Error("Gemini LLM interface not prepared for user interaction yet!");
    }
    console.log(`User said: ${req.params.query}`);

    const GeminiResponse = await gemini.queryGem(req.params.query);
    console.log(`SmartyPants computes: ${GeminiResponse}`);

    let GeminiObject;

    try {
        let processedResponse = GeminiResponse.replace(/'/g, '"');
        GeminiObject = JSON.parse(`{${processedResponse}}`);
    }
    catch (err) {
        if (err) {
            console.log("ERROR OCCURRED WITH THE GEMINI PARSING: " + err);
        }
    }

    let parsedFlags = GeminiObject["FLAGS"].split(',');
    let dbResponse = await db.retrieveData({
        "type": GeminiObject["TYPE"],
        "flags" : { $all: parsedFlags }
    });

    // Maybe types and flags won't match up initially, that's fine.
    if (dbResponse.length === 0) {
        dbResponse = await db.retrieveData({
            "flags" : { $all: parsedFlags }
        });
    }

    // If STILL no responses, get a highly generic result pool
    if (dbResponse.length === 0) {
        dbResponse = await db.retrieveData({
            "type": GeminiObject["TYPE"]
        });
    }
    console.log(`\n\nDATABASE RESPONSE:\n\n\n${JSON.stringify(dbResponse)}`);

    // Sends an ARRAY of perfectly formatted data matching the schema on the Vue end, just a different _id system.
    res.send(dbResponse);
});

// This is the secondary endpoint for queries made by the user. If they DO choose to enter
// some custom flags, this is where the data will be sent.
app.post('/parametrizedUserQuery', (req, res) => {

});

// Initialize server at the correct port
app.listen(port, async () => {
    console.log("Server running @ " + port);
    console.log("Affirmative Gemini instruction reception pending...");

    console.log(`RECEIVED: ${await gemini.prepareGeminiInstruction()}`);
    console.log("SmartyPants is ready for extracting information now.");

    gemini.GEMINIPREPARED = true;
});