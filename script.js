
/* =========================================
   MARKETFLOW - MARKETING AUTOMATION SYSTEM
   WD-CRM-005 | JavaScript
========================================= */

// 1. SAMPLE DATA

const defaultCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2026",
    type: "Email Campaign",
    audience: "All Subscribers",
    status: "Completed",
    open_rate: 45.2,
    click_rate: 12.8,
    sent_date: "2026-06-20"
  },
  {
    id: 2,
    name: "Product Launch",
    type: "Product Launch",
    audience: "Engaged Subscribers",
    status: "Scheduled",
    open_rate: 0,
    click_rate: 0,
    sent_date: "2026-11-10"
  },
  {
    id: 3,
    name: "Weekly Newsletter",
    type: "Newsletter",
    audience: "All Subscribers",
    status: "In Progress",
    open_rate: 38.5,
    click_rate: 9.6,
    sent_date: "2026-11-01"
  },
  {
    id: 4,
    name: "Welcome Campaign",
    type: "Email Campaign",
    audience: "New Subscribers",
    status: "Completed",
    open_rate: 62.3,
    click_rate: 22.1,
    sent_date: "2026-10-25"
  },
  {
    id: 5,
    name: "Festive Offers",
    type: "Promotional Offer",
    audience: "Engaged Subscribers",
    status: "Draft",
    open_rate: 0,
    click_rate: 0,
    sent_date: ""
  }
];

const defaultSubscribers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    status: "Active",
    subscribed_date: "2026-01-15"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "Active",
    subscribed_date: "2026-02-20"
  },
  {
    id: 3,
    name: "Alex Morgan",
    email: "alex@example.com",
    status: "Active",
    subscribed_date: "2026-03-10"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    status: "Inactive",
    subscribed_date: "2026-04-05"
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael@example.com",
    status: "Active",
    subscribed_date: "2026-05-12"
  },
  {
    id: 6,
    name: "Priya Sharma",
    email: "priya@example.com",
    status: "Active",
    subscribed_date: "2026-06-18"
  }
];

const defaultTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to our community!",
    content: "Hello! Thank you for joining us."
  },
  {
    id: 2,
    name: "Promotional Email",
    subject: "Special offers just for you!",
    content: "Discover our latest offers and discounts."
  },
  {
    id: 3,
    name: "Weekly Newsletter",
    subject: "Your weekly updates",
    content: "Here are this week's latest updates."
  }
];

const defaultWorkflows = [
  {
    id: 1,
    name: "Welcome Series",
    trigger: "New subscriber",
    status: "Active"
  },
  {
    id: 2,
    name: "Abandoned Cart Recovery",
    trigger: "Abandoned cart",
    status: "Active"
  },
  {
    id: 3,
    name: "Customer Re-engagement",
    trigger: "Inactive customer",
    status: "Paused"
  }
];

const defaultLandingPages = [
  {
    id: 1,
    name: "Summer Sale Landing Page",
    description: "Promotional page for summer offers."
  },
  {
    id: 2,
    name: "Product Launch Page",
    description: "Introducing the latest product collection."
  }
];

// 2. DATA STORAGE

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

let campaigns = loadData("mf_campaigns", defaultCampaigns);
let subscribers = loadData("mf_subscribers", defaultSubscribers);
let templates = loadData("mf_templates", defaultTemplates);
let workflows = loadData("mf_workflows", defaultWorkflows);
let landingPages = loadData("mf_landing_pages", defaultLandingPages);

function saveData() {
  localStorage.setItem("mf_campaigns", JSON.stringify(campaigns));
  localStorage.setItem("mf_subscribers", JSON.stringify(subscribers));
  localStorage.setItem("mf_templates", JSON.stringify(templates));
  localStorage.setItem("mf_workflows", JSON.stringify(workflows));
  localStorage.setItem("mf_landing_pages", JSON.stringify(landingPages));
}

// 3. HELPER FUNCTIONS

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function nextId(items) {
  return items.length
    ? Math.max(...items.map(item => Number(item.id) || 0)) + 1
    : 1;
}

