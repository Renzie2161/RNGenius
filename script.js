document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.querySelector(".main-button");
  const clipboardButton = document.getElementById("clipboard");
  const downloadButton = document.getElementById("download");
  const progressBar = document.getElementById("progressBar");
  const terminal = document.getElementById("terminal");

  let averagePrices = 0;
  let pricePerRoll = 0;
  let averageTimeInSeconds = 0;
  let results = [];
  terminal.innerHTML += "Awaiting input...";

  generateButton.addEventListener("click", async () => {
    const probability = document.getElementById("probability").value;
    const attempts = parseInt(document.getElementById("attempts").value);
    pricePerRoll = parseFloat(document.getElementById("price").value);
    const maxRolls =
      parseInt(document.getElementById("maxRolls").value) || Infinity;
    const maxPrice =
      parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const timePerRollInput = document
      .getElementById("timePerRoll")
      .value.trim();

    let parsedProbability;
    let timePerRollInSeconds;

    try {
      parsedProbability = parseProbability(probability);
      timePerRollInSeconds = parseTimePerRoll(timePerRollInput);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: error.message,
      });
      return;
    }

    if (!probability || !attempts || !pricePerRoll) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields.",
      });
      return;
    }

    terminal.innerHTML = "";
    progressBar.style.width = "0%";

    results = [];
    let rolls = 0;
    let progress = 0;
    const startTime = performance.now();

    const simulateAttempt = () => {
      rolls++;
      const max_chance = Math.round(1 / parsedProbability);
      if (Math.floor(Math.random() * max_chance) + 1 === 1) {
        const successfulRolls = rolls;
        const estimatedPrices = successfulRolls * pricePerRoll;
        const estimatedTimeInSeconds = successfulRolls * timePerRollInSeconds;
        rolls = 0;
        return {
          rolls: successfulRolls,
          estimatedPrices: estimatedPrices,
          estimatedTimeInSeconds: estimatedTimeInSeconds,
        };
      }
      return null;
    };

    while (progress < attempts) {
      const result = simulateAttempt();

      if (result) {
        if (result.rolls <= maxRolls && result.estimatedPrices <= maxPrice) {
          results.push(result);
          terminal.innerHTML += `Attempt ${progress + 1}: Rolls=${
            result.rolls
          }, Prices=${result.estimatedPrices}, Time=${formatTime(
            result.estimatedTimeInSeconds
          )}<br>`;
        }

        progress++;
        progressBar.style.width = `${(progress / attempts) * 100}%`;

        if (progress % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    }

    averagePrices = calculateAveragePrices(results);
    averageTimeInSeconds = calculateAverageTime(results);

    terminal.innerHTML += `<br>Average Rolls: ${Math.round(
      averagePrices / pricePerRoll
    )}<br>`;
    terminal.innerHTML += `Average Price: ${Math.round(averagePrices)}<br>`;
    terminal.innerHTML += `Average Time: ${formatTime(
      averageTimeInSeconds
    )}<br>`;
    terminal.innerHTML += `Simulation completed in ${(
      (performance.now() - startTime) /
      1000
    ).toFixed(2)} seconds<br>`;

    Swal.fire({
      icon: "success",
      title: "Simulation Completed!",
      html: `Average Rolls: ${Math.round(
        averagePrices / pricePerRoll
      )}<br>Average Price: ${Math.round(
        averagePrices
      )}<br>Average Time: ${formatTime(
        averageTimeInSeconds
      )}<br>Simulation completed in ${(
        (performance.now() - startTime) /
        1000
      ).toFixed(2)} seconds`,
      confirmButtonText: "OK",
    });

    progressBar.style.width = "100%";
  });

  downloadButton.addEventListener("click", () => {
    if (results.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Results",
        text: "Run the simulation first to generate results.",
      });
      return;
    }

    let content = "";

    content += "========== Conclusion ==========\n";
    content += `Average Rolls: ${Math.round(averagePrices / pricePerRoll)}\n`;
    content += `Average Price: ${Math.round(averagePrices)}\n`;
    content += `Average Time: ${formatTime(averageTimeInSeconds)}\n\n`;

    results.forEach((result, index) => {
      content += `========== Attempt ${index + 1} ==========\n`;
      content += `Rolls: ${result.rolls}\n`;
      content += `Prices: ${result.estimatedPrices}\n`;
      content += `Time: ${formatTime(result.estimatedTimeInSeconds)}\n`;
      content += "================================\n\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "results.txt";
    a.click();

    URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "Downloaded!",
      text: "Results have been saved as results.txt.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  });

  function parseProbability(input) {
    let parsedValue;

    if (input.includes("/")) {
      const [numerator, denominator] = input.split("/").map(Number);
      if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        throw new Error(
          "Invalid fraction format. Use 'numerator/denominator'."
        );
      }
      parsedValue = numerator / denominator;
    } else if (input.includes("%")) {
      const percentage = parseFloat(input.replace("%", ""));
      if (isNaN(percentage)) {
        throw new Error(
          "Invalid percentage format. Use 'X%' where X is a number."
        );
      }
      parsedValue = percentage / 100;
    } else {
      const inputValue = parseFloat(input);
      if (isNaN(inputValue)) {
        throw new Error(
          "Invalid input format. Use a fraction, percentage, or decimal."
        );
      }

      if (inputValue > 1) {
        parsedValue = 1 / inputValue;
      } else {
        parsedValue = inputValue;
      }
    }

    if (parsedValue <= 0 || parsedValue > 1) {
      throw new Error(
        "Probability must be greater than 0 and less than or equal to 1."
      );
    }

    return parsedValue;
  }

  function parseTimePerRoll(input) {
    const timeRegex = /(?:(\d+)y)?(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
    const match = input.match(timeRegex);

    if (!match) {
      throw new Error(
        "Invalid time format. Use 'XyYdZhWmVs' (e.g., '1y2d3h4m5s')."
      );
    }

    const years = parseInt(match[1]) || 0;
    const days = parseInt(match[2]) || 0;
    const hours = parseInt(match[3]) || 0;
    const minutes = parseInt(match[4]) || 0;
    const seconds = parseInt(match[5]) || 0;

    return (
      years * 365 * 24 * 3600 +
      days * 24 * 3600 +
      hours * 3600 +
      minutes * 60 +
      seconds
    );
  }

  function formatTime(seconds) {
    const roundedSeconds = Math.round(seconds);

    const years = Math.floor(roundedSeconds / (365 * 24 * 3600));
    const remainingSecondsAfterYears = roundedSeconds % (365 * 24 * 3600);

    const days = Math.floor(remainingSecondsAfterYears / (24 * 3600));
    const remainingSecondsAfterDays = remainingSecondsAfterYears % (24 * 3600);

    const hours = Math.floor(remainingSecondsAfterDays / 3600);
    const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;

    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const remainingSeconds = remainingSecondsAfterHours % 60;

    return (
      `${years > 0 ? years + "y" : ""}${days > 0 ? days + "d" : ""}${
        hours > 0 ? hours + "h" : ""
      }${minutes > 0 ? minutes + "m" : ""}${
        remainingSeconds > 0 ? remainingSeconds + "s" : ""
      }`.trim() || "0s"
    );
  }

  function calculateAveragePrices(data) {
    if (data.length === 0) return 0;
    const totalPrices = data.reduce(
      (sum, result) => sum + result.estimatedPrices,
      0
    );
    return totalPrices / data.length;
  }

  function calculateAverageTime(data) {
    if (data.length === 0) return 0;
    const totalTime = data.reduce(
      (sum, result) => sum + result.estimatedTimeInSeconds,
      0
    );
    return totalTime / data.length;
  }
});
