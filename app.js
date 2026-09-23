/* =========================================================
   BIBLIA 365
   JAVASCRIPT - VERSION CON FECHA DE INICIO
========================================================= */

const TOTAL_DAYS = 365;
const TOTAL_CHAPTERS = 1189;

const STORAGE_KEY = "biblia-en-un-ano-v3";
const OLD_STORAGE_KEY = "biblia-en-un-ano-v2";
const THEME_KEY = "biblia-en-un-ano-theme";


/* =========================================================
   LIBROS DE LA BIBLIA
========================================================= */

const BOOKS = [

    ["Génesis", 50],
    ["Éxodo", 40],
    ["Levítico", 27],
    ["Números", 36],
    ["Deuteronomio", 34],
    ["Josué", 24],
    ["Jueces", 21],
    ["Rut", 4],
    ["1 Samuel", 31],
    ["2 Samuel", 24],
    ["1 Reyes", 22],
    ["2 Reyes", 25],
    ["1 Crónicas", 29],
    ["2 Crónicas", 36],
    ["Esdras", 10],
    ["Nehemías", 13],
    ["Ester", 10],
    ["Job", 42],
    ["Salmos", 150],
    ["Proverbios", 31],
    ["Eclesiastés", 12],
    ["Cantares", 8],
    ["Isaías", 66],
    ["Jeremías", 52],
    ["Lamentaciones", 5],
    ["Ezequiel", 48],
    ["Daniel", 12],
    ["Oseas", 14],
    ["Joel", 3],
    ["Amós", 9],
    ["Abdías", 1],
    ["Jonás", 4],
    ["Miqueas", 7],
    ["Nahúm", 3],
    ["Habacuc", 3],
    ["Sofonías", 3],
    ["Hageo", 2],
    ["Zacarías", 14],
    ["Malaquías", 4],

    ["Mateo", 28],
    ["Marcos", 16],
    ["Lucas", 24],
    ["Juan", 21],
    ["Hechos", 28],
    ["Romanos", 16],
    ["1 Corintios", 16],
    ["2 Corintios", 13],
    ["Gálatas", 6],
    ["Efesios", 6],
    ["Filipenses", 4],
    ["Colosenses", 4],
    ["1 Tesalonicenses", 5],
    ["2 Tesalonicenses", 3],
    ["1 Timoteo", 6],
    ["2 Timoteo", 4],
    ["Tito", 3],
    ["Filemón", 1],
    ["Hebreos", 13],
    ["Santiago", 5],
    ["1 Pedro", 5],
    ["2 Pedro", 3],
    ["1 Juan", 5],
    ["2 Juan", 1],
    ["3 Juan", 1],
    ["Judas", 1],
    ["Apocalipsis", 22]
];


/* =========================================================
   VARIABLES
========================================================= */

let chapters = [];
let readingPlan = [];

let selectedDay = 1;

let state = {

    startDate: null,

    chapters: [],

    selectedDay: 1
};


/* =========================================================
   CONSTRUCCIÓN DE CAPÍTULOS
========================================================= */

function buildChapters() {

    chapters = [];

    let id = 1;

    BOOKS.forEach(([book, chapterCount]) => {

        for (let chapter = 1; chapter <= chapterCount; chapter++) {

            chapters.push({

                id: id,

                book: book,

                chapter: chapter,

                read: false

            });

            id++;
        }

    });
}


/* =========================================================
   CONSTRUCCIÓN DEL PLAN
   1189 capítulos / 365 días
========================================================= */

function buildReadingPlan() {

    readingPlan = [];

    let chapterIndex = 0;

    const extraDays = TOTAL_CHAPTERS - (TOTAL_DAYS * 3);

    for (let day = 1; day <= TOTAL_DAYS; day++) {

        const chaptersForDay =
            day <= extraDays ? 4 : 3;

        const dayChapters =
            chapters.slice(
                chapterIndex,
                chapterIndex + chaptersForDay
            );

        readingPlan.push({

            day: day,

            chapters: dayChapters

        });

        chapterIndex += chaptersForDay;
    }
}


/* =========================================================
   FECHAS
========================================================= */

