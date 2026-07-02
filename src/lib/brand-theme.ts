/** Clases semánticas — colores vía CSS variables (light / .dark en html). */

export const brandPageBg = "bg-brand-bg text-brand-primary";

export const brandPanelClass =
  "rounded-2xl border border-brand-separator/80 bg-brand-surface/90 p-4 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur sm:p-6 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_18px_-4px_rgba(0,0,0,0.55)]";

export const brandWordmarkClass =
  "font-(family-name:--font-brand-script) text-[1.75rem] leading-none font-medium italic tracking-[0.03em] text-brand-primary sm:text-[2rem]";

export const brandWordmarkSubClass =
  "mt-0.5 block text-[10px] font-normal tracking-[0.14em] text-brand-secondary not-italic";

export const brandCtaSm =
  "rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white shadow-[0_4px_14px_-2px_rgba(0,113,227,0.35),0_0_0_1px_rgba(0,113,227,0.25)] transition hover:bg-brand-accent-hover hover:shadow-[0_6px_18px_-2px_rgba(0,113,227,0.45),0_0_0_1px_rgba(0,113,227,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent dark:shadow-[0_4px_18px_-2px_rgba(41,151,255,0.55),0_0_0_1px_rgba(41,151,255,0.35)] dark:hover:shadow-[0_8px_24px_-2px_rgba(41,151,255,0.7),0_0_0_1px_rgba(41,151,255,0.5)]";

export const brandCtaMd =
  "rounded-full bg-brand-accent px-4 py-3.5 text-sm font-medium text-white shadow-[0_6px_20px_-4px_rgba(0,113,227,0.4),0_0_0_1px_rgba(0,113,227,0.25)] transition hover:bg-brand-accent-hover hover:shadow-[0_10px_28px_-4px_rgba(0,113,227,0.5),0_0_0_1px_rgba(0,113,227,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-[0_8px_28px_-4px_rgba(41,151,255,0.6),0_0_0_1px_rgba(41,151,255,0.35)] dark:hover:shadow-[0_12px_36px_-4px_rgba(41,151,255,0.75),0_0_0_1px_rgba(41,151,255,0.5)]";

export const brandInputClass =
  "w-full rounded-xl border border-brand-input-border bg-brand-input py-3.5 text-base text-brand-primary outline-none transition placeholder:text-brand-tertiary focus:border-brand-accent-soft focus:ring-1 focus:ring-brand-accent-soft/50 disabled:cursor-not-allowed disabled:opacity-60";

export const brandNavHeader =
  "sticky top-0 z-50 shrink-0 border-b border-brand-separator bg-brand-nav/80 backdrop-blur-2xl backdrop-saturate-150";

export const brandNavMobileMenu =
  "border-t border-brand-separator bg-brand-nav-solid px-5 py-4 md:hidden";

export const brandNavIconButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-separator bg-brand-surface text-brand-primary transition hover:bg-brand-hover";

export const brandLinkHover = "transition hover:text-brand-accent-soft";

export const brandEyebrow =
  "text-xs font-medium tracking-wide text-brand-secondary uppercase";

export const brandRadialAccent = "brand-radial-accent pointer-events-none absolute inset-0";

export const brandCardTopLine =
  "absolute top-0 right-0 left-0 h-px bg-brand-separator";

export const brandSurfaceCard =
  "rounded-2xl border border-brand-separator/80 bg-brand-surface shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,box-shadow,border-color] hover:border-brand-input-border hover:bg-brand-surface-hover hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.14)] dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_18px_-4px_rgba(0,0,0,0.55)] dark:hover:border-brand-accent-soft/20 dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_24px_-4px_rgba(0,0,0,0.7)]";

/** Cards de features en login — vidrio + sombra Apple (sin hover gris plano) */
export const brandLoginFeatureCard =
  "group rounded-2xl border border-brand-separator/80 bg-[var(--brand-surface-glass)] shadow-[var(--brand-shadow-card)] backdrop-blur-xl transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-px hover:border-brand-input-border hover:shadow-[var(--brand-shadow-card-hover)]";

