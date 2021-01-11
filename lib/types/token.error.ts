export interface TokenError {
  correlation_id: string;
  error: string;
  error_codes: string;
  error_description: string;
  timestamp: string;
  trace_id: string;
}