function parseLocalDate(dateString) {

    if (!dateString) return null;

    const [year, month, day] =
        dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
}


function formatDate(date) {

    if (!date) return "-";

    return new Intl.DateTimeFormat("es-NI", {

        day: "numeric",
        month: "long",
        year: "numeric"

    }).format(date);
}


function formatShortDate(date) {

    if (!date) return "-";

    return new Intl.DateTimeFormat("es-NI", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric"

    }).format(date);
}


function dateToInputValue(date) {

    if (!date) return "";

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function addDays(date, days) {

    const result = new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;
}


function getPlanDate(dayNumber) {

    if (!state.startDate) return null;

    return addDays(
        parseLocalDate(state.startDate),
        dayNumber - 1
    );
}


/* =========================================================
   DÍA DEL PLAN SEGÚN FECHA ACTUAL
========================================================= */

function getScheduledDayToday() {

    if (!state.startDate) return 1;

    const start = parseLocalDate(state.startDate);

    const today = new Date();

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference =
        Math.floor(
            (today - start) /
            (1000 * 60 * 60 * 24)
        );

    if (difference < 0) {

        return 1;
    }

    if (difference >= TOTAL_DAYS) {

        return TOTAL_DAYS;
    }

    return difference + 1;
}


/* =========================================================
   GUARDAR / CARGAR ESTADO
========================================================= */

function saveState() {

    state.chapters = chapters;

    state.selectedDay = selectedDay;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}


function loadState() {

    buildChapters();

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (saved) {

        try {

            const parsed =
                JSON.parse(saved);

            if (parsed.startDate) {

                state.startDate =
                    parsed.startDate;
            }

            if (Array.isArray(parsed.chapters)) {

                parsed.chapters.forEach(savedChapter => {

                    const current =
                        chapters.find(
                            c => c.id === savedChapter.id
                        );

                    if (current) {

                        current.read =
                            Boolean(savedChapter.read);
                    }

                });

            }

            return;

        } catch (error) {

            console.error(
                "Error cargando estado:",
                error
            );
        }
    }


    /*
       Intentamos recuperar el progreso
       de la versión anterior.
    */

    const oldSaved =
        localStorage.getItem(OLD_STORAGE_KEY);

    if (oldSaved) {

        try {

            const oldData =
                JSON.parse(oldSaved);

            if (Array.isArray(oldData)) {

                oldData.forEach(savedChapter => {

                    const current =
                        chapters.find(
                            c => c.id === savedChapter.id
                        );

                    if (current) {

                        current.read =
                            Boolean(savedChapter.read);
                    }

                });

            } else if (oldData.chapters) {

                oldData.chapters.forEach(savedChapter => {

                    const current =
                        chapters.find(
                            c => c.id === savedChapter.id
                        );

                    if (current) {

                        current.read =
                            Boolean(savedChapter.read);
                    }

                });
            }

        } catch (error) {

            console.error(
                "No se pudo migrar el progreso anterior:",
                error
            );
        }
    }
}


/* =========================================================
   FECHA DE INICIO
========================================================= */

function ensureStartDate() {

    if (!state.startDate) {

        const today = new Date();

        state.startDate =
            dateToInputValue(today);

        saveState();
    }
}


function openStartDateModal() {

    const input =
        document.getElementById(
            "startDateInput"
        );

    input.value =
        state.startDate ||
        dateToInputValue(new Date());

    updateStartDatePreview();

    document
        .getElementById("startDateModal")
        .classList.add("open");
}


function closeStartDateModal() {

    document
        .getElementById("startDateModal")
        .classList.remove("open");
}


function updateStartDatePreview() {

    const input =
        document.getElementById(
            "startDateInput"
        );

    const preview =
        document.getElementById(
            "startDatePreview"
        );

    if (!input.value) {

        preview.textContent = "-";

        return;
    }

    const date =
        parseLocalDate(input.value);

    const finalDate =
        addDays(date, TOTAL_DAYS - 1);

    preview.innerHTML =
        `Tu plan comenzará el <strong>${formatDate(date)}</strong>
        y terminará el <strong>${formatDate(finalDate)}</strong>.`;
}


function saveStartDate() {

    const input =
        document.getElementById(
            "startDateInput"
        );

    if (!input.value) {

        showToast(
            "Selecciona una fecha de inicio.",
            "⚠️"
        );

        return;
    }

    state.startDate =
        input.value;

    saveState();

    closeStartDateModal();

    updateAll();

    showToast(
        "Fecha de inicio guardada.",
        "📅"
    );
}


/* =========================================================
   CAPÍTULOS Y ESTADÍSTICAS
========================================================= */

function getReadCount() {

    return chapters.filter(
        chapter => chapter.read
    ).length;
}


function getPercentage() {

    return Math.round(
        (getReadCount() / TOTAL_CHAPTERS) * 100
    );
}


function isDayCompleted(dayNumber) {

    const day =
        readingPlan[dayNumber - 1];

    if (!day) return false;

    return day.chapters.every(
        chapter => {

            const current =
                chapters.find(
                    c => c.id === chapter.id
                );

            return current && current.read;
        }
    );
}


function getCompletedDays() {

    let count = 0;

    readingPlan.forEach(day => {

        if (isDayCompleted(day.day)) {

            count++;
        }
    });

    return count;
}


/* =========================================================
   RACHA
========================================================= */

function getStreak() {

    let latestCompleted = 0;

    for (let i = 1; i <= TOTAL_DAYS; i++) {

        if (isDayCompleted(i)) {

            latestCompleted = i;
        }
    }

    if (latestCompleted === 0) {

        return 0;
    }

    let streak = 0;

    for (
        let day = latestCompleted;
        day >= 1;
        day--
    ) {

        if (!isDayCompleted(day)) {

            break;
        }

        streak++;
    }

    return streak;
}


/* =========================================================
   SIGUIENTE DÍA INCOMPLETO
========================================================= */

function getNextIncompleteDay() {

    for (
        let day = 1;
        day <= TOTAL_DAYS;
        day++
    ) {

        if (!isDayCompleted(day)) {

            return day;
        }
    }

    return TOTAL_DAYS;
}


/* =========================================================
   DESCRIPCIÓN DE LECTURA
========================================================= */

function getReadingDescription(dayNumber) {

    const day =
        readingPlan[dayNumber - 1];

    if (!day) return "-";

    const grouped = {};

    day.chapters.forEach(chapter => {

        if (!grouped[chapter.book]) {

            grouped[chapter.book] = [];
        }

        grouped[chapter.book].push(
            chapter.chapter
        );
    });


    return Object.entries(grouped)

        .map(([book, chapterNumbers]) => {

            if (chapterNumbers.length === 1) {

                return `${book} ${chapterNumbers[0]}`;
            }

            return `${book} ${chapterNumbers[0]}–${chapterNumbers[chapterNumbers.length - 1]}`;

        })

        .join(" · ");
}


/* =========================================================
   ACTUALIZAR CÍRCULOS
========================================================= */

function updateCircle(
    element,
    percentage,
    color
) {

    if (!element) return;

    const degrees =
        percentage * 3.6;

    element.style.background =
        `conic-gradient(
            ${color} ${degrees}deg,
            var(--border) ${degrees}deg
        )`;
}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const percentage =
        getPercentage();

    const read =
        getReadCount();

    const days =
        getCompletedDays();

    const streak =
        getStreak();

    const nextDay =
        getNextIncompleteDay();

    document.getElementById(
        "dashboardPercentage"
    ).textContent =
        `${percentage}%`;

    document.getElementById(
        "dashboardChapters"
    ).textContent =
        read;

    document.getElementById(
        "dashboardDays"
    ).textContent =
        days;

    document.getElementById(
        "dashboardStreak"
    ).textContent =
        streak;

    document.getElementById(
        "dashboardCurrentDay"
    ).textContent =
        nextDay;


    updateCircle(
        document.getElementById(
            "dashboardCircle"
        ),
        percentage,
        "var(--gold)"
    );


    document.getElementById(
        "nextDayTitle"
    ).textContent =
        `Día ${nextDay}`;


    document.getElementById(
        "nextReadingText"
    ).textContent =
        getReadingDescription(nextDay);


    const status =
        document.getElementById(
            "nextDayStatus"
        );

    if (isDayCompleted(nextDay)) {

        status.textContent =
            "Completado";

        status.classList.add(
            "completed"
        );

    } else {

        status.textContent =
            "Pendiente";

        status.classList.remove(
            "completed"
        );
    }


    const startDate =
        parseLocalDate(state.startDate);

    document.getElementById(
        "heroStartDate"
    ).textContent =
        `Fecha de inicio: ${formatDate(startDate)}`;
}


