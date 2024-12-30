"use client"
import React, { useContext, useState } from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Search, Menu as MenuIcon, X, TrendingUp, Package, TicketPercent } from "lucide-react";
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { CartContext } from '@/app/cart/context/cartContext';
import Link from 'next/link';


export default function Navbar({ initialMetadata, initialCategories }: any) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const cartContext = useContext(CartContext);

  function handleSearchSubmit(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or default behavior
      const searchValue = e.currentTarget.value;
      window.location.href = `/search?q=${encodeURIComponent(searchValue)}`
    }
  }

  if (!cartContext) {
    throw new Error("CartContext is not available. Ensure CartContextProvider wraps the component tree.");
  }
  
  const {
    cartItems
  } = cartContext;

  return (
    <header className="sticky top-0 z-50 w-full md:bg-white/40 md:backdrop-blur md:supports-[backdrop-filter]:bg-white/20 bg-white/95">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src={initialMetadata.shopIcon} 
              width={35} 
              height={35} 
              alt="Shop logo" 
              className="rounded-full object-cover hover:opacity-90 transition-opacity"
              priority
            />
            <span className="text-lg font-medium hover:text-gray-600 transition-colors cursor-pointer">
              {initialMetadata.shopName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem className='bg-transparent'>
                <NavigationMenuLink 
                  href="/" 
                  className="group bg-transparent inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {/* Products Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="shadow-none bg-transparent">Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[350px] bg-white rounded-md grid-cols-2">
                    <NavigationMenuLink href='/products/all-products' className=' bg-gray-600/5 p-4 rounded-lg items-start justify-end flex flex-col gap-2'>
                      <Package />
                      <h1 className='text-base font-semibold'>Check all products</h1>
                      <p className='text-xs text-gray-500'>See all products, you may find something you like?</p>
                    </NavigationMenuLink>
                    <div className='flex justify-between flex-col'>
                    <li className=' hover:bg-accent/50 rounded-lg p-2 transition-all'>
                        <NavigationMenuLink href="/products/top-products"
                          className="w-full items-center justify-start rounded-md transition-colors">
                          <Badge variant={'secondary'} className='flex items-start justify-start w-fit gap-2 mb-2'>
                            <TrendingUp width={15} height={15} />
                            Top Products</Badge>
                          <p className="text-xs text-gray-500 line-clamp-3">Check what other people been looking for lately</p>
                      </NavigationMenuLink>
                      </li>
                    <li className='hover:bg-accent/50 rounded-lg p-2 transition-all'>
                      <NavigationMenuLink href="/products/special-offers" className=" w-full items-center justify-start rounded-md hover:bg-accent transition-colors">
                          <Badge variant={"secondary"} className='flex items-start justify-start w-fit gap-2 mb-2'>
                          <TicketPercent width={15} height={15} />
                            Special Offers</Badge>
                          <p className="text-xs text-gray-500 line-clamp-3">Check Our time-limited offers, and discounts</p>
                      </NavigationMenuLink>
                    </li>
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Categories Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="shadow-none bg-transparent">Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white rounded-md">
                    {initialCategories.map((category:any,index:number) => (
                      <li key={category.id} className={`${index % 2 == 0? "border-r" : ""}`}>
                        <NavigationMenuLink
                          href={`/categories/${category.id}?category-name=${category.name}`}
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-0"
                        >
                          <div className="text-sm font-medium flex items-center justify-between">
                            <div className="space-y-1">
                              <Badge variant={"secondary"} className=''>{category.name}</Badge>
                              <p className="text-xs text-gray-500 line-clamp-3">{category.description}</p>
                            </div>
                            <Badge className="rounded-full ml-2">
                              {category._count.product}
                            </Badge>
                          </div>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

           {/* Action Buttons */}
           <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-accent transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant={"ghost"} className="hover:bg-accent transition-colors relative">
              <Link href={"/cart"}>
              <ShoppingCart className='w-5 h-5' />
              {cartItems.length > 0 && <div className='absolute top-0 right-0 rounded-full bg-red-700 text-sm text-white px-1'> {cartItems.length} </div>}
              </Link>
            </Button>
            
            {session?.user ? (
              <Link href={`/user-record?client-id=${session.user.id}`}>
              <Image
                src={session.user.image ?? "/default-avatar.png"}
                alt={session.user.name ?? "User"}
                width={32}
                height={32}
                className="rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              />
              </Link>
            ) : (
                <Button
                  onClick={() => signIn("google")}
                  className="hidden md:inline-flex hover:opacity-90 transition-opacity">Sign In</Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t py-2 px-4 bg-white/95 backdrop-blur">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                className="w-full pl-10 pr-4 shadow-none" 
                placeholder="Search products..."
                type="search"
                onKeyDown={(e) => handleSearchSubmit(e)}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-x-0 h-screen top-[65px] bottom-0 bg-white/95 backdrop-blur md:hidden">
            <nav className="container h-full overflow-y-auto pb-24 pt-2">
              <div className="space-y-4">
                <a href="/" className="flex items-center gap-2 rounded-md p-3 hover:bg-accent transition-colors">
                  <Home className="h-5 w-5" />
                  Home
                </a>
                
                <div className="space-y-2 p-2">
                  <Badge className="px-3 text-sm font-semibold">Products</Badge>
                  <a href="/products/all-products" className="flex items-center gap-2 rounded-md p-3 hover:bg-accent transition-colors">
                    <Package className="h-4 w-4" />
                    All Products
                  </a>
                  <a href="/products/top-products" className="flex items-center gap-2 rounded-md p-3 hover:bg-accent transition-colors">
                    <TrendingUp className="h-4 w-4" />
                    Top Products
                  </a>
                  <a href="/products/special-offers" className="flex items-center gap-2 rounded-md p-3 hover:bg-accent transition-colors">
                    <TicketPercent className="h-4 w-4" />
                    Special Offers
                  </a>
                </div>
                
                <div className="space-y-2 p-2">
                  <Badge className="px-3 text-sm font-semibold">Categories</Badge>
                  {initialCategories.map((category:any,index:number) => (
                    <div key={category.id}>
                      <a 
                      href={`/categories/${category.id}?category-name=${category.name}`}
                      className="flex items-center justify-between rounded-md p-3 hover:bg-accent transition-colors"
                    >
                      <div className="space-y-1">
                        <span>{category.name}</span>
                        <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full ml-2">
                        {category._count.product}
                      </Badge>
                      </a>
                      {initialCategories.length - 1 !== index && <div className='px-12'>
                      <Separator />
                      </div>}
                    </div>
                  ))}
                </div>
                
                {!session?.user && (
                  <div className='p-2'>
                    <Button className="w-full hover:opacity-90 transition-opacity">Sign In</Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}