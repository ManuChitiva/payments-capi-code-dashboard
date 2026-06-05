"use client";

import type { RefObject } from "react";
import { formatCompactNumber } from "@/lib/dashboard/format";
import {
  analyticsInterestBarFill,
  analyticsInterestBarTrack,
  analyticsInterestRank,
  analyticsInterestRankTop,
  analyticsInterestRow,
  analyticsLoadMoreBtn,
  brandMetricHint,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";
import type { TopProductInterest } from "@/types/dashboard";

const PAGE_SIZE = 20;

type TopProductsInterestPanelProps = {
  items: TopProductInterest[];
  loading: boolean;
  last: boolean;
  totalElements: number;
  onLoadMore: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
};

function InterestRow({
  rank,
  item,
  maxCount,
}: {
  rank: number;
  item: TopProductInterest;
  maxCount: number;
}) {
  const label = item.productName?.trim() || `Producto #${item.productId}`;
  const widthPct =
    maxCount > 0 ? Math.max(6, Math.round((item.count / maxCount) * 100)) : 0;
  const isTopThree = rank <= 3;

  return (
    <li className={analyticsInterestRow}>
      <span
        className={isTopThree ? analyticsInterestRankTop : analyticsInterestRank}
        aria-hidden
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p
            className={`min-w-0 truncate text-sm font-medium leading-snug ${brandTextPrimary}`}
            title={label}
          >
            {label}
          </p>
          <p className="shrink-0 text-right">
            <span className={`text-sm font-semibold tabular-nums ${brandTextPrimary}`}>
              {formatCompactNumber(item.count)}
            </span>
            <span className={`ml-1 text-[11px] ${brandTextTertiary}`}>
              interacc.
            </span>
          </p>
        </div>
        <div className={`mt-2.5 ${analyticsInterestBarTrack}`}>
          <div
            className={analyticsInterestBarFill}
            style={{ width: `${widthPct}%` }}
            role="presentation"
          />
        </div>
      </div>
    </li>
  );
}

function InterestSkeleton() {
  return (
    <li
      className="flex animate-pulse items-center gap-3 rounded-2xl border border-brand-separator/50 bg-brand-hover/40 px-3 py-3 sm:px-4"
      aria-hidden
    >
      <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-separator/60" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex justify-between gap-2">
          <div className="h-3.5 w-[58%] rounded-md bg-brand-separator/60" />
          <div className="h-3.5 w-12 rounded-md bg-brand-separator/50" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-brand-separator/50" />
      </div>
    </li>
  );
}

export function TopProductsInterestPanel({
  items,
  loading,
  last,
  totalElements,
  onLoadMore,
  scrollRef,
  sentinelRef,
}: TopProductsInterestPanelProps) {
  const initialLoading = loading && items.length === 0;
  const loadingMore = loading && items.length > 0;
  const maxCount = items.reduce((max, item) => Math.max(max, item.count), 0);
  const shown = items.length;
  const hasMore = !last && shown > 0;

  return (
    <div className="flex min-h-0 flex-col">
      <div>
        <h3 className={`text-sm font-medium ${brandTextSecondary}`}>
          Productos con mayor interés
        </h3>
        <p className={brandMetricHint}>
          Ranking por interacciones en los últimos 30 días.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5 [-webkit-overflow-scrolling:touch]"
        style={{ maxHeight: "min(52vh, 420px)" }}
      >
        {initialLoading ? (
          <ul className="space-y-2" aria-busy="true" aria-label="Cargando ranking">
            {Array.from({ length: 5 }, (_, i) => (
              <InterestSkeleton key={i} />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-separator bg-brand-hover/40 px-6 py-12 text-center">
            <p className={`text-sm font-medium ${brandTextPrimary}`}>
              Sin interacciones aún
            </p>
            <p className={`mt-2 max-w-[16rem] text-xs leading-relaxed ${brandTextTertiary}`}>
              Cuando tus clientes vean o interactúen con productos, aparecerán aquí
              ordenados por interés.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Ranking de productos">
            {items.map((item, index) => (
              <InterestRow
                key={`${item.productId}-${index}`}
                rank={index + 1}
                item={item}
                maxCount={maxCount}
              />
            ))}
          </ul>
        )}

        {loadingMore ? (
          <ul className="mt-2 space-y-2" aria-hidden>
            <InterestSkeleton />
            <InterestSkeleton />
          </ul>
        ) : null}

        <div ref={sentinelRef} className="h-2 w-full shrink-0" aria-hidden />
      </div>

      {shown > 0 && !initialLoading ? (
        <footer className="mt-4 shrink-0 space-y-3 border-t border-brand-separator/80 pt-4">
          <p className={`text-center text-xs tabular-nums ${brandTextTertiary}`}>
            {totalElements > 0 ? (
              <>
                Mostrando{" "}
                <span className={`font-medium ${brandTextSecondary}`}>{shown}</span>
                {totalElements > shown ? (
                  <>
                    {" "}
                    de{" "}
                    <span className={`font-medium ${brandTextSecondary}`}>
                      {totalElements}
                    </span>
                  </>
                ) : null}{" "}
                productos
                {!last ? ` · ${PAGE_SIZE} por página` : null}
              </>
            ) : (
              <>
                <span className={`font-medium ${brandTextSecondary}`}>{shown}</span>{" "}
                en el ranking
              </>
            )}
          </p>
          {hasMore ? (
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => onLoadMore()}
              className={analyticsLoadMoreBtn}
            >
              {loadingMore ? "Cargando…" : "Cargar más productos"}
            </button>
          ) : (
            <p className={`text-center text-[11px] ${brandTextTertiary}`}>
              Has visto todos los productos con interacciones
            </p>
          )}
        </footer>
      ) : null}
    </div>
  );
}
