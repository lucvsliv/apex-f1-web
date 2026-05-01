"use client";

import { useEffect, useState } from "react";
import { Search, Grid3X3, List, Heart, Star, ShoppingCart, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useProductStore } from "@/store/useProductStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import * as React from "react";

const categories = [
    { id: "all", label: "All Products", icon: "🏪" },
    { id: "apparel", label: "Team Apparel", icon: "👕" },
    { id: "diecast", label: "Diecast Models", icon: "🏎️" },
    { id: "accessories", label: "Accessories", icon: "🧢" },
    { id: "art", label: "Art & Prints", icon: "🖼️" }
];

const brands = [
    { id: "apex", label: "Apex-F1 Original" },
    { id: "mercedes", label: "Mercedes-AMG" },
    { id: "redbull", label: "Red Bull Racing" },
    { id: "ferrari", label: "Scuderia Ferrari" },
    { id: "mclaren", label: "McLaren" }
];

function FilterSection() {
    const {
        priceRange, selectedBrands, selectedCategory,
        setPriceRange, toggleBrand, setSelectedCategory
    } = useProductStore();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-3 font-semibold text-sm">Categories</h3>
                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                    <div className="space-y-2 text-sm">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                                <Label htmlFor={`category-${category.id}`} className="cursor-pointer text-sm font-normal">
                                    {category.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </RadioGroup>
            </div>
            <Separator />
            <div>
                <h3 className="mb-3 font-semibold text-sm">Teams & Brands</h3>
                <div className="max-h-48 space-y-3 overflow-y-auto">
                    {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`brand-${brand.id}`}
                                checked={selectedBrands.includes(brand.id)}
                                onCheckedChange={() => toggleBrand(brand.id)}
                            />
                            <Label htmlFor={`brand-${brand.id}`} className="cursor-pointer text-sm font-normal">
                                {brand.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="mb-3 font-semibold text-sm">Price Range ($)</h3>
                <div className="space-y-4 px-1">
                    <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500}
                        step={10}
                        className="w-full"
                    />
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                            className="h-8 text-xs"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 500])}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function GoodsProduct() {
    const {
        filteredProducts, viewMode, searchQuery,
        setViewMode, setSearchQuery, applyFilters
    } = useProductStore();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const currentTab = pathname.split("/").pop() || "product";

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/store/product" className="text-sm">Store</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select
                            value={currentTab}
                            onValueChange={(val) => router.push(`/dashboard/store/${val}`)}
                        >
                            <SelectTrigger className="w-[120px] text-sm h-8">
                                <SelectValue placeholder="Menu" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200">
                                <SelectItem value="product">Products</SelectItem>
                                <SelectItem value="cart">Cart</SelectItem>
                                <SelectItem value="checkout">Checkout</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 그랑프리 년도 타이틀 */}
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>APEX-F1</p>
                <h1 className="text-4xl font-bold">ORIGINAL STORE</h1>
            </div>

            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden w-56 lg:block shrink-0">
                        <FilterSection />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Controls Bar */}
                        <div className="mb-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Mobile Filter */}
                                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="sm" className="lg:hidden">
                                                <Filter className="mr-2 h-4 w-4" /> Filters
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-80">
                                            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                                            <ScrollArea className="h-full pr-4 py-4">
                                                <FilterSection />
                                            </ScrollArea>
                                        </SheetContent>
                                    </Sheet>
                                    <span className="text-muted-foreground text-sm">{filteredProducts.length} items found</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative hidden sm:block">
                                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                                        <Input
                                            placeholder="Search goods..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-64 pl-10 h-9"
                                        />
                                    </div>
                                    <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)}>
                                        <ToggleGroupItem value="grid" aria-label="Grid view" className="h-9 px-2">
                                            <Grid3X3 className="h-4 w-4" />
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="list" aria-label="List view" className="h-9 px-2">
                                            <List className="h-4 w-4" />
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                            </div>
                            {/* Mobile Search */}
                            <div className="relative sm:hidden">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                                <Input placeholder="Search goods..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10" />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="py-20 text-center border rounded-xl border-dashed">
                                <p className="text-muted-foreground text-lg">No goods found matching your filters.</p>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1"}`}>
                                {filteredProducts.map((product) => (
                                    <Card key={product.id} className="group border-stone-200 shadow-none transition-colors hover:border-stone-300">
                                        <CardContent className="p-3 sm:p-4">
                                            <div className={`relative ${viewMode === 'list' ? 'flex flex-row gap-4' : ''}`}>

                                                {/* 1. 이미지 영역 */}
                                                <div className={`relative ${viewMode === 'list' ? 'w-1/3 shrink-0' : 'mb-3 sm:mb-4'}`}>
                                                    <img
                                                        src={product.image || "/placeholder.svg"}
                                                        alt={product.title}
                                                        className={`w-full rounded-md object-cover ${viewMode === 'list' ? 'h-full min-h-[160px]' : 'h-40 sm:h-48'}`}
                                                    />
                                                    {product.isNew && (
                                                        <Badge className="absolute top-2 left-2 bg-red-500 text-xs hover:bg-red-600">
                                                            New
                                                        </Badge>
                                                    )}
                                                    {/* 이미지 위 Hover 하트 버튼 */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 bg-white/30 hover:bg-white/80"
                                                    >
                                                        <Heart className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* 2. 상세 정보 영역 */}
                                                <div className={`space-y-2 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-center' : ''}`}>
                                                    <h3 className="line-clamp-2 text-sm leading-tight font-medium">
                                                        {product.title}
                                                    </h3>

                                                    {/* 가격 정보 */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-base font-bold text-blue-600 sm:text-lg">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                        {product.originalPrice && (
                                                            <>
                                                                <span className="text-muted-foreground text-xs line-through sm:text-sm">
                                                                    ${product.originalPrice.toFixed(2)}
                                                                </span>
                                                                <Badge variant="destructive" className="text-xs">
                                                                    -{product.discount}%
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* 별점 및 리뷰 */}
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3 w-3 ${i < Math.floor(product.rating || 0)
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-muted-foreground text-xs">{product.rating}</span>
                                                    </div>

                                                    {/* 주문량, 판매자, 배송일 */}
                                                    <p className="text-muted-foreground text-xs">
                                                        {product.orders} orders this week
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">Seller: {product.seller}</p>
                                                    <div className="text-muted-foreground text-xs">
                                                        Delivery:{" "}
                                                        {product.deliveryDays === 0
                                                            ? "Today"
                                                            : product.deliveryDays === 1
                                                                ? "Tomorrow"
                                                                : `${product.deliveryDays} days`}
                                                    </div>

                                                    {/* 액션 버튼 */}
                                                    <div className="flex gap-2 pt-2">
                                                        <Button className="flex-1" size="sm">
                                                            <ShoppingCart className="mr-1 h-4 w-4 sm:mr-2" />
                                                            <span className="xs:inline hidden">Add to cart</span>
                                                            <span className="xs:hidden">Add</span>
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="bg-transparent px-2 sm:px-3">
                                                            <Heart className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}