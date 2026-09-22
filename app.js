/* ============================================================
   BIBLIA EN UN AÑO
   Aplicación de seguimiento de lectura física
============================================================ */


/* ============================================================
   CONFIGURACIÓN
============================================================ */

const TOTAL_DAYS = 365;
const TOTAL_CHAPTERS = 1189;

const STORAGE_KEY = "biblia-en-un-ano-v2";
const THEME_KEY = "biblia-en-un-ano-theme";


/* ============================================================
   LIBROS DE LA BIBLIA
============================================================ */

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


/* ============================================================
   VARIABLES
============================================================ */

let chapters = [];
let readingPlan = [];
let selectedDay = 1;


/* ============================================================
   CREAR TODOS LOS CAPÍTULOS
============================================================ */

function buildChapters() {

    chapters = [];

    BOOKS.forEach(book => {

        for (let chapter = 1; chapter <= book.chapters; chapter++) {

            chapters.push({

                id: `${book.name}-${chapter}`,

                book: book.name,

                chapter: chapter,

                read: false

            });

        }

    });

}


/* ============================================================
   CREAR PLAN DE 365 DÍAS
============================================================ */

function buildReadingPlan() {

    readingPlan = [];

    const base = Math.floor(
        chapters.length / TOTAL_DAYS
    );

    const remainder =
        chapters.length % TOTAL_DAYS;

    let position = 0;

    for (let day = 1; day <= TOTAL_DAYS; day++) {

        const amount =
            day <= remainder
                ? base + 1
                : base;

        const dayChapters =
            chapters.slice(
                position,
                position + amount
            );

        readingPlan.push({

            day: day,

            chapters: dayChapters.map(chapter => chapter.id)

        });

        position += amount;
    }

}


/* ============================================================
   LOCAL STORAGE
============================================================ */

