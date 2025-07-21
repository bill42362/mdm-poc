// MDM Profile Generator JavaScript
// This file handles client-side MDM profile generation

// Generate UUID function
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Toggle section visibility
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const toggle = document.getElementById(
    sectionId.replace("Settings", "Toggle").replace("Params", "Toggle")
  );

  if (section.classList.contains("hidden")) {
    section.classList.remove("hidden");
    toggle.textContent = "▼";
  } else {
    section.classList.add("hidden");
    toggle.textContent = "▶";
  }
}

// Get form data
function getFormData() {
  const form = document.getElementById("mdmForm");
  const formData = new FormData(form);

  return {
    profileName: formData.get("profileName"),
    profileDescription: formData.get("profileDescription"),
    organization: formData.get("organization"),
    identifier: formData.get("identifier"),
    webclipTitle: formData.get("webclipTitle"),
    webclipUrl: formData.get("webclipUrl"),
    webclipIcon: formData.get("webclipIcon"),
    isRemovable: formData.get("isRemovable") === "on",
    fullScreen: formData.get("fullScreen") === "on",
    expirationDate: formData.get("expirationDate"),
    removalDate: formData.get("removalDate"),
    scope: formData.get("scope"),
    payloadVersion: parseInt(formData.get("payloadVersion")) || 1,
    uuid: formData.get("uuid") || generateUUID(),
  };
}

// Generate MDM XML
function generateMDMXML(data) {
  const now = new Date();
  const expirationDate = data.expirationDate
    ? new Date(data.expirationDate)
    : new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const removalDate = data.removalDate ? new Date(data.removalDate) : null;

  const isRemovable = data.isRemovable ? "<true/>" : "<false/>";
  const fullScreen = data.fullScreen ? "<true/>" : "<false/>";

  const expirationString = expirationDate
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");
  const removalString = removalDate
    ? removalDate.toISOString().replace(/\.\d{3}Z$/, "Z")
    : "";

  const iconData = data.webclipIcon
    ? `<key>Icon</key>
            <data>${data.webclipIcon}</data>`
    : "";

  const removalDateXML = removalString
    ? `<key>RemovalDate</key>
            <date>${removalString}</date>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadVersion</key>
            <integer>${data.payloadVersion}</integer>
            <key>PayloadIdentifier</key>
            <string>${data.identifier}.webclip</string>
            <key>PayloadUUID</key>
            <string>${generateUUID()}</string>
            <key>PayloadDisplayName</key>
            <string>${data.webclipTitle}</string>
            <key>PayloadDescription</key>
            <string>Web Clip for ${data.webclipTitle}</string>
            <key>URL</key>
            <string>https://swag.live</string>
            <key>Label</key>
            <string>${data.webclipTitle}</string>
            <key>IsRemovable</key>
            ${isRemovable}
            <key>Precomposed</key>
            <true/>
            <key>IgnoreManifestScope</key>
            <true/>
            <key>FullScreen</key>
            ${fullScreen}
            ${iconData}
        </dict>
    </array>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadIdentifier</key>
    <string>${data.identifier}</string>
    <key>PayloadUUID</key>
    <string>${data.uuid}</string>
    <key>PayloadDisplayName</key>
    <string>${data.profileName}</string>
    <key>PayloadDescription</key>
    <string>${data.profileDescription}</string>
    <key>PayloadOrganization</key>
    <string>${data.organization}</string>
    <key>PayloadScope</key>
    <string>${data.scope}</string>
    <key>PayloadExpirationDate</key>
    <date>${expirationString}</date>
    ${removalDateXML}
</dict>
</plist>`;
}

// Generate MDM profile
function generateMDM() {
  try {
    const data = getFormData();

    // Validate required fields
    if (
      !data.profileName ||
      !data.organization ||
      !data.identifier ||
      !data.webclipTitle ||
      !data.webclipUrl
    ) {
      alert("請填寫所有必填欄位");
      return;
    }

    // Validate URL format
    try {
      new URL(data.webclipUrl);
    } catch (e) {
      alert("請輸入有效的 URL");
      return;
    }

    const xml = generateMDMXML(data);

    // Display result
    document.getElementById("resultContent").textContent = xml;
    document.getElementById("resultSection").classList.remove("hidden");

    // Store the generated XML for download
    window.generatedXML = xml;
    window.generatedFileName = `${data.profileName.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}.mobileconfig`;

    console.log("MDM profile generated successfully");
  } catch (error) {
    console.error("Error generating MDM profile:", error);
    alert("生成 MDM 配置時發生錯誤：" + error.message);
  }
}

// Preview MDM profile
function previewMDM() {
  generateMDM();
}

// Download MDM profile
function downloadMDM() {
  if (!window.generatedXML) {
    alert("請先生成 MDM 配置");
    return;
  }

  try {
    const blob = new Blob([window.generatedXML], {
      type: "application/x-apple-aspen-config",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = window.generatedFileName || "mdm-profile.mobileconfig";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    console.log("MDM profile downloaded successfully");
  } catch (error) {
    console.error("Error downloading MDM profile:", error);
    alert("下載 MDM 配置時發生錯誤：" + error.message);
  }
}

// Copy to clipboard
async function copyToClipboard() {
  if (!window.generatedXML) {
    alert("請先生成 MDM 配置");
    return;
  }

  try {
    await navigator.clipboard.writeText(window.generatedXML);
    alert("MDM 配置已複製到剪貼簿");
    console.log("MDM profile copied to clipboard");
  } catch (error) {
    console.error("Error copying to clipboard:", error);

    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = window.generatedXML;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    alert("MDM 配置已複製到剪貼簿");
  }
}

// Reset form
function resetForm() {
  document.getElementById("mdmForm").reset();
  document.getElementById("resultSection").classList.add("hidden");
  window.generatedXML = null;
  window.generatedFileName = null;

  // Reset toggles
  document.querySelectorAll(".form-content").forEach((content) => {
    if (content.id !== "basicSettings" && content.id !== "webclipSettings") {
      content.classList.add("hidden");
    }
  });

  document.querySelectorAll(".toggle-section span").forEach((span) => {
    if (span.id !== "basicToggle" && span.id !== "webclipToggle") {
      span.textContent = "▶";
    }
  });

  console.log("Form reset successfully");
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Set default expiration date to 1 year from now
  const now = new Date();
  const oneYearLater = new Date(
    now.getFullYear() + 1,
    now.getMonth(),
    now.getDate()
  );
  const localDateTime = oneYearLater.toISOString().slice(0, 16);
  document.getElementById("expirationDate").value = localDateTime;

  // Add event listeners for toggle sections
  document.querySelectorAll(".toggle-section").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-toggle");
      toggleSection(sectionId);
    });
  });

  // Add event listeners for buttons
  document.getElementById("generateBtn").addEventListener("click", generateMDM);
  document.getElementById("previewBtn").addEventListener("click", previewMDM);
  document.getElementById("downloadBtn").addEventListener("click", downloadMDM);
  document.getElementById("copyBtn").addEventListener("click", copyToClipboard);
  document.getElementById("resetBtn").addEventListener("click", resetForm);

  console.log("MDM Generator initialized successfully");
});
