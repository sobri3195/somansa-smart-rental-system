<?php
/**
 * Database Configuration and Connection Handler
 * Uses MySQLi for database operations
 */

class Database {
    private static $instance = null;
    private $connection;
    
    // Database credentials - should be moved to environment variables in production
    private $host;
    private $username;
    private $password;
    private $database;
    private $port;
    
    private function __construct() {
        // Load from environment variables or use defaults
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->username = getenv('DB_USERNAME') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
        $this->database = getenv('DB_DATABASE') ?: 'somansa_rental';
        $this->port = getenv('DB_PORT') ?: 3306;
        
        $this->connect();
    }
    
    private function connect() {
        $this->connection = new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->database,
            $this->port
        );
        
        if ($this->connection->connect_error) {
            error_log("Database connection failed: " . $this->connection->connect_error);
            throw new Exception("Database connection failed");
        }
        
        // Set charset to utf8mb4 for full Unicode support
        $this->connection->set_charset("utf8mb4");
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        // Check if connection is still alive
        if (!$this->connection->ping()) {
            $this->connect();
        }
        return $this->connection;
    }
    
    public function escapeString($string) {
        return $this->connection->real_escape_string($string);
    }
    
    public function beginTransaction() {
        return $this->connection->begin_transaction();
    }
    
    public function commit() {
        return $this->connection->commit();
    }
    
    public function rollback() {
        return $this->connection->rollback();
    }
    
    public function getLastInsertId() {
        return $this->connection->insert_id;
    }
    
    public function getAffectedRows() {
        return $this->connection->affected_rows;
    }
    
    // Prevent cloning of the instance
    private function __clone() {}
    
    // Prevent unserialization of the instance
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

// Helper function to get database connection
function getDB() {
    return Database::getInstance()->getConnection();
}