/* =========================================================
   LECTURA DE HOY
========================================================= */

function updateTodaySection() {

    const todayDay =
        getScheduledDayToday();

    const planDate =
        getPlanDate(todayDay);

    document.getElementById(
        "todayDayTitle"
    ).textContent =
        `Día ${todayDay}`;


    document.getElementById(
        "todayDateText"
    ).textContent =
        formatDate(planDate);


    document.getElementById(
        "todayReading"
    ).textContent =
        getReadingDescription(todayDay);


    const status =
        document.getElementById(
            "todayStatus"
        );

    if (isDayCompleted(todayDay)) {

        status.textContent =
            "Completado";

        status.classList.add(
            "completed"
        );

    } else {

        status.textContent =
            "Pendiente";

        status.classList.remove(
            "completed"
        );
    }


    renderTodayChapters(todayDay);
}


function renderTodayChapters(dayNumber) {

    const container =
        document.getElementById(
            "todayChapterList"
        );

    container.innerHTML = "";

    const day =
        readingPlan[dayNumber - 1];

    if (!day) return;


    day.chapters.forEach(chapter => {

        const current =
            chapters.find(
                c => c.id === chapter.id
            );

        const label =
            document.createElement("label");

        label.className =
            "chapter-item";

        if (current.read) {

            label.classList.add(
                "read"
            );
        }


        const checkbox =
            document.createElement("input");

        checkbox.type =
            "checkbox";

        checkbox.checked =
            current.read;


        checkbox.addEventListener(
            "change",
            () => {

                current.read =
                    checkbox.checked;

                saveState();

                updateAll();

                renderTodayChapters(
                    dayNumber
                );
            }
        );


        const text =
            document.createElement("span");

        text.textContent =
            `${chapter.book} ${chapter.chapter}`;


        label.appendChild(checkbox);

        label.appendChild(text);

        container.appendChild(label);
    });
}


