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

app.use(cors());
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
        }
    ];
    
    blocks.forEach(async (block) => {
        await db.writeData(block);
    });

    res.send("Done populating DB.");
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

    let dbResponse = await db.retrieveData({"type": GeminiObject["TYPE"]});
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