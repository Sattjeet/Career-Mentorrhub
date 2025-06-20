const form = document.getElementById("announcementForm");
const titleInput = document.getElementById("announcementTitle");
const textInput = document.getElementById("announcementText");
const titleCounter = document.getElementById("titleCounter");
const contentCounter = document.getElementById("contentCounter");
const successMessage = document.getElementById("successMessage");
const previewSection = document.getElementById("previewSection");
const previewTitle = document.getElementById("previewTitle");
const previewContent = document.getElementById("previewContent");
const previewBtn = document.getElementById("previewBtn");
const clearBtn = document.getElementById("clearBtn");
const uploadBtn = document.getElementById("uploadBtn");

// Character counter functionality
titleInput.addEventListener("input", function () {
  const count = this.value.length;
  titleCounter.textContent = `${count}/100`;
  titleCounter.style.color = count > 90 ? "#dc3545" : "#666";
});

textInput.addEventListener("input", function () {
  const count = this.value.length;
  contentCounter.textContent = `${count}/1000`;
  contentCounter.style.color = count > 950 ? "#dc3545" : "#666";
});

// Preview functionality
previewBtn.addEventListener("click", function () {
  const title = titleInput.value.trim();
  const content = textInput.value.trim();

  if (!title && !content) {
    alert("Please enter some content to preview.");
    return;
  }

  previewTitle.textContent = title || "Untitled Announcement";
  previewContent.textContent = content || "No content provided.";
  previewSection.style.display = "block";
  previewSection.scrollIntoView({ behavior: "smooth" });
});

// Clear functionality
clearBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear all content?")) {
    titleInput.value = "";
    textInput.value = "";
    titleCounter.textContent = "0/100";
    contentCounter.textContent = "0/1000";
    previewSection.style.display = "none";
    successMessage.style.display = "none";
    titleInput.focus();
  }
});

// Form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = textInput.value.trim();

  if (!title && !content) {
    alert("Please enter at least a title or content for your announcement.");
    return;
  }

  // Simulate upload process
  uploadBtn.textContent = "Uploading...";
  uploadBtn.disabled = true;

  async function uploadData(content, title) {
    const data = {
      announcement: content,
      announcement_heading: title,
    };
    console.log(data);
    const response = await fetch("http://16.171.27.10:3000/add-announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("sent");
    const result = await response.json();
    console.log(result.message);
  }
  successMessage.style.display = "block";
  successMessage.scrollIntoView({ behavior: "smooth" });

  // Reset button
  uploadBtn.textContent = "Upload Announcement";
  uploadBtn.disabled = false;

  // Hide success message after 5 seconds
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 5000);
  uploadData(content, title);
});

// Auto-resize textareas
function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

titleInput.addEventListener("input", () => autoResize(titleInput));
textInput.addEventListener("input", () => autoResize(textInput));

// Focus on title input when page loads
window.addEventListener("load", () => {
  titleInput.focus();
  //loadLeadsData();
  //updateLeadsStats();
});

// Leads Management System