/* =========================================================
   HISTORIAL
========================================================= */

function renderDays() {

    const container =
        document.getElementById(
            "daysGrid"
        );

    container.innerHTML = "";


    for (
        let day = 1;
        day <= TOTAL_DAYS;
        day++
    ) {

        const button =
            document.createElement("button");

        button.className =
            "day-button";

        if (day === selectedDay) {

            button.classList.add(
                "selected"
            );
        }


        if (isDayCompleted(day)) {

            button.classList.add(
                "completed"
            );
        }


        const date =
            getPlanDate(day);


        button.innerHTML =
            `Día ${day}
             <small>${formatShortDate(date)}</small>`;


        button.addEventListener(
            "click",
            () => {

                selectedDay = day;

                renderDays();

                renderSelectedDay();
            }
        );


        container.appendChild(button);
    }


    document.getElementById(
        "planCompletedCounter"
    ).textContent =
        `${getCompletedDays()} / ${TOTAL_DAYS}`;


    document.getElementById(
        "planStartSummary"
    ).textContent =
        formatDate(
            parseLocalDate(
                state.startDate
            )
        );
}


function renderSelectedDay() {

    const day =
        readingPlan[selectedDay - 1];

    if (!day) return;


    const date =
        getPlanDate(selectedDay);


    document.getElementById(
        "selectedDayTitle"
    ).textContent =
        `Día ${selectedDay}`;


    document.getElementById(
        "selectedDayDate"
    ).textContent =
        formatDate(date);


    document.getElementById(
        "selectedDayReading"
    ).textContent =
        getReadingDescription(selectedDay);


    const status =
        document.getElementById(
            "selectedDayStatus"
        );


    if (isDayCompleted(selectedDay)) {

        status.textContent =
            "Completado";

        status.classList.add(
            "completed"
        );

    } else {

        status.textContent =
            "Pendiente";

        status.classList.remove(
            "completed"
        );
    }


    const container =
        document.getElementById(
            "chapterList"
        );

    container.innerHTML = "";


    day.chapters.forEach(chapter => {

        const current =
            chapters.find(
                c => c.id === chapter.id
            );


        const label =
            document.createElement("label");

        label.className =
            "chapter-item";


        if (current.read) {

            label.classList.add(
                "read"
            );
        }


        const checkbox =
            document.createElement("input");

        checkbox.type =
            "checkbox";

        checkbox.checked =
            current.read;


        checkbox.addEventListener(
            "change",
            () => {

                current.read =
                    checkbox.checked;

                saveState();

                updateAll();

                renderSelectedDay();
            }
        );


        const text =
            document.createElement("span");

        text.textContent =
            `${chapter.book} ${chapter.chapter}`;


        label.appendChild(checkbox);

        label.appendChild(text);

        container.appendChild(label);
    });
}


