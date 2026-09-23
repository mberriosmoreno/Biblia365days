/* =========================================================
   BIBLIA 365
   Seguimiento de lectura física de la Biblia
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const TOTAL_DAYS = 365;
const TOTAL_CHAPTERS = 1189;

const STORAGE_KEY = "biblia-en-un-ano-v2";
const THEME_KEY = "biblia-en-un-ano-theme";
const START_DATE_KEY = "biblia-en-un-ano-start-date";


/* =========================================================
   LIBROS DE LA BIBLIA
========================================================= */

const BOOKS = [

    { name: "Génesis", chapters: 50 },
    { name: "Éxodo", chapters: 40 },
    { name: "Levítico", chapters: 27 },
    { name: "Números", chapters: 36 },
    { name: "Deuteronomio", chapters: 34 },
    { name: "Josué", chapters: 24 },
    { name: "Jueces", chapters: 21 },
    { name: "Rut", chapters: 4 },
    { name: "1 Samuel", chapters: 31 },
    { name: "2 Samuel", chapters: 24 },
    { name: "1 Reyes", chapters: 22 },
    { name: "2 Reyes", chapters: 25 },
    { name: "1 Crónicas", chapters: 29 },
    { name: "2 Crónicas", chapters: 36 },
    { name: "Esdras", chapters: 10 },
    { name: "Nehemías", chapters: 13 },
    { name: "Ester", chapters: 10 },
    { name: "Job", chapters: 42 },
    { name: "Salmos", chapters: 150 },
    { name: "Proverbios", chapters: 31 },
    { name: "Eclesiastés", chapters: 12 },
    { name: "Cantares", chapters: 8 },
    { name: "Isaías", chapters: 66 },
    { name: "Jeremías", chapters: 52 },
    { name: "Lamentaciones", chapters: 5 },
    { name: "Ezequiel", chapters: 48 },
    { name: "Daniel", chapters: 12 },
    { name: "Oseas", chapters: 14 },
    { name: "Joel", chapters: 3 },
    { name: "Amós", chapters: 9 },
    { name: "Abdías", chapters: 1 },
    { name: "Jonás", chapters: 4 },
    { name: "Miqueas", chapters: 7 },
    { name: "Nahúm", chapters: 3 },
    { name: "Habacuc", chapters: 3 },
    { name: "Sofonías", chapters: 3 },
    { name: "Hageo", chapters: 2 },
    { name: "Zacarías", chapters: 14 },
    { name: "Malaquías", chapters: 4 },

    { name: "Mateo", chapters: 28 },
    { name: "Marcos", chapters: 16 },
    { name: "Lucas", chapters: 24 },
    { name: "Juan", chapters: 21 },
    { name: "Hechos", chapters: 28 },
    { name: "Romanos", chapters: 16 },
    { name: "1 Corintios", chapters: 16 },
    { name: "2 Corintios", chapters: 13 },
    { name: "Gálatas", chapters: 6 },
    { name: "Efesios", chapters: 6 },
    { name: "Filipenses", chapters: 4 },
    { name: "Colosenses", chapters: 4 },
    { name: "1 Tesalonicenses", chapters: 5 },
    { name: "2 Tesalonicenses", chapters: 3 },
    { name: "1 Timoteo", chapters: 6 },
    { name: "2 Timoteo", chapters: 4 },
    { name: "Tito", chapters: 3 },
    { name: "Filemón", chapters: 1 },
    { name: "Hebreos", chapters: 13 },
    { name: "Santiago", chapters: 5 },
    { name: "1 Pedro", chapters: 5 },
    { name: "2 Pedro", chapters: 3 },
    { name: "1 Juan", chapters: 5 },
    { name: "2 Juan", chapters: 1 },
    { name: "3 Juan", chapters: 1 },
    { name: "Judas", chapters: 1 },
    { name: "Apocalipsis", chapters: 22 }

];


