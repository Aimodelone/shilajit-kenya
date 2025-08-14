import timg1 from '/public/images/team/1.jpg'
import timg2 from '/public/images/team/2.jpg'
import timg3 from '/public/images/team/3.jpg'
import timg4 from '/public/images/team/4.jpg'

import tSimg1 from '/public/images/team/single/img-1.jpg'
import tSimg2 from '/public/images/team/single/img-2.jpg'
import tSimg3 from '/public/images/team/single/img-3.jpg'
import tSimg4 from '/public/images/team/single/img-4.jpg'

import crt1 from '/public/images/certificates/1.jpg'
import crt2 from '/public/images/certificates/2.jpg'
import crt3 from '/public/images/certificates/3.jpg'
import crt4 from '/public/images/certificates/4.jpg'

const Teams = [
    {
        Id: '1',
        tImg: timg1,
        tSImg: tSimg1,
        slug: 'Esther-Howard',
        name: 'Shilajit Resin',
        title: 'KES. 3,500/-',
        experience: '12 Years',
        address: '6391 Elgin St. Celina, Delaware 10299',
        phone: '+00 568 746 987',
        email: 'esther.howard@gmail.com',
        certificates: [crt1, crt2, crt3, crt4],
        experienceDescription: [
            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable.",
            "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words."
        ],
        education: [
            "Academy University School of Political Science, Boston, MA",
            "Admization Institute of Political Science, Juzment School of Management, Cambridge",
            "The Syntify High School Of New York",
            "Education & Political Admissions",
            "Admization Institute of Political Science, Juzment School of Management, Cambridge"
        ],
        skills: [
            { name: 'Political Science', value: 85 },
            { name: 'Education', value: 80 },
            { name: 'Development', value: 95 },
            { name: 'Qualification', value: 70 },
        ],
        achievements: [
            "Best Political Science award 2017",
            "Specials awards for Political activity 2018",
            "Super Politician Top 50 Politician in USA",
            "Young star Award at politician in 2021",
            "Greatest Politician Top 10"
        ],
        appointmentSubjects: ["River Development", "Village Development", "Road Development", "Town Development", "Social Development"]
    },
    {
        Id: '2',
        tImg: timg2,
        tSImg: tSimg2,
        slug: 'Guy-Hawkins',
        name: 'Shilajit capsules',
        title: 'KES. 4,500/-',
        experience: '10 Years',
        address: '1234 Maple Ave, Chicago, IL 60616',
        phone: '+00 123 456 789',
        email: 'guy.hawkins@gmail.com',
        certificates: [crt1, crt3],
        experienceDescription: [
            "Guy has led multiple successful marketing campaigns for political organizations across the country.",
            "He specializes in outreach strategies and social media engagement."
        ],
        education: [
            "University of Marketing and Communications, Chicago, IL",
            "Social Media Strategy Institute, New York, NY"
        ],
        skills: [
            { name: 'Marketing', value: 90 },
            { name: 'Campaign Management', value: 85 },
            { name: 'Public Relations', value: 80 },
            { name: 'Strategy', value: 75 },
        ],
        achievements: [
            "Top Marketing Strategist 2018",
            "Innovative Campaign Award 2019",
            "Best Outreach Program 2020"
        ],
        appointmentSubjects: ["Campaign Management", "Social Media Strategy", "Public Relations"]
    },
    {
        Id: '3',
        tImg: timg3,
        tSImg: tSimg3,
        slug: 'Robert-Fox',
        name: 'Shilajit gummies',
        title: 'KES. 3,000/-',
        experience: '8 Years',
        address: '789 Pine St, Seattle, WA 98101',
        phone: '+00 987 654 321',
        email: 'robert.fox@gmail.com',
        certificates: [crt2, crt4],
        experienceDescription: [
            "Robert has been working in medical assistance for several healthcare campaigns and public health initiatives.",
            "He ensures smooth coordination of all health-related activities within political campaigns."
        ],
        education: [
            "Seattle Medical Institute, WA",
            "Public Health Program, University of Washington, Seattle"
        ],
        skills: [
            { name: 'Medical Assistance', value: 90 },
            { name: 'Coordination', value: 85 },
            { name: 'Healthcare Management', value: 80 },
        ],
        achievements: [
            "Healthcare Excellence Award 2019",
            "Community Health Champion 2020",
            "Medical Volunteer of the Year 2021"
        ],
        appointmentSubjects: ["Medical Assistance", "Healthcare Coordination", "Health Campaigns"]
    },
    {
        Id: '4',
        tImg: timg4,
        tSImg: tSimg4,
        slug: 'Devon-Lane',
        name: 'Shilajit 8 in 1 Capsules',
        title: 'KES. 3,000/-',
        experience: '15 Years',
        address: '456 Oak St, Dallas, TX 75201',
        phone: '+00 555 123 456',
        email: 'devon.lane@gmail.com',
        certificates: [crt1, crt2, crt3],
        experienceDescription: [
            "Devon has extensive experience in leading sales teams and managing large-scale projects.",
            "He has contributed to the growth and success of multiple political organizations."
        ],
        education: [
            "Texas Business School, Dallas, TX",
            "Leadership & Management Institute, Houston, TX"
        ],
        skills: [
            { name: 'Sales Leadership', value: 95 },
            { name: 'Project Management', value: 90 },
            { name: 'Strategy', value: 85 },
        ],
        achievements: [
            "Top Sales Executive 2018",
            "Outstanding Leadership Award 2019",
            "Strategic Planner of the Year 2020"
        ],
        appointmentSubjects: ["Sales Strategy", "Project Management", "Leadership Training"]
    }
]

export default Teams;