function saveData() {

    const data = {

        chapters: chapters.map(chapter => ({

            id: chapter.id,

            read: chapter.read

        })),

        lastSelectedDay: selectedDay

    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


function loadData() {

    const stored =
        localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return;
    }

    try {

        const data = JSON.parse(stored);

        if (Array.isArray(data.chapters)) {

            const savedMap =
                new Map(
                    data.chapters.map(item => [
                        item.id,
                        item.read === true
                    ])
                );

            chapters.forEach(chapter => {

                if (savedMap.has(chapter.id)) {

                    chapter.read =
                        savedMap.get(chapter.id);

                }

            });

        }

        if (
            Number.isInteger(data.lastSelectedDay) &&
            data.lastSelectedDay >= 1 &&
            data.lastSelectedDay <= TOTAL_DAYS
        ) {

            selectedDay = data.lastSelectedDay;

        }

    } catch (error) {

        console.error(
            "No se pudo cargar el progreso:",
            error
        );

    }

}


/* ============================================================
   UTILIDADES
============================================================ */

function getChapter(id) {

    return chapters.find(
        chapter => chapter.id === id
    );

}


function getDay(dayNumber) {

    return readingPlan.find(
        day => day.day === dayNumber
    );

}


function isDayCompleted(dayNumber) {

    const day = getDay(dayNumber);

    if (!day) {
        return false;
    }

    return day.chapters.every(id => {

        const chapter = getChapter(id);

        return chapter && chapter.read;

    });

}


function getCompletedDays() {

    return readingPlan.filter(
        day => isDayCompleted(day.day)
    ).length;

}


/* ============================================================
   CONTINUAR DONDE QUEDÉ
============================================================ */

function getNextIncompleteDay() {

    const incomplete =
        readingPlan.find(
            day => !isDayCompleted(day.day)
        );

    return incomplete
        ? incomplete.day
        : TOTAL_DAYS;
}


function getCurrentDayToContinue() {

    const next =
        getNextIncompleteDay();

    return next;
}


/* ============================================================
   PROGRESO
============================================================ */

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


function getStreak() {

    let streak = 0;

    for (
        let day = 1;
        day <= TOTAL_DAYS;
        day++
    ) {

        if (isDayCompleted(day)) {

            streak++;

        } else {

            break;

        }

    }

    return streak;

}


/* ============================================================
   FORMATO DE LECTURA
============================================================ */

function getReadingDescription(dayNumber) {

    const day = getDay(dayNumber);

    if (!day || day.chapters.length === 0) {
        return "Sin lectura";
    }

    const dayChapters =
        day.chapters.map(getChapter);

    const grouped = [];

    let currentBook = null;
    let startChapter = null;
    let endChapter = null;

    dayChapters.forEach(chapter => {

        if (currentBook === null) {

            currentBook = chapter.book;

            startChapter = chapter.chapter;

            endChapter = chapter.chapter;

            return;
        }

        if (
            chapter.book === currentBook &&
            chapter.chapter === endChapter + 1
        ) {

            endChapter = chapter.chapter;

        } else {

            grouped.push({
                book: currentBook,
                start: startChapter,
                end: endChapter
            });

            currentBook = chapter.book;

            startChapter = chapter.chapter;

            endChapter = chapter.chapter;

        }

    });


    if (currentBook !== null) {

        grouped.push({
            book: currentBook,
            start: startChapter,
            end: endChapter
        });

    }


    return grouped
        .map(item => {

            if (item.start === item.end) {

                return `${item.book} ${item.start}`;

            }

            return `${item.book} ${item.start}–${item.end}`;

        })
        .join(" · ");

}


/* ============================================================
   ACTUALIZAR DASHBOARD
============================================================ */

function updateDashboard() {

    const read =
        getReadCount();

    const percentage =
        getPercentage();

    const completedDays =
        getCompletedDays();

    const streak =
        getStreak();

    const remaining =
        TOTAL_CHAPTERS - read;

    document.getElementById(
        "dashboardPercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "dashboardChapters"
    ).textContent =
        `${read} / ${TOTAL_CHAPTERS}`;


    document.getElementById(
        "dashboardDays"
    ).textContent =
        `${completedDays} / ${TOTAL_DAYS}`;


    document.getElementById(
        "dashboardStreak"
    ).textContent =
        `${streak} días`;


    document.getElementById(
        "largePercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "mainProgress"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "progressRead"
    ).textContent =
        read;


    document.getElementById(
        "progressRemaining"
    ).textContent =
        remaining;


    document.getElementById(
        "planCompletedCounter"
    ).textContent =
        `${completedDays} / ${TOTAL_DAYS}`;


    const nextDay =
        getCurrentDayToContinue();


    document.getElementById(
        "nextDayTitle"
    ).textContent =
        `Día ${nextDay}`;


    document.getElementById(
        "nextReadingText"
    ).textContent =
        getReadingDescription(nextDay);


    const nextStatus =
        document.getElementById(
            "nextDayStatus"
        );


    if (isDayCompleted(nextDay)) {

        nextStatus.textContent =
            "Completado";

        nextStatus.classList.add(
            "completed"
        );

    } else {

        nextStatus.textContent =
            "Pendiente";

        nextStatus.classList.remove(
            "completed"
        );

    }

}


/* ============================================================
   SELECCIONAR DÍA
============================================================ */

function selectDay(dayNumber) {

    if (
        dayNumber < 1 ||
        dayNumber > TOTAL_DAYS
    ) {
        return;
    }

    selectedDay = dayNumber;

    saveData();

    renderDays();

    renderSelectedDay();

}


/* ============================================================
   RENDER PLAN
============================================================ */

function renderDays() {

    const container =
        document.getElementById(
            "daysGrid"
        );

    container.innerHTML = "";

    readingPlan.forEach(day => {

        const button =
            document.createElement("button");

        button.className =
            "day-button";

        button.textContent =
            day.day;

        if (day.day === selectedDay) {

            button.classList.add(
                "selected"
            );

        }

        if (
            isDayCompleted(day.day)
        ) {

            button.classList.add(
                "completed"
            );

        }

        button.title =
            getReadingDescription(day.day);

        button.addEventListener(
            "click",
            () => selectDay(day.day)
        );

        container.appendChild(button);

    });

}


/* ============================================================
   RENDER DÍA SELECCIONADO
============================================================ */

function renderSelectedDay() {

    const day =
        getDay(selectedDay);

    if (!day) {
        return;
    }

    const completed =
        isDayCompleted(selectedDay);


    document.getElementById(
        "selectedDayTitle"
    ).textContent =
        `Día ${selectedDay}`;


    document.getElementById(
        "selectedDayReading"
    ).textContent =
        getReadingDescription(selectedDay);


    const status =
        document.getElementById(
            "selectedDayStatus"
        );


    if (completed) {

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


    const list =
        document.getElementById(
            "chapterList"
        );

    list.innerHTML = "";


    day.chapters.forEach(id => {

        const chapter =
            getChapter(id);

        if (!chapter) {
            return;
        }


        const label =
            document.createElement("label");

        label.className =
            "chapter-item";


        if (chapter.read) {

            label.classList.add(
                "read"
            );

        }


        const checkbox =
            document.createElement("input");

        checkbox.type =
            "checkbox";

        checkbox.checked =
            chapter.read;


        const info =
            document.createElement("div");

        info.className =
            "chapter-item-info";


        const strong =
            document.createElement("strong");

        strong.textContent =
            `${chapter.book} ${chapter.chapter}`;


        const span =
            document.createElement("span");

        span.textContent =
            chapter.read
                ? "Leído"
                : "Pendiente";


        info.appendChild(strong);

        info.appendChild(span);


        label.appendChild(checkbox);

        label.appendChild(info);


        checkbox.addEventListener(
            "change",
            () => {

                chapter.read =
                    checkbox.checked;

                saveData();

                updateAll();

                renderSelectedDay();

                showToast(
                    chapter.read
                        ? "Capítulo marcado como leído"
                        : "Capítulo desmarcado",
                    chapter.read
                        ? "✓"
                        : "↶"
                );

            }
        );


        list.appendChild(label);

    });

}


/* ============================================================
   MARCAR DÍA COMPLETO
============================================================ */

function completeSelectedDay() {

    const day =
        getDay(selectedDay);

    if (!day) {
        return;
    }

    day.chapters.forEach(id => {

        const chapter =
            getChapter(id);

        if (chapter) {
            chapter.read = true;
        }

    });


    saveData();

    updateAll();

    renderSelectedDay();

    showToast(
        `Día ${selectedDay} completado`,
        "✓"
    );

}


/* ============================================================
   DESMARCAR DÍA
============================================================ */

function uncompleteSelectedDay() {

    const day =
        getDay(selectedDay);

    if (!day) {
        return;
    }

    day.chapters.forEach(id => {

        const chapter =
            getChapter(id);

        if (chapter) {
            chapter.read = false;
        }

    });


    saveData();

    updateAll();

    renderSelectedDay();

    showToast(
        `Día ${selectedDay} marcado como pendiente`,
        "↶"
    );

}


/* ============================================================
   LIBROS
============================================================ */

function renderBooks(search = "") {

    const container =
        document.getElementById(
            "booksGrid"
        );

    container.innerHTML = "";

    const normalizedSearch =
        search
            .toLowerCase()
            .trim();


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


            const article =
                document.createElement("article");

            article.className =
                "book-card";


            article.innerHTML = `

                <div class="book-top">

                    <span class="book-name">
                        ${book.name}
                    </span>

                    <span class="book-percentage">
                        ${percentage}%
                    </span>

                </div>

                <div class="book-progress">

                    <div
                        class="book-progress-fill"
                        style="width:${percentage}%">
                    </div>

                </div>

                <div class="book-bottom">

                    <span>
                        ${read} de ${book.chapters}
                    </span>

                    <span>
                        ${read === book.chapters
                            ? "✓ Terminado"
                            : "En progreso"}
                    </span>

                </div>

            `;


            container.appendChild(article);

        });

}


