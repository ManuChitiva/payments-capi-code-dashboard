"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createPayuPaymentMethod,
  deletePayuPaymentMethod,
  listPayuPaymentMethods,
  type AuthFilters,
  type PayuPaymentMethodSummary,
  type PayuPaymentMethodCreatePayload,
  type PayuPaymentMethodUpdatePayload,
  updatePayuPaymentMethod,
} from "@/services/payuPaymentMethodService";
import {
  getMyPaymentsRevenueSummary,
  listMyPayuPayments,
  type PagedPaymentsResponse,
  type PaymentRevenueSummary,
} from "@/services/storePaymentsService";

const API_URL = "/api";

type ProductStatus = "activo" | "borrador" | "agotado";

type Product = {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  status: ProductStatus;
  active: boolean;
  updatedAt: string;
};

type StoreSummary = {
  id: number;
  name: string;
  slug: string;
  label: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
};

type ClientDetail = {
  id: number;
  name: string;
  email: string;
  activeStoreId: number | null;
  stores: StoreSummary[];
};

type TopProductInterest = {
  productId: number;
  productName: string | null;
  count: number;
};

type TopProductsInterestPage = {
  content: TopProductInterest[];
  last: boolean;
  number: number;
  size: number;
  totalElements: number;
};

type AnalyticsDashboard = {
  slug: string;
  totalEvents: number;
  productViews: number;
  productClicks: number;
  addToCart: number;
  purchaseIntents: number;
  dailyMetrics: Array<{
    date: string;
    eventType:
      | "PRODUCT_VIEW"
      | "PRODUCT_CLICK"
      | "ADD_TO_CART"
      | "PURCHASE_INTENT";
    count: number;
  }>;
  topProducts: Array<{
    productId: number;
    productName?: string | null;
    count: number;
  }>;
};

type DashboardSection = "resumen" | "productos" | "pagos";

type PayuFormState = {
  name: string;
  merchantId: string;
  accountId: string;
  apiKey: string;
  apiLogin: string;
  keyPublic: string;
  sandbox: boolean;
  active: boolean;
};

const statusStyles: Record<ProductStatus, string> = {
  activo: "bg-emerald-400/20 text-emerald-200 border-emerald-400/40",
  borrador: "bg-amber-400/20 text-amber-200 border-amber-400/40",
  agotado: "bg-rose-400/20 text-rose-200 border-rose-400/40",
};

