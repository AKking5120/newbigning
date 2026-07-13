# Navbar Integration Patch for Wishlist

## Current Status
- ✅ Imports added (useWishlistStore, WishlistDrawer)
- ✅ wishlistOpen state added
- ⏳ Missing: wishlistItems extraction from store
- ⏳ Missing: Heart button onClick handler
- ⏳ Missing: WishlistDrawer component rendering

## Exact Changes Needed

### Change 1: Add wishlistItems to stores hook
**Location:** Line ~48, in Navbar() function

**Find this:**
```typescript
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();

  useEffect(() => {
```

**Add this line between them:**
```typescript
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
```

---

### Change 2: Update Heart button in Icons section
**Location:** Around line ~230, in the Icons `<div>`

**Find this:**
```tsx
            <button className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1 relative">
              <Heart className="w-5 h-5" />
            </button>
```

**Replace with:**
```tsx
            <button 
              onClick={() => setWishlistOpen(true)}
              className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1 relative"
              aria-label={`Wishlist, ${wishlistItems.length} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                </span>
              )}
            </button>
```

---

### Change 3: Add WishlistDrawer component at end
**Location:** Just before closing `</header>` tag, after Mobile Nav section (around line ~400)

**Find this:**
```tsx
      {/* Mobile Nav */}
      <AnimatePresence>
        ...mobile nav code...
      </AnimatePresence>
    </header>
  );
}
```

**Add WishlistDrawer before `</header>`:**
```tsx
      {/* Mobile Nav */}
      <AnimatePresence>
        ...mobile nav code...
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </header>
  );
}
```

---

## Summary
3 small changes:
1. One line to extract wishlistItems 
2. Replace existing heart button (9 lines)
3. Add WishlistDrawer component (2 lines)

Total: ~13 lines changed/added
