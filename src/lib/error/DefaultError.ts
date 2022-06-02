interface DefaultError {
  source: "network" | "client" | "server";
  errorCode?: string | number;
  displayMessage: string;
  additionalInfo?: unknown;
  status?: number;
  response?: Response;
}

export default DefaultError;
