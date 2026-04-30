const songLists = [
  {
    label: "Top 200 Songs",
    key: "top200",
    count: 200,
    sourcePath: "/song-lists/top-200-2000s-2/",
  },
  {
    label: "Top Current Requests",
    key: "current",
    count: 100,
    sourcePath: "/song-lists/top-200-2000s-2-2/",
  },
  {
    label: "Wedding First Dance Songs",
    key: "category_firstdance",
    count: 200,
    sourcePath: "/song-lists/wedding-reception-first-dance/",
  },
  {
    label: "Top 200 Songs of the 2010s",
    key: "decade_2010",
    count: 200,
    sourcePath: "/song-lists/top-200-songs-2010s/",
  },
  {
    label: "Top 200 Songs of the 2000s",
    key: "decade_2000",
    count: 200,
    sourcePath: "/song-lists/top-200-2000s/",
  },
  {
    label: "Top 200 Songs of the 1990s",
    key: "decade_1990",
    count: 200,
    sourcePath: "/song-lists/top-200-1990s/",
  },
  {
    label: "Top 200 Songs of the 1980s",
    key: "decade_1980",
    count: 200,
    sourcePath: "/song-lists/top-200-1980s/",
  },
  {
    label: "Top 200 Songs of the 1970s",
    key: "decade_1970",
    count: 200,
    sourcePath: "/song-lists/top-100-1970s/",
  },
  {
    label: "Top 100 Songs of the 1960s",
    key: "decade_1960",
    count: 100,
    sourcePath: "/song-lists/top-75-songsof-1960s/",
  },
  {
    label: "Top 100 Songs of the 1950s",
    key: "decade_1950",
    count: 100,
    sourcePath: "/song-lists/top-50-songs-1950s/",
  },
  {
    label: "Top 50 Songs of the 1940s",
    key: "decade_1940",
    count: 50,
    sourcePath: "/song-lists/top-50-songs-1950s-2/",
  },
];

const buttonsContainer = document.querySelector("#song-list-buttons");
const resultsContainer = document.querySelector("#song-results");
const statusElement = document.querySelector("#song-status");
const titleElement = document.querySelector("#song-list-title");
const sourceLabelElement = document.querySelector("#song-source-label");
let activeRequestId = 0;

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getListFromHash() {
  const hashKey = window.location.hash.replace("#", "");
  return songLists.find((list) => slugify(list.label) === hashKey) || songLists[0];
}

function setActiveButton(activeList) {
  document.querySelectorAll("[data-song-list]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.songList === activeList.key);
  });
}

function loadGigBuilderList(list) {
  activeRequestId += 1;
  const requestId = activeRequestId;
  const callbackName = `renderGigBuilderList_${Date.now()}`;
  const script = document.createElement("script");
  const endpoint = new URL("https://www.gigbuilder.com/gbmusic.nsf/musicList");

  endpoint.searchParams.set("open", "");
  endpoint.searchParams.set("gb", "1");
  endpoint.searchParams.set("list", list.key);
  endpoint.searchParams.set("count", String(list.count));
  endpoint.searchParams.set("jsoncallback", callbackName);

  titleElement.textContent = list.label;
  sourceLabelElement.textContent = `${list.count} ranked requests`;
  resultsContainer.innerHTML = "";
  statusElement.hidden = false;
  statusElement.textContent = "Loading songs...";
  setActiveButton(list);

  window[callbackName] = (data) => {
    if (requestId !== activeRequestId) {
      delete window[callbackName];
      script.remove();
      return;
    }

    const html = data?.event || "";
    resultsContainer.innerHTML = html;
    statusElement.hidden = true;
    delete window[callbackName];
    script.remove();
  };

  script.onerror = () => {
    if (requestId !== activeRequestId) {
      delete window[callbackName];
      script.remove();
      return;
    }

    statusElement.hidden = false;
    statusElement.textContent = "The live song list could not be loaded. Try refreshing the page.";
    delete window[callbackName];
    script.remove();
  };

  script.src = endpoint.toString();
  document.body.append(script);
}

function renderButtons() {
  buttonsContainer.innerHTML = "";

  songLists.forEach((list) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.songList = list.key;
    button.textContent = list.label;
    button.addEventListener("click", () => {
      const nextHash = slugify(list.label);

      if (window.location.hash === `#${nextHash}`) {
        loadGigBuilderList(list);
        return;
      }

      window.location.hash = nextHash;
    });
    buttonsContainer.append(button);
  });
}

renderButtons();
loadGigBuilderList(getListFromHash());

window.addEventListener("hashchange", () => {
  loadGigBuilderList(getListFromHash());
});
