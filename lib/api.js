// lib/api.js — Centralised API client for SAARALCARE AI

const BASE = "";  // Next.js proxies /api/* to the backend

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/** Send OTP to phone number */
export const sendOtp = (phone) =>
  request("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });

/** Verify OTP and return auth token */
export const verifyOtp = (phone, otp) =>
  request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone, otp }),
  });

// ── Onboarding ────────────────────────────────────────────────────────────────

/**
 * Submit worker registration details
 * @param {Object} data - { phone, name, vehicle, zone, aadhaar }
 */
export const registerWorker = (data) =>
  request("/workers/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ── Dashboard ─────────────────────────────────────────────────────────────────

/** Fetch current worker profile + coverage details */
export const getWorkerProfile = (workerId) =>
  request(`/workers/${workerId}/profile`);

/** Fetch worker's zone details */
export const getWorkerZone = (workerId) =>
  request(`/workers/${workerId}/zone`);

/** Fetch mapped rainfall station for worker's zone */
export const getRainfallStation = (workerId) =>
  request(`/workers/${workerId}/rainfall-station`);

/** Fetch weekly coverage summary */
export const getWeeklyCoverage = (workerId) =>
  request(`/workers/${workerId}/coverage/weekly`);

/** Fetch premium payment history */
export const getPremiumHistory = (workerId) =>
  request(`/workers/${workerId}/premiums`);

/** Fetch claim history */
export const getClaimHistory = (workerId) =>
  request(`/workers/${workerId}/claims`);

/** Submit a new claim */
export const submitClaim = (workerId, data) =>
  request(`/workers/${workerId}/claims`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// ── Rainfall Stations ─────────────────────────────────────────────────────────

/** Fetch all rainfall stations (for map) */
export const getRainfallStations = () =>
  request("/rainfall/stations");

/** Fetch rainfall readings for a specific station */
export const getStationReadings = (stationId, from, to) =>
  request(`/rainfall/stations/${stationId}/readings?from=${from}&to=${to}`);
