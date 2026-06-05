"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";
import {
  productFormHasErrors,
  validateProductForm,
  type ProductFormErrors,
} from "@/lib/product-form-validation";
import type { ProductStatus } from "@/components/dashboard/products-table";
import type { CatalogProduct } from "@/components/dashboard/products-table";
import {
  listMyProducts,
  setMyProductActive,
  upsertMyProduct,
} from "@/services/productService";
import {
  toVariantUpsertPayload,
  variantRowFromApi,
} from "@/lib/product-variants";
import {
  createPayuPaymentMethod,
  deletePayuPaymentMethod,
  listPayuPaymentMethods,
  updatePayuPaymentMethod,
  type PayuPaymentMethodCreatePayload,
  type PayuPaymentMethodSummary,
  type PayuPaymentMethodUpdatePayload,
} from "@/services/payuPaymentMethodService";
import {
  getMyOrder,
  listMyOrders,
  type OrderDetail,
  type PagedOrdersResponse,
} from "@/services/orderService";
import {
  getMyPaymentsRevenueSummary,
  listMyPayuPayments,
  listMyPayments,
  type PagedPaymentsResponse,
  type PaymentRevenueSummary,
} from "@/services/storePaymentsService";
import {
  createPickup,
  deletePickup,
  listMyPickups,
  updatePickup,
  type PickupPoint,
} from "@/services/storePickupsService";
import { normalizeStorePrimaryColor } from "@/lib/brand-store-defaults";
import {
  createMyStore,
  fetchClientMe,
  validateActiveStore,
} from "@/services/storeService";
import type { DashboardSection } from "@/components/dashboard/dashboard-sidebar";
import {
  getMyStore,
  updateMyStore,
  type MyStoreFormPayload,
} from "@/services/storeSettingsService";
import { buildAuthFilters } from "@/lib/dashboard/auth-filters";
import { SECTION_META } from "@/lib/dashboard/constants";
import {
  loadAnalytics,
  loadTopProductsInterestPage,
} from "@/lib/dashboard/analytics-api";
import type {
  AnalyticsDashboard,
  ClientDetail,
  PayuFormState,
  StoreSummary,
  TopProductInterest,
} from "@/types/dashboard";