/* ============================================================
   ESTADÍSTICAS
============================================================ */

function renderStatistics() {

    const read =
        getReadCount();

    const percentage =
        getPercentage();

    const days =
        getCompletedDays();

    const remaining =
        TOTAL_CHAPTERS - read;

    const streak =
        getStreak();


    document.getElementById(
        "circlePercentage"
    ).textContent =
        `${percentage}%`;


    const circle =
        document.querySelector(
            ".circular-progress"
        );


    circle.style.background =
        `conic-gradient(
            var(--primary)
            ${percentage * 3.6}deg,
            var(--surface-2)
            ${percentage * 3.6}deg
        )`;


    document.getElementById(
        "statsRead"
    ).textContent =
        read;


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


    renderMonthlyProgress();

}


/* ============================================================
   PROGRESO MENSUAL
============================================================ */

function renderMonthlyProgress() {

    const container =
        document.getElementById(
            "monthlyProgress"
        );

    container.innerHTML = "";


    const months = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    months.forEach((month, index) => {

        const startDay =
            Math.floor(
                index * TOTAL_DAYS / 12
            ) + 1;


        const endDay =
            Math.floor(
                (index + 1) * TOTAL_DAYS / 12
            );


        let completed = 0;


        for (
            let day = startDay;
            day <= endDay;
            day++
        ) {

            if (isDayCompleted(day)) {
                completed++;
            }

        }


        const total =
            endDay - startDay + 1;


        const percentage =
            Math.round(
                (completed / total) * 100
            );


        const row =
            document.createElement("div");

        row.className =
            "month-row";


        row.innerHTML = `

            <span class="month-name">
                ${month}
            </span>

            <div class="month-bar">

                <div
                    class="month-fill"
                    style="width:${percentage}%">
                </div>

            </div>

            <span class="month-value">
                ${percentage}%
            </span>

        `;


        container.appendChild(row);

    });

}


