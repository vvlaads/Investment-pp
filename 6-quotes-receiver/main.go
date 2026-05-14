package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	amqp "github.com/rabbitmq/amqp091-go"
)

// Quote represents a financial quote
type Quote struct {
	Symbol        string  `json:"symbol"`
	Bid           float64 `json:"bid"`
	Ask           float64 `json:"ask"`
	Spread        float64 `json:"spread"`
	Timestamp     int64   `json:"timestamp"`
	Volume        int64   `json:"volume"`
	ChangePercent float64 `json:"change_percent"`
}

// QuoteStore provides thread-safe in-memory storage for quotes
type QuoteStore struct {
	mu     sync.RWMutex
	quotes map[string]Quote
}

func NewQuoteStore() *QuoteStore {
	return &QuoteStore{
		quotes: make(map[string]Quote),
	}
}

func (s *QuoteStore) Update(quotes []Quote) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, q := range quotes {
		s.quotes[q.Symbol] = q
	}
}

func (s *QuoteStore) GetAll() []Quote {
	s.mu.RLock()
	defer s.mu.RUnlock()
	res := make([]Quote, 0, len(s.quotes))
	for _, q := range s.quotes {
		res = append(res, q)
	}
	return res
}

func (s *QuoteStore) GetBySymbol(symbol string) (Quote, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	q, ok := s.quotes[symbol]
	return q, ok
}

// DriverReader reads quotes from the Linux driver
type DriverReader struct {
	path     string
	interval time.Duration
	store    *QuoteStore
}

func NewDriverReader(path string, interval int, store *QuoteStore) *DriverReader {
	return &DriverReader{
		path:     path,
		interval: time.Duration(interval) * time.Millisecond,
		store:    store,
	}
}

func (dr *DriverReader) Start(ctx context.Context) {
	ticker := time.NewTicker(dr.interval)
	defer ticker.Stop()

	log.Printf("Starting driver reader: %s every %v", dr.path, dr.interval)

	for {
		select {
		case <-ctx.Done():
			log.Println("Driver reader stopping...")
			return
		case <-ticker.C:
			dr.read()
		}
	}
}

func (dr *DriverReader) read() {
	data, err := os.ReadFile(dr.path)
	if err != nil {
		log.Printf("Error reading driver %s: %v", dr.path, err)
		return
	}

	var quotes []Quote
	if err := json.Unmarshal(data, &quotes); err != nil {
		log.Printf("Error parsing JSON from driver: %v", err)
		return
	}

	dr.store.Update(quotes)
}

// RabbitMQReceiver reads quotes from RabbitMQ
type RabbitMQReceiver struct {
	connStr string
	queue   string
	store   *QuoteStore
}

func NewRabbitMQReceiver(connStr, queue string, store *QuoteStore) *RabbitMQReceiver {
	return &RabbitMQReceiver{
		connStr: connStr,
		queue:   queue,
		store:    store,
	}
}

func (r *RabbitMQReceiver) Start(ctx context.Context) {
	conn, err := amqp.Dial(r.connStr)
	if err != nil {
		log.Printf("Failed to connect to RabbitMQ: %v", err)
		return
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Printf("Failed to open a channel: %v", err)
		return
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		r.queue, // name
		true,    // durable
		false,   // delete until go-away
		false,   // exclusive
		false,   // no-dur
		nil,     // arguments
	)
	if err != nil {
		log.Printf("Failed to declare a queue: %v", err)
		return
	}

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Printf("Failed to register a consumer: %v", err)
		return
	}

	log.Printf("RabbitMQ receiver started, listening on queue: %s", r.queue)

	for {
		select {
		case <-ctx.Done():
			log.Println("RabbitMQ receiver stopping...")
			return
		case d := <-msgs:
			var quotes []Quote
			if err := json.Unmarshal(d.Body, &quotes); err != nil {
				log.Printf("Error parsing JSON from RabbitMQ: %v", err)
				continue
			}
			r.store.Update(quotes)
		}
	}
}

// Handlers
type Handler struct {
	store      *QuoteStore
	driverPath string
}

func (h *Handler) GetQuotes(w http.ResponseWriter, r *http.Request) {
	quotes := h.store.GetAll()
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(map[string][]Quote{"data": quotes})
}

func (h *Handler) GetQuoteBySymbol(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	symbol := vars["symbol"]

	quote, ok := h.store.GetBySymbol(symbol)
	if !ok {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "quote not found"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(quote)
}

func (h *Handler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	connected := true
	if _, err := os.Stat(h.driverPath); err != nil {
		connected = false
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":           "ok",
		"driver_connected": connected,
	})
}

func main() {
	port := flag.Int("port", 8080, "HTTP port")
	driverPath := flag.String("driver", "/dev/financial_quotes", "path to device")
	interval := flag.Int("interval", 100, "reading interval in ms")
	rabbitMQURL := flag.String("rabbitmq", "amqp://guest:guest@localhost:5672/", "RabbitMQ connection URL")
	queueName := flag.String("queue", "quotes-queue", "RabbitMQ queue name")
	flag.Parse()

	store := NewQuoteStore()
	reader := NewDriverReader(*driverPath, *interval, store)
	receiver := NewRabbitMQReceiver(*rabbitMQURL, *queueName, store)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go reader.Start(ctx)
	go receiver.Start(ctx)

	h := &Handler{
		store:      store,
		driverPath: *driverPath,
	}
	r := mux.NewRouter()

	// API v1
	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/quotes", h.GetQuotes).Methods("GET")
	api.HandleFunc("/quotes/{symbol}", h.GetQuoteBySymbol).Methods("GET")
	api.HandleFunc("/health", h.HealthCheck).Methods("GET")

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", *port),
		Handler: r,
	}

	go func() {
		log.Printf("Server starting on port %d", *port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	<-stop
	log.Println("Shutting down server...")

	cancel() // Stop driver reader and receiver

	ctxShutdown, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()

	if err := srv.Shutdown(ctxShutdown); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}