/* =========================================================
   MARCAR / DESMARCAR DÍA
========================================================= */

function completeDay(dayNumber) {

    const day =
        readingPlan[dayNumber - 1];

    if (!day) return;


    day.chapters.forEach(chapter => {

        const current =
            chapters.find(
                c => c.id === chapter.id
            );

        if (current) {

            current.read = true;
        }
    });


    saveState();

    updateAll();

    showToast(
        `Día ${dayNumber} completado.`,
        "✓"
    );
}


function uncompleteDay(dayNumber) {

    const day =
        readingPlan[dayNumber - 1];

    if (!day) return;


    day.chapters.forEach(chapter => {

        const current =
            chapters.find(
                c => c.id === chapter.id
            );

        if (current) {

            current.read = false;
        }
    });


    saveState();

    updateAll();

    showToast(
        `Día ${dayNumber} desmarcado.`,
        "↩"
    );
}


/* =========================================================
   LIBROS
========================================================= */

function renderBooks(search = "") {

    const container =
        document.getElementById(
            "booksGrid"
        );

    container.innerHTML = "";


    const query =
        search.trim().toLowerCase();


    BOOKS.forEach(
        ([book, totalChapters]) => {

            if (
                query &&
                !book.toLowerCase().includes(query)
            ) {

                return;
            }


            const bookChapters =
                chapters.filter(
                    chapter =>
                        chapter.book === book
                );


            const read =
                bookChapters.filter(
                    chapter =>
                        chapter.read
                ).length;


            const percentage =
                Math.round(
                    (read / totalChapters) * 100
                );


            const card =
                document.createElement("div");

            card.className =
                "book-card";


            card.innerHTML = `

                <div class="book-header">

                    <strong>${book}</strong>

                    <span>
                        ${read}/${totalChapters}
                    </span>

                </div>

                <div class="book-progress">

                    <div style="width:${percentage}%"></div>

                </div>

                <div class="book-footer">

                    ${percentage}% completado

                </div>
            `;


            container.appendChild(card);
        }
    );
}


/* =========================================================
   ESTADÍSTICAS
========================================================= */

function renderStatistics() {

    const read =
        getReadCount();

    const remaining =
        TOTAL_CHAPTERS - read;

    const percentage =
        getPercentage();

    const days =
        getCompletedDays();

    const streak =
        getStreak();


    document.getElementById(
        "largePercentage"
    ).textContent =
        `${percentage}%`;


    /*
       Hay dos elementos con statsRead
       por compatibilidad visual.
    */

    document
        .querySelectorAll("#statsRead")
        .forEach(element => {

            element.textContent =
                read;
        });


    document.getElementById(
        "statsRemaining"
    ).textContent =
        remaining;


    document.getElementById(
        "statsDays"
    ).textContent =
        days;


    document.getElementById(
        "statsStreak"
    ).textContent =
        streak;


    const average =
        days > 0
            ? (read / days).toFixed(1)
            : "0";


    document.getElementById(
        "averageChapters"
    ).textContent =
        average;


    updateCircle(
        document.getElementById(
            "largeCircle"
        ),
        percentage,
        "var(--primary)"
    );


    const start =
        parseLocalDate(
            state.startDate
        );


    const end =
        addDays(
            start,
            TOTAL_DAYS - 1
        );


    document.getElementById(
        "statisticsPeriodText"
    ).textContent =
        `Periodo del plan: ${formatDate(start)} – ${formatDate(end)}`;


    renderMonthlyProgress();
}