export const brandLoginFeatureIcon =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-separator/70 bg-brand-surface text-brand-accent shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 group-hover:border-brand-accent/20 group-hover:shadow-[0_2px_8px_rgba(0,113,227,0.08)] dark:text-brand-accent-soft dark:group-hover:shadow-[0_2px_10px_rgba(41,151,255,0.12)]";

export const brandSurfaceElevated =
  "relative overflow-hidden rounded-2xl border border-brand-separator/80 bg-brand-surface shadow-[0_18px_44px_-12px_rgba(0,0,0,0.18),0_4px_14px_-4px_rgba(0,0,0,0.08)] dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_22px_56px_-14px_rgba(0,0,0,0.7),0_8px_24px_-8px_rgba(41,151,255,0.18)]";

export const brandIconAccent = "text-brand-accent-soft";

export const brandTextPrimary = "text-brand-primary";
export const brandTextSecondary = "text-brand-secondary";
export const brandTextTertiary = "text-brand-tertiary";

export const brandNavLinkClass =
  "rounded-full px-3 py-2 text-sm font-medium text-brand-secondary transition hover:bg-brand-hover hover:text-brand-primary";

export const brandGridOverlayClass =
  "brand-grid-overlay pointer-events-none absolute inset-0 opacity-[0.35]";

/** Rejilla más suave en páginas de marketing (menos aspecto “lavado” en claro) */
export const brandGridOverlaySoftClass =
  "brand-grid-overlay pointer-events-none absolute inset-0 opacity-[0.14] dark:opacity-[0.28]";

export const brandSecondaryButton =
  "rounded-xl border border-brand-input-border bg-brand-surface px-6 py-3.5 text-sm font-medium text-brand-primary shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.04)] transition hover:bg-brand-hover hover:shadow-[0_6px_18px_-4px_rgba(0,0,0,0.16)] dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_6px_20px_-6px_rgba(0,0,0,0.7)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_28px_-6px_rgba(0,0,0,0.85)]";

export const brandHeroTitle =
  "text-3xl leading-[1.12] font-semibold tracking-tight text-brand-primary sm:text-4xl sm:text-[2.35rem]";

export const brandLinkAccent =
  "font-medium text-brand-accent underline-offset-4 hover:text-brand-accent-hover hover:underline";

export const brandFormLabel = "font-medium text-brand-primary";
export const brandFormLabelHint = "font-normal text-brand-tertiary";

export const brandAlertError =
  "rounded-xl border border-rose-300 bg-rose-50 px-4 py-3.5 text-sm text-rose-800 dark:border-rose-500/40 dark:bg-rose-950/45 dark:text-rose-100";

export const brandPasswordToggle =
  "absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-3.5 py-2 text-sm font-medium text-brand-secondary transition hover:bg-brand-hover hover:text-brand-primary";

export const brandHighlightAccent = "font-medium text-brand-accent";

/** Mismo acento azul Apple en light y dark (no dorado/amber). */
export const brandHighlightPro = brandHighlightAccent;

export const brandFeatureList =
  "hidden space-y-3 border-l border-brand-separator pl-5 text-sm text-brand-secondary sm:block";

export const brandFeatureItem =
  "relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-accent";

export const brandFeatureItemMuted =
  "relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-tertiary/60 dark:before:bg-slate-500/80";

export const registerStepCurrent =
  "border-brand-accent/40 bg-brand-accent/10 text-brand-accent dark:border-brand-accent-soft/50 dark:bg-brand-accent/10 dark:text-brand-accent-soft";

export const registerStepDone =
  "border-brand-accent/25 bg-brand-accent/5 text-brand-accent dark:border-brand-accent-soft/30 dark:bg-brand-accent/8";

export const registerStepPending =
  "border-brand-separator bg-brand-surface-hover text-brand-tertiary";

export const registerStepTitleCurrent =
  "hidden max-w-22 truncate text-center text-[10px] font-medium tracking-wide text-brand-accent uppercase sm:block dark:text-brand-accent-soft";

export const registerStepTitleIdle =
  "hidden max-w-22 truncate text-center text-[10px] font-medium tracking-wide text-brand-tertiary uppercase sm:block";

export const registerPhaseMeta = "mt-4 text-sm text-brand-secondary";

