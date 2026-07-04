"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** Centro por defecto (Bogotá) usado cuando aún no hay coordenadas guardadas. */
const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];
const DEFAULT_ZOOM = 6;
const FOCUSED_ZOOM = 16;

/** Mensaje que Nominatim requiere en su `User-Agent`; lo mandamos como Accept-Language. */
const NOMINATIM_ACCEPT_LANGUAGE = "es";

export type StoreLocationChange =
  | { latitude: number; longitude: number }
  | { latitude: null; longitude: null };

export type StoreLocationPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onChange: (coords: StoreLocationChange) => void;
};

/**
 * Mapa interactivo con Leaflet + OpenStreetMap (sin API keys).
 * - Click en el mapa o arrastrar el marcador para fijar coordenadas.
 * - Buscar una dirección (geocoder Nominatim, sin API key).
 * - "Usar mi ubicación" vía navigator.geolocation.
 * - "Limpiar" para borrar la ubicación.
 *
 * Esta vista se monta vía `dynamic(..., { ssr: false })` desde el panel
 * porque Leaflet hace `window`/`document` al importarse.
 */
export function StoreLocationPicker({
  latitude,
  longitude,
  onChange,
}: StoreLocationPickerProps) {
  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const initialCenter = useMemo<[number, number]>(() => {
    return hasCoords ? [latitude as number, longitude as number] : DEFAULT_CENTER;
  }, [hasCoords, latitude, longitude]);

  const initialZoom = hasCoords ? FOCUSED_ZOOM : DEFAULT_ZOOM;

  // Centra el mapa cada vez que cambia el par lat/lng desde fuera
  // (p. ej. resultado de búsqueda o botón "Usar mi ubicación").
  const desiredCenter = useRef<[number, number] | null>(null);
  if (hasCoords) {
    desiredCenter.current = [latitude as number, longitude as number];
  }

  return (
    <div className="space-y-3">
      <SearchAndActions
        onPick={(lat, lng) => onChange({ latitude: lat, longitude: lng })}
        onUseMyLocation={(lat, lng) =>
          onChange({ latitude: lat, longitude: lng })
        }
        onClear={() => onChange({ latitude: null, longitude: null })}
      />
      <div className="overflow-hidden rounded-xl border border-brand-separator">
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          scrollWheelZoom
          className="h-[320px] w-full sm:h-[400px]"
          attributionControl
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <ClickToPlace onPick={(lat, lng) => onChange({ latitude: lat, longitude: lng })} />
          {hasCoords ? (
            <DraggableMarker
              position={[latitude as number, longitude as number]}
              onDragEnd={(lat, lng) => onChange({ latitude: lat, longitude: lng })}
            />
          ) : null}
          <FlyToOnPropChange target={desiredCenter.current} />
        </MapContainer>
      </div>
      <CoordsReadout latitude={latitude} longitude={longitude} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-componentes                                                     */
/* ------------------------------------------------------------------ */

function SearchAndActions({
  onPick,
  onUseMyLocation,
  onClear,
}: {
  onPick: (lat: number, lng: number) => void;
  onUseMyLocation: (lat: number, lng: number) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [lastResolved, setLastResolved] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce 600ms para no saturar Nominatim (rate limit 1 req/segundo).
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setError(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      void runNominatimSearch(trimmed, onPick, setError, setSearching)
        .then((label) => setLastResolved(label))
        .catch(() => setLastResolved(null));
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onPick]);

  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    setError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onUseMyLocation(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        setError("No pudimos obtener tu ubicación. Verifica los permisos.");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar dirección…"
          className="w-full rounded-xl border border-brand-input-border bg-brand-input px-3.5 py-2.5 pr-10 text-sm text-brand-primary outline-none transition placeholder:text-brand-tertiary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 dark:focus:border-brand-accent-soft dark:focus:ring-brand-accent-soft/25"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-tertiary">
          {searching ? <Spinner /> : <SearchIcon />}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-input-border bg-brand-surface px-3.5 py-2.5 text-sm font-medium text-brand-primary transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CrosshairIcon />
          {locating ? "Localizando…" : "Usar mi ubicación"}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-input-border bg-brand-surface px-3.5 py-2.5 text-sm font-medium text-brand-primary transition hover:bg-brand-hover"
        >
          <RotateCcwIcon />
          Limpiar
        </button>
      </div>
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
      {!error && lastResolved ? (
        <p className="text-xs text-brand-tertiary">
          Encontrado: <span className="font-medium text-brand-secondary">{lastResolved}</span>
        </p>
      ) : null}
    </div>
  );
}

function ClickToPlace({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      onPick(lat, lng);
    },
  });
  return null;
}