/* =========================================================
   ESTADÍSTICAS MENSUALES
   Basadas en las fechas reales del plan
========================================================= */

function renderMonthlyProgress() {

    const container =
        document.getElementById(
            "monthlyProgress"
        );

    container.innerHTML = "";


    if (!state.startDate) return;


    const start =
        parseLocalDate(
            state.startDate
        );


    /*
       Creamos los 12 meses del plan.
       No utilizamos enero como inicio obligatorio.
    */

    const months = [];


    for (let month = 0; month < 12; month++) {

        const date =
            new Date(
                start.getFullYear(),
                start.getMonth() + month,
                1
            );


        months.push({

            year: date.getFullYear(),

            month: date.getMonth(),

            label:
                new Intl.DateTimeFormat(
                    "es-NI",
                    {
                        month: "long",
                        year: "numeric"
                    }
                ).format(date),

            chapters: 0,

            read: 0
        });
    }


    /*
       Cada capítulo pertenece al mes
       de la fecha del día de lectura.
    */

    readingPlan.forEach(day => {

        const dayDate =
            getPlanDate(day.day);

        const year =
            dayDate.getFullYear();

        const month =
            dayDate.getMonth();


        const target =
            months.find(
                item =>
                    item.year === year &&
                    item.month === month
            );


        if (!target) return;


        day.chapters.forEach(chapter => {

            target.chapters++;


            const current =
                chapters.find(
                    c => c.id === chapter.id
                );


            if (current && current.read) {

                target.read++;
            }

        });

    });


    months.forEach(item => {

        const percentage =
            item.chapters > 0
                ? Math.round(
                    (item.read / item.chapters) * 100
                )
                : 0;


        const row =
            document.createElement("div");

        row.className =
            "month-row";


        row.innerHTML = `

            <div class="month-name">
                ${capitalize(item.label)}
            </div>

            <div class="month-bar">
                <div style="width:${percentage}%"></div>
            </div>

            <div class="month-count">
                ${item.read}/${item.chapters}
            </div>
        `;


        container.appendChild(row);
    });
}


function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);
}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function navigate(section) {

    document
        .querySelectorAll(".page-section")
        .forEach(page => {

            page.classList.remove(
                "active"
            );
        });


    const target =
        document.getElementById(
            `${section}Section`
        );


    if (target) {

        target.classList.add(
            "active"
        );
    }


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === section
            );
        });


    const titles = {

        home: "Inicio",

        today: "Lectura de hoy",

        history: "Historial de lectura",

        books: "Libros",

        statistics: "Estadísticas",

        data: "Datos"
    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[section] || "Biblia 365";


    document
        .getElementById("sidebar")
        .classList.remove("open");


    if (section === "today") {

        updateTodaySection();
    }


    if (section === "history") {

        renderDays();

        renderSelectedDay();
    }


    if (section === "books") {

        renderBooks(
            document.getElementById(
                "bookSearch"
            ).value
        );
    }


    if (section === "statistics") {

        renderStatistics();
    }
}


/* =========================================================
   TEMA
========================================================= */

function loadTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );
    }


    updateThemeButton();
}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        THEME_KEY,
        isDark ? "dark" : "light"
    );


    updateThemeButton();
}


function updateThemeButton() {

    const isDark =
        document.body.classList.contains(
            "dark"
        );


    document.getElementById(
        "themeIcon"
    ).textContent =
        isDark ? "☀️" : "🌙";


    document.getElementById(
        "themeText"
    ).textContent =
        isDark
            ? "Modo claro"
            : "Modo oscuro";
}


/* =========================================================
   FECHA ACTUAL
========================================================= */

function updateTodayBadge() {

    document.getElementById(
        "todayBadge"
    ).textContent =
        new Intl.DateTimeFormat(
            "es-NI",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        ).format(new Date());
}


