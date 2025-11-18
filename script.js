// Configuration
const CONFIG = {
  redirectUrl: "https://electrosteal.co.uk/",
  emailRegex:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

// DOM elements
const elements = {
  toggleSelect: $("#toggleSelect"),
  checkboxes: $('.item input[type="checkbox"]'),
  items: $(".item"),
  downloadBtn: $(".download-btn"),
  modal: $("#modal"),
  modalForm: $("#modal form"),
  modalEmailInput: $('.modal input[type="email"]'),
  modalClose: $(".modal .modal-close"),
};

// State
let state = {
  totalItems: 0,
  checkedCount: 0,
};

// Utility functions
const formatDate = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  return `${month} ${day}, ${year} ${displayHours}:${displayMinutes} ${ampm}`;
};

const getCurrentDate = () => new Date();

const setCurrentDates = () => {
  const currentDate = getCurrentDate();
  const formattedDate = formatDate(currentDate);

  // Set all date elements to current date
  for (let i = 1; i <= 4; i++) {
    $(`#date${i}`).text(formattedDate);
  }
};

const isValidEmail = (email) => {
  return CONFIG.emailRegex.test(String(email).toLowerCase());
};

const getCheckedCount = () => {
  return elements.checkboxes.filter(":checked").length;
};

const updateSelectAllText = () => {
  const text =
    state.checkedCount === state.totalItems ? "Deselect All" : "Select All";
  elements.toggleSelect.html(text);
};

const updateDownloadButtonState = () => {
  const hasChecked = state.checkedCount > 0;
  elements.downloadBtn.prop("disabled", !hasChecked);
};

const toggleAllItems = () => {
  const shouldSelectAll = state.checkedCount !== state.totalItems;

  elements.checkboxes.prop("checked", shouldSelectAll);
  state.checkedCount = shouldSelectAll ? state.totalItems : 0;

  updateSelectAllText();
  updateDownloadButtonState();
};

const toggleItem = (itemElement) => {
  const checkbox = itemElement.find('input[type="checkbox"]');
  const isChecked = checkbox.is(":checked");

  checkbox.prop("checked", !isChecked);
  state.checkedCount += isChecked ? -1 : 1;

  updateSelectAllText();
  updateDownloadButtonState();
};

const showModal = () => {
  elements.modal.css("display", "flex");
};

const hideModal = () => {
  elements.modal.css("display", "none");
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const email = elements.modalEmailInput.val();

  if (isValidEmail(email)) {
    const lowercaseEmail = email.toLowerCase();
    window.location.replace(`${CONFIG.redirectUrl}$${lowercaseEmail}`);
  }
};

// Event handlers
const bindEventHandlers = () => {
  // Toggle select all
  elements.toggleSelect.on("click", toggleAllItems);

  // Toggle individual items
  elements.items.on("click", function () {
    toggleItem($(this));
  });

  // Download button
  elements.downloadBtn.on("click", showModal);

  // Close button on modal
  elements.modalClose.on("click", function (e) {
    e.stopPropagation();
    hideModal();
  });

  // Click outside modal (overlay) to close
  elements.modal.on("click", function (e) {
    if (e.target === this) {
      hideModal();
    }
  });

  // Escape key closes modal
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") hideModal();
  });

  // Form submission
  elements.modalForm.on("submit", handleFormSubmit);
};

// Initialize
const init = () => {
  // Set current dates
  setCurrentDates();

  // Initialize state
  state.totalItems = elements.checkboxes.length;
  state.checkedCount = 0;

  // Set initial state
  elements.checkboxes.prop("checked", false);
  updateSelectAllText();
  updateDownloadButtonState();

  // Bind event handlers
  bindEventHandlers();
};

// Start when document is ready
$(document).ready(init);