export const registerPhaseTitle = "font-medium text-brand-primary";

export const registerConnectorDone = "bg-brand-accent/30";

export const registerConnectorPending = "bg-brand-separator";

export const registerProBanner =
  "mb-6 rounded-xl border border-brand-accent/20 bg-brand-accent/8 px-4 py-3 text-sm text-brand-accent dark:border-brand-accent-soft/30 dark:bg-brand-accent/12 dark:text-brand-accent-soft";

/** Dashboard */
export const brandSectionTitle =
  "font-(family-name:--font-rajdhani) text-2xl font-semibold tracking-tight text-brand-primary sm:text-[1.65rem]";

export const brandSectionDesc = "mt-1 max-w-2xl text-sm text-brand-secondary";

export const brandDashboardPanel =
  "rounded-2xl border border-brand-separator/80 bg-[var(--brand-surface-glass)] p-4 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_18px_48px_-12px_rgba(0,0,0,0.6),0_6px_20px_-6px_rgba(41,151,255,0.16)]";

export const brandInsetBox =
  "rounded-lg border border-brand-separator/70 bg-brand-hover px-3 py-2 text-xs text-brand-secondary shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-brand-separator dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)]";

export const brandChartArea =
  "mt-5 min-w-0 rounded-2xl border border-brand-separator/70 bg-brand-surface-hover p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_10px_-4px_rgba(0,0,0,0.1)] sm:p-4 dark:border-brand-separator dark:bg-white/[0.03] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_4px_18px_-6px_rgba(0,0,0,0.6)]";

export const brandListRow =
  "rounded-xl border border-brand-separator/70 bg-brand-hover px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-brand-separator dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)]";

export const brandModalOverlay =
  "fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4 dark:bg-black/70";

export const brandModalPanel =
  "max-h-[92dvh] w-full min-w-0 overflow-hidden rounded-t-2xl border border-brand-separator bg-brand-surface shadow-brand-elevated sm:rounded-2xl";

export const brandModalPanelMd =
  "max-h-[92dvh] w-full min-w-0 max-w-md overflow-x-hidden overflow-y-auto rounded-t-3xl border border-brand-separator bg-brand-surface shadow-brand-elevated sm:rounded-3xl";

export const brandModalPanelLg =
  "w-full max-w-2xl rounded-3xl border border-brand-separator bg-brand-surface shadow-brand-elevated";

export const brandModalHeader =
  "border-b border-brand-separator bg-brand-surface-hover px-6 py-5";

export const brandModalFooter =
  "flex justify-end gap-2 border-t border-brand-separator px-6 py-4";

export const brandModalTitle =
  "text-xl font-semibold tracking-tight text-brand-primary sm:text-2xl";

export const brandModalDesc = "mt-1 text-sm text-brand-secondary";

export const brandModalCancelBtn =
  "rounded-xl border border-brand-separator bg-brand-hover px-4 py-2 text-sm text-brand-primary transition hover:bg-brand-surface-hover disabled:opacity-50";

export const brandAlertSuccess =
  "mb-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 backdrop-blur dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200";

export const brandAlertErrorInline =
  "mb-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-800 backdrop-blur dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200";

export const brandActionButton =
  "rounded-xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-sm font-medium text-brand-accent transition hover:bg-brand-accent/15 disabled:cursor-not-allowed disabled:opacity-45 dark:border-brand-accent-soft/35 dark:text-brand-accent-soft";

export const brandActionButtonSolid =
  "rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-accent-hover disabled:cursor-not-allowed disabled:opacity-60";

export const brandTableTh =
  "px-3 py-2 text-left text-xs font-medium tracking-wide text-brand-secondary uppercase";

export const brandTableTd = "px-3 py-3 text-sm text-brand-primary";

export const brandChipOn =
  "inline-flex items-center gap-1 rounded-md border border-brand-separator bg-brand-hover px-2 py-1 text-brand-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-[background-color,box-shadow,border-color] dark:border-brand-separator dark:bg-white/[0.06] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.5)]";

export const brandChipOff =
  "inline-flex items-center gap-1 rounded-md border border-brand-separator bg-transparent px-2 py-1 text-brand-tertiary transition-[background-color,color,border-color] hover:border-brand-input-border hover:text-brand-primary dark:border-brand-separator";

