const yearSelect = document.querySelector("#availability-year");

if (yearSelect) {
  const startYear = new Date().getFullYear();

  for (let offset = 0; offset < 5; offset += 1) {
    const year = startYear + offset;
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.append(option);
  }
}
