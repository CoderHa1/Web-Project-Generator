// Project components for dynamic generation
const projectTypes = [
    "Portfolio", "Business", "E-commerce", "Blog", "Educational", "Real Estate", 
    "Restaurant", "Photography", "Travel", "Fitness", "News", "Event", "Music", 
    "Fashion", "Art Gallery", "Podcast", "Nonprofit", "Community", "Forum", 
    "Directory", "Review", "Social Network", "Dating", "Job Board", "Marketplace",
    "Medical", "Legal", "Sports", "Gaming", "Technology", "Interior Design", 
    "Architecture", "Financial", "Insurance", "Pet Care", "Automotive", "Beauty",
    "Yoga", "Coaching", "Consultant", "Wedding", "Entertainment", "Streaming", 
    "Recipe", "DIY", "Book Club", "Film", "Gardening", "Craft", "Children's"
];

const businessTypes = [
    "Agency", "Studio", "Consultancy", "Shop", "Store", "Boutique", "Restaurant", 
    "Café", "Bakery", "Firm", "Service", "Center", "Clinic", "Spa", "Salon", 
    "School", "Academy", "Institute", "Hub", "Space", "Gallery", "Museum", 
    "Theater", "Club", "Gym", "Laboratory", "Market", "Marketplace", "Hotel",
    "Resort", "Retreat", "Farm", "Winery", "Brewery", "Workshop", "Factory", 
    "Association", "Foundation", "Organization", "Society", "Community"
];

const features = [
    "responsive design", "dark/light mode", "user accounts", "search functionality", 
    "filtering system", "comment section", "rating system", "image gallery", 
    "video integration", "interactive map", "contact form", "booking system", 
    "payment integration", "subscription options", "newsletter signup", 
    "social media sharing", "user profiles", "testimonials section", "FAQ section", 
    "blog section", "animated elements", "parallax scrolling", "progress tracking", 
    "file uploads", "downloadable resources", "multi-language support", "accessibility features",
    "real-time updates", "custom cursor", "3D elements", "scroll animations", 
    "product configurator", "virtual tour", "calendar integration", "audio player",
    "chat functionality", "member directory", "event listing", "notification system",
    "content management", "password protection", "custom themes", "print styling"
];

const difficulties = ["Easy", "Medium", "Hard"];

const durations = [
    "1-2 days", "3-5 days", "1 week", "1-2 weeks", "2 weeks", 
    "2-3 weeks", "3 weeks", "3-4 weeks", "1 month"
];

const skills = [
    "HTML", "CSS", "JavaScript", "Responsive Design", "Form Handling", 
    "API Integration", "Local Storage", "CSS Grid", "Flexbox", "CSS Animation", 
    "Bootstrap", "Tailwind CSS", "SASS/SCSS", "SVG", "Canvas", "WebGL", 
    "DOM Manipulation", "JSON", "AJAX", "Fetch API", "Event Handling", 
    "UI/UX Design", "Accessibility", "SEO", "Performance Optimization", 
    "Cross-browser Compatibility", "Mobile-first Design", "Typography", 
    "Color Theory", "Image Optimization", "Version Control", "Responsive Images",
    "CSS Variables", "Web Fonts", "Form Validation", "Media Queries", "CSS Frameworks",
    "Content Strategy", "Information Architecture", "Web Standards", "ARIA",
    "Progressive Enhancement", "CSS Transitions", "CSS Transforms", "Animation"
];

// Function to generate a random project idea
function generateProjectIdea() {
    // Generate a random project type and business type
    const projectType = getRandomItem(projectTypes);
    const businessType = Math.random() > 0.5 ? getRandomItem(businessTypes) : "";
    
    // Generate a title
    let title;
    if (businessType) {
        title = `${projectType} ${businessType} Website`;
    } else {
        title = `${projectType} Website`;
    }
    
    // Select 1-3 random features
    const numFeatures = Math.floor(Math.random() * 3) + 1;
    const selectedFeatures = getRandomItems(features, numFeatures);
    
    // Generate description
    let description = `Create a ${projectType.toLowerCase()} website`;
    if (businessType) {
        description += ` for a ${businessType.toLowerCase()}`;
    }
    description += ` with ${selectedFeatures.join(" and ")}.`;
    
    // Select difficulty
    const difficulty = getRandomItem(difficulties);
    
    // Select duration based on difficulty
    let durationIndex;
    if (difficulty === "Easy") {
        durationIndex = Math.floor(Math.random() * 4); // First 4 options (shorter)
    } else if (difficulty === "Medium") {
        durationIndex = Math.floor(Math.random() * 3) + 2; // Middle options
    } else {
        durationIndex = Math.floor(Math.random() * 4) + 5; // Last 4 options (longer)
    }
    const duration = durations[durationIndex];
    
    // Select 3-5 skills based on difficulty
    const numSkills = Math.floor(Math.random() * 3) + 3; // 3-5 skills
    const selectedSkills = getRandomItems(skills, numSkills);
    
    // Always include HTML, CSS, JavaScript if not already included
    const essentialSkills = ["HTML", "CSS", "JavaScript"];
    essentialSkills.forEach(skill => {
        if (!selectedSkills.includes(skill)) {
            selectedSkills.unshift(skill);
        }
    });
    
    // Return the generated project idea
    return {
        title,
        description,
        difficulty,
        duration,
        skills: selectedSkills
    };
}

// Helper function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to get random items from an array
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Generate multiple project ideas
function generateMultipleIdeas(count) {
    const ideas = [];
    for (let i = 0; i < count; i++) {
        ideas.push(generateProjectIdea());
    }
    return ideas;
} 