export function useDashboardPage() {
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [catalogStats, setCatalogStats] = useState<CatalogProduct[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | ProductStatus>(
    "todos",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"create" | "edit">(
    "create",
  );
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productFormErrors, setProductFormErrors] = useState<ProductFormErrors>(
    {},
  );
  const [productFormShowErrors, setProductFormShowErrors] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState("");
  const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState("");
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("resumen");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [storeSettingsForm, setStoreSettingsForm] =
    useState<MyStoreFormPayload>({
      name: "",
      label: "",
      phone: "",
      logoUrl: "",
      primaryColor: normalizeStorePrimaryColor(null),
      coverImageUrl: "",
      whatsapp: "",
      cellPhone: "",
      address: "",
    });
  const [pickupsList, setPickupsList] = useState<PickupPoint[]>([]);
  const [newPickupAddress, setNewPickupAddress] = useState("");
  const [newPickupActive, setNewPickupActive] = useState(true);
  const [editingPickupId, setEditingPickupId] = useState<number | null>(null);
  const [editPickupDraft, setEditPickupDraft] = useState({
    address: "",
    status: true,
  });
  const [pickupsLoading, setPickupsLoading] = useState(false);
  const [pickupActionLoading, setPickupActionLoading] = useState(false);
  const [myStoreLoading, setMyStoreLoading] = useState(false);
  const [myStoreSaving, setMyStoreSaving] = useState(false);
  const [uploadingStoreLogo, setUploadingStoreLogo] = useState(false);
  const [uploadingStoreCover, setUploadingStoreCover] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [payuMethods, setPayuMethods] = useState<PayuPaymentMethodSummary[]>(
    [],
  );
  const [payuModalOpen, setPayuModalOpen] = useState(false);
  const [payuModalMode, setPayuModalMode] = useState<"create" | "edit">(
    "create",
  );
  const [editingPayuId, setEditingPayuId] = useState<number | null>(null);
  const [payuSaving, setPayuSaving] = useState(false);
  const [payuLoading, setPayuLoading] = useState(false);
  const [payuForm, setPayuForm] = useState<PayuFormState>({
    name: "PayU",
    merchantId: "",
    accountId: "",
    apiKey: "",
    apiLogin: "",
    keyPublic: "",
    sandbox: true,
    active: true,
  });
  const [payuPaymentsData, setPayuPaymentsData] =
    useState<PagedPaymentsResponse | null>(null);
  const [revenueSummary, setRevenueSummary] =
    useState<PaymentRevenueSummary | null>(null);
  const [payuPaymentsLoading, setPayuPaymentsLoading] = useState(false);
  const [payuPaymentsPage, setPayuPaymentsPage] = useState(0);
  const [payuPaymentStatusDraft, setPayuPaymentStatusDraft] = useState("");
  const [payuPaymentStatusQuery, setPayuPaymentStatusQuery] = useState("");
  const [payuPaymentsListTick, setPayuPaymentsListTick] = useState(0);
  const [salesTab, setSalesTab] = useState<"pedidos" | "pagos">("pedidos");
  const [ordersData, setOrdersData] = useState<PagedOrdersResponse | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(0);
  const [orderStatusDraft, setOrderStatusDraft] = useState("");
  const [orderStatusQuery, setOrderStatusQuery] = useState("");
  const [ordersListTick, setOrdersListTick] = useState(0);
  const [salesPaymentsData, setSalesPaymentsData] =
    useState<PagedPaymentsResponse | null>(null);
  const [salesPaymentsLoading, setSalesPaymentsLoading] = useState(false);
  const [salesPaymentsPage, setSalesPaymentsPage] = useState(0);
  const [salesPaymentStatusDraft, setSalesPaymentStatusDraft] = useState("");
  const [salesPaymentStatusQuery, setSalesPaymentStatusQuery] = useState("");
  const [salesPaymentsListTick, setSalesPaymentsListTick] = useState(0);
  const [salesRevenueSummary, setSalesRevenueSummary] =
    useState<PaymentRevenueSummary | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [topInterestItems, setTopInterestItems] = useState<
    TopProductInterest[]
  >([]);
  const [topInterestLast, setTopInterestLast] = useState(true);
  const [topInterestTotal, setTopInterestTotal] = useState(0);
  const [topInterestLoading, setTopInterestLoading] = useState(false);
  const topInterestScrollRef = useRef<HTMLDivElement | null>(null);
  const topInterestSentinelRef = useRef<HTMLDivElement | null>(null);
  const topInterestPageRef = useRef(0);
  const topInterestLastRef = useRef(true);
  const topInterestLoadingMoreRef = useRef(false);
  const catalogFilterReady = useRef(false);
  const emptyProductForm = () => ({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    availableQuantity: "0",
    active: true,
    hasVariants: false,
    variants: [] as import("@/lib/product-variants").ProductVariantFormRow[],
  });

  const [newProduct, setNewProduct] = useState(emptyProductForm);
  const [newStoreModalOpen, setNewStoreModalOpen] = useState(false);
  const [creatingStore, setCreatingStore] = useState(false);
  const [newStoreForm, setNewStoreForm] = useState({
    storeName: "",
    storeLabel: "",
    storeSlug: "",
  });

  useEffect(() => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token) {
      router.replace("/");
      return;
    }

    fetch(`${API_URL}/clients/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("client_error");
        }
        const data = (await response.json()) as ClientDetail;
        setClient(data);

        const storedActiveStoreId = Number(
          window.localStorage.getItem("stores_admin_active_store_id"),
        );
        const activeStore =
          data.stores.find((store) => store.id === storedActiveStoreId) ??
          data.stores.find((store) => store.id === data.activeStoreId) ??
          data.stores[0];

        if (!activeStore) {
          setProducts([]);
          return;
        }

        window.localStorage.setItem(
          "stores_admin_active_store_id",
          String(activeStore.id),
        );
        const authFilters = buildAuthFilters(data, activeStore.id);
        const [
          listedProducts,
          allProducts,
          loadedAnalytics,
          loadedPayuMethods,
          loadedRevenue,
        ] = await Promise.all([
          listMyProducts(token, activeStore.id, statusFilter),
          listMyProducts(token, activeStore.id, "todos"),
          loadAnalytics(token, activeStore.slug),
          listPayuPaymentMethods(token, authFilters),
          getMyPaymentsRevenueSummary(token, authFilters),
        ]);
        setProducts(listedProducts);
        setCatalogStats(allProducts);
        setAnalytics(loadedAnalytics);
        setPayuMethods(loadedPayuMethods);
        setRevenueSummary(loadedRevenue);
      })
      .catch(() => {
        setError("No se pudo cargar el cliente. Inicia sesion nuevamente.");
        window.localStorage.removeItem("stores_admin_token");
        window.localStorage.removeItem("stores_admin_client");
        window.localStorage.removeItem("stores_admin_active_store_id");
        router.push("/");
      })
      .finally(() => setLoading(false));
    // Carga inicial de sesión; cambios de filtro de catálogo van en el efecto de refreshCatalog.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- statusFilter aplicado vía refreshCatalog al cambiar filtro
  }, [router]);

  const refreshCatalog = useCallback(
    async (
      token: string,
      storeId: number,
      filter: "todos" | ProductStatus = statusFilter,
    ) => {
      const [listed, all] = await Promise.all([
        listMyProducts(token, storeId, filter),
        listMyProducts(token, storeId, "todos"),
      ]);
      setProducts(listed);
      setCatalogStats(all);
    },
    [statusFilter],
  );

  const logout = () => {
    window.localStorage.removeItem("stores_admin_token");
    window.localStorage.removeItem("stores_admin_client");
    window.localStorage.removeItem("stores_admin_active_store_id");
    router.push("/");
  };

  const loadDataForStore = useCallback(
    async (token: string, clientData: ClientDetail, store: StoreSummary) => {
      const authFilters = buildAuthFilters(clientData, store.id);
      const [, loadedAnalytics, loadedPayuMethods, loadedRevenue] =
        await Promise.all([
          refreshCatalog(token, store.id, statusFilter),
          loadAnalytics(token, store.slug),
          listPayuPaymentMethods(token, authFilters),
          getMyPaymentsRevenueSummary(token, authFilters),
        ]);
      setAnalytics(loadedAnalytics);
      setPayuMethods(loadedPayuMethods);
      setRevenueSummary(loadedRevenue);
      setPayuPaymentsData(null);
      setPayuPaymentsPage(0);
      setTopInterestItems([]);
      topInterestPageRef.current = 0;
    },
    [refreshCatalog, statusFilter],
  );

  const handleStoreChange = async (storeId: number) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client) {
      return;
    }

    const selectedStore = client.stores.find((store) => store.id === storeId);
    if (!selectedStore) {
      return;
    }

    try {
      setError("");
      const activeId = await validateActiveStore(token, storeId);
      window.localStorage.setItem(
        "stores_admin_active_store_id",
        String(activeId),
      );
      const updatedClient = { ...client, activeStoreId: activeId };
      setClient(updatedClient);
      window.localStorage.setItem(
        "stores_admin_client",
        JSON.stringify(updatedClient),
      );
      await loadDataForStore(token, updatedClient, selectedStore);
    } catch {
      setError("No se pudo cambiar el negocio activo.");
    }
  };

  const handleCreateStore = async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client) {
      return;
    }
    if (!newStoreForm.storeName.trim()) {
      setError("Indica el nombre del negocio.");
      return;
    }

    setCreatingStore(true);
    setError("");
    try {
      const created = await createMyStore(token, {
        storeName: newStoreForm.storeName,
        storeLabel: newStoreForm.storeLabel,
        storeSlug: newStoreForm.storeSlug,
      });
      const me = await fetchClientMe(token);
      const activeId = await validateActiveStore(token, created.id);
      const updatedClient: ClientDetail = { ...me, activeStoreId: activeId };
      const selectedStore =
        me.stores.find((store) => store.id === created.id) ?? created;

      setClient(updatedClient);
      window.localStorage.setItem(
        "stores_admin_client",
        JSON.stringify(updatedClient),
      );
      window.localStorage.setItem(
        "stores_admin_active_store_id",
        String(activeId),
      );
      await loadDataForStore(token, updatedClient, selectedStore);
      setNewStoreModalOpen(false);
      setNewStoreForm({ storeName: "", storeLabel: "", storeSlug: "" });
      setActionMessage(`Negocio "${created.name}" creado y seleccionado.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear el negocio.",
      );
    } finally {
      setCreatingStore(false);
    }
  };

  const activeStore = useMemo(() => {
    if (!client) {
      return null;
    }
    return (
      client.stores.find((store) => store.id === client.activeStoreId) ??
      client.stores[0] ??
      null
    );
  }, [client]);

  useEffect(() => {
    if (!catalogFilterReady.current) {
      catalogFilterReady.current = true;
      return;
    }
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore || loading) {
      return;
    }
    void refreshCatalog(token, activeStore.id, statusFilter);
  }, [statusFilter, activeStore, refreshCatalog, loading]);

  const goToSection = useCallback((section: DashboardSection) => {
    setActiveSection(section);
    setMobileNavOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  const loadMyStoreSection = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      return;
    }
    setMyStoreLoading(true);
    try {
      const detail = await getMyStore(token, activeStore.id);
      setStoreSettingsForm({
        name: detail.name,
        label: detail.label ?? "",
        phone: detail.phone ?? "",
        logoUrl: detail.logoUrl ?? "",
        primaryColor: normalizeStorePrimaryColor(detail.primaryColor),
        coverImageUrl: detail.coverImageUrl ?? "",
        whatsapp: detail.whatsapp ?? "",
        cellPhone: detail.cellPhone ?? "",
        address: detail.address ?? "",
      });
    } catch {
      setError("No se pudo cargar la configuracion del negocio.");
    } finally {
      setMyStoreLoading(false);
    }
  }, [activeStore]);

  const loadPickups = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      return;
    }
    setPickupsLoading(true);
    try {
      const list = await listMyPickups(token, activeStore.id);
      setPickupsList(list);
    } catch {
      setError("No se pudieron cargar los puntos de atención.");
    } finally {
      setPickupsLoading(false);
    }
  }, [activeStore]);

  useEffect(() => {
    if (activeSection === "tienda" && activeStore) {
      void loadMyStoreSection();
      void loadPickups();
    }
  }, [activeSection, activeStore, loadMyStoreSection, loadPickups]);

  const handleSaveStoreSettings = async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore || !client) {
      return;
    }
    if (!storeSettingsForm.name.trim()) {
      setError("El nombre del negocio es obligatorio.");
      return;
    }
    setMyStoreSaving(true);
    setError("");
    try {
      await updateMyStore(token, activeStore.id, storeSettingsForm);
      setActionMessage("Negocio actualizado correctamente.");
      const meResponse = await fetch(`${API_URL}/clients/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meResponse.ok) {
        throw new Error("No se pudo refrescar el perfil.");
      }
      const data = (await meResponse.json()) as ClientDetail;
      setClient(data);
      window.localStorage.setItem("stores_admin_client", JSON.stringify(data));
      const nextStore =
        data.stores.find((s) => s.id === data.activeStoreId) ??
        data.stores.find((s) => s.id === activeStore.id) ??
        data.stores[0];
      if (nextStore) {
        const authFilters = buildAuthFilters(data, nextStore.id);
        await Promise.all([
          refreshCatalog(token, nextStore.id, statusFilter),
          loadAnalytics(token, nextStore.slug).then(setAnalytics),
        ]);
        void listPayuPaymentMethods(token, authFilters).then(setPayuMethods);
        void getMyPaymentsRevenueSummary(token, authFilters).then(
          setRevenueSummary,
        );
      }
      await loadMyStoreSection();
      await loadPickups();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo guardar el negocio.",
      );
    } finally {
      setMyStoreSaving(false);
    }
  };

  const handleAddPickup = async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      return;
    }
    if (!newPickupAddress.trim()) {
      setError("Indica la dirección del punto de atención.");
      return;
    }
    setPickupActionLoading(true);
    setError("");
    try {
      await createPickup(token, activeStore.id, {
        address: newPickupAddress.trim(),
        status: newPickupActive,
      });
      setNewPickupAddress("");
      setNewPickupActive(true);
      setActionMessage("Punto de atención creado.");
      await loadPickups();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el punto.");
    } finally {
      setPickupActionLoading(false);
    }
  };

  const handleSavePickupEdit = async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore || editingPickupId == null) {
      return;
    }
    if (!editPickupDraft.address.trim()) {
      setError("La dirección no puede estar vacía.");
      return;
    }
    setPickupActionLoading(true);
    setError("");
    try {
      await updatePickup(token, activeStore.id, editingPickupId, {
        address: editPickupDraft.address.trim(),
        status: editPickupDraft.status,
      });
      setEditingPickupId(null);
      setActionMessage("Punto actualizado.");
      await loadPickups();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo actualizar el punto.",
      );
    } finally {
      setPickupActionLoading(false);
    }
  };

  const handleDeletePickup = async (pickupId: number) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      return;
    }
    if (!window.confirm("¿Eliminar este punto de atención?")) {
      return;
    }
    setPickupActionLoading(true);
    setError("");
    try {
      await deletePickup(token, activeStore.id, pickupId);
      if (editingPickupId === pickupId) {
        setEditingPickupId(null);
      }
      setActionMessage("Punto eliminado.");
      await loadPickups();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo eliminar el punto.",
      );
    } finally {
      setPickupActionLoading(false);
    }
  };

  const handleTogglePickupStatus = async (p: PickupPoint) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      return;
    }
    setPickupActionLoading(true);
    setError("");
    try {
      await updatePickup(token, activeStore.id, p.id, {
        status: !p.status,
      });
      setActionMessage(!p.status ? "Punto activado." : "Punto desactivado.");
      await loadPickups();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo cambiar el estado.",
      );
    } finally {
      setPickupActionLoading(false);
    }
  };

  const hasActivePayuConfig = useMemo(
    () => payuMethods.some((method) => method.active),
    [payuMethods],
  );

  const loadTopInterestFromStart = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    const slug = activeStore?.slug;
    if (!token || !slug) return;
    if (topInterestLoadingMoreRef.current) return;
    topInterestLoadingMoreRef.current = true;
    setTopInterestLoading(true);
    try {
      const data = await loadTopProductsInterestPage(token, slug, 0, 20);
      setTopInterestItems(data.content);
      setTopInterestTotal(data.totalElements);
      topInterestPageRef.current = 0;
      setTopInterestLast(data.last);
      topInterestLastRef.current = data.last;
    } catch {
      setTopInterestItems([]);
      setTopInterestTotal(0);
      setTopInterestLast(true);
      topInterestLastRef.current = true;
    } finally {
      topInterestLoadingMoreRef.current = false;
      setTopInterestLoading(false);
    }
  }, [activeStore?.slug]);

  const appendTopInterestPage = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    const slug = activeStore?.slug;
    if (!token || !slug) return;
    if (topInterestLastRef.current || topInterestLoadingMoreRef.current) return;
    topInterestLoadingMoreRef.current = true;
    setTopInterestLoading(true);
    const nextPage = topInterestPageRef.current + 1;
    try {
      const data = await loadTopProductsInterestPage(token, slug, nextPage, 20);
      setTopInterestItems((prev) => [...prev, ...data.content]);
      setTopInterestTotal(data.totalElements);
      topInterestPageRef.current = nextPage;
      setTopInterestLast(data.last);
      topInterestLastRef.current = data.last;
    } catch {
      /* keep current list */
    } finally {
      topInterestLoadingMoreRef.current = false;
      setTopInterestLoading(false);
    }
  }, [activeStore?.slug]);

  useEffect(() => {
    if (!activeStore?.slug) {
      setTopInterestItems([]);
      setTopInterestTotal(0);
      setTopInterestLast(true);
      topInterestLastRef.current = true;
      topInterestPageRef.current = 0;
      return;
    }
    void loadTopInterestFromStart();
  }, [activeStore?.slug, loadTopInterestFromStart]);

  useEffect(() => {
    const root = topInterestScrollRef.current;
    const target = topInterestSentinelRef.current;
    if (!root || !target || !activeStore?.slug) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        void appendTopInterestPage();
      },
      { root, rootMargin: "80px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [activeStore?.slug, appendTopInterestPage, topInterestItems.length]);

  const resolvedProductImageUrl = (
    uploadedMediaUrl || newProduct.imageUrl
  ).trim();

  const refreshProductFormValidation = (
    values = newProduct,
    imageUrl = (uploadedMediaUrl || values.imageUrl).trim(),
  ) => {
    const errors = validateProductForm(values, imageUrl);
    setProductFormErrors(errors);
    return errors;
  };

  const handleSaveProduct = async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para crear productos.");
      return;
    }

    setProductFormShowErrors(true);
    const errors = refreshProductFormValidation();
    if (productFormHasErrors(errors)) {
      setError("Revisa los campos marcados antes de guardar.");
      return;
    }

    setSavingProduct(true);
    setError("");
    setActionMessage("");

    try {
      const isEditMode =
        productModalMode === "edit" && editingProductId !== null;
      const finalImageUrl = (uploadedMediaUrl || newProduct.imageUrl).trim();
      const basePrice = Number(newProduct.price);
      const variantsPayload = newProduct.hasVariants
        ? toVariantUpsertPayload(newProduct.variants, basePrice)
        : [];

      await upsertMyProduct(
        token,
        activeStore.id,
        {
          name: newProduct.name.trim(),
          description: newProduct.description.trim(),
          price: basePrice,
          imageUrl: finalImageUrl.length > 0 ? finalImageUrl : null,
          availableQuantity: newProduct.hasVariants
            ? 0
            : Number(newProduct.availableQuantity),
          active: newProduct.active,
          variants: variantsPayload,
        },
        isEditMode ? editingProductId! : undefined,
      );

      await Promise.all([
        refreshCatalog(token, activeStore.id, statusFilter),
        loadAnalytics(token, activeStore.slug).then(setAnalytics),
      ]);
      void loadTopInterestFromStart();
      setActionMessage(
        productModalMode === "edit"
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      );
      setNewProduct(emptyProductForm());
      setUploadingVariantId(null);
      setUploadedMediaUrl("");
      setProductFormErrors({});
      setProductFormShowErrors(false);
      setProductModalOpen(false);
      setEditingProductId(null);
    } catch {
      setError(
        productModalMode === "edit"
          ? "No se pudo actualizar el producto."
          : "No se pudo crear el producto.",
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const openCreateModal = () => {
    setProductModalMode("create");
    setEditingProductId(null);
    setNewProduct(emptyProductForm());
    setUploadingVariantId(null);
    setUploadedMediaUrl("");
    setProductFormErrors({});
    setProductFormShowErrors(false);
    setError("");
    setActionMessage("");
    setProductModalOpen(true);
  };

  const openEditModal = (product: CatalogProduct) => {
    setProductModalMode("edit");
    setEditingProductId(product.id);
    const hasVariants = product.hasVariants && product.variants.length > 0;
    setNewProduct({
      name: product.name,
      description: product.description,
      price: String(product.basePrice),
      imageUrl: product.imageUrl,
      availableQuantity: hasVariants ? "0" : String(product.stock),
      active: product.active,
      hasVariants,
      variants: hasVariants
        ? product.variants.map((v) => variantRowFromApi(v))
        : [],
    });
    setUploadingVariantId(null);
    setUploadedMediaUrl(product.imageUrl);
    setProductFormErrors({});
    setProductFormShowErrors(false);
    setError("");
    setActionMessage("");
    setProductModalOpen(true);
  };

  const handleToggleProductActive = async (
    productId: number,
    active: boolean,
  ) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para cambiar el estado del producto.");
      return;
    }

    try {
      await setMyProductActive(token, activeStore.id, productId, active);
      await Promise.all([
        refreshCatalog(token, activeStore.id, statusFilter),
        loadAnalytics(token, activeStore.slug).then(setAnalytics),
      ]);
      void loadTopInterestFromStart();
      setActionMessage(
        active
          ? "Producto activado correctamente."
          : "Producto desactivado correctamente.",
      );
      setError("");
    } catch {
      setError(
        active
          ? "No se pudo activar el producto."
          : "No se pudo desactivar el producto.",
      );
    }
  };

  const loadPayuMethods = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client || !activeStore) {
      setPayuMethods([]);
      return;
    }
    setPayuLoading(true);
    try {
      const data = await listPayuPaymentMethods(
        token,
        buildAuthFilters(client, activeStore.id),
      );
      setPayuMethods(data);
    } catch {
      setError("No se pudo cargar la configuracion de PayU.");
    } finally {
      setPayuLoading(false);
    }
  }, [activeStore, client]);

  const loadPayuRegisteredPayments = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client || !activeStore) {
      setPayuPaymentsData(null);
      return;
    }
    setPayuPaymentsLoading(true);
    try {
      const data = await listMyPayuPayments(token, {
        ...buildAuthFilters(client, activeStore.id),
        status: payuPaymentStatusQuery.trim() || undefined,
        page: payuPaymentsPage,
        size: 15,
      });
      setPayuPaymentsData(data);
    } catch {
      setError("No se pudo cargar el historial de pagos PayU.");
    } finally {
      setPayuPaymentsLoading(false);
    }
  }, [activeStore, client, payuPaymentStatusQuery, payuPaymentsPage]);

  useEffect(() => {
    if (activeSection !== "pagos" || !client || !activeStore) {
      return;
    }
    void loadPayuRegisteredPayments();
  }, [
    activeSection,
    client,
    activeStore,
    loadPayuRegisteredPayments,
    payuPaymentsListTick,
  ]);

  const loadSalesOrders = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client || !activeStore) {
      setOrdersData(null);
      return;
    }
    setOrdersLoading(true);
    try {
      const data = await listMyOrders(token, {
        ...buildAuthFilters(client, activeStore.id),
        status: orderStatusQuery.trim() || undefined,
        page: ordersPage,
        size: 15,
      });
      setOrdersData(data);
    } catch {
      setError("No se pudo cargar el listado de pedidos.");
    } finally {
      setOrdersLoading(false);
    }
  }, [activeStore, client, orderStatusQuery, ordersPage]);

  const loadSalesPayments = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client || !activeStore) {
      setSalesPaymentsData(null);
      return;
    }
    setSalesPaymentsLoading(true);
    try {
      const data = await listMyPayments(token, {
        ...buildAuthFilters(client, activeStore.id),
        status: salesPaymentStatusQuery.trim() || undefined,
        page: salesPaymentsPage,
        size: 15,
      });
      setSalesPaymentsData(data);
    } catch {
      setError("No se pudo cargar el historial de pagos.");
    } finally {
      setSalesPaymentsLoading(false);
    }
  }, [activeStore, client, salesPaymentStatusQuery, salesPaymentsPage]);

  const loadSalesRevenueSummary = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client || !activeStore) {
      setSalesRevenueSummary(null);
      return;
    }
    try {
      const data = await getMyPaymentsRevenueSummary(token, {
        ...buildAuthFilters(client, activeStore.id),
      });
      setSalesRevenueSummary(data);
    } catch {
      setSalesRevenueSummary(null);
    }
  }, [activeStore, client]);

  useEffect(() => {
    if (activeSection !== "pedidos" || !client || !activeStore) {
      return;
    }
    void loadSalesRevenueSummary();
    if (salesTab === "pedidos") {
      void loadSalesOrders();
    } else {
      void loadSalesPayments();
    }
  }, [
    activeSection,
    client,
    activeStore,
    salesTab,
    loadSalesRevenueSummary,
    loadSalesOrders,
    loadSalesPayments,
    ordersListTick,
    salesPaymentsListTick,
  ]);

  const openOrderDetail = useCallback(
    async (orderId: number) => {
      const token = window.localStorage.getItem("stores_admin_token");
      if (!token || !client || !activeStore) {
        return;
      }
      setOrderDetailOpen(true);
      setOrderDetail(null);
      setOrderDetailLoading(true);
      try {
        const detail = await getMyOrder(
          token,
          activeStore.id,
          orderId,
          buildAuthFilters(client, activeStore.id),
        );
        setOrderDetail(detail);
      } catch {
        setError("No se pudo cargar el detalle del pedido.");
        setOrderDetailOpen(false);
      } finally {
        setOrderDetailLoading(false);
      }
    },
    [activeStore, client],
  );

  const openCreatePayuModal = () => {
    if (hasActivePayuConfig) {
      return;
    }
    setPayuModalMode("create");
    setEditingPayuId(null);
    setPayuForm({
      name: "PayU",
      merchantId: "",
      accountId: "",
      apiKey: "",
      apiLogin: "",
      keyPublic: "",
      sandbox: true,
      active: true,
    });
    setError("");
    setActionMessage("");
    setPayuModalOpen(true);
  };

  const openEditPayuModal = (method: PayuPaymentMethodSummary) => {
    setPayuModalMode("edit");
    setEditingPayuId(method.id);
    setPayuForm({
      name: method.name,
      merchantId: method.merchantId,
      accountId: method.accountId,
      apiKey: "",
      apiLogin: "",
      keyPublic: "",
      sandbox: method.sandbox,
      active: method.active,
    });
    setError("");
    setActionMessage("");
    setPayuModalOpen(true);
  };

  const handleSavePayu = async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client || !activeStore) {
      setError("No hay sesion activa para configurar PayU.");
      return;
    }
    if (
      !payuForm.name.trim() ||
      !payuForm.merchantId.trim() ||
      !payuForm.accountId.trim()
    ) {
      setError("Nombre, Merchant ID y Account ID son obligatorios.");
      return;
    }

    if (payuModalMode === "create") {
      if (hasActivePayuConfig) {
        setError(
          "Ya existe una configuracion PayU activa. No se puede crear otra.",
        );
        return;
      }
      if (
        !payuForm.apiKey.trim() ||
        !payuForm.apiLogin.trim() ||
        !payuForm.keyPublic.trim()
      ) {
        setError(
          "API Key, API Login y llave publica son obligatorios al crear.",
        );
        return;
      }
    }

    const authFilters = buildAuthFilters(client, activeStore.id);
    setPayuSaving(true);
    setError("");
    setActionMessage("");
    try {
      if (payuModalMode === "edit" && editingPayuId !== null) {
        const updatePayload: PayuPaymentMethodUpdatePayload = {
          name: payuForm.name.trim(),
          merchantId: payuForm.merchantId.trim(),
          accountId: payuForm.accountId.trim(),
          sandbox: payuForm.sandbox,
          active: payuForm.active,
        };
        if (payuForm.apiKey.trim()) {
          updatePayload.apiKey = payuForm.apiKey.trim();
        }
        if (payuForm.apiLogin.trim()) {
          updatePayload.apiLogin = payuForm.apiLogin.trim();
        }
        if (payuForm.keyPublic.trim()) {
          updatePayload.keyPublic = payuForm.keyPublic.trim();
        }
        await updatePayuPaymentMethod(
          token,
          authFilters,
          editingPayuId,
          updatePayload,
        );
      } else {
        const createPayload: PayuPaymentMethodCreatePayload = {
          name: payuForm.name.trim(),
          merchantId: payuForm.merchantId.trim(),
          accountId: payuForm.accountId.trim(),
          apiKey: payuForm.apiKey.trim(),
          apiLogin: payuForm.apiLogin.trim(),
          keyPublic: payuForm.keyPublic.trim(),
          sandbox: payuForm.sandbox,
          active: payuForm.active,
        };
        await createPayuPaymentMethod(token, authFilters, createPayload);
      }
      await loadPayuMethods();
      if (activeSection === "pagos") {
        setPayuPaymentsListTick((t) => t + 1);
      }
      setPayuModalOpen(false);
      setEditingPayuId(null);
      setActionMessage(
        payuModalMode === "edit"
          ? "Configuracion PayU actualizada correctamente."
          : "Configuracion PayU creada correctamente.",
      );
    } catch {
      setError(
        payuModalMode === "edit"
          ? "No se pudo actualizar la configuracion de PayU."
          : "No se pudo crear la configuracion de PayU.",
      );
    } finally {
      setPayuSaving(false);
    }
  };

  const handleDeletePayu = async (paymentMethodId: number) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !client || !activeStore) {
      setError("No hay sesion activa para eliminar la configuracion de PayU.");
      return;
    }
    try {
      await deletePayuPaymentMethod(
        token,
        buildAuthFilters(client, activeStore.id),
        paymentMethodId,
      );
      await loadPayuMethods();
      if (activeSection === "pagos") {
        setPayuPaymentsListTick((t) => t + 1);
      }
      setActionMessage("Configuracion PayU eliminada correctamente.");
      setError("");
    } catch {
      setError("No se pudo eliminar la configuracion de PayU.");
    }
  };

  const handleStoreCoverUpload = async (file: File) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para subir archivos.");
      return;
    }
    setUploadingStoreCover(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_URL}/me/media/upload`, {
        method: "POST",
        headers: buildAuthRequestHeaders({
          token,
          storeId: activeStore.id,
          requireStore: true,
        }),
        body: formData,
      });
      if (!response.ok) {
        throw new Error("upload_store_cover_error");
      }
      const payload = (await response.json()) as { fileUrl: string };
      setStoreSettingsForm((prev) => ({
        ...prev,
        coverImageUrl: payload.fileUrl,
      }));
      setActionMessage(
        "Portada subida. Pulsa Guardar cambios para publicarla en el negocio.",
      );
    } catch {
      setError("No se pudo subir la foto de portada.");
    } finally {
      setUploadingStoreCover(false);
    }
  };

  const handleStoreLogoUpload = async (file: File) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para subir archivos.");
      return;
    }
    setUploadingStoreLogo(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_URL}/me/media/upload`, {
        method: "POST",
        headers: buildAuthRequestHeaders({
          token,
          storeId: activeStore.id,
          requireStore: true,
        }),
        body: formData,
      });
      if (!response.ok) {
        throw new Error("upload_store_logo_error");
      }
      const payload = (await response.json()) as { fileUrl: string };
      setStoreSettingsForm((prev) => ({ ...prev, logoUrl: payload.fileUrl }));
      setActionMessage(
        "Logo subido. Pulsa Guardar cambios para publicarlo en el negocio.",
      );
    } catch {
      setError("No se pudo subir el logo.");
    } finally {
      setUploadingStoreLogo(false);
    }
  };

  const handleVariantMediaUpload = async (localId: string, file: File) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para subir archivos.");
      return;
    }

    setUploadingVariantId(localId);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_URL}/me/media/upload`, {
        method: "POST",
        headers: buildAuthRequestHeaders({
          token,
          storeId: activeStore.id,
          requireStore: true,
        }),
        body: formData,
      });
      if (!response.ok) {
        throw new Error("upload_media_error");
      }
      const payload = (await response.json()) as { fileUrl: string };
      setNewProduct((prev) => {
        const next = {
          ...prev,
          variants: prev.variants.map((v) =>
            v.localId === localId ? { ...v, imageUrl: payload.fileUrl } : v,
          ),
        };
        if (productFormShowErrors) {
          setProductFormErrors(
            validateProductForm(
              next,
              (uploadedMediaUrl || next.imageUrl).trim(),
            ),
          );
        }
        return next;
      });
      setActionMessage("Imagen de variante subida.");
    } catch {
      setError("No se pudo subir la imagen de la variante.");
    } finally {
      setUploadingVariantId(null);
    }
  };

  const handleMediaUpload = async (file: File) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para subir archivos.");
      return;
    }

    setUploadingMedia(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/me/media/upload`, {
        method: "POST",
        headers: buildAuthRequestHeaders({
          token,
          storeId: activeStore.id,
          requireStore: true,
        }),
        body: formData,
      });
      if (!response.ok) {
        throw new Error("upload_media_error");
      }
      const payload = (await response.json()) as { fileUrl: string };
      setUploadedMediaUrl(payload.fileUrl);
      setNewProduct((prev) => {
        const next = { ...prev, imageUrl: payload.fileUrl };
        if (productFormShowErrors) {
          setProductFormErrors(validateProductForm(next, payload.fileUrl));
        }
        return next;
      });
      setActionMessage("Archivo subido correctamente.");
    } catch {
      setError("No se pudo subir el archivo multimedia.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const sectionMeta = SECTION_META[activeSection];

  return {
    loading,
    error,
    setError,
    actionMessage,
    setActionMessage,
    client,
    activeStore,
    activeSection,
    sectionMeta,
    mobileNavOpen,
    setMobileNavOpen,
    products,
    catalogStats,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    analytics,
    revenueSummary,
    topInterestItems,
    topInterestLoading,
    topInterestLast,
    topInterestTotal,
    topInterestScrollRef,
    topInterestSentinelRef,
    appendTopInterestPage,
    productModalOpen,
    setProductModalOpen,
    productModalMode,
    newProduct,
    setNewProduct,
    productFormErrors,
    setProductFormErrors,
    productFormShowErrors,
    setProductFormShowErrors,
    savingProduct,
    uploadingMedia,
    resolvedProductImageUrl,
    storeSettingsForm,
    setStoreSettingsForm,
    pickupsList,
    newPickupAddress,
    setNewPickupAddress,
    newPickupActive,
    setNewPickupActive,
    editingPickupId,
    setEditingPickupId,
    editPickupDraft,
    setEditPickupDraft,
    pickupsLoading,
    pickupActionLoading,
    myStoreLoading,
    myStoreSaving,
    uploadingStoreLogo,
    uploadingStoreCover,
    payuMethods,
    payuModalOpen,
    setPayuModalOpen,
    payuModalMode,
    payuSaving,
    payuLoading,
    payuForm,
    setPayuForm,
    payuPaymentsData,
    payuPaymentsLoading,
    payuPaymentsPage,
    setPayuPaymentsPage,
    payuPaymentStatusDraft,
    setPayuPaymentStatusDraft,
    payuPaymentStatusQuery,
    setPayuPaymentStatusQuery,
    payuPaymentsListTick,
    setPayuPaymentsListTick,
    salesTab,
    setSalesTab,
    ordersData,
    ordersLoading,
    ordersPage,
    setOrdersPage,
    orderStatusDraft,
    setOrderStatusDraft,
    orderStatusQuery,
    setOrderStatusQuery,
    ordersListTick,
    setOrdersListTick,
    salesPaymentsData,
    salesPaymentsLoading,
    salesPaymentsPage,
    setSalesPaymentsPage,
    salesPaymentStatusDraft,
    setSalesPaymentStatusDraft,
    salesPaymentStatusQuery,
    setSalesPaymentStatusQuery,
    salesPaymentsListTick,
    setSalesPaymentsListTick,
    salesRevenueSummary,
    orderDetailOpen,
    setOrderDetailOpen,
    orderDetailLoading,
    orderDetail,
    openOrderDetail,
    hasActivePayuConfig,
    newStoreModalOpen,
    setNewStoreModalOpen,
    creatingStore,
    newStoreForm,
    setNewStoreForm,
    logout,
    goToSection,
    handleStoreChange,
    handleCreateStore,
    handleSaveStoreSettings,
    handleAddPickup,
    handleSavePickupEdit,
    handleDeletePickup,
    handleTogglePickupStatus,
    handleSaveProduct,
    openCreateModal,
    openEditModal,
    handleToggleProductActive,
    openCreatePayuModal,
    openEditPayuModal,
    handleSavePayu,
    handleDeletePayu,
    handleStoreLogoUpload,
    handleStoreCoverUpload,
    handleMediaUpload,
    handleVariantMediaUpload,
    uploadingVariantId,
    refreshProductFormValidation,
  };
}
