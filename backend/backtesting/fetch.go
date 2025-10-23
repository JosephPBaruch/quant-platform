package backtesting

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

func fetchDataToCSV(ticker, startDate, endDate, frequency string) (fileName string, err error) {
	// Make the request to Tiingo (daily prices API)
	TIINGO_TOKEN := "TIINGO_TOKEN"

	// Load variables from .env
	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	apiToken := os.Getenv(TIINGO_TOKEN)
	if apiToken == "" {
		return "", fmt.Errorf("failed to get env %s", TIINGO_TOKEN)
	}

	// Build the full URL
	url := TIINGO_BASEPATH + ticker +
		"/prices?startDate=" + startDate +
		"&endDate=" + endDate +
		"&format=csv&resampleFreq=" + frequency

	// Create HTTP client & request
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("creating request: %w", err)
	}

	// Add Tiingo token
	req.Header.Set("Authorization", "Token "+apiToken)

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("tiingo API error: %s\n%s", resp.Status, string(body))
	}

	// Create the output filename (e.g. AAPL_2024-01-01_2024-12-31.csv)
	filename := fmt.Sprintf("%s_%s_%s_%s.csv", ticker, startDate, endDate, frequency)
	outputPath := filepath.Join(".", filename)

	// Create the file
	file, err := os.Create(outputPath)
	if err != nil {
		return "", fmt.Errorf("creating file: %w", err)
	}
	defer file.Close()

	// Stream response body to file
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return "", fmt.Errorf("writing to file: %w", err)
	}

	return outputPath, nil
}