export const brandMetricHint = "mt-2 text-sm text-brand-secondary";

export const brandCountAccent =
  "shrink-0 tabular-nums font-semibold text-brand-primary";

/** Filas de ranking en analítica (productos con mayor interés) */
export const analyticsInterestRow =
  "group flex items-center gap-3 rounded-2xl border border-brand-separator/70 bg-brand-surface/60 px-3 py-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.03)] transition-[background-color,box-shadow,border-color] hover:border-brand-input-border hover:bg-brand-hover hover:shadow-[0_6px_16px_-4px_rgba(0,0,0,0.14)] sm:gap-4 sm:px-4 dark:border-brand-separator dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_8px_-2px_rgba(0,0,0,0.5)] dark:hover:border-brand-accent-soft/25 dark:hover:bg-white/[0.06] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_16px_-2px_rgba(0,0,0,0.7)]";

export const analyticsInterestRank =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-separator bg-brand-surface text-sm font-semibold tabular-nums text-brand-tertiary shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:border-brand-separator dark:bg-white/[0.06] dark:shadow-[0_1px_2px_rgba(0,0,0,0.6)]";

export const analyticsInterestRankTop =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-accent/20 bg-brand-accent/8 text-sm font-semibold tabular-nums text-brand-accent shadow-[0_2px_8px_-2px_rgba(0,113,227,0.25)] dark:border-brand-accent-soft/30 dark:bg-brand-accent-soft/12 dark:text-brand-accent-soft dark:shadow-[0_2px_10px_-2px_rgba(41,151,255,0.4),0_0_0_1px_rgba(41,151,255,0.2)]";

export const analyticsInterestBarTrack =
  "h-1.5 w-full overflow-hidden rounded-full bg-brand-separator/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.06)] dark:bg-white/[0.08]";

export const analyticsInterestBarFill =
  "h-full rounded-full bg-brand-accent shadow-[0_0_8px_rgba(0,113,227,0.35)] transition-[width] duration-500 ease-out dark:bg-brand-accent-soft dark:shadow-[0_0_10px_rgba(41,151,255,0.55)]";

export const analyticsLoadMoreBtn =
  "w-full rounded-xl border border-brand-separator bg-brand-hover py-2.5 text-sm font-medium text-brand-accent shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] transition-[background-color,box-shadow,color] hover:bg-brand-surface-hover hover:text-brand-primary hover:shadow-[0_4px_14px_-4px_rgba(0,113,227,0.25)] disabled:cursor-not-allowed disabled:opacity-50 dark:border-brand-separator dark:text-brand-accent-soft dark:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_4px_14px_-4px_rgba(41,151,255,0.45)]";

/** Tarjetas KPI — vidrio Apple en claro; acento en badge solo en oscuro */
export const dashboardStatCardClass =
  "group relative overflow-hidden rounded-2xl border border-brand-separator/80 bg-[var(--brand-surface-glass)] px-4 py-3.5 shadow-[0_8px_22px_-8px_rgba(0,0,0,0.12),0_2px_6px_-2px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-input-border hover:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.18),0_4px_10px_-2px_rgba(0,0,0,0.08)] dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_10px_28px_-8px_rgba(0,0,0,0.6),0_4px_14px_-4px_rgba(41,151,255,0.16)] dark:hover:border-brand-accent-soft/25 dark:hover:shadow-[0_0_0_1px_rgba(41,151,255,0.2),0_18px_40px_-8px_rgba(0,0,0,0.75),0_6px_20px_-4px_rgba(41,151,255,0.3)]";

export const dashboardStatBadgeLight =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-separator/70 bg-brand-hover/70 text-brand-accent shadow-[0_2px_6px_-2px_rgba(0,113,227,0.25)] backdrop-blur-sm dark:border-brand-accent-soft/30 dark:bg-brand-accent/12 dark:text-brand-accent-soft dark:shadow-[0_2px_10px_-2px_rgba(41,151,255,0.45),0_0_0_1px_rgba(41,151,255,0.2)]";

