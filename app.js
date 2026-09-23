/* =========================================================
   BIBLIA 365
   Sistema de acompañamiento y registro de lectura bíblica
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const TOTAL_DAYS = 365;
const TOTAL_CHAPTERS = 1189;

const PROGRESS_KEY = "biblia-en-un-ano-v2";
const START_DATE_KEY = "biblia-en-un-ano-start-date";
const THEME_KEY = "biblia-en-un-ano-theme";


/* =========================================================
   LIBROS DE LA BIBLIA
========================================================= */

const books = [
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
   ESTADO
========================================================= */

let progress = loadProgress();

let selectedDay = 1;


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeStartDate();

    initializeTheme();

    initializeNavigation();

    initializeButtons();

    renderAll();

});


/* =========================================================
   PROGRESO
========================================================= */

function loadProgress() {

    try {

        const saved = localStorage.getItem(PROGRESS_KEY);

        if (!saved) {
            return {};
        }

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "No se pudo cargar el progreso:",
            error
        );

        return {};

    }

}


function saveProgress() {

    localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify(progress)
    );

}


/* =========================================================
   FECHA DE INICIO
========================================================= */

function initializeStartDate() {

    const input =
        document.getElementById("startDateInput");

    let startDate =
        localStorage.getItem(START_DATE_KEY);

    if (!startDate) {

        const today = new Date();

        startDate = formatInputDate(today);

        localStorage.setItem(
            START_DATE_KEY,
            startDate
        );

    }

    input.value = startDate;

    updateStartDateDisplay();

}


function formatInputDate(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function parseLocalDate(value) {

    const [year, month, day] =
        value.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );

}


function getStartDate() {

    return parseLocalDate(
        localStorage.getItem(START_DATE_KEY)
    );

}


function getDayDate(dayNumber) {

    const date = getStartDate();

    date.setDate(
        date.getDate() + dayNumber - 1
    );

    return date;

}


