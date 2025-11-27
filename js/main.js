document.addEventListener("DOMContentLoaded", function () {
    // ELEMENTOS

    const DOM = {
        dayText: document.getElementById("dayText"),
        hourTime: document.getElementById("hourTime"),
        cyclesDone: document.getElementById("cyclesDone"),
        cyclesLeft: document.getElementById("cyclesLeft"),
        cyclesDoneHour: document.getElementById("cyclesDoneHour"),
        cyclesLeftHour: document.getElementById("cyclesLeftHour"),
        hourSlider: document.getElementById("hourSlider"),
        hourOutput: document.getElementById("hourOutput"),
    };

    // ATRIBUIÇÕES

    const date = new Date();
    let MAX_CYCLES = 4;
    let START_HOUR = 8;
    let CYCLE_DURATION = 4;
    let hour = localStorage.getItem("wake")
        ? parseInt(localStorage.getItem("wake"), 10)
        : START_HOUR; // 8 ou LOCAL STORAGE
    const dateExtend = dateFormatted(date);
    let sliderHour = hour;
    let cyclesDone = hydrateHours(sliderHour, "done").length;
    let remainingCycles = hydrateHours(sliderHour, "left").length;
    let hydrateDone = hydrateHours(sliderHour, "done");
    let hydrateLeft = hydrateHours(sliderHour, "left");
    let minutes = date.getMinutes();
    const minutesHandler = String(minutes).padStart(2, "0");

    DOM.dayText.textContent = dateExtend;
    DOM.hourTime.textContent = `${date.getHours()}:${minutesHandler}`;
    DOM.cyclesDone.textContent = cyclesDone;
    DOM.cyclesLeft.textContent = remainingCycles;
    DOM.cyclesDoneHour.textContent =
        cyclesDone > 0
            ? hydrateDone.map((h) => formatTwoDigits(h)).join(", ")
            : "aguarde o horário";
    DOM.cyclesLeftHour.textContent =
        remainingCycles > 0
            ? hydrateLeft.map((h) => formatTwoDigits(h)).join(", ")
            : "diária completa";
    DOM.hourSlider.value = hour;
    DOM.hourOutput.textContent = formatTwoDigits(DOM.hourSlider.value);

    // HANDLERS

    DOM.hourSlider.oninput = function () {
        let sliderHour = parseInt(this.value, 10); // ← converter para número!
        cyclesDone = hydrateHours(sliderHour, "done").length;
        remainingCycles = hydrateHours(sliderHour, "left").length;
        hydrateDone = hydrateHours(sliderHour, "done");
        hydrateLeft = hydrateHours(sliderHour, "left");
        DOM.cyclesDone.textContent = cyclesDone;
        DOM.cyclesLeft.textContent = remainingCycles;
        DOM.cyclesDoneHour.textContent =
            cyclesDone > 0
                ? hydrateDone.map((h) => formatTwoDigits(h)).join(", ")
                : "aguarde o horário";
        DOM.cyclesLeftHour.textContent =
            remainingCycles > 0
                ? hydrateLeft.map((h) => formatTwoDigits(h)).join(", ")
                : "diária completa";
        DOM.hourOutput.textContent = formatTwoDigits(sliderHour);
        localStorage.setItem("wake", sliderHour);
    };

    // FUNÇÕES

    function dateFormatted(date = new Date()) {
        const days = [
            "domingo",
            "segunda-feira",
            "terça-feira",
            "quarta-feira",
            "quinta-feira",
            "sexta-feira",
            "sábado",
        ];

        const months = [
            "janeiro",
            "fevereiro",
            "março",
            "abril",
            "maio",
            "junho",
            "julho",
            "agosto",
            "setembro",
            "outubro",
            "novembro",
            "dezembro",
        ];

        const weekDay = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const monthDigit = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${weekDay} (${day}), ${month} (${monthDigit}) de ${year}`;
    }

    function hydrateHours(
        sliderHour,
        type,
        maxCycles = MAX_CYCLES,
        cycleDuration = CYCLE_DURATION
    ) {
        // Gera os horários: sliderHour, sliderHour+4, sliderHour+8, sliderHour+12 (<24)
        const allHours = [];
        for (let i = 0; i < maxCycles; i++) {
            const h = sliderHour + i * cycleDuration;
            if (h > 24) break;
            allHours.push(h);
        }

        const nowHour = new Date().getHours();

        if (type === "done") {
            return allHours.filter((h) => h <= nowHour);
        }
        if (type === "left") {
            return allHours.filter((h) => h > nowHour);
        }
        return allHours;
    }

    function formatTwoDigits(number) {
        const numberFix = String(number).padStart(2, "0");
        return `${numberFix}:00`;
    }
});
