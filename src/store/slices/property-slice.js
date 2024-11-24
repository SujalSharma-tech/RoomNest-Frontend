export const createPropertySlice = (set) => ({
  properties: [],
  isPropertiesTriggered: false,
  loading: true,
  isLoadingMaps: false,
  savedProperties: [],
  //   setSavedProperties: (value) => set({ savedProperties: value }),
  setSavedProperties: (updater) =>
    set((state) => {
      const newSavedProperties =
        typeof updater === "function"
          ? updater(state.savedProperties)
          : updater;

      return { savedProperties: newSavedProperties };
    }),
  setIsLoadingMaps: (value) => set({ isLoadingMaps: value }),
  setLoading: (value) => set({ loading: value }),
  ispropertiesFetched: false,
  setIsPropertiesFetched: (value) => set({ ispropertiesFetched: value }),
  setPropertiesTriggered: (value) => set({ isPropertiesTriggered: value }),
  setProperties: (properties) => set({ properties }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
});
