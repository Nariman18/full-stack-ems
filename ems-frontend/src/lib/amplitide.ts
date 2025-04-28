import * as amplitude from "@amplitude/analytics-browser";

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

const isDevelopment = import.meta.env.MODE === "development"; // Detect if local/dev

export const initAmplitude = () => {
  if (!AMPLITUDE_API_KEY) {
    console.warn("Amplitude API key is missing. Tracking disabled.");
    return;
  }

  amplitude.init(AMPLITUDE_API_KEY, undefined, {
    defaultTracking: true,
  });

  if (isDevelopment) {
    console.log("Amplitude initialized in DEVELOPMENT mode.");
  } else {
    console.log("Amplitude initialized in PRODUCTION mode.");
  }
};

export const logEvent = (eventName: string, eventProperties?: object) => {
  if (!AMPLITUDE_API_KEY) {
    console.warn("Amplitude API key missing. Event not tracked:", eventName);
    return;
  }

  const properties = {
    environment: isDevelopment ? "development" : "production", // Always attach environment
    ...eventProperties, // Merge custom properties
  };

  if (isDevelopment) {
    console.log("[Amplitude DEBUG] Sending event:", eventName, properties);
  }

  amplitude.track(eventName, properties);
};