export const dashboardFilterActive =
  "rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35)] dark:bg-brand-accent-soft dark:shadow-[0_2px_10px_-2px_rgba(41,151,255,0.5),0_0_0_1px_rgba(41,151,255,0.25)]";

export const dashboardFilterIdle =
  "rounded-lg px-3 py-1.5 text-xs font-medium text-brand-secondary transition-[background-color,color,box-shadow] hover:bg-brand-hover hover:text-brand-primary";

export const dashboardInputFocus =
  "focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25";

export const dashboardStatusBadge =
  "inline-flex items-center gap-1.5 rounded-full border border-brand-separator/70 bg-brand-hover px-2.5 py-0.5 text-xs font-medium text-brand-secondary shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:border-brand-separator dark:bg-white/[0.06] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.5)]";

export const dashboardNotice =
  "rounded-xl border border-brand-separator/70 bg-brand-hover px-3 py-2 text-xs text-brand-secondary shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)] dark:border-brand-separator dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_8px_-2px_rgba(0,0,0,0.5)]";

export const dashboardNoticeWarn =
  "rounded-xl border border-brand-separator bg-brand-hover px-3 py-2 text-xs text-brand-secondary shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)] dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-100/95 dark:shadow-[0_2px_10px_-2px_rgba(245,158,11,0.25)]";

export const brandStoreHero =
  "relative overflow-hidden rounded-2xl border border-brand-separator bg-linear-to-br from-brand-surface-hover via-brand-surface to-brand-bg shadow-brand-elevated";

export const subscriptionBannerBase =
  "border-brand-separator/80 bg-[var(--brand-surface-glass)] shadow-[0_14px_36px_-12px_rgba(0,0,0,0.16),0_3px_10px_-3px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_48px_-12px_rgba(0,0,0,0.65),0_6px_20px_-6px_rgba(41,151,255,0.22)]";

export const subscriptionBannerFree = subscriptionBannerBase;
export const subscriptionBannerPro = subscriptionBannerBase;
export const subscriptionBannerEnterprise = subscriptionBannerBase;

export const subscriptionEnterpriseCta = brandSecondaryButton;

export const planCardBase =
  "relative flex flex-col overflow-hidden rounded-3xl border p-8 sm:p-10";

export const planCardDefault = `${planCardBase} border-brand-input-border bg-brand-surface shadow-[0_18px_44px_-12px_rgba(0,0,0,0.16),0_4px_14px_-4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[0_24px_56px_-12px_rgba(0,0,0,0.22),0_6px_20px_-6px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_48px_-12px_rgba(0,0,0,0.7),0_8px_24px_-8px_rgba(41,151,255,0.18)] dark:ring-0 dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_24px_60px_-12px_rgba(0,0,0,0.85),0_10px_30px_-8px_rgba(41,151,255,0.28)]`;

/** Plan Pro — tinte azul marca (light) / acento soft (dark) */
export const planCardPro = `${planCardBase} border-[#9ec5f0] bg-linear-to-b from-[#e8f2fd] via-brand-surface to-brand-surface shadow-[0_22px_52px_-14px_rgba(0,113,227,0.32),0_6px_18px_-6px_rgba(0,113,227,0.15),0_1px_2px_rgba(0,113,227,0.08)] ring-1 ring-[#0071e3]/10 transition-shadow duration-300 hover:shadow-[0_30px_68px_-14px_rgba(0,113,227,0.4),0_8px_24px_-6px_rgba(0,113,227,0.2)] dark:border-[#2997ff]/35 dark:from-[#0071e3]/12 dark:to-brand-surface dark:shadow-[0_0_0_1px_rgba(41,151,255,0.25),0_22px_56px_-14px_rgba(0,0,0,0.75),0_10px_28px_-8px_rgba(41,151,255,0.4)] dark:ring-0 dark:hover:shadow-[0_0_0_1px_rgba(41,151,255,0.4),0_30px_72px_-14px_rgba(0,0,0,0.85),0_14px_36px_-8px_rgba(41,151,255,0.55)]`;