function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);
  return (
    <Marker
      position={position}
      draggable
      ref={(ref) => {
        markerRef.current = ref;
      }}
      eventHandlers={{
        dragend: () => {
          const m = markerRef.current;
          if (!m) return;
          const p = m.getLatLng();
          onDragEnd(p.lat, p.lng);
        },
      }}
    />
  );
}

function FlyToOnPropChange({
  target,
}: {
  target: [number, number] | null;
}) {
  const map = useMap();
  const lastTarget = useRef<[number, number] | null>(null);
  useEffect(() => {
    if (!target) return;
    const prev = lastTarget.current;
    if (
      !prev ||
      Math.abs(prev[0] - target[0]) > 0.0001 ||
      Math.abs(prev[1] - target[1]) > 0.0001
    ) {
      map.flyTo(target, FOCUSED_ZOOM, { duration: 0.8 });
      lastTarget.current = target;
    }
  }, [target, map]);
  return null;
}

function CoordsReadout({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const has =
    typeof latitude === "number" && typeof longitude === "number";
  const fmt = (n: number) =>
    n.toFixed(6) + "°";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-tertiary">
      <span>
        <strong className="font-medium text-brand-secondary">lat:</strong>{" "}
        {has ? fmt(latitude as number) : "—"}
      </span>
      <span>
        <strong className="font-medium text-brand-secondary">lng:</strong>{" "}
        {has ? fmt(longitude as number) : "—"}
      </span>
      {has ? (
        <a
          className="font-medium text-brand-accent hover:underline dark:text-brand-accent-soft"
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          Ver en Google Maps ↗
        </a>
      ) : (
        <span>Haz clic en el mapa para fijar la ubicación.</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function runNominatimSearch(
  q: string,
  onPick: (lat: number, lng: number) => void,
  setError: (msg: string | null) => void,
  setSearching: (busy: boolean) => void,
): Promise<string | null> {
  setError(null);
  setSearching(true);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { "Accept-Language": NOMINATIM_ACCEPT_LANGUAGE },
    });
    if (!res.ok) {
      throw new Error(`Nominatim ${res.status}`);
    }
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    if (data.length === 0) {
      setError("No encontramos la dirección. Intenta de nuevo o haz clic en el mapa.");
      return null;
    }
    const hit = data[0];
    onPick(Number(hit.lat), Number(hit.lon));
    return hit.display_name;
  } catch {
    setError("No pudimos buscar la dirección. Revisa tu conexión.");
    return null;
  } finally {
    setSearching(false);
  }
}

/* ------------------------------------------------------------------ */
/* Iconos inline (sin dependencias adicionales)                        */
/* ------------------------------------------------------------------ */

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RotateCcwIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 4v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-tertiary/40 border-t-brand-accent" aria-label="Buscando…" />
  );
}

/**
 * Workaround para el clásico bug de los iconos rotos de Leaflet con bundlers:
 * mergeamos las URLs por CDN (unpkg) en las opciones por defecto de L.Icon.
 */
let iconMerged = false;
function ensureLeafletDefaultIcon() {
  if (iconMerged) return;
  if (typeof window === "undefined") return;
  iconMerged = true;
  type IconDefaultProto = { _getIconUrl?: () => string };
  const proto = L.Icon.Default.prototype as unknown as IconDefaultProto;
  delete proto._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Llamar al cargar el módulo (sólo se ejecuta una vez).
ensureLeafletDefaultIcon();