export default function DashboardPage() {
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("resumen");
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
  const [topInterestItems, setTopInterestItems] = useState<
    TopProductInterest[]
  >([]);
  const [topInterestLast, setTopInterestLast] = useState(true);
  const [topInterestLoading, setTopInterestLoading] = useState(false);
  const topInterestScrollRef = useRef<HTMLDivElement | null>(null);
  const topInterestSentinelRef = useRef<HTMLDivElement | null>(null);
  const topInterestPageRef = useRef(0);
  const topInterestLastRef = useRef(true);
  const topInterestLoadingMoreRef = useRef(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    availableQuantity: "0",
    active: true,
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
          loadedProducts,
          loadedAnalytics,
          loadedPayuMethods,
          loadedRevenue,
        ] = await Promise.all([
          loadProducts(token, activeStore.slug),
          loadAnalytics(token, activeStore.slug),
          listPayuPaymentMethods(token, authFilters),
          getMyPaymentsRevenueSummary(token, authFilters),
        ]);
        setProducts(loadedProducts);
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
  }, [router]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "todos" ? true : product.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const logout = () => {
    window.localStorage.removeItem("stores_admin_token");
    window.localStorage.removeItem("stores_admin_client");
    window.localStorage.removeItem("stores_admin_active_store_id");
    router.push("/");
  };

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
      const response = await fetch(`${API_URL}/clients/me/active-store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId }),
      });
      if (!response.ok) {
        throw new Error("store_switch_error");
      }
      const data = (await response.json()) as {
        token: string;
        activeStoreId: number;
      };
      window.localStorage.setItem("stores_admin_token", data.token);
      window.localStorage.setItem(
        "stores_admin_active_store_id",
        String(data.activeStoreId),
      );
      const authFilters = buildAuthFilters(client, selectedStore.id);
      const [
        loadedProducts,
        loadedAnalytics,
        loadedPayuMethods,
        loadedRevenue,
      ] = await Promise.all([
        loadProducts(data.token, selectedStore.slug),
        loadAnalytics(data.token, selectedStore.slug),
        listPayuPaymentMethods(data.token, authFilters),
        getMyPaymentsRevenueSummary(data.token, authFilters),
      ]);
      setProducts(loadedProducts);
      setAnalytics(loadedAnalytics);
      setPayuMethods(loadedPayuMethods);
      setRevenueSummary(loadedRevenue);
      setClient((prev) =>
        prev ? { ...prev, activeStoreId: data.activeStoreId } : prev,
      );
    } catch {
      setError("No se pudo cambiar la store activa.");
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
      topInterestPageRef.current = 0;
      setTopInterestLast(data.last);
      topInterestLastRef.current = data.last;
    } catch {
      setTopInterestItems([]);
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

  const handleSaveProduct = async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para crear productos.");
      return;
    }

    if (!newProduct.name.trim() || Number(newProduct.price) <= 0) {
      setError("Nombre y precio son obligatorios para crear el producto.");
      return;
    }
    if (Number(newProduct.availableQuantity) < 0) {
      setError("El stock disponible no puede ser negativo.");
      return;
    }
    if (!newProduct.imageUrl.trim()) {
      setError("Debes subir una imagen antes de guardar el producto.");
      return;
    }

    setSavingProduct(true);
    setError("");
    setActionMessage("");

    try {
      const isEditMode =
        productModalMode === "edit" && editingProductId !== null;
      const finalImageUrl = (uploadedMediaUrl || newProduct.imageUrl).trim();
      const response = await fetch(
        isEditMode
          ? `${API_URL}/me/products/${editingProductId}`
          : `${API_URL}/me/products`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newProduct.name.trim(),
            description: newProduct.description.trim(),
            price: Number(newProduct.price),
            imageUrl: finalImageUrl.length > 0 ? finalImageUrl : null,
            availableQuantity: Number(newProduct.availableQuantity),
            active: newProduct.active,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("create_product_error");
      }

      const [loadedProducts, loadedAnalytics] = await Promise.all([
        loadProducts(token, activeStore.slug),
        loadAnalytics(token, activeStore.slug),
      ]);
      setProducts(loadedProducts);
      setAnalytics(loadedAnalytics);
      void loadTopInterestFromStart();
      setActionMessage(
        productModalMode === "edit"
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      );
      setNewProduct({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        availableQuantity: "0",
        active: true,
      });
      setUploadedMediaUrl("");
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
    setNewProduct({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      availableQuantity: "0",
      active: true,
    });
    setUploadedMediaUrl("");
    setError("");
    setActionMessage("");
    setProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setProductModalMode("edit");
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl,
      availableQuantity: String(product.stock),
      active: product.active,
    });
    setUploadedMediaUrl(product.imageUrl);
    setError("");
    setActionMessage("");
    setProductModalOpen(true);
    void trackAnalyticsEvent("PRODUCT_CLICK", product.id);
  };

  const handleDeleteProduct = async (productId: number) => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token || !activeStore) {
      setError("No hay sesion activa para eliminar productos.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/me/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("delete_product_error");
      }
      const [loadedProducts, loadedAnalytics] = await Promise.all([
        loadProducts(token, activeStore.slug),
        loadAnalytics(token, activeStore.slug),
      ]);
      setProducts(loadedProducts);
      setAnalytics(loadedAnalytics);
      void loadTopInterestFromStart();
      setActionMessage("Producto eliminado correctamente.");
      setError("");
    } catch {
      setError("No se pudo eliminar el producto.");
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

  const handleMediaUpload = async (file: File) => {
    const token = window.localStorage.getItem("stores_admin_token");
    const activeStoreId = window.localStorage.getItem(
      "stores_admin_active_store_id",
    );
    if (!token) {
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
        headers: {
          Authorization: `Bearer ${token}`,
          ...(activeStoreId ? { "x-store-id": activeStoreId } : {}),
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("upload_media_error");
      }
      const payload = (await response.json()) as { fileUrl: string };
      setUploadedMediaUrl(payload.fileUrl);
      setNewProduct((prev) => ({ ...prev, imageUrl: payload.fileUrl }));
      setActionMessage("Archivo subido correctamente.");
    } catch {
      setError("No se pudo subir el archivo multimedia.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const trackAnalyticsEvent = async (
    eventType:
      | "PRODUCT_VIEW"
      | "PRODUCT_CLICK"
      | "ADD_TO_CART"
      | "PURCHASE_INTENT",
    productId?: number,
  ) => {
    if (!activeStore) {
      return;
    }

    try {
      await fetch(`${API_URL}/stores/${activeStore.slug}/analytics/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId ?? null,
          eventType,
          sessionId: "dashboard-session",
          source: "capicode-dashboard",
        }),
      });
    } catch {
      // Do not block UI for analytics errors.
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-300">Cargando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0d14] text-slate-100">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),radial-gradient(circle_at_30%_20%,_rgba(168,85,247,0.16),_transparent_30%),radial-gradient(circle_at_80%_0%,_rgba(16,185,129,0.14),_transparent_30%)]">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/35 p-6 backdrop-blur-xl lg:flex lg:flex-col">
            <div>
              <p className="text-xs tracking-[0.2em] text-emerald-300/90 uppercase">
                CapiCode
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Bienvenido a la dashboard
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Resumen, catálogo de productos y pagos PayU.
              </p>
            </div>

            <nav className="mt-8 space-y-2">
              <SidebarItem
                label="Resumen"
                icon="◈"
                active={activeSection === "resumen"}
                onClick={() => setActiveSection("resumen")}
              />
              <SidebarItem
                label="Productos"
                icon="◉"
                active={activeSection === "productos"}
                onClick={() => setActiveSection("productos")}
              />
              <SidebarItem
                label="Medios de pago (PayU)"
                icon="💳"
                active={activeSection === "pagos"}
                onClick={() => setActiveSection("pagos")}
              />
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs text-slate-400">Sesion activa</p>
              <p className="mt-1 text-sm font-medium">{client?.name}</p>
              <p className="text-xs text-slate-400">{client?.email}</p>
            </div>
          </aside>

          <section className="flex-1">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.16em] text-emerald-200 uppercase">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    CapiCode
                  </p>
                  <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                    {activeStore
                      ? `Dashboard - ${activeStore.name}`
                      : "Dashboard"}
                  </h1>
                  <p className="mt-1 text-xs text-slate-400">
                    Operacion inteligente de catalogo, inventario y crecimiento
                    digital con CapiCode.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {client ? (
                    <div className="relative">
                      <select
                        value={activeStore?.id ?? ""}
                        onChange={(event) =>
                          handleStoreChange(Number(event.target.value))
                        }
                        className="appearance-none rounded-xl border border-white/15 bg-black/55 px-4 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                      >
                        {client.stores.map((store) => (
                          <option
                            key={store.id}
                            value={store.id}
                            className="bg-slate-950 text-slate-100"
                          >
                            {store.name}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                        ▼
                      </span>
                    </div>
                  ) : null}
                  {activeSection === "resumen" ||
                  activeSection === "productos" ? (
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      Nuevo producto
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                  >
                    Cerrar sesion
                  </button>
                </div>
              </div>
            </header>

            <div className="mx-auto w-full max-w-7xl px-6 py-8">
              {error ? (
                <p className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200 backdrop-blur">
                  {error}
                </p>
              ) : null}
              {actionMessage ? (
                <p className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 backdrop-blur">
                  {actionMessage}
                </p>
              ) : null}
              {activeSection === "resumen" ? (
                <>
                  <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      title="Productos"
                      value={formatCompactNumber(products.length)}
                      fullValue={String(products.length)}
                      tone="cyan"
                      icon="$"
                    />
                    <StatCard
                      title="Interacciones totales"
                      value={formatCompactNumber(analytics?.totalEvents ?? 0)}
                      fullValue={String(analytics?.totalEvents ?? 0)}
                      tone="emerald"
                      icon="◉"
                    />
                    <StatCard
                      title="Visualizaciones"
                      value={formatCompactNumber(analytics?.productViews ?? 0)}
                      fullValue={String(analytics?.productViews ?? 0)}
                      tone="violet"
                      icon="▣"
                    />
                    <StatCard
                      title="Interes de compra"
                      value={formatCompactNumber(
                        analytics?.purchaseIntents ?? 0,
                      )}
                      fullValue={String(analytics?.purchaseIntents ?? 0)}
                      tone="amber"
                      icon="◎"
                    />
                    <StatCard
                      title="Ganancias pagadas"
                      value={formatCompactCopCurrency(
                        revenueSummary?.totalPaidAmount ?? 0,
                      )}
                      fullValue={formatCopCurrency(
                        revenueSummary?.totalPaidAmount ?? 0,
                      )}
                      tone="emerald"
                      icon="💰"
                    />
                  </section>

                  <section className="mb-6 grid gap-4 xl:grid-cols-3">
                    <article className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur xl:col-span-2">
                      <h3 className="text-sm text-slate-400">
                        Actividad de clientes por dia
                      </h3>
                      <p className="mt-1 text-2xl font-semibold">
                        {analytics?.totalEvents ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-emerald-300">
                        Mide como los clientes interactuan con tus productos.
                      </p>
                      <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          Visualizaciones: {analytics?.productViews ?? 0}
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          Clics en producto: {analytics?.productClicks ?? 0}
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          Agregados al carrito: {analytics?.addToCart ?? 0}
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          Interes de compra: {analytics?.purchaseIntents ?? 0}
                        </div>
                      </div>
                      <div className="mt-5 rounded-2xl border border-white/10 bg-[#081225]/70 p-4">
                        <AnalyticsLineChart
                          series={buildDailySeries(
                            analytics?.dailyMetrics ?? [],
                          )}
                        />
                      </div>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur">
                      <h3 className="text-sm text-slate-400">
                        Productos con mayor interes
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Ordenados por cantidad total de interacciones (todas las
                        trazas con producto).
                      </p>
                      <div
                        ref={topInterestScrollRef}
                        className="mt-4 max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain pr-1"
                      >
                        <ul className="space-y-2 text-sm">
                          {topInterestItems.map((item) => {
                            const label =
                              item.productName?.trim() ||
                              `Producto #${item.productId}`;
                            return (
                              <li
                                key={item.productId}
                                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                              >
                                <span
                                  className="min-w-0 flex-1 font-medium leading-snug text-slate-200"
                                  title={label}
                                >
                                  {label}
                                </span>
                                <span className="shrink-0 tabular-nums font-semibold text-emerald-200">
                                  {item.count}
                                </span>
                              </li>
                            );
                          })}
                          {topInterestItems.length === 0 &&
                          !topInterestLoading ? (
                            <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-500">
                              Sin eventos registrados aun.
                            </li>
                          ) : null}
                        </ul>
                        {topInterestLoading && topInterestItems.length > 0 ? (
                          <p className="py-3 text-center text-xs text-slate-400">
                            Cargando mas...
                          </p>
                        ) : null}
                        {topInterestLast &&
                        topInterestItems.length > 0 &&
                        !topInterestLoading ? (
                          <p className="pb-2 pt-1 text-center text-[11px] text-slate-500">
                            Fin de la lista
                          </p>
                        ) : null}
                        <div
                          ref={topInterestSentinelRef}
                          className="h-3 w-full shrink-0"
                          aria-hidden
                        />
                      </div>
                    </article>
                  </section>
                </>
              ) : null}

              {activeSection === "productos" ? (
                <section className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur sm:p-6">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar por nombre o SKU"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 sm:max-w-sm"
                    />
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(
                            event.target.value as "todos" | ProductStatus,
                          )
                        }
                        className="appearance-none rounded-xl border border-white/15 bg-black/55 px-4 py-2.5 pr-10 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                      >
                        <option
                          value="todos"
                          className="bg-slate-950 text-slate-100"
                        >
                          Todos los estados
                        </option>
                        <option
                          value="activo"
                          className="bg-slate-950 text-slate-100"
                        >
                          Activo
                        </option>
                        <option
                          value="borrador"
                          className="bg-slate-950 text-slate-100"
                        >
                          Borrador
                        </option>
                        <option
                          value="agotado"
                          className="bg-slate-950 text-slate-100"
                        >
                          Agotado
                        </option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-300">
                          <th className="px-3 py-3 font-medium">SKU</th>
                          <th className="px-3 py-3 font-medium">Producto</th>
                          <th className="px-3 py-3 font-medium">Categoria</th>
                          <th className="px-3 py-3 font-medium">Precio</th>
                          <th className="px-3 py-3 font-medium">Stock</th>
                          <th className="px-3 py-3 font-medium">Estado</th>
                          <th className="px-3 py-3 font-medium">Actualizado</th>
                          <th className="px-3 py-3 font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="px-3 py-3 text-slate-300">
                              {product.sku}
                            </td>
                            <td className="px-3 py-3">{product.name}</td>
                            <td className="px-3 py-3 text-slate-300">
                              {product.category}
                            </td>
                            <td className="px-3 py-3">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="px-3 py-3">{product.stock}</td>
                            <td className="px-3 py-3">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyles[product.status]}`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-slate-300">
                              {product.updatedAt}
                            </td>
                            <td className="px-3 py-3">
                              <button
                                type="button"
                                onClick={() => openEditModal(product)}
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="ml-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {activeSection === "pagos" ? (
                <>
                  <section className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur sm:p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-100">
                          Configuracion medio de pago PayU
                        </h3>
                        <p className="text-xs text-slate-400">
                          CRUD del medio de pago con token y filtros del usuario
                          autenticado.
                        </p>
                        {hasActivePayuConfig ? (
                          <p className="mt-2 text-xs text-amber-200/90">
                            Ya hay una configuracion PayU activa en esta tienda.
                            Desactivala o eliminala para poder crear otra.
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={openCreatePayuModal}
                        disabled={hasActivePayuConfig || payuLoading}
                        title={
                          hasActivePayuConfig
                            ? "No puedes crear otra configuracion mientras exista una activa"
                            : undefined
                        }
                        className="rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-emerald-500/20"
                      >
                        Nuevo PayU
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-300">
                            <th className="px-3 py-3 font-medium">Nombre</th>
                            <th className="px-3 py-3 font-medium">
                              Merchant ID
                            </th>
                            <th className="px-3 py-3 font-medium">
                              Account ID
                            </th>
                            <th className="px-3 py-3 font-medium">Entorno</th>
                            <th className="px-3 py-3 font-medium">Estado</th>
                            <th className="px-3 py-3 font-medium">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payuLoading ? (
                            <tr>
                              <td
                                className="px-3 py-3 text-slate-400"
                                colSpan={6}
                              >
                                Cargando configuracion de PayU...
                              </td>
                            </tr>
                          ) : null}
                          {!payuLoading && payuMethods.length === 0 ? (
                            <tr>
                              <td
                                className="px-3 py-3 text-slate-500"
                                colSpan={6}
                              >
                                Aun no hay configuraciones de PayU para esta
                                store.
                              </td>
                            </tr>
                          ) : null}
                          {payuMethods.map((method) => (
                            <tr
                              key={method.id}
                              className="border-b border-white/5 hover:bg-white/5"
                            >
                              <td className="px-3 py-3">{method.name}</td>
                              <td className="px-3 py-3 text-slate-300">
                                {method.merchantId}
                              </td>
                              <td className="px-3 py-3 text-slate-300">
                                {method.accountId}
                              </td>
                              <td className="px-3 py-3 text-slate-300">
                                {method.sandbox ? "Sandbox" : "Produccion"}
                              </td>
                              <td className="px-3 py-3 text-slate-300">
                                {method.active ? "Activo" : "Inactivo"}
                              </td>
                              <td className="px-3 py-3">
                                <button
                                  type="button"
                                  onClick={() => openEditPayuModal(method)}
                                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePayu(method.id)}
                                  className="ml-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur sm:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-100">
                          Pagos PayU registrados
                        </h3>
                        <p className="text-xs text-slate-400">
                          Cobros asociados a pedidos (callback PayU). Orden
                          descendente por fecha.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={payuPaymentStatusDraft}
                          onChange={(e) =>
                            setPayuPaymentStatusDraft(e.target.value)
                          }
                          placeholder="Filtrar por estado (ej. APPROVED)"
                          className="min-w-[12rem] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPayuPaymentStatusQuery(
                              payuPaymentStatusDraft.trim(),
                            );
                            setPayuPaymentsPage(0);
                            setPayuPaymentsListTick((t) => t + 1);
                          }}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                        >
                          Filtrar
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayuPaymentsListTick((t) => t + 1)}
                          disabled={payuPaymentsLoading}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                        >
                          Refrescar
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[min(55vh,480px)] overflow-auto overscroll-contain rounded-xl border border-white/10">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 z-[1] border-b border-white/10 bg-[#0b1018]/95 backdrop-blur-md">
                          <tr className="text-slate-300">
                            <th className="px-3 py-3 font-medium">ID pago</th>
                            <th className="px-3 py-3 font-medium">Pedido</th>
                            <th className="px-3 py-3 font-medium">Cliente</th>
                            <th className="px-3 py-3 font-medium">Monto</th>
                            <th className="px-3 py-3 font-medium">Estado</th>
                            <th className="px-3 py-3 font-medium">
                              Transaccion
                            </th>
                            <th className="px-3 py-3 font-medium">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payuPaymentsLoading ? (
                            <tr>
                              <td
                                className="px-3 py-3 text-slate-400"
                                colSpan={7}
                              >
                                Cargando pagos...
                              </td>
                            </tr>
                          ) : null}
                          {!payuPaymentsLoading &&
                          payuPaymentsData &&
                          payuPaymentsData.content.length === 0 ? (
                            <tr>
                              <td
                                className="px-3 py-3 text-slate-500"
                                colSpan={7}
                              >
                                No hay pagos PayU registrados para esta tienda.
                              </td>
                            </tr>
                          ) : null}
                          {!payuPaymentsLoading && payuPaymentsData
                            ? payuPaymentsData.content.map((row) => (
                                <tr
                                  key={row.id}
                                  className="border-b border-white/5 hover:bg-white/5"
                                >
                                  <td className="px-3 py-3 tabular-nums text-slate-300">
                                    #{row.id}
                                  </td>
                                  <td className="px-3 py-3 tabular-nums">
                                    #{row.orderId}
                                  </td>
                                  <td className="px-3 py-3 text-slate-300">
                                    <span className="block font-medium text-slate-200">
                                      {row.customerName}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {row.customerEmail}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 tabular-nums">
                                    ${Number(row.amount).toFixed(2)}
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs uppercase text-slate-200">
                                      {row.status}
                                    </span>
                                  </td>
                                  <td
                                    className="max-w-[140px] truncate px-3 py-3 font-mono text-xs text-slate-400"
                                    title={row.transactionId ?? ""}
                                  >
                                    {row.transactionId ?? "—"}
                                  </td>
                                  <td className="px-3 py-3 text-slate-400">
                                    {new Date(row.createdAt).toLocaleString(
                                      "es-CO",
                                    )}
                                  </td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </table>
                    </div>

                    {payuPaymentsData && payuPaymentsData.totalPages > 1 ? (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                        <span>
                          Pagina {payuPaymentsData.page + 1} de{" "}
                          {payuPaymentsData.totalPages} (
                          {payuPaymentsData.totalElements} pagos)
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={
                              payuPaymentsPage <= 0 || payuPaymentsLoading
                            }
                            onClick={() =>
                              setPayuPaymentsPage((p) => Math.max(0, p - 1))
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
                          >
                            Anterior
                          </button>
                          <button
                            type="button"
                            disabled={
                              payuPaymentsPage >=
                                payuPaymentsData.totalPages - 1 ||
                              payuPaymentsLoading
                            }
                            onClick={() =>
                              setPayuPaymentsPage((p) =>
                                Math.min(
                                  payuPaymentsData.totalPages - 1,
                                  p + 1,
                                ),
                              )
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </section>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>
      {productModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0d1320] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-start justify-between">
              <div className="w-full rounded-t-3xl border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 px-6 py-5">
                <h3 className="text-2xl font-semibold">
                  {productModalMode === "edit"
                    ? "Editar producto"
                    : "Crear producto"}
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Diligencia los campos principales y adjunta multimedia del
                  producto.
                </p>
              </div>
            </div>

            <div className="space-y-5 px-6 pb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-400">
                    Nombre del producto
                  </span>
                  <input
                    value={newProduct.name}
                    onChange={(event) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Ej: Camiseta premium"
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-400">Precio</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(event) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        price: event.target.value,
                      }))
                    }
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs text-slate-400">Descripcion</span>
                <textarea
                  value={newProduct.description}
                  onChange={(event) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe brevemente el producto"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-400">
                    Stock disponible
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.availableQuantity}
                    onChange={(event) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        availableQuantity:
                          Number(event.target.value) < 0
                            ? "0"
                            : event.target.value,
                      }))
                    }
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  <span>Producto activo</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={newProduct.active}
                    onClick={() =>
                      setNewProduct((prev) => ({
                        ...prev,
                        active: !prev.active,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      newProduct.active
                        ? "bg-emerald-500/80"
                        : "bg-slate-600/70"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                        newProduct.active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Multimedia
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleMediaUpload(file);
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 outline-none file:mr-3 file:rounded-xl file:border file:border-emerald-300/30 file:bg-emerald-500/10 file:px-3 file:py-1.5 file:text-emerald-100 hover:file:bg-emerald-500/20"
                />
                {uploadingMedia ? (
                  <p className="text-xs text-emerald-300">
                    Subiendo archivo...
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Formatos permitidos: JPG, PNG, WEBP y GIF.
                  </p>
                )}
                <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  {newProduct.imageUrl && !uploadingMedia ? (
                    <p className="inline-flex items-center gap-2 text-xs text-emerald-200">
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                      Foto cargada correctamente
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Aun no hay archivo cargado
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-1 flex justify-end gap-2 border-t border-white/10 px-6 py-4">
              {error ? (
                <div className="mr-auto rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={
                  savingProduct || uploadingMedia || !newProduct.imageUrl.trim()
                }
                className="rounded-2xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30 disabled:opacity-60"
              >
                {savingProduct
                  ? productModalMode === "edit"
                    ? "Guardando..."
                    : "Creando..."
                  : productModalMode === "edit"
                    ? "Guardar cambios"
                    : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {payuModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0d1320] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-start justify-between">
              <div className="w-full rounded-t-3xl border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 px-6 py-5">
                <h3 className="text-2xl font-semibold">
                  {payuModalMode === "edit" ? "Editar PayU" : "Crear PayU"}
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Configura credenciales del gateway y su estado operativo.
                </p>
              </div>
            </div>
            <div className="space-y-4 px-6 pb-6">
              {payuModalMode === "edit" ? (
                <p className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/95">
                  El servidor no devuelve credenciales en listados ni al
                  guardar. Para rotar API Key, API Login o llave publica,
                  escribe los valores nuevos; deja esos campos vacios para no
                  cambiarlos.
                </p>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-400">Nombre</span>
                  <input
                    value={payuForm.name}
                    onChange={(event) =>
                      setPayuForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-400">Merchant ID</span>
                  <input
                    value={payuForm.merchantId}
                    onChange={(event) =>
                      setPayuForm((prev) => ({
                        ...prev,
                        merchantId: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-400">Account ID</span>
                  <input
                    value={payuForm.accountId}
                    onChange={(event) =>
                      setPayuForm((prev) => ({
                        ...prev,
                        accountId: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-400">API Login</span>
                  <input
                    value={payuForm.apiLogin}
                    onChange={(event) =>
                      setPayuForm((prev) => ({
                        ...prev,
                        apiLogin: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
              </div>
              <label className="space-y-1.5">
                <span className="text-xs text-slate-400">API Key</span>
                <input
                  value={payuForm.apiKey}
                  onChange={(event) =>
                    setPayuForm((prev) => ({
                      ...prev,
                      apiKey: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs text-slate-400">
                  Llave publica (public key)
                </span>
                <input
                  value={payuForm.keyPublic}
                  onChange={(event) =>
                    setPayuForm((prev) => ({
                      ...prev,
                      keyPublic: event.target.value,
                    }))
                  }
                  placeholder="PK en checkout / Web Checkout"
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  <span>Sandbox</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={payuForm.sandbox}
                    onClick={() =>
                      setPayuForm((prev) => ({
                        ...prev,
                        sandbox: !prev.sandbox,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      payuForm.sandbox ? "bg-emerald-500/80" : "bg-slate-600/70"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                        payuForm.sandbox ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  <span>Activo</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={payuForm.active}
                    onClick={() =>
                      setPayuForm((prev) => ({ ...prev, active: !prev.active }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      payuForm.active ? "bg-emerald-500/80" : "bg-slate-600/70"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                        payuForm.active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
            <div className="mt-1 flex justify-end gap-2 border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={() => setPayuModalOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePayu}
                disabled={payuSaving}
                className="rounded-2xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30 disabled:opacity-60"
              >
                {payuSaving
                  ? payuModalMode === "edit"
                    ? "Guardando..."
                    : "Creando..."
                  : payuModalMode === "edit"
                    ? "Guardar cambios"
                    : "Crear PayU"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function buildAuthFilters(
  client: ClientDetail,
  storeId: number | null | undefined,
): AuthFilters {
  return {
    userId: client.id,
    clientId: client.id,
    storeId: storeId ?? undefined,
  };
}

function formatCopCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatCompactCopCurrency(amount: number): string {
  return `$${formatCompactNumber(amount)}`;
}

async function loadProducts(
  token: string,
  storeSlug: string,
): Promise<Product[]> {
  const response = await fetch(`${API_URL}/stores/${storeSlug}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("products_error");
  }
  const payload = (await response.json()) as Array<{
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    active: boolean;
    availableQuantity: number;
    createdAt: string;
  }>;

  const mapped: Product[] = payload.map((item) => {
    const status: ProductStatus = item.active
      ? item.availableQuantity > 0
        ? "activo"
        : "agotado"
      : "borrador";

    return {
      id: item.id,
      sku: `PRD-${item.id}`,
      name: item.name,
      description: item.description ?? "",
      category: "General",
      price: Number(item.price),
      imageUrl: item.imageUrl ?? "",
      stock: item.availableQuantity,
      status,
      active: item.active,
      updatedAt: new Date(item.createdAt).toISOString().slice(0, 10),
    };
  });
  return mapped;
}

async function loadAnalytics(
  token: string,
  storeSlug: string,
): Promise<AnalyticsDashboard> {
  const response = await fetch(
    `${API_URL}/stores/${storeSlug}/analytics/dashboard?days=30`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("analytics_error");
  }

  return (await response.json()) as AnalyticsDashboard;
}

async function loadTopProductsInterestPage(
  token: string,
  storeSlug: string,
  page: number,
  size: number,
): Promise<TopProductsInterestPage> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `${API_URL}/stores/${storeSlug}/analytics/top-products?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("top_products_error");
  }

  return (await response.json()) as TopProductsInterestPage;
}

function buildDailySeries(
  dailyMetrics: AnalyticsDashboard["dailyMetrics"],
): Array<{
  label: string;
  PRODUCT_VIEW: number;
  PRODUCT_CLICK: number;
  ADD_TO_CART: number;
  PURCHASE_INTENT: number;
}> {
  const perDate = new Map<
    string,
    {
      PRODUCT_VIEW: number;
      PRODUCT_CLICK: number;
      ADD_TO_CART: number;
      PURCHASE_INTENT: number;
    }
  >();

  for (const metric of dailyMetrics) {
    const current = perDate.get(metric.date) ?? {
      PRODUCT_VIEW: 0,
      PRODUCT_CLICK: 0,
      ADD_TO_CART: 0,
      PURCHASE_INTENT: 0,
    };
    current[metric.eventType] += metric.count;
    perDate.set(metric.date, current);
  }

  const sortedDates = [...perDate.keys()].sort((a, b) => a.localeCompare(b));
  const endDate = sortedDates.length
    ? new Date(`${sortedDates[sortedDates.length - 1]}T00:00:00`)
    : new Date();

  const windowDays = 7;
  const range: Array<{
    date: string;
    PRODUCT_VIEW: number;
    PRODUCT_CLICK: number;
    ADD_TO_CART: number;
    PURCHASE_INTENT: number;
  }> = [];
  for (let i = windowDays - 1; i >= 0; i -= 1) {
    const current = new Date(endDate);
    current.setDate(endDate.getDate() - i);
    const key = current.toISOString().slice(0, 10);
    const values = perDate.get(key) ?? {
      PRODUCT_VIEW: 0,
      PRODUCT_CLICK: 0,
      ADD_TO_CART: 0,
      PURCHASE_INTENT: 0,
    };
    range.push({ date: key, ...values });
  }

  return range.map((item) => ({
    label: item.date,
    PRODUCT_VIEW: item.PRODUCT_VIEW,
    PRODUCT_CLICK: item.PRODUCT_CLICK,
    ADD_TO_CART: item.ADD_TO_CART,
    PURCHASE_INTENT: item.PURCHASE_INTENT,
  }));
}

function AnalyticsLineChart({
  series,
}: {
  series: Array<{
    label: string;
    PRODUCT_VIEW: number;
    PRODUCT_CLICK: number;
    ADD_TO_CART: number;
    PURCHASE_INTENT: number;
  }>;
}) {
  const [enabledTypes, setEnabledTypes] = useState<{
    PRODUCT_VIEW: boolean;
    PRODUCT_CLICK: boolean;
    ADD_TO_CART: boolean;
    PURCHASE_INTENT: boolean;
  }>({
    PRODUCT_VIEW: true,
    PRODUCT_CLICK: true,
    ADD_TO_CART: true,
    PURCHASE_INTENT: true,
  });

  const width = 760;
  const height = 210;
  const paddingX = 42;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  if (!series.length) {
    return (
      <div className="flex h-[210px] items-center justify-center text-sm text-slate-500">
        Sin datos de actividad en el periodo.
      </div>
    );
  }

  const typeMeta: Array<{
    key: "PRODUCT_VIEW" | "PRODUCT_CLICK" | "ADD_TO_CART" | "PURCHASE_INTENT";
    label: string;
    color: string;
  }> = [
    { key: "PRODUCT_VIEW", label: "Visualizaciones", color: "rgb(34 211 238)" },
    { key: "PRODUCT_CLICK", label: "Clics", color: "rgb(167 139 250)" },
    { key: "ADD_TO_CART", label: "Carrito", color: "rgb(52 211 153)" },
    { key: "PURCHASE_INTENT", label: "Interes", color: "rgb(251 191 36)" },
  ];

  const visibleTypes = typeMeta.filter((type) => enabledTypes[type.key]);

  const maxCount = Math.max(
    ...series.flatMap((d) => visibleTypes.map((type) => d[type.key])),
    1,
  );
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(maxCount * ratio),
    y: paddingTop + chartHeight - ratio * chartHeight,
  }));

  const buildPoints = (key: (typeof typeMeta)[number]["key"]) =>
    series.map((entry, index) => {
      const x =
        series.length === 1
          ? paddingX + chartWidth / 2
          : paddingX + (index / (series.length - 1)) * chartWidth;
      const y =
        paddingTop + chartHeight - (entry[key] / maxCount) * chartHeight;
      return { ...entry, x, y, value: entry[key] };
    });

  return (
    <div className="overflow-x-auto space-y-3">
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
        {typeMeta.map((type) => (
          <button
            key={type.key}
            type="button"
            onClick={() =>
              setEnabledTypes((prev) => ({
                ...prev,
                [type.key]: !prev[type.key],
              }))
            }
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 transition ${
              enabledTypes[type.key]
                ? "border-white/15 bg-white/10 text-slate-100"
                : "border-white/10 bg-white/0 text-slate-500"
            }`}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: type.color }}
            />
            {type.label}
          </button>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[210px] min-w-[640px] w-full"
      >
        {yTicks.map((tick, index) => (
          <g key={`y-tick-${index}`}>
            <line
              x1={paddingX}
              x2={width - paddingX}
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(148,163,184,0.14)"
              strokeWidth="1"
            />
            <text
              x={paddingX - 8}
              y={tick.y + 3}
              textAnchor="end"
              fontSize="10"
              fill="rgb(148 163 184)"
            >
              {tick.value}
            </text>
          </g>
        ))}
        <line
          x1={paddingX}
          x2={width - paddingX}
          y1={paddingTop + chartHeight}
          y2={paddingTop + chartHeight}
          stroke="rgba(148,163,184,0.25)"
          strokeWidth="1"
        />

        {visibleTypes.map((type) => {
          const points = buildPoints(type.key);
          const path = points
            .map(
              (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
            )
            .join(" ");

          return (
            <g key={type.key}>
              <path
                d={path}
                fill="none"
                stroke={type.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.92"
              />
              {points.map((point) => (
                <circle
                  key={`${type.key}-${point.label}`}
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  fill={type.color}
                >
                  <title>{`${type.label} - ${point.label}: ${point.value}`}</title>
                </circle>
              ))}
            </g>
          );
        })}

        {!visibleTypes.length ? (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            fontSize="12"
            fill="rgb(148 163 184)"
          >
            Activa al menos un tipo de evento para visualizar la grafica.
          </text>
        ) : null}

        {series.map((entry, index) => {
          const x =
            series.length === 1
              ? paddingX + chartWidth / 2
              : paddingX + (index / (series.length - 1)) * chartWidth;
          return (
            <text
              key={entry.label}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="rgb(148 163 184)"
            >
              {new Date(entry.label).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "short",
              })}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function StatCard({
  title,
  value,
  fullValue,
  tone = "emerald",
  icon,
}: {
  title: string;
  value: string;
  fullValue?: string;
  tone?: "emerald" | "cyan" | "violet" | "amber";
  icon: string;
}) {
  const toneStyles: Record<
    typeof tone,
    { line: string; badge: string; glow: string }
  > = {
    emerald: {
      line: "from-emerald-300 to-emerald-500",
      badge: "bg-emerald-400/20 text-emerald-100 border-emerald-300/40",
      glow: "shadow-[0_0_18px_rgba(16,185,129,0.25)]",
    },
    cyan: {
      line: "from-cyan-300 to-cyan-500",
      badge: "bg-cyan-400/20 text-cyan-100 border-cyan-300/40",
      glow: "shadow-[0_0_18px_rgba(34,211,238,0.25)]",
    },
    violet: {
      line: "from-violet-300 to-violet-500",
      badge: "bg-violet-400/20 text-violet-100 border-violet-300/40",
      glow: "shadow-[0_0_18px_rgba(168,85,247,0.25)]",
    },
    amber: {
      line: "from-amber-300 to-amber-500",
      badge: "bg-amber-400/20 text-amber-100 border-amber-300/40",
      glow: "shadow-[0_0_18px_rgba(245,158,11,0.25)]",
    },
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/6 to-transparent opacity-0 transition-all duration-500 group-hover:translate-x-full group-hover:opacity-100" />
      <span
        className={`absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b ${toneStyles[tone].line}`}
      />
      <div className="relative z-10 flex items-start justify-between pl-2">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs text-slate-400">{title}</p>
          <p
            className="mt-1 truncate text-[clamp(1.15rem,2.6vw,1.85rem)] font-semibold leading-none transition-transform duration-300 group-hover:translate-x-0.5"
            title={fullValue ?? value}
          >
            {value}
          </p>
        </div>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border text-sm transition-transform duration-300 group-hover:scale-105 ${toneStyles[tone].badge} ${toneStyles[tone].glow}`}
        >
          {icon}
        </span>
      </div>
    </article>
  );
}

function SidebarItem({
  label,
  icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
        active
          ? "border border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
          : "border border-transparent text-slate-300 hover:bg-white/5 hover:text-slate-100"
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="text-xs">{icon}</span>
        <span>{label}</span>
      </span>
      <span className="text-xs text-slate-500">-</span>
    </button>
  );
}