function formatDate(date) {
  return date
    ? new Date(date + "T00:00:00").toLocaleDateString()
    : "—";
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function average(items, property) {
  const completed = items.filter(item => item.status === "Completed");

  if (!completed.length) return 0;

  return completed.reduce((sum, item) => {
    return sum + Number(item[property] || 0);
  }, 0) / completed.length;
}

function badgeClass(status) {
  const classes = {
    "Draft": "badge-draft",
    "Scheduled": "badge-scheduled",
    "In Progress": "badge-progress",
    "Completed": "badge-completed",
    "Cancelled": "badge-cancelled",
    "Active": "badge-active",
    "Inactive": "badge-inactive",
    "Paused": "badge-draft"
  };

  return classes[status] || "badge-draft";
}

function badge(status) {
  return `<span class="badge ${badgeClass(status)}">${escapeHTML(status)}</span>`;
}

// 4. DASHBOARD

function renderDashboard() {
  const openRate = average(campaigns, "open_rate");
  const clickRate = average(campaigns, "click_rate");

  $("total-campaigns").textContent = campaigns.length;
  $("total-subscribers").textContent = subscribers.length;
  $("average-open").textContent = openRate.toFixed(1) + "%";
  $("average-click").textContent = clickRate.toFixed(1) + "%";

  const recent = [...campaigns].slice(-5).reverse();

  $("recent-campaigns").innerHTML = recent.map(campaign => `
    <tr>
      <td><strong>${escapeHTML(campaign.name)}</strong></td>
      <td>${escapeHTML(campaign.audience)}</td>
      <td>${badge(campaign.status)}</td>
      <td>${Number(campaign.open_rate).toFixed(1)}%</td>
    </tr>
  `).join("");

  renderStatusSummary();
  renderCharts();
  renderAnalytics();
  renderReport();
}

function renderStatusSummary() {
  const statuses = ["Draft", "Scheduled", "In Progress", "Completed", "Cancelled"];

  $("status-summary").innerHTML = statuses.map(status => {
    const count = campaigns.filter(c => c.status === status).length;
    const percentage = campaigns.length
      ? (count / campaigns.length) * 100
      : 0;

    return `
      <div>
        <div class="status-item">
          <span class="status-name">${status}</span>
          <span class="status-count">${count}</span>
        </div>
        <div class="status-bar">
          <div class="status-fill" style="width:${percentage}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

// 5. CSS-BASED CAMPAIGN CHARTS

function chartHTML() {
  const completed = campaigns.filter(c => c.status === "Completed");

  if (!completed.length) {
    return "<p>No completed campaign data available.</p>";
  }

  return `
    <div style="display:flex;align-items:flex-end;gap:16px;
      height:220px;padding:15px 5px 0;">
      ${completed.map(c => {
        const open = Math.min(Number(c.open_rate) || 0, 100);
        const click = Math.min(Number(c.click_rate) || 0, 100);

        return `
          <div style="flex:1;min-width:0;text-align:center;">
            <div style="display:flex;align-items:flex-end;
              justify-content:center;gap:5px;height:175px;">
              <div title="Open rate ${open}%"
                style="width:35%;height:${open}%;
                background:#DC2626;border-radius:5px 5px 0 0;">
              </div>
              <div title="Click rate ${click}%"
                style="width:35%;height:${click}%;
                background:#FCA5A5;border-radius:5px 5px 0 0;">
              </div>
            </div>
            <small style="display:block;overflow:hidden;
              text-overflow:ellipsis;white-space:nowrap;
              margin-top:8px;color:#6B7280;">
              ${escapeHTML(c.name)}
            </small>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderCharts() {
  $("performance-chart").innerHTML = chartHTML();
  $("analytics-chart").innerHTML = chartHTML();
}

// 6. CAMPAIGN MANAGEMENT

function renderCampaigns() {
  const search = $("campaign-search").value.toLowerCase();
  const filter = $("campaign-filter").value;

  const filtered = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(search);
    const matchesFilter = filter === "all" || campaign.status === filter;

    return matchesSearch && matchesFilter;
  });

  $("campaign-list").innerHTML = filtered.length
    ? filtered.map(campaign => `
      <tr>
        <td><strong>${escapeHTML(campaign.name)}</strong></td>
        <td>${escapeHTML(campaign.type)}</td>
        <td>${escapeHTML(campaign.audience)}</td>
        <td>${badge(campaign.status)}</td>
        <td>${Number(campaign.open_rate).toFixed(1)}%</td>
        <td>
          <button class="action-button" data-edit="${campaign.id}">Edit</button>
          <button class="action-button delete-button"
            data-delete="${campaign.id}">Delete</button>
        </td>
      </tr>
    `).join("")
    : `<tr><td colspan="6">No campaigns found.</td></tr>`;
}

function openCampaignForm(campaign = null) {
  $("campaign-form-panel").hidden = false;
  $("campaign-form-title").textContent = campaign
    ? "Edit Campaign"
    : "Create Campaign";

  $("campaign-id").value = campaign?.id || "";
  $("campaign-name").value = campaign?.name || "";
  $("campaign-type").value = campaign?.type || "Email Campaign";
  $("campaign-audience").value = campaign?.audience || "All Subscribers";
  $("campaign-status").value = campaign?.status || "Draft";

  $("campaign-form-panel").scrollIntoView({ behavior: "smooth" });
}

function closeCampaignForm() {
  $("campaign-form-panel").hidden = true;
  $("campaign-form").reset();
  $("campaign-id").value = "";
}

$("create-campaign").addEventListener("click", () => openCampaignForm());
$("dashboard-create").addEventListener("click", () => {
  location.hash = "campaigns";
  openCampaignForm();
});
$("cancel-campaign").addEventListener("click", closeCampaignForm);

$("campaign-form").addEventListener("submit", event => {
  event.preventDefault();

  const id = $("campaign-id").value;

  const data = {
    name: $("campaign-name").value.trim(),
    type: $("campaign-type").value,
    audience: $("campaign-audience").value,
    status: $("campaign-status").value,
    sent_date: "",
    open_rate: 0,
    click_rate: 0
  };

  if (id) {
    campaigns = campaigns.map(campaign =>
      campaign.id === Number(id)
        ? { ...campaign, ...data }
        : campaign
    );
    showToast("Campaign updated successfully!");
  } else {
    campaigns.push({
      id: nextId(campaigns),
      ...data
    });
    showToast("Campaign created successfully!");
  }

  saveData();
  closeCampaignForm();
  refreshAll();
});

$("campaign-list").addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const campaign = campaigns.find(
      c => c.id === Number(editButton.dataset.edit)
    );
    openCampaignForm(campaign);
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.delete);

    if (confirm("Delete this campaign permanently?")) {
      campaigns = campaigns.filter(c => c.id !== id);
      saveData();
      refreshAll();
      showToast("Campaign deleted.");
    }
  }
});

$("campaign-search").addEventListener("input", renderCampaigns);
$("campaign-filter").addEventListener("change", renderCampaigns);

// 7. EMAIL TEMPLATE MANAGEMENT

function renderTemplates() {
  $("template-list").innerHTML = templates.map(template => `
    <article class="item-card">
      <h3>${escapeHTML(template.name)}</h3>
      <p><strong>Subject:</strong> ${escapeHTML(template.subject)}</p>
      <p>${escapeHTML(template.content)}</p>
      <div class="card-actions">
        <button class="action-button" data-preview="${template.id}">Preview</button>
        <button class="action-button delete-button"
          data-delete-template="${template.id}">Delete</button>
      </div>
    </article>
  `).join("") || "<p>No email templates yet.</p>";
}

$("add-template").addEventListener("click", () => {
  $("template-form-panel").hidden = false;
  $("template-form-panel").scrollIntoView({ behavior: "smooth" });
});

$("cancel-template").addEventListener("click", () => {
  $("template-form-panel").hidden = true;
  $("template-form").reset();
});

$("template-form").addEventListener("submit", event => {
  event.preventDefault();

  templates.push({
    id: nextId(templates),
    name: $("template-name").value.trim(),
    subject: $("template-subject").value.trim(),
    content: $("template-content").value.trim()
  });

  saveData();
  renderTemplates();
  $("template-form").reset();
  $("template-form-panel").hidden = true;
  showToast("Email template saved!");
});

$("template-list").addEventListener("click", event => {
  const preview = event.target.closest("[data-preview]");
  const deleteButton = event.target.closest("[data-delete-template]");

  if (preview) {
    const template = templates.find(
      t => t.id === Number(preview.dataset.preview)
    );

    alert(
      "EMAIL PREVIEW\n\n" +
      "Subject: " + template.subject + "\n\n" +
      template.content
    );
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteTemplate);

    if (confirm("Delete this email template?")) {
      templates = templates.filter(t => t.id !== id);
      saveData();
      renderTemplates();
      showToast("Template deleted.");
    }
  }
});

// 8. SUBSCRIBER MANAGEMENT

function renderSubscribers() {
  const search = $("subscriber-search").value.toLowerCase();

  const filtered = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(search) ||
    subscriber.email.toLowerCase().includes(search)
  );

  $("subscriber-list").innerHTML = filtered.length
    ? filtered.map(subscriber => `
      <tr>
        <td><strong>${escapeHTML(subscriber.name)}</strong></td>
        <td>${escapeHTML(subscriber.email)}</td>
        <td>${badge(subscriber.status)}</td>
        <td>${formatDate(subscriber.subscribed_date)}</td>
        <td>
          <button class="action-button"
            data-toggle-subscriber="${subscriber.id}">
            ${subscriber.status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <button class="action-button delete-button"
            data-delete-subscriber="${subscriber.id}">Delete</button>
        </td>
      </tr>
    `).join("")
    : `<tr><td colspan="5">No subscribers found.</td></tr>`;
}

$("add-subscriber").addEventListener("click", () => {
  $("subscriber-form-panel").hidden = false;
  $("subscriber-form-panel").scrollIntoView({ behavior: "smooth" });
});

$("cancel-subscriber").addEventListener("click", () => {
  $("subscriber-form-panel").hidden = true;
  $("subscriber-form").reset();
});

$("subscriber-form").addEventListener("submit", event => {
  event.preventDefault();

  const email = $("subscriber-email").value.trim().toLowerCase();

  if (subscribers.some(s => s.email.toLowerCase() === email)) {
    showToast("This email is already subscribed.");
    return;
  }

  subscribers.push({
    id: nextId(subscribers),
    name: $("subscriber-name").value.trim(),
    email,
    status: "Active",
    subscribed_date: new Date().toISOString().slice(0, 10)
  });

  saveData();
  renderSubscribers();
  renderDashboard();

  $("subscriber-form").reset();
  $("subscriber-form-panel").hidden = true;

  showToast("Subscriber added successfully!");
});

$("subscriber-search").addEventListener("input", renderSubscribers);

$("subscriber-list").addEventListener("click", event => {
  const toggle = event.target.closest("[data-toggle-subscriber]");
  const deleteButton = event.target.closest("[data-delete-subscriber]");

  if (toggle) {
    const id = Number(toggle.dataset.toggleSubscriber);

    subscribers = subscribers.map(subscriber =>
      subscriber.id === id
        ? {
            ...subscriber,
            status: subscriber.status === "Active" ? "Inactive" : "Active"
          }
        : subscriber
    );

    saveData();
    refreshAll();
    showToast("Subscriber status updated.");
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteSubscriber);

    if (confirm("Delete this subscriber?")) {
      subscribers = subscribers.filter(s => s.id !== id);
      saveData();
      refreshAll();
      showToast("Subscriber deleted.");
    }
  }
});

// 9. CSV EXPORT

function downloadCSV(filename, rows) {
  if (!rows.length) {
    showToast("No data available to export.");
    return;
  }

  const csv = rows.map(row =>
    row.map(value => {
      return '"' + String(value ?? "").replace(/"/g, '""') + '"';
    }).join(",")
  ).join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
  showToast("CSV downloaded successfully!");
}

$("export-subscribers").addEventListener("click", () => {
  downloadCSV("subscribers.csv", [
    ["ID", "Name", "Email", "Status", "Subscribed Date"],
    ...subscribers.map(s => [
      s.id, s.name, s.email, s.status, s.subscribed_date
    ])
  ]);
});

function exportCampaignReport() {
  downloadCSV("campaign-report.csv", [
    ["ID", "Campaign", "Type", "Audience", "Status", "Open Rate", "Click Rate"],
    ...campaigns.map(c => [
      c.id, c.name, c.type, c.audience, c.status, c.open_rate, c.click_rate
    ])
  ]);
}

$("export-report").addEventListener("click", exportCampaignReport);
$("download-report").addEventListener("click", exportCampaignReport);

// 10. ANALYTICS

function renderAnalytics() {
  $("analytics-total").textContent = campaigns.length;
  $("analytics-open").textContent = average(campaigns, "open_rate").toFixed(1) + "%";
  $("analytics-click").textContent = average(campaigns, "click_rate").toFixed(1) + "%";
  $("analytics-completed").textContent =
    campaigns.filter(c => c.status === "Completed").length;
}

// 11. AUTOMATION WORKFLOWS

function renderWorkflows() {
  $("workflow-list").innerHTML = workflows.map(workflow => `
    <article class="item-card">
      <h3>⟳ ${escapeHTML(workflow.name)}</h3>
      <p><strong>Trigger:</strong> ${escapeHTML(workflow.trigger)}</p>
      <p>Status: ${badge(workflow.status)}</p>
      <div class="card-actions">
        <button class="action-button"
          data-toggle-workflow="${workflow.id}">
          ${workflow.status === "Active" ? "Pause" : "Activate"}
        </button>
        <button class="action-button delete-button"
          data-delete-workflow="${workflow.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

$("add-workflow").addEventListener("click", () => {
  $("workflow-form-panel").hidden = false;
});

$("cancel-workflow").addEventListener("click", () => {
  $("workflow-form-panel").hidden = true;
  $("workflow-form").reset();
});

$("workflow-form").addEventListener("submit", event => {
  event.preventDefault();

  workflows.push({
    id: nextId(workflows),
    name: $("workflow-name").value.trim(),
    trigger: $("workflow-trigger").value,
    status: "Active"
  });

  saveData();
  renderWorkflows();

  $("workflow-form").reset();
  $("workflow-form-panel").hidden = true;
  showToast("Workflow created!");
});

$("workflow-list").addEventListener("click", event => {
  const toggle = event.target.closest("[data-toggle-workflow]");
  const deleteButton = event.target.closest("[data-delete-workflow]");

  if (toggle) {
    const id = Number(toggle.dataset.toggleWorkflow);

    workflows = workflows.map(workflow =>
      workflow.id === id
        ? {
            ...workflow,
            status: workflow.status === "Active" ? "Paused" : "Active"
          }
        : workflow
    );

    saveData();
    renderWorkflows();
    showToast("Workflow status updated.");
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteWorkflow);

    if (confirm("Delete this workflow?")) {
      workflows = workflows.filter(w => w.id !== id);
      saveData();
      renderWorkflows();
      showToast("Workflow deleted.");
    }
  }
});

// 12. LANDING PAGE MANAGEMENT

function renderLandingPages() {
  $("landing-list").innerHTML = landingPages.map(page => `
    <article class="item-card">
      <h3>▣ ${escapeHTML(page.name)}</h3>
      <p>${escapeHTML(page.description)}</p>
      <div class="card-actions">
        <button class="action-button delete-button"
          data-delete-page="${page.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

$("add-landing-page").addEventListener("click", () => {
  $("landing-form-panel").hidden = false;
});

$("cancel-landing").addEventListener("click", () => {
  $("landing-form-panel").hidden = true;
  $("landing-form").reset();
});

$("landing-form").addEventListener("submit", event => {
  event.preventDefault();

  landingPages.push({
    id: nextId(landingPages),
    name: $("landing-name").value.trim(),
    description: $("landing-description").value.trim()
  });

  saveData();
  renderLandingPages();

  $("landing-form").reset();
  $("landing-form-panel").hidden = true;
  showToast("Landing page created!");
});

$("landing-list").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-page]");

  if (button && confirm("Delete this landing page?")) {
    landingPages = landingPages.filter(
      page => page.id !== Number(button.dataset.deletePage)
    );

    saveData();
    renderLandingPages();
    showToast("Landing page deleted.");
  }
});

// 13. REPORT SUMMARY

function renderReport() {
  const completed = campaigns.filter(c => c.status === "Completed").length;
  const active = campaigns.filter(c => c.status === "In Progress").length;

  $("report-summary").textContent =
    `Total campaigns: ${campaigns.length}. ` +
    `Completed campaigns: ${completed}. ` +
    `Campaigns in progress: ${active}. ` +
    `Total subscribers: ${subscribers.length}. ` +
    `Average open rate: ${average(campaigns, "open_rate").toFixed(1)}%. ` +
    `Average click rate: ${average(campaigns, "click_rate").toFixed(1)}%.`;
}

// 14. SIMULATED LOGIN

const loginDialog = $("login-dialog");

$("login-form").addEventListener("submit", event => {
  event.preventDefault();

  const email = $("login-email").value.trim();

  if (!email || !$("login-password").value) {
    showToast("Please enter your login details.");
    return;
  }

  loginDialog.close();
  showToast("Welcome to MarketFlow!");
});

$("logout-btn").addEventListener("click", () => {
  loginDialog.showModal();
});

if (!sessionStorage.getItem("mf_logged_in")) {
  loginDialog.showModal();
}

$("login-form").addEventListener("submit", () => {
  sessionStorage.setItem("mf_logged_in", "true");
});

// 15. DARK MODE

$("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("mf_dark_mode", isDark);

  showToast(isDark ? "Dark mode enabled." : "Light mode enabled.");
});

if (localStorage.getItem("mf_dark_mode") === "true") {
  document.body.classList.add("dark-mode");
}

// 16. SIDEBAR NAVIGATION

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});

// 17. REFRESH ALL SECTIONS

function refreshAll() {
  renderDashboard();
  renderCampaigns();
  renderSubscribers();
  renderTemplates();
  renderWorkflows();
  renderLandingPages();
}

// 18. INITIALIZE APPLICATION

document.addEventListener("DOMContentLoaded", () => {
  refreshAll();
  showToast("MarketFlow loaded successfully!");
});