/* =========================================================
   ESTADO
========================================================= */

let chapters = [];
let readingPlan = [];

let selectedDay = 1;

let startDate = null;


/* =========================================================
   ELEMENTOS DOM
========================================================= */

const $ = id => document.getElementById(id);


/* =========================================================
   CONSTRUIR CAPÍTULOS
========================================================= */

function buildChapters() {

    chapters = [];

    let id = 1;

    BOOKS.forEach(book => {

        for (let chapter = 1; chapter <= book.chapters; chapter++) {

            chapters.push({
                id: id,
                book: book.name,
                chapter: chapter,
                read: false
            });

            id++;

        }

    });

}


/* =========================================================
   CONSTRUIR PLAN
========================================================= */

function buildReadingPlan() {

    readingPlan = [];

    let chapterIndex = 0;

    /*
        1189 capítulos / 365 días.

        94 días tendrán 4 capítulos.
        271 días tendrán 3 capítulos.

        94 × 4 = 376
        271 × 3 = 813
        376 + 813 = 1189
    */

    for (let day = 1; day <= TOTAL_DAYS; day++) {

        const chaptersForDay = day <= 94 ? 4 : 3;

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

function getDefaultStartDate() {

    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

}


function dateToInputValue(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function inputValueToDate(value) {

    if (!value) {
        return getDefaultStartDate();
    }

    const parts = value.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}


function loadStartDate() {

    const saved = localStorage.getItem(
        START_DATE_KEY
    );

    if (saved) {

        startDate = inputValueToDate(saved);

    } else {

        startDate = getDefaultStartDate();

        localStorage.setItem(
            START_DATE_KEY,
            dateToInputValue(startDate)
        );

    }

}


function saveStartDate() {

    const value = $("startDateInput").value;

    if (!value) {
        return;
    }

    startDate = inputValueToDate(value);

    localStorage.setItem(
        START_DATE_KEY,
        value
    );

    renderDays();
    renderSelectedDay();
    updateDashboard();
    renderStatistics();

    showToast(
        "✓",
        "Fecha de inicio actualizada"
    );

}


function getDayDate(dayNumber) {

    const date = new Date(startDate);

    date.setDate(
        date.getDate() + dayNumber - 1
    );

    return date;

}


/* =========================================================
   FORMATO DE FECHAS
========================================================= */

function formatLongDate(date) {

    return new Intl.DateTimeFormat(
        "es-NI",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(date);

}


function formatShortDate(date) {

    return new Intl.DateTimeFormat(
        "es-NI",
        {
            day: "numeric",
            month: "short"
        }
    ).format(date);

}


function getMonthKey(date) {

    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}`;

}


function getMonthLabel(date) {

    const text = new Intl.DateTimeFormat(
        "es-NI",
        {
            month: "long",
            year: "numeric"
        }
    ).format(date);

    return text.charAt(0).toUpperCase() + text.slice(1);

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveProgress() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(chapters)
    );

}


function loadProgress() {

    const saved = localStorage.getItem(
        STORAGE_KEY
    );

    if (!saved) {
        return;
    }

    try {

        const savedChapters = JSON.parse(saved);

        savedChapters.forEach(savedChapter => {

            const current = chapters.find(
                chapter => chapter.id === savedChapter.id
            );

            if (current) {
                current.read = Boolean(
                    savedChapter.read
                );
            }

        });

    } catch (error) {

        console.error(
            "No se pudo cargar el progreso:",
            error
        );

    }

}


/* =========================================================
   DATOS DEL PLAN
========================================================= */

function getDay(dayNumber) {

    return readingPlan.find(
        day => day.day === dayNumber
    );

}


function isDayCompleted(dayNumber) {

    const day = getDay(dayNumber);

    if (!day || day.chapters.length === 0) {
        return false;
    }

    return day.chapters.every(
        chapter => chapter.read
    );

}


function getCompletedDays() {

    return readingPlan.filter(
        day => isDayCompleted(day.day)
    ).length;

}


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


/* =========================================================
   DÍA SIGUIENTE
========================================================= */

function getNextIncompleteDay() {

    const incomplete = readingPlan.find(
        day => !isDayCompleted(day.day)
    );

    if (incomplete) {
        return incomplete.day;
    }

    return TOTAL_DAYS;
}


/* =========================================================
   RACHA
========================================================= */

function getStreak() {

    let latestCompleted = 0;

    readingPlan.forEach(day => {

        if (isDayCompleted(day.day)) {
            latestCompleted = day.day;
        }

    });

    if (latestCompleted === 0) {
        return 0;
    }

    let streak = 0;

    for (
        let day = latestCompleted;
        day >= 1;
        day--
    ) {

        if (isDayCompleted(day)) {
            streak++;
        } else {
            break;
        }

    }

    return streak;

}


/* =========================================================
   DESCRIPCIÓN DE LECTURA
========================================================= */

function getReadingDescription(dayNumber) {

    const day = getDay(dayNumber);

    if (!day || day.chapters.length === 0) {
        return "";
    }

    const groups = [];

    day.chapters.forEach(chapter => {

        let group = groups.find(
            item => item.book === chapter.book
        );

        if (!group) {

            group = {
                book: chapter.book,
                chapters: []
            };

            groups.push(group);

        }

        group.chapters.push(
            chapter.chapter
        );

    });


    return groups.map(group => {

        const nums = group.chapters;

        if (nums.length === 1) {
            return `${group.book} ${nums[0]}`;
        }

        return `${group.book} ${nums[0]}–${nums[nums.length - 1]}`;

    }).join(" · ");

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const read = getReadCount();
    const percentage = getPercentage();
    const completedDays = getCompletedDays();
    const streak = getStreak();

    const nextDay = getNextIncompleteDay();

    $("dashboardPercentage").textContent =
        `${percentage}%`;

    $("dashboardChapters").textContent =
        `${read} / ${TOTAL_CHAPTERS}`;

    $("dashboardDays").textContent =
        `${completedDays} / ${TOTAL_DAYS}`;

    $("dashboardStreak").textContent =
        `${streak} ${streak === 1 ? "día" : "días"}`;

    $("largePercentage").textContent =
        `${percentage}%`;

    $("mainProgress").style.width =
        `${percentage}%`;

    $("progressRead").textContent =
        read;

    $("progressRemaining").textContent =
        TOTAL_CHAPTERS - read;

    $("nextDayTitle").textContent =
        `Día ${nextDay}`;

    $("nextDayStatus").textContent =
        isDayCompleted(nextDay)
            ? "Completado"
            : "Pendiente";

    $("nextDayStatus").className =
        `status-badge ${
            isDayCompleted(nextDay)
                ? "completed"
                : "pending"
        }`;

    $("nextReadingText").textContent =
        getReadingDescription(nextDay);

}


/* =========================================================
   SELECCIONAR DÍA
========================================================= */

function selectDay(dayNumber) {

    selectedDay = dayNumber;

    renderSelectedDay();
    renderDays();

    /*
        Cuando el usuario selecciona un día desde
        el historial, volvemos arriba de la sección
        para que inmediatamente vea el registro.
    */

    const planSection = $("plan");

    if (
        planSection &&
        planSection.classList.contains("active-section")
    ) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


/* =========================================================
   RENDER DEL DÍA SELECCIONADO
========================================================= */

function renderSelectedDay() {

    const day = getDay(selectedDay);

    if (!day) {
        return;
    }

    const completed =
        isDayCompleted(selectedDay);

    const date =
        getDayDate(selectedDay);


    $("selectedDayTitle").textContent =
        `Día ${selectedDay}`;


    $("selectedDayDate").textContent =
        formatLongDate(date);


    $("selectedDayStatus").textContent =
        completed
            ? "Completado"
            : "Pendiente";


    $("selectedDayStatus").className =
        `status-badge ${
            completed
                ? "completed"
                : "pending"
        }`;


    $("selectedDayReading").textContent =
        getReadingDescription(selectedDay);


    const chapterList =
        $("chapterList");

    chapterList.innerHTML = "";


    day.chapters.forEach(chapter => {

        const label =
            document.createElement("label");

        label.className =
            `chapter-item ${
                chapter.read ? "read" : ""
            }`;


        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked =
            chapter.read;


        checkbox.addEventListener(
            "change",
            () => {

                chapter.read =
                    checkbox.checked;

                renderSelectedDay();
                renderDays();

                updateAll();

                saveProgress();

                showToast(
                    checkbox.checked ? "✓" : "↶",
                    checkbox.checked
                        ? `${chapter.book} ${chapter.chapter} registrado`
                        : `${chapter.book} ${chapter.chapter} desmarcado`
                );

            }
        );


        const content =
            document.createElement("div");

        content.className =
            "chapter-item-content";


        const book =
            document.createElement("span");

        book.className =
            "chapter-item-book";

        book.textContent =
            chapter.book;


        const number =
            document.createElement("span");

        number.className =
            "chapter-item-number";

        number.textContent =
            `Capítulo ${chapter.chapter}`;


        content.appendChild(book);
        content.appendChild(number);


        label.appendChild(checkbox);
        label.appendChild(content);


        if (chapter.read) {

            const check =
                document.createElement("span");

            check.className =
                "read-check";

            check.textContent = "✓";

            label.appendChild(check);

        }


        chapterList.appendChild(label);

    });

}


/* =========================================================
   COMPLETAR DÍA
========================================================= */

function completeSelectedDay() {

    const day = getDay(selectedDay);

    if (!day) {
        return;
    }

    day.chapters.forEach(
        chapter => {
            chapter.read = true;
        }
    );

    saveProgress();

    updateAll();

    renderSelectedDay();
    renderDays();

    showToast(
        "✓",
        `Día ${selectedDay} completado`
    );

}


/* =========================================================
   DESMARCAR DÍA
========================================================= */

function uncompleteSelectedDay() {

    const day = getDay(selectedDay);

    if (!day) {
        return;
    }

    day.chapters.forEach(
        chapter => {
            chapter.read = false;
        }
    );

    saveProgress();

    updateAll();

    renderSelectedDay();
    renderDays();

    showToast(
        "↶",
        `Día ${selectedDay} desmarcado`
    );

}


/* =========================================================
   RENDER HISTORIAL
========================================================= */

function renderDays() {

    const grid =
        $("daysGrid");

    grid.innerHTML = "";


    readingPlan.forEach(day => {

        const button =
            document.createElement("button");

        button.className = "day-button";


        if (day.day === selectedDay) {
            button.classList.add("selected");
        }


        if (isDayCompleted(day.day)) {
            button.classList.add("completed");
        }


        const number =
            document.createElement("span");

        number.className =
            "day-number";

        number.textContent =
            `Día ${day.day}`;


        const date =
            document.createElement("span");

        date.className =
            "day-date";

        date.textContent =
            formatShortDate(
                getDayDate(day.day)
            );


        const reading =
            document.createElement("span");

        reading.className =
            "day-reading";

        reading.textContent =
            getReadingDescription(day.day);


        button.appendChild(number);
        button.appendChild(date);
        button.appendChild(reading);


        if (isDayCompleted(day.day)) {

            const check =
                document.createElement("span");

            check.className =
                "day-check";

            check.textContent =
                "✓";

            button.appendChild(check);

        }


        button.addEventListener(
            "click",
            () => selectDay(day.day)
        );


        grid.appendChild(button);

    });


    $("planCompletedCounter").textContent =
        getCompletedDays();

}


/* =========================================================
   LIBROS
========================================================= */

function renderBooks(search = "") {

    const grid =
        $("booksGrid");

    grid.innerHTML = "";


    const normalizedSearch =
        search.trim().toLowerCase();


    BOOKS
        .filter(book =>
            book.name
                .toLowerCase()
                .includes(normalizedSearch)
        )
        .forEach(book => {

            const bookChapters =
                chapters.filter(
                    chapter =>
                        chapter.book === book.name
                );


            const read =
                bookChapters.filter(
                    chapter => chapter.read
                ).length;


            const percentage =
                Math.round(
                    (read / book.chapters) * 100
                );


            const card =
                document.createElement("div");

            card.className =
                "book-card";


            card.innerHTML = `

                <div class="book-card-top">

                    <h3>${book.name}</h3>

                    <span class="book-percentage">
                        ${percentage}%
                    </span>

                </div>

                <div class="book-progress">

                    <div
                        class="book-progress-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>

                <div class="book-meta">

                    <span>
                        ${read} de ${book.chapters} capítulos
                    </span>

                    <span>
                        ${
                            read === book.chapters
                                ? "✓ Completo"
                                : `${book.chapters - read} pendientes`
                        }
                    </span>

                </div>
            `;


            grid.appendChild(card);

        });


    if (grid.children.length === 0) {

        grid.innerHTML = `
            <div class="content-card">
                No se encontró ningún libro.
            </div>
        `;

    }

}


/* =========================================================
   ESTADÍSTICAS
========================================================= */

function renderStatistics() {

    const read = getReadCount();
    const percentage = getPercentage();
    const remaining =
        TOTAL_CHAPTERS - read;

    const completedDays =
        getCompletedDays();

    const streak =
        getStreak();


    $("circlePercentage").textContent =
        `${percentage}%`;


    $("statsRead").textContent =
        read;


    $("statsRemaining").textContent =
        remaining;


    $("statsDays").textContent =
        `${completedDays} / ${TOTAL_DAYS}`;


    $("statsStreak").textContent =
        `${streak} ${streak === 1 ? "día" : "días"}`;


    const average =
        completedDays > 0
            ? (read / completedDays).toFixed(1)
            : "0";


    $("averageChapters").textContent =
        average;


    const degrees =
        percentage * 3.6;


    $("circleProgress").style.background =
        `conic-gradient(
            var(--primary) ${degrees}deg,
            var(--background) ${degrees}deg
        )`;


    renderMonthlyProgress();

}


/* =========================================================
   PROGRESO MENSUAL
   BASADO EN FECHAS REALES
========================================================= */

function renderMonthlyProgress() {

    const container =
        $("monthlyProgress");

    container.innerHTML = "";


    const months = {};


    /*
        Recorremos los 365 días del plan.

        Cada día pertenece al mes calendario
        real correspondiente a la fecha de inicio.
    */

    readingPlan.forEach(day => {

        const date =
            getDayDate(day.day);

        const key =
            getMonthKey(date);


        if (!months[key]) {

            months[key] = {
                date: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    1
                ),
                planned: 0,
                read: 0
            };

        }


        months[key].planned +=
            day.chapters.length;


        months[key].read +=
            day.chapters.filter(
                chapter => chapter.read
            ).length;

    });


    Object.values(months).forEach(month => {

        const percentage =
            month.planned > 0
                ? Math.round(
                    (month.read / month.planned) * 100
                )
                : 0;


        const row =
            document.createElement("div");

        row.className =
            "month-row";


        row.innerHTML = `

            <div class="month-name">
                ${getMonthLabel(month.date)}
            </div>

            <div class="month-bar">

                <div
                    class="month-bar-fill"
                    style="width:${percentage}%"
                ></div>

            </div>

            <div class="month-value">
                ${month.read}/${month.planned}
                <br>
                ${percentage}%
            </div>

        `;


        container.appendChild(row);

    });

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function navigate(sectionName) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    const section =
        $(sectionName);

    if (section) {

        section.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === sectionName
            );

        });


    const titles = {

        inicio: "Inicio",

        plan: "Plan de lectura",

        libros: "Libros",

        estadisticas: "Estadísticas",

        datos: "Mis datos"

    };


    $("pageTitle").textContent =
        titles[sectionName] || "Biblia 365";


    /*
        En Plan siempre comenzamos mostrando
        el registro de lectura.
    */

    if (sectionName === "plan") {

        renderSelectedDay();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } else {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    closeMobileMenu();

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

        document.body.classList.add("dark");

        $("themeIcon").textContent =
            "☀️";

        $("themeText").textContent =
            "Modo claro";

    } else {

        document.body.classList.remove("dark");

        $("themeIcon").textContent =
            "🌙";

        $("themeText").textContent =
            "Modo oscuro";

    }

}


function toggleTheme() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        THEME_KEY,
        dark ? "dark" : "light"
    );


    loadTheme();

}


/* =========================================================
   FECHA ACTUAL EN HEADER
========================================================= */

function updateTodayBadge() {

    const today =
        new Date();

    $("todayBadge").textContent =
        new Intl.DateTimeFormat(
            "es-NI",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        ).format(today);

}


/* =========================================================
   EXPORTAR EXCEL
========================================================= */

function exportProgress() {

    if (typeof XLSX === "undefined") {

        showToast(
            "!",
            "La función Excel necesita conexión a Internet"
        );

        return;

    }


    const rows = [];


    readingPlan.forEach(day => {

        const date =
            getDayDate(day.day);


        day.chapters.forEach(chapter => {

            rows.push({

                "Día":
                    day.day,

                "Fecha":
                    formatLongDate(date),

                "Libro":
                    chapter.book,

                "Capítulo":
                    chapter.chapter,

                "Leído":
                    chapter.read ? "Sí" : "No"

            });

        });

    });


    const worksheet =
        XLSX.utils.json_to_sheet(rows);


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Progreso"
    );


    const settings = [

        {
            "Configuración":
                "Fecha de inicio"
        },

        {
            "Configuración":
                dateToInputValue(startDate)
        }

    ];


    const settingsSheet =
        XLSX.utils.json_to_sheet(settings);


    XLSX.utils.book_append_sheet(
        workbook,
        settingsSheet,
        "Configuración"
    );


    XLSX.writeFile(
        workbook,
        "biblia-en-un-ano-progreso.xlsx"
    );


    showToast(
        "✓",
        "Progreso exportado correctamente"
    );

}


/* =========================================================
   IMPORTAR EXCEL
========================================================= */

function importProgress(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    if (typeof XLSX === "undefined") {

        showToast(
            "!",
            "La función Excel necesita conexión a Internet"
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        try {

            const data =
                new Uint8Array(
                    e.target.result
                );


            const workbook =
                XLSX.read(
                    data,
                    { type: "array" }
                );


            const sheetName =
                workbook.SheetNames.find(
                    name =>
                        name.toLowerCase()
                            .includes("progreso")
                ) ||
                workbook.SheetNames[0];


            const worksheet =
                workbook.Sheets[sheetName];


            const rows =
                XLSX.utils.sheet_to_json(
                    worksheet
                );


            let imported = 0;


            rows.forEach(row => {

                const book =
                    row["Libro"] ||
                    row["libro"];


                const chapterValue =
                    row["Capítulo"] ??
                    row["Capitulo"] ??
                    row["capítulo"] ??
                    row["capitulo"];


                const readValue =
                    row["Leído"] ??
                    row["Leido"] ??
                    row["leído"] ??
                    row["leido"];


                if (
                    !book ||
                    chapterValue === undefined
                ) {
                    return;
                }


                const chapterNumber =
                    Number(chapterValue);


                const current =
                    chapters.find(
                        chapter =>
                            chapter.book === book &&
                            chapter.chapter === chapterNumber
                    );


                if (!current) {
                    return;
                }


                const normalized =
                    String(readValue)
                        .trim()
                        .toLowerCase();


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
                    ].includes(normalized);


                imported++;

            });


            saveProgress();

            updateAll();

            renderSelectedDay();
            renderDays();
            renderBooks(
                $("bookSearch").value
            );


            showToast(
                "✓",
                `${imported} registros importados`
            );


        } catch (error) {

            console.error(error);

            showToast(
                "!",
                "No se pudo importar el archivo"
            );

        }

    };


    reader.readAsArrayBuffer(file);

    event.target.value = "";

}


/* =========================================================
   REINICIAR
========================================================= */

function resetProgress() {

    const confirmed =
        confirm(
            "¿Estás seguro de que deseas borrar todo tu progreso? Esta acción no se puede deshacer."
        );


    if (!confirmed) {
        return;
    }


    chapters.forEach(
        chapter => {
            chapter.read = false;
        }
    );


    selectedDay = 1;


    saveProgress();

    updateAll();

    renderSelectedDay();
    renderDays();

    renderBooks(
        $("bookSearch").value
    );


    showToast(
        "↺",
        "El progreso fue reiniciado"
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(icon, message) {

    const toast =
        $("toast");


    $("toastIcon").textContent =
        icon;


    $("toastMessage").textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimeout);


    toastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function openMobileMenu() {

    $("sidebar").classList.add("open");

    $("sidebarOverlay").classList.add(
        "show"
    );

}


function closeMobileMenu() {

    $("sidebar").classList.remove("open");

    $("sidebarOverlay").classList.remove(
        "show"
    );

}


/* =========================================================
   ACTUALIZAR TODO
========================================================= */

function updateAll() {

    updateDashboard();

    renderStatistics();

    renderBooks(
        $("bookSearch").value
    );

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


    /* Tema */

    $("themeButton")
        .addEventListener(
            "click",
            toggleTheme
        );


    /* Menú móvil */

    $("menuButton")
        .addEventListener(
            "click",
            openMobileMenu
        );


    $("sidebarOverlay")
        .addEventListener(
            "click",
            closeMobileMenu
        );


    /* Continuar */

    $("continueButton")
        .addEventListener(
            "click",
            () => {

                selectedDay =
                    getNextIncompleteDay();

                navigate("plan");

            }
        );


    $("openNextDayButton")
        .addEventListener(
            "click",
            () => {

                selectedDay =
                    getNextIncompleteDay();

                navigate("plan");

            }
        );


    /* Fecha */

    $("saveStartDateButton")
        .addEventListener(
            "click",
            saveStartDate
        );


    /* Día completo */

    $("completeDayButton")
        .addEventListener(
            "click",
            completeSelectedDay
        );


    /* Desmarcar */

    $("uncompleteDayButton")
        .addEventListener(
            "click",
            uncompleteSelectedDay
        );


    /* Buscar libros */

    $("bookSearch")
        .addEventListener(
            "input",
            event => {

                renderBooks(
                    event.target.value
                );

            }
        );


    /* Exportar */

    $("exportButton")
        .addEventListener(
            "click",
            exportProgress
        );


    /* Importar */

    $("importFile")
        .addEventListener(
            "change",
            importProgress
        );


    /* Reiniciar */

    $("resetButton")
        .addEventListener(
            "click",
            resetProgress
        );

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function init() {

    buildChapters();

    buildReadingPlan();

    loadStartDate();

    loadProgress();

    loadTheme();

    updateTodayBadge();


    $("startDateInput").value =
        dateToInputValue(startDate);


    /*
        Al abrir la aplicación, automáticamente
        seleccionamos el primer día pendiente.
    */

    selectedDay =
        getNextIncompleteDay();


    setupEvents();

    updateAll();

    renderSelectedDay();

    renderDays();

}


document.addEventListener(
    "DOMContentLoaded",
    init
);