document.addEventListener("DOMContentLoaded", function () {
  async function fetchAndRenderLeads() {
    try {
      const response = await fetch("http://16.171.27.10:3000/leads");
      const data = await response.json();
      const leads = data;
      console.log(data);

      let leadsData = leads;
      let filteredLeads = leads;
      let currentPage = 1;
      const leadsPerPage = 5;

      // Leads functionality
      const searchInput = document.getElementById("searchLeads");
      const searchBtn = document.getElementById("searchBtn");
      const dateFilter = document.getElementById("dateFilter");
      const exportBtn = document.getElementById("exportBtn");
      const leadsTableBody = document.getElementById("leadsTableBody");
      const totalLeadsSpan = document.getElementById("totalLeads");
      const monthlyLeadsSpan = document.getElementById("monthlyLeads");
      const currentPageSpan = document.getElementById("currentPage");
      const totalPagesSpan = document.getElementById("totalPages");
      const prevPageBtn = document.getElementById("prevPage");
      const nextPageBtn = document.getElementById("nextPage");

      function loadLeadsData() {
        renderLeadsTable();
        updatePagination();
      }

      function renderLeadsTable() {
        const startIndex = (currentPage - 1) * leadsPerPage;
        const endIndex = startIndex + leadsPerPage;
        const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

        if (paginatedLeads.length === 0) {
          leadsTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty-state">
                            <div class="empty-state-icon">📭</div>
                            <div>No leads found matching your criteria</div>
                        </td>
                    </tr>
                `;
          return;
        }

        leadsTableBody.innerHTML = paginatedLeads
          .map(
            (lead) => `
                <tr>
                    <td><strong>${lead.username}</strong></td>
                    <td>${lead.telephone_number}</td>
                    <td>${lead.email}</td>
                    <td>${formatDate(lead.registration_date)}</td>
                    <td>
                        <button class="action-btn edit" onclick="editLead('${lead.username}')">Edit</button>
                        <button class="action-btn delete" onclick="deleteLead('${lead.username}')">Delete</button>
                    </td>
                </tr>
            `
          )
          .join("");
      }

      function updatePagination() {
        const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
      }

      function updateLeadsStats() {
        totalLeadsSpan.textContent = leadsData.length;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthlyCount = leadsData.filter((lead) => {
          const leadDate = new Date(lead.registrationDate);
          return (
            leadDate.getMonth() === currentMonth &&
            leadDate.getFullYear() === currentYear
          );
        }).length;

        monthlyLeadsSpan.textContent = monthlyCount;
      }

      function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      function filterLeads() {
        const searchTerm = searchInput.value.toLowerCase();
        const dateFilterValue = dateFilter.value;
        const currentDate = new Date();

        filteredLeads = leadsData.filter((lead) => {
          const matchesSearch =
            !searchTerm ||
            lead.username.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm) ||
            lead.phone.includes(searchTerm);

          let matchesDate = true;
          const leadDate = new Date(lead.registrationDate);

          switch (dateFilterValue) {
            case "today":
              matchesDate =
                leadDate.toDateString() === currentDate.toDateString();
              break;
            case "week":
              const weekAgo = new Date(
                currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
              );
              matchesDate = leadDate >= weekAgo;
              break;
            case "month":
              matchesDate =
                leadDate.getMonth() === currentDate.getMonth() &&
                leadDate.getFullYear() === currentDate.getFullYear();
              break;
          }

          return matchesSearch && matchesDate;
        });

        currentPage = 1;
        loadLeadsData();
      }

      function editLead(username) {
        const lead = leadsData.find((l) => l.username === username);
        if (lead) {
          alert(
            `Edit functionality for ${lead.username}\nEmail: ${lead.email}\nPhone: ${lead.phone}`
          );
          // Here you would typically open a modal or navigate to an edit form
        }
      }

      function deleteLead(username) {
        if (confirm(`Are you sure you want to delete lead: ${username}?`)) {
          leadsData = leadsData.filter((l) => l.username !== username);
          filteredLeads = filteredLeads.filter((l) => l.username !== username);

          // Adjust current page if necessary
          const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
          if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
          }

          loadLeadsData();
          updateLeadsStats();
          alert("Lead deleted successfully!");
        }
      }

      function exportToCSV() {
        const headers = ["Username", "Phone", "Email", "Registration Date"];
        const csvContent = [
          headers.join(","),
          ...filteredLeads.map((lead) =>
            [
              lead.username,
              lead.telephone_number,
              lead.email,
              lead.registration_date,
            ].join(",")
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads_export_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      // Event listeners for leads functionality
      searchBtn.addEventListener("click", filterLeads);
      searchInput.addEventListener("input", filterLeads);
      dateFilter.addEventListener("change", filterLeads);
      exportBtn.addEventListener("click", exportToCSV);

      prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          loadLeadsData();
        }
      });

      nextPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          loadLeadsData();
        }
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }

    loadLeadsData();
    updateLeadsStats();
  }

  fetchAndRenderLeads();
});

// Make functions global for onclick handlers
//window.editLead = editLead;
//window.deleteLead = deleteLead;