/* =========================================================
   EXPORTAR EXCEL
========================================================= */

function exportToExcel() {

    if (typeof XLSX === "undefined") {

        showToast(
            "No se pudo cargar el módulo de Excel.",
            "⚠️"
        );

        return;
    }


    const rows = chapters.map(
        chapter => ({

            "Libro":
                chapter.book,

            "Capítulo":
                chapter.chapter,

            "Leído":
                chapter.read
                    ? "Sí"
                    : "No",

            "Día del plan":
                findChapterDay(
                    chapter.id
                ),

            "Fecha del plan":
                formatShortDate(
                    getPlanDate(
                        findChapterDay(
                            chapter.id
                        )
                    )
                ),

            "Fecha de inicio":
                state.startDate
        })
    );


    const worksheet =
        XLSX.utils.json_to_sheet(rows);


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Progreso"
    );


    XLSX.writeFile(
        workbook,
        "biblia-en-un-ano-progreso.xlsx"
    );


    showToast(
        "Progreso exportado correctamente.",
        "📤"
    );
}


function findChapterDay(chapterId) {

    for (const day of readingPlan) {

        if (
            day.chapters.some(
                chapter =>
                    chapter.id === chapterId
            )
        ) {

            return day.day;
        }
    }

    return "";
}


/* =========================================================
   IMPORTAR EXCEL
========================================================= */

function importFromExcel(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    if (typeof XLSX === "undefined") {

        showToast(
            "No se pudo cargar el módulo de Excel.",
            "⚠️"
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            try {

                const workbook =
                    XLSX.read(
                        e.target.result,
                        {
                            type: "array"
                        }
                    );


                const sheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        sheet
                    );


                rows.forEach(row => {

                    const book =
                        row["Libro"];

                    const chapterNumber =
                        Number(
                            row["Capítulo"] ??
                            row["Capitulo"]
                        );


                    const readValue =
                        String(
                            row["Leído"] ??
                            row["Leido"] ??
                            ""
                        ).toLowerCase();


                    const current =
                        chapters.find(
                            chapter =>
                                chapter.book === book &&
                                chapter.chapter === chapterNumber
                        );


                    if (current) {

                        current.read =
                            [
                                "sí",
                                "si",
                                "yes",
                                "true",
                                "1",
                                "x",
                                "leído",
                                "leido"
                            ].includes(
                                readValue
                            );
                    }


                    /*
                       Si el archivo contiene fecha
                       de inicio, también la recuperamos.
                    */

                    if (
                        row["Fecha de inicio"]
                    ) {

                        state.startDate =
                            normalizeImportedDate(
                                row["Fecha de inicio"]
                            );
                    }

                });


                saveState();

                updateAll();


                showToast(
                    "Progreso importado correctamente.",
                    "📥"
                );


            } catch (error) {

                console.error(error);

                showToast(
                    "No se pudo importar el archivo.",
                    "⚠️"
                );
            }


            event.target.value = "";
        };


    reader.readAsArrayBuffer(file);
}


function normalizeImportedDate(value) {

    if (!value) return null;


    if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

        return value;
    }


    const date =
        new Date(value);


    if (isNaN(date.getTime())) {

        return null;
    }


    return dateToInputValue(date);
}


/* =========================================================
   REINICIAR
========================================================= */