/* ============================================================
   NAVEGACIÓN
============================================================ */

function navigate(sectionName) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList.remove(
                "active"
            );

        });


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const section =
        document.getElementById(
            `section-${sectionName}`
        );


    const nav =
        document.querySelector(
            `.nav-item[data-section="${sectionName}"]`
        );


    if (section) {

        section.classList.add(
            "active"
        );

    }


    if (nav) {

        nav.classList.add(
            "active"
        );

    }


    const titles = {

        inicio: "Inicio",

        plan: "Plan de lectura",

        libros: "Libros",

        estadisticas: "Estadísticas",

        datos: "Mis datos"

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[sectionName] || "Inicio";


    document
        .getElementById("sidebar")
        .classList.remove("open");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (sectionName === "libros") {

        renderBooks(
            document.getElementById(
                "bookSearch"
            ).value
        );

    }


    if (sectionName === "estadisticas") {

        renderStatistics();

    }

}


/* ============================================================
   TEMA
============================================================ */

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


    localStorage.setItem(
        THEME_KEY,

        document.body.classList.contains(
            "dark"
        )
            ? "dark"
            : "light"
    );


    updateThemeButton();

}


function updateThemeButton() {

    const dark =
        document.body.classList.contains(
            "dark"
        );


    document.getElementById(
        "themeIcon"
    ).textContent =
        dark ? "☀️" : "🌙";


    document.getElementById(
        "themeText"
    ).textContent =
        dark
            ? "Modo claro"
            : "Modo oscuro";

}


/* ============================================================
   FECHA
============================================================ */

function updateTodayBadge() {

    const now =
        new Date();

    const formatter =
        new Intl.DateTimeFormat(
            "es-NI",
            {
                day: "numeric",
                month: "short"
            }
        );


    document.getElementById(
        "todayBadge"
    ).textContent =
        formatter.format(now);

}


/* ============================================================
   EXPORTAR EXCEL
============================================================ */

function exportExcel() {

    if (
        typeof XLSX === "undefined"
    ) {

        showToast(
            "La biblioteca de Excel todavía no está disponible",
            "⚠️"
        );

        return;

    }


    const rows =
        chapters.map(chapter => ({

            "Libro":
                chapter.book,

            "Capítulo":
                chapter.chapter,

            "Leído":
                chapter.read
                    ? "Sí"
                    : "No"

        }));


    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Progreso"
    );


    const filename =
        "biblia-en-un-ano-progreso.xlsx";


    XLSX.writeFile(
        workbook,
        filename
    );


    showToast(
        "Progreso exportado a Excel",
        "📤"
    );

}


/* ============================================================
   IMPORTAR EXCEL
============================================================ */