/** Plan Enterprise — índigo Apple, alineado con orbes de marca */
export const planCardEnterprise = `${planCardBase} border-[#b8b5e8] bg-linear-to-b from-[#ebe9fa] via-brand-surface to-brand-surface shadow-[0_22px_52px_-14px_rgba(94,92,230,0.28),0_6px_18px_-6px_rgba(94,92,230,0.14),0_1px_2px_rgba(94,92,230,0.08)] ring-1 ring-[#5e5ce6]/10 transition-shadow duration-300 hover:shadow-[0_30px_68px_-14px_rgba(94,92,230,0.36),0_8px_24px_-6px_rgba(94,92,230,0.18)] dark:border-[#5e5ce6]/35 dark:from-[#5e5ce6]/12 dark:to-brand-surface dark:shadow-[0_0_0_1px_rgba(94,92,230,0.28),0_22px_56px_-14px_rgba(0,0,0,0.75),0_10px_28px_-8px_rgba(94,92,230,0.45)] dark:ring-0 dark:hover:shadow-[0_0_0_1px_rgba(94,92,230,0.42),0_30px_72px_-14px_rgba(0,0,0,0.85),0_14px_36px_-8px_rgba(94,92,230,0.6)]`;

export const planBadgeFree =
  "border-[#0071e3]/25 bg-[#0071e3]/10 text-[#004a99] shadow-[0_2px_8px_-2px_rgba(0,113,227,0.25)] dark:border-[#2997ff]/35 dark:bg-[#2997ff]/15 dark:text-[#7ec8ff] dark:shadow-[0_2px_10px_-2px_rgba(41,151,255,0.45),0_0_0_1px_rgba(41,151,255,0.2)]";

export const planBadgePro =
  "border-[#005bb5] bg-[#0071e3] text-white shadow-sm dark:border-[#2997ff]/50 dark:bg-[#0071e3] dark:text-white dark:shadow-[0_2px_12px_-2px_rgba(41,151,255,0.55),0_0_0_1px_rgba(41,151,255,0.25)]";

export const planBadgeEnterprise =
  "border-[#4240a8] bg-[#5e5ce6] text-white shadow-sm dark:border-[#5e5ce6]/50 dark:bg-[#5e5ce6] dark:text-white dark:shadow-[0_2px_12px_-2px_rgba(94,92,230,0.55),0_0_0_1px_rgba(94,92,230,0.25)]";

export const planTaglineFree = "text-[#0071e3] font-medium dark:text-[#2997ff]";

export const planTaglinePro = "text-[#0071e3] font-medium dark:text-[#2997ff]";

export const planTaglineEnterprise = "text-[#4240a8] font-medium dark:text-[#a8a6f0]";

export const planCheckFree = "font-bold text-[#0071e3] dark:text-[#2997ff]";

export const planCheckPro = "font-bold text-[#0071e3] dark:text-[#2997ff]";

export const planCheckEnterprise = "font-bold text-[#5e5ce6] dark:text-[#a8a6f0]";

export const planMetaText = "text-brand-primary/80";

export const planBodyText = "text-[#48484a] dark:text-brand-secondary";

export const planFootnoteText = "text-[#48484a]/90 dark:text-brand-secondary/90";

export const planCtaPro = "bg-brand-accent text-white hover:bg-brand-accent-hover";

export const planCtaEnterprise =
  "border border-[#5e5ce6] bg-[#5e5ce6] font-semibold text-white hover:border-[#4e4cd6] hover:bg-[#4e4cd6] dark:border-[#5e5ce6]/60 dark:bg-[#5e5ce6]/90 dark:hover:bg-[#5e5ce6]";

export const planCtaDefault =
  "border border-brand-accent/35 bg-brand-surface font-semibold text-brand-accent hover:border-brand-accent/50 hover:bg-brand-accent/5";

/** CTA strip final en /plans — contenedor con depth Apple (gradient + orbes + grid + sombras) */
export const plansCtaStrip =
  "relative isolate overflow-hidden rounded-3xl border border-[#9ec5f0]/60 bg-linear-to-br from-[#f0f6ff] via-brand-surface to-brand-bg px-6 py-12 text-center shadow-[0_24px_64px_-16px_rgba(0,113,227,0.25),0_4px_14px_-4px_rgba(0,113,227,0.1),0_1px_2px_rgba(0,113,227,0.06)] ring-1 ring-[#0071e3]/10 sm:px-12 sm:py-16 dark:border-[#2997ff]/30 dark:from-[#0071e3]/15 dark:via-brand-surface dark:to-brand-surface dark:shadow-[0_0_0_1px_rgba(41,151,255,0.2),0_24px_64px_-16px_rgba(0,0,0,0.7),0_10px_28px_-8px_rgba(41,151,255,0.35)] dark:ring-0";