function formatSpanishDate(date) {

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


function updateStartDateDisplay() {

    const display =
        document.getElementById(
            "startDateDisplay"
        );

    display.textContent =
        formatSpanishDate(getStartDate());

}


/* =========================================================
   GENERACIÓN DEL PLAN
========================================================= */

function generatePlan() {

    const plan = [];

    let bookIndex = 0;

    let chapter = 1;

    let globalChapter = 1;


    /*
       1189 capítulos / 365 días

       94 días = 4 capítulos
       271 días = 3 capítulos

       94 * 4 + 271 * 3 = 1189
    */

    for (
        let day = 1;
        day <= TOTAL_DAYS;
        day++
    ) {

        const chaptersForDay =
            day <= 94 ? 4 : 3;

        const readings = [];

        for (
            let i = 0;
            i < chaptersForDay;
            i++
        ) {

            const currentBook =
                books[bookIndex];

            readings.push({
                book: currentBook[0],
                chapter: chapter,
                globalChapter: globalChapter
            });

            chapter++;
            globalChapter++;

            if (
                chapter >
                currentBook[1]
            ) {

                bookIndex++;

                chapter = 1;

            }

        }

        plan.push({
            day: day,
            date: getDayDate(day),
            readings: readings
        });

    }

    return plan;

}


function getPlanDay(dayNumber) {

    return generatePlan()
        .find(day => day.day === dayNumber);

}


/* =========================================================
   LECTURA DE CAPÍTULOS
========================================================= */

function getChapterKey(reading) {

    return `${reading.book}|${reading.chapter}`;

}


function isChapterRead(reading) {

    return progress[
        getChapterKey(reading)
    ] === true;

}


function markChapter(reading, checked) {

    const key =
        getChapterKey(reading);

    if (checked) {

        progress[key] = true;

    } else {

        delete progress[key];

    }

    saveProgress();

    renderAll();

    /*
       Después de renderizar,
       regresamos al día seleccionado.
    */

    requestAnimationFrame(() => {

        const selected =
            document.getElementById(
                "selectedReading"
            );

        if (selected) {

            selected.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

}


/* =========================================================
   INFORMACIÓN DEL DÍA
========================================================= */

function getDayReadCount(day) {

    return day.readings.filter(
        reading =>
            isChapterRead(reading)
    ).length;

}


function isDayComplete(day) {

    return (
        getDayReadCount(day) ===
        day.readings.length
    );

}


/* =========================================================
   DÍA SELECCIONADO
========================================================= */

function selectDay(dayNumber, shouldScroll = true) {

    selectedDay = dayNumber;

    renderSelectedDay();

    renderDaysGrid();

    /*
       ESTA ES LA CORRECCIÓN PRINCIPAL:

       Al seleccionar un día desde la cuadrícula,
       la pantalla se desplaza directamente
       a "DÍA SELECCIONADO".
    */

    if (shouldScroll) {

        setTimeout(() => {

            const selectedReading =
                document.getElementById(
                    "selectedReading"
                );

            if (selectedReading) {

                selectedReading.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }, 80);

    }

}


function renderSelectedDay() {

    const day =
        getPlanDay(selectedDay);

    if (!day) {
        return;
    }


    document.getElementById(
        "selectedDayTitle"
    ).textContent =
        `Día ${day.day}`;


    document.getElementById(
        "selectedDayDate"
    ).textContent =
        formatSpanishDate(day.date);


    document.getElementById(
        "selectedReadingText"
    ).textContent =
        formatReadings(day.readings);


    const complete =
        isDayComplete(day);


    const status =
        document.getElementById(
            "selectedDayStatus"
        );


    status.textContent =
        complete
            ? "Completado"
            : "Pendiente";


    status.className =
        `status-badge ${
            complete
                ? "complete"
                : "pending"
        }`;


    renderChapterChecklist(day);

}


function renderChapterChecklist(day) {

    const container =
        document.getElementById(
            "chapterChecklist"
        );

    container.innerHTML = "";


    day.readings.forEach(
        reading => {

            const label =
                document.createElement("label");

            label.className =
                "chapter-item";


            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.checked =
                isChapterRead(reading);


            const text =
                document.createElement("span");

            text.textContent =
                `${reading.book} ${reading.chapter}`;


            if (checkbox.checked) {

                label.classList.add(
                    "checked"
                );

            }


            checkbox.addEventListener(
                "change",
                () => {

                    markChapter(
                        reading,
                        checkbox.checked
                    );

                }
            );


            label.appendChild(checkbox);

            label.appendChild(text);

            container.appendChild(label);

        }
    );

}


/* =========================================================
   FORMATO DE LECTURA
========================================================= */

function formatReadings(readings) {

    if (!readings.length) {
        return "";
    }


    const first =
        readings[0];

    const last =
        readings[readings.length - 1];


    if (
        first.book === last.book
    ) {

        return `${first.book} ${first.chapter}–${last.chapter}`;

    }


    return readings
        .map(
            reading =>
                `${reading.book} ${reading.chapter}`
        )
        .join(", ");

}


/* =========================================================
   CUADRÍCULA DE DÍAS
========================================================= */

function renderDaysGrid() {

    const container =
        document.getElementById(
            "daysGrid"
        );

    container.innerHTML = "";


    const plan =
        generatePlan();


    plan.forEach(day => {

        const button =
            document.createElement("button");

        button.className =
            "day-button";


        if (
            day.day === selectedDay
        ) {

            button.classList.add(
                "selected"
            );

        }


        if (isDayComplete(day)) {

            button.classList.add(
                "complete"
            );

        }


        const dayNumber =
            document.createElement("span");

        dayNumber.className =
            "day-number";

        dayNumber.textContent =
            `Día ${day.day}`;


        const date =
            document.createElement("span");

        date.className =
            "day-date";

        date.textContent =
            formatShortDate(day.date);


        const reading =
            document.createElement("span");

        reading.className =
            "day-reading";

        reading.textContent =
            formatReadings(day.readings);


        button.appendChild(dayNumber);

        button.appendChild(date);

        button.appendChild(reading);


        if (isDayComplete(day)) {

            const check =
                document.createElement("span");

            check.className =
                "day-check";

            check.textContent =
                "✓ Completado";

            button.appendChild(check);

        }


        button.addEventListener(
            "click",
            () => selectDay(day.day)
        );


        container.appendChild(button);

    });


    updatePlanProgress();

}


/* =========================================================
   MARCAR DÍA COMPLETO
========================================================= */

function completeSelectedDay() {

    const day =
        getPlanDay(selectedDay);


    day.readings.forEach(
        reading => {

            progress[
                getChapterKey(reading)
            ] = true;

        }
    );


    saveProgress();

    renderAll();


    setTimeout(() => {

        const selected =
            document.getElementById(
                "selectedReading"
            );

        selected?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 80);

}


/* =========================================================
   DESMARCAR DÍA
========================================================= */

function uncompleteSelectedDay() {

    const day =
        getPlanDay(selectedDay);


    day.readings.forEach(
        reading => {

            delete progress[
                getChapterKey(reading)
            ];

        }
    );


    saveProgress();

    renderAll();


    setTimeout(() => {

        const selected =
            document.getElementById(
                "selectedReading"
            );

        selected?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 80);

}


/* =========================================================
   ESTADÍSTICAS GENERALES
========================================================= */

function getTotalRead() {

    return Object.keys(progress)
        .filter(key => progress[key] === true)
        .length;

}


function getCompletedDays() {

    const plan =
        generatePlan();

    return plan.filter(
        day => isDayComplete(day)
    ).length;

}


function getPercentage() {

    return Math.round(
        getTotalRead() /
        TOTAL_CHAPTERS *
        100
    );

}


/* =========================================================
   Racha
========================================================= */

function getStreak() {

    const plan =
        generatePlan();

    let streak = 0;


    /*
       Buscamos desde el último día
       hacia atrás para obtener la racha
       consecutiva más reciente.
    */

    for (
        let i = plan.length - 1;
        i >= 0;
        i--
    ) {

        if (isDayComplete(plan[i])) {

            streak++;

        } else {

            break;

        }

    }

    return streak;

}


/* =========================================================
   RENDER PRINCIPAL
========================================================= */

function renderAll() {

    renderSelectedDay();

    renderDaysGrid();

    renderHome();

    renderBooks();

    renderStats();

}


/* =========================================================
   INICIO
========================================================= */

function getFirstIncompleteDay() {

    const plan =
        generatePlan();


    const incomplete =
        plan.find(
            day => !isDayComplete(day)
        );


    return incomplete
        ? incomplete.day
        : TOTAL_DAYS;

}


function renderHome() {

    const totalRead =
        getTotalRead();

    const percentage =
        getPercentage();

    const completedDays =
        getCompletedDays();

    const streak =
        getStreak();

    const nextDay =
        getFirstIncompleteDay();

    const day =
        getPlanDay(nextDay);


    document.getElementById(
        "homeNextDayTitle"
    ).textContent =
        `Día ${nextDay}`;


    document.getElementById(
        "homeNextReading"
    ).textContent =
        `${formatSpanishDate(day.date)} · ${formatReadings(day.readings)}`;


    document.getElementById(
        "homePercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "homeChapters"
    ).textContent =
        `${totalRead} / ${TOTAL_CHAPTERS}`;


    document.getElementById(
        "homeDays"
    ).textContent =
        `${completedDays} / ${TOTAL_DAYS}`;


    document.getElementById(
        "homeStreak"
    ).textContent =
        `${streak} días`;


    document.getElementById(
        "homeProgressText"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "homeProgressBar"
    ).style.width =
        `${percentage}%`;

}


/* =========================================================
   LIBROS
========================================================= */

function renderBooks() {

    const container =
        document.getElementById(
            "booksGrid"
        );

    const search =
        (
            document.getElementById(
                "bookSearch"
            )?.value || ""
        )
        .toLowerCase()
        .trim();


    container.innerHTML = "";


    books.forEach(
        ([bookName, chapters]) => {

            if (
                search &&
                !bookName
                    .toLowerCase()
                    .includes(search)
            ) {
                return;
            }


            let read = 0;


            for (
                let chapter = 1;
                chapter <= chapters;
                chapter++
            ) {

                if (
                    progress[
                        `${bookName}|${chapter}`
                    ]
                ) {

                    read++;

                }

            }


            const percentage =
                Math.round(
                    read /
                    chapters *
                    100
                );


            const card =
                document.createElement("div");

            card.className =
                "book-card";


            card.innerHTML = `

                <div class="book-card-header">

                    <div>
                        <h3>${bookName}</h3>

                        <small>
                            ${read} de ${chapters} capítulos
                        </small>
                    </div>

                    <span class="book-percentage">
                        ${percentage}%
                    </span>

                </div>

                <div class="book-progress">

                    <div
                        style="width:${percentage}%"
                    ></div>

                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* =========================================================
   ESTADÍSTICAS
========================================================= */

function renderStats() {

    const totalRead =
        getTotalRead();

    const percentage =
        getPercentage();

    const remaining =
        TOTAL_CHAPTERS -
        totalRead;

    const completedDays =
        getCompletedDays();

    const streak =
        getStreak();


    const average =
        completedDays > 0
            ? (
                totalRead /
                completedDays
            ).toFixed(1)
            : "0";


    document.getElementById(
        "statsPercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "statsRead"
    ).textContent =
        totalRead;


    document.getElementById(
        "statsRemaining"
    ).textContent =
        remaining;


    document.getElementById(
        "statsDays"
    ).textContent =
        completedDays;


    document.getElementById(
        "statsStreak"
    ).textContent =
        streak;


    document.getElementById(
        "statsAverage"
    ).textContent =
        average;


    renderMonthlyStats();

}


/* =========================================================
   ESTADÍSTICAS MENSUALES
========================================================= */

function renderMonthlyStats() {

    const container =
        document.getElementById(
            "monthlyStats"
        );

    container.innerHTML = "";


    const months = {};


    const plan =
        generatePlan();


    plan.forEach(day => {

        const key =
            `${day.date.getFullYear()}-${String(
                day.date.getMonth() + 1
            ).padStart(2, "0")}`;


        if (!months[key]) {

            months[key] = {
                date: day.date,
                chapters: 0,
                total: 0
            };

        }


        months[key].total +=
            day.readings.length;


        months[key].chapters +=
            getDayReadCount(day);

    });


    Object.values(months).forEach(
        month => {

            const percentage =
                Math.round(
                    month.chapters /
                    month.total *
                    100
                );


            const row =
                document.createElement("div");

            row.className =
                "month-row";


            const name =
                new Intl.DateTimeFormat(
                    "es-NI",
                    {
                        month: "long",
                        year: "numeric"
                    }
                ).format(month.date);


            row.innerHTML = `

                <span class="month-name">
                    ${capitalize(name)}
                </span>

                <div class="month-progress">

                    <div
                        style="width:${percentage}%"
                    ></div>

                </div>

                <span class="month-value">
                    ${month.chapters}/${month.total}
                </span>

            `;


            container.appendChild(row);

        }
    );

}


/* =========================================================
   UTILIDAD
========================================================= */

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


function updatePlanProgress() {

    const completed =
        getCompletedDays();

    document.getElementById(
        "planProgressLabel"
    ).textContent =
        `${completed} / ${TOTAL_DAYS} días`;

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function initializeNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const section =
                    item.dataset.section;


                navItems.forEach(
                    nav =>
                        nav.classList.remove(
                            "active"
                        )
                );


                item.classList.add(
                    "active"
                );


                document.querySelectorAll(
                    ".page-section"
                ).forEach(
                    page =>
                        page.classList.remove(
                            "active"
                        )
                );


                document
                    .getElementById(section)
                    .classList.add("active");


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    });

}


/* =========================================================
   BOTONES
========================================================= */

function initializeButtons() {

    /* Continuar */

    document
        .getElementById("continueButton")
        .addEventListener(
            "click",
            () => {

                const next =
                    getFirstIncompleteDay();


                document
                    .querySelector(
                        '[data-section="plan"]'
                    )
                    .click();


                setTimeout(() => {

                    selectDay(next);

                }, 100);

            }
        );


    /* Completar día */

    document
        .getElementById(
            "completeDayButton"
        )
        .addEventListener(
            "click",
            completeSelectedDay
        );


    /* Desmarcar */

    document
        .getElementById(
            "uncompleteDayButton"
        )
        .addEventListener(
            "click",
            uncompleteSelectedDay
        );


    /* Fecha */

    document
        .getElementById(
            "saveStartDateButton"
        )
        .addEventListener(
            "click",
            saveStartDate
        );


    /* Búsqueda */

    document
        .getElementById(
            "bookSearch"
        )
        .addEventListener(
            "input",
            renderBooks
        );


    /* Tema */

    document
        .getElementById(
            "themeToggle"
        )
        .addEventListener(
            "click",
            toggleTheme
        );


    /* Excel */

    document
        .getElementById(
            "exportButton"
        )
        .addEventListener(
            "click",
            exportExcel
        );


    document
        .getElementById(
            "importButton"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "importFile"
                    )
                    .click();

            }
        );


    document
        .getElementById(
            "importFile"
        )
        .addEventListener(
            "change",
            importExcel
        );


    /* Reset */

    document
        .getElementById(
            "resetButton"
        )
        .addEventListener(
            "click",
            resetProgress
        );

}


/* =========================================================
   GUARDAR FECHA DE INICIO
========================================================= */

function saveStartDate() {

    const input =
        document.getElementById(
            "startDateInput"
        );


    if (!input.value) {

        alert(
            "Selecciona una fecha de inicio."
        );

        return;

    }


    localStorage.setItem(
        START_DATE_KEY,
        input.value
    );


    updateStartDateDisplay();


    /*
       La fecha cambia el calendario,
       pero NO elimina el progreso.
    */

    selectedDay = 1;

    renderAll();


    alert(
        "La fecha de inicio ha sido actualizada."
    );

}


/* =========================================================
   TEMA
========================================================= */

function initializeTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

        document.getElementById(
            "themeToggle"
        ).innerHTML =
            "☀️ <span>Modo claro</span>";

    }

}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        THEME_KEY,
        dark ? "dark" : "light"
    );


    document.getElementById(
        "themeToggle"
    ).innerHTML =
        dark
            ? "☀️ <span>Modo claro</span>"
            : "🌙 <span>Modo oscuro</span>";

}


/* =========================================================
   EXPORTAR EXCEL
========================================================= */

function exportExcel() {

    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "No se pudo cargar la biblioteca de Excel."
        );

        return;

    }


    const rows = [];


    Object.keys(progress)
        .forEach(key => {

            if (!progress[key]) {
                return;
            }


            const [
                book,
                chapter
            ] = key.split("|");


            rows.push({
                Libro: book,
                Capítulo: Number(chapter),
                Leído: "Sí"
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


    XLSX.writeFile(
        workbook,
        "Biblia_365_Progreso.xlsx"
    );

}


/* =========================================================
   IMPORTAR EXCEL
========================================================= */

function importExcel(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "No se pudo cargar la biblioteca de Excel."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const data =
                    new Uint8Array(
                        e.target.result
                    );


                const workbook =
                    XLSX.read(
                        data,
                        {
                            type: "array"
                        }
                    );


                const firstSheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        firstSheet
                    );


                let imported = 0;


                rows.forEach(row => {

                    const book =
                        row["Libro"];


                    const chapter =
                        row["Capítulo"] ??
                        row["Capitulo"];


                    const read =
                        row["Leído"] ??
                        row["Leido"];


                    if (
                        book &&
                        chapter &&
                        (
                            read === "Sí" ||
                            read === "Si" ||
                            read === true ||
                            read === 1
                        )
                    ) {

                        progress[
                            `${book}|${Number(chapter)}`
                        ] = true;


                        imported++;

                    }

                });


                saveProgress();

                renderAll();


                alert(
                    `Se importaron ${imported} capítulos.`
                );


            } catch (error) {

                console.error(error);

                alert(
                    "No se pudo importar el archivo."
                );

            }


            event.target.value = "";

        };


    reader.readAsArrayBuffer(file);

}


/* =========================================================
   RESTABLECER
========================================================= */

function resetProgress() {

    const confirmation =
        confirm(
            "¿Estás seguro de que deseas eliminar todo tu progreso? Esta acción no se puede deshacer."
        );


    if (!confirmation) {
        return;
    }


    progress = {};


    saveProgress();


    selectedDay = 1;


    renderAll();


    alert(
        "Tu progreso ha sido restablecido."
    );

}