function importExcel(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    if (
        typeof XLSX === "undefined"
    ) {

        showToast(
            "La biblioteca de Excel todavía no está disponible",
            "⚠️"
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

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


            let imported = 0;


            rows.forEach(row => {

                const book =
                    String(
                        row["Libro"] ??
                        row["libro"] ??
                        ""
                    ).trim();


                const chapterNumber =
                    Number(
                        row["Capítulo"] ??
                        row["Capitulo"] ??
                        row["capítulo"] ??
                        row["capitulo"]
                    );


                const readValue =
                    String(
                        row["Leído"] ??
                        row["Leido"] ??
                        row["leído"] ??
                        row["leido"] ??
                        ""
                    )
                        .trim()
                        .toLowerCase();


                const isRead =
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


                if (
                    !book ||
                    !Number.isInteger(
                        chapterNumber
                    )
                ) {
                    return;
                }


                const chapter =
                    chapters.find(
                        item =>
                            item.book === book &&
                            item.chapter ===
                                chapterNumber
                    );


                if (chapter) {

                    chapter.read =
                        isRead;

                    imported++;

                }

            });


            saveData();

            updateAll();

            renderSelectedDay();

            showToast(
                `${imported} registros importados`,
                "📥"
            );


        } catch (error) {

            console.error(error);

            showToast(
                "No se pudo importar el archivo",
                "⚠️"
            );

        }


        event.target.value = "";

    };


    reader.readAsArrayBuffer(
        file
    );

}


/* ============================================================
   REINICIAR
============================================================ */

function resetProgress() {

    const confirmation =
        confirm(
            "¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer."
        );


    if (!confirmation) {
        return;
    }


    chapters.forEach(
        chapter => {
            chapter.read = false;
        }
    );


    selectedDay = 1;

    saveData();

    updateAll();

    renderSelectedDay();

    showToast(
        "Tu progreso ha sido reiniciado",
        "↶"
    );

}


/* ============================================================
   TOAST
============================================================ */

let toastTimer = null;


function showToast(
    message,
    icon = "✓"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    document.getElementById(
        "toastIcon"
    ).textContent =
        icon;


    document.getElementById(
        "toastMessage"
    ).textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* ============================================================
   ACTUALIZAR TODO
============================================================ */

function updateAll() {

    updateDashboard();

    renderDays();

    renderBooks(
        document.getElementById(
            "bookSearch"
        ).value
    );

    renderStatistics();

}


/* ============================================================
   EVENTOS
============================================================ */

function setupEvents() {


    /* NAVEGACIÓN */

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


    /* CONTINUAR */

    document
        .getElementById(
            "continueButton"
        )
        .addEventListener(
            "click",
            () => {

                selectedDay =
                    getCurrentDayToContinue();

                navigate("plan");

                renderSelectedDay();

            }
        );


    document
        .getElementById(
            "continuePlanButton"
        )
        .addEventListener(
            "click",
            () => {

                selectedDay =
                    getCurrentDayToContinue();

                saveData();

                renderDays();

                renderSelectedDay();

            }
        );


    document
        .getElementById(
            "openNextDayButton"
        )
        .addEventListener(
            "click",
            () => {

                selectedDay =
                    getCurrentDayToContinue();

                saveData();

                navigate("plan");

                renderSelectedDay();

            }
        );


    /* DÍA COMPLETO */

    document
        .getElementById(
            "completeDayButton"
        )
        .addEventListener(
            "click",
            completeSelectedDay
        );


    /* DESMARCAR DÍA */

    document
        .getElementById(
            "uncompleteDayButton"
        )
        .addEventListener(
            "click",
            uncompleteSelectedDay
        );


    /* BÚSQUEDA */

    document
        .getElementById(
            "bookSearch"
        )
        .addEventListener(
            "input",
            event => {

                renderBooks(
                    event.target.value
                );

            }
        );


    /* TEMA */

    document
        .getElementById(
            "themeButton"
        )
        .addEventListener(
            "click",
            toggleTheme
        );


    /* MENÚ MÓVIL */

    document
        .getElementById(
            "menuButton"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "sidebar"
                    )
                    .classList.toggle(
                        "open"
                    );

            }
        );


    /* EXCEL */

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
            "importFile"
        )
        .addEventListener(
            "change",
            importExcel
        );


    /* RESET */

    document
        .getElementById(
            "resetButton"
        )
        .addEventListener(
            "click",
            resetProgress
        );

}


/* ============================================================
   INICIALIZACIÓN
============================================================ */

function init() {

    buildChapters();

    buildReadingPlan();

    loadData();

    loadTheme();

    updateTodayBadge();

    setupEvents();

    updateAll();

    /*
       Al iniciar, seleccionamos automáticamente
       el primer día que todavía no está completo.
    */

    selectedDay =
        getCurrentDayToContinue();

    saveData();

    renderDays();

    renderSelectedDay();

}


/* ============================================================
   INICIAR APP
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    init
);