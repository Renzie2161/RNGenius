# RNGenius

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A powerful simulation tool designed to calculate probabilities, rolls, prices, and time estimates based on user-defined inputs. Perfect for ~~gambling~~ gaming, statistical analysis, or any scenario requiring probabilistic simulations.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

---

## Features

- **Flexible Probability Input**:
  - Supports fractional (`1/10000`), percentage (`0.01%`), and decimal (`0.0001`) formats.
- **Detailed Output**:
  - Displays rolls, prices, and time for each attempt.
  - Calculates averages for rolls, prices, and time.
- **Export Results**:
  - Download results as a structured `results.txt` file.

---

## Installation

### Prerequisites

- A web browser (e.g., Chrome, Firefox, Edge).
- Basic knowledge of HTML, CSS, and JavaScript (optional, for customization).

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Renzie2161/RNGenius.git
   ```
2. Navigate to the project directory:
   ```bash
   cd RNGenius
   ```
3. Open the `index.html` file in your browser:

Alternatively, you can directly use the hosted version [here](https://www.example.com).

---

## Usage

1. **Input Parameters**:

   - Enter the probability, number of attempts, price per roll, and time per roll in the respective fields.
   - Example:
     - Probability: `0.01%`
     - Attempts: `100`
     - Price per roll: `50`
     - Time per roll: `1h15m25s`

2. **Run Simulation**:

   - Click the **Generate** button to start the simulation.
   - Watch the progress bar update in real-time.

3. **View Results**:

   - Results will appear in the terminal below the inputs.
   - Example:
     ```
     Attempt 1: Rolls=78912, Prices=11836800, Time=98640h0m0s
     Attempt 2: Rolls=92345, Prices=13851750, Time=115431h15m25s
     ```

4. **Export Results**:
   - Click the **Download** button to save the results as a `results.txt` file.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Font Awesome**: For providing icons used in the interface.
- **JetBrains Mono NL**: For the clean and professional terminal font.
- **SweetAlert2**: For user-friendly notifications.