/** Eyebrow pill dentro del CTA strip */
export const plansCtaEyebrow =
  "inline-flex items-center gap-1.5 rounded-full border border-[#0071e3]/25 bg-[#0071e3]/8 px-3 py-1 text-[11px] font-medium tracking-wide text-[#004a99] uppercase shadow-[0_2px_8px_-2px_rgba(0,113,227,0.2)] dark:border-[#2997ff]/35 dark:bg-[#2997ff]/12 dark:text-[#7ec8ff] dark:shadow-[0_2px_10px_-2px_rgba(41,151,255,0.4),0_0_0_1px_rgba(41,151,255,0.2)]";

/** Fila de trust badges (3 items) */
export const plansCtaTrustRow =
  "mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#48484a] sm:text-sm dark:text-brand-secondary";

export const plansCtaTrustItem =
  "inline-flex items-center gap-1.5 font-medium text-brand-primary/90 dark:text-brand-secondary";

export const plansCtaTrustDot =
  "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0071e3]/12 text-[10px] font-bold text-[#0071e3] dark:bg-[#2997ff]/18 dark:text-[#2997ff]";

/** Dropzone en estado "subido" — borde sólido verde marca + glow suave */
export const brandAssetDropzoneLoaded =
  "border-2 border-emerald-400/70 bg-emerald-500/[0.06] shadow-[0_0_0_4px_rgba(16,185,129,0.07),0_8px_22px_-8px_rgba(16,185,129,0.28)] dark:border-emerald-400/50 dark:bg-emerald-500/[0.08] dark:shadow-[0_0_0_4px_rgba(16,185,129,0.08),0_10px_28px_-8px_rgba(16,185,129,0.35)]";

/** Dropzone en estado "vacío" — borde dashed marca */
export const brandAssetDropzoneIdle =
  "border-2 border-dashed border-brand-accent/35 bg-brand-input/30 hover:border-brand-accent/55 hover:bg-brand-surface-hover";

/** Icono circular grande con check verde (éxito de subida) */
export const brandAssetSuccessIcon =
  "flex items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/15 text-emerald-700 shadow-[0_4px_14px_-2px_rgba(16,185,129,0.35)] backdrop-blur-sm dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-200 dark:shadow-[0_4px_16px_-2px_rgba(16,185,129,0.45),0_0_0_1px_rgba(16,185,129,0.2)]";

/** Pill verde de confirmación "Subido" (esquina de preview) */
export const brandAssetReadyPill =
  "inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-800 uppercase shadow-[0_2px_8px_-2px_rgba(16,185,129,0.4)] backdrop-blur-sm dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-100 dark:shadow-[0_2px_10px_-2px_rgba(16,185,129,0.5),0_0_0_1px_rgba(16,185,129,0.2)]";

/** Botón "Quitar" pequeño en esquina del dropzone */
export const brandAssetRemoveBtn =
  "inline-flex items-center gap-1 rounded-full border border-brand-separator bg-brand-surface/95 px-2.5 py-1 text-[11px] font-medium text-brand-secondary shadow-sm backdrop-blur transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-brand-separator dark:bg-brand-surface/90 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-300";

/** Preview box cuando ya tiene imagen — borde sólido + glow verde sutil */
export const brandAssetPreviewLoaded =
  "border-2 border-emerald-400/50 shadow-[0_10px_28px_-10px_rgba(16,185,129,0.28),0_2px_8px_-2px_rgba(16,185,129,0.12)] dark:border-emerald-400/35 dark:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.6),0_4px_14px_-4px_rgba(16,185,129,0.35),0_0_0_1px_rgba(16,185,129,0.15)]";

export const plansHeroGlow =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(0,113,227,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(59,130,246,0.1),transparent_55%)]";
