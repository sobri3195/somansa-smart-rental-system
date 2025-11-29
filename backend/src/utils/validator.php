<?php
/**
 * Input Validation Helper
 */

class Validator {
    
    private $errors = [];
    private $data;
    
    public function __construct($data) {
        $this->data = $data;
    }
    
    public function required($field, $message = null) {
        if (!isset($this->data[$field]) || trim($this->data[$field]) === '') {
            $this->errors[$field] = $message ?: "$field is required";
        }
        return $this;
    }
    
    public function email($field, $message = null) {
        if (isset($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = $message ?: "$field must be a valid email";
        }
        return $this;
    }
    
    public function min($field, $min, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $min) {
            $this->errors[$field] = $message ?: "$field must be at least $min characters";
        }
        return $this;
    }
    
    public function max($field, $max, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) > $max) {
            $this->errors[$field] = $message ?: "$field must not exceed $max characters";
        }
        return $this;
    }
    
    public function numeric($field, $message = null) {
        if (isset($this->data[$field]) && !is_numeric($this->data[$field])) {
            $this->errors[$field] = $message ?: "$field must be numeric";
        }
        return $this;
    }
    
    public function in($field, $values, $message = null) {
        if (isset($this->data[$field]) && !in_array($this->data[$field], $values)) {
            $this->errors[$field] = $message ?: "$field must be one of: " . implode(', ', $values);
        }
        return $this;
    }
    
    public function date($field, $message = null) {
        if (isset($this->data[$field])) {
            $d = DateTime::createFromFormat('Y-m-d', $this->data[$field]);
            if (!$d || $d->format('Y-m-d') !== $this->data[$field]) {
                $this->errors[$field] = $message ?: "$field must be a valid date (Y-m-d)";
            }
        }
        return $this;
    }
    
    public function datetime($field, $message = null) {
        if (isset($this->data[$field])) {
            $d = DateTime::createFromFormat('Y-m-d H:i:s', $this->data[$field]);
            if (!$d || $d->format('Y-m-d H:i:s') !== $this->data[$field]) {
                $this->errors[$field] = $message ?: "$field must be a valid datetime (Y-m-d H:i:s)";
            }
        }
        return $this;
    }
    
    public function phone($field, $message = null) {
        if (isset($this->data[$field])) {
            $phone = preg_replace('/[^0-9+]/', '', $this->data[$field]);
            if (strlen($phone) < 10 || strlen($phone) > 15) {
                $this->errors[$field] = $message ?: "$field must be a valid phone number";
            }
        }
        return $this;
    }
    
    public function custom($field, $callback, $message = null) {
        if (isset($this->data[$field]) && !$callback($this->data[$field])) {
            $this->errors[$field] = $message ?: "$field is invalid";
        }
        return $this;
    }
    
    public function fails() {
        return !empty($this->errors);
    }
    
    public function passes() {
        return empty($this->errors);
    }
    
    public function errors() {
        return $this->errors;
    }
    
    public static function make($data) {
        return new self($data);
    }
}