function resetProgress() {

    const confirmation =
        confirm(
            "¿Estás seguro de que quieres reiniciar tu progreso de Biblia 365?\n\n" +
            "Esto eliminará los capítulos marcados como leídos, " +
            "pero mantendrá tu fecha de inicio."
        );


    if (!confirmation) return;


    chapters.forEach(
        chapter => {
            chapter.read = false;
        }
    );


    saveState();

    updateAll();


    showToast(
        "Tu progreso ha sido reiniciado.",
        "↩"
    );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    message,
    icon = "✓"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    document.getElementById(
        "toastMessage"
    ).textContent =
        message;


    document.getElementById(
        "toastIcon"
    ).textContent =
        icon;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   ACTUALIZAR TODO
========================================================= */

function updateAll() {

    updateDashboard();

    updateTodaySection();

    renderDays();

    renderSelectedDay();

    renderBooks(
        document.getElementById(
            "bookSearch"
        )?.value || ""
    );

    renderStatistics();

    updateTodayBadge();

    document.getElementById(
        "heroStartDate"
    ).textContent =
        `Fecha de inicio: ${
            formatDate(
                parseLocalDate(
                    state.startDate
                )
            )
        }`;
}


/* =========================================================
   EVENTOS
========================================================= */

function setupEvents() {


    /* Navegación */

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    navigate(
                        button.dataset.section
                    );
                }
            );
        });


    /* Menú móvil */

    document
        .getElementById("menuButton")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("sidebar")
                    .classList.toggle("open");
            }
        );


    /* Tema */

    document
        .getElementById("themeButton")
        .addEventListener(
            "click",
            toggleTheme
        );


    /* Continuar */

    document
        .getElementById("continueButton")
        .addEventListener(
            "click",
            () => {

                selectedDay =
                    getNextIncompleteDay();

                navigate("history");
            }
        );


    /* Próxima lectura */

    document
        .getElementById("openNextDayButton")
        .addEventListener(
            "click",
            () => {

                selectedDay =
                    getNextIncompleteDay();

                navigate("history");
            }
        );


    /* Completar lectura de hoy */

    document
        .getElementById("todayCompleteButton")
        .addEventListener(
            "click",
            () => {

                completeDay(
                    getScheduledDayToday()
                );

                updateTodaySection();
            }
        );


    /* Desmarcar lectura de hoy */

    document
        .getElementById("todayUncompleteButton")
        .addEventListener(
            "click",
            () => {

                uncompleteDay(
                    getScheduledDayToday()
                );

                updateTodaySection();
            }
        );


    /* Historial */

    document
        .getElementById("completeDayButton")
        .addEventListener(
            "click",
            () => {

                completeDay(
                    selectedDay
                );

                renderSelectedDay();
                renderDays();
            }
        );


    document
        .getElementById("uncompleteDayButton")
        .addEventListener(
            "click",
            () => {

                uncompleteDay(
                    selectedDay
                );

                renderSelectedDay();
                renderDays();
            }
        );


    /* Buscar libros */

    document
        .getElementById("bookSearch")
        .addEventListener(
            "input",
            event => {

                renderBooks(
                    event.target.value
                );
            }
        );


    /* Exportar */

    document
        .getElementById("exportButton")
        .addEventListener(
            "click",
            exportToExcel
        );


    /* Importar */

    document
        .getElementById("importFile")
        .addEventListener(
            "change",
            importFromExcel
        );


    /* Reiniciar */

    document
        .getElementById("resetButton")
        .addEventListener(
            "click",
            resetProgress
        );


    /* Fecha de inicio */

    document
        .getElementById(
            "changeStartDateButton"
        )
        .addEventListener(
            "click",
            openStartDateModal
        );


    document
        .getElementById(
            "closeStartDateModal"
        )
        .addEventListener(
            "click",
            closeStartDateModal
        );


    document
        .getElementById(
            "saveStartDateButton"
        )
        .addEventListener(
            "click",
            saveStartDate
        );


    document
        .getElementById(
            "startDateInput"
        )
        .addEventListener(
            "input",
            updateStartDatePreview
        );


    /*
       Cerrar modal haciendo clic
       fuera de la ventana.
    */

    document
        .getElementById(
            "startDateModal"
        )
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "startDateModal"
                ) {

                    closeStartDateModal();
                }
            }
        );
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function init() {

    buildChapters();

    loadState();

    buildReadingPlan();

    loadTheme();

    updateTodayBadge();

    setupEvents();


    /*
       Si es un usuario nuevo,
       utilizamos la fecha actual como
       fecha inicial.
    */

    if (!state.startDate) {

        state.startDate =
            dateToInputValue(
                new Date()
            );

        saveState();

        /*
           Mostramos la selección de fecha
           la primera vez.
        */

        setTimeout(
            () => {

                openStartDateModal();

            },
            250
        );
    }


    selectedDay =
        getNextIncompleteDay();


    updateAll();
}


document.addEventListener(
    "DOMContentLoaded",
    init
);
