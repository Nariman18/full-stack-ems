import * as amplitude from "@amplitude/analytics-browser";

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

const isDevelopment = import.meta.env.MODE === "development";

export const initAmplitude = () => {
  if (!AMPLITUDE_API_KEY) {
    console.warn("Amplitude API key is missing. Tracking disabled.");
    return;
  }

  amplitude.init(AMPLITUDE_API_KEY, undefined, {
    defaultTracking: true,
  });

  console.log(
    `Amplitude initialized in ${
      isDevelopment ? "DEVELOPMENT" : "PRODUCTION"
    } mode with key: ${AMPLITUDE_API_KEY}`
  );
};

export const logEvent = (eventName: string, eventProperties?: object) => {
  if (!AMPLITUDE_API_KEY) {
    console.warn("Amplitude API key missing. Event not tracked:", eventName);
    return;
  }

  const properties = {
    environment: isDevelopment ? "development" : "production",
    ...eventProperties,
  };

  if (isDevelopment) {
    console.log("[Amplitude DEBUG] Sending event:", eventName, properties);
  }

  amplitude.track(eventName, properties);
};
