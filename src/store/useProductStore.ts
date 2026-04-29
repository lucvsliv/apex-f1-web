import { create } from "zustand";

export type Product = {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    orders: number;
    seller: string;
    image: string;
    isNew?: boolean;
    deliveryDays: number;
    categoryId: string;
    brandId: string;
    colorId: string;
};

const MOCK_PRODUCTS: Product[] = [
    { id: "1", title: "Apex F1 모자 (오리지널 굿즈)", price: 15.0, originalPrice: 20.0, discount: 25, rating: 4.8, orders: 342, seller: "Apex F1 Store", image: "/goods/apexf1-cap.png", isNew: true, deliveryDays: 1, categoryId: "apparel", brandId: "apex", colorId: "black" },
    { id: "2", title: "Apex F1 키링 (오리지널 굿즈)", price: 5.0, rating: 4.9, orders: 128, seller: "Apex F1 Store", image: "/goods/apexf1-keyring.png", deliveryDays: 3, categoryId: "diecast", brandId: "redbull", colorId: "blue" },
    { id: "3", title: "Apex F1 노트 (오리지널 굿즈)", price: 10.0, rating: 4.5, orders: 856, seller: "Apex F1 Store", image: "/goods/apexf1-notebook.png", deliveryDays: 0, categoryId: "accessories", brandId: "ferrari", colorId: "red" },
    { id: "4", title: "Apex F1 볼펜 (오리지널 굿즈)", price: 8.0, originalPrice: 10.0, discount: 20, rating: 4.7, orders: 56, seller: "Apex F1 Store", image: "/goods/apexf1-pen.png", deliveryDays: 2, categoryId: "art", brandId: "apex", colorId: "gray" },
];

interface ProductStore {
    products: Product[];
    filteredProducts: Product[];
    searchQuery: string;
    selectedCategory: string;
    selectedBrands: string[];
    selectedColors: string[];
    priceRange: number[];
    deliveryDate: string;
    viewMode: string;

    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string) => void;
    toggleBrand: (brand: string) => void;
    toggleColor: (color: string) => void;
    setPriceRange: (range: number[]) => void;
    setDeliveryDate: (date: string) => void;
    setViewMode: (mode: string) => void;
    applyFilters: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: MOCK_PRODUCTS,
    filteredProducts: MOCK_PRODUCTS,
    searchQuery: "",
    selectedCategory: "all",
    selectedBrands: [],
    selectedColors: [],
    priceRange: [0, 500],
    deliveryDate: "any",
    viewMode: "grid",

    setSearchQuery: (query) => { set({ searchQuery: query }); get().applyFilters(); },
    setSelectedCategory: (category) => { set({ selectedCategory: category }); get().applyFilters(); },
    toggleBrand: (brand) => {
        const current = get().selectedBrands;
        set({ selectedBrands: current.includes(brand) ? current.filter(b => b !== brand) : [...current, brand] });
        get().applyFilters();
    },
    toggleColor: (color) => {
        const current = get().selectedColors;
        set({ selectedColors: current.includes(color) ? current.filter(c => c !== color) : [...current, color] });
        get().applyFilters();
    },
    setPriceRange: (range) => { set({ priceRange: range }); get().applyFilters(); },
    setDeliveryDate: (date) => { set({ deliveryDate: date }); get().applyFilters(); },
    setViewMode: (mode) => set({ viewMode: mode }),

    applyFilters: () => {
        const { products, searchQuery, selectedCategory, selectedBrands, priceRange } = get();
        let result = products;

        if (searchQuery) {
            result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedCategory !== "all") {
            result = result.filter(p => p.categoryId === selectedCategory);
        }
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brandId));
        }
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        set({ filteredProducts: result });
    }
}));