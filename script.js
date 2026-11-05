// Default notices to show when the project is opened for the first time
const defaultNotices = [
    {
        id: 1,
        title: "Mid-Term (Internal) Examination Schedule - B.Tech II Year",
        category: "Examination",
        postedBy: "Exam Controller",
        description: "All 2nd year students are informed that the 1st Mid-Term examinations will start from the 15th of next month. Check the department notice board for room allotment.",
        date: "10 Oct 2026",
        isUrgent: true
    },
    {
        id: 2,
        title: "Practical File Submission for DSA and OOPs Lab",
        category: "Academic",
        postedBy: "Prof. R. K. Sharma (CSE Dept)",
        description: "Students of Batch A1 and A2 must get their Data Structures and OOPs lab manuals checked and signed before Friday, 4:00 PM.",
        date: "08 Oct 2026",
        isUrgent: false
    },
    {
        id: 3,
        title: "Last Date for State Post-Matric Scholarship Portal Verification",
        category: "Administration",
        postedBy: "Scholarship Section (Registrar Office)",
        description: "Students applying for the scholarship must submit hard copies of their income certificate, college fee receipt, and Aadhaar card at Counter No. 3.",
        date: "05 Oct 2026",
        isUrgent: true
    },
    {
        id: 4,
        title: "Volunteer Registration Open for Annual Tech Fest 'TechnoVanza'",
        category: "Events",
        postedBy: "Student Cultural Council",
        description: "Interested 2nd year students who want to join the coding club or management committee for the annual fest can register in the seminar hall at 3:00 PM.",
        date: "02 Oct 2026",
        isUrgent: false
    }
];

// Load notices from LocalStorage or use defaultNotices if empty
let notices = JSON.parse(localStorage.getItem("collegeNotices"));
if (!notices || notices.length === 0) {
    notices = defaultNotices;
    localStorage.setItem("collegeNotices", JSON.stringify(notices));
}

// Get DOM Elements
const noticeForm = document.getElementById("noticeForm");
const noticeList = document.getElementById("noticeList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

// Function to display notices on screen
function displayNotices() {
    noticeList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    // Filter notices based on search text and category
    const filteredNotices = notices.filter(function(notice) {
        const matchesSearch = notice.title.toLowerCase().includes(searchText) || 
                              notice.description.toLowerCase().includes(searchText);
        const matchesCategory = (selectedCategory === "All") || (notice.category === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    // If no notice found
    if (filteredNotices.length === 0) {
        noticeList.innerHTML = "<p style='background:white; padding:15px; border:1px solid #ddd;'>No notices found matching your search.</p>";
        return;
    }

    // Loop through notices and create HTML cards
    filteredNotices.forEach(function(notice) {
        const card = document.createElement("div");
        card.className = notice.isUrgent ? "notice-card urgent" : "notice-card";

        const urgentTag = notice.isUrgent ? '<span class="urgent-badge">URGENT</span>' : '';

        card.innerHTML = `
            <div class="notice-top">
                <div>
                    <span class="badge">${notice.category}</span>
                    ${urgentTag}
                </div>
                <span class="notice-date">Date: ${notice.date}</span>
            </div>
            <h3 class="notice-title">${notice.title}</h3>
            <p class="notice-desc">${notice.description}</p>
            <div class="notice-footer">
                <span><strong>Issued By:</strong> ${notice.postedBy}</span>
                <button class="btn-delete" onclick="deleteNotice(${notice.id})">Remove</button>
            </div>
        `;

        noticeList.appendChild(card);
    });
}

// Event Listener for adding a new notice
noticeForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const pinInput = document.getElementById("pin").value;

    // Simple Faculty PIN verification (PIN is 1234)
    if (pinInput !== "1234") {
        alert("Invalid Faculty PIN! Please enter 1234 to publish a notice.");
        return;
    }

    // Get today's date in simple format (e.g., 05 Nov 2026)
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    // Create new notice object
    const newNotice = {
        id: Date.now(),
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        postedBy: document.getElementById("postedBy").value,
        description: document.getElementById("description").value,
        isUrgent: document.getElementById("isUrgent").checked,
        date: formattedDate
    };

    // Add to the top of the array and save to LocalStorage
    notices.unshift(newNotice);
    localStorage.setItem("collegeNotices", JSON.stringify(notices));

    // Reset form and refresh notice board
    noticeForm.reset();
    displayNotices();
    alert("Notice published successfully!");
});

// Function to delete a notice
function deleteNotice(id) {
    const confirmDelete = confirm("Are you sure you want to remove this notice?");
    if (confirmDelete) {
        notices = notices.filter(function(notice) {
            return notice.id !== id;
        });
        localStorage.setItem("collegeNotices", JSON.stringify(notices));
        displayNotices();
    }
}

// Event listeners for search and category filter
searchInput.addEventListener("input", displayNotices);
filterCategory.addEventListener("change", displayNotices);

// Load notices when page opens
displayNotices();
