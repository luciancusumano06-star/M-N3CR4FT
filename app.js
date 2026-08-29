```javascript
/* =========================================================
   NEXUS GAMING
   Main application logic
   ========================================================= */


/*
    IMPORTANT:

    Put the URL of an Eaglercraft instance that you are
    authorized to use here.

    Example:

    const GAME_URLS = {
        eaglercraft: "https://your-authorized-game-site.example/"
    };

    Leaving it blank keeps the game placeholder visible.
*/

const GAME_URLS = {
    eaglercraft: ""
};


/* ---------------------------------------------------------
   PAGE NAVIGATION
   --------------------------------------------------------- */

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");


function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active-page");
    }

    const selectedNav = document.querySelector(
        `.nav-item[data-page="${pageName}"]`
    );

    if (selectedNav) {
        selectedNav.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const page = item.dataset.page;

        if (page) {
            showPage(page);
        }

    });

});


/* ---------------------------------------------------------
   SEARCH
   --------------------------------------------------------- */

const searchInput =
    document.getElementById("searchInput");

const noResults =
    document.getElementById("noResults");


searchInput.addEventListener("input", () => {

    const query =
        searchInput.value
            .toLowerCase()
            .trim();

    const cards =
        document.querySelectorAll(".searchable-game");

    let visible = 0;

    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        const matches =
            name.includes(query);

        card.style.display =
            matches ? "" : "none";

        if (matches) {
            visible++;
        }

    });

    noResults.classList.toggle(
        "hidden",
        visible !== 0
    );

});


/* ---------------------------------------------------------
   GAME WINDOW
   --------------------------------------------------------- */

const gameWindow =
    document.getElementById("gameWindow");

const gameFrame =
    document.getElementById("gameFrame");

const gamePlaceholder =
    document.getElementById("gamePlaceholder");

const currentGame =
    document.getElementById("currentGame");


function openGame(gameName) {

    currentGame.textContent =
        gameName.toUpperCase();

    gameWindow.classList.add("open");

    const url = GAME_URLS[gameName];

    if (url) {

        gameFrame.src = url;

        gameFrame.style.display = "block";

        gamePlaceholder.style.display = "none";

        if (
            document.getElementById("fullscreenMode")
                ?.checked
        ) {

            setTimeout(() => {
                requestGameFullscreen();
            }, 500);

        }

    } else {

        gameFrame.src = "about:blank";

        gameFrame.style.display = "none";

        gamePlaceholder.style.display = "flex";

    }

}


function loadConfiguredGame() {

    const url =
        GAME_URLS.eaglercraft;

    if (!url) {

        alert(
            "Add your authorized Eaglercraft URL to GAME_URLS in app.js first."
        );

        return;
    }

    gameFrame.src = url;

    gameFrame.style.display = "block";

    gamePlaceholder.style.display = "none";

}


function closeGame() {

    gameWindow.classList.remove("open");

    gameFrame.src = "about:blank";

    gameFrame.style.display = "none";

    gamePlaceholder.style.display = "flex";

}


function reloadGame() {

    if (gameFrame.src !== "about:blank") {
        gameFrame.src = gameFrame.src;
    }

}


function requestGameFullscreen() {

    const container =
        document.querySelector(".game-container");

    if (!document.fullscreenElement) {

        container
            ?.requestFullscreen()
            .catch(() => {});

    }

}


function toggleFullscreen() {

    if (document.fullscreenElement) {

        document.exitFullscreen()
            .catch(() => {});

    } else {

        requestGameFullscreen();

    }

}


/* ---------------------------------------------------------
   FAVORITES
   --------------------------------------------------------- */

let favorites =
    JSON.parse(
        localStorage.getItem("nexusFavorites") || "[]"
    );


const favoriteButtons =
    document.querySelectorAll(".favorite-button");


function saveFavorites() {

    localStorage.setItem(
        "nexusFavorites",
        JSON.stringify(favorites)
    );

}


function updateFavoriteButtons() {

    favoriteButtons.forEach(button => {

        const game =
            button.dataset.game;

        const isFavorite =
            favorites.includes(game);

        button.classList.toggle(
            "favorite",
            isFavorite
        );

        button.textContent =
            isFavorite ? "★" : "☆";

    });

}


favoriteButtons.forEach(button => {

    button.addEventListener("click", () => {

        const game =
            button.dataset.game;

        if (favorites.includes(game)) {

            favorites =
                favorites.filter(
                    item => item !== game
                );

        } else {

            favorites.push(game);

        }

        saveFavorites();

        updateFavoriteButtons();

        renderFavorites();

    });

});


function renderFavorites() {

    const container =
        document.getElementById("favoritesList");

    if (!favorites.length) {

        container.innerHTML = `
            <div class="empty-state">
                <div>☆</div>
                <h3>No favorites yet</h3>
                <p>
                    Add games to your favorites
                    from the Games page.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    favorites.forEach(game => {

        if (game === "eaglercraft") {

            const card =
                document.createElement("article");

            card.className =
                "game-card";

            card.innerHTML = `
                <div class="game-image minecraft">
                    <div class="game-overlay">
                        <span class="game-logo">
                            EAGLERCRAFT
                        </span>
                    </div>
                </div>

                <div class="game-info">

                    <div>
                        <h4>Eaglercraft</h4>
                        <span>
                            Minecraft in the browser
                        </span>
                    </div>

                    <button
                        class="play-small"
                        onclick="openGame('eaglercraft')"
                    >
                        ▶
                    </button>

                </div>
            `;

            container.appendChild(card);

        }

    });

}


updateFavoriteButtons();

renderFavorites();


/* ---------------------------------------------------------
   THEME
   --------------------------------------------------------- */

const darkMode =
    document.getElementById("darkMode");

const themeButton =
    document.getElementById("themeButton");


function setTheme(dark) {

    if (dark) {

        document.documentElement.style.setProperty(
            "--bg",
            "#070707"
        );

        document.documentElement.style.setProperty(
            "--panel",
            "#0d0d0f"
        );

        localStorage.setItem(
            "nexusTheme",
            "dark"
        );

    } else {

        document.documentElement.style.setProperty(
            "--bg",
            "#eeeeee"
        );

        document.documentElement.style.setProperty(
            "--panel",
            "#ffffff"
        );

        document.documentElement.style.setProperty(
            "--text",
            "#111111"
        );

        localStorage.setItem(
            "nexusTheme",
            "light"
        );

    }

}


const savedTheme =
    localStorage.getItem("nexusTheme");


if (savedTheme === "light") {

    darkMode.checked = false;

}


darkMode.addEventListener(
    "change",
    () => setTheme(darkMode.checked)
);


themeButton.addEventListener(
    "click",
    () => {

        darkMode.checked =
            !darkMode.checked;

        setTheme(darkMode.checked);

    }
);


/* ---------------------------------------------------------
   ANIMATIONS
   --------------------------------------------------------- */

const animations =
    document.getElementById("animations");


animations.addEventListener(
    "change",
    () => {

        document.body.style.setProperty(
            "--animation-speed",
            animations.checked ? "1" : "0"
        );

    }
);


/* ---------------------------------------------------------
   KEYBOARD SHORTCUTS
   --------------------------------------------------------- */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            if (gameWindow.classList.contains("open")) {
                closeGame();
            }

        }

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }

    }
);


/* ---------------------------------------------------------
   PWA SERVICE WORKER
   --------------------------------------------------------- */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .catch(() => {});

        }
    );

}
```